import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContratoDetalleResponse } from '../../interfaces/adm-contrato.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';


@Component({
    selector: 'app-tabla-contrato',
    imports: [ReactiveFormsModule, DatePipe, CommonModule],
    templateUrl: './tabla-contrato.component.html'
})
export class TablaContratoComponent implements OnInit {

    public listContrato = input<ContratoDetalleResponse[]>([]);
    public isLoading = input<boolean>(false);

    public bloqueService = inject(AccionPlaneamientoService);

    contratoActivo = signal<ContratoDetalleResponse | null>(null);

    onContrato = output<ContratoDetalleResponse>();

    public abrirContrato = output<ContratoDetalleResponse>();

    public modo = input<'nuevo' | 'visualizar' | null>(null);

    public seleccionar(contrato: ContratoDetalleResponse): void {
        this.contratoActivo.set(contrato);
        this.abrirContrato.emit(contrato);
        this.bloqueService.setBloqueosAdmContrato({
            refrescar: true,
            nuevo: true,
            anular: true,
            aprobar: true,
            reversion: true,
            historico: true,
            imprimir: true,
            exportar: true
        });
    }

    public onEnviarContrato(contrato: ContratoDetalleResponse): void {
        this.contratoActivo.set(contrato);
        this.onContrato.emit(contrato);

        this.bloqueService.setBloqueosAdmContrato({
            refrescar: true,
            nuevo: true,
            anular: false,
            aprobar: false,
            reversion: false,
            historico: false,
            imprimir: true,
            exportar: true
        });
    }

    constructor() {

    }

    ngOnInit(): void {

    }


    // public onAbrirModal(contrato: AdmContrato) {
    //     console.log("Contrato seleccionado:", contrato);
    // }


}
