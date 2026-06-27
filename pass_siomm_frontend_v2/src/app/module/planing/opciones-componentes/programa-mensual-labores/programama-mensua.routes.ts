import { Routes } from "@angular/router";
import { ListaProgramaMensualLaboresComponent } from "./pages/lista-programa-mensual-labores/lista-programa-mensual-labores.component";
<<<<<<< HEAD
import { PanelPrincipalComponent } from "./pages/panel-principal/panel-principal.component";
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

export const programaMensualRouter: Routes = [
    {
        path: '',
<<<<<<< HEAD
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


=======
        component: ListaProgramaMensualLaboresComponent,

        // children: [
        //     {
        //         path: '',
        //         redirectTo: 'programa-mensual',
        //         pathMatch: 'full',  // ⚠️ Crucial: Asegura que solo redirija si el path es EXACTAMENTE vacío.
        //     },
        // ]
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    }
];
export default programaMensualRouter;
