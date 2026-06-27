import { Routes } from "@angular/router";
import { MainPageComponent } from "./pages/main-page/main-page.component";


export const mainRouter: Routes = [
    {
        path: '',
        component: MainPageComponent,
        children: [
            {
                path: 'planeamiento',
                loadChildren: () => import('../planing/planing.routes'),

            },
            {
                path: 'geologia',
                loadChildren: () => import('../geology/geology.routes')
<<<<<<< HEAD
            },

            {
                path: 'mantenimiento',
                loadChildren: () => import('../mantenimiento/mantenimiento.routes')
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
            }
        ]
    }
];
export default mainRouter;
