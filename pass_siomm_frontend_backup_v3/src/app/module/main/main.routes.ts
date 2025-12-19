import { Routes } from "@angular/router";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { PendingChangesGuard } from "src/app/core/guards/cambios-guard/cambios-pendientes.guard";


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
            }
        ]
    }
];
export default mainRouter;
