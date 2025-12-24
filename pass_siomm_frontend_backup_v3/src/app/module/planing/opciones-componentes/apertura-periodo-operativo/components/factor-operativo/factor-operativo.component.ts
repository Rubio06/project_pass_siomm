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
        { name: "fac_dialab", type: "number", label: "Días Laborales:" },
        { name: "fac_tarhor", type: "number", label: "Tareas/8 Horas" },
        { name: "fac_porcum", type: "number", label: "%Cump.(+/-)" },
        { name: "fac_porhum", type: "number", label: "%Humedad" },
        { name: "fac_tms_dif", type: "number", label: "TMS Dif (+/-)" },
    ]);

    form: FormGroup = this.fb.group({
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
            const response = this.rutas();

            if (response?.data?.factor?.length) {
                const periodo = response.data.factor?.[0];

                this.form.patchValue({
                    fac_denmin: periodo.fac_denmin,
                    fac_dendes: periodo.fac_dendes,
                    fac_vptmin: periodo.fac_vptmin,
                    fac_dialab: periodo.fac_dialab,
                    fac_tarhor: periodo.fac_tarhor,
                    fac_porcum: periodo.fac_porcum,
                    fac_porhum: periodo.fac_porhum,
                    fac_tms_dif: periodo.fac_tms_dif,
                });
            }
        })

        effect(() => {
            const data = this.planingCompartido.dataRoutes();

            if (data === null || data?.length === 0) {
                this.resetearFormulario();   // 🔥 Se ejecuta en TODOS los componentes

                return;
            }

            // si hay data, llenas tus formularios
            this.form.patchValue(data);

        });

        //BOTON EDITAR//
        effect(() => {
            if (!this.form) return;

            if (this.planingCompartido.bloqueoFormGeneral()) {
                this.form.disable({ emitEvent: false });
            } else {
                this.form.enable({ emitEvent: false });
            }
        });

        //BOTON NUEVO//

        effect(() => {
            this.planingCompartido.resetAllForms();
            this.resetearFormulario();
        });

        //BOTON VISUALIZAR
        effect(() => {
            const signal = this.planingCompartido.visualizarForms();
            if (signal > 0) {
                this.blockForm();
                this.resetearFormulario();
            }
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

            this.planingCompartido.setFactorOperativo(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });

    }
}
