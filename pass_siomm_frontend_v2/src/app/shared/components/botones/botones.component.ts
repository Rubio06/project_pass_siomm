import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit, output, signal } from '@angular/core';
import { BotonesInterface } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/interface';

@Component({
    selector: 'app-botones',
    imports: [CommonModule],
    templateUrl: './botones.component.html',
    styleUrls: ['./botones.component.css']
})
export class BotonesComponent {

    bloqueo = input<boolean>(false);

    accion = output<void>();

    texto = input.required<string>();
    icono = input.required<string>();
    color = input.required<string>();

}
