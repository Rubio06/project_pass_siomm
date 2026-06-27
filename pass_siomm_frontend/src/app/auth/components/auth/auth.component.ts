import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class LoginComponent {

    loginForm: FormGroup;
    message: string = '';

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    submit() {
        if (this.loginForm.invalid) return;

        this.authService.login(this.loginForm.value).subscribe({
            next: (res) => {
                if (res.success) {
                    this.message = res.message;
                    // Aquí puedes guardar token/session o redirigir
                } else {
                    this.message = res.message;
                }
            },
            error: (err) => {
                this.message = err.error?.message || 'Error del servidor';
            }
        });
    }
}
