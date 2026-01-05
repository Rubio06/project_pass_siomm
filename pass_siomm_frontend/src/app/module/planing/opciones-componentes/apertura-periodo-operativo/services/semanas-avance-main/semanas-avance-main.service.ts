import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, Observable, of } from 'rxjs';
import { FormUtils } from 'src/app/utils/form-utils';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'


@Injectable({
    providedIn: 'root'
})
export class SemanasAvanceMainService {
    private semanasAvanceHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;

    private _anio = signal<string | null>(null);
    private _mes = signal<string | null>(null);

    public anio = this._anio.asReadonly();
    public mes = this._mes.asReadonly();

    private utils = FormUtils;

    // Método para actualizar
    setPeriodo(mes: string, anio: string) {
        this._mes.set(mes);
        this._anio.set(anio);
    }


    get devolverAnio() { return this._anio(); }
    get devolverMes() { return this._mes(); }


    nuevoMode = signal(false);

    setNuevoMode(value: boolean) {
        this.nuevoMode.set(value);
    }



    /* INGRESAR NUEVO REGISTRO */
    public saveDataSemanaAvance(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-guardar`, payload)
            .pipe(
                catchError(error => {
                    this.utils.mensajeError(error);
                    return of(null);
                })
            );
    }

    public saveDataSemanaCiclo(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-guardar`, payload)
            .pipe(
                catchError(error => {
                    this.utils.mensajeError(error);
                    return of(null);
                })
            );
    }


    /**ENDPOINS ELIMINACION DE TABLAS**/

    public eliminarSemanaAvance(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-eliminar`, payload)
            .pipe(
                catchError(error => {
                    this.utils.mensajeError(error);
                    return of(null);
                })
            );
    }

    public eliminarCiclo(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-ciclo-eliminar`, payload)
            .pipe(
                catchError(error => {
                    this.utils.mensajeError(error);
                    return of(null);
                })
            );
    }




    public eliminarMetodoMinado(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/metodo-minado-eliminar`, payload)
            .pipe(
                catchError(error => {
                    this.utils.mensajeError(error);
                    return of(null);
                })
            );
    }




    public estandarExploracion(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/estandar-exploracion-eliminar`, payload)
            .pipe(
                catchError(error => {
                    this.utils.mensajeError(error);
                    return of(null);
                })
            );
    }


    public estandarAvance(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/estandar-avance-eliminar`, payload)
            .pipe(
                catchError(error => {
                    this.utils.mensajeError(error);
                    return of(null);
                })
            );
    }
}
