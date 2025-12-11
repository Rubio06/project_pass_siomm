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

    utils = FormUtils;

    semanasAvanceMainService = inject(SemanasAvanceMainService);

    fb = inject(FormBuilder);
    planingService = inject(PlanningService);

    private cd = inject(ChangeDetectorRef);

    // // Configuración de los datos de la columna
    datosColumna = signal<EstructuraDatos[]>(DATOS_SEMANA_AVANCE)

    // ===============================
    //   FORMULARIO PRINCIPAL
    // ===============================
    myForm = this.fb.group({
        semanas: this.fb.array([]),
    });

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    // ===============================
    //   SIGNALS
    // ===============================
    loading = signal(false);


    constructor() {

        /**
         * 📌 CARGA INICIAL (solo 1 vez)
         * - No repite llamadas
         * - No usa setTimeout
         * - No entra en bucles
         */
        // effect(() => {
        //     const data = this.planingService.dataRoutes();

        //     if (!data) return;

        //     if (this.semanas.length === 0) {
        //         const semanasBackend = data.data?.semana_avance ?? [];
        //         this.semanas.clear();

        //         this.loadSemanas(semanasBackend);

        //         // Si tienes otros datos que cargar del backend en el formulario, aquí van
        //         this.myForm.patchValue(data);
        //     }
        // });

        effect(() => {
            const data = this.planingService.dataRoutes();
            const semanas = data?.data?.semana_avance || [];

            setTimeout(() => {
                this.loadSemanas(semanas);           // refresca FormArray
                this.myForm.patchValue(data || {});   // actualiza el formulario
                this.cd.detectChanges();              // opcional
            }, 0);
        });

        /**
         * 📌 BLOQUEO CENTRALIZADO (habilitar / deshabilitar formulario)
         */
        effect(() => {
            const bloqueado = this.planingService.bloqueoForm();
            bloqueado ? this.myForm.disable() : this.myForm.enable();
        });

        effect(() => {
            if (!this.planingService.bloqueoForm()) {
                this.semanas.controls.forEach(control => control.enable());
            } else {
                this.semanas.controls.forEach(control => control.disable());
            }
        });

    }




    // =====================================================
    //   MÉTODOS PARA MANEJAR SEMANAS
    // =====================================================

    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }

    /**
     * CARGA DESDE BACKEND
     */
    loadSemanas(data: MaeSemanaAvance[]) {
        this.semanas.clear();

        data.forEach((item) => {
            this.semanas.push(
                this.fb.group({
                    num_semana: [{ value: item.num_semana, disabled: true }],
                    fec_ini: [{ value: FormUtils.formatDate(item.fec_ini), disabled: true }],
                    fec_fin: [{ value: FormUtils.formatDate(item.fec_fin), disabled: true }],
                    desc_semana: [{ value: item.desc_semana, disabled: true }],
                    accion: [{ value: '', disabled: true }]

                })
            );
        });
    }

    /**
     * AÑADIR FILA NUEVA (EDITABLE)
     */
    agregarFilas() {

        this.semanas.push(
            this.fb.group({
                num_semana: ['', Validators.required],
                fec_ini: ['', Validators.required],
                fec_fin: ['', Validators.required],
                desc_semana: ['', Validators.required],
            })
        );
    }

    /**
     * ELIMINAR FILA
     */



    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;

        const payload = {
            num_semana: semana.num_semana,
            fec_ini: this.utils.convertToISO(semana.fec_ini),
            fec_fin: this.utils.convertToISO(semana.fec_fin),
            desc_semana: semana.desc_semana
        };

        // 👉 Confirmación usando tu utilitario
        const confirmado = await this.utils.confirmarEliminacion();
        if (!confirmado) {
            this.utils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.eliminarSemanaAvance(payload).subscribe({
            next: (res: any) => {
                if (res.success) {

                    // 👉 Elimina del FormArray

                    // 👉 Muestra alerta de éxito desde el utilitario
                    this.utils.alertaEliminado(res.message);
                    this.semanas.removeAt(index);

                    this.cd.detectChanges();              // opcional

                } else {
                    this.utils.alertaEliminado(res.message);

                }
            },
            error: (err) => this.utils.mensajeError(err.message)
        });
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
