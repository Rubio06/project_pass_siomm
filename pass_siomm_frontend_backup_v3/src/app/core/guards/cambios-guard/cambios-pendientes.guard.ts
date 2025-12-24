import { inject, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { PlaningCompartidoService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import Swal from 'sweetalert2';

export interface CanComponentDeactivate {
    hasPendingChanges(): boolean;
    onVisualizar(): void;

}

@Injectable({
    providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
    planingCompartido = inject(PlaningCompartidoService);

    canDeactivate(): any {

        if (!this.planingCompartido.getCambios()) return true;

        return FormUtils.confirmarDescartarCambios().then(confirm => {
            if (confirm) {

                // 👇 volvemos a modo visualizar
                this.planingCompartido.onVisualizarGlobal();

                return true;
            }

            return false;
        });
    }
}
