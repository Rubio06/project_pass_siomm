import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environments';
import { Observable } from 'rxjs';
import { MainPagePrimer } from '../interfaces/main-page.interface';

@Injectable({
    providedIn: 'root'
})
export class MainPageService {
    private http = inject(HttpClient);
    private routeshUrl = environment.baseUrl;

    getRutas(): Observable<MainPagePrimer[]> {
        return this.http.get<MainPagePrimer[]>(`${this.routeshUrl}api/Routers/mostrar-rutas`);
    }


}
