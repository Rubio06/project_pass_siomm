import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { AperPeriodo, MaeExploEstandar, MaeFactor, MaeFactorRecuperacion, MaeFactorSobredisolucion, MaePerMetExplotacion, MaeSemanaAvance, MaeSemanaCiclo, MaeTipLabEstandar, MaeValCanchas, MaeValOperativo, MaeValOperativoDetalle, PlanningData } from '../interface/aper-per-oper.interface';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environments';
import { FormGroup, ValidationErrors } from '@angular/forms';

export interface Fechas {
    fec_ini: string;
    fec_fin: string;
    cie_ano: string;  // <- ⭐ Debe ser string
    cie_per: string;
}
<<<<<<< HEAD

interface BotonesState {
    nuevo: boolean;
    editar: boolean;
    copiarPeriodo: boolean;
    visualizar: boolean;
    guardar: boolean;
}


=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
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

<<<<<<< HEAD
    public botonesState = signal({
        nuevo: true,
        editar: true,
        copiarPeriodo: true,
        visualizar: true,
        guardar: true
    });

    setBotonesState(state: Partial<BotonesState>) {
        this.botonesState.update(current => ({ ...current, ...state }));
    }
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

    /// FACTOR OPERATIVO
    setCierrePeriodo(data: AperPeriodo | AperPeriodo[], tab?: string) {
        this._cierre_periodo.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó
        // this._periodo_valid.set(estado?.valid ?? false);
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
        this._lastTab = tab ?? '';
    }

    setCanchas(data: MaeValCanchas | MaeValCanchas, tab?: string) {
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
    setExploracionExtandar(data: MaeExploEstandar | MaeExploEstandar[], tab?: string) {
        this._exploracion_extandar.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó
    }


    setSemanaAvance(data: MaeSemanaAvance | MaeSemanaAvance[], tab?: string) {
        this._semana_avance.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || '';
    }

    setSemanaCiclo(data: MaeSemanaCiclo | MaeSemanaCiclo[], tab?: string) {

        this._semana_ciclo.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó
    }


    setLaboratorioEstandar(data: MaeTipLabEstandar | MaeTipLabEstandar[], tab?: string, estado?: { valid: boolean; dirty?: boolean }) {
        this._laboratorio_estandar.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó
    }

    setMetodoMinado(data: MaePerMetExplotacion | MaePerMetExplotacion[], tab?: string) {
        this._metodo_minado.set(Array.isArray(data) ? data : [data]);
        this._lastTab = tab || ''; // opcional: guardas cuál se actualizó
    }

    private toDateTime(fecha: string): string {
        const [d, m, y] = fecha.split('/');
        return `${y}-${m}-${d}T00:00:00`;
    }

    //guardar datos
    public guardarTodo(modoBoton: 'N' | 'E') {

        const username = localStorage.getItem('username') ?? '';

        let payload: any;

        switch (this._lastTab) {

            case 'factor_operativo':
                payload = this.buildFactorOperativoPayload(modoBoton, username);
                break;

            case 'semana_avance':
                payload = this.buildSemanaAvancePayload(modoBoton, username);
                break;

            case 'semana_ciclo':
                payload = this.buildSemanaCicloPayload(modoBoton, username);
                break;

            case 'metodo_minado':
                payload = this.buildMetodoMinadoPayload(modoBoton, username);
                break;

            case 'exploracion_estandar':
                payload = this.buildExploracionEstandarPayload(modoBoton, username);
                break;

            case 'estandar_avance':
                payload = this.buildEstandarAvancePayload(modoBoton, username);
                break;

            default:
                throw new Error('Tab no soportado para guardado');
        }

<<<<<<< HEAD

=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        return this.http.post(
            `${this.planingUrl}aper-periodo-operativo/semana/guardar-datos`,
            payload
        );
    }

    private buildFactorOperativoPayload(modo: 'N' | 'E', username: string) {
        return {
            cierre_periodo: this._cierre_periodo(),
            factor: this._factor(),
            factorOperativo: this._factorOperativo(),
            operativo_detalle: this._operativo_detalle(),
            canchas: this._canchas(),
            recuperacionBudget: this._recuperacionBudget(),
            factorSobredisolucion: this._factorSobredisolucion(),
            modo,
            validacion: 'FORMULARIO',
            username
        };
    }

    private buildSemanaAvancePayload(modo: 'N' | 'E', username: string) {

        const semanas = this._semana_avance().map(s => ({
            ...s,
            fec_ini: this.toDateTime(s.fec_ini),
            fec_fin: this.toDateTime(s.fec_fin),
        }));

        return {
            semana_avance: semanas,
            modo,
            validacion: 'SEMANA_AVANCE',
            username
        };
    }


    private buildSemanaCicloPayload(modo: 'N' | 'E', username: string) {

        const semanas = this._semana_ciclo().map(s => ({
            ...s,
            fec_ini: this.toDateTime(s.fec_ini),
            fec_fin: this.toDateTime(s.fec_fin),
        }));

        return {
            semana_ciclo: semanas,
            modo,
            validacion: 'SEMANA_CICLO',
            username
        };
    }

    private buildMetodoMinadoPayload(modo: 'N' | 'E', username: string) {
        return {
            metodo_minado: this._metodo_minado(),
            modo,
            validacion: 'METODO_MINADO',
            username
        };
    }


    private buildExploracionEstandarPayload(modo: 'N' | 'E', username: string) {
        return {
            exploracion_extandar: this._exploracion_extandar(),
            modo,
            validacion: 'EXPLORACION_ESTANDAR',
            username
        };
    }

    private buildEstandarAvancePayload(modo: 'N' | 'E', username: string) {
        return {
            laboratorio_estandar: this._laboratorio_estandar(),
            modo,
            validacion: 'ESTANDAR_AVANCE',
            username
        };
    }

    ///ESTADO PARA LA VALIDACION
    private _lastTabDos = '';
    private formularios = new Map<string, FormGroup>();

    // 1. Decir qué tab está activo
    setLastTab(tab: string) {
        this._lastTabDos = tab;
    }

    getLastTab(): string {
        return this._lastTabDos;
    }

    // 2. Registrar formularios
    registrarFormulario(tab: string, form: FormGroup) {
        this.formularios.set(tab, form);
    }

    // 3. Validar SOLO el tab activo
    validarTabActivo(): boolean {
        const form = this.formularios.get(this._lastTabDos);

        if (!form) return false;

        form.markAllAsTouched();
        return form.valid;
    }

    validarTodosTabs(): boolean {
        let esValido = true;

        this.formularios.forEach(form => {
            if (!form) return;

            form.markAllAsTouched();
            if (!form.valid) {
                esValido = false;
            }
        });

        return esValido;
    }

    todosLosTabsSonValidos(): boolean {
        for (const form of this.formularios.values()) {
            if (!form) continue;

            if (form.disabled) continue;

            if (!form.valid) {
                return false;
            }
        }

        return true;
    }

    /// GUARD PARA MI SERVICIO COMPARTIDO
    private guardarHandler?: () => Promise<void> | void;
    private visualizarHandler?: () => Promise<void> | void;


    async ejecutarGuardar() {
        if (this.guardarHandler) {
            await this.guardarHandler();
        }
    }

    registrarGuardar(fn: () => Promise<void> | void) {
        this.guardarHandler = fn;
    }


    async ejecutarVisualizar() {
        if (this.visualizarHandler) {
            await this.visualizarHandler();
        }
    }

    registrarVisualizar(fn: () => Promise<void> | void) {
        this.visualizarHandler = fn;
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


    private _formBloqueadoEditar = signal<boolean>(true);
    readonly formBloqueadoEditar = this._formBloqueadoEditar.asReadonly();

    setFormBloqueadoEditar(valor: boolean) {
        this._formBloqueadoEditar.set(valor);
    }

    readonly bloqueoFormEditar = computed(
        () => this.formBloqueadoEditar()
    );



    // ===============================
    //  EVENTO RESET DE FORMS PARA BOTON NUEVO
    // ===============================



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


    limpiezaDataRoutes() {
        this._dataRoutes.set({});
    }




    //ESTADO PERIODO
    anio = signal<string[]>([]);
    meses = signal<string[]>([]);

    anioSeleccionado = signal<string | null>(null);
    mesSeleccionado = signal<string | null>(null);

    setYears(data: string[]) {
        this.anio.set(data);


        if (!this.anioSeleccionado() && data.length) {
            this.anioSeleccionado.set(data[0]);
        }
    }

    private _fechas = signal<Fechas | null>(null);

    // Getter para que otros componentes lean la señal
    get fechas() {
        return this._fechas;
    }

    // Método para actualizar las fechas
    setFechas(fechas: Fechas) {
        this._fechas.set(fechas);
    }



    ////////BLOQUEO AGREGAR FILA

    private _nuevoRegistro = signal(true);
    readonly nuevoRegistro = this._nuevoRegistro.asReadonly();

    agregarFila(valor: boolean) {
        this._nuevoRegistro.set(valor);
    }

    private _mesesBloqueados = signal<string[]>([]);
    mesesBloqueados = this._mesesBloqueados.asReadonly();

    setMesesBloqueados(meses: string[]) {
        this._mesesBloqueados.set(meses ?? []);
    }




    /**FLAG PARA EL BOTON DE AGREGAR NUEVOI REGISTRO*/
    public _agregarRegistro = signal(true);
    readonly agregarRegistro = this._agregarRegistro.asReadonly();

    setAgregarRegistro(valor: boolean) {
        this._agregarRegistro.set(valor);
    }




    // FORMULARIO
    private _formFactorBloqueado = signal<boolean>(true);
    readonly formFactorBloqueado = this._formFactorBloqueado.asReadonly();

    setFormFactorBloqueado(v: boolean) {
        this._formFactorBloqueado.set(v);
    }

    // TABLAS
    private _tablaBloqueada = signal<boolean>(true);
    readonly tablaBloqueada = this._tablaBloqueada.asReadonly();

    setTablaBloqueada(v: boolean) {
        this._tablaBloqueada.set(v);
    }


    ///FLAG PARA RESETEAR EL FORMULARIO PERIODO

    private _resetPeriodo = signal(false);
    readonly resetPeriodo = this._resetPeriodo.asReadonly();

    triggerResetPeriodo() {
        this._resetPeriodo.set(true);
    }

    clearResetPeriodo() {
        this._resetPeriodo.set(false);
    }


    ///GUARDAR EL AÑO Y MES PARA USARLO EN OTROS COMPONENTES

    private _periodo = signal<{ anio: string; mes: string } | null>(null);
    periodo = this._periodo.asReadonly();

    setPeriodo(anio: string, mes: string) {
        this._periodo.set({ anio, mes });
    }

    ///VOLVER A MOSTRAR LA DATA
    private _visualizar = signal(0);

    visualizar() {
        this._visualizar.update(v => v + 1); // evento
    }

    visualizarSignal() {
        return this._visualizar;
    }

    /// BLOQUE SELECTS MES Y ANIO
    bloqueoEditar = signal<boolean>(false);


    // activarBloqueo() {
    //     this.bloqueoEditar.set(true);
    // }

    // desactivarBloqueo() {
    //     this.bloqueoEditar.set(false);
    // }

}
