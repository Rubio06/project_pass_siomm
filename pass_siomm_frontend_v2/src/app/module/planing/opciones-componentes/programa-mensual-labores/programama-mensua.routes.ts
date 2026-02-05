import { Routes } from "@angular/router";

export const programaMensualRouter: Routes = [
    {
        path: '',
        children: [
            {
                path: 'basic',
                title: 'Basicos',
                // component: BasicPageComponent
            },
            {
                path: 'dynamic',
                title: 'Dinamicos',
                // component: DynamicPageComponent
            },
            {
                path: 'switches',
                title: 'Switches',
                // component: SwitechsPagesComponent
            },
            {
                path: '**',
                redirectTo: 'basic'
            }
        ]
    }
];
export default programaMensualRouter;
