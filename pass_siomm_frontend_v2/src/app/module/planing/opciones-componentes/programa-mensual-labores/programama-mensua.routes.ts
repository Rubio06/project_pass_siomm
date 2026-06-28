import { Routes } from "@angular/router";
import { ListaProgramaMensualLaboresComponent } from "./pages/lista-programa-mensual-labores/lista-programa-mensual-labores.component";
import { PanelPrincipalComponent } from "./pages/panel-principal/panel-principal.component";

export const programaMensualRouter: Routes = [
    {
        path: '',
        component: PanelPrincipalComponent,
        data: { noReuse: true },
        children: [
            {
                path: '',
                redirectTo: 'lista-detalle',
                pathMatch: 'full',
            },
            {
                path: 'lista-detalle',
                component: ListaProgramaMensualLaboresComponent,
            },
            {
                path: 'detalle-programacion/:nro_prog/:cie_ano/:cie_per',
                loadChildren: () =>
                    import('./pages/edicion-programa-mensual-labores/edicion-programa-mensual-labores.routing')
                        .then(m => m.default)
            }
        ]
    }
];
export default programaMensualRouter;