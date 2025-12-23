import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface CanComponentDeactivate {
    hasPendingChanges(): boolean;
    onVisualizar(): void;

}

@Injectable({
    providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(
        component: CanComponentDeactivate
    ): Observable<boolean> {

        // Si no hay cambios, salir libre
        if (!component.hasPendingChanges()) {
            return new Observable(observer => {
                observer.next(true);
                observer.complete();
            });
        }

        return new Observable<boolean>(observer => {

            Swal.fire({
                icon: 'warning',
                title: 'Cambios sin guardar',
                text: '¿Desea salir sin guardar cambios?',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: '#00426F',
            }).then(result => {

                // 👉 SÍ: salir sin guardar
                if (result.isConfirmed) {
                    component.onVisualizar(); // activa modo visualización
                    observer.next(true);      // permite cambiar de ruta
                }

                // 👉 NO: quedarse en el formulario
                else {
                    observer.next(false);     // bloquea navegación
                }

                observer.complete();
            });
        });
    }
}
