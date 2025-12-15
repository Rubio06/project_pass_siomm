import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DATOS_COLUMNA_SEMANA_CICLO_MINADO, EstructuraDatos, TH_SEMANA_CICLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';


@Component({
    selector: 'app-semanas-ciclo-main',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
    templateUrl: './semanas-ciclo-main.component.html',
    styleUrl: './semanas-ciclo-main.component.css',
})
export class SemanasCicloMainComponent {

    fb = inject(FormBuilder);
    planingService = inject(PlanningService);

    myForm = this.fb.group({
        semanas: this.fb.array([])
    });
    columnas = signal<thTitulos[]>(TH_SEMANA_CICLO_MINADO);
    titulo = this.columnas().map(titulo => titulo.titulo);

    loading = signal(false);

    planingCompartido = inject(PlaningCompartido);
    semanasAvanceMainService = inject(SemanasAvanceMainService);

    private utils = FormUtils;

    datosColumna = signal<EstructuraDatos[]>(DATOS_COLUMNA_SEMANA_CICLO_MINADO)

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    loaded: boolean = true;


    private cd = inject(ChangeDetectorRef);

    constructor() {

        /**
         * Carga inicial / recarga si cambian dataRoutes
         * 🔥 YA NO USA SETTIMEOUT
         * 🔥 NO SE DISPARA EN LOOP
         */

        // effect(() => {
        //     const data = this.planingService.dataRoutes();
        //     const semanas = data?.data?.semana_ciclo || [];

        //     setTimeout(() => {
        //         this.loadSemanas(semanas);           // refresca FormArray
        //         this.myForm.patchValue(data || {});   // actualiza el formulario
        //         this.cd.detectChanges();              // opcional
        //     }, 0);
        // });


        effect(() => {
            const data = this.planingService.dataRoutes();
            const semanas = data?.data?.semana_ciclo || [];

            this.loadSemanas(semanas);
            this.myForm.patchValue(data || {}, { emitEvent: false });
            this.cd.detectChanges();              // opcional

        });

        /**
         * Manejo de bloqueo centralizado
         */
        // effect(() => {
        //     const bloqueado = this.planingService.bloqueoForm();

        //     if (bloqueado) this.myForm.disable();
        //     else this.myForm.enable();
        // });

        // effect(() => {
        //     if (!this.planingService.bloqueoForm()) {
        //         this.semanas.controls.forEach(control => control.enable());
        //     } else {
        //         this.semanas.controls.forEach(control => control.disable());
        //     }
        // });


        effect(() => {
            const bloqueado = this.planingCompartido.getBloqueoFormEditar()();

            bloqueado
                ? this.myForm.disable({ emitEvent: false })
                : this.myForm.enable({ emitEvent: false });
        });

        // effect(() => {
        //     if (!this.planingCompartido.getBloqueoFormEditar()) {
        //         this.semanas.controls.forEach(control => control.enable());
        //     } else {
        //         this.semanas.controls.forEach(control => control.disable());
        //     }
        // });

    }



    // ===============================
    //   METODOS CENTRALIZADOS
    // ===============================

    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }


    loadSemanas(data: any[]) {
        this.semanas.clear();  // limpia todo


        const semanasArray = Array.isArray(data) ? data : [];

        semanasArray.forEach(item => {
            this.semanas.push(
                this.fb.group({
                    num_semana: [{ value: item.num_semana || '', disabled: true }],
                    fec_ini: [{ value: FormUtils.formatDate(item.fec_ini) || '', disabled: true }],
                    fec_fin: [{ value: FormUtils.formatDate(item.fec_fin) || '', disabled: true }],
                    desc_semana: [{ value: item.desc_semana || '', disabled: true }],
                    accion: [{ value: item.accion || '', disabled: true }]
                })
            );
        });
    }

    guardarCambios() {
        const filas = this.semanas.getRawValue();
        this.planingCompartido.setSemanaCiclo(filas);
    }

    agregarFilas() {
        // const correlativo = this.semanas.length + 1;
        this.semanas.push(
            this.fb.group({
                num_semana: ['', Validators.required],
                fec_ini: ['', Validators.required],
                fec_fin: ['', Validators.required],
                desc_semana: ['', Validators.required],
                accion: [{ value: '', disabled: true }]

            })
        );
    }

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

        this.semanasAvanceMainService.eliminarCiclo(payload).subscribe({
            next: (res: any) => {
                if (res.success) {

                    // 👉 Elimina del FormArray

                    // 👉 Muestra alerta de éxito desde el utilitario
                    this.utils.alertaEliminado(res.message);
                    this.semanas.removeAt(index);
                    this.cd.detectChanges();              // opcional

                    this.planingService.setBloqueoForm(false);


                } else {
                    this.utils.alertaEliminado(res.message);

                }
            },
            error: (err) => this.utils.mensajeError(err.message)
        });
    }



    ngOnInit() {

        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();

            this.planingCompartido.setSemanaCiclo(filas);
        });
    }

    hasPendingChanges(): boolean {
        console.log("entra al metodo ")
        return this.semanasAvanceMainService.getCambios(); // revisa los cambios pendientes
    }



}
