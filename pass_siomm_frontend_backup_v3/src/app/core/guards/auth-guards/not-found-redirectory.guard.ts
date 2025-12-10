import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from 'src/app/module/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class NotFoundRedirectGuard implements CanActivate {
    private router = inject(Router);
    private authService = inject(AuthService);
    private platformId = inject(PLATFORM_ID);

    canActivate(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            if (username && token && this.authService.isAuthenticated()) {
                this.router.navigate(['/menu-principal']);
            } else {
                this.router.navigate(['/auth/login']);
            }
        }

        return false;
    }
}
