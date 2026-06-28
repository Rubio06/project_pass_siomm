import { Component, effect, inject, OnInit } from '@angular/core';
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
export class CanchasComponent implements OnInit {
    private planingService = inject(PlanningService);
    planingCompartido = inject(PlaningCompartidoService);
    private fb = inject(FormBuilder);
    
    formUtils = FormUtils;

    form: FormGroup = this.fb.group({
        val_tms: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_ag: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_cu: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_pb: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_zn: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_vpt: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]]
    });

    constructor() {
        // Efecto para cargar datos desde el estado compartido global
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

        // Efecto activo para escuchar la orden de resetear el periodo
        effect(() => {
            if (this.planingCompartido.resetPeriodo()) return;
            
            this.resetearFormulario();
            this.planingCompartido.clearResetPeriodo();
        });
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(() => {
            const filas = this.form.getRawValue();

            // Reemplazar vacíos, null o undefined por '0.000' de manera preventiva
            Object.keys(filas).forEach(key => {
                if (filas[key] === '' || filas[key] === null || filas[key] === undefined) {
                    filas[key] = '0.000';
                }
            });

            // Notificar los cambios en tiempo real al estado central
            this.planingCompartido.setCanchas(filas, 'factor_operativo');
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
        });
    }

    bloquearCampo(): boolean {
        return this.planingCompartido.bloqueoFormEditar();
    }
}