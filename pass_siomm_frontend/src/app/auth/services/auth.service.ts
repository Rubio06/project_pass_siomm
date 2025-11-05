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
            const token = localStorage.getItem('token');
            if (token) {
                this.loggedIn.set(true);
            }
        }
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http
            .post<LogResponse>(`${this.authUrl}Auth/authenticate`, { username, password })
            .pipe(
                map((resp) => {

                    if (resp.success && isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('token', resp.data.token);
                        localStorage.setItem('username', resp.data.username);
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
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }

        this.router.navigate(['/login']);
        this.loggedIn.set(false);
    }
}
