import { environment } from '@environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { PlanningData, PlanningResponse } from '../interface/aper-per-oper.interface';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    planningHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;

    data = signal<any>(null);

    public getMonths(yearData: string): Observable<string[]> {
        return this.planningHttp.get<string[]>(`${this.planingUrl}planeamiento/aper-periodo-operativo/meses`,
            {
                params: {
                    year: yearData
                }
            }
        ).pipe(catchError(error => {
            console.log('Error al cargar los meses', error)
            return of([]);
        }));
    }

    public getYear(): Observable<string[]> {
        return this.planningHttp.get<string[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/anio`
        ).pipe(catchError(error => {
            console.log('Error al cargar los meses', error)
            return of([]);
        }));
    }

    public getDate(dataMes: string, dataAnio: string): Observable<any[]> {
        return this.planningHttp.get<PlanningData[]>(`${this.planingUrl}planeamiento/aper-periodo-operativo/obtener-datos`,
            {
                params: {
                    month: dataMes,
                    anio: dataAnio
                }
            }
        ).pipe(catchError(error => {
            console.log('Error al cargar los meses', error)
            return of([]);
        }))
    }

    setData(data: any) {
        this.data.set(data);
    }

    esISO(valor: string): boolean {
        return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(valor);
    }

    formatearISOaDDMMYYYY(fechaISO: string): string {
        if (!fechaISO) return '';
        const fecha = new Date(fechaISO);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}/${mes}/${anio}`;
    }
}
