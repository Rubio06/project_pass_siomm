import { inject, Injectable } from '@angular/core';
import { FormUtils } from 'src/app/utils/form-utils';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environments';
import { ActividadTareaMant, CatalogoTarea, CatalogoTareaFiltro, CentroCosto, ContratoEquipoVehiculo, ContratoEquipoVehiculoRequest, ContratoPayload, CostosFijosDetalle, CostosFijosMae, CuentaContable, DetallePuResultado, DetTarifarioTransporteMaterial, EliminarPartidaDto, EliminarRespuestaDto, EliminarTarifarioEquiposAlquiler, EliminarTarifarioTransporte, EliminarTarifarioTransporteMaterial, EntradaCostoFijo, EntradaEliminarPrecioUnitario, EntradaPuCabTab, EntradaTablaDetalle, EntradaTarifarioDetalle, EntradaTarifarioDetalleReporte, EntradaTarifarioMaterial, GastosGenerales, GastosGeneralesInsertarDTO, GastosGeneralesRequest, GastosGneralesRequest, MaeContrataAdmDto, MaeTablaDetalleDto, MaeTablaDetalleRequest, PaginacionTarifarioDetalle, ParametroContrato, ParametroMedicionDto, ParametrosContratoDto, PartidaPuInsertDto, PartidaPuListarDto, PartidaPUModel, ProcesarResult, ReporteTransporteOtrosResponse, RespuestaApiDto, RespuestaServidor, RespuestaSpDto, RespuestaTarifario, RespuestCostoFijo, ResultadoDatosDto, RutasFijasBalanza, RutaTransporte, SvalDetTarifarioEquiposAlquiler, SvalDetTarifarioTransporte, SvalMaeEquipo, SvalMaeTablaDetalle, SvalTablaDetalle, TablaDetalle, TablaDetalleDto, TablaDetalleRequest, TarifarioTransporteDetalle, ZonaPu } from '../interfaces/servicio-transporte.interface';
import { ContratoEquipoPesado, ContratoMedicion, ContratoParametro } from '../../../interfaces/adm-contrato.interface';

@Injectable({
    providedIn: 'root',
})
export class ServioTransporteService {
    private http = inject(HttpClient);
    private routeshUrl = environment.baseUrl;
    private formUtils = FormUtils;



