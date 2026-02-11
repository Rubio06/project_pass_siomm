import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchasComponent } from './canchas/canchas.component';
import { PlanningService } from '../../services/planning.service';
import { PlaningCompartidoService } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';



@Component({
    selector: 'app-valores',
    imports: [ReactiveFormsModule, CanchasComponent],
    templateUrl: './valores.component.html',
    styleUrl: './valores.component.css',
})
export class ValoresComponent {
    private planingService = inject(PlanningService);

    planingCompartido = inject(PlaningCompartidoService);
    private fb = inject(FormBuilder);
    rutas = this.planingCompartido.dataRoutes;
    formUtils = FormUtils;


    form!: FormGroup;
    // bloqueo = inject(PlaningCompartido).bloqueo;
    headers = ['Precio', 'Sobredilución', 'Recuperación Budget', 'Factor Conversión'];

    elements = [
        { label: 'Ag (gr)', fields: ['val_pre_ag', 'val_fac_ag', 'val_fac_bud_ag', 'val_con_ag'] },
        { label: 'Cu (%)', fields: ['val_pre_cu', 'val_fac_cu', 'val_fac_bud_cu', 'val_con_cu'] },
        { label: 'Pb (%)', fields: ['val_pre_pb', 'val_fac_pb', 'val_fac_bud_pb', 'val_con_pb'] },
        { label: 'Zn (%)', fields: ['val_pre_zn', 'val_fac_zn', 'val_fac_bud_zn', 'val_con_zn'] },
        { label: 'Au (gr)', fields: ['val_pre_au', 'val_fac_au', 'val_fac_bud_au', 'val_con_au'] },
    ];

    constructor() {

        const controls: any = {};

        // campos dinámicos
        this.elements.forEach(item => {
            item.fields.forEach(field => {
                controls[field] = [
                    { value: '0.000' },
                    [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]
                ];
            });
        });


        // crear el form UNA SOLA VEZ
        this.form = this.fb.group(controls);

        effect(() => {
            const response = this.planingCompartido.dataRoutes();

            if (!response) return;

            const factorOperativo = response.data?.factorOperativo?.[0];
            const factorSobredisolucion = response.data?.factorSobredisolucion?.[0]; // LISTO
            const factorBugetConversion = response.data?.recuperacionBudget?.[0];  //listo

            this.form.patchValue({

                val_fac_ag: factorSobredisolucion?.val_fac_ag || '0.0000',
                val_fac_bud_ag: factorBugetConversion?.val_fac_bud_ag || '0.0000',
                val_con_ag: factorBugetConversion?.val_con_ag || '0.0000',
                val_pre_ag: factorOperativo?.val_pre_ag || '0.0000',

                val_pre_cu: factorOperativo?.val_pre_cu || '0.0000',


                val_fac_cu: factorSobredisolucion?.val_fac_cu || '0.0000',
                val_fac_bud_cu: factorBugetConversion?.val_fac_bud_cu || '0.0000',
                val_con_cu: factorBugetConversion?.val_con_cu || '0.0000',

                val_pre_pb: factorOperativo?.val_pre_pb || '0.0000',
                val_fac_pb: factorSobredisolucion?.val_fac_pb || '0.0000',


                val_fac_bud_pb: factorBugetConversion?.val_fac_bud_pb || '0.0000',
                val_con_pb: factorBugetConversion?.val_con_pb || '0.0000',

                val_pre_zn: factorOperativo?.val_pre_zn || '0.0000',
                val_fac_zn: factorSobredisolucion?.val_fac_zn || '0.0000',
                val_fac_bud_zn: factorBugetConversion?.val_fac_bud_zn || '0.0000',
                val_con_zn: factorBugetConversion?.val_con_zn || '0.0000',

                val_pre_au: factorOperativo?.val_pre_au || '0.0000',
                val_fac_au: factorSobredisolucion?.val_fac_au || '0.0000',
                val_fac_bud_au: factorBugetConversion?.val_fac_bud_au || '0.0000',
                val_con_au: factorBugetConversion?.val_con_au || '0.0000'
            });

        });

        effect(() => {
            if (this.planingCompartido.resetPeriodo()) return;

            this.resetearFormulario();
            this.planingCompartido.clearResetPeriodo();
        });
    }


    resetearFormulario() {
        this.form.reset({

            // val_ano: '',
            // val_per: '',
            val_pre_ag: "0.000", //ste

            //MaeFactorSobredisolucion
            val_fac_ag: "0.000",

            // MaeFactorRecuperacion
            val_fac_bud_ag: "0.000",


            val_con_ag: "0.000",

            val_pre_cu: "0.000", //ste
            val_fac_cu: "0.000",


            val_fac_bud_cu: "0.000",
            val_con_cu: "0.000",

            val_pre_pb: "0.000", //ste
            val_fac_pb: "0.000",
            val_fac_bud_pb: "0.000",
            val_con_pb: "0.000",

            //
            val_pre_zn: "0.000", //ste
            val_fac_zn: "0.000",
            val_fac_bud_zn: "0.000",
            val_con_zn: "0.000",

            val_pre_au: "0.000", //ste
            val_fac_au: "0.000",
            val_fac_bud_au: "0.000",
            val_con_au: "0.000"
        });
    }

    // const factorOperativo = response.data?.factorOperativo?.[0];


    // const factorSobredisolucion = response.data?.factorSobredisolucion?.[0]; // LISTO

    // const factorBugetConversion = response.data?.recuperacionBudget?.[0];  //listo

    ngOnInit() {
        this.form.valueChanges.subscribe(() => {
            const f = this.form.getRawValue();

            const factorOperativo = {
                val_per: f.val_per,
                val_ano: f.val_ano,

                val_pre_ag: f.val_pre_ag,
                val_pre_cu: f.val_pre_cu,
                val_pre_pb: f.val_pre_pb,
                val_pre_zn: f.val_pre_zn,
                val_pre_au: f.val_pre_au
            };

            const factorSobredisolucion = {
                cie_ano: f.cie_ano,
                cie_per: f.cie_per,
                val_fac_ag: f.val_fac_ag,
                val_fac_cu: f.val_fac_cu,
                val_fac_pb: f.val_fac_pb,
                val_fac_zn: f.val_fac_zn,
                val_fac_au: f.val_fac_au
            };

            const recuperacionBudget = {
                cie_ano: f.cie_ano,
                cie_per: f.cie_per,

                val_fac_bud_ag: f.val_fac_bud_ag,
                val_con_ag: f.val_con_ag,
                val_fac_bud_cu: f.val_fac_bud_cu,
                val_con_cu: f.val_con_cu,
                val_fac_bud_pb: f.val_fac_bud_pb,
                val_con_pb: f.val_con_pb,
                val_fac_bud_zn: f.val_fac_bud_zn,
                val_con_zn: f.val_con_zn,
                val_fac_bud_au: f.val_fac_bud_au,
                val_con_au: f.val_con_au
            };

            this.planingCompartido.setFactorOperativo(factorOperativo, 'factor_operativo');
            this.planingCompartido.setFactorSobredisolucion(factorSobredisolucion, 'factor_operativo');
            this.planingCompartido.setRecuperacionBudget(recuperacionBudget, 'factor_operativo');
        });
    }

    // bloquearCampo(): boolean {
    //     return this.planingCompartido.bloqueoFormEditar();
    // }
}
