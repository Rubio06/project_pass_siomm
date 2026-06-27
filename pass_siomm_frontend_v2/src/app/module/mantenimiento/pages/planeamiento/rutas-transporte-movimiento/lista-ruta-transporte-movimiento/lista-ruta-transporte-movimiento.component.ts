import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborFiltro, LaborMant, ListZonas, MaestrosLabor, Nivel, NivelMant, PaginacionLabor, ProcedenciaBalanzaMant, ResponseApi, ResponseEliminarDto, RutasTransporteMovimiento, RutaTransporte, TipoLabor, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FiltroPlaneamientoService } from 'src/app/module/mantenimiento/services/filtro-planeamiento.service';
import { MantenimientoService } from 'src/app/module/mantenimiento/services/mantenimiento.service';
import { PaginacionComponent } from 'src/app/shared/components/paginacion/paginacion.component';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-lista-ruta-transporte-movimiento',
    imports: [CommonModule],
    templateUrl: './lista-ruta-transporte-movimiento.component.html',
    styleUrl: './lista-ruta-transporte-movimiento.component.css'
})
export class ListaRutaTransporteMovimientoComponent {
    listRutaTransporteMovimiento = input<RutasTransporteMovimiento[]>([])
    isLoading = input<boolean>(false);


    idNivelSeleccionada = input<string | null>(null);

    onRutaTransporteSeleccionada = output<RutasTransporteMovimiento>();

    onEliminarRutaTransporte = output<RutasTransporteMovimiento>();
    private idParaScroll = signal<string | null>(null);

    constructor() {
        // 🎯 EFFECT: Escucha reactivamente cuándo cambia la data o el ID seleccionado
        // 👇 EFFECT PARA SELECCIÓN (ya funciona, no tocar)
        effect(() => {
            const codigo = this.idNivelSeleccionada();
            const lista = this.listRutaTransporteMovimiento();

            // Si hay un código seleccionado y la lista ya tiene filas cargadas...
            if (codigo && lista.length > 0) {
                // Pequeño delay de 100ms para asegurar que Angular ya dibujó las filas en el DOM
                setTimeout(() => {
                    const elementoFila = document.getElementById(`tipo-labor-${codigo}`);

                    if (elementoFila) {
                        elementoFila.scrollIntoView({
                            behavior: 'smooth', // Desplazamiento fluido y elegante
                            block: 'center'     // Deja la fila exactamente en el centro de la pantalla
                        });
                    }
                }, 100);
            }
        });
    }
    public seleccionarRutaTransporte(rutaTransporte: RutasTransporteMovimiento) {
        this.onRutaTransporteSeleccionada.emit(rutaTransporte);
    }

    public onEliminar(rutaTransporte: RutasTransporteMovimiento) {
        this.onEliminarRutaTransporte.emit(rutaTransporte);
    }
}
