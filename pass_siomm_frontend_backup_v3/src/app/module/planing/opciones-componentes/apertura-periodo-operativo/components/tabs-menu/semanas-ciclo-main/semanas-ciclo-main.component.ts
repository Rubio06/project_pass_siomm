import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DATOS_COLUMNA_SEMANA_CICLO_MINADO, EstructuraDatos, TH_SEMANA_CICLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'


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

    datosColumna = signal<EstructuraDatos[]>(DATOS_COLUMNA_SEMANA_CICLO_MINADO)

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

        //     effect(() => {
        //     const data = this.planingService.dataRoutes();
        //     const savedData = this.planingCompartido.getSemanaCiclo();

        //     if (!this.loaded && data) {
        //         // Prioriza los datos guardados en el servicio
        //         const semanasArray = Array.isArray(savedData) && savedData.length
        //             ? savedData
        //             : Array.isArray(data.data?.semana_ciclo)
        //                 ? data.data.semana_ciclo
        //                 : [];

        //         this.loadSemanas(semanasArray);

        //         // Guardar inmediatamente en el servicio
        //         this.guardarCambios();

        //         // Patch del resto del formulario si es necesario
        //         this.myForm.patchValue(data);

        //         this.loaded = true;
        //     }
        // });


    constructor() {

        /**
         * Carga inicial / recarga si cambian dataRoutes
         * 🔥 YA NO USA SETTIMEOUT
         * 🔥 NO SE DISPARA EN LOOP
         */
        effect(() => {
            const data = this.planingService.dataRoutes();

            // Solo carga cuando dataRoutes viene del backend
            if (!this.semanas.length) {
                const semanas = data?.data?.semana_ciclo || [];
                this.loadSemanas(semanas);
                this.myForm.patchValue(data);
            }
        });

        /**
         * Manejo de bloqueo centralizado
         */
        effect(() => {
            const bloqueado = this.planingService.bloqueoForm();

            if (bloqueado) this.myForm.disable();
            else this.myForm.enable();
        });

        effect(() => {
            if (!this.planingService.bloqueoForm()) {
                this.semanas.controls.forEach(control => control.enable());
            } else {
                this.semanas.controls.forEach(control => control.disable());
            }
        });
    }



    // ===============================
    //   METODOS CENTRALIZADOS
    // ===============================

    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }


    loadSemanas(data: any[]) {
        this.semanas.clear();

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

    eliminarFila(data: any) {

        console.log("el numero es ",  data.value)
        // const codigo = this.semanas.removeAt(index);
        // this.alertaEliminarFila(codigo)

        // FormUtils.alertaEliminarFila(data);

        // console.log(codigo)

    }




    ngOnInit() {
        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();

            this.planingCompartido.setSemanaCiclo(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }

}
