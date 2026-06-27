import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-tab-mantenimiento',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './tab-mantenimiento.component.html',
    styleUrl: './tab-mantenimiento.component.css',

})
export class TabMantenimientoComponent { }
