import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { FormUtils } from 'src/app/utils/form-utils';

import { DATOS_SEMANA_AVANCE, EstructuraDatos, MaeSemanaAvance, TH_SEMANA_AVANCE, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

@Component({
    selector: 'app-semanas-avance-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './semanas-avance-main.component.html',
    styleUrl: './semanas-avance-main.component.css',
})
export class SemanasAvanceMainComponent {
    columnas = signal<thTitulos[]>(TH_SEMANA_AVANCE);
    titulo = this.columnas().map(titulo => titulo.titulo);

    planingCompartido = inject(PlaningCompartido);

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

    bloqueoBotonNuevo = signal<boolean>(true);


    constructor() {

        effect(() => {
            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.semana_avance || [];

            this.loadSemanas(semanas);
            this.myForm.patchValue(data || {}, { emitEvent: false });
            this.cd.detectChanges();              // opcional

        });

        effect(() => {
            if (!this.myForm) return;

            if (this.planingCompartido.bloqueoFormGeneral()) {
                this.myForm.disable({ emitEvent: false });
            } else {
                this.myForm.enable({ emitEvent: false });
            }
        });

        ///BOTON NUEVO
        effect(() => {
            const resetSignal = this.planingCompartido.resetAllForms();
            if (resetSignal > 0) {
                this.resetForm();
            }
        });


        ////BOTON VISUALIZAR

        effect(() => {
            const signal = this.planingCompartido.visualizarForms();
            if (signal > 0) {

                console.log(signal)

                this.blockForm();
                this.resetForm();

                // this.resetSelects(); // limpia selects
            }
        });
    }

    blockForm() {
        this.myForm.disable(); // bloquea todos los campos
        // this.filas.forEach(f => f.disable()); // bloquea filas si tienes tabla
    }

    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }

    loadSemanas(data: MaeSemanaAvance[]) {
        this.semanas.clear();

        data.forEach((item) => {
            this.semanas.push(
                this.fb.group({
                    num_semana: [item.num_semana],
                    fec_ini: [FormUtils.formatDate(item.fec_ini)],
                    fec_fin: [FormUtils.formatDate(item.fec_fin)],
                    desc_semana: [item.desc_semana],
                    accion: [],
                    esNuevo: [false]

                })
            );
        });

        this.planingCompartido.notifyFormChanged();

    }


    agregarFilas() {

        if (this.semanas.length >= 1) {
            return;
        }

        this.planingCompartido.setBloqueoFormEditar(false);

        this.semanas.push(
            this.fb.group({
                num_semana: ['', [Validators.required, Validators.min(1), Validators.max(7), Validators.pattern(/^[1-7]$/)]],
                fec_ini: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
                fec_fin: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
                desc_semana: ['', [Validators.required]],
                esNuevo: [true]

            })
        );
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
            num_semana: semana.num_semana,
            fec_ini: this.formUtils.convertToISO(semana.fec_ini),
            fec_fin: this.formUtils.convertToISO(semana.fec_fin),
            desc_semana: semana.desc_semana
        };

        // 👉 Confirmación usando tu utilitario

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

    ngOnInit() {
        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();

            this.planingCompartido.setSemanaAvance(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });


    }
}
