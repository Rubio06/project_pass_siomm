import { Routes } from "@angular/router";
import { MainPageComponent } from "./pages/main-page/main-page.component";

export const mainRouter: Routes = [
    {
        path: '',
        component: MainPageComponent,
        children: [
            // {
            //     path: '**',
            //     redirectTo: 'main',
            //     pathMatch: 'full'
            // },
            // {
            //     path: '',
            //     component: MainPageComponent,
            // },
            // {
            //     path: '**',
            //     redirectTo: 'main',
            // },

        ]
    }
];

export default mainRouter;
