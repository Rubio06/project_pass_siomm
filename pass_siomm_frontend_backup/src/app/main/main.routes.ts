import { Routes } from "@angular/router";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { AuthGuard } from "../auth/guards/auth-guard.guard";
import { AperPerOperComponent } from "../planing/components/factor-operativo-components/periodo/periodo..component";
import { PlanningMainComponent } from "../planing/page/planning-main/planning-main.component";

export const mainRouter: Routes = [
    {
        path: '',
        component: MainPageComponent,
        children: [
            {
                path: 'Apertura_de_Periodo_Operativo',
                loadChildren: () => import('../planing/planing.routes').then(m => m.default)
            }
        ]
    }
];
export default mainRouter;
