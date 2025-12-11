import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanchasComponent } from './canchas/canchas.component';
import { PlanningService } from '../../services/planning.service';
import { PlaningCompartido } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';



@Component({
    selector: 'app-valores',
    imports: [ReactiveFormsModule, CanchasComponent],
    templateUrl: './valores.component.html',
    styleUrl: './valores.component.css',
})
export class ValoresComponent {
    private planingService = inject(PlanningService);
    private fb = inject(FormBuilder);
    rutas = this.planingService.dataRoutes;
    formUtils =  FormUtils;

    planingCompartido = inject(PlaningCompartido);

    form!: FormGroup;
    bloqueo = inject(PlanningService).bloqueo;
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
        this.elements.forEach(item => {
            item.fields.forEach(field => {
                controls[field] = [{ value: "0.000", disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]];
            });
        });

        this.form = this.fb.group(controls);

        effect(() => {
            const response = this.planingService.data();
            if (!response) return;

            const factor = response.data.factorOperativo?.[0];
            const factor_2 = response.data.factorSobredisolucion?.[0];
            const factor_3 = response.data.recuperacionBudget?.[0];

            if (!factor || !factor_2 || !factor_3) return;

            this.form.patchValue({
                val_pre_ag: factor.val_pre_ag,
                val_fac_ag: factor_2.val_fac_ag,
                val_fac_bud_ag: (0.85 * 100).toFixed(2) + ' %',
                val_con_ag: factor_3.val_con_ag,

                val_pre_cu: factor.val_pre_cu,
                val_fac_cu: factor_2.val_fac_cu,
                val_fac_bud_cu: (0.85 * 100).toFixed(2) + ' %',
                // val_fac_bud_cu: factor_3.val_fac_bud_cu,
                val_con_cu: factor_3.val_con_cu,

                val_pre_pb: factor.val_pre_pb,
                val_fac_pb: factor_2.val_fac_pb,
                val_fac_bud_pb: factor_3.val_fac_bud_pb,
                val_con_pb: factor_3.val_con_pb,

                val_pre_zn: factor.val_pre_zn,
                val_fac_zn: factor_2.val_fac_zn,
                val_fac_bud_zn: factor_3.val_fac_bud_zn,
                val_con_zn: factor_3.val_con_zn,

                val_pre_au: factor.val_pre_au,
                val_fac_au: factor_2.val_fac_au,
                val_fac_bud_au: factor_3.val_fac_bud_au || '.00%',
                val_con_au: factor_3.val_con_au || '.00%'
            });

        });

        effect(() => {
            const data = this.planingService.dataRoutes();

            if (data === null || data?.length === 0) {
                this.resetearFormulario();   // 🔥 Se ejecuta en TODOS los componentes
                return;
            }

            // si hay data, llenas tus formularios
            this.form.patchValue(data);
        });

        effect(() => {
            this.bloqueoFormulario()
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
            val_pre_ag: "0.000",
            val_fac_ag: "0.000",
            val_fac_bud_ag: "0.000",
            val_con_ag: "0.000",

            val_pre_cu: "0.000",
            val_fac_cu: "0.000",
            val_fac_bud_cu: "0.000",
            // val_fac_bud_cu: factor_3.val_fac_bud_cu,
            val_con_cu: "0.000",

            val_pre_pb: "0.000",
            val_fac_pb: "0.000",
            val_fac_bud_pb: "0.000",
            val_con_pb: "0.000",

            val_pre_zn: "0.000",
            val_fac_zn: "0.000",
            val_fac_bud_zn: "0.000",
            val_con_zn: "0.000",

            val_pre_au: "0.000",
            val_fac_au: "0.000",
            val_fac_bud_au: "0.000",
            val_con_au: "0.000"
        });
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(val => {
            const filas = this.form.getRawValue();

            this.planingCompartido.setValores(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }
}
