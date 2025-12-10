import { Routes } from '@angular/router';
import { menuPlaningComponent } from './page/menu-planing/menu-planning.component';

export const planingMainRouter: Routes = [
    {
        path: '',
        component: menuPlaningComponent,
        children: [
            {
                path: 'apertura_de_periodo_operativo',
                loadChildren: () =>
                    import('./opciones-componentes/apertura-periodo-operativo/apertura-periodo-operativo.routes')
                        .then(m => m.default)  // 👈 IMPORTANTE
            }
        ]
    }
];
export default planingMainRouter;
