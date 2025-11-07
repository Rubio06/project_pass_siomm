import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DATA, LABELS } from '../../interface/aper-per-oper.interface';

@Component({
    selector: 'app-valores',
    imports: [ReactiveFormsModule],
    templateUrl: './valores.component.html',
    styleUrl: './valores.component.css',
})
export class ValoresComponent {
    form!: FormGroup;
    fb = inject(FormBuilder);

    // Labels recorridos y tambien inputs a la vez
    labels = signal<string[]>(LABELS);
    data = signal<string[]>(DATA);

    constructor() {
        this.form = this.fb.group({
            valores: this.fb.array(
                this.labels().map(() => this.fb.control('', Validators.required))
            ),
        });
        this.form.get('valores')?.patchValue(this.data());
    }


    onSubmit(): void {
        console.log('Datos del formulario:', this.form.value.valores);
    }
}
