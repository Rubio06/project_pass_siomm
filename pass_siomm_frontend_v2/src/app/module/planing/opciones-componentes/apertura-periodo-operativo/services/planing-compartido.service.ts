import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { AperPeriodo, MaeExploEstandar, MaeFactor, MaeFactorRecuperacion, MaeFactorSobredisolucion, MaePerMetExplotacion, MaeSemanaAvance, MaeSemanaCiclo, MaeTipLabEstandar, MaeValCanchas, MaeValOperativo, MaeValOperativoDetalle, PlanningData } from '../interface/aper-per-oper.interface';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environments';

@Injectable({
    providedIn: 'root'
})
export class PlaningCompartidoService {
    private http = inject(HttpClient);
    private planingUrl = environment.baseUrl;
    private _lastTab = '';
    // Persistencia de cada tab/form
    private _canchas: WritableSignal<MaeValCanchas[]> = signal([]);
    private _cierre_periodo: WritableSignal<AperPeriodo[]> = signal([]);
    private _exploracion_extandar: WritableSignal<MaeExploEstandar[]> = signal([]);
    private _factor: WritableSignal<MaeFactor[]> = signal([]);
    private _factorOperativo: WritableSignal<MaeValOperativo[]> = signal([]);
    private _factorSobredisolucion: WritableSignal<MaeFactorSobredisolucion[]> = signal([]);
    private _laboratorio_estandar: WritableSignal<MaeTipLabEstandar[]> = signal([]);
    private _metodo_minado: WritableSignal<MaePerMetExplotacion[]> = signal([]);
    private _operativo_detalle: WritableSignal<MaeValOperativoDetalle[]> = signal([]);
    private _recuperacionBudget: WritableSignal<MaeFactorRecuperacion[]> = signal([]);
    private _semana_avance: WritableSignal<MaeSemanaAvance[]> = signal([]);
    private _semana_ciclo: WritableSignal<MaeSemanaCiclo[]> = signal([]);
    // private _valores: WritableSignal<any[]> = signal([]);

    // Readonly para cada tab
    readonly canchas = this._canchas.asReadonly();
    readonly cierre_periodo = this._cierre_periodo.asReadonly();
    readonly exploracion_extandar = this._exploracion_extandar.asReadonly();
    readonly factor = this._factor.asReadonly();
    readonly factorOperativo = this._factorOperativo.asReadonly();
    readonly factorSobredisolucion = this._factorSobredisolucion.asReadonly();
    readonly laboratorio_estandar = this._laboratorio_estandar.asReadonly();
    readonly metodo_minado = this._metodo_minado.asReadonly();
    readonly operativo_detalle = this._operativo_detalle.asReadonly();
    readonly recuperacionBudget = this._recuperacionBudget.asReadonly();
    readonly semana_avance = this._semana_avance.asReadonly();
    readonly semana_ciclo = this._semana_ciclo.asReadonly();
    // readonly valores = this._valores.asReadonly();

    /// FACTOR OPERATIVO
    setCierrePeriodo(data: AperPeriodo | AperPeriodo[], tab?: string) {
        this._cierre_periodo.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó
    }

    setFactor(data: MaeFactor | MaeFactor[], tab?: string) {
        this._factor.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó

    }
    setOperativoDetalle(data: MaeValOperativoDetalle | MaeValOperativoDetalle[], tab?: string) {
        this._operativo_detalle.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó

    }

    setFactorOperativo(data: MaeValOperativo | MaeValOperativo[], tab?: string) {
        this._factorOperativo.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó

    }

    setCanchas(data: MaeValCanchas | MaeValCanchas[], tab?: string) {
        this._canchas.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó

    }

    setRecuperacionBudget(data: MaeFactorRecuperacion | MaeFactorRecuperacion[], tab?: string) {
        this._recuperacionBudget.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó

    }

    setFactorSobredisolucion(data: MaeFactorSobredisolucion | MaeFactorSobredisolucion[], tab?: string) {
        this._factorSobredisolucion.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó

    }


    ///tablas
    setExploracionExtandar(data: MaeExploEstandar | MaeExploEstandar[]) {
        this._exploracion_extandar.set(Array.isArray(data) ? data : [data]);
    }


    setSemanaAvance(data: MaeSemanaAvance | MaeSemanaAvance[], tab?: string) {
        this._semana_avance.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || '';
    }

    setSemanaCiclo(data: MaeSemanaCiclo | MaeSemanaCiclo[]) {
        this._semana_ciclo.set(Array.isArray(data) ? data : [data]);
    }



    setLaboratorioEstandar(data: MaeTipLabEstandar | MaeTipLabEstandar[]) {
        this._laboratorio_estandar.set(Array.isArray(data) ? data : [data]);
    }

    setMetodoMinado(data: MaePerMetExplotacion | MaePerMetExplotacion[]) {
        this._metodo_minado.set(Array.isArray(data) ? data : [data]);
    }


    //     cierre_periodo: this._cierre_periodo(),
    // factor: this._factor(),
    // operativo_detalle: this._operativo_detalle(),
    // factorOperativo: this._factorOperativo(),
    // canchas: this._canchas(),
    // recuperacionBudget: this._recuperacionBudget(),
    // factorSobredisolucion: this._factorSobredisolucion(),



    // factorSobredisolucion




    // setValores(data: any | any[]) {
    //     this._valores.set(Array.isArray(data) ? data : [data]);
    // }

    // Limpiar todo


