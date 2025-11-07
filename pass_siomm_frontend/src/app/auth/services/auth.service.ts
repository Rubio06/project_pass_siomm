import { Injectable, inject, signal, Inject, PLATFORM_ID, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environments';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { DataToken, LogResponse } from '../interfaces/auth.interface';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private authUrl = environment.baseUrl;
    public loggedIn = signal(false);
    public hasError = signal<string | null>('');
    private _user = signal<any | null>(null);
    private platformId = inject(PLATFORM_ID);

    public _token = signal<string | null>(
        isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null
    );

    constructor(private router: Router) { }

    login(username: string, password: string): Observable<boolean> {
        return this.http
            .post<LogResponse>(`${this.authUrl}Auth/authenticate`, { username, password })
            .pipe(
                map((resp) =>
                    this.handleAuthSuccess(resp)
                ),
                catchError((error) =>
                    this.handleAuthError(error))
            );
    }

    // isAuthenticated(): boolean {
    //     return this.loggedIn();
    // }

    logout() {
        this._user.set(null);
        this._token.set(null);
        localStorage.removeItem('token');
        this.router.navigateByUrl('auth/login');
    }


    private handleAuthSuccess(resp: LogResponse) {
        this._user.set(resp.data.username);
        this._token.set(resp.data.token);
        localStorage.setItem('token', resp.data.token);
        return true;
    }

    private handleAuthError(error: any) {
        this.logout();
        const message = error?.error?.message || 'Error en autenticación';
        this.hasError.set(message);
        this.loggedIn.set(false);

        setTimeout(() => {
            this.hasError.set(null);
        }, 5000);

        return of(false);
    }
}


