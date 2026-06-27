import { Routes } from '@angular/router';
import { ExplotacionComponent } from './explotacion.component';
import { ProgramaExplotacionComponent } from '../tablas-programa-rendimiento/tablas-explotacion/programa/programa-explotacion.component';
import { IndiceRendimientoExplotacionComponent } from '../tablas-programa-rendimiento/tablas-explotacion/indice-rendimiento/indice-rendimiento-explotacion.component';




export const ExploracionRouter: Routes = [
    {
        path: '',
        component: ExplotacionComponent,

        children: [
            {
                path: '',
                redirectTo: 'lista-programa/04',
                pathMatch: 'full',
            },

            {
                path: 'lista-programa/:codigo_fase',
                component: ProgramaExplotacionComponent
            },


            {
                path: 'indice-rendimiento/:codigo_fase',
                component: IndiceRendimientoExplotacionComponent,
            }
        ]

    },
];

export default ExploracionRouter;
