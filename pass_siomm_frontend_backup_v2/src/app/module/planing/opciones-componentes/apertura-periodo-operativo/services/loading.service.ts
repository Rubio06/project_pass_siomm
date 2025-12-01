import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loading = signal(false);   // el signal principal

    spinner = this.loading.asReadonly(); // el que se usa en los componentes

    loadingOn() {
        this.loading.set(true);
    }

    loadingOff() {
        this.loading.set(false);
    }
}
