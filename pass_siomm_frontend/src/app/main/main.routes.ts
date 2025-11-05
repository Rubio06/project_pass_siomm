import { Routes } from "@angular/router";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { AuthGuard } from "../auth/guards/auth-guard.guard";

export const mainRouter: Routes = [
    {
        path: '',
        component: MainPageComponent,
        // canActivate: [AuthGuard],
        // children: [
        //       {
        //         path: 'dashboard',
        //         loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
        //       },
        //     {
        //         path: '**',
        //         redirectTo: 'dashboard'
        //     }
        // ]
    }
];
export default mainRouter;
