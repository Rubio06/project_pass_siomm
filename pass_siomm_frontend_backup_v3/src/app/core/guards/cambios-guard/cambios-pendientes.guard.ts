import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
    hasPendingChanges(): boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
        console.log("Entre al guard")
        if (component.hasPendingChanges()) {
            return confirm('Tienes cambios sin guardar. ¿Deseas salir y perderlos?');
        }
        return true;
    }
}
