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

    @Output() aceptar = new EventEmitter<{ anio: string; mes: string; fechaInicio: string; fechaFin: string }>();

    // modalForm!: FormGroup;

    // constructor(private fb: FormBuilder) { }

    // ngOnInit() {
    //     this.modalForm = this.fb.group({
    //         anio: ['', Validators.required],
    //         mes: ['', Validators.required],
    //         fechaInicio: ['', Validators.required],
    //         fechaFin: ['', Validators.required],
    //     });
    // }

    // onAceptar() {
    //     if (this.modalForm.valid) {
    //         this.aceptar.emit(this.modalForm.value);
    //         const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    //         modal.close();
    //     } else {
    //         // Si el formulario no es válido, puedes mostrar un mensaje de error
    //         console.log('Formulario no válido');
    //     }
    // }

    // onCancelar() {
    //     const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    //     modal.close();
    // }


    private fb = inject(FormBuilder);

    myFrom: FormGroup = this.fb.group({
        anio: ['', [Validators.required, Validators.minLength(4)]],
        mes: ['', Validators.required],
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
    });

    onSubmit() {
        if (!this.myFrom.invalid) {
            this.myFrom.markAllAsTouched();
            return;
        }

        // Emitimos los datos al componente padre
        this.aceptar.emit(this.myFrom.value);

        // Reinicia el formulario si quieres
        // this.myFrom.reset({
        //     anio: '2025',
        //     mes: 'Diciembre',
        //     fechaInicio: '00/00/0000',
        //     fechaFin: '00/00/0000',
        // });
    }


    onCancelar() {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal.close();
    }
}
