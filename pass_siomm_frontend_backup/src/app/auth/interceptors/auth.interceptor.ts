import { inject } from '@angular/core';
import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = sessionStorage.getItem('token'); // mejor usar sessionStorage

    let authReq = req;

    if (token) {
        // Verificar expiración del JWT
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expires = payload.exp * 1000; // convertir a ms
            if (Date.now() > expires) {
                // Token expirado
                authService.logout();
                router.navigate(['/login']);
                return throwError(() => new Error('Token expirado'));
            }

            // Clonar request con token
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error('Error al leer el token:', err);
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => new Error('Token inválido'));
        }
    }

    // Manejar respuesta con error 401
    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => err);
        })
    );
};

