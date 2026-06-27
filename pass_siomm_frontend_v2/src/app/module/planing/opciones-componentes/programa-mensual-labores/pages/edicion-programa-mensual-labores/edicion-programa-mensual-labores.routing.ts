import { Routes } from '@angular/router';
import { EdicionProgramaMensualLaboresComponent } from './edicion-programa-mensual-labores.component';
import { unsavedChangesGuard } from '../../guards/unsaved-changes.guard';


export const EdicionProgramaMensualLaboresRoutes: Routes = [
    {
        path: '',
        component: EdicionProgramaMensualLaboresComponent,
        canDeactivate: [unsavedChangesGuard],

        children: [
            {
                path: '',
                redirectTo: 'edicion-exploracion',
                pathMatch: 'full',
            },

            {
                path: 'edicion-exploracion',
                title: '01 - EXPLORACION',
                loadChildren: () =>
                    import('../../components/edicion-programa-mensual-labores-componentes/side-bar/exploracion/exploraracion.routing')
                        .then(m => m.default)
            },
            {
                path: 'edicion-desarrollo',
                title: '02 - DESARROLLO',
                loadChildren: () =>
                    import('../../components/edicion-programa-mensual-labores-componentes/side-bar/desarrollo/desarrollo.routing')
                        .then(m => m.default)

            },

            {
                path: 'edicion-preparacion',
                title: '03 - PREPARACION',
                loadChildren: () =>
                    import('../../components/edicion-programa-mensual-labores-componentes/side-bar/preparacion/preparacion.routing')
                        .then(m => m.default)

            },

            {
                path: 'edicion-explotacion',
                title: '04 - EXPLOTACION',
                loadChildren: () =>
                    import('../../components/edicion-programa-mensual-labores-componentes/side-bar/explotacion/explotacion.routing')
                        .then(m => m.default)

            },
        ]

    },
];
export default EdicionProgramaMensualLaboresRoutes;
