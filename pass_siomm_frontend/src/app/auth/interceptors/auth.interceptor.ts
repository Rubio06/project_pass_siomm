import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) {
    const token = inject(AuthService)._token();

    // const token = localStorage.getItem('token');

    console.log("token", token)

    const newReq = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
    return next(newReq);
}
