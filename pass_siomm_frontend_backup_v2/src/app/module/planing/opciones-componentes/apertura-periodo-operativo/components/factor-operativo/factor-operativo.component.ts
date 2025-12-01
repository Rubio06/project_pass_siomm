import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlanningService } from '../../services/planning.service';

interface fieldName {
    name: string;
    type: string;
    label: string;
}

@Component({
    selector: 'app-factor-operativo',
    imports: [ReactiveFormsModule],
    templateUrl: './factor-operativo.component.html',
    styleUrl: './factor-operativo.component.css',
})
export class FactorOperativoComonent {
    private planingService = inject(PlanningService);
    private fb = inject(FormBuilder);
    bloqueo = inject(PlanningService).bloqueo;

    rutas = this.planingService.dataRoutes;

    form: FormGroup;

    fieldInputs = signal<fieldName[]>([
        { name: "fac_denmin", type: "text", label: "D. Mineral:" },
        { name: "fac_dendes", type: "text", label: "D. Desmonte:" },
        { name: "fac_vptmin", type: "text", label: "VPT Mínimo:" },
        { name: "fac_dialab", type: "text", label: "Días Laborales:" },
        { name: "fac_tarhor", type: "text", label: "Tareas/8 Horas" },
        { name: "fac_porcum", type: "text", label: "%Cump.(+/-)" },
        { name: "fac_porhum", type: "text", label: "%Humedad" },
        { name: "fac_tms_dif", type: "text", label: "TMS Dif (+/-)" },
    ]);

    constructor() {
        this.form = this.fb.group({
            fac_denmin: ['0.000'],
            fac_dendes: ['0.000'],
            fac_vptmin: ['0.000'],
            fac_dialab: ['0.000'],
            fac_tarhor: ['0.000'],
            fac_porcum: ['0.00'],
            fac_porhum: ['0.00'],
            fac_tms_dif: ['0.00']
        });

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
    }

    resetearFormulario() {
        console.log('Formulario reseteado en FactorOperativo');
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
}
