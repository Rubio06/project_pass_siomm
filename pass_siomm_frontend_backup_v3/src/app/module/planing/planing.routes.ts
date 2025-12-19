import { Routes } from '@angular/router';
import { menuPlaningComponent } from './page/menu-planing/menu-planning.component';
import { PendingChangesGuard } from 'src/app/core/guards/cambios-guard/cambios-pendientes.guard';

export const planingMainRouter: Routes = [
    {
        path: '',
        component: menuPlaningComponent,
        children: [
            {
                path: 'apertura_de_periodo_operativo',
                loadChildren: () =>
                    import('./opciones-componentes/apertura-periodo-operativo/apertura-periodo-operativo.routes')
                        .then(m => m.default),
            }
        ]
    }
];
export default planingMainRouter;
