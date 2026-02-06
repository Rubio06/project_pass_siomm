import { Component, input } from '@angular/core';

@Component({
  selector: 'app-filtro-mes',
  imports: [],
  templateUrl: './filtro-mes.component.html',
  styleUrl: './filtro-mes.component.css',
})
export class FiltroMesComponent {

    listaMeses = input<string[]>([]);

}
