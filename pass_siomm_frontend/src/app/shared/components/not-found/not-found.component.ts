import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
    selector: 'app-not-found',
    template: `
        <div class="flex items-center justify-center min-h-screen bg-black text-white">
            <h1 class="text-3xl font-bold"><a href="http://localhost:4200/">redirigir</a></h1>
        </div>
    `,
})
export class NotFound {
    private router = inject(Router);
    private authService = inject(AuthService);
    private platformId = inject(PLATFORM_ID);

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');

            if (token) {
                this.router.navigate(['/main']);
            } else {
                this.router.navigate(['/auth/login']);
            }
        }
    }
}
