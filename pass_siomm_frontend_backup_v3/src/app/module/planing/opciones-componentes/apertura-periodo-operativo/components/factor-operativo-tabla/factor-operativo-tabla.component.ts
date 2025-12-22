import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';
import { TableField, TableHeader, TD_CAMPOS_TABLE, TH_CAMPOS_TABLE } from '../../interface/aper-per-oper.interface';
import { PlaningCompartido } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';


@Component({
    selector: 'app-factor-operativo-tabla',
    imports: [ReactiveFormsModule],
    templateUrl: './factor-operativo-tabla.component.html',
    styleUrl: './factor-operativo-tabla.component.css',
})
export class FactorOperativoTablaComponent {
    private planingService = inject(PlanningService);
    private fb = inject(FormBuilder);
    planingCompartido = inject(PlaningCompartido);

    rutas = this.planingCompartido.dataRoutes;
    thCampos = signal<TableHeader[]>(TH_CAMPOS_TABLE);
    tdCampos = signal<TableField[]>(TD_CAMPOS_TABLE);
    bloqueo = inject(PlaningCompartido).bloqueo;


    formUtils = FormUtils;

    form: FormGroup = this.fb.group({
        val_des_tipo_fac: ['GENERAL'],
        val_fac_ag: ['0.0000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_cu: ['0.0000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_pb: ['0.0000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_zn: ['0.0000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_au: ['0.0000', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_rec_ag: ['.00%', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_rec_cu: ['.00%', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_rec_pb: ['.00%', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_rec_zn: ['.00%', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        val_fac_rec_au: ['.00%', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    });

    constructor() {

        effect(() => {
            const response = this.rutas();

            if (response?.data?.factorOperativo?.length) {
                const factorOperativo = response.data.factorOperativo[0];
                const factorOperativoDetalle = response.data.operativo_detalle[0];

                this.form.patchValue({
                    val_fac_ag: factorOperativo.val_fac_ag,
                    val_fac_cu: factorOperativo.val_fac_cu,
                    val_fac_pb: factorOperativo.val_fac_pb,
                    val_fac_zn: factorOperativo.val_fac_zn,
                    val_fac_au: factorOperativo.val_fac_au,

                    val_fac_rec_ag: factorOperativoDetalle.val_fac_rec_ag != null
                        ? (factorOperativoDetalle.val_fac_rec_ag * 100).toFixed(2) + '%'
                        : '.00%',
                    val_fac_rec_cu: factorOperativoDetalle.val_fac_rec_cu != null
                        ? (factorOperativoDetalle.val_fac_rec_cu * 100).toFixed(2) + '%'
                        : '.00%',
                    val_fac_rec_pb: factorOperativoDetalle.val_fac_rec_pb != null
                        ? (factorOperativoDetalle.val_fac_rec_pb * 100).toFixed(2) + '%'
                        : '.00%',
                    val_fac_rec_zn: factorOperativoDetalle.val_fac_rec_zn != null
                        ? (factorOperativoDetalle.val_fac_rec_zn * 100).toFixed(2) + '%'
                        : '.00%',
                    val_fac_rec_au: factorOperativoDetalle.val_fac_rec_au != null
                        ? (factorOperativoDetalle.val_fac_rec_au * 100).toFixed(2) + '%'
                        : '.00%',
                    val_des_tipo_fac: factorOperativoDetalle.val_des_tipo_fac,

                });
            }
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
            val_des_tipo_fac: 'GENERAL',
            val_fac_ag: '0.0000',
            val_fac_cu: '0.0000',
            val_fac_pb: '0.0000',
            val_fac_zn: '0.0000',
            val_fac_au: '0.0000',
            val_fac_rec_ag: '.00%',
            val_fac_rec_cu: '.00%',
            val_fac_rec_pb: '.00%',
            val_fac_rec_zn: '.00%',
            val_fac_rec_au: '.00%',
        });
    }

    // bloqueoFormulario() {
    //     const bloqueado = this.planingCompartido.bloqueoForm();
    //     if (bloqueado) {
    //         this.form.disable();
    //     } else {
    //         this.form.enable();
    //     }
    // }

    ngOnInit() {
        this.form.valueChanges.subscribe(val => {
            const filas = this.form.getRawValue();

            this.planingCompartido.setFactor(filas);
        });
    }
}
