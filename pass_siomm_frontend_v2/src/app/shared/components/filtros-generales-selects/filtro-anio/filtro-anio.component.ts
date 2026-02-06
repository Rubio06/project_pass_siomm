import { Component, input, signal } from '@angular/core';

@Component({
    selector: 'app-filtro-anio',
    imports: [],
    templateUrl: './filtro-anio.component.html',
    styleUrl: './filtro-anio.component.css',
})
export class FiltroAnioComponent {

    listaAnio = input<string[]>([]);
}
