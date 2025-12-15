import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface CanComponentDeactivate {
    hasPendingChanges(): boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
        if (component.hasPendingChanges()) {
            Swal.fire({
                icon: 'warning',
                title: 'Cambios sin guardar',
                text: 'Debes guardar los cambios antes de salir.',
                confirmButtonText: 'Entendido',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return false;
        }
        return true;
    }
}
