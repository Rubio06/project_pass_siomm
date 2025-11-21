import { Component, EventEmitter, inject, Output, output, signal } from '@angular/core';
import { AperPerOperComponent } from '../../components/factor-operativo-components/periodo/periodo..component';
import { FactorOperativoTablaComponent } from "../../components/factor-operativo-components/factor-operativo-tabla/factor-operativo-tabla.component";
import { PlanningService } from '../../services/planning.service';
import { TransfornMonthPipe } from '../../pipe/transforn-month-pipe';
import { FormBuilder, Validators } from '@angular/forms';
import { AperPeriodo, PlanningData, PlanningResponse } from '../../interface/aper-per-oper.interface';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { ListDesktopComponent } from 'src/app/shared/components/header-list-desktop/list-desktop.component';

@Component({
    selector: 'app-planning-main',
    imports: [CommonModule, RouterOutlet, TransfornMonthPipe, RouterLink, RouterLinkActive],
    templateUrl: './planning-main.component.html',
    styleUrl: './planning-main.component.css',
})
export class PlanningMainComponent {
    private planingService = inject(PlanningService);
    hasError = signal<string | null>('');
    _getMonths = signal<string[]>([]);
    _getYear = signal<string[]>([]);
    dataAnio = signal<string>('');
    dataMes = signal<string>('');

    isSidebarOpen = false;


    fb = inject(FormBuilder);

    _getDate = signal<AperPeriodo[]>([]);

    constructor() {
        this.getYear();
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

        const anio = this.dataAnio();

        this.planingService.getDate(yearMes, anio).subscribe({
            next: (data: any) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                    // this._getDate.set(data);

                    this.planingService.setData(data);

                }
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        })
    }
}
