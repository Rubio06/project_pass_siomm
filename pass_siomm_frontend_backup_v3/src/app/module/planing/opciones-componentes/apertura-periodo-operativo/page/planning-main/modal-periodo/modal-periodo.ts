import { Component, EventEmitter, inject, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-modal-periodo',
    imports: [ReactiveFormsModule],
    templateUrl: './modal-periodo.html',
    styleUrl: './modal-periodo.css',
})
export class ModalPeriodo {

    aceptar = output<any[]>();

    formsUtils = FormUtils;

    private fb = inject(FormBuilder);

    private hoy = new Date();


    myFrom: FormGroup = this.fb.group({
        anio: [ this.hoy.getFullYear().toString(), [Validators.required, Validators.pattern(/^(19\d{2}|20\d{2}|2100)$/)]],
        mes: [this.hoy.toLocaleString('es-PE', { month: 'long' }).replace(/^./, m => m.toUpperCase()), Validators.required],
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
    });

    onSubmit() {
        if (this.myFrom.invalid) {
            this.myFrom.markAllAsTouched();
            return;
        }

        this.aceptar.emit(this.myFrom.value);

        this.onReset();

        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal.close();
    }




    onReset() {
        this.myFrom.reset({
            anio: this.hoy.getFullYear().toString(),
            mes: this.hoy.toLocaleString('es-PE', { month: 'long' }).replace(/^./, m => m.toUpperCase()),
            fechaInicio: '',
            fechaFin: '',
        });
    }


    onCancelar() {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal.close();
    }
}
