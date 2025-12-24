import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-canchas',
    imports: [ReactiveFormsModule],
    templateUrl: './canchas.component.html',
    styleUrl: './canchas.component.css',
})
export class CanchasComponent {
    private planingService = inject(PlanningService);
    planingCompartido = inject(PlaningCompartidoService);
    private fb = inject(FormBuilder);
    rutas = this.planingCompartido.data;
    formUtils = FormUtils;

    // bloqueo = inject(PlaningCompartido).bloqueo;

    form: FormGroup = this.fb.group({
        val_tms: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_ag: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_cu: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_pb: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_zn: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_vpt: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]]
    });

    constructor() {

        effect(() => {
            const response = this.rutas();

            if (response?.data?.canchas?.length) {
                const canchas = response.data.canchas[0];
                this.form.patchValue({
                    val_tms: canchas.val_tms,
                    val_ag: canchas.val_ag,
                    val_cu: canchas.val_cu,
                    val_pb: canchas.val_pb,
                    val_zn: canchas.val_zn,
                    val_vpt: canchas.val_vpt

                });
            }
        });

        effect(() => {
            const data = this.planingCompartido.dataRoutes();

            if (data === null || data?.length === 0) {
                this.resetearFormulario();   // 🔥 Se ejecuta en TODOS los componentes
                return;
            }

            // si hay data, llenas tus formularios
            this.form.patchValue(data);
        });

        effect(() => {
            if (!this.form) return;

            if (this.planingCompartido.bloqueoFormGeneral()) {
                this.form.disable({ emitEvent: false });
            } else {
                this.form.enable({ emitEvent: false });
            }
        });

        effect(() => {
            this.planingCompartido.resetAllForms();
            this.resetearFormulario();
        });

        //BOTON VISUALIZAR
        effect(() => {
            const signal = this.planingCompartido.visualizarForms();
            if (signal > 0) {
                this.blockForm();
            }
        });
    }

    blockForm() {
        this.form.disable();
    }


    resetearFormulario() {
        this.form.reset({
            val_tms: '0.000',
            val_ag: '0.000',
            val_cu: '0.000',
            val_pb: '0.000',
            val_zn: '0.000',
            val_vpt: '0.000'
        })

    }

    ngOnInit() {
        this.form.valueChanges.subscribe(val => {
            const filas = this.form.getRawValue();

            this.planingCompartido.setCanchas(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }


}
