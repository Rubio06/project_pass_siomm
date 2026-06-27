import { ChangeDetectionStrategy, Component, inject, output, signal, OnInit } from '@angular/core';
import { ServioTransporteService } from '../../../../../services/servico-transporte.service';
import { CostosFijosDetalle, CostosFijosMae } from '../../../../../interfaces/servicio-transporte.interface';

@Component({
    selector: 'app-modal-busqueda-general',
    imports: [],
    templateUrl: './modal-busqueda-general.component.html',
})
export class ModalBusquedaGeneralComponent implements OnInit {

    private readonly servioTransporteService = inject(ServioTransporteService);
    public isLoading = signal<boolean>(false);
    public listCostosFijos = signal<CostosFijosMae[]>([]);
    public onCerrarModalBusqueda = output<void>();
    public listCostosFijosDetalle = signal<CostosFijosDetalle[]>([]);
    public listFilasSeleccionadas = signal<CostosFijosDetalle[]>([]);

    onDataAceptada = output<CostosFijosDetalle[]>();

    ngOnInit(): void {
        this.obtenerCostosFijos();
    }



    public obtenerCostosFijos(): void {
        this.servioTransporteService.obtenerCostosFijos().subscribe({
            next: (data) => {
                this.listCostosFijos.set(data);
            },
            error: (err) => console.error(err),
        });
    }

    public obtenerCostosFijosDetalle(cod_empresa: string, cod_empresa_unidad: string, cod_costo_fijo: string): void {
        this.isLoading.set(true);

        this.servioTransporteService.obtenerCostosFijosDetalle(cod_empresa, cod_empresa_unidad, cod_costo_fijo).subscribe({
            next: (data) => {
                this.listCostosFijosDetalle.set(data);
            },
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });
    }


    public onCostoFijoChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const codigoSeleccionado = selectElement.value;

        if (codigoSeleccionado) {
            this.obtenerCostosFijosDetalle('03', '01', codigoSeleccionado);
        }
    }
    // 2. NUEVO SIGNAL: Esta será tu canasta exclusiva para los elementos que el usuario marque


    public onCheckboxChange(event: Event, row: CostosFijosDetalle): void {
        const checkbox = event.target as HTMLInputElement;
        // Leemos el acumulador de seleccionados, NO el de la tabla completa
        const seleccionadosActuales = this.listFilasSeleccionadas();

        if (checkbox.checked) {
            // Agrega la fila al nuevo signal de seleccionados
            this.listFilasSeleccionadas.set([...seleccionadosActuales, row]);
        } else {
            // Remueve la fila del signal de seleccionados si se desmarca
            this.listFilasSeleccionadas.set(seleccionadosActuales.filter(item => item.cod_item_det !== row.cod_item_det));
        }
    }

    // Al dar click en "Aceptar", mandas la data de los seleccionados a donde necesites
    public confirmarSeleccion(): void {
        const dataAEnviar = this.listFilasSeleccionadas();

        if (dataAEnviar.length === 0) return;

        // Emitimos la data hacia el componente padre
        this.onDataAceptada.emit(dataAEnviar);
    }



}
