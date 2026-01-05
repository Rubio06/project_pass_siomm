import { Component, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
    authServices = inject(AuthService);
    fb = inject(FormBuilder);
    hasError = signal(false);
    router = inject(Router);

    loginForm = this.fb.group({
        username: ['pract_ir.sist.cmc', [Validators.required]],
        password: ['camuz351U', [Validators.required]]
    });

    onSubmit() {
        if (this.loginForm.invalid) {
            this.hasError.set(true);
            setTimeout(() => this.hasError.set(false), 2000);
            return;
        }

        const { username, password } = this.loginForm.value;

        this.authServices.login(username!, password!).subscribe({
            next: (res: boolean) => {
                if (res) {
                    this.router.navigate(['/menu-principal']);
                } else {
                    this.hasError.set(true);
                    setTimeout(() => {
                        this.hasError.set(false);
                    }, 3000);
                }
            },
            error: (err) => {
                console.error('Error al autenticar', err);
            }
        });
    }
}
