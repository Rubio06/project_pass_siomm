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
}
