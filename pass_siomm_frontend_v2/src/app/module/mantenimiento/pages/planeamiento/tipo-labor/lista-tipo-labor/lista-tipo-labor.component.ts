import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborFiltro, LaborMant, ListZonas, MaestrosLabor, Nivel, NivelMant, PaginacionLabor, ProcedenciaBalanzaMant, ResponseApi, ResponseEliminarDto, TipoLabor, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FiltroPlaneamientoService } from 'src/app/module/mantenimiento/services/filtro-planeamiento.service';
import { MantenimientoService } from 'src/app/module/mantenimiento/services/mantenimiento.service';
import { PaginacionComponent } from 'src/app/shared/components/paginacion/paginacion.component';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-lista-tipo-labor',
    imports: [CommonModule],
    templateUrl: './lista-tipo-labor.component.html',
})
export class ListaNivelComponent {
    listTipoLabor = input<TipoLabor[]>([])
    isLoading = input<boolean>(false);



    idNivelSeleccionada = input<string | null>(null);

    onTipoLaborSeleccionada = output<TipoLabor>();

    onEliminarTipoLabor = output<TipoLabor>();

    constructor() {
        // 🎯 EFFECT: Escucha reactivamente cuándo cambia la data o el ID seleccionado
        effect(() => {
            const codigo = this.idNivelSeleccionada();
            const lista = this.listTipoLabor();

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
    public seleccionarLabor(tipoLabor: TipoLabor) {
        this.onTipoLaborSeleccionada.emit(tipoLabor);
    }

    public onEliminar(tipoLabor: TipoLabor) {

        this.onEliminarTipoLabor.emit(tipoLabor);
    }

}
