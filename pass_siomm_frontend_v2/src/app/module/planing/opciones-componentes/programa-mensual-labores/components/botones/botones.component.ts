import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';

@Component({
    selector: 'app-botones',
    imports: [CommonModule],
    templateUrl: './botones.component.html',
    styleUrls: ['./botones.component.css']
})
export class BotonesComponent {
    texto = input.required<string>();
    accion = output<void>();
    variant = input<'success' | 'primary' | 'danger'>('primary');

}
