import { Component, input, signal } from '@angular/core';

@Component({
    selector: 'app-iconos',
    imports: [],
    templateUrl: './iconos.html',
    styleUrl: './iconos.css',
})
export class IconosComponent {

    iconos = input<string>('');

}
