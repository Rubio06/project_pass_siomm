import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, Observable, of } from 'rxjs';
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


    /* INGRESAR NUEVO REGISTRO */
    public saveDataSemanaAvance(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-guardar`, payload)
            .pipe(
                catchError(error => {
                    this.mensajeError(error);
                    return of(null);
                })
            );
    }

    public saveDataSemanaCiclo(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-guardar`, payload)
            .pipe(
                catchError(error => {
                    this.mensajeError(error);
                    return of(null);
                })
            );
    }

    // Método para actualizar
    setPeriodo(mes: string, anio: string) {
        this._mes.set(mes);
        this._anio.set(anio);
    }


    // public eliminarSemana(data: any): Observable<any> {
    //     // Enviamos los datos eliminados al backend
    //     return this.semanasAvanceHttp.post(`${this.planingUrl}/eliminar`, data);
    // }


    public eliminarSemana(payload: any): Observable<any> {
        return this.semanasAvanceHttp.post<any>(`${this.planingUrl}aper-periodo-operativo/semana/semana-avance-eliminar`, payload)
            .pipe(
                catchError(error => {
                    this.mensajeError(error);
                    return of(null);
                })
            );
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
