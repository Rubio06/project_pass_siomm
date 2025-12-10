import { Component, effect, inject, signal } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';

import { AperPeriodo } from '../../interface/aper-per-oper.interface';
import { FactorOperativoComonent } from '../../components/factor-operativo/factor-operativo.component';
import { SemanasCicloMainComponent } from '../../components/tabs-menu/semanas-ciclo-main/semanas-ciclo-main.component';


@Component({
    selector: 'app-planning-main',
    imports: [RouterOutlet, TransfornMonthPipe, RouterLink, RouterLinkActive, ReactiveFormsModule],
    templateUrl: './aper-periodo-operativo.component.html',
    styleUrl: './aper-periodo-operativo.component.css',
})
export class AperturPeriodoComponent {
    planingService = inject(PlanningService);
    hasError = signal<string | null>('');
    _getMonths = signal<string[]>([]);
    _getYear = signal<string[]>([]);
    dataAnio = signal<string>('');
    dataMes = signal<string>('');

    semanaAvance = inject(SemanasAvanceMainService);

    tab: 'factor' | 'semana' = 'factor';

    bloqueo = signal<boolean>(true);

    public loadingService = inject(LoadingService);

    router = inject(Router);
    fb = inject(FormBuilder);

    _getDate = signal<AperPeriodo[]>([]);

    textoBoton = 'Bloqueado';


    constructor() {

        this.getYear();

        effect(() => {
            this.textoBoton = this.planingService.bloqueo() ? 'Bloqueado' : 'Desbloqueado';
        });
    }

    showData = this.fb.group({
        fechaInicio: ['', [Validators.required]],
        fechaFin: ['', [Validators.required]]
    });

    public sendYear(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const yearData = selectElement.value;

        this.planingService.getMonths(yearData).subscribe({
            next: (data: string[]) => {
                if (data.length === 0) {
                    this.hasError.set('No hay meses disponibles.');
                } else {
                    this.hasError.set(null);
                    this._getMonths.set(data);
                    this.dataAnio.set(yearData);
                }
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        })
    }

    public getYear() {
        this.planingService.getYear().subscribe({
            next: (data: string[]) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                    this._getYear.set(data);

                }
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        })
    }

    public sendMonth(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const yearMes = selectElement.value;
        this.dataMes.set(yearMes);
        this.loadingService.loadingOn();
        const anio = this.dataAnio();


        // ⬅️ ENVÍA AL SERVICIO COMPARTIDO
        this.semanaAvance.setPeriodo(yearMes, anio);

        this.planingService.getDate(yearMes, anio).subscribe({
            next: (data: any) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                    this._getDate.set(data);
                    this.planingService.setData(data);
                    this.loadingService.loadingOff();
                    this.bloqueo.set(false);

                    console.log(this._getDate())
                }
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        })
    }


    toggleBloqueo() {
        this.planingService.setData([]);
        const estadoActual = this.planingService.bloqueoForm();
        this.planingService.setBloqueoForm(!estadoActual); // cambia el estado
    }


    editar() {
        // ➡️ Llama al método para cambiar la señal en el servicio.
        // Si estaba bloqueado (true), lo cambia a desbloqueado (false).
        this.planingService.toggleBloqueoEdit();
    }
}
