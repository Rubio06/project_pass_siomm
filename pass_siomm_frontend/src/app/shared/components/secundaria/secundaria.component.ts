import { Component, Input } from '@angular/core';
import { TerciariaComponent } from './terciaria/terciaria.component';

@Component({
    selector: 'app-secundaria',
    imports: [TerciariaComponent],
    templateUrl: './secundaria.component.html',
    styleUrl: './secundaria.component.css',
})
export class SecundariaComponent {
    @Input() secundaria: any;
    closeOtherMenus(event: any) { }

}
