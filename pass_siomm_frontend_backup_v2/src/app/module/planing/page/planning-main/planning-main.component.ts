import { Component, inject, signal } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AperPeriodo } from '../../interface/aper-per-oper.interface';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { TransfornMonthPipe } from '../../../../core/pipe/transforn-month-pipe';

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

    public loadingService = inject(LoadingService);


    router = inject(Router);
    fb = inject(FormBuilder);

    _getDate = signal<AperPeriodo[]>([]);

    constructor() {

        this.getYear();
        // this.listenRouterEvents();
    }

    // listenRouterEvents() {
    //     this.router.events.subscribe(event => {

    //         if (event instanceof NavigationStart) {
    //             this.loadingService.loadingOn();     // mostrar loader al cambiar de ruta
    //             console.log("Tocado")
    //         }

    //         if (
    //             event instanceof NavigationEnd ||
    //             event instanceof NavigationCancel ||
    //             event instanceof NavigationError
    //         ) {
    //                             console.log("Tocado")

    //             this.loadingService.loadingOff();     // mostrar loader al cambiar de ruta
    //         }

    //     });
    // }

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

        this.planingService.getDate(yearMes, anio).subscribe({
            next: (data: any) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                    this._getDate.set(data);
                    this.planingService.setData(data);
                    this.loadingService.loadingOff();
                }
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        })
    }

    public enviarDatos(){
        
    }
}
