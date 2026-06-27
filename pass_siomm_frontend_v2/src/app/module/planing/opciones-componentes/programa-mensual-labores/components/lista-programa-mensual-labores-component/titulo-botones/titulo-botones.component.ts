import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { BotonColores } from '../nav-bar-botones/nav-bar-botones.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-titulo-botones',
    imports: [CommonModule],
    templateUrl: './titulo-botones.component.html',
})
export class TituloBotonesComponent {

    botonActivo = input<BotonColores | null>(null);


    textoModo = computed(() => {
        const btn = this.botonActivo();
        return btn ? `Usted se encuentra en el modo ${btn.texto}` : '';
    });

    colorModo = computed(() => this.botonActivo()?.color);
}
