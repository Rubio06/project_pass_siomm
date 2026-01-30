import { inject, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AperturPeriodoComponent } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/page/planning-main/aper-periodo-operativo.component';
import { PlaningCompartidoService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import Swal from 'sweetalert2';

export interface CanComponentDeactivate {
    tieneCambios: () => boolean;
    onGuardar?: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class PendingGeneralGuard implements CanDeactivate<CanComponentDeactivate> {

    planingCompartido = inject(PlaningCompartidoService);

    async canDeactivate(component: CanComponentDeactivate): Promise<boolean> {

        if (!this.planingCompartido.getCambios()) return true;

        const guardar = await FormUtils.confirmarDescartarCambios();

        if (guardar) {
            // 🟦 Guardar Cambios
            await this.planingCompartido.ejecutarGuardar();
        } else {
            // 🟥 No descartar → Visualizar
            await this.planingCompartido.ejecutarVisualizar();
        }

        return true; // ✅ permitir navegación
    }
}

// export class PendingChangesGuard implements CanDeactivate<any> {

//     planingCompartido = inject(PlaningCompartidoService);

//     async canDeactivate(): Promise<boolean> {

//         if (!this.planingCompartido.getCambios()) {
//             return true;
//         }

//         const confirmar = confirm('¿Desea guardar los cambios?');

//         if (!confirmar) return false;

//         await this.planingCompartido.ejecutarOnGuardar();

//         return true;
//     }
// }


// export class PendingTabsGuard implements CanDeactivate<object> {

//     planingCompartido = inject(PlaningCompartidoService);

//     async canDeactivate(): Promise<boolean> {

//         if (!this.planingCompartido.getCambios()) return true;

//         const confirmar = confirm('¿Desea guardar los cambios?');

//         if (!confirmar) return false;

//         await this.planingCompartido.guardarTodoCompleto();

//         this.planingCompartido.setCambios(false);

//         return true;
//     }
// }
