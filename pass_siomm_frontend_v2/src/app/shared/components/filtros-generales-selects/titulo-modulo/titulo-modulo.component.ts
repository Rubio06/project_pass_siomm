import { Component, input } from '@angular/core';

@Component({
    selector: 'app-titulo-modulo',
    imports: [],
    templateUrl: './titulo-modulo.component.html',
    styleUrl: './titulo-modulo.component.css',
})
export class TituloModuloComponent {
    titulo = input<string>('');
}
