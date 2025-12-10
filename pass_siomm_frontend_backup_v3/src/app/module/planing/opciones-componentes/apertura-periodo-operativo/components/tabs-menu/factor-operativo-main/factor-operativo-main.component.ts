import { Component } from '@angular/core';
import { AperPerOperComponent } from '../../periodo/periodo..component';
import { FactorOperativoComonent } from '../../factor-operativo/factor-operativo.component';
import { ValoresComponent } from '../../valores/valores.component';
import { FactorOperativoTablaComponent } from '../../factor-operativo-tabla/factor-operativo-tabla.component';



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
