import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environments';
import { BehaviorSubject, catchError, Observable, of, Subject, throwError } from 'rxjs';
import { FormUtils } from 'src/app/utils/form-utils';
import { Ala, BlockReserva, CodCta, CodCto, CopiarLabor, CopiarLaborResponse, DatosEntradaPrograma, EliminarPlano, EvaluacionBloques, ExportarProgramaMensual, IndiceRendimiento, InsertarCabDetalle, InsertarProgramacionDto, LaborAvance, LaboresAvanceLimit, MaestrosProgMensual, MostrarMaeFase, MostrarPlanos, PlanoMetadata, ProgramacionPlan, ProgramaExplotacion, ProgramaResponse, ReservaGeologicaFiltro, ReservasGeologicas, ResponsDetprg, ResponseCabPrg, ResultadoPlano, ResumenProgramaRequest, ResumenProgramaResponse, valOperativo } from '../interface/edicion-programa-mensual.interface';
import { ProgramaMensualInformacion } from '../interface/programa-mensual.interface';

@Injectable({
    providedIn: 'root'
})
export class EdicionProgrmaMensualService {

    edicionProgamaHttp = inject(HttpClient);
    private planingUrl = environment.baseUrl;
    utils = FormUtils;




    prgCutoff = signal<number>(0);

    formDirty = signal<boolean>(false);

    private _saliendo = false;

    // Persistencia de datos por fase: cod_fase -> raw values del FormArray
    private _datosFormPorFase = new Map<string, any[]>();

    private _erroresPorFase = new Map<string, number[]>();

    private _formularioActivo: any = null;

    guardarDatosFase(cod_fase: string, datos: any[]): void {
        if (this._saliendo) {
            return;
        }
        if (datos.length > 0) {
            this._datosFormPorFase.set(cod_fase, datos);
            this.formDirty.set(false);
        }
    }
    obtenerDatosFase(cod_fase: string): any[] | null {
        return this._datosFormPorFase.get(cod_fase) ?? null;
    }


    //METODOS PARA EL MANJEO DE ERRORES
    guardarErroresFase(cod_fase: string, indices: number[]): void {
        this._erroresPorFase.set(cod_fase, indices);
    }

    obtenerErroresFase(cod_fase: string): number[] {
        return this._erroresPorFase.get(cod_fase) ?? [];
    }

    limpiarErroresFase(cod_fase: string): void {
        this._erroresPorFase.delete(cod_fase);
    }

    // limpiarDatosFase(cod_fase: string): void {
    //     this._datosFormPorFase.delete(cod_fase);
    //     if (this._datosFormPorFase.size === 0) {
    //         this.formDirty.set(false);
    //     }
    // }

    limpiarDatosFase(cod_fase: string): void {

        this._datosFormPorFase.delete(cod_fase);

        this._erroresPorFase.delete(cod_fase);

        if (this._datosFormPorFase.size === 0) {
            this.formDirty.set(false);
        }

    }

    hayDatosPendientes(): boolean {
        if (this._datosFormPorFase.size > 0) return true;
        // Revisar el FormArray activo contando solo filas nuevas
        const labores = this._formularioActivo?.get('labores');
        if (!labores) return false;
        const rawValues = (labores as any).getRawValue?.() ?? [];
        return rawValues.some((f: any) => f.isNew === true);
    }


    registrarFormularioActivo(form: any): void {
        this._formularioActivo = form;
    }

    // limpiarTodosDatosFases(): void {
    //     this._saliendo = true;
    //     this._datosFormPorFase.clear();
    //     this.formDirty.set(false);
    //     // Resetear flag después de un tick para permitir nueva sesión
    //     setTimeout(() => this._saliendo = false, 0);
    // }

    limpiarTodosDatosFases(): void {

        this._saliendo = true;

        this._datosFormPorFase.clear();

        this._erroresPorFase.clear();

        this.formDirty.set(false);

        setTimeout(() => this._saliendo = false, 0);

    }

    obtenerTodasLasFases(): Map<string, any[]> {
        return this._datosFormPorFase;
    }





