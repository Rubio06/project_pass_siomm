import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';


import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './module/auth/interceptors/auth.interceptor';
import { AppRouteReuseStrategy } from './core/strategy/route-reuse.strategy';
import { loaderInterceptor } from './module/auth/interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, loaderInterceptor])),

        provideRouter(routes),
        {
            provide: RouteReuseStrategy,
            useClass: AppRouteReuseStrategy
        }
    ],
};
