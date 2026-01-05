import { Routes } from '@angular/router';
import { GeologyComponent } from './geology';


export const geologyMainRouter: Routes = [
    {
        path: '',
        component: GeologyComponent,
        children: [

        ]
    }
];

export default geologyMainRouter;
