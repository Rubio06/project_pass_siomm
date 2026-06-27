import { Routes } from '@angular/router';
import { PreparacionComponent } from './preparacion.component';
import { ProgramaComponent } from '../tablas-programa-rendimiento/tablas-generales/programa/programa.component';
import { IndiceRendimientoComponent } from '../tablas-programa-rendimiento/tablas-generales/indice-rendimiento/indice-rendimiento.component';


export const PreparacionRouters: Routes = [
    {
        path: '',
        component: PreparacionComponent,

        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'lista-programa/03' // Esto es temporal, el TS hará el trabajo real
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

export default PreparacionRouters;
