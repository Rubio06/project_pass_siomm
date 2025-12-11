import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlaningCompartido {
    // Bloqueo de formulario
    private _bloqueoForm: WritableSignal<boolean> = signal(false);
    private http = inject(HttpClient);

    public readonly bloqueoForm = this._bloqueoForm.asReadonly();
    setBloqueoForm(valor: boolean) { this._bloqueoForm.set(valor); }

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
    // setSemanaCiclo(data: any[]) { this._semana_ciclo.set(data); }

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

        console.log('📤 Payload completo para guardar:', payload);

        return this.http.post('/api/guardar-todo', payload);
    }


    // Método para actualizar los Signals localmente
    guardarEnMemoria() {
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

        // Aquí solo actualizas los Signals
        this._valores.set(payload.valores);
        this._canchas.set(payload.canchas);
        this._factor.set(payload.factor);
        this._factorOperativo.set(payload.factorOperativo);
        this._laboratorio_estandar.set(payload.laboratorio_estandar);
        this._exploracion_extandar.set(payload.exploracion_extandar);
        this._metodo_minado.set(payload.metodo_minado);
        this._semana_ciclo.set(payload.semana_ciclo);
        this._semana_avance.set(payload.semana_avance);
    }

    // Método para asignar valores
    // setSemanaCiclo(data: any[]) {
    //     this._semana_ciclo.set(data);
    // }

    // setter
    // setSemanaCiclo(data: any[]) {
    //     this._semana_ciclo.set(data);
    // }

    // getter
    // Signal que almacena las semanas
    // private _semana_ciclo = signal<any[]>([]);

    // ===============================
    // GETTER: devuelve el valor actual
    // ===============================
    getSemanaCiclo(): any[] {
        // Aseguramos que siempre sea un array
        const val = this._semana_ciclo();
        return Array.isArray(val) ? val : [];
    }

    // ===============================
    // SETTER: actualiza el Signal
    // ===============================
    setSemanaCiclo(data: any[]) {
        // Aseguramos que siempre se guarde un array
        this._semana_ciclo.set(Array.isArray(data) ? data : []);
    }

    // ===============================
    // OPCIONAL: guardar en localStorage para persistencia al recargar la página
    // ===============================
    // guardarEnLocalStorage() {
    //     localStorage.setItem('semana_ciclo', JSON.stringify(this._semana_ciclo()));
    // }

    // cargarDesdeLocalStorage() {
    //     const raw = localStorage.getItem('semana_ciclo');
    //     if (raw) {
    //         try {
    //             const parsed = JSON.parse(raw);
    //             this.setSemanaCiclo(Array.isArray(parsed) ? parsed : []);
    //         } catch (e) {
    //             console.error('Error cargando semana_ciclo desde localStorage', e);
    //         }
    //     }
    // }

    
}
