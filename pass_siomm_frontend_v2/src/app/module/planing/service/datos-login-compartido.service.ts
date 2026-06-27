import { Injectable, signal } from '@angular/core';
import { MaeUsuario } from '../../auth/interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class DatosLoginCompartidoService {

    // Signal que guarda el usuario actual (null si no hay)
    public usuario = signal<MaeUsuario | null>(null);

    // Método para actualizar el usuario
    setUsuario(usuario: MaeUsuario) {
        this.usuario.set(usuario);
    }

    // Método opcional para limpiar el usuario al logout
    clearUsuario() {
        this.usuario.set(null);
    }
}
