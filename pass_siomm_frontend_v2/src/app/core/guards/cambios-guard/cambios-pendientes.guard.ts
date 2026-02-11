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
    formsUtils = FormUtils;



    async canDeactivate(
        component: any,
        currentRoute: any,
        currentState: any,
        nextState?: any
    ): Promise<boolean> {

        // 👉 Si NO hay cambios → salir siempre
        // 👉 Sin cambios, salir libre
        if (!this.planingCompartido.getCambios()) {
            return true;
        }

        const currentUrl = currentState.url;
        const nextUrl = nextState?.url ?? '';

        // ✅ CAMBIO DE TAB (sigue dentro del padre)
        if (
            currentUrl.includes('apertura_de_periodo_operativo') &&
            !nextUrl.includes('apertura_de_periodo_operativo')
        ) {
            this.planingCompartido.bloqueoEditar.set(false);

            return true; // ❌ NO mostrar popup
        }

        // 🚨 SALIENDO del componente padre
        const confirmar = await FormUtils.confirmarDescartarCambios();

        if (confirmar) {
            this.planingCompartido.bloqueoEditar.set(false);

            await this.planingCompartido.ejecutarGuardar();
        } else {
            this.planingCompartido.bloqueoEditar.set(false);

            await this.planingCompartido.ejecutarVisualizar();
            this.planingCompartido.setFormFactorBloqueado(true);
            this.planingCompartido.setTablaBloqueada(true);
            this.planingCompartido.setAgregarRegistro(true);

        }

        return true;
    }

}
