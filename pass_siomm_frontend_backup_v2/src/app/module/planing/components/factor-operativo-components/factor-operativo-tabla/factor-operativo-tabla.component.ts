import { Component, effect, inject, signal } from '@angular/core';
import { PlanningService } from '../../../services/planning.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableField, TableHeader, TD_CAMPOS_TABLE, TH_CAMPOS_TABLE } from '../../../interface/aper-per-oper.interface';

@Component({
    selector: 'app-factor-operativo-tabla',
    imports: [ReactiveFormsModule],
    templateUrl: './factor-operativo-tabla.component.html',
    styleUrl: './factor-operativo-tabla.component.css',
})
export class FactorOperativoTablaComponent {
    private planingService = inject(PlanningService);
    private fb = inject(FormBuilder);

    rutas = this.planingService.dataRoutes;

    thCampos = signal<TableHeader[]>(TH_CAMPOS_TABLE);
    tdCampos = signal<TableField[]>(TD_CAMPOS_TABLE);


    form: FormGroup;

    constructor() {
        this.form = this.fb.group({
            val_des_tipo_fac: [''],
            val_fac_ag: [''],
            val_fac_cu: [''],
            val_fac_pb: [''],
            val_fac_zn: [''],
            val_fac_au: [''],
            val_fac_rec_ag: [''],
            val_fac_rec_cu: [''],
            val_fac_rec_pb: [''],
            val_fac_rec_zn: [''],
            val_fac_rec_au: [''],
        });

        effect(() => {
            const response = this.rutas();

            // console.log(response)

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
    }
}
