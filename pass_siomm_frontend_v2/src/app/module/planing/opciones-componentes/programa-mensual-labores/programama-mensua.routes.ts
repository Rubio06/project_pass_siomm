import { Routes } from "@angular/router";
import { ListaProgramaMensualLaboresComponent } from "./pages/lista-programa-mensual-labores/lista-programa-mensual-labores.component";

export const programaMensualRouter: Routes = [
    {
        path: '',
        component: ListaProgramaMensualLaboresComponent,

        // children: [
        //     {
        //         path: '',
        //         redirectTo: 'programa-mensual',
        //         pathMatch: 'full',  // ⚠️ Crucial: Asegura que solo redirija si el path es EXACTAMENTE vacío.
        //     },
        // ]
    }
];
export default programaMensualRouter;
