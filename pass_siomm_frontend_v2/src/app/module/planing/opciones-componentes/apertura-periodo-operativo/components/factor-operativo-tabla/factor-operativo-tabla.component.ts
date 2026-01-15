import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';
import { MaeValOperativo, TableField, TableHeader, TD_CAMPOS_TABLE, TH_CAMPOS_TABLE } from '../../interface/aper-per-oper.interface';
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
        factorOperativo: this.fb.array([])
    });



    get factorOperativoFA(): FormArray {
        return this.form.get('factorOperativo') as FormArray;
    }


    private crearFactorOperativo(item: MaeValOperativo): FormGroup {

        return this.fb.group({

            val_des_tipo_fac: [item.val_des_tipo_fac],
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

            console.log('response =>', response);

            if (response?.data?.factorOperativo?.length) {

                // 🔥 limpiar antes de cargar
                this.factorOperativoFA.clear();

                this.cd.detectChanges();

                response.data.factorOperativo.forEach((item: any, index: number) => {

                    this.factorOperativoFA.push(
                        this.crearFactorOperativo(item)
                    );
                });
                // this.factorOperativoFA.clear();
            }
        });

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
                // this.resetearFormulario();
                return;
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


            val_fac_rec_ag: '0.0000',
            val_fac_rec_cu: '0.0000',
            val_fac_rec_pb: '0.0000',
            val_fac_rec_zn: '0.0000',
            val_fac_rec_au: '0.0000',
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

            // this.planingCompartido.setOperativoDetalle(filas, 'factor_operativo');

            this.planingCompartido.setFactorOperativo(filas, 'factor_operativo');


        });
    }
}
