import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborFiltro, LaborMant, ListZonas, MaestrosLabor, Nivel, NivelMant, PaginacionLabor, ProcedenciaBalanzaMant, ResponseApi, ResponseEliminarDto, TipoLabor, TipoLaborMant, UnidadEconomicaMant, Veta, VetaMant, Zona } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FiltroPlaneamientoService } from 'src/app/module/mantenimiento/services/filtro-planeamiento.service';
import { MantenimientoService } from 'src/app/module/mantenimiento/services/mantenimiento.service';
import { PaginacionComponent } from 'src/app/shared/components/paginacion/paginacion.component';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-lista-und-economica',
    imports: [CommonModule],
    templateUrl: './lista-und-economica.component.html',
})
export class ListaUndEconomicaComponent {
    listUnidadEconomica = input<UnidadEconomicaMant[]>([])
    isLoading = input<boolean>(false);



    idUndEconomicaSeleccionada = input<string | null>(null);

    onUndEconomicaSeleccionada = output<UnidadEconomicaMant>();

    onEliminarUndEconomica = output<UnidadEconomicaMant>();

    constructor() {
        // 🎯 EFFECT: Escucha reactivamente cuándo cambia la data o el ID seleccionado
        effect(() => {
            const codigo = this.idUndEconomicaSeleccionada();
            const lista = this.listUnidadEconomica();


            // Si hay un código seleccionado y la lista ya tiene filas cargadas...
            if (codigo && lista.length > 0) {
                // Pequeño delay de 100ms para asegurar que Angular ya dibujó las filas en el DOM
                setTimeout(() => {
                    const elementoFila = document.getElementById(`und-economica-${codigo}`);

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
    public seleccionarUndEconomica(und: UnidadEconomicaMant) {
        this.onUndEconomicaSeleccionada.emit(und);
    }

    public onEliminar(und: UnidadEconomicaMant) {

        this.onEliminarUndEconomica.emit(und);
    }

}
