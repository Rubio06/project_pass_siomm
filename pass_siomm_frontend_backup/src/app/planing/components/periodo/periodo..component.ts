import { CommonModule } from '@angular/common';
import { AperPerOper } from '../../interface/aper-per-oper.interface';
import { TransfornMonthPipe } from '../../pipe/transforn-month-pipe';
import { PlanningService } from '../../services/planning.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-periodo',
    standalone: true,
    imports: [TransfornMonthPipe, CommonModule, ReactiveFormsModule],
    templateUrl: './periodo.component.html',
    styleUrl: './periodo.component.css',
})
export class AperPerOperComponent {

    planingService = inject(PlanningService);
    hasError = signal<string | null>('');
    _getMonths = signal<string[]>([]);
    _getYear = signal<string[]>([]);
    dataAnio = signal<string>('');
    dataMes = signal<string>('');


    fb = inject(FormBuilder);

    _getDate = signal<AperPerOper[]>([]);


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
            next: (data: AperPerOper[]) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                    this._getDate.set(data);

                    const obj = data[0];
                    this.formatDate(obj)

                }
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        })
    }

    public formatDate(obj: any) {
        const startDate = new Date(obj.fechaInicio).toISOString().split('T')[0];
        const endDate = new Date(obj.fechaFin).toISOString().split('T')[0];

        this.showData.patchValue({
            fechaInicio: startDate,
            fechaFin: endDate
        });
    }
}
