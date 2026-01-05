import { Routes } from '@angular/router';
import { PlanComponent } from './plan';


export const planMainRouter: Routes = [
    {
        path: '',
        component: PlanComponent,
        children: [

        ]
    }
];

export default planMainRouter;
