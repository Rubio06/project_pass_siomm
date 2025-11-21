import { Routes } from '@angular/router';
import { ChemimcalLaboratoryComponent } from './chemimcal-laboratory';


export const chemialLaboratoryMainRouter: Routes = [
    {
        path: '',
        component: ChemimcalLaboratoryComponent,
        children: [

        ]
    }
];

export default chemialLaboratoryMainRouter;
