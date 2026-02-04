import { environment } from '@environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { PlanningData, SelectExploracion, SelectTipoLabor, SelectZona } from '../interface/aper-per-oper.interface';
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';
import { FormUtils } from 'src/app/utils/form-utils';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    planningHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;
    utils = FormUtils;

    public getMonths(yearData: string): Observable<string[]> {
        return this.planningHttp.get<string[]>(`${this.planingUrl}planeamiento/aper-periodo-operativo/meses`,
            {
                params: {
                    year: yearData
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }

    public getYear(): Observable<string[]> {
        return this.planningHttp.get<string[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/anio`
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }

    public getDate(dataMes: string, dataAnio: string): Observable<any[]> {
        return this.planningHttp.get<PlanningData[]>(`${this.planingUrl}planeamiento/aper-periodo-operativo/obtener-datos`,
            {
                params: {
                    month: dataMes,
                    anio: dataAnio,
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)

            return of([]);
        }))
    }

    public SelectExploracion(): Observable<SelectExploracion[]> {
        return this.planningHttp.get<SelectExploracion[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-exploracion`
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)


            return of([]);
        }));
    }

    public SelectZona(): Observable<SelectZona[]> {
        return this.planningHttp.get<SelectZona[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-zona`
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)

            return of([]);
        }));
    }


    public SelectTipoLabor(): Observable<SelectTipoLabor[]> {
        return this.planningHttp.get<SelectTipoLabor[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-tipo-labor`
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }

    public bloqueoSelect(anio?: string, mes?: string, tipoConsulta?: string): Observable<any[]> {
        let params = new HttpParams();

        if (anio) params = params.set('anio', anio);
        if (mes) params = params.set('mes', mes);
        if (tipoConsulta != null) params = params.set('tipoConsulta', tipoConsulta); // <-- nuevo parámetro

        return this.planningHttp.get<any[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-lab-estandar-bloqueo`,
            { params } // enviamos los query params
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.message);
                return of([]);
            })
        );
    }

    public listaEnteros(anio?: string, mes?: string, tipoConsulta?: string): Observable<any[]> {
        let params = new HttpParams();

        if (anio) params = params.set('anio', anio);
        if (mes) params = params.set('mes', mes);
        if (tipoConsulta != null) params = params.set('tipoConsulta', tipoConsulta); // <-- nuevo parámetro

        return this.planningHttp.get<any[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/lista-enteros-num-semana`,
            { params } // enviamos los query params
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.message);
                return of([]);
            })
        );
    }

}
