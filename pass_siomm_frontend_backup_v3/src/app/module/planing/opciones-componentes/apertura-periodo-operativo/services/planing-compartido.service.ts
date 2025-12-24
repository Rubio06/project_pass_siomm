import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PlaningCompartidoService {
    private http = inject(HttpClient);

    // Persistencia de cada tab/form
    private _canchas: WritableSignal<any[]> = signal([]);
    private _cierre_periodo: WritableSignal<any[]> = signal([]);
    private _exploracion_extandar: WritableSignal<any[]> = signal([]);
    private _factor: WritableSignal<any[]> = signal([]);
    private _factorOperativo: WritableSignal<any[]> = signal([]);
    private _factorSobredisolucion: WritableSignal<any[]> = signal([]);
    private _laboratorio_estandar: WritableSignal<any[]> = signal([]);
    private _metodo_minado: WritableSignal<any[]> = signal([]);
    private _operativo_detalle: WritableSignal<any[]> = signal([]);
    private _recuperacionBudget: WritableSignal<any[]> = signal([]);
    private _semana_avance: WritableSignal<any[]> = signal([]);
    private _semana_ciclo: WritableSignal<any[]> = signal([]);
    private _valores: WritableSignal<any[]> = signal([]);

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
    readonly valores = this._valores.asReadonly();

    // Métodos para setear datos
    setCanchas(data: any[]) { this._canchas.set(data); }
    setCierrePeriodo(data: any[]) { this._cierre_periodo.set(data); }
    setExploracionExtandar(data: any[]) { this._exploracion_extandar.set(data); }
    setFactor(data: any[]) { this._factor.set(data); }
    setFactorOperativo(data: any[]) { this._factorOperativo.set(data); }
    setFactorSobredisolucion(data: any[]) { this._factorSobredisolucion.set(data); }
    setLaboratorioEstandar(data: any[]) { this._laboratorio_estandar.set(data); }
    setMetodoMinado(data: any[]) { this._metodo_minado.set(data); }
    setOperativoDetalle(data: any[]) { this._operativo_detalle.set(data); }
    setRecuperacionBudget(data: any[]) { this._recuperacionBudget.set(data); }
    setSemanaAvance(data: any[]) { this._semana_avance.set(data); }
    setSemanaCiclo(data: any[]) { this._semana_ciclo.set(data); }
    setValores(data: any[]) { this._valores.set(data); }


    // Limpiar todo

    guardarTodo() {
        const payload = {
            valores: this._valores(),
            canchas: this._canchas(),
            factor: this._factor(),
            factorOperativo: this._factorOperativo(),
            laboratorio_estandar: this._laboratorio_estandar(),
            exploracion_extandar: this._exploracion_extandar(),
            metodo_minado: this._metodo_minado(),
            semana_ciclo: this._semana_ciclo(),
            semana_avance: this._semana_avance(),
        };
        console.log("la data es " + payload.semana_avance)

        return this.http.post('/api/guardar-todo', payload);
    }


    ///COMPONENTE VISUALIZAR
    onVisualizarGlobal() {

        // 🔓 Bloquea formularios
        this.setFormBloqueadoCentral(true);
        this.setModoEditar(false);

        // 👀 Activa modo visualizar
        this.notifyVisualizar();

        // 🟢 Opcional: limpia "modo cambios"
        this.setCambios(false);



        console.log('➡️ Volviendo a modo VISUALIZACIÓN');
    }

    estadoActual = signal('Visualización');

    setEstado(valor: string) {
        this.estadoActual.set(valor);
    }




    private cambios = signal(false);

    setCambios(valor: boolean): void {
        this.cambios.set(valor);
    }

    getCambios(): boolean {
        return this.cambios();
    }

    /////////GUARD PARA VISUALIAZAR DATOS










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

    // 🔁 Trigger de recreación del form
    private _formVersion = signal(0);
    readonly formVersion = this._formVersion.asReadonly();

    notifyFormChanged() {
        this._formVersion.update(v => v + 1);
    }


    // ===============================
    //  EVENTO RESET DE FORMS PARA BOTON NUEVO
    // ===============================
    private _resetAllForms = signal(0);
    readonly resetAllForms = this._resetAllForms.asReadonly();

    notifyResetForms() {
        this._resetAllForms.update(v => v + 1);
    }

    ////////PERMANECE BLOQUEADO DOS INPUTS EN PERIODO
    private _modoEditar = signal(false);
    readonly modoEditar = this._modoEditar.asReadonly();

    setModoEditar(valor: boolean) {
        this._modoEditar.set(valor);
    }

    ////////////SE RESETEA TODO HASTA LOS SECTS CON EL BOTON VISUALIZAR

    private _visualizarForms = signal(0);
    readonly visualizarForms = this._visualizarForms.asReadonly();
    public _modoVisualizar = signal(false);
    readonly modoVisualizar = this._modoVisualizar.asReadonly();

    notifyVisualizar() {
        this._visualizarForms.update(v => v + 1); // modo visualizar es 2
        this._modoVisualizar.set(true); // flag activo
    }

    salirModoVisualizar() {
        this._modoVisualizar.set(false);
    }

    data = signal<any>(null);
    private _dataRoutes: WritableSignal<any> = signal([]);
    public readonly dataRoutes: Signal<any> = this._dataRoutes.asReadonly();

    setData(data: any): void {
        this._dataRoutes.set(data);
    }


}
