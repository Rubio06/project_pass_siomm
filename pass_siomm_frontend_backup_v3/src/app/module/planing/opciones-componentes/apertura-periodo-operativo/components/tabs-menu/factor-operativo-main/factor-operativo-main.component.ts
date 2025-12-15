import { Component, inject } from '@angular/core';
import { AperPerOperComponent } from '../../periodo/periodo..component';
import { FactorOperativoComonent } from '../../factor-operativo/factor-operativo.component';
import { ValoresComponent } from '../../valores/valores.component';
import { FactorOperativoTablaComponent } from '../../factor-operativo-tabla/factor-operativo-tabla.component';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';



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


    semanasAvanceMainService = inject(SemanasAvanceMainService);

    hasPendingChanges(): boolean {
        console.log("entra al metodo ")
        return this.semanasAvanceMainService.getCambios(); // revisa los cambios pendientes
    }

}
