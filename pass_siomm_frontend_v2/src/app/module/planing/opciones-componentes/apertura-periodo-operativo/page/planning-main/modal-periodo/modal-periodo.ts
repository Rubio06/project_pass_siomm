import { Component, EventEmitter, inject, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { PeriodoDestino } from '../../../interface/aper-per-oper.interface';

@Component({
    selector: 'app-modal-periodo',
    imports: [ReactiveFormsModule],
    templateUrl: './modal-periodo.html',
    styleUrl: './modal-periodo.css',
})
export class ModalPeriodo {

    aceptar = output<PeriodoDestino>();

    formsUtils = FormUtils;

    private fb = inject(FormBuilder);

    private hoy = new Date();

    // this.hoy.toLocaleString('es-PE', { month: 'long' }).replace(/^./, m => m.toUpperCase())
    myFrom: FormGroup = this.fb.group({
        anioDestino: [ this.hoy.getFullYear().toString(), [Validators.required, Validators.pattern(/^(19\d{2}|20\d{2}|2100)$/)]],
        mesDestino: [[''], Validators.required],
        fechaInicioDestino: ['', Validators.required],
        fechaFinDestino: ['', Validators.required],
    });

    onSubmit() {
        if (this.myFrom.invalid) {
            this.myFrom.markAllAsTouched();
            return;
        }

        this.aceptar.emit(this.myFrom.value as PeriodoDestino);

        this.onReset();

        // const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        // modal.close();
    }




    onReset() {
        this.myFrom.reset({
            anioDestino: this.hoy.getFullYear().toString(),
            mesDestino: '',
            fechaInicioDestino: '',
            fechaFinDestino: '',
        });
    }

    onCancelar() {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal.close();
        this.onReset();
    }
}
