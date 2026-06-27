import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { ARREGLO_BOTONES, BotonesInterface } from '../interface/programa-mensual.interface';

/**
 * Servicio de Comunicación de Acciones de Botones
 * 
 * Este servicio permite la comunicación entre el componente padre (edicion-programa-mensual-labores)
 * y los componentes hijos (tablas de preparación, explotación, desarrollo, exploración).
 * 
 * Cuando se presiona un botón de acción en el componente padre, este servicio emite
 * la acción a través de un signal que los componentes hijos pueden escuchar.
 * 
 * @example
 * // En el componente padre:
 * this.botonAccionService.accionActual.set('Guardar');
 * 
 * // En el componente hijo:
 * effect(() => {
 *   const accion = this.botonAccionService.accionActual();
 *   if (accion) this.handleAccion(accion);
 * });
 */
@Injectable({
    providedIn: 'root'
})
export class BotonAccionService {
    /**
     * Signal que contiene la acción actual del botón presionado
     * Valores posibles: 'Nuevo', 'Guardar', 'Eliminar', 'Copiar Labor', 
     * 'Resumen', 'Importar', 'Exportar', 'Labores', 'Cerrar'
     */
    accionActual = signal<string>('');

    botones = signal<BotonesInterface[]>([...ARREGLO_BOTONES]);

    formularioCabValido = signal<boolean>(false);

    setBloqueos(config: Record<string, boolean>) {
        this.botones.update(btns =>
            btns.map(btn => ({
                ...btn,
                bloqueo: config[btn.accion] ?? btn.bloqueo
            }))
        );
    }

    resetBotones() {
        this.botones.set([...ARREGLO_BOTONES]);
    }

    private accionSubject = new Subject<string>();
    accion$ = this.accionSubject.asObservable();

    emitirAccion(accion: string) {
        this.accionSubject.next(accion);
    }

    // mostrar u ocultar modal
    mostrarModal = signal(false);

    abrir() {
        // this.dataTabla.set(datos);
        this.mostrarModal.set(true);
    }

    cerrar() {
        this.mostrarModal.set(false);
    }

    laborCopiada = signal<any>(null);

    setLaborCopiada(data: any) {
        this.laborCopiada.set(data);
    }

    //VALIDACIONES DE ERRORES DE LOS INPUTS 

    public fasesIncompletasGlobal = signal<Map<string, number[]>>(new Map());
    
    // ✅ agregar esto
    private formularioLabores: FormGroup | null = null; mostrarErrores = signal(false);

    registrarFormulario(form: FormGroup): void {
        this.formularioLabores = form;
    }
    getFormulario(): FormGroup | null {
        return this.formularioLabores;
    }

    filasIncompletas = signal<number[]>([]);



}
