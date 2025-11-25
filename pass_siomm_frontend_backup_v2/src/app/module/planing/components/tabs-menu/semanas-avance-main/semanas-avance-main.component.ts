import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColumnaTabla, MaeSemanaAvance, TABLA_DATOS_SEMANAS_AVANCES } from '../../../interface/aper-per-oper.interface';
import { PlanningService } from '../../../services/planning.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import { FormUtils } from 'src/app/utils/form-utils';

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
	formUtils =  FormUtils;

    private semanasAvanceMainService = inject(SemanasAvanceMainService);
    message = signal<string>('');
    loading = signal(false);

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
        effect(() => {
            const data = this.planingService.dataRoutes()?.data?.semana_avance;
            if (!data) return;

            this.loading.set(true);
            this.message.set('');

            setTimeout(() => {
                this.obtenerDatos(data);
                this.loading.set(false);
            }, 500);

        });
    }

    obtenerDatos(data: MaeSemanaAvance[]) {

        const grupos = data.map(item => {
            return this.fb.group({
                num_semana: [Number(item.num_semana)],
                fec_ini: [FormUtils.formatDate(item.fec_ini)],
                fec_fin: [FormUtils.formatDate(item.fec_fin)],
                desc_semana: [item.desc_semana]
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
            const nuevaSemana = this.crearFila(1);
            this.semanas.push(nuevaSemana);
            return;
        }

        const ultimaFila = this.semanas.at(this.semanas.length - 1) as FormGroup;
        const ultimoNumSemana = ultimaFila.get('num_semana')?.value || 0;
        const siguienteCorrelativo = Number(ultimoNumSemana) + 1;
        const nuevaSemana = this.crearFila(siguienteCorrelativo);

        this.semanas.push(nuevaSemana);
    }

    private crearFila(numSemana: number): FormGroup {
        return this.fb.group({
            num_semana: [numSemana, [Validators.required]],
            fec_ini: ['', [Validators.required]],
            fec_fin: ['', [Validators.required]],
            desc_semana: ['', [Validators.required]],
        });
    }


    onSubmit() {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            alert("Debe enviar todos los datos")
            return;
        }
        const lastRow = this.semanas.at(this.semanas.length - 1).value;

        const payload = {
            num_semana: Number(lastRow.num_semana),
            fec_ini: this.formUtils.convertToISO(lastRow.fec_ini),
            fec_fin: this.formUtils.convertToISO(lastRow.fec_fin),
            desc_semana: lastRow.desc_semana,
        };

        this.semanasAvanceMainService.saveData(payload).subscribe({
            next: (data: any) => {
                console.log('Datos guardados:', data);
            },
            error: (error) => {
                console.error('Error al guardar num_semana:', error);
            }
        });
    }

}
