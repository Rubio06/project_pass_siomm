import { Routes } from '@angular/router';
import { menuPlaningComponent } from './page/menu-planing/menu-planning.component';
import { BalanzaDetalleComponent } from './opciones-componentes/balanza-detalle/pages/balanza-detalle.component';

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
                data: { noReuse: true }
            },
            {
                path: 'programa_mensual_de_labores',
                loadChildren: () =>
                    import('./opciones-componentes/programa-mensual-labores/programama-mensua.routes')
                        .then(m => m.default),
                data: { noReuse: true }
            },

            {
                path: 'balanza_detalle',
                component: BalanzaDetalleComponent
            }
        ]
    }
];
export default planingMainRouter;