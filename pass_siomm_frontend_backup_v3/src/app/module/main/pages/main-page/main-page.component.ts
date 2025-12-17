import { Component, effect, ElementRef, HostListener, inject, input, Input, QueryList, signal, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from "@angular/router";
import { ListDesktopComponent } from 'src/app/shared/components/header-list-desktop/list-desktop.component';
import { AuthService } from 'src/app/module/auth/services/auth.service';

@Component({
    selector: 'app-main-page',
    imports: [CommonModule, RouterOutlet, ListDesktopComponent],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.css',
})
export class MainPageComponent {
    authService = inject(AuthService);

    sidebarOpen = false;

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
    }

    closeSidebar() {
        this.sidebarOpen = false;
    }
}
