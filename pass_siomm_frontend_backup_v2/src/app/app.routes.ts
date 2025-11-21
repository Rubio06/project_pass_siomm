import { Routes } from '@angular/router';
import { LoginGuard } from './core/guards/auth-guards/LoginGuard.guard';
import { AuthGuard } from './core/guards/auth-guards/auth-guard.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () => import('./module/auth/auth.routes').then(m => m.default),
        canActivate: [LoginGuard],
    },
    {
        path: 'menu-principal',
        loadChildren: () => import('./module/main/main.routes').then(m => m.default),
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        loadComponent: () =>
            import('./shared/components/not-found/not-found.component').then(c => c.NotFound),
    },
];