    setCutoff(value: number) {
        this.prgCutoff.set(value);
    }


    private _recargar = signal<number>(0);
    recargar = this._recargar.asReadonly();

    triggerRecargar(): void {
        this._recargar.update(v => v + 1);
    }
















    private _programa = signal<DatosEntradaPrograma>({
        nro_prog: null,
        cie_ano: null,
        cie_per: null,
        // modo: null
        // cod: null
    });

    programa = this._programa.asReadonly();




    setPrograma(data: { nro_prog?: string | null; cie_ano?: string | null; cie_per?: string | null; }) {

        const actual = this._programa();

        const nuevo = {
            nro_prog: data.nro_prog === 'nuevo' ? null : data.nro_prog ?? actual.nro_prog,
            cie_ano: data.cie_ano ?? actual.cie_ano,
            cie_per: data.cie_per ?? actual.cie_per,
        };

        this._programa.set(nuevo);
    }

    private _cabecera = signal<any>(null);

    // READ
    // labores = this._labores.asReadonly();
    cabecera = this._cabecera.asReadonly();


    setCabecera(data: any) {
        this._cabecera.set(data);
    }

    private _codFase = signal<string | null>(null);
    codFase = this._codFase.asReadonly();

    setCodFase(fase: string) {
        // console.log("🔥 fase establecida en servicio:", fase);
        this._codFase.set(fase);
    }


    private _modo = signal<'nuevo' | 'ver' | 'editar' | null>(null);
    modo = this._modo.asReadonly();

    setModo(modo: 'nuevo' | 'ver' | 'editar') {
        this._modo.set(modo);
    }

    getModo() {
        return this._modo();
    }

    // PASAR DATOS DE LA TABLA PROGRAMA A OTRO COMPONENTE
    private programaSubject = new BehaviorSubject<any>(null);
    programa$ = this.programaSubject.asObservable();

    setProgramaTabla(data: any) {
        console.log("En el swrcvico compartido " + data)
        this.programaSubject.next(data);
    }

    getProgramaTabla() {
        return this.programaSubject.value;
    }

    //ACION PARA VALIDAR EL DETALLE
    // private submitSource = new Subject<void>();

    // submit$ = this.submitSource.asObservable();

    // triggerSubmit() {
    //     this.submitSource.next();
    // }

