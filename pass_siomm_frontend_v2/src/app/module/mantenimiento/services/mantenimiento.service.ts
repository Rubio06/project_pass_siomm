import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
    UnidadEconomica, RespuestaMantenimiento, Zona, ZonaInsert, ResponseZona, Veta, ListasSelectDto,
    RespuestaDto, EliminarVeta, Nivel, ResponseApi, ResponseEliminarDto, TipoLabor, LaborMant, ListZonas,
    LaborFiltro, PaginacionLabor, MaestrosLabor, Contrata,
    RutasTransporteFiltro, ContrataFiltro,
    RutaTransporte,
    RutasTransporteMovimiento,
    ListaRutaTransporte,
    UsuarioJefeTurno,
    UnidadEconomicaMant,

} from '../interfaces/manenimiento.interface';
import { FormUtils } from 'src/app/utils/form-utils';

@Injectable({
    providedIn: 'root'
})
export class MantenimientoService {

    private http = inject(HttpClient);
    private routeshUrl = environment.baseUrl;
    private formUtils = FormUtils;

    public obtenerEmpresa(): Observable<any[]> {
        return this.http.get<any[]>(`${this.routeshUrl}mantenimiento/opciones-modelo/empresas`
        ).pipe(catchError(error => {
            this.formUtils.mensajeError(error);
            return of([]);
        }));
    }

    public obtenerEmpresaUnidad(): Observable<any[]> {
        return this.http.get<any[]>(`${this.routeshUrl}mantenimiento/opciones-modelo/empresas-unidad`
        ).pipe(catchError(error => {
            this.formUtils.mensajeError(error);
            return of([]);
        }));
    }


    public obtenerUndEconomica(cod_empresa?: string, cod_empresa_unidad?: string, texto_busqueda?: string | null): Observable<UnidadEconomicaMant[]> {

        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }


        if (texto_busqueda) {
            params = params.set('texto_busqueda', texto_busqueda);
        }

