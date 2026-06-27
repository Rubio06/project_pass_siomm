import { Component, effect, input, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-edicion-programa-mensual-rutas',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './edicion-programa-mensual-rutas.component.html',
    styleUrls: ['./edicion-programa-mensual-rutas.component.css']
})
export class EdicionProgramaMensualRutasComponent  {

    // codigo_fase = signal<string | null>('')
    codigo_fase = input<string | null>(null);
    


}
