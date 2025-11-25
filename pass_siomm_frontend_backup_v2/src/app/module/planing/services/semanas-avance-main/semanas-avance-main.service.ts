import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SemanasAvanceMainService {
    private semanasAvanceHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;


    /* INGRESAR NUEVO REGISTRO */
    public saveData(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-guardar`, payload)
            .pipe(
                catchError(error => {
                    console.error('Error al guardar los datos', error);
                    return of(null);
                })
            );
    }

}
