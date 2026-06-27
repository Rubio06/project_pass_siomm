import { Routes } from '@angular/router';
import { PlaneamientoCompoent } from './planeamiento.component';
import { LaboratorioQuimicoComponent } from '../laboratorio-quimico/laboratorio-quimico.component';
import { LaborComponent } from './labor/labor.component';
import { AdmContratosComponent } from './adm-contratos/pages/lista-adm-contratos/lista-adm-contratos.component';
import { NivelComponent } from './nivel/nivel.component';
import { TipoLaborComponent } from './tipo-labor/tipo-labor.component';
import { RutaTransporteComponent } from './ruta-transporte/ruta-transporte.component';
import { RutaTransporteMovimientoComponent } from './rutas-transporte-movimiento/ruta-transporte-movimiento.component';
import { ContrataComponent } from './contrata/contrata.component';
import { VetaComponent } from './veta/veta.component';
import { ZonaComponent } from './zona/zona.component';
import { UndEconomicaComponent } from './unidad-economica/und-economica.component';


export const plantemientoMant: Routes = [
    {
        path: '',
        component: PlaneamientoCompoent,
        children: [

            // {
            //     path: 'unidad_economica',
            //     loadChildren: () => import('../planeamiento/unidad-economica/planeamiento-unidad-economica-mant.routes')
            // },

            {
                path: 'unidad_economica',
                component: UndEconomicaComponent
            },
            {
                path: 'zona',
                component: ZonaComponent
            },

            {
                path: 'veta',
                component: VetaComponent
            },
            {
                path: 'nivel',
                component: NivelComponent
            },

            {
                path: 'tipo_de_labor',
                component: TipoLaborComponent
            },
            {
                path: 'labor',
                component: LaborComponent
            },
            {
                path: 'contrata',
                component: ContrataComponent
            },

            {
                path: 'rutas_transporte',
                component: RutaTransporteComponent
            },

            {
                path: 'rutas_transporte_movimiento',
                component: RutaTransporteMovimientoComponent
            },
            {
                path: 'administracion_de_contratos',
                component: AdmContratosComponent
            }




        ]
    }
];

export default plantemientoMant;
