import { Routes } from '@angular/router';
import { MantenimientoComponent } from './pages/mantenimiento-main/mantenimiento.component';
import { LaboratorioQuimicoComponent } from './pages/laboratorio-quimico/laboratorio-quimico.component';



export const mantenimientoRouter: Routes = [
    {
        path: '',
        component: MantenimientoComponent,
        children: [

            {
                path: 'planeamiento',
                loadChildren: () => import('../mantenimiento/pages/planeamiento/planeamiento-mant.routes')
            },
            {
                path: 'laboratorio_quimico',
                component: LaboratorioQuimicoComponent

            }

        ]
    }
];

export default mantenimientoRouter;
