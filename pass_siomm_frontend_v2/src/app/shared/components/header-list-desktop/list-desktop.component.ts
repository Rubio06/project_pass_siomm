import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IconosComponent } from './iconos/iconos';
import { MainPagePipe } from 'src/app/module/main/pipe/main-page-pipe';
import { AuthService } from 'src/app/module/auth/services/auth.service';
import { MainPageService } from 'src/app/module/main/services/main-page.service';
import { MainPagePrimer } from 'src/app/module/main/interfaces/main-page.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';

@Component({
    selector: 'app-list-desktop',
    imports: [CommonModule, MainPagePipe, IconosComponent, RouterLink, RouterLinkActive],
    templateUrl: './list-desktop.component.html',
    styleUrl: './list-desktop.component.css',
})
export class ListDesktopComponent {
    authService = inject(AuthService);
    routesService = inject(MainPageService);
    dataService = inject(PlanningService);
    router = inject(Router);

    hasError = signal<string | null>(null);
    iconos = signal<string>('');
    routers = signal<MainPagePrimer[]>([]);

    openIndex: number | null = null;
    subOpenIndex: number | null = null;
    thirdOpenIndex: number | null = null;

    asignarIcono(nombre: string): string {
        const icons: Record<string, string> = {
            Mantenimiento: 'wrench',
            Geología: 'globe-alt',
            Planeamiento: 'map',
            Mina: 'cube-transparent',
            Laboratorio: 'beaker',
            Planta: 'cog-6-tooth'
        };
        return icons[nombre] || 'square-3-stack-3d';
    }

    ngOnInit(): void {
        this.routesService.getRoutes().subscribe({
            next: (data) => {
                const dataConIconos = data.map(r => ({
                    ...r,
                    icon: this.asignarIcono(r.nom_ruta_primer)
                }));
                this.routers.set(dataConIconos);
            },
            error: () => this.hasError.set('Error al cargar las rutas.')
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

    irRuta(path: string) {
        this.router.navigate(['/menu-principal', path]);
    }

    toUrl(text: string): string {
        return text
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-');
    }

    toggle(index: number) {
        this.openIndex = this.openIndex === index ? null : index;
    }

    isOpen(index: number): boolean {
        return this.openIndex === index;
    }

    toggleSub(index: number) {
        this.subOpenIndex = this.subOpenIndex === index ? null : index;
    }

    isSubOpen(index: number): boolean {
        return this.subOpenIndex === index;
    }

    toggleThird(index: number) {
        this.thirdOpenIndex = this.thirdOpenIndex === index ? null : index;
    }

    isThirdOpen(index: number): boolean {
        return this.thirdOpenIndex === index;
    }

    closeDrawer() {
        const drawer = document.getElementById('my-drawer-4') as HTMLInputElement;
        if (drawer) {
            drawer.checked = false;
        }
    }
}