    public edicionProgramaMensual(nro_prog: string, cod_fase: string): Observable<ProgramaExplotacion[]> {
        return this.edicionProgamaHttp.get<ProgramaExplotacion[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/explotacion-lista`,
            {
                params: {
                    nro_prog: nro_prog,
                    cod_fase: cod_fase
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }

    public indiceRendimiento(nro_prog: string, codigo: string): Observable<IndiceRendimiento[]> {
        return this.edicionProgamaHttp.get<IndiceRendimiento[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/explotacion-indice-rendimiento`,
            {
                params: {
                    nro_prog: nro_prog,
                    cod_fase: codigo
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }



    public selectCodCto(cie_ano: string, prefijoBusqueda: string): Observable<CodCto[]> {
        return this.edicionProgamaHttp.get<CodCto[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-select-cto`,
            {
                params: {
                    cie_ano: cie_ano,
                    prefijoBusqueda: prefijoBusqueda
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }


    public selectCodCta(cie_ano: string): Observable<CodCta[]> {
        return this.edicionProgamaHttp.get<CodCta[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-select-cta`,
            {
                params: {
                    cie_ano: cie_ano
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }


    public selectAla(): Observable<Ala[]> {
        return this.edicionProgamaHttp.get<Ala[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-select-ala`
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }


    public selectValOperativo(cie_ano: string, cie_per: string): Observable<valOperativo[]> {
        return this.edicionProgamaHttp.get<valOperativo[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-select-fac`,
            {
                params: {
                    cie_ano: cie_ano,
                    cie_per: cie_per
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }

    public infoProgMensual(nro_prog: string): Observable<ProgramaMensualInformacion[]> {
        return this.edicionProgamaHttp.get<ProgramaMensualInformacion[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-info-prog`,
            {
                params: {
                    nro_prog: nro_prog
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }))
    }


    public obtenerInfoMaestro(): Observable<MaestrosProgMensual> {
        return this.edicionProgamaHttp
            .get<MaestrosProgMensual>(
                `${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-select-infor-maestro`

            ).pipe(catchError(error => {
                this.utils.mensajeError(error.message)
                return of({
                    listaUndEcon: [],
                    listaZona: [],
                    listContrata: []
                });
            }))
    }

    //CREACION NUMERO DE PRORAMA
    public crearNorProg(): Observable<string> {
        return this.edicionProgamaHttp
            .get<string>(
                `${this.planingUrl}planeamiento/edicion-programa-mensual/generar-nro-prog`

            ).pipe(catchError(error => {
                this.utils.mensajeError(error.message)
                return of('');
            }))
    }


    public mostrarMaeFase(): Observable<MostrarMaeFase[]> {
        return this.edicionProgamaHttp
            .get<MostrarMaeFase[]>(
                `${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-mostrar-fases`

            ).pipe(catchError(error => {
                this.utils.mensajeError(error.message)
                return of([]);
            }))
    }

    public guardarProgramaExplotacion(data: ProgramaExplotacion[]): Observable<any> {
        return this.edicionProgamaHttp.post(`${this.planingUrl}planeamiento/edicion-programa-mensual/explotacion-guardar`, data)
            .pipe(catchError(error => {
                this.utils.mensajeError(error.message)
                return of(null);
            }));
    }



    // APIS MODALS
    public blockReserva(nro_prog: string): Observable<BlockReserva[]> {
        return this.edicionProgamaHttp.get<BlockReserva[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-mostrar-block-reservas`,
            {
                params: {
                    nro_prog: nro_prog
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }))
    }

    public reservasGeologicas(filtro: ReservaGeologicaFiltro): Observable<ReservasGeologicas[]> {

        const params = new HttpParams()
            .set('cie_ano', filtro.cie_ano ?? '')
            .set('cod_uni_econom', filtro.cod_uni_econom)
            .set('cod_zona', filtro.cod_zona)
            .set('cod_veta', filtro.cod_veta)
            .set('cod_nivel', filtro.cod_nivel);

        return this.edicionProgamaHttp.get<ReservasGeologicas[]>(
            `${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-reserva-geologica`, { params })
            .pipe(catchError(error => {
                this.utils.mensajeError(error.message)
                return of([]);
            }))

    }

    public EvaluacionBloques(nro_prog: string, des_labor: string): Observable<EvaluacionBloques[]> {
        return this.edicionProgamaHttp.get<EvaluacionBloques[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-mostrar-block-evaluacion`,
            {
                params: {
                    nro_prog: nro_prog,
                    des_labor: des_labor
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }))
    }

    public ProgramacionLabor(des_labor: string): Observable<ProgramacionPlan[]> {
        return this.edicionProgamaHttp.get<ProgramacionPlan[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-mostrar-programacion-mensual`,
            {
                params: {
                    des_labor: des_labor,
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }))
    }


    public mostrarPlanos(datos: PlanoMetadata): Observable<MostrarPlanos[]> {

        return this.edicionProgamaHttp.get<MostrarPlanos[]>(
            `${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-mostrar-planos`,
            {
                params: {
                    // empresa: datos.cod_empresa,
                    // unidad: datos.cod_empresa_unidad,
                    nro_prog: datos.nro_prog,
                    cod_und_econom: datos.cod_und_econom,
                    cod_zona: datos.cod_zona,
                    cod_veta: datos.cod_veta,
                    cod_nivel: datos.cod_nivel,
                    cod_tipo_labor: datos.cod_tipo_labor,
                    cod_labor: datos.cod_labor,
                    // cod_ala: datos.cod_ala ?? '',
                    cod_fase: datos.cod_fase
                }
            }
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.message);
                return of([]);
            })
        );
    }

    public subirPlano(metadata: PlanoMetadata): Observable<ResultadoPlano> {
        const formData = new FormData();
        formData.append('file', metadata.file);

        if (metadata.titulo) {

            formData.append('titulo', metadata.titulo);
        }
        formData.append('nro_prog', metadata.nro_prog);
        formData.append('cod_und_econom', metadata.cod_und_econom);
        formData.append('cod_zona', metadata.cod_zona);
        formData.append('cod_veta', metadata.cod_veta);
        formData.append('cod_nivel', metadata.cod_nivel);
        formData.append('cod_tipo_labor', metadata.cod_tipo_labor);
        formData.append('cod_labor', metadata.cod_labor);

        // if (metadata.cod_ala) {
        //     formData.append('cod_ala', metadata.cod_ala);
        // }
        formData.append('cod_fase', metadata.cod_fase);

        return this.edicionProgamaHttp.post<ResultadoPlano>(
            `${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-subir-plano`,
            formData
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.error?.mensaje || 'Error al subir plano');
                throw error;
            })
        );
    }

    public eliminarPlano(datos: EliminarPlano): Observable<ResultadoPlano> {

        return this.edicionProgamaHttp.delete<ResultadoPlano>(
            `${this.planingUrl}planeamiento/edicion-programa-mensual/eliminar-plano`,
            { body: datos }
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.error?.mensaje || 'Error al subir plano');
                throw error;
            })
        );
    }

    obtenerPrefCtoMina(): Observable<any> {
        return this.edicionProgamaHttp.get<any>(`${this.planingUrl}planeamiento/edicion-programa-mensual/pref-cto-mina`);
    }

    obtenerPrefZona(cod_zona: string): Observable<any> {
        return this.edicionProgamaHttp.get<any>(`${this.planingUrl}planeamiento/edicion-programa-mensual/pref-zona`, {
            params: {
                cod_zona: cod_zona
            }
        });
    }


    // 🔹 1. Factor
    obtenerFactor(cie_ano: string, cie_per: string): Observable<any> {
        const params = new HttpParams()
            .set('cie_ano', cie_ano)
            .set('cie_per', cie_per);

        return this.edicionProgamaHttp.get(`${this.planingUrl}planeamiento/edicion-programa-mensual/validacion-factor`, { params });
    }

    // 🔹 2. Zona
    obtenerZona(cod_zona: string): Observable<any> {
        const params = new HttpParams()
            .set('cod_zona', cod_zona);

        return this.edicionProgamaHttp.get(`${this.planingUrl}planeamiento/edicion-programa-mensual/validacion-zona`, { params });
    }

    // 🔹 3. Veta
    obtenerDensidadVeta(
        cod_und_econom: string,
        cod_zona: string,
        cod_veta: string
    ): Observable<any> {

        const params = new HttpParams()
            .set('cod_und_econom', cod_und_econom)
            .set('cod_zona', cod_zona)
            .set('cod_veta', cod_veta);

        return this.edicionProgamaHttp.get(`${this.planingUrl}planeamiento/edicion-programa-mensual/validacion-veta`, { params });
    }

    // 🔹 4. Factores operativos
    obtenerFactoresOperativos(
        cie_ano: string,
        cie_per: string,
        tipoFac: string
    ): Observable<any> {

        const params = new HttpParams()
            .set('cie_ano', cie_ano)
            .set('cie_per', cie_per)
            .set('tipoFac', tipoFac);

        return this.edicionProgamaHttp.get(`${this.planingUrl}planeamiento/edicion-programa-mensual/validacion-factores-operativos`, { params });
    }

    // 🔹 5. Método de explotación
    obtenerMetodoExplotacion(
        cie_ano: string,
        cie_per: string,
        cod_metexp: string
    ): Observable<any> {

        const params = new HttpParams()
            .set('cie_ano', cie_ano)
            .set('cie_per', cie_per)
            .set('cod_metexp', cod_metexp);

        return this.edicionProgamaHttp.get(`${this.planingUrl}planeamiento/edicion-programa-mensual/validacion-metodo-explotacion`, { params });
    }

    //BLOCK-RESERVA

    obtenerBlocksYArchivos(): Observable<ProgramaResponse> {
        return this.edicionProgamaHttp.get<ProgramaResponse>(`${this.planingUrl}planeamiento/edicion-programa-mensual/blocks-archivos`);
    }


    eliminarDetalle(block: ProgramaExplotacion): Observable<any> {
        return this.edicionProgamaHttp.delete(`${this.planingUrl}planeamiento/edicion-programa-mensual/eliminar-detalle`, { body: block });
    }

    //MODAL LABORES
    public listaAvanceLabores(cod_und_econom: string, cod_zona: string, page: number, pageSize: number): Observable<LaboresAvanceLimit> {
        return this.edicionProgamaHttp.get<LaboresAvanceLimit>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-lista-labores`,
            {
                params: {
                    cod_und_econom: cod_und_econom,
                    cod_zona: cod_zona,
                    page: page,
                    pageSize: pageSize
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of({
                total: 0,
                page: 1,
                pageSize: 0,
                data: []
            } as LaboresAvanceLimit);
        }))
    }

    // eliminarDetalleMensual(dto: any): Observable<any> {
    //     // Nota: HttpDelete con Body requiere pasar las opciones con la propiedad 'body'
    //     return this.edicionProgamaHttp.delete(`${this.planingUrl}}planeamiento/edicion-programa-mensual/eliminar-fila-mensual`, { body: dto });
    // }

    public eliminarDetalleMensual(datos: any): Observable<ResponsDetprg> {

        return this.edicionProgamaHttp.delete<ResponsDetprg>(
            `${this.planingUrl}planeamiento/edicion-programa-mensual/eliminar-det-prg`,
            { body: datos }
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.error?.mensaje || 'Error al subir plano');
                throw error;
            })
        );
    }

    buscarLabor(): Observable<any[]> {
        return this.edicionProgamaHttp.get<any[]>(`${this.planingUrl}planeamiento/edicion-programa-mensual/exploracion-buscar-labor`
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }))
    }


    public insertarCabDeta(data: InsertarCabDetalle): Observable<ResponseCabPrg> {

        return this.edicionProgamaHttp.post<ResponseCabPrg>(`${this.planingUrl}planeamiento/edicion-programa-mensual/insertar-cab-deta`, data)
            .pipe(catchError(error => {
                this.utils.mensajeError(error.message)
                return of({
                    estado: 0,
                    mensaje: ''
                });
            }));
    }


    public copiarLabor(data: CopiarLabor): Observable<CopiarLaborResponse> {

        return this.edicionProgamaHttp.post<CopiarLaborResponse>(`${this.planingUrl}planeamiento/edicion-programa-mensual/copiar-labor`, data)
            .pipe(catchError(error => {
                this.utils.mensajeError(error.message)
                return of({
                    estado: 0,
                    mensaje: ''
                });
            }));
    }

    //exportar archivo

    public exportarProgramaMensual(data: ExportarProgramaMensual): Observable<Blob> {
        return this.edicionProgamaHttp.post(
            `${this.planingUrl}planeamiento/edicion-programa-mensual/exportar-programa-mensual`,
            data,
            {
                responseType: 'blob' // 👈 CLAVE (archivo binario)
            }
        ).pipe(
            catchError(error => {
                this.utils.mensajeError('Error al generar el archivo');
                return throwError(() => error);
            })
        );
    }

    public getResumenPrograma(data: ResumenProgramaRequest): Observable<ResumenProgramaResponse> {
        return this.edicionProgamaHttp.post<ResumenProgramaResponse>(
            `${this.planingUrl}planeamiento/edicion-programa-mensual/reporte-resumen`,
            data
        ).pipe(
            catchError(error => {
                // this.utils.mensajeError(error.error?.mensaje || 'Error al obtener reporte resumen');
                this.utils.mensajeEliminarLabor('Datos Vacios', error.error?.mensaje);

                return throwError(() => error);
            })
        );
    }
















}
