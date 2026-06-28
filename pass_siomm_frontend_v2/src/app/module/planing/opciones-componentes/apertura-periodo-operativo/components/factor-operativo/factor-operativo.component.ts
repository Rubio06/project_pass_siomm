import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlanningService } from '../../services/planning.service';
import { CommonModule } from '@angular/common';
import { PlaningCompartidoService } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';

interface fieldName {
    name: string;
    type: string;
    label: string;
}

@Component({
    selector: 'app-factor-operativo',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './factor-operativo.component.html',
    styleUrl: './factor-operativo.component.css',
})
export class FactorOperativoComonent {
    public planingService = inject(PlanningService);
    planingCompartido = inject(PlaningCompartidoService);
    private fb = inject(FormBuilder);
    // bloqueo = inject(PlaningCompartido).bloqueo;
    rutas = this.planingCompartido.dataRoutes;
    formUtils = FormUtils;
    // form: FormGroup;
    semanaAvance = inject(SemanasAvanceMainService);


    fieldInputs = signal<fieldName[]>([
        { name: "fac_denmin", type: "number", label: "D. Mineral:" },
        { name: "fac_dendes", type: "number", label: "D. Desmonte:" },
        { name: "fac_vptmin", type: "number", label: "VPT Mínimo:" },
        { name: "fac_dialab", type: "number", label: "D. Laborales:" },
        { name: "fac_tarhor", type: "number", label: "T./8 Horas" },
        { name: "fac_porcum", type: "number", label: "%Cump.(+/-)" },
        { name: "fac_porhum", type: "number", label: "%Humedad" },
        { name: "fac_tms_dif", type: "number", label: "TMS Dif (+/-)" },
    ]);


    form: FormGroup = this.fb.group({
        // cie_ano: ['', Validators.required],
        // cie_per: ['', Validators.required],
        fac_denmin: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_dendes: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_vptmin: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_dialab: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_tarhor: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_porcum: ['0.000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_porhum: ['0.00', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_tms_dif: ['0.00', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    });


    constructor() {
        effect(() => {

            const response = this.planingCompartido.dataRoutes();
            const factor = response.data?.factor?.[0];

            this.form.patchValue({
                // cie_ano: periodo.cie_ano,
                // cie_per: periodo.cie_per,
                fac_denmin: factor?.fac_denmin || '0.000',
                fac_dendes: factor?.fac_dendes || '0.000',
                fac_vptmin: factor?.fac_vptmin || '0.000',
                fac_dialab: factor?.fac_dialab || '0.000',
                fac_tarhor: factor?.fac_tarhor || '0.000',
                fac_porcum: factor?.fac_porcum || '0.000',
                fac_porhum: factor?.fac_porhum || '0.000',
                fac_tms_dif: factor?.fac_tms_dif || '0.000',
            });

        });

 
        // effect(() => {
        //     if (this.planingCompartido.resetPeriodo()) return;
        //     this.resetearFormulario();
        //     this.planingCompartido.clearResetPeriodo();
        // });

        effect(() => {
            if (this.planingCompartido.resetPeriodo()) return;
            this.resetearFormulario();
            this.planingCompartido.clearResetPeriodo();
        });
 
    }

    blockForm() {
        this.form.disable(); // bloquea el formulario para que no se pueda editar
    }

    resetearFormulario() {
        // Aquí reseteas tu formulario reactivo
        this.form.reset({
            fac_denmin: '0.000',
            fac_dendes: '0.000',
            fac_vptmin: '0.000',
            fac_dialab: '0.000',
            fac_tarhor: '0.000',
            fac_porcum: '0.00',
            fac_porhum: '0.00',
            fac_tms_dif: '0.00'
        });
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(val => {
            const filas = this.form.getRawValue();

 

            Object.keys(filas).forEach(key => {
                if (filas[key] === '' || filas[key] === null || filas[key] === undefined) {
                    filas[key] = '0.000';
                }
            });



 
            this.planingCompartido.setFactor(filas, 'factor_operativo');
        });

    }

    bloquearCampo(): boolean {
        return this.planingCompartido.bloqueoFormEditar();
    }
}
