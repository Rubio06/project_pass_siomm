import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContratoDetalleResponse } from '../../interfaces/adm-contrato.interface';


@Component({
    selector: 'app-tabla-contrato',
    imports: [ReactiveFormsModule, DatePipe, CommonModule],
    templateUrl: './tabla-contrato.component.html'
})
export class TablaContratoComponent implements OnInit {

    public listContrato = input<ContratoDetalleResponse[]>([]);
    public isLoading = input<boolean>(false);

    contratoActivo = signal<ContratoDetalleResponse | null>(null);

    public abrirContrato = output<ContratoDetalleResponse>();

    public modo = input<'nuevo' | 'visualizar' | null>(null);

    public seleccionar(contrato: ContratoDetalleResponse): void {
        this.contratoActivo.set(contrato);
        this.abrirContrato.emit(contrato);
    }

    constructor() {

    }

    ngOnInit(): void {

    }


    // public onAbrirModal(contrato: AdmContrato) {
    //     console.log("Contrato seleccionado:", contrato);
    // }


}
