import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlanningService } from '../../services/planning.service';
import { CommonModule } from '@angular/common';
import { PlaningCompartido } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';

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
    private fb = inject(FormBuilder);
    bloqueo = inject(PlanningService).bloqueo;
    rutas = this.planingService.dataRoutes;
    planingCompartido = inject(PlaningCompartido);
	formUtils =  FormUtils;

    // form: FormGroup;

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
        fac_denmin: [{ value: '0.000', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_dendes: [{ value: '0.000', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_vptmin: [{ value: '0.000', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_dialab: [{ value: '0.000', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_tarhor: [{ value: '0.000', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_porcum: [{ value: '0.000', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_porhum: [{ value: '0.00', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        fac_tms_dif: [{ value: '0.00', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
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

        // Observa el estado de bloqueo y actualiza el formulario automáticamente
        effect(() => {
            this.bloqueoFormulario()
        });

        effect(() => {
            // ⚠️ Asegúrate de leer la signal correcta: bloqueoFormEdit
            const bloqueado = this.planingService.bloqueoFormEdit();

            // Ejecuta tu lógica que deshabilita/habilita
            this.gestionBloqueoFormulario(bloqueado);
        });


    }

    resetearFormulario() {
        // Aquí reseteas tu formulario reactivo

        this.form.reset({
            fac_denmin: ['0.000'],
            fac_dendes: ['0.000'],
            fac_vptmin: ['0.000'],
            fac_dialab: ['0.000'],
            fac_tarhor: ['0.000'],
            fac_porcum: ['0.00'],
            fac_porhum: ['0.00'],
            fac_tms_dif: ['0.00']
        });
    }


    bloqueoFormulario() {
        const bloqueado = this.planingService.bloqueoForm();
        if (bloqueado) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    private gestionBloqueoFormulario(bloqueado: boolean) {
        // Si la signal 'bloqueado' es FALSE (el usuario presionó el botón 'Editar'),
        // entonces habilitamos el formulario.
        if (!bloqueado) {
            this.form.enable();
        }
        // Si 'bloqueado' es TRUE, el formulario se mantiene deshabilitado.
        // No necesitamos un 'else' si tu objetivo es solo el desbloqueo.
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(val => {
            const filas = this.form.getRawValue();

            this.planingCompartido.setFactorOperativo(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }
}
