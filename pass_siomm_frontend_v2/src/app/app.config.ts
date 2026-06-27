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
<<<<<<< HEAD
// import { AppRouteReuseStrategy } from './core/strategy/route-reuse.strategy';
import { loaderInterceptor } from './module/auth/interceptors/loader.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';

=======
import { AppRouteReuseStrategy } from './core/strategy/route-reuse.strategy';
import { loaderInterceptor } from './module/auth/interceptors/loader.interceptor';
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
<<<<<<< HEAD
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, loaderInterceptor,

        ]))
=======
        provideClientHydration(withEventReplay()),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor, loaderInterceptor])),

        provideRouter(routes),
        {
            provide: RouteReuseStrategy,
            useClass: AppRouteReuseStrategy
        }
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    ],
};
