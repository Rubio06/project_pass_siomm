import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/module/auth/services/auth.service';


export const AuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
                // router.navigate(['/main']);

        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};
