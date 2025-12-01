import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { FormUtils } from 'src/app/utils/form-utils';

import { ColumnaTabla, MaeSemanaAvance, MaeSemanaCiclo, TABLA_DATOS_SEMANAS_AVANCES } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { SemanasAvanceMainService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-semanas-avance-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './semanas-avance-main.component.html',
    styleUrl: './semanas-avance-main.component.css',
})
export class SemanasAvanceMainComponent {

    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_AVANCES);
    private fb = inject(FormBuilder);
    titulo = this.columnas().map(titulo => titulo.titulo);
    private planingService = inject(PlanningService);
    formUtils = FormUtils;

    periodoServicio = inject(SemanasAvanceMainService);

    private semanasAvanceMainService = inject(SemanasAvanceMainService);
    message = signal<string>('');
    loading = signal(false);
    bloqueo = inject(PlanningService).bloqueo;

    datosColumna = signal<any[]>([
        { type: 'number', name: 'num_semana' },
        { type: 'text', name: 'fec_ini' },
        { type: 'text', name: 'fec_fin' },
        { type: 'text', name: 'desc_semana' },
    ])

    myForm: FormGroup = this.fb.group({
        semanas: this.fb.array([])
    });


    constructor() {
        this.regarcarData();
    }

    regarcarData() {
        effect(() => {
            const data = this.planingService.dataRoutes()?.data?.semana_avance;


            console.log(data)

            if (!data) return;

            this.loading.set(true);
            this.message.set('');

            setTimeout(() => {
                this.obtenerDatos(data);
                this.loading.set(false);
            }, 500);

        });

        effect(() => {
            const data = this.planingService.dataRoutes();

            if (data === null || data?.length === 0) {
                this.resetearFormulario();   // 🔥 Se ejecuta en TODOS los componentes
                return;
            }

            // si hay data, llenas tus formularios
            this.myForm.patchValue(data);
        });


    }

    resetearFormulario() {
        this.myForm.reset();

        // Vaciar columnas
    }

    obtenerDatos(data: MaeSemanaAvance[]) {
        const grupos = data.map(item => {
            return this.fb.group({
                num_semana: [{ value: Number(item.num_semana), disabled: true }],
                fec_ini: [{ value: FormUtils.formatDate(item.fec_ini), disabled: true }],
                fec_fin: [{ value: FormUtils.formatDate(item.fec_fin), disabled: true }],
                desc_semana: [{ value: item.desc_semana, disabled: true }]
            });
        });

        const nuevoFormArray = this.fb.array(grupos);
        this.myForm.setControl('semanas', nuevoFormArray);
    }

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    agregarFilas() {
        if (this.semanas.length === 0) {
            this.semanas.push(this.crearFila(1));
            return;
        }

        const ultimaFila = this.semanas.at(this.semanas.length - 1) as FormGroup;

        if (ultimaFila.invalid) {
            ultimaFila.markAllAsTouched();
            console.warn("Debe completar la fila actual antes de agregar otra.");
            return;
        }

        const ultimoNumSemana = ultimaFila.get('num_semana')?.value || 0;
        const siguienteCorrelativo = Number(ultimoNumSemana) + 1;

        this.semanas.push(this.crearFila(siguienteCorrelativo));
    }

    private crearFila(numSemana: number): FormGroup {
        this.planingService.setBloqueo(false);

        const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/\d{4}$/;

        return this.fb.group({
            num_semana: [numSemana, [Validators.required, Validators.min(1), Validators.max(7)]],
            fec_ini: ['', [Validators.required, Validators.pattern(regexFecha)]],
            fec_fin: ['', [Validators.required, Validators.pattern(regexFecha)]],
            desc_semana: ['', [Validators.required]],
        });

    }

    onSubmit() {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            alert("Debe enviar todos los datos");
            return;
        }

        const mes = this.periodoServicio.mes() ?? '';
        const anio = this.periodoServicio.anio() ?? '';

        const lastRow = this.semanas.at(this.semanas.length - 1).value;

        const payload = {
            cod_empresa: "03",
            cod_empresa_unidad: "01",
            cie_ano: anio,
            cie_per: mes,
            num_semana: Number(lastRow.num_semana),
            fec_ini: this.formUtils.convertToISO(lastRow.fec_ini),
            fec_fin: this.formUtils.convertToISO(lastRow.fec_fin),
            desc_semana: lastRow.desc_semana,
            usu_creo: 'sa',
            fec_creo: new Date(),
            usu_modi: 'se',
            fec_modi: new Date()
        };

        this.semanasAvanceMainService.saveDataSemanaCiclo(payload).subscribe({
            next: (data) => {
                console.log(data)
                this.cargaDatos(mes, anio);
            },
            error: (error) => {
                console.error('Error al guardar num_semana:', error);
            }
        });
    }

    cargaDatos(mes: string, anio: string) {
        this.planingService.getDate(mes, anio).subscribe(resp => {
            this.planingService.setData(resp);
        });
    }


    eliminarFila(index: number) {
        const fila = this.semanas.at(index).getRawValue();
        console.log("Fila que se eliminará:", fila);
        this.semanas.removeAt(index);
        console.log("Fila eliminada correctamente");
    }
}
