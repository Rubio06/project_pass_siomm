import { Component, input } from '@angular/core';
<<<<<<< HEAD
import { ReactiveFormsModule } from '@angular/forms';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';

@Component({
  selector: 'app-filtro-mes',
  imports: [TransfornMonthPipe, ReactiveFormsModule],
=======

@Component({
  selector: 'app-filtro-mes',
  imports: [],
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
  templateUrl: './filtro-mes.component.html',
  styleUrl: './filtro-mes.component.css',
})
export class FiltroMesComponent {
<<<<<<< HEAD
    listaMeses = input<string[]>([]);
=======

    listaMeses = input<string[]>([]);

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
}
