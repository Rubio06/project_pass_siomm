import { Component, Input } from '@angular/core';
import { CuartaComponent } from './cuarta/cuarta.component';

@Component({
    selector: 'app-terciaria',
    imports: [CuartaComponent],
    templateUrl: './terciaria.component.html',
    styleUrl: './terciaria.component.css',
})
export class TerciariaComponent {
    @Input() terciaria: any;
    closeOtherMenus(event: any) { }
}
