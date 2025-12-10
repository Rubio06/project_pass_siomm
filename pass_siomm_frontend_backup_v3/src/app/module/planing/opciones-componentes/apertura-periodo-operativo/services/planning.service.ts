import { environment } from '@environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { PlanningData, SelectExploracion, SelectTipoLabor, SelectZona } from '../interface/aper-per-oper.interface';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    planningHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;



    data = signal<any>(null);
    private _dataRoutes: WritableSignal<any> = signal([]);
    public readonly dataRoutes: Signal<any> = this._dataRoutes.asReadonly();


    setData(data: any): void {
        this._dataRoutes.set(data);
    }


    private _bloqueo = signal<boolean>(true);
    public bloqueo = this._bloqueo.asReadonly();

    setBloqueo(v: boolean) {
        this._bloqueo.set(v);
    }


    readonly bloqueoFormEdit: WritableSignal<boolean> = signal(true);
    private _bloqueoForm = signal<boolean>(true); // true = bloqueado
    public bloqueoForm = this._bloqueoForm.asReadonly();

    setBloqueoForm(valor: boolean) {
        this._bloqueoForm.set(false);
    }



    public getMonths(yearData: string): Observable<string[]> {
        return this.planningHttp.get<string[]>(`${this.planingUrl}planeamiento/aper-periodo-operativo/meses`,
            {
                params: {
                    year: yearData
                }
            }
        ).pipe(catchError(error => {
            this.mensajeError(error.message)
            return of([]);
        }));
    }

    public getYear(): Observable<string[]> {
        return this.planningHttp.get<string[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/anio`
        ).pipe(catchError(error => {
            this.mensajeError(error.message)
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
            this.mensajeError(error.message)

            return of([]);
        }))
    }

    public SelectExploracion(): Observable<SelectExploracion[]> {
        return this.planningHttp.get<SelectExploracion[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-exploracion`
        ).pipe(catchError(error => {
            this.mensajeError(error.message)


            return of([]);
        }));
    }

    public SelectZona(): Observable<SelectZona[]> {
        return this.planningHttp.get<SelectZona[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-zona`
        ).pipe(catchError(error => {
            this.mensajeError(error.message)

            return of([]);
        }));
    }


    public SelectTipoLabor(): Observable<SelectTipoLabor[]> {
        return this.planningHttp.get<SelectTipoLabor[]>(
            `${this.planingUrl}planeamiento/aper-periodo-operativo/select-tipo-labor`
        ).pipe(catchError(error => {
            this.mensajeError(error.message)
            return of([]);
        }));
    }

    mensajeError(error: any) {
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: `
            <div style="text-align:left;">
                <b>Detalle técnico:</b><br>
                <span style="font-size:14px; color:#444;">${error}</span><br><br>
                <b>Recomendación:</b><br>
                <span style="font-size:14px; color:#444;">
                    Comuníquese con Soporte TI para más asistencia.
                </span>
            </div>
        `,
            background: "#fefefe",
            color: "#333",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#d33",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }


}
