import { Injectable, inject, signal, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environments';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { LogResponse } from '../interfaces/auth.interface';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private authUrl = environment.baseUrl;
    public loggedIn = signal(false);
    public hasError = signal('');


    constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
        if (isPlatformBrowser(this.platformId)) {
            const token = sessionStorage.getItem('token');
            if (token) {
                this.loggedIn.set(true);
            }
        }

        // this.startInactivityWatcher();

    }

    login(username: string, password: string): Observable<boolean> {
        return this.http
            .post<LogResponse>(`${this.authUrl}auth/authenticate`, { username, password })
            .pipe(
                map((resp) => {

                    if (resp.success && isPlatformBrowser(this.platformId)) {
                        sessionStorage.setItem('token', resp.data.token);
                        sessionStorage.setItem('username', resp.data.username);
                        this.loggedIn.set(true);
                        return true;
                    }

                    this.loggedIn.set(false);

                    return false;
                }),
                catchError((error) => {
                    this.hasError.set(error.error?.message || 'Error en autenticación');
                    setTimeout(() => {
                        this.hasError.set('');
                    }, 5000);

                    this.loggedIn.set(false);
                    return of(false);
                })
            );
    }

    isAuthenticated(): boolean {
        return this.loggedIn();
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
        }

        this.router.navigate(['/auth/login']);
        this.loggedIn.set(false);

        // this.clearInactivityTimer();

    }
    // 🔹 Nuevo: revisar token expirado periódicamente
    // private startInactivityWatcher() {
    //     if (!isPlatformBrowser(this.platformId)) return;

    //     const resetTimer = () => {
    //         this.clearInactivityTimer();
    //         this.inactivityTimer = setTimeout(() => {
    //             this.logout();
    //         }, this.TIMEOUT);
    //     };

    //     // Eventos que cuentan como “actividad”
    //     ['click', 'keydown', 'mousemove', 'scroll'].forEach(event =>
    //         document.addEventListener(event, resetTimer)
    //     );

    //     // Iniciamos el timer por primera vez
    //     resetTimer();
    // }

    // private clearInactivityTimer() {
    //     if (this.inactivityTimer) {
    //         clearTimeout(this.inactivityTimer);
    //     }
    // }
}
