import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/planing/services/planning.service';

@Component({
    selector: 'app-factor-operativo',
    imports: [ReactiveFormsModule],
    templateUrl: './factor-operativo.component.html',
    styleUrl: './factor-operativo.component.css',
})
export class FactorOperativoComonent {

    private shared = inject(PlanningService);
    private fb = inject(FormBuilder);

    form: FormGroup;

    constructor() {
        this.form = this.fb.group({
            fac_denmin: [''],
            fac_dendes: [''],
            fac_vptmin: [''],
            fac_dialab: [''],
            fac_tarhor: [''],
            fac_porcum: [''],
            fac_porhum: [''],
            fac_tms_dif: ['']

        });

        effect(() => {
            const response = this.shared.data();

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
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    }
}
