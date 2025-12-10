import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';

@Component({
    selector: 'app-canchas',
    imports: [ReactiveFormsModule],
    templateUrl: './canchas.component.html',
    styleUrl: './canchas.component.css',
})
export class CanchasComponent {
    private planingService = inject(PlanningService);
    private fb = inject(FormBuilder);
    rutas = this.planingService.data;

    form: FormGroup;
    bloqueo = inject(PlanningService).bloqueo;

    constructor() {
        this.form = this.fb.group({
            val_tms: ['0.000'],
            val_ag: ['0.000'],
            val_cu: ['0.000'],
            val_pb: ['0.000'],
            val_zn: ['0.000'],
            val_vpt: ['0.000']
        });

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
            const data = this.planingService.data();

            if (data === null || data?.length === 0) {
                this.resetearFormulario();   // 🔥 Se ejecuta en TODOS los componentes
                return;
            }

            // si hay data, llenas tus formularios
            this.form.patchValue(data);
        });

        effect(()=> {
            this.bloqueoFormulario();
        })
    }

    bloqueoFormulario() {
        const bloqueado = this.planingService.bloqueoForm();
        console.log(bloqueado)
        if (bloqueado) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }


    resetearFormulario() {
        this.form.reset({
            val_tms: ['0.000'],
            val_ag: ['0.000'],
            val_cu: ['0.000'],
            val_pb: ['0.000'],
            val_zn: ['0.000'],
            val_vpt: ['0.000']
        })

    }
}
