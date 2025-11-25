import { environment } from '@environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { PlanningData, PlanningResponse, SelectExploracion, SelectTipoLabor, SelectZona } from '../interface/aper-per-oper.interface';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    planningHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;
    data = signal<any>(null);

    private readonly VALOR_INICIAL = null;

    private _dataRoutes: WritableSignal<any> = signal(this.VALOR_INICIAL);

    public readonly dataRoutes: Signal<any> = this._dataRoutes.asReadonly();


    setData(data: any): void {
        this._dataRoutes.set(data);
    }

    clearData(): void {
        this._dataRoutes.set(this.VALOR_INICIAL);
        console.log('Signal DataService: Datos de rutas reiniciados a null.');
    }

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
        }));}

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

    public SelectExploracion(): Observable<SelectExploracion[]> {
        return this.planningHttp.get<SelectExploracion[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-exploracion`
        ).pipe(catchError(error => {
            console.log('Error al cargar los meses', error)
            return of([]);
        }));
    }

    public SelectZona(): Observable<SelectZona[]> {
        return this.planningHttp.get<SelectZona[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-zona`
        ).pipe(catchError(error => {
            console.log('Error al cargar los meses', error)
            return of([]);
        }));
    }


    public SelectTipoLabor(): Observable<SelectTipoLabor[]> {
        return this.planningHttp.get<SelectTipoLabor[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-tipo-labor`
        ).pipe(catchError(error => {
            console.log('Error al cargar los meses', error)
            return of([]);
        }));
    }
}
