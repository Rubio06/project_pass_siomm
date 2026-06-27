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
    // rutas = this.planingCompartido.data;
    formUtils = FormUtils;

    // bloqueo = inject(PlaningCompartido).bloqueo;

    form: FormGroup = this.fb.group({
        // cie_ano: [''],
        // cie_per: [''],
        val_tms: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_ag: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_cu: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_pb: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_zn: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_vpt: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]]
    });

    constructor() {

        effect(() => {
            const response = this.planingCompartido.dataRoutes();
            const canchas = response.data?.canchas?.[0];

            this.form.patchValue({
                val_tms: canchas?.val_tms || '0.000',
                val_ag: canchas?.val_ag || '0.000',
                val_cu: canchas?.val_cu || '0.000',
                val_pb: canchas?.val_pb || '0.000',
                val_zn: canchas?.val_zn || '0.000',
                val_vpt: canchas?.val_vpt || '0.000'
            });

        });

<<<<<<< HEAD
        // effect(() => {
        //     if (this.planingCompartido.resetPeriodo()) return;
        //     this.resetearFormulario();
        //     this.planingCompartido.clearResetPeriodo();
        // });
=======
        effect(() => {
            if (this.planingCompartido.resetPeriodo()) return;
            this.resetearFormulario();
            this.planingCompartido.clearResetPeriodo();
        });
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
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
        this.form.valueChanges.subscribe(() => {
<<<<<<< HEAD
            // const filas = this.form.getRawValue();


            const filas = this.form.getRawValue();

            Object.keys(filas).forEach(key => {
                if (filas[key] === '' || filas[key] === null || filas[key] === undefined) {
                    filas[key] = '0.000';
                }
            });


=======
            const filas = this.form.getRawValue();

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
            this.planingCompartido.setCanchas(filas, 'factor_operativo');
        });
    }


    bloquearCampo(): boolean {
        return this.planingCompartido.bloqueoFormEditar();
    }

}
