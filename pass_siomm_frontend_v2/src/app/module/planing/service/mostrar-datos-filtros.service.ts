import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '@environments/environments';
import { FormUtils } from 'src/app/utils/form-utils';

@Injectable({
    providedIn: 'root'
})
export class MostrarDatosFiltrosService {


    planningHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;
    utils = FormUtils;

    public getMonths(yearData: string): Observable<string[]> {
        return this.planningHttp.get<string[]>(`${this.planingUrl}fechas-filtros/select-data/meses`,
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
            `${this.planingUrl}fechas-filtros/select-data/anio`
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }
}
