import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SemanasAvanceMainService {
    private semanasAvanceHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;

    private _anio = signal<string | null>(null);
    private _mes = signal<string | null>(null);

    /* INGRESAR NUEVO REGISTRO */
    public saveDataSemanaAvance(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-guardar`, payload)
            .pipe(
                catchError(error => {
                    console.error('Error al guardar los datos', error);
                    return of(null);
                })
            );
    }

    public saveDataSemanaCiclo(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-guardar`, payload)
            .pipe(
                catchError(error => {
                    console.error('Error al guardar los datos', error);
                    return of(null);
                })
            );
    }

    



    public anio = this._anio.asReadonly();
    public mes = this._mes.asReadonly();

    // Método para actualizar
    setPeriodo(mes: string, anio: string) {
        this._mes.set(mes);
        this._anio.set(anio);
    }

}
