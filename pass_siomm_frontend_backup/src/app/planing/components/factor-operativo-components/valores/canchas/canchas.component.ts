import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlanningService } from 'src/app/planing/services/planning.service';

@Component({
    selector: 'app-canchas',
    imports: [ReactiveFormsModule],
    templateUrl: './canchas.component.html',
    styleUrl: './canchas.component.css',
})
export class CanchasComponent {
    private shared = inject(PlanningService);
    private fb = inject(FormBuilder);

    form: FormGroup;

    constructor() {
        this.form = this.fb.group({
            val_tms: [''],
            val_ag: [''],
            val_cu: [''],
            val_pb: [''],
            val_zn: [''],
            val_vpt: ['']
        });

        effect(() => {
            const response = this.shared.data();

            if (response?.data?.canchas?.length) {
                const canchas = response.data.canchas[0];
                this.form.patchValue({
                    val_tms: canchas.val_tms,
                    val_ag: canchas.val_ag,
                    val_cu: canchas.val_cu,
                    val_pb: canchas.val_pb,
                    val_zn: canchas.val_zn,
                    val_vpt: canchas.val_vpt

                });
            }
        });
    }
}
