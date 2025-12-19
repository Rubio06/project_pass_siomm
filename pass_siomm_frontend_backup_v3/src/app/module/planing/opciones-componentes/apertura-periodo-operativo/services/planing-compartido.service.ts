import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { PlanningData } from '../interface/aper-per-oper.interface';

@Injectable({
    providedIn: 'root'
})
export class PlaningCompartido {
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
    readonly valores = this._semana_ciclo.asReadonly();

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
    setValores(data: any[]) { this._semana_ciclo.set(data); }

    // Limpiar todo
    clearAll() {
        this._canchas.set([]);
        this._cierre_periodo.set([]);
        this._exploracion_extandar.set([]);
        this._factor.set([]);
        this._factorOperativo.set([]);
        this._factorSobredisolucion.set([]);
        this._laboratorio_estandar.set([]);
        this._metodo_minado.set([]);
        this._operativo_detalle.set([]);
        this._recuperacionBudget.set([]);
        this._semana_avance.set([]);
        this._semana_ciclo.set([]);
    }

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

        return this.http.post('/api/guardar-todo', payload);
    }

    getSemanaCiclo(): any[] {
        const val = this._semana_ciclo();
        return Array.isArray(val) ? val : [];
    }

    setSemanaCiclo(data: PlanningData[]) {
        this._semana_ciclo.set(Array.isArray(data) ? data : []);
    }





    private bloqueoFormEditar = signal(true);

    setBloqueoFormEditar(valor: boolean) {
        this.bloqueoFormEditar.set(valor);
    }

    getBloqueoFormEditar() {
        return this.bloqueoFormEditar;
    }



    public tableButtonEnabled = signal(false);

    enableTableButton() {
        this.tableButtonEnabled.set(true);
    }

    disableTableButton() {
        this.tableButtonEnabled.set(false);
    }




    data = signal<any>(null);
    private _dataRoutes: WritableSignal<any> = signal([]);
    public readonly dataRoutes: Signal<any> = this._dataRoutes.asReadonly();


    setData(data: any): void {
        this._dataRoutes.set(data);
    }


    private _bloqueo = signal<boolean>(true);
    public bloqueo = this._bloqueo.asReadonly();

    setBloqueo(v: boolean) {
        this._bloqueo.set(v);
    }


    readonly bloqueoFormEdit: WritableSignal<boolean> = signal(true);


    private _bloqueoForm = signal<boolean>(true); // true = bloqueado
    public bloqueoForm = this._bloqueoForm.asReadonly();

    setBloqueoForm(valor: boolean) {
        this._bloqueoForm.set(valor);
    }

}
