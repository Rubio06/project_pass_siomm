import { Routes } from '@angular/router';

import { DesarrolloComponent } from './desarrollo.component';
import { IndiceRendimientoComponent } from '../tablas-programa-rendimiento/tablas-generales/indice-rendimiento/indice-rendimiento.component';
import { ProgramaComponent } from '../tablas-programa-rendimiento/tablas-generales/programa/programa.component';


export const DesarrolloRouters: Routes = [
    {
        //02
        path: '',
        component: DesarrolloComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'lista-programa/02' // ruta inicial
            },

            {
                path: 'lista-programa/:codigo_fase',
                component: ProgramaComponent
            },

            {
                path: 'indice-rendimiento/:codigo_fase',
                component: IndiceRendimientoComponent,
            }
        ]
    },
];
export default DesarrolloRouters;
