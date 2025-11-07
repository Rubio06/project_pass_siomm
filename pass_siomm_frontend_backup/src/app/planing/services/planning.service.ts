import { environment } from '@environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { AperPerOper } from '../interface/aper-per-oper.interface';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {

    planningHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;

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

    public getDate(dataMes: string, dataAnio: string): Observable<AperPerOper[]>{
        return this.planningHttp.get<AperPerOper[]>(`${this.planingUrl}planeamiento/aper-periodo-operativo/fechas`,
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
}
