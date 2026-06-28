import { Component, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { SpinnerService } from 'src/app/shared/components/spinner/service/spinner.service';
import { LogResponse } from '../../interfaces/auth.interface';
import { DatosLoginCompartidoService } from 'src/app/module/planing/service/datos-login-compartido.service';

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
    
    private datosLoginCompartidoService = inject(DatosLoginCompartidoService);
    spinnerService = inject(SpinnerService);

    loginForm = this.fb.group({
        username: ['pract_ir.sist.cmc', [Validators.required]],
        password: ['cemuz351U', [Validators.required]]
    });

    onSubmit() {
        if (this.loginForm.invalid) {
            this.hasError.set(true);
            setTimeout(() => this.hasError.set(false), 2000);
            return;
        }

        const { username, password } = this.loginForm.value;

        // Descomentar si deseas activar el Spinner visual durante la carga
        // this.spinnerService.show();

        this.authServices.login(username!, password!).subscribe({
            next: (res: LogResponse) => {
                // this.spinnerService.hide();

                if (res && res.success) {
                    // Guardamos la información compartida del usuario que viene de la respuesta
                    this.datosLoginCompartidoService.setUsuario(res.data);
                    this.router.navigate(['/menu-principal']);
                } else {
                    this.hasError.set(true);
                    setTimeout(() => this.hasError.set(false), 3000);
                }
            },
            error: (err) => {
                // this.spinnerService.hide();
                console.error('Error al autenticar', err);
                this.hasError.set(true);
                setTimeout(() => this.hasError.set(false), 3000);
            }
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler(event: Event) {
        // Limpieza de seguridad al cerrar o recargar la ventana
        sessionStorage.removeItem('token'); 
    }
}