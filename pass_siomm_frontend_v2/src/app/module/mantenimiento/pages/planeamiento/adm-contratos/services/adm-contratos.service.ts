import { inject, Injectable } from '@angular/core';
import { FormUtils } from 'src/app/utils/form-utils';
import { ContratoDetalleResponse, FiltrosAdmContrato, ServicioTransporteEntrada, ServicoTransporte } from '../interfaces/adm-contrato.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environments';

@Injectable({
    providedIn: 'root',
})
export class AdmContratosServvice {
    private http = inject(HttpClient);
    private routeshUrl = environment.baseUrl;
    private formUtils = FormUtils;


    public listarAdmContrato(filtros: FiltrosAdmContrato): Observable<ContratoDetalleResponse[]> {

        let params = new HttpParams()
            .set('cod_empresa', '03')
            .set('cod_empresa_unidad', '01')
            .set('cod_contrata', filtros.cod_contrata ?? '%')
            .set('cod_contrato', filtros.cod_contrato ?? '')
            .set('ind_estado', filtros.ind_estado ?? '%');

        // Solo agrega si tienen valor (checkbox activo)
        if (filtros.fec_inicio) params = params.set('fec_inicio', filtros.fec_inicio);
        if (filtros.fec_termino) params = params.set('fec_termino', filtros.fec_termino);
        if (filtros.dia_ini) params = params.set('dia_ini', filtros.dia_ini);
        if (filtros.dia_fin) params = params.set('dia_fin', filtros.dia_fin);

        return this.http.get<ContratoDetalleResponse[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/obtener-adm-contrato`, {
            params
        }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }


    public obtenerServicioTransporte(tra: ServicioTransporteEntrada): Observable<ContratoDetalleResponse> {

        let params = new HttpParams()
            .set('cod_empresa', tra.cod_empresa)
            .set('cod_empresa_unidad', tra.cod_empresa_unidad)
            .set('cod_contrato', tra.cod_contrato)

        return this.http.get<ContratoDetalleResponse>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/listar`, {
            params
        }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }



}
