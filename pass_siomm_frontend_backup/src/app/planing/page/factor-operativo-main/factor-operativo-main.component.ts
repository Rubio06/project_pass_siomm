import { Component, inject, signal } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AperPeriodo } from '../../interface/aper-per-oper.interface';
import { AperPerOperComponent } from '../../components/factor-operativo-components/periodo/periodo..component';
import { FactorOperativoTablaComponent } from '../../components/factor-operativo-components/factor-operativo-tabla/factor-operativo-tabla.component';
import { TransfornMonthPipe } from '../../pipe/transforn-month-pipe';
import { FactorOperativoComonent } from '../../components/factor-operativo-components/factor-operativo/factor-operativo.component';
import { ValoresComponent } from '../../components/factor-operativo-components/valores/valores.component';

@Component({
    selector: 'app-factor-operativo-main',
    imports: [
        AperPerOperComponent,
        FactorOperativoComonent,
        ValoresComponent,
        FactorOperativoTablaComponent
    ],
    templateUrl: './factor-operativo-main.component.html',
    styleUrl: './factor-operativo-main.component.css',
})
export class FactorOperativoMainComponent {

}
