import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, Observable, of } from 'rxjs';
import { MainPagePrimer } from '../interfaces/main-page.interface';

@Injectable({
    providedIn: 'root'
})
export class MainPageService {
    private http = inject(HttpClient);
    private routeshUrl = environment.baseUrl;

    public getRoutes(): Observable<MainPagePrimer[]> {
        return this.http.get<MainPagePrimer[]>(
            `${this.routeshUrl}rutas/mostrar-rutas`
        ).pipe(catchError(error => {
            console.error('Error cargando rutas:', error);
            return of([]);
        }));
    }
}
