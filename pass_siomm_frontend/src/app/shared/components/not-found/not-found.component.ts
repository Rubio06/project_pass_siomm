import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from 'src/app/module/auth/services/auth.service';

@Component({
    selector: 'app-not-found',
    imports: [],
    standalone: true,


    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
    private router = inject(Router);
    private authService = inject(AuthService);
    private platformId = inject(PLATFORM_ID);



    volver() {
        const isLogged = this.authService.isAuthenticated(); // o como validas tu token

        if (isLogged) {
            this.router.navigate(['/menu-principal']);
        } else {
            this.router.navigate(['/auth/login']);
        }
    }

    ngOnInit() {
        // const token = localStorage.getItem('token');
        // const username = localStorage.getItem('username');

        // if (username && token && this.authService.isAuthenticated()) {
        //     this.router.navigate(['/menu-principal']);
        // } else {
        //     this.router.navigate(['/auth/login']);
        // }

    }
}
