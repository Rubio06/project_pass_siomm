import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth-guard.guard';
import { LoginGuard } from './auth/guards/LoginGuard.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.default),
        canActivate: [LoginGuard],
    },
    {
        path: 'main',
        loadChildren: () => import('./main/main.routes').then(m => m.default),
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        loadComponent: () =>
            import('./shared/components/not-found/not-found.component').then(c => c.NotFound),
    },
];


