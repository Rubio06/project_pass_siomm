import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';

@Component({
  selector: 'app-filtro-mes',
  imports: [TransfornMonthPipe, ReactiveFormsModule],
  templateUrl: './filtro-mes.component.html',
  styleUrl: './filtro-mes.component.css',
})
export class FiltroMesComponent {
    listaMeses = input<string[]>([]);
}
