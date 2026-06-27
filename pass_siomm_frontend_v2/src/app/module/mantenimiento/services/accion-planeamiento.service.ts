import { Injectable, signal } from '@angular/core';
import { BOTONES_PLANEAMIENTO, BOTONES_PLANEAMIENTO_CONTRATO, BotonesInterface } from '../interfaces/manenimiento.interface';


@Injectable({ providedIn: 'root' })
export class AccionPlaneamientoService {


    botones = signal<BotonesInterface[]>([...BOTONES_PLANEAMIENTO]);
    botonesAdmContrato = signal<BotonesInterface[]>([...BOTONES_PLANEAMIENTO_CONTRATO]);
    accion = signal<string>('');
    accionAdmContrato = signal<string>('');

    public setBloqueos(config: Record<string, boolean>) {
        this.botones.update(btns =>
            btns.map(btn => ({
                ...btn,
                bloqueo: config[btn.accion] ?? btn.bloqueo
            }))
        );
    }

    public reset() {
        this.botones.set([...BOTONES_PLANEAMIENTO]);
    }

    public emitir(accion: string) {
        this.accion.set(accion);
    }

    /* botones adm-contrato */

    public setBloqueosAdmContrato(config: Record<string, boolean>) {
        this.botonesAdmContrato.update(btns =>
            btns.map(btn => ({
                ...btn,
                bloqueo: config[btn.accion] ?? btn.bloqueo
            }))
        );
    }

    public resetAdmContrato() {
        this.botonesAdmContrato.set([...BOTONES_PLANEAMIENTO_CONTRATO]);
    }

    public emitirAdmContrato(accionContrato: string) {
        this.accionAdmContrato.set(accionContrato);
    }





}



