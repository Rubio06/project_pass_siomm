import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class FiltroPlaneamientoService {
    codEmpresa = signal<string>('');
    codEmpresaUnidad = signal<string>('');

    public accionComodin = signal<'G' | 'E'>('E');

    cambiarEstado() {
        this.accionComodin.update(estadoActual => estadoActual === 'E' ? 'G' : 'E');
    }
    // codigoSeleccionado = signal<string>('');

    // MAE_ZONA
    filaSeleccionada = signal<string>(
        sessionStorage.getItem('zona_seleccionada') ?? ''
    );

    setFilaSeleccionada(codigo: string) {
        sessionStorage.setItem('zona_seleccionada', codigo);
        this.filaSeleccionada.set(codigo);
    }

    // Opcional: limpiar cuando cambias de módulo completo
    clearFilaSeleccionada() {
        sessionStorage.removeItem('zona_seleccionada');
        this.filaSeleccionada.set('');
    }

    // MAE_VETA

    filaSeleccionadaVeta = signal<{
        cod_veta: string;
        cod_zona: string;
        cod_und_econom: string;
    }>({
        cod_veta: sessionStorage.getItem('veta_seleccionada') ?? '',
        cod_zona: sessionStorage.getItem('zona_seleccionada') ?? '',
        cod_und_econom: sessionStorage.getItem('und_econom_seleccionada') ?? ''
    });

    setFilaSeleccionadaVeta(
        cod_veta: string,
        cod_zona: string,
        cod_und_econom: string
    ) {

        sessionStorage.setItem('veta_seleccionada', cod_veta);
        sessionStorage.setItem('zona_seleccionada', cod_zona);
        sessionStorage.setItem('und_econom_seleccionada', cod_und_econom);

        this.filaSeleccionadaVeta.set({
            cod_veta,
            cod_zona,
            cod_und_econom
        });
    }

    // Opcional
    clearFilaSeleccionadaVeta() {

        sessionStorage.removeItem('veta_seleccionada');
        sessionStorage.removeItem('zona_seleccionada');
        sessionStorage.removeItem('und_econom_seleccionada');

        this.filaSeleccionadaVeta.set({
            cod_veta: '',
            cod_zona: '',
            cod_und_econom: ''
        });
    }


}
