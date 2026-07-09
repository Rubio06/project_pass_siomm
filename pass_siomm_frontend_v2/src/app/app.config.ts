import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';

import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AppRouteReuseStrategy } from './core/strategy/route-reuse.strategy';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, loaderInterceptor])),
        provideAnimations(),
        {
            provide: RouteReuseStrategy,
            useClass: AppRouteReuseStrategy
        }
    ],
};