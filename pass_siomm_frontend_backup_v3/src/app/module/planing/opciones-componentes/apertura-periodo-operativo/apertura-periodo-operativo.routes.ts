import { Routes } from '@angular/router';

import { FactorOperativoMainComponent } from './components/tabs-menu/factor-operativo-main/factor-operativo-main.component';
import { EstandarAvanceComponent } from './components/tabs-menu/estandar-avance-main/estandar-avance-main.component';
import { EstandarExploracionMainComponent } from './components/tabs-menu/estandar-exploracion-main/estandar-exploracion-main.component';
import { MetodoMinadoMainComponent } from './components/tabs-menu/metodo-minado-main/metodo-minado-main.component';
import { SemanasAvanceMainComponent } from './components/tabs-menu/semanas-avance-main/semanas-avance-main.component';
import { SemanasCicloMainComponent } from './components/tabs-menu/semanas-ciclo-main/semanas-ciclo-main.component';
import { AperturPeriodoComponent } from './page/planning-main/aper-periodo-operativo.component';
import { PendingChangesGuard } from 'src/app/core/guards/cambios-guard/cambios-pendientes.guard';

// ⚠️ Coloca la ruta correcta del componente

export const aperturaPeriodoOperativoRouter: Routes = [
    {
        path: '',
        component: AperturPeriodoComponent,
        children: [
            {
                path: '',
                redirectTo: 'factor-operativo',
                pathMatch: 'full' // ⚠️ Crucial: Asegura que solo redirija si el path es EXACTAMENTE vacío.
            },
            { path: 'factor-operativo', component: FactorOperativoMainComponent },
            { path: 'estandar-avance', component: EstandarAvanceComponent },
            { path: 'estandar-exploracion', component: EstandarExploracionMainComponent },
            { path: 'metodo-minado', component: MetodoMinadoMainComponent },
            { path: 'semanas-avance', component: SemanasAvanceMainComponent},
            { path: 'semanas-ciclo', component: SemanasCicloMainComponent },
        ]
    }
];

export default aperturaPeriodoOperativoRouter;
