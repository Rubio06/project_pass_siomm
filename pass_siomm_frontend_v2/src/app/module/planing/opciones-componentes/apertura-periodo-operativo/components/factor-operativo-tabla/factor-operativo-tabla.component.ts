import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class FactorOperativoTablaComponent {
    private planingService = inject(PlanningService);
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
        // this.factorOperativoFA.clear();

        return this.fb.group({
            // val_ano: [item.val_ano],
            // val_per: [item.val_per],
            val_des_tipo_fac: [{ value: item.val_des_tipo_fac, disabled: true }], // bloqueado
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
            const response = this.rutas();

            if (!response?.data?.operativo_detalle) return;

            const filas = response.data.operativo_detalle.map((item: any) =>
                this.crearFactorOperativoDetalle(item)
            );

            this.form.setControl('factorOperativoDetalle', this.fb.array(filas));
        }, { allowSignalWrites: true });


        effect(() => {
            if (!this.form) return;

            if (this.planingCompartido.bloqueoFormGeneral()) {
                // this.factorOperativoFA.clear();

                this.form.disable({ emitEvent: false });
            } else {
                this.form.enable({ emitEvent: false });
            }
        });


        //EFECTO PARA RESETEAR LOS FORMULARIOS
        effect(() => {

            if (!this.planingCompartido.resetSemanas()) {
                // this.factorOperativoFA.clear();
                this.resetearFormulario();
                // Agregamos 2 filas vacía
                return;
            }
            // Agregar 2 filas vacías

        });

    }


    blockForm() {
        this.form.disable();
    }

    resetearFormulario() {
        const fa = this.factorOperativoDetalle; // tu FormArray

        fa.controls.forEach((fg: AbstractControl, index: number) => {
            const desTipo = index === 0 ? 'GENERAL' : 'EZPERANZA'; // fila 0 → GENERAL, fila 1 → EZPERANZA

            fg.reset({
                val_des_tipo_fac: desTipo,  // asignamos GENERAL o EZPERANZA
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


    // resetearFormulario() {
    //     this.form.reset({
    //         val_fac_ag: '0.0000',
    //         val_fac_cu: '0.0000',
    //         val_fac_pb: '0.0000',
    //         val_fac_zn: '0.0000',
    //         val_fac_au: '0.0000',


    //         val_fac_rec_ag: '0.0000',
    //         val_fac_rec_cu: '0.0000',
    //         val_fac_rec_pb: '0.0000',
    //         val_fac_rec_zn: '0.0000',
    //         val_fac_rec_au: '0.0000',
    //     });
    // }

    // bloqueoFormulario() {
    //     const bloqueado = this.planingCompartido.bloqueoForm();
    //     if (bloqueado) {
    //         this.form.disable();
    //     } else {
    //         this.form.enable();
    //     }
    // }

    // ngOnInit() {
    //     this.form.valueChanges.subscribe(val => {
    //         const filas = this.form.getRawValue();

    //         // this.planingCompartido.setOperativoDetalle(filas, 'factor_operativo');

    //         console.log(filas);

    //         this.planingCompartido.setFactorOperativo(filas, 'factor_operativo');


    //     });
    // }

    ngOnInit() {
        this.form.valueChanges.subscribe(() => {

            const filas = this.factorOperativoDetalle.getRawValue();

            this.planingCompartido.setOperativoDetalle(
                filas,
                'factor_operativo'
            );

        });
        this.resetearFormulario();
    }
}
