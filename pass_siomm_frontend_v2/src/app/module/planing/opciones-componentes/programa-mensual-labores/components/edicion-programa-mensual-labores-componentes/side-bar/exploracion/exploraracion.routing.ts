import { Routes } from '@angular/router';
import { ExploracionComponent } from './exploracion.component';
import { ProgramaExplotacionComponent } from '../tablas-programa-rendimiento/tablas-explotacion/programa/programa-explotacion.component';

import { DesarrolloComponent } from '../desarrollo/desarrollo.component';
import { ProgramaComponent } from '../tablas-programa-rendimiento/tablas-generales/programa/programa.component';
import { IndiceRendimientoComponent } from '../tablas-programa-rendimiento/tablas-generales/indice-rendimiento/indice-rendimiento.component';



export const ExploracionRouters: Routes = [
    {
        path: '',
        component: ExploracionComponent,

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'lista-programa/01' // Esto es temporal, el TS hará el trabajo real
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

export default ExploracionRouters;
