import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-autenticate.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canMatch: [
            NotAuthenticatedGuard
        ]
    },
    {
        path: 'main',
        loadChildren: () => import('./main/main.routes'),
    },
    {
        path: '**',
        loadComponent: () =>
            import('./shared/components/not-found/not-found.component').then(c => c.NotFound),
    },
];