        return this.http.get<UnidadEconomicaMant[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/unidad-economica`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    // public guardarUndEconomica(data: Partial<UnidadEconomica>[]): Observable<RespuestaMantenimiento> {

    //     return this.http.post<RespuestaMantenimiento>(
    //         `${this.routeshUrl}mantenimiento/opciones-modelo/insertar-unidad-economica`, data
    //     ).pipe(catchError(error => {
    //         this.formUtils.mensajeError(error);
    //         return of({
    //             estado: 0,
    //             mensaje: 'Error al guardar la unidad económica'
    //         });
    //     }));
    // }

    public guardarUndEconomica(und: UnidadEconomicaMant[]): Observable<RespuestaMantenimiento> {
        return this.http.post<RespuestaMantenimiento>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-unidad-economica`, und)
            .pipe(
                catchError(error => {
                    this.formUtils.mensajeError(error);
                    return of({} as RespuestaMantenimiento);
                })
            );
    }

    public eliminarUnidadEconomica(cod_empresa: string, cod_empresa_unidad: string, cod_und_economica: string): Observable<RespuestaMantenimiento> {
        return this.http.delete<RespuestaMantenimiento>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-unidad-economica`,
            {
                params: {
                    cod_empresa: cod_empresa,
                    cod_empresa_unidad: cod_empresa_unidad,
                    cod_und_economica: cod_und_economica
                }
            }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar la unidad económica'
                });
            })
        );
    }

    public eliminarZona(cod_zona: string): Observable<RespuestaMantenimiento> {
        return this.http.delete<RespuestaMantenimiento>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-zona`,
            {
                params: {

                    cod_zona: cod_zona
                }
            }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar la unidad económica'
                });
            })
        );
    }

    public obtenerCodigoSiguiente(): Observable<string> {
        return this.http.get(
            `${this.routeshUrl}mantenimiento/opciones-modelo/siguiente-codigo-unidad-economica`,
            { responseType: 'text' }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of("");
            })
        );
    }

    // public obtenerZona(cod_empresa: string, cod_empresa_unidad: string): Observable<Zona[]> {
    //     return this.http.get<Zona[]>(
    //         `${this.routeshUrl}mantenimiento/opciones-modelo/zona`,
    //         {
    //             params: {
    //                 cod_empresa: cod_empresa,
    //                 cod_empresa_unidad: cod_empresa_unidad
    //             }
    //         }
    //     ).pipe(
    //         catchError(error => {
    //             this.formUtils.mensajeError(error);
    //             return of([]);
    //         })
    //     );
    // }

    public obtenerZona(cod_empresa?: string, cod_empresa_unidad?: string, texto_busqueda?: string | null): Observable<Zona[]> {

        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }


        if (texto_busqueda) {
            params = params.set('texto_busqueda', texto_busqueda);
        }

        return this.http.get<Zona[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/zona`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerUsuario(cod_empresa?: string, cod_empresa_unidad?: string): Observable<UsuarioJefeTurno[]> {

        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }


        return this.http.get<UsuarioJefeTurno[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/usuario`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerZonaCodigo(cod_empresa: string, cod_empresa_unidad: string, cod_zona: string): Observable<Zona[]> {
        return this.http.get<Zona[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/zona-codigo`,
            {
                params: {
                    cod_empresa: cod_empresa,
                    cod_empresa_unidad: cod_empresa_unidad,
                    cod_zona: cod_zona

                }
            }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of([]);
            })
        );
    }

    public ObtenerUsuariosJefeTurno(): Observable<UsuarioJefeTurno[]> {
        return this.http.get<UsuarioJefeTurno[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/jefes-turno`,
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of([]);
            })
        );
    }

    public guardarZona(zona: Zona[]): Observable<ResponseZona> {
        return this.http.post<ResponseZona>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-zona`, zona)
            .pipe(
                catchError(error => {
                    this.formUtils.mensajeError(error);
                    return of({} as ResponseZona);
                })
            );
    }

    public obtenerCodigo(): Observable<string> {
        return this.http.get<string>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/codigo-siguiente`)
            .pipe(
                catchError(error => {
                    this.formUtils.mensajeError(error);
                    return of({} as string);
                })
            );
    }


    public obtenerVeta(cod_empresa?: string, cod_empresa_unidad?: string, texto_busqueda?: string | null): Observable<Veta[]> {
        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }

        if (texto_busqueda) {
            params = params.set('texto_busqueda', texto_busqueda);
        }

        return this.http.get<Veta[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/veta`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerVetaCodigo(cod_empresa: string, cod_empresa_unidad: string, cod_veta: string, cod_zona: string, cod_und_econom: string): Observable<Veta[]> {
        return this.http.get<Veta[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/veta-codigo`,
            {
                params: {
                    cod_empresa: cod_empresa,
                    cod_empresa_unidad: cod_empresa_unidad,
                    cod_veta: cod_veta,
                    cod_zona: cod_zona,
                    cod_und_econom: cod_und_econom
                }
            }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of([]);
            })
        );
    }

    public obtenerListasSelect(
        cod_empresa: string,
        cod_empresa_unidad: string
    ): Observable<ListasSelectDto> {

        return this.http.get<ListasSelectDto>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/listas-select`,
            {
                params: {
                    cod_empresa: cod_empresa,
                    cod_empresa_unidad: cod_empresa_unidad
                }
            }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);

                return of({
                    zonas: [],
                    unidadesEconomicas: [],
                    veta: []
                } as ListasSelectDto);
            })
        );
    }



    public eliminarVeta(cod_veta: string, cod_zona: string, cod_und_econom: string): Observable<ResponseEliminarDto> {
        console.log('🚀 Enviando al backend:', { cod_veta, cod_zona, cod_und_econom });

        return this.http.delete<ResponseEliminarDto>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-veta?cod_veta=${cod_veta}&cod_zona=${cod_zona}&cod_und_econom=${cod_und_econom}`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar la veta'
                });
            })
        );
    }

    // public guardarVeta(veta: Veta): Observable<ResponseZona> {
    //     return this.http.post<ResponseZona>(
    //         `${this.routeshUrl}mantenimiento/opciones-modelo/insertar-veta`, veta)
    //         .pipe(
    //             catchError(error => {
    //                 this.formUtils.mensajeError(error);
    //                 return of({} as ResponseZona);
    //             })
    //         );
    // }
    public guardarVeta(payload: Veta[]): Observable<ResponseApi> {

        return this.http.post<ResponseApi>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-veta`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error?.error?.mensaje || error?.message || 'Error de conexión con el servidor'
                );
                return of({} as ResponseApi);
            })
        );

    }


    public obtenerNivel(cod_empresa?: string, cod_empresa_unidad?: string, texto_busqueda?: string | null): Observable<Nivel[]> {
        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }

        if (texto_busqueda) {
            params = params.set('texto_busqueda', texto_busqueda);
        }

        return this.http.get<Nivel[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/nivel`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }


    public guardarNivel(payload: Nivel[]): Observable<ResponseApi> {

        return this.http.post<ResponseApi>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-nivel`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error?.error?.mensaje || error?.message || 'Error de conexión con el servidor'
                );
                return of({} as ResponseApi);
            })
        );

    }

    public eliminarNivel(cod_nivel: string): Observable<ResponseEliminarDto> {
        return this.http.delete<ResponseEliminarDto>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-nivel/${cod_nivel}`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar el nivel'
                });
            })
        );
    }


    public obtenerTipoLabor(cod_empresa?: string, cod_empresa_unidad?: string, texto_busqueda?: string | null): Observable<TipoLabor[]> {
        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }

        if (texto_busqueda) {
            params = params.set('texto_busqueda', texto_busqueda);
        }

        return this.http.get<TipoLabor[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/tipo-labor`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }



    public guardarTipoLabor(payload: TipoLabor[]): Observable<ResponseApi> {

        return this.http.post<ResponseApi>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-tipo-labor`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error?.error?.mensaje || error?.message || 'Error de conexión con el servidor'
                );
                return of({} as ResponseApi);
            })
        );

    }

    public eliminarTipoLabor(cod_tipo_labor: string): Observable<ResponseEliminarDto> {
        return this.http.delete<ResponseEliminarDto>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-tipo-labor/${cod_tipo_labor}`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar el nivel'
                });
            })
        );
    }



    public obtenerLabor(filtros: LaborFiltro): Observable<PaginacionLabor> {
        let params = new HttpParams();

        if (filtros.cod_empresa) {
            params = params.set('cod_empresa', filtros.cod_empresa);
        }

        if (filtros.cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', filtros.cod_empresa_unidad);
        }

        if (filtros.cod_zona) {
            params = params.set('cod_zona', filtros.cod_zona);
        }

        if (filtros.texto_busqueda) {
            params = params.set('texto_busqueda', filtros.texto_busqueda);
        }

        if (filtros.pagina) {
            params = params.set('pagina', filtros.pagina);
        }

        if (filtros.cantidad_reg) {
            params = params.set('cantidad_reg', filtros.cantidad_reg);
        }

        return this.http.get<PaginacionLabor>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/labor-mant`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public listarZonasMant(cod_empresa?: string, cod_empresa_unidad?: string): Observable<ListZonas[]> {
        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }

        return this.http.get<ListZonas[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/zonas-mant`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }


    public obtenerMaestrosLabor(cod_empresa?: string, cod_empresa_unidad?: string): Observable<MaestrosLabor> {
        let params = new HttpParams();

        if (cod_empresa) {
            params = params.set('cod_empresa', cod_empresa);
        }

        if (cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', cod_empresa_unidad);
        }

        return this.http.get<MaestrosLabor>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/maestros-labores-mant`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public eliminarLabor(data: LaborMant): Observable<ResponseEliminarDto> {
        return this.http.delete<ResponseEliminarDto>(
            // 🎯 La URL queda limpia, sin parámetros al final
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-labor`,
            {
                // 🚀 Aquí viaja tu objeto completo con todos sus campos en el Body
                body: data
            }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar la labor minera'
                });
            })
        );
    }

    public guardarLabor(payload: LaborMant[]): Observable<ResponseApi> {

        return this.http.post<ResponseApi>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-labor`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error?.error?.mensaje || error?.message || 'Error de conexión con el servidor'
                );
                return of({} as ResponseApi);
            })
        );

    }

    public obtenerContrata(data: ContrataFiltro): Observable<Contrata[]> {

        let params = new HttpParams();

        if (data.cod_empresa) {
            params = params.set('cod_empresa', data.cod_empresa);
        }

        if (data.texto_busqueda) {
            params = params.set('texto_busqueda', data.texto_busqueda);
        }

        return this.http.get<Contrata[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/contrata`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public eliminarContrata(cod_contrata: string): Observable<ResponseEliminarDto> {
        return this.http.delete<ResponseEliminarDto>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-contrata/${cod_contrata}`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar la contrata'
                });
            })
        );
    }

    public obtenerCodigoContrata(): Observable<string> {
        return this.http.get(
            `${this.routeshUrl}mantenimiento/opciones-modelo/obtener-codigo-contrata`,
            { responseType: 'text' }
        );
    }
    public guardarContrata(payload: Contrata[]): Observable<ResponseApi> {

        return this.http.post<ResponseApi>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-contrata`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error?.error?.mensaje || error?.message || 'Error de conexión con el servidor'
                );
                return of({} as ResponseApi);
            })
        );

    }

    public obtenerRutasTransporte(data: RutasTransporteFiltro): Observable<RutaTransporte[]> {

        let params = new HttpParams();

        if (data.cod_empresa) {
            params = params.set('cod_empresa', data.cod_empresa);
        }

        if (data.cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', data.cod_empresa_unidad);
        }


        if (data.texto_busqueda) {
            params = params.set('texto_busqueda', data.texto_busqueda);
        }

        return this.http.get<RutaTransporte[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/rutas-transporte`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerCodigoRutaTransporte(): Observable<string> {
        return this.http.get<string>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/obtener-codigo-ruta-transporte`,
        );
    }


    public eliminarRutaTransporte(cod_ruta: string): Observable<ResponseEliminarDto> {
        return this.http.delete<ResponseEliminarDto>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-ruta-transporte/${cod_ruta}`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar la contrata'
                });
            })
        );
    }

    public guardarRutaTrasnporte(payload: RutaTransporte[]): Observable<ResponseApi> {

        return this.http.post<ResponseApi>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-ruta-transporte`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error?.error?.mensaje || error?.message || 'Error de conexión con el servidor'
                );
                return of({} as ResponseApi);
            })
        );

    }


    public obtenerRutasTransporteMovimiento(data: RutasTransporteFiltro): Observable<RutasTransporteMovimiento[]> {

        let params = new HttpParams();

        if (data.cod_empresa) {
            params = params.set('cod_empresa', data.cod_empresa);
        }

        if (data.cod_empresa_unidad) {
            params = params.set('cod_empresa_unidad', data.cod_empresa_unidad);
        }


        if (data.texto_busqueda) {
            params = params.set('texto_busqueda', data.texto_busqueda);
        }

        return this.http.get<RutasTransporteMovimiento[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/rutas-transporte-movimiento`,
            { params }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public listaRutasTransporte(): Observable<ListaRutaTransporte[]> {

        return this.http.get<ListaRutaTransporte[]>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/rutas-transporte-movimiento-lista`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }


    public eliminarRutaTransporteMovimiento(cod_ruta_transporte: string): Observable<ResponseEliminarDto> {
        return this.http.delete<ResponseEliminarDto>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/eliminar-ruta-transporte-movimiento/${cod_ruta_transporte}`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return of({
                    estado: 0,
                    mensaje: 'Error al eliminar la contrata'
                });
            })
        );
    }

    public guardarRutaTrasnporteMovimiento(payload: RutasTransporteMovimiento[]): Observable<ResponseApi> {

        return this.http.post<ResponseApi>(
            `${this.routeshUrl}mantenimiento/opciones-modelo/guardar-ruta-transporte-movimiento`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error?.error?.mensaje || error?.message || 'Error de conexión con el servidor'
                );
                return of({} as ResponseApi);
            })
        );

    }

    public obtenerCodigoRutaTransporteMovimiento(): Observable<string> {
        return this.http.get(
            `${this.routeshUrl}mantenimiento/opciones-modelo/obtener-codigo-ruta-transporte-movimiento`,
            { responseType: 'text' }
        )

    }


    public obtenerAdmContrata(): Observable<Contrata[]> {
        return this.http.get<Contrata[]>(`${this.routeshUrl}mantenimiento/opciones-modelo/listar-contrata`
        ).pipe(catchError(error => {
            this.formUtils.mensajeError(error);
            return of([]);
        }));
    }







}
