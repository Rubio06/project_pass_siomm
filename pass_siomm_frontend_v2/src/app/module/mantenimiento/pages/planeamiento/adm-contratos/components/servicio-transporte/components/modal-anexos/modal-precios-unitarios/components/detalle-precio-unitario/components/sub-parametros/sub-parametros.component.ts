import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output, output, signal } from '@angular/core';
import { ServioTransporteService } from '../../../../../../../services/servico-transporte.service';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TablaDetalleDto } from '../../../../../../../interfaces/servicio-transporte.interface';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-sub-parametros',
    imports: [ReactiveFormsModule, DecimalPipe],
    templateUrl: './sub-parametros.component.html',
})
export class SubParametrosComponent {

    listEquiposContrata = signal<any[]>([])

    isLoading = signal<boolean>(false)
    public servioTransporteService = inject(ServioTransporteService);

    public listUndMedida = signal<TablaDetalleDto[]>([]);
    public subParametrosArray = input.required<FormArray<FormGroup>>();
    subtotalChange = output<number>();

    ngOnInit(): void {
        this.obtenerDetalleTablaPu()
    }

    get filas(): FormGroup[] {
        const array = this.subParametrosArray();
        return array && array.controls ? (array.controls as FormGroup[]) : [];
    }


    public obtenerDetalleTablaPu(): void {
        this.servioTransporteService.obtenerDetalleTablaPu('03', '01').subscribe({
            next: (data: TablaDetalleDto[]) => {
                this.listUndMedida.set(data);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error capturado en el componente: ', err);
            }
        });
    }

    get subTotalPartida(): number {
        return this.filas.reduce((suma, fila) => {
            // 1. Extraemos el subtotal de la fila (asegurando que sea número)
            const subtotal = Number(fila.value.imp_subtotal) || 0;

            // 2. Aplicamos el ROUND(val, 3) usando Math.round para no perder precisión decimal
            const subtotalRedondeado = Math.round(subtotal * 1000) / 1000;

            // 3. Acumulamos en la suma total
            return suma + subtotalRedondeado;
        }, 0);
    }

    get totalGeneralSumaRound(): number {
        return this.filas.reduce((suma, fila) => {
            const subtotal = Number(fila.value.imp_subtotal) || 0;

            // Emulamos el ROUND(imp_subtotal, 3) de SQL de forma matemática exacta
            const subtotalRedondeado = Math.round(subtotal * 1000) / 1000;

            const resultado = suma + subtotalRedondeado;
            this.subtotalChange.emit(resultado); // 👈 emite al padre

            return suma + subtotalRedondeado;
        }, 0);
    }

    get totalSubTotal(): number {
        return this.filas.reduce((acc, fila) => {
            const subtotal = Number(fila.get('imp_subtotal')?.value) || 0;
            return acc + Number(subtotal.toFixed(3));
        }, 0);
    }


    public calcularSubtotalFila(fila: FormGroup): number {
        const precio = Number(fila.get('imp_precio_soles')?.value) || 0;
        const cantidad = Number(fila.get('nro_cantidad')?.value) || 0;

        const subtotal = Math.round((precio * cantidad) * 1000) / 1000;

        fila.patchValue({
            imp_subtotal: subtotal
        }, { emitEvent: false });

        // const total = this.totalGeneralSumaRound;
        // // this.subTotalChange.emit(total);

        return subtotal;
    }

    // get tituloCostoDirecto(): string {
    //     return `TOTAL DE COSTO DIRECTO EN S/. x ${this.umPago}`;
    // }

    get tituloCostoDirecto(): string {
        const primeraFila = this.filas.length > 0 ? this.filas[0] : null;
        const um = primeraFila?.get('um_pago')?.value || 'UNIDAD';
        return `TOTAL DE COSTO DIRECTO EN S/. x ${um.toUpperCase()}`;
    }



}
