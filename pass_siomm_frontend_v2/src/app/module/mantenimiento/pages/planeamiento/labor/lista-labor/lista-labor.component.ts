import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborFiltro, LaborMant, ListZonas, MaestrosLabor, NivelMant, PaginacionLabor, ProcedenciaBalanzaMant, ResponseApi, ResponseEliminarDto, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FiltroPlaneamientoService } from 'src/app/module/mantenimiento/services/filtro-planeamiento.service';
import { MantenimientoService } from 'src/app/module/mantenimiento/services/mantenimiento.service';
import { PaginacionComponent } from 'src/app/shared/components/paginacion/paginacion.component';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-lista-labor',
    imports: [CommonModule],
    templateUrl: './lista-labor.component.html',
})
export class ListaLaborComponent {
    listLabor = input<LaborMant[]>([])
    isLoading = input<boolean>(false);



    idLaborSeleccionada = input<string | null>(null);

    onLaborSeleccionada = output<LaborMant>();

    onEliminarLabor = output<LaborMant>();

    constructor() {
        // 🎯 EFFECT: Escucha reactivamente cuándo cambia la data o el ID seleccionado
        effect(() => {
            const codigo = this.idLaborSeleccionada();
            const lista = this.listLabor();

            // Si hay un código seleccionado y la lista ya tiene filas cargadas...
            if (codigo && lista.length > 0) {
                // Pequeño delay de 100ms para asegurar que Angular ya dibujó las filas en el DOM
                setTimeout(() => {
                    const elementoFila = document.getElementById(`labor-${codigo}`);

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
    public seleccionarLabor(labor: LaborMant) {
        this.onLaborSeleccionada.emit(labor);
    }

    public onEliminar(labor: LaborMant) {
        
        this.onEliminarLabor.emit(labor);
    }

}
