import { Routes } from "@angular/router";
import { MainPageComponent } from "./pages/main-page/main-page.component";


export const mainRouter: Routes = [
    {
        path: '',
        component: MainPageComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('../planing/planing.routes').then(m => m.default)
            },
            {
                path: '',
                loadChildren: () => import('../geology/geology.routes').then(m => m.default)
            }
        ]
    }
];
export default mainRouter;
