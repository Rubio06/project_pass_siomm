import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequestDto } from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = 'https://tu-backend.com'; // Cambia por tu URL real

    constructor(private http: HttpClient) { }

    login(request: LoginRequestDto): Observable<any> {
        return this.http.post(`${this.baseUrl}/auth/session-start`, request);
    }
}
