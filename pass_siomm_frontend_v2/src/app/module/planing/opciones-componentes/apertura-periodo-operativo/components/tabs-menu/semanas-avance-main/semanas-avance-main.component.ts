import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';

import { DATOS_SEMANA_AVANCE, EstructuraDatos, MaeSemanaAvance, TH_SEMANA_AVANCE, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';

@Component({
    selector: 'app-semanas-avance-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './semanas-avance-main.component.html',
    styleUrl: './semanas-avance-main.component.css',
})
export class SemanasAvanceMainComponent {
    columnas = signal<thTitulos[]>(TH_SEMANA_AVANCE);
    titulo = this.columnas().map(titulo => titulo.titulo);

    planingCompartido = inject(PlaningCompartidoService);

    formUtils = FormUtils;

    semanasAvanceMainService = inject(SemanasAvanceMainService);

    fb = inject(FormBuilder);
    planingService = inject(PlanningService);

    private cd = inject(ChangeDetectorRef);

    datosColumna = signal<EstructuraDatos[]>(DATOS_SEMANA_AVANCE)

    myForm = this.fb.group({
        semanas: this.fb.array([]),
    });

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    loading = signal(false);
    hoy = new Date();

    bloqueBotonNuevo = signal<boolean>(true);


    varibale: boolean = true;

    constructor() {

        effect(() => {
            const data = this.planingCompartido.dataRoutes();

            const semanas = data?.data?.semana_avance || [];

            this.loadSemanas(semanas);

            this.myForm.patchValue(data || {}, { emitEvent: false });
            // this.cd.detectChanges();

        });
    }

    loadSemanas(data: MaeSemanaAvance[]) {
        this.semanas.clear();

        data.forEach((item) => {
            this.semanas.push(
                this.fb.group({
                    cie_ano: [{ value: item.cie_ano, disabled: true }],
                    cie_per: [{ value: item.cie_per, disabled: true }],
                    num_semana: [{ value: item.num_semana, disabled: true }],
                    fec_ini: [this.formUtils.formatDate(item.fec_ini)],
                    fec_fin: [this.formUtils.formatDate(item.fec_fin)],
                    desc_semana: [item.desc_semana],
                    accion: [],
                    esNuevo: [false]
                })
            );
        });
    }

    agregarFilas() {

        const ultima = this.semanas.length
            ? this.semanas.at(this.semanas.length - 1)?.getRawValue()
            : null;

        const origen = ultima || {
            cie_ano: new Date().getFullYear().toString(),
            cie_per: (new Date().getMonth() + 1).toString().padStart(2, '0'),
            num_semana: 1
        };

        const numSemanaNueva = ultima ? ultima.num_semana + 1 : origen.num_semana;

        const nuevoGrupo = this.fb.group({
            cie_ano: [origen.cie_ano, Validators.required],
            cie_per: [origen.cie_per, Validators.required],
            num_semana: [numSemanaNueva, [
                Validators.required,
                Validators.min(1),
                Validators.max(7),
                Validators.pattern(/^[1-7]$/)
            ]],
            fec_ini: ['', Validators.required],
            fec_fin: ['', Validators.required],
            desc_semana: ['', Validators.required],
            esNuevo: [true]
        });

        this.semanas.push(nuevoGrupo);

        const filaNueva = this.semanas.at(this.semanas.length - 1);
        this.enviarFilaNueva(filaNueva!);

    }


    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar() &&
        !row.get('esNuevo')?.value;
    }



    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;

        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            this.cd.detectChanges();
            return;
        }


        const confirmado = await this.formUtils.confirmarEliminacion();
        if (!confirmado) {
            this.formUtils.alertaNoEliminado();
            return;
        }

        const payload = {
            cie_ano: semana.cie_ano,
            cie_per: semana.cie_per,
            num_semana: semana.num_semana,
            fec_ini: this.formUtils.convertToISO(semana.fec_ini),
            fec_fin: this.formUtils.convertToISO(semana.fec_fin),
            desc_semana: semana.desc_semana
        };

        // 👉 Confirmación usando tu utilitario


        // console.log("datos eliminados correctamente " + payload)

        this.semanasAvanceMainService.eliminarSemanaAvance(payload).subscribe({
            next: (res: any) => {
                if (res.success) {

                    this.formUtils.alertaEliminado(res.message);
                    this.semanas.removeAt(index);

                    this.cd.detectChanges();              // opcional

                } else {
                    this.formUtils.alertaEliminado(res.message);

                }
            },
            error: (err) => this.formUtils.mensajeError(err.message)
        });

        this.semanas.removeAt(index);

        this.cd.detectChanges();
    }

    /**
     * ENVIAR SOLO LA ÚLTIMA FILA NUEVA
     */

    enviarFilaNueva(row: AbstractControl) {
        this.myForm.valueChanges.subscribe(val => {
            const payload = row.getRawValue(); // objeto plano
            this.planingCompartido.setSemanaAvance(payload, 'semana_avance');
        });
    }


    ngOnInit() {
        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();
            console.log(filas)

            this.planingCompartido.setSemanaAvance(filas, 'semana_avance');
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }
}
