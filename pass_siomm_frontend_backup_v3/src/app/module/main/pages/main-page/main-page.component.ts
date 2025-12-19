import { Component, effect, ElementRef, HostListener, inject, input, Input, QueryList, signal, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from "@angular/router";
import { ListDesktopComponent } from 'src/app/shared/components/header-list-desktop/list-desktop.component';
import { AuthService } from 'src/app/module/auth/services/auth.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { LoadingService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/loading.service';
import { SemanasAvanceMainService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-main-page',
    imports: [CommonModule, RouterOutlet, ListDesktopComponent, SpinnerComponent],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.css',
})
export class MainPageComponent {
    authService = inject(AuthService);
    loadingService = inject(LoadingService);
    sidebarOpen = false;

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
    }

    closeSidebar() {
        this.sidebarOpen = false;
    }


    // semanasAvanceMainService = inject(SemanasAvanceMainService);

    // hasPendingChanges(): boolean {
    //     return this.semanasAvanceMainService.getCambios(); // revisa los cambios pendientes
    // }


}
