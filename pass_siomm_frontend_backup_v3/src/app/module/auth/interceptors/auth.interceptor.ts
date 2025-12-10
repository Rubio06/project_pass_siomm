import { inject, PLATFORM_ID } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from 'src/app/module/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    // Inyecciones
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID); // Inyectar PLATFORM_ID

    // 🔑 CLAVE: Declarar 'token' fuera del bloque condicional e inicializar en null
    let token: string | null = null;

    if (isPlatformBrowser(platformId)) { // Usamos 'platformId' inyectado
        // 🔑 CLAVE: Asignamos el valor dentro del bloque seguro (Cliente)
        token = sessionStorage.getItem('token');
    }

    let authReq = req;

    // El resto de la lógica utiliza la variable 'token' declarada anteriormente
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