    public obtenerServicioTransporte(): Observable<MaeContrataAdmDto[]> {

        return this.http.get<MaeContrataAdmDto[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/listar-contrata`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerEquiposContrata(request: ContratoEquipoVehiculoRequest): Observable<ContratoEquipoVehiculo[]> {

        // 🎯 Convertimos dinámicamente las propiedades del request en parámetros de URL
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_contrata) {
            queryParams = queryParams.append('cod_contrata', request.cod_contrata);
        }

        // 🚀 Pasamos los "params" como el segundo argumento en las opciones del .get()
        return this.http.get<ContratoEquipoVehiculo[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/listar-equipos-contrata`,
            { params: queryParams } // 👈 Aquí se inyectan en la URL
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    // LISTAS DE PARAMETROS

    public obtenerParametrosContato(): Observable<ParametroContrato[]> {

        return this.http.get<ParametroContrato[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/parametros-contrato`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerTabla(cod_tabla: string): Observable<TablaDetalle[]> {
        let queryParams = new HttpParams();

        if (cod_tabla) {
            queryParams = queryParams.append('cod_tabla', cod_tabla);
        }

        return this.http.get<TablaDetalle[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tabla-detalle`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerMedicion(): Observable<ParametroMedicionDto[]> {

        return this.http.get<ParametroMedicionDto[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/medicion`,
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerGastosGenerales(request: GastosGeneralesRequest): Observable<GastosGenerales[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_contrato) {
            queryParams = queryParams.append('cod_contrato', request.cod_contrato);
        }


        return this.http.get<GastosGenerales[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/gastos-generales`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerCostosFijos(): Observable<CostosFijosMae[]> {

        return this.http.get<CostosFijosMae[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/costos-fijos`,
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerCostosFijosDetalle(cod_empresa: string, cod_empresa_unidad: string, cod_costo_fijo: string): Observable<CostosFijosDetalle[]> {
        let queryParams = new HttpParams();

        if (cod_empresa) {
            queryParams = queryParams.append('cod_empresa', cod_empresa);
        }
        if (cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', cod_empresa_unidad);
        }
        if (cod_costo_fijo) {
            queryParams = queryParams.append('cod_costo_fijo', cod_costo_fijo);
        }


        return this.http.get<CostosFijosDetalle[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/costos-fijos-detalle`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    public guardarGastosGenerales(payload: GastosGeneralesInsertarDTO[]): Observable<GastosGneralesRequest> {
        return this.http.post<GastosGneralesRequest>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/insertar-gastos-generales`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public eliminarCostoFijoDetalle(data: EntradaCostoFijo): Observable<RespuestCostoFijo> {
        return this.http.delete<RespuestCostoFijo>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/eliminar-fila-costo-detalle`,
            {
                body: data
            }).pipe(
                catchError(error => {
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );;
    }

    public obtenerTarifarioDetalle(request: EntradaTarifarioDetalle): Observable<PaginacionTarifarioDetalle> {

        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }

        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }

        if (request.cod_contrato) {
            queryParams = queryParams.append('cod_contrato', request.cod_contrato);
        }

        if (request.ind_material) {
            queryParams = queryParams.append('ind_material', request.ind_material);
        }

        queryParams = queryParams.append('pagina', request.pagina);

        queryParams = queryParams.append('cantidad_reg', request.cantidad_reg);

        return this.http.get<PaginacionTarifarioDetalle>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/obtener-tarifario-detalle`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeError(error);
                return throwError(() => error);
            })
        );
    }

    private rutas$ = this.http.get<RutaTransporte[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/lista-rutas`).pipe(shareReplay(1));
    private centros$ = this.http.get<CentroCosto[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/lista-cto`).pipe(shareReplay(1));
    private cuentas$ = this.http.get<CuentaContable[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/lista-cta`).pipe(shareReplay(1));

    public obtenerRutas(): Observable<RutaTransporte[]> {
        return this.rutas$;
    }

    public obtenerCentrosCosto(): Observable<CentroCosto[]> {
        return this.centros$;
    }

    public obtenerCuentasContables(): Observable<CuentaContable[]> {
        return this.cuentas$;
    }

    public obtenerTarifarioMaterial(request: EntradaTarifarioMaterial): Observable<DetTarifarioTransporteMaterial[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_contrato) {
            queryParams = queryParams.append('cod_contrato', request.cod_contrato);
        }

        return this.http.get<DetTarifarioTransporteMaterial[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/obtener-tarifario-material`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerTarifarioLista(): Observable<SvalDetTarifarioTransporte[]> {
        return this.http.get<SvalDetTarifarioTransporte[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/obtener-tarifario-lista`);
    }

    public obtenerDatosTabla(request: EntradaTablaDetalle): Observable<SvalMaeTablaDetalle[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_tabla) {
            queryParams = queryParams.append('cod_tabla', request.cod_tabla);
        }

        return this.http.get<SvalMaeTablaDetalle[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/obtener-tabla-lista`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerTarifarioEquipos(request: EntradaTarifarioMaterial): Observable<SvalDetTarifarioEquiposAlquiler[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_contrato) {
            queryParams = queryParams.append('cod_contrato', request.cod_contrato);
        }

        return this.http.get<SvalDetTarifarioEquiposAlquiler[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/obtener-tarifario-equipos`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public listarEquipo(): Observable<SvalMaeEquipo[]> {
        return this.http.get<SvalMaeEquipo[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/obtener-equipos-vigentes`);
    }

    public listarTablaDetalle(): Observable<SvalTablaDetalle[]> {
        return this.http.get<SvalTablaDetalle[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/obtener-tabla-detalle`);
    }

    public obtenerSiguienteItem(cod_empresa: string, cod_empresa_unidad: string, cod_contrato: string): Observable<{ siguienteCodItem: number }> {
        return this.http.get<{ siguienteCodItem: number }>(`
            ${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/siguiente-item-transporte`, {
            params: { cod_empresa: cod_empresa, cod_empresa_unidad: cod_empresa_unidad, cod_contrato: cod_contrato }
        });
    }


    //DELTE DE LOS TABS DE MODALS TARIFARIO


    public eliminarTarifarioTransporte(data: EliminarTarifarioTransporte): Observable<RespuestaTarifario> {
        return this.http.delete<RespuestaTarifario>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario-escritura/eliminar-tarifario-transporte`,
            {
                body: data
            }).pipe(
                catchError(error => {
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }

    public eliminarTarifarioTransporteMaterial(data: EliminarTarifarioTransporteMaterial): Observable<RespuestaTarifario> {
        return this.http.delete<RespuestaTarifario>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario-escritura/eliminar-tarifario-transporte-material`,
            {
                body: data
            }).pipe(
                catchError(error => {
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }

    public eliminarTarifarioEquiposAlquiler(data: EliminarTarifarioEquiposAlquiler): Observable<RespuestaTarifario> {
        return this.http.delete<RespuestaTarifario>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario-escritura/eliminar-tarifario-equipos-alquiler`,
            {
                body: data
            }).pipe(
                catchError(error => {
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }


    //INSERTAR LOS TABS 

    public guardarTarifarioDetalle(listaDetalles: SvalDetTarifarioTransporte[]): Observable<RespuestaTarifario> {
        return this.http.post<RespuestaTarifario>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario-escritura/guardar-detalle`,
            listaDetalles
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public guardarRutaBalanza(listaDetalles: RutasFijasBalanza[]): Observable<ProcesarResult> {
        return this.http.post<ProcesarResult>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario-escritura/guardar-rutas-fijas-balanza`,
            listaDetalles
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public guardarAlquilerEquipo(listaDetalles: SvalDetTarifarioEquiposAlquiler[]): Observable<ProcesarResult> {
        return this.http.post<ProcesarResult>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario-escritura/guardar-equipos-alquiler`,
            listaDetalles
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerTransporteMineralReporte(request: EntradaTarifarioDetalleReporte): Observable<TarifarioTransporteDetalle[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_contrato) {
            queryParams = queryParams.append('cod_contrato', request.cod_contrato);
        }

        if (request.ind_material) {
            queryParams = queryParams.append('ind_material', request.ind_material);
        }
        // 🎯 2. Realizamos la petición GET apuntando a tu nuevo controlador
        return this.http.get<TarifarioTransporteDetalle[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/imprimir-transporte-mineral`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    /**
   * Obtiene el reporte estructurado de transporte (Otros) dividido en rutas activas e inactivas.
   * @param filtros Objeto con los criterios de búsqueda (empresa, contrato, material, etc.)
   */
    public obtenerTransporteOtrosReporteEstructurado(
        filtros: EntradaTarifarioDetalleReporte
    ): Observable<ReporteTransporteOtrosResponse> {

        // 🎯 Mapeamos dinámicamente las propiedades del filtro a HttpParams
        let params = new HttpParams();
        if (filtros.cod_empresa) params = params.set('cod_empresa', filtros.cod_empresa);
        if (filtros.cod_empresa_unidad) params = params.set('cod_empresa_unidad', filtros.cod_empresa_unidad);
        if (filtros.cod_contrato) params = params.set('cod_contrato', filtros.cod_contrato);
        if (filtros.ind_material) params = params.set('ind_material', filtros.ind_material);

        // 🚀 Hacemos la petición GET esperando la estructura compuesta
        return this.http.get<ReporteTransporteOtrosResponse>(`${this.routeshUrl}mantenimiento/servicio-transporte/tarifario/imprimir-transporte-otros`, { params });
    }




    //ENDPOINTS PRECIO UNNITARIO

    public listarActividadTarea(): Observable<ActividadTareaMant[]> {
        return this.http.get<ActividadTareaMant[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/listar-actividad-tarea`);
    }


    public buscarCatalogoTarea(request: CatalogoTareaFiltro): Observable<CatalogoTarea[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_actividad) {
            queryParams = queryParams.append('cod_actividad', request.cod_actividad);
        }

        if (request.des_catalogo_tarea) {
            queryParams = queryParams.append('des_catalogo_tarea', request.des_catalogo_tarea);
        }
        // 🎯 2. Realizamos la petición GET apuntando a tu nuevo controlador
        return this.http.get<CatalogoTarea[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/buscar-catalogo-tarea`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public insertarPartidaPu(payload: PartidaPuInsertDto[]): Observable<RespuestaSpDto> {
        return this.http.post<RespuestaSpDto>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/insertar-partidas-pu`,
            payload
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public listarPartidaPu(request: GastosGeneralesRequest): Observable<PartidaPuListarDto[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa);
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad);
        }
        if (request.cod_contrato) {
            queryParams = queryParams.append('cod_contrato', request.cod_contrato);
        }
        // 🎯 2. Realizamos la petición GET apuntando a tu nuevo controlador
        return this.http.get<PartidaPuListarDto[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/listar-partidas-pu`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerTablaDetalle(request: MaeTablaDetalleRequest): Observable<MaeTablaDetalleDto[]> {
        let queryParams = new HttpParams();

        if (request.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', request.cod_empresa.trim());
        }
        if (request.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', request.cod_empresa_unidad.trim());
        }

        return this.http.get<MaeTablaDetalleDto[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/listar-tabla-detalle`, { params: queryParams })
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas de error
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }

    // ... dentro de tu servicio
    public eliminarPartidaPu(payload: EntradaEliminarPrecioUnitario): Observable<EliminarRespuestaDto> {
        let queryParams = new HttpParams()
            // .append('cod_empresa', payload.cod_empresa)
            // .append('cod_empresa_unidad', payload.cod_empresa_unidad)
            // .append('cod_contrato', payload.cod_contrato)
            // .append('cod_catalogo_tarea', payload.cod_catalogo_tarea)
            // .append('cod_actividad', payload.cod_actividad)
            .append('nro_partida', payload.nro_partida); // HttpParams solo acepta strings

        return this.http.delete<EliminarRespuestaDto>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/eliminar-partida-pu`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                // Mantiene tu manejador centralizado de alertas si cuentas con él
                if (this.formUtils) {
                    this.formUtils.mensajeErrorClase(error);
                }
                return throwError(() => error);
            })
        );
    }


    public obtenerPrecioUnitarioCabTab(entrada: EntradaPuCabTab): Observable<DetallePuResultado> {
        let queryParams = new HttpParams();

        if (entrada.cod_empresa) {
            queryParams = queryParams.append('cod_empresa', entrada.cod_empresa.trim());
        }
        if (entrada.cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', entrada.cod_empresa_unidad.trim());
        }
        if (entrada.cod_contrato) {
            queryParams = queryParams.append('cod_contrato', entrada.cod_contrato.trim());
        }
        if (entrada.cod_actividad) {
            queryParams = queryParams.append('cod_actividad', entrada.cod_actividad.trim());
        }
        if (entrada.cod_catologo_tarea) {
            queryParams = queryParams.append('cod_catologo_tarea', entrada.cod_catologo_tarea.trim());
        }

        if (entrada.nro_partida) {
            queryParams = queryParams.append('nro_partida', entrada.nro_partida.trim());
        }


        return this.http.get<DetallePuResultado>(`${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/obtener-detalle-pu-cab-tab`, { params: queryParams })
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas de error
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }

    public obtenerZonaPu(): Observable<ZonaPu[]> {
        return this.http.get<ZonaPu[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/obtener-pu-zonas`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    public obtenerParametrosContratoPu(): Observable<ParametrosContratoDto[]> {
        return this.http.get<ParametrosContratoDto[]>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/listar-parametros-contrato`
        ).pipe(
            catchError(error => {
                this.formUtils.mensajeErrorClase(error);
                return throwError(() => error);
            })
        );
    }

    getUSDtoPEN(): Observable<number> {
        return this.http
            .get<{ tipoCambio: number }>(`${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/usd-pen`)
            .pipe(map(res => res.tipoCambio));
    }

    public obtenerDetalleTablaPu(cod_empresa: string, cod_empresa_unidad: string): Observable<TablaDetalleDto[]> {
        let queryParams = new HttpParams();

        if (cod_empresa) {
            queryParams = queryParams.append('cod_empresa', cod_empresa.trim());
        }
        if (cod_empresa_unidad) {
            queryParams = queryParams.append('cod_empresa_unidad', cod_empresa_unidad.trim());
        }
        // if (cod_tabla) {
        //     queryParams = queryParams.append('cod_tabla', cod_tabla.trim());
        // }

        return this.http.get<TablaDetalleDto[]>(`${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/listar-tabla-detalle-pu`, { params: queryParams })
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas de error
                    this.formUtils.mensajeErrorClase(error);
                    return throwError(() => error);
                })
            );
    }


    public eliminarPartidaCostoPu(payload: EliminarPartidaDto): Observable<RespuestaApiDto> {
        let queryParams = new HttpParams()
            .append('cod_empresa', payload.cod_empresa)
            .append('cod_empresa_unidad', payload.cod_empresa_unidad)
            .append('cod_contrato', payload.cod_contrato)
            .append('cod_catalogo_tarea', payload.cod_catalogo_tarea)
            .append('cod_actividad', payload.cod_actividad)
            .append('nro_partida', payload.nro_partida)
            .append('cod_parametro_contrato', payload.cod_parametro_contrato)

        return this.http.delete<RespuestaApiDto>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/eliminar-det-partida-costo-pu`,
            { params: queryParams }
        ).pipe(
            catchError(error => {
                // Mantiene tu manejador centralizado de alertas si cuentas con él
                if (this.formUtils) {
                    this.formUtils.mensajeErrorClase(error);
                }
                return throwError(() => error);
            })
        );
    }

    public guardarPartida(dto: PartidaPUModel): Observable<ResultadoDatosDto> {
        return this.http.post<ResultadoDatosDto>(`${this.routeshUrl}mantenimiento/servicio-transporte/precio-unitario/guardar-partida`, dto)
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas si cuentas con él
                    if (this.formUtils) {
                        this.formUtils.mensajeErrorClase(error);
                    }
                    return throwError(() => error);
                })
            );
    }


    verificarTarifario(cod_contrato: string): Observable<number> {
        return this.http.get<number>(`${this.routeshUrl}mantenimiento/opciones-modelo/verificar-tarifario/${cod_contrato}`);
    }


    public eliminarParametroContrato(dto: ContratoParametro): Observable<RespuestCostoFijo> {
        return this.http.delete<RespuestCostoFijo>(
            `${this.routeshUrl}mantenimiento/servicio-transporte/eliminar-parametro-contrato`, { body: dto })
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas si cuentas con él
                    if (this.formUtils) {
                        this.formUtils.mensajeErrorClase(error);
                    }
                    return throwError(() => error);
                })
            );
    }

    public eliminarDetContratoMedicion(dto: ContratoMedicion): Observable<RespuestCostoFijo> {
        return this.http.delete<RespuestCostoFijo>(`${this.routeshUrl}mantenimiento/servicio-transporte/eliminar-det-contrato-medicion`, { body: dto })
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas si cuentas con él
                    if (this.formUtils) {
                        this.formUtils.mensajeErrorClase(error);
                    }
                    return throwError(() => error);
                })
            );
    }

    public eliminarTarifarioEquipoPesado(dto: ContratoEquipoPesado): Observable<RespuestCostoFijo> {
        return this.http.delete<RespuestCostoFijo>(`${this.routeshUrl}mantenimiento/servicio-transporte/eliminar-equipo-pesado`, { body: dto })
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas si cuentas con él
                    if (this.formUtils) {
                        this.formUtils.mensajeErrorClase(error);
                    }
                    return throwError(() => error);
                })
            );;
    }

    public guardarServicioTransporte(dto: ContratoPayload): Observable<RespuestaServidor> {
        return this.http.post<RespuestaServidor>(`${this.routeshUrl}mantenimiento/servicio-transporte/guardar-servicios-transporte`, dto)
            .pipe(
                catchError(error => {
                    // Mantiene tu manejador centralizado de alertas si cuentas con él
                    if (this.formUtils) {
                        this.formUtils.mensajeErrorClase(error);
                    }
                    return throwError(() => error);
                })
            );
    }






}
