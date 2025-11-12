import { Routes } from '@angular/router';
import { PlanningMainComponent } from './page/planning-main/planning-main.component';
import { FactorOperativoMainComponent } from './page/factor-operativo-main/factor-operativo-main.component';
import { EstandarAvanceComponent } from './page/estandar-avance-main/estandar-avance-main.component';
import { EstandarExploracionMainComponent } from './page/estandar-exploracion-main/estandar-exploracion-main.component';
import { MetodoMinadoMainComponent } from './page/metodo-minado-main/metodo-minado-main.component';
import { SemanasAvanceMainComponent } from './page/semanas-avance-main/semanas-avance-main.component';
import { SemanasCicloMainComponent } from './page/semanas-ciclo-main/semanas-ciclo-main.component';


export const planingMainRouter: Routes = [
    {
        path: '',
        component: PlanningMainComponent,
        children: [
            { path: 'factor-operativo', component: FactorOperativoMainComponent },
            { path: 'estandar-avance', component: EstandarAvanceComponent },

            { path: 'estandar-exploracion', component: EstandarExploracionMainComponent },
            { path: 'metodo-minado', component: MetodoMinadoMainComponent },
            { path: 'semanas-avance', component: SemanasAvanceMainComponent },
            { path: 'semanas-ciclo', component: SemanasCicloMainComponent },

            { path: '', redirectTo: 'factor-operativo', pathMatch: 'full' },
        ]
    }
];

export default planingMainRouter;
