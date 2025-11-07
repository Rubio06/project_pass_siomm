import { Component, effect, ElementRef, HostListener, inject, input, Input, QueryList, signal, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from "@angular/router";
import { ListDesktopComponent } from 'src/app/shared/components/header-list-desktop/list-desktop.component';
import { ListMobileComponent } from 'src/app/shared/components/header-list-mobile/list-mobile.component';

@Component({
    selector: 'app-main-page',
    imports: [CommonModule, RouterOutlet, ListDesktopComponent, ListMobileComponent],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.css',
})
export class MainPageComponent {
    authService = inject(AuthService);
}
