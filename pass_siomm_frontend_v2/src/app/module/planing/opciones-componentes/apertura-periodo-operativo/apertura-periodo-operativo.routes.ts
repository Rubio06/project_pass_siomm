import { Routes, CanActivate, CanDeactivate } from '@angular/router';

import { FactorOperativoMainComponent } from './components/tabs-menu/factor-operativo-main/factor-operativo-main.component';
import { EstandarAvanceComponent } from './components/tabs-menu/estandar-avance-main/estandar-avance-main.component';
import { EstandarExploracionMainComponent } from './components/tabs-menu/estandar-exploracion-main/estandar-exploracion-main.component';
import { MetodoMinadoMainComponent } from './components/tabs-menu/metodo-minado-main/metodo-minado-main.component';
import { SemanasAvanceMainComponent } from './components/tabs-menu/semanas-avance-main/semanas-avance-main.component';
import { SemanasCicloMainComponent } from './components/tabs-menu/semanas-ciclo-main/semanas-ciclo-main.component';
import { AperturPeriodoComponent } from './page/planning-main/aper-periodo-operativo.component';
import { PendingGeneralGuard } from 'src/app/core/guards/cambios-guard/cambios-pendientes.guard';
// import { PendingTabsGuard } from 'src/app/core/guards/cambios-guard/cambios-pendientes.guard';

// ⚠️ Coloca la ruta correcta del componente

export const aperturaPeriodoOperativoRouter: Routes = [
    {
        path: '',
        component: AperturPeriodoComponent,
<<<<<<< HEAD
=======
        data: { noReuse: true },
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        children: [
            {
                path: '',
                redirectTo: 'factor-operativo',
                pathMatch: 'full',  // ⚠️ Crucial: Asegura que solo redirija si el path es EXACTAMENTE vacío.
            },
<<<<<<< HEAD
            { path: 'factor-operativo', component: FactorOperativoMainComponent, canDeactivate: [PendingGeneralGuard] },
            { path: 'estandar-avance', component: EstandarAvanceComponent, canDeactivate: [PendingGeneralGuard] },
            { path: 'estandar-exploracion', component: EstandarExploracionMainComponent, canDeactivate: [PendingGeneralGuard] },
            { path: 'metodo-minado', component: MetodoMinadoMainComponent, canDeactivate: [PendingGeneralGuard] },
            { path: 'semanas-avance', component: SemanasAvanceMainComponent, canDeactivate: [PendingGeneralGuard] },
            { path: 'semanas-ciclo', component: SemanasCicloMainComponent, canDeactivate: [PendingGeneralGuard] },
        ]
    }
];
export default aperturaPeriodoOperativoRouter;
=======
            { path: 'factor-operativo', component: FactorOperativoMainComponent, canDeactivate: [PendingGeneralGuard], data: { noReuse: true } },
            { path: 'estandar-avance', component: EstandarAvanceComponent, canDeactivate: [PendingGeneralGuard], data: { noReuse: true } },
            { path: 'estandar-exploracion', component: EstandarExploracionMainComponent, canDeactivate: [PendingGeneralGuard], data: { noReuse: true } },
            { path: 'metodo-minado', component: MetodoMinadoMainComponent, canDeactivate: [PendingGeneralGuard], data: { noReuse: true } },
            { path: 'semanas-avance', component: SemanasAvanceMainComponent, canDeactivate: [PendingGeneralGuard], data: { noReuse: true } },
            { path: 'semanas-ciclo', component: SemanasCicloMainComponent, canDeactivate: [PendingGeneralGuard], data: { noReuse: true } },
        ]
    }
];
export default aperturaPeriodoOperativoRouter;
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