    private toDateTime(fecha: string): string {
        const [d, m, y] = fecha.split('/');
        return `${y}-${m}-${d}T00:00:00`;
    }

    public guardarTodo(modoBoton: 'N' | 'E', anio: string, mes: string) {

        let payload: any = {};

        switch (this._lastTab) {
            case 'factor_operativo':
                payload = {
                    cierre_periodo: this._cierre_periodo(),
                    factor: this._factor(),
                    operativo_detalle: this._operativo_detalle(),
                    factorOperativo: this._factorOperativo(),
                    canchas: this._canchas(),
                    recuperacionBudget: this._recuperacionBudget(),
                    factorSobredisolucion: this._factorSobredisolucion(),
                    modo: modoBoton,
                    username: localStorage.getItem('username'),
                }
                break;

            case 'semana_avance':
                const semanasFormateadas = this._semana_avance().map(s => ({
                    ...s,
                    cie_ano: anio,
                    cie_per: mes,
                    fec_ini: this.toDateTime(s.fec_ini),
                    fec_fin: this.toDateTime(s.fec_fin),
                }));

                payload = {
                    semana_avance: semanasFormateadas,
                    modo: modoBoton,
                    username: localStorage.getItem('username')
                }
                break;
        }

        // const payload = {
        //     cierre_periodo: this._cierre_periodo(),
        //     factor: this._factor(),
        //     operativo_detalle: this._operativo_detalle(),
        //     factorOperativo: this._factorOperativo(),
        //     canchas: this._canchas(),
        //     recuperacionBudget: this._recuperacionBudget(),
        //     factorSobredisolucion: this._factorSobredisolucion(),




        //     semana_avance: semanasFormateadas,
        //     // valores: this._valores(),
        //     // laboratorio_estandar: this._laboratorio_estandar(),
        //     // exploracion_extandar: this._exploracion_extandar(),
        //     // metodo_minado: this._metodo_minado(),
        //     // semana_ciclo: this._semana_ciclo(),
        //     modo: modoBoton,
        //     username: localStorage.getItem('username'),
        // };

        console.log("los datos recibidos son: " + JSON.stringify(payload, null, 2));
        return this.http.post(
            `${this.planingUrl}aper-periodo-operativo/semana/guardar-datos`,
            payload
        );
    }

    ///COMPONENTE VISUALIZAR
    onVisualizarGlobal() {

        // 🔓 Bloquea formularios
        this.setFormBloqueadoCentral(true);
        this.setModoEditar(false);

        // 👀 Activa modo visualizar

        // 🟢 Opcional: limpia "modo cambios"
        this.setCambios(false);

    }



    // GUARD MENU
    cambios = signal(false);

    setCambios(valor: boolean): void {
        this.cambios.set(valor);
    }

    getCambios(): boolean {
        return this.cambios();
    }



    private _hasChanges = signal(false);
    readonly hasChanges = this._hasChanges.asReadonly();

    setChanges(v: boolean) {
        this._hasChanges.set(v);
    }



    // ===============================
    //  ESTADO DE EDITAR
    // ===============================
    private _formBloqueadoCentral = signal<boolean>(true);
    readonly formBloqueadoCentral = this._formBloqueadoCentral.asReadonly();

    setFormBloqueadoCentral(valor: boolean) {
        this._formBloqueadoCentral.set(valor);
    }

    readonly bloqueoFormGeneral = computed(
        () => this.formBloqueadoCentral()
    );


    // ===============================
    //  EVENTO RESET DE FORMS PARA BOTON NUEVO
    // ===============================


    private _resetSemanas = signal(false);
    readonly resetSemanas = this._resetSemanas.asReadonly();

    notifyResetSemanas() {
        this._resetSemanas.set(true);
    }

    resetSemanasDone() {
        this._resetSemanas.set(false);
    }




    ////////PERMANECE BLOQUEADO DOS INPUTS EN PERIODO
    private _modoEditar = signal(false);
    readonly modoEditar = this._modoEditar.asReadonly();

    setModoEditar(valor: boolean) {
        this._modoEditar.set(valor);
    }

    ////////////SE RESETEA TODO HASTA LOS SECTS CON EL BOTON VISUALIZAR


    private _dataRoutes: WritableSignal<object> = signal({});
    public readonly dataRoutes: Signal<any> = this._dataRoutes.asReadonly();

    setData(data: object): void {
        this._dataRoutes.set(data);
    }

    get getData() {
        return this._dataRoutes;
    }


    limpiezaBotonNuevo() {
        const current = this._dataRoutes();
        if (!current) return;

        this._dataRoutes.set({
            semana_ciclo: [],
            metodo_minado: [],
            semana_avance: [],
            exploracion_extandar: [],
            laboratorio_estandar: []
        });
    }

    /// GUARD PARA MI SERVICIO COMPARTIDO
    private guardarHandler?: () => Promise<void> | void;

    registrarGuardar(fn: () => Promise<void> | void) {
        this.guardarHandler = fn;
    }

    async ejecutarGuardar() {
        if (this.guardarHandler) {
            await this.guardarHandler();
        }
    }

    ///VALIDAR FORMULARIO DE PERIODO

    private _periodoValido = signal<boolean>(false);
    private _cierre_periodo_DOS = signal<AperPeriodo | null>(null);

    setPeriodoValido(valido: boolean) {
        this._periodoValido.set(valido);
    }

    isPeriodoValido(): boolean {
        return this._periodoValido();
    }

    setCierrePeriodo_Dos(data: AperPeriodo) {
        this._cierre_periodo_DOS.set(data);
    }
}
