import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, Observable, of } from 'rxjs';
import { FormUtils } from 'src/app/utils/form-utils';
import { CopiarProgramacionRequest, ExportarProgramacion, ExportarProgramacionResponse, ListaMensual, ListMensualIncidencias, PreAprobacionResponse, ProgramaMensualInformacion, responseImportar, ResponsePrograma, ResponseProgramacion } from '../interface/programa-mensual.interface';

@Injectable({
    providedIn: 'root'
})
export class ListaMensualService {


    private listMensualHttp = inject(HttpClient);
    private listaMensualUrl = environment.baseUrl;

    utils = FormUtils;


    private filtros = signal<{ anio: string; mes: string | null }>({
        anio: '',
        mes: null
    });

    // ✅ GUARDAR
    setFiltros(anio: string, mes: string | null): void {
        this.filtros.set({ anio, mes });
    }

    // ✅ OBTENER
    getFiltros() {
        return this.filtros();
    }

    private _nroProgSeleccionado = signal<string | null>(null);

    setNroProgSeleccionado(nro_prog: string | null): void {
        this._nroProgSeleccionado.set(nro_prog);
    }

    getNroProgSeleccionado() {
        return this._nroProgSeleccionado();
    }

    limpiarEstado(): void {
        this.filtros.set({ anio: '', mes: null });
        this._nroProgSeleccionado.set(null);
        this._nroProgSeleccionado.set('');
    }

    public cargarListaMensual(cie_ano: string, cie_per?: string | null): Observable<ListaMensual[]> {

        let params = new HttpParams().set('cie_ano', cie_ano);

        if (cie_per) {
            params = params.set('cie_per', cie_per);
        }

        return this.listMensualHttp.get<ListaMensual[]>(
            `${this.listaMensualUrl}planeamiento/lista-mensual/obtener-lista-mensual`,
            { params }
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.message);
                return of([]);
            })
        );
    }

    public cargarListaMensualIncidencias(nro_prog: string): Observable<ListMensualIncidencias[]> {
        return this.listMensualHttp.get<ListMensualIncidencias[]>(`${this.listaMensualUrl}planeamiento/lista-mensual/obtener-lista-incidencias`,
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

    anularProgramacion(nro_prog: string) {
        return this.listMensualHttp.patch<string>(`${this.listaMensualUrl}planeamiento/lista-mensual/anular-programacion`, null,
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

    aprobarProgramacion(nro_prog: string, cod_usuario: string) {
        return this.listMensualHttp.patch(
            `${this.listaMensualUrl}planeamiento/lista-mensual/aprobar-programacion`, null,
            {
                params: {
                    nro_prog: nro_prog,
                    cod_usuario: cod_usuario
                }
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of([]);
        }));
    }


    public exportarPrograma(cie_ano: string | null, cie_per: string | null, nro_prog: string | null): Observable<ExportarProgramacionResponse> {

        const params: any = {};

        if (cie_ano) params.cie_ano = cie_ano;
        if (cie_per) params.cie_per = cie_per;
        if (nro_prog) params.nro_prog = nro_prog;

        return this.listMensualHttp.get<ExportarProgramacionResponse>(`${this.listaMensualUrl}planeamiento/lista-mensual/exporta-lista-programacion`,
            {
                params
            }
        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of({
                estado: 0,
                mensaje: error.message,
                data: []
            });
        }))
    }

    public importarArchivo(formData: FormData): Observable<responseImportar> {


        return this.listMensualHttp.post<responseImportar>(
            `${this.listaMensualUrl}planeamiento/lista-mensual/importar-excel`,
            formData
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.message);
                return of({
                    mensaje: '',
                    respuesta: false,
                    totalFilas: 0
                });
            })
        );
    }

    preAprobacion(nro_prog: string, prg_pre_apr: string | null): Observable<PreAprobacionResponse> {

        const params: any = {
            nro_prog: nro_prog,
            prg_pre_apr: prg_pre_apr ?? null
        };

        return this.listMensualHttp.patch<PreAprobacionResponse>(
            `${this.listaMensualUrl}planeamiento/lista-mensual/pre-aprobacion-programacion`,
            null,
            { params }
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.message);

                return of({
                    ok: false,
                    mensaje: error.message,
                    nuevo_estado: prg_pre_apr
                } as PreAprobacionResponse);
            })
        );
    }

    public copiarProgramacion(data: CopiarProgramacionRequest) {
        return this.listMensualHttp.post<ResponsePrograma>(
            `${this.listaMensualUrl}planeamiento/lista-mensual/copiar-programacion`,
            data
        ).pipe(
            catchError(error => {
                this.utils.mensajeError(error.message);
                return of({
                    mensaje: '',
                    nro_prog_nuevo: ''
                });
            })
        );
    }


    public cargarNroPrograma(): Observable<string> {
        return this.listMensualHttp.get<string>(`${this.listaMensualUrl}planeamiento/lista-mensual/generar-nro-prog`,

        ).pipe(catchError(error => {
            this.utils.mensajeError(error.message)
            return of('');
        }))
    }


}
