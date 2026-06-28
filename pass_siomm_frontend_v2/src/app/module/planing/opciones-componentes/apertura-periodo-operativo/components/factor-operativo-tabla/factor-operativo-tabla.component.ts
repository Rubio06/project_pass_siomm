import { ChangeDetectorRef, Component, effect, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';
import { MaeValOperativoDetalle, TableField, TableHeader, TD_CAMPOS_TABLE, TH_CAMPOS_TABLE } from '../../interface/aper-per-oper.interface';
import { PlaningCompartidoService } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-factor-operativo-tabla',
    imports: [ReactiveFormsModule],
    templateUrl: './factor-operativo-tabla.component.html',
    styleUrl: './factor-operativo-tabla.component.css',
})
export class FactorOperativoTablaComponent implements OnInit {
    private planningService = inject(PlanningService);
    private fb = inject(FormBuilder);
    planingCompartido = inject(PlaningCompartidoService);

    rutas = this.planingCompartido.dataRoutes;
    thCampos = signal<TableHeader[]>(TH_CAMPOS_TABLE);
    tdCampos = signal<TableField[]>(TD_CAMPOS_TABLE);

    private cd = inject(ChangeDetectorRef);
    formUtils = FormUtils;

    form: FormGroup = this.fb.group({
        factorOperativoDetalle: this.fb.array([])
    });

    get factorOperativoDetalle(): FormArray {
        return this.form.get('factorOperativoDetalle') as FormArray;
    }

    private crearFactorOperativoDetalle(item: MaeValOperativoDetalle): FormGroup {
        return this.fb.group({
            val_des_tipo_fac: [{ value: item.val_des_tipo_fac, disabled: true }],
            val_tipo_fac: [item.val_des_tipo_fac === 'GENERAL' ? 'FAC1' : 'FAC2'],
            val_ind_principal: [item.val_des_tipo_fac === 'GENERAL' ? 'S' : 'N'],
            val_fac_ag: [item.val_fac_ag || '0.0000'],
            val_fac_cu: [item.val_fac_cu || '0.0000'],
            val_fac_pb: [item.val_fac_pb || '0.0000'],
            val_fac_zn: [item.val_fac_zn || '0.0000'],
            val_fac_au: [item.val_fac_au || '0.0000'],

            val_fac_rec_ag: [item.val_fac_rec_ag || '0.0000'],
            val_fac_rec_cu: [item.val_fac_rec_cu || '0.0000'],
            val_fac_rec_pb: [item.val_fac_rec_pb || '0.0000'],
            val_fac_rec_zn: [item.val_fac_rec_zn || '0.0000'],
            val_fac_rec_au: [item.val_fac_rec_au || '0.0000'],
        });
    }

    constructor() {
        effect(() => {
            const detalle = this.rutas()?.data?.operativo_detalle;

            if (!detalle || detalle.length === 0) {
                this.resetearFormulario();
                return;
            }

            const filas = detalle.map((item: any) =>
                this.crearFactorOperativoDetalle(item)
            );

            this.form.setControl(
                'factorOperativoDetalle',
                this.fb.array(filas)
            );
        });
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(() => {
            // Tomamos los valores actuales con getRawValue para incluir los campos deshabilitados
            const filas = this.factorOperativoDetalle.getRawValue().map((fila: any) => {
                const filaProcesada: any = {};

                Object.keys(fila).forEach(key => {
                    // Reemplazamos nulos, undefined o strings vacíos por '00.00'
                    filaProcesada[key] = fila[key] === null || fila[key] === undefined || fila[key] === ''
                        ? '00.00'
                        : fila[key];
                });

                return filaProcesada;
            });

            // Enviamos las filas ya procesadas al servicio compartido
            this.planingCompartido.setOperativoDetalle(filas, 'factor_operativo');
        });
        
        this.resetearFormulario();
    }

    blockForm() {
        this.form.disable();
    }

    bloquearCampo(): boolean {
        return this.planingCompartido.bloqueoFormEditar();
    }

    resetearFormulario() {
        const fa = this.factorOperativoDetalle;

        fa.controls.forEach((fg: AbstractControl, index: number) => {
            const desTipo = index === 0 ? 'GENERAL' : 'EZPERANZA';

            fg.reset({
                val_des_tipo_fac: desTipo,
                val_tipo_fac: desTipo === 'GENERAL' ? 'FAC1' : 'FAC2',
                val_ind_principal: desTipo === 'GENERAL' ? 'S' : 'N',
                val_fac_ag: '0.0000',
                val_fac_cu: '0.0000',
                val_fac_pb: '0.0000',
                val_fac_zn: '0.0000',
                val_fac_au: '0.0000',
                val_fac_rec_ag: '0.0000',
                val_fac_rec_cu: '0.0000',
                val_fac_rec_pb: '0.0000',
                val_fac_rec_zn: '0.0000',
                val_fac_rec_au: '0.0000',
            });
        });
    }

    crearFilaFactor(desTipo: 'GENERAL' | 'EZPERANZA'): FormGroup {
        return this.fb.group({
            val_des_tipo_fac: [desTipo],
            val_tipo_fac: [desTipo === 'GENERAL' ? 'FAC1' : 'FAC2'],
            val_ind_principal: [desTipo === 'GENERAL' ? 'S' : 'N'],
            val_fac_ag: ['0.0000'],
            val_fac_cu: ['0.0000'],
            val_fac_pb: ['0.0000'],
            val_fac_zn: ['0.0000'],
            val_fac_au: ['0.0000'],
            val_fac_rec_ag: ['0.0000'],
            val_fac_rec_cu: ['0.0000'],
            val_fac_rec_pb: ['0.0000'],
            val_fac_rec_zn: ['0.0000'],
            val_fac_rec_au: ['0.0000'],
        });
    }
}