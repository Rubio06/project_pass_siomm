import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, HostListener, inject, Input, input, QueryList, signal, Signal, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MainPagePrimer } from 'src/app/main/interfaces/main-page.interface';
import { MainPagePipe } from 'src/app/main/pipe/main-page-pipe';
import { MainPageService } from 'src/app/main/services/main-page.service';

@Component({
    selector: 'app-list-desktop',
    imports: [CommonModule, RouterLink, MainPagePipe],
    templateUrl: './list-desktop.component.html',
    styleUrl: './list-desktop.component.css',
})
export class ListDesktopComponent {
    authService = inject(AuthService);
    routesService = inject(MainPageService);
    routers = signal<MainPagePrimer[]>([]);
    hasError = signal<string | null>('');

    @ViewChildren('menu', { read: ElementRef }) menus!: QueryList<ElementRef>;


    ngOnInit(): void {
        this.loadRoutes();
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.closeDetailsOnMobile);
    }

    closeDetailsOnMobile = () => {
        if (window.innerWidth <= 1024) {
            document.querySelectorAll("details").forEach((d: any) => d.open = false);
        }
    };

    loadRoutes() {
        this.routesService.getRoutes().subscribe({
            next: (data: MainPagePrimer[]) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                }
                this.routers.set(data);
            },
            error: (err) => {
                console.error('Error al obtener rutas:', err);
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        });
    }

    getChildren(item: any) {
        return item.rutas_secundarias
            || item.rutas_terciarias
            || item.rutas_cuartas
            || item.opciones
            || [];
    }

    getName(item: any) {
        return item.nom_ruta_primer
            || item.nom_ruta_secun
            || item.nom_ruta_terc
            || item.nom_ruta_cuar
            || item.nom_ruta_opc;
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        this.menus.forEach(menu => {
            const detailsEl = menu.nativeElement.querySelector('details') as HTMLDetailsElement;
            if (detailsEl && !detailsEl.contains(event.target as Node)) {
                detailsEl.open = false;
            }
        });
    }

    closeAllDropdowns() {
        const allDetails = document.querySelectorAll('details');
        allDetails.forEach(d => d.removeAttribute('open'));
    }

    closeOtherMenus(event: any) {
        const currentDetails = event.target.closest('details');
        const parent = currentDetails?.parentElement?.parentElement;

        if (!parent) return;

        const allDetails = parent.querySelectorAll('details');

        allDetails.forEach((details: any) => {
            if (details !== currentDetails) {
                details.removeAttribute('open');
            }
        });
    }
}
