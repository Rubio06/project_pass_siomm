import { Routes } from "@angular/router";
import { MainPageComponent } from "./pages/main-page/main-page.component";


export const mainRouter: Routes = [
    {
        path: '',
        component: MainPageComponent,
        children: [
            {
                path: 'planeamiento',
                loadChildren: () => import('../planing/planing.routes')
            },
            {
                path: 'geologia',
                loadChildren: () => import('../geology/geology.routes')
            }
        ]
    }
];
export default mainRouter;
