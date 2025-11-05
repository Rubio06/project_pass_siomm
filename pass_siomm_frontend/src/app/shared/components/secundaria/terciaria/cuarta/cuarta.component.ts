import { Component, Input } from '@angular/core';
import { TerciariaComponent } from '../terciaria.component';

@Component({
    selector: 'app-cuarta',
    imports: [],
    templateUrl: './cuarta.component.html',
    styleUrl: './cuarta.component.css',
})
export class CuartaComponent {
    @Input() cuarta: any;
    closeOtherMenus(event: any) { }
}
