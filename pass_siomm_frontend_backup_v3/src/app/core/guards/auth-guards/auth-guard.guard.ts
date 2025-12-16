import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/module/auth/services/auth.service';


export const AuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        // router.navigate(['/menu-principal']);
        return true;
    } else {
        router.navigate(['/auth/login']);
        return false;
    }
};
