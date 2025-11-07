import { Component, effect, ElementRef, HostListener, inject, input, Input, QueryList, signal, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MainPageService } from '../../services/main-page.service';
import { MainPagePrimer } from '../../interfaces/main-page.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { MainPagePipe } from '../../pipe/main-page-pipe';

@Component({
    selector: 'app-main-page',
    imports: [MainPagePipe, CommonModule],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.css',
})
export class MainPageComponent {
    authService = inject(AuthService);
    routesService = inject(MainPageService);
    routers = signal<MainPagePrimer[]>([]);

    @ViewChildren('menu', { read: ElementRef }) menus!: QueryList<ElementRef>;


    ngOnInit(): void {
        this.loadRutas();
        window.addEventListener('resize', this.closeDetailsOnMobile);
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.closeDetailsOnMobile);
    }

    closeDetailsOnMobile = () => {
        if (window.innerWidth <= 1024) {
            document.querySelectorAll("details").forEach((d: any) => d.open = false);
        }
    };

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


    loadRutas() {
        this.routesService.getRutas().subscribe({
            next: (data) => {
                this.routers.set(data);
                console.log(this.routers())
            },
            error: (err) => {
                console.log('Error al obtener rutas:', err);
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
}
