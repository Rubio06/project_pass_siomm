import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { environment } from '@environments/environments';
import { DetalleTicketBalanza, EntradaDatos, EntradaDetTicketBalanza, EntradaTicketBalanza, EntradaTipoDetalle, RespuestaTicketBalanza, TipoDetalleMaterial, TurnoActivo } from '../interface/balanza-detalle.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { FormUtils } from 'src/app/utils/form-utils';

@Injectable({
    providedIn: 'root',
})
export class BalanzaDetalleService {

    private httpp = inject(HttpClient);
    private balanzaDetUrl = environment.baseUrl;
    private formUtils = FormUtils;


    public obtenerBalanzaDetalle(payload: EntradaTicketBalanza): Observable<RespuestaTicketBalanza> {
        return this.httpp.post<RespuestaTicketBalanza>(
            `${this.balanzaDetUrl}planeamiento/detalle-balanza/obtener-tickets-balanza`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerBalanzaDetalleTicket(entrada: EntradaDetTicketBalanza): Observable<DetalleTicketBalanza> {
        const params = new HttpParams()
            .set('cod_empresa', entrada.cod_empresa)
            .set('cod_empresa_unidad', entrada.cod_empresa_unidad)
            .set('cod_ticket_balanza', entrada.cod_ticket_balanza);

        return this.httpp.get<DetalleTicketBalanza>(`${this.balanzaDetUrl}planeamiento/detalle-balanza/obtener-ticket-detalle`, { params })
            .pipe(
                catchError(error => {
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }

    public obtenerTurnosActivos(entrada: EntradaDatos): Observable<TurnoActivo[]> {
        const params = new HttpParams()
            .set('cod_empresa', entrada.cod_empresa)
            .set('cod_empresa_unidad', entrada.cod_empresa_unidad)

        return this.httpp.get<TurnoActivo[]>(`${this.balanzaDetUrl}planeamiento/detalle-balanza/turnos-activos`, { params })
            .pipe(
                catchError(error => {
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }

    public obtenerTipoMaterial(entrada: EntradaTipoDetalle): Observable<TipoDetalleMaterial[]> {
        const params = new HttpParams()
            .set('cod_empresa', entrada.cod_empresa)
            .set('cod_empresa_unidad', entrada.cod_empresa_unidad)
            .set('cod_tipo_material', entrada.cod_tipo_material)

        return this.httpp.get<TipoDetalleMaterial[]>(`${this.balanzaDetUrl}planeamiento/detalle-balanza/tipo-material-detalle`, { params })
            .pipe(
                catchError(error => {
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }




}
