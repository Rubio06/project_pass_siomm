import { Component, input } from '@angular/core';

@Component({
  selector: 'app-label-filtro',
  imports: [],
  templateUrl: './label-filtro.component.html',
  styleUrl: './label-filtro.component.css',
})
export class LabelFiltroComponent {
    filtroLabel = input<string>('');

}
