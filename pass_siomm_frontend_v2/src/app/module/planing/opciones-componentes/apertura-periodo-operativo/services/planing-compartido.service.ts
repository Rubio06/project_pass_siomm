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


    //VALIDACIONES PARA FORMULARIOS REACTIVOS
    private forms = new Map<string, FormGroup>();
    private activeTab: string | null = null;

    /* Registrar form por tab */
    registerForm(tab: string, form: FormGroup) {
        // console.log(tab, form);
        this.forms.set(tab, form);
    }

    /* Decir cuál tab está activo */
    setActiveTab(tab: string) {
        this.activeTab = tab;
    }

    /* Obtener el form actual */
    getActiveForm(): FormGroup | null {
        return this.activeTab ? this.forms.get(this.activeTab) ?? null : null;
    }

    /* Validar SOLO el tab activo */
    isActiveFormValid(): boolean {
        const form = this.getActiveForm();
        return form ? form.valid : true;
    }

    markActiveFormAsTouched() {
        const form = this.getActiveForm();
        form?.markAllAsTouched();
    }

    /* 🔒 (opcional) validación global */
    isAllValid(): boolean {
        return [...this.forms.values()].every(f => f.valid);
    }



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
        let current = this._semana_ciclo(); // obtener lo actual
        if (!Array.isArray(data)) {
            // si es una sola fila, buscar si ya existe y reemplazar
            const index = current.findIndex(d => d.num_semana === data.num_semana);
            if (index >= 0) {
                current[index] = data; // reemplaza fila existente
            } else {
                current.push(data); // agregar nueva fila
            }
        } else {
            // si es un array, reemplaza todo (solo cuando venga de backend)
            current = data;
        }

        this._semana_ciclo.set(current);
        this._lastTab = tab || '';
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

        let payload: any = {};

        switch (this._lastTab) {


            case 'factor_operativo':
                payload = {
                    cierre_periodo: this._cierre_periodo(),
                    factor: this._factor(),
                    factorOperativo: this._factorOperativo(),
                    operativo_detalle: this._operativo_detalle(),
                    canchas: this._canchas(),
                    recuperacionBudget: this._recuperacionBudget(),
                    factorSobredisolucion: this._factorSobredisolucion(),

                    modo: modoBoton,
                    validacion: 'FORMULARIO',
                    username: localStorage.getItem('username'),
                };
                break;

            case 'semana_avance':
                const semanasFormateadas = this._semana_avance().map(s => ({
                    ...s,
                    // cie_ano: anio,
                    // cie_per: mes,
                    fec_ini: this.toDateTime(s.fec_ini),
                    fec_fin: this.toDateTime(s.fec_fin),
                }));


                payload = {
                    semana_avance: semanasFormateadas,
                    modo: modoBoton,
                    validacion: 'SEMANA_AVANCE',
                    username: localStorage.getItem('username')
                }
                break;

            case 'semana_ciclo':
                const semanasFormateadoCiclo = this._semana_ciclo().map(s => ({
                    ...s,
                    // cie_ano: anio,
                    // cie_per: mes,
                    fec_ini: this.toDateTime(s.fec_ini),
                    fec_fin: this.toDateTime(s.fec_fin),
                }));


                payload = {
                    semana_ciclo: semanasFormateadoCiclo,
                    modo: modoBoton,
                    validacion: 'SEMANA_CICLO',
                    username: localStorage.getItem('username')
                }
                break;

            case 'metodo_minado':
                const semanasMetodoMinado = this._metodo_minado().map(s => ({
                    ...s,
                }));

                payload = {
                    metodo_minado: semanasMetodoMinado,
                    modo: modoBoton,
                    validacion: 'METODO_MINADO',
                    username: localStorage.getItem('username')
                }
                break;


            case 'exploracion_estandar':
                const semanasExploracionEstandar = this._exploracion_extandar().map(s => ({
                    ...s,
                }));

                payload = {
                    exploracion_extandar: semanasExploracionEstandar,
                    modo: modoBoton,
                    validacion: 'EXPLORACION_ESTANDAR',
                    username: localStorage.getItem('username')
                }
                break;

            case 'estandar_avance':

                const semanasLaboratorioEstandar = this._laboratorio_estandar().map(s => ({
                    ...s,
                }));

                payload = {
                    laboratorio_estandar: semanasLaboratorioEstandar,
                    modo: modoBoton,
                    validacion: 'ESTANDAR_AVANCE',
                    username: localStorage.getItem('username')
                }
                break;

        }
        console.log(
            'Mis datos enviados son:\n',
            JSON.stringify(payload, null, 2)
        );
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

        console.log(data)
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

    setMonths(data: string[]) {
        this.meses.set(data);

        if (!this.mesSeleccionado() && data.length) {
            this.mesSeleccionado.set(data[0]);
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



    public datosGlobales = signal<any>(this.leerDeMemoria());

    constructor() {
        // Cada vez que los datos cambien, se guardan en el navegador automáticamente
        effect(() => {
            localStorage.setItem('mi_guardado', JSON.stringify(this.datosGlobales()));
        });
    }

    // Función para guardar lo de un tab específico
    guardarCopiaTemporal(nombreTab: string, data: any) {
        this.datosGlobales.update(actual => ({
            ...actual,
            [nombreTab]: data
        }));
    }

    private leerDeMemoria() {
        const data = localStorage.getItem('mi_guardado');
        return data ? JSON.parse(data) : {};
    }



}
