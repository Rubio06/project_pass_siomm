import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { IconosComponent } from './iconos/iconos';
import { MainPagePipe } from 'src/app/module/main/pipe/main-page-pipe';
import { AuthService } from 'src/app/module/auth/services/auth.service';
import { MainPageService } from 'src/app/module/main/services/main-page.service';
import { MainPagePrimer } from 'src/app/module/main/interfaces/main-page.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';

@Component({
    selector: 'app-list-desktop',
    imports: [CommonModule, MainPagePipe, IconosComponent, RouterLink, BrowserAnimationsModule  ],
    templateUrl: './list-desktop.component.html',
    styleUrl: './list-desktop.component.css',
})
export class ListDesktopComponent {
    authService = inject(AuthService);
    routesService = inject(MainPageService);
    hasError = signal<string | null>(null);
    dataService = inject(PlanningService); // 👈 4. Inyectar tu DataService (Signal)
    router = inject(Router)
    iconos = signal<string>('');

    asignarIcono(nombre: string) {
        const icons: Record<string, string> = {
            Geología: 'globe-alt',
            Planeamiento: 'map',
            Mina: 'cube-transparent',
            Laboratorio: 'beaker',
            Planta: 'cog-6-tooth'
        };

        return icons[nombre] || 'square-3-stack-3d';
    }

    routers = signal<MainPagePrimer[]>([]);

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

        // this.planingService.setBloqueoForm(true);  // ← SIEMPRE desbloquear
        // this.planingService.setData([]);
        // console.log("toke la ruta")


        return item.rutas_secundarias
            || item.rutas_terciarias
            || item.rutas_cuartas
            || item.opciones
            || [];
    }

    getName(item: any) {

        // console.log("toke la ruta")

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
        // this.planingService.setBloqueoForm(true);  // ← SIEMPRE desbloquear
        // this.planingService.setData([]);
        // console.log("toke la ruta")
        return text
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // quita acentos
            .replace(/\s+/g, '-');                              // espacios → guiones
    }

    submenuHeights: number[] = [];

    toggleSubmenu(event: Event, index: number) {
        const details = event.target as HTMLDetailsElement;
        const ul = details.querySelector('ul');

        console.log(ul)

        if (!ul) return;

        if (details.open) {
            // Abrir: guardar altura real para transición
            this.submenuHeights[index] = ul.scrollHeight;
        } else {
            // Cerrar: poner altura 0
            this.submenuHeights[index] = 0;
        }
    }
}
