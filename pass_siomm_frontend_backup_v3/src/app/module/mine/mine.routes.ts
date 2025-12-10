import { Routes } from '@angular/router';
import { MineComponent } from './mine';


export const mineMainRouter: Routes = [
    {
        path: '',
        component: MineComponent,
        children: [

        ]
    }
];

export default mineMainRouter;
