import { Component, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { SpinnerService } from 'src/app/shared/components/spinner/service/spinner.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
    authServices = inject(AuthService);
    fb = inject(FormBuilder);
    hasError = signal(false);
    router = inject(Router);

    spinnerService = inject(SpinnerService);

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

        // Mostrar spinner antes de la petición
        // this.spinnerService.show();

        this.authServices.login(username!, password!).subscribe({
            next: (res: boolean) => {
                // Ocultar spinner cuando termine
                // this.spinnerService.hide();

                if (res) {
                    this.router.navigate(['/menu-principal']);
                } else {
                    this.hasError.set(true);
                    setTimeout(() => this.hasError.set(false), 3000);
                }
            },
            error: (err) => {
                // this.spinnerService.hide();
                console.error('Error al autenticar', err);
            }
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler(event: Event) {
        sessionStorage.removeItem('token'); // elimina token de localStorage
    }
}
