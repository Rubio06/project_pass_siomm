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
    hasError = signal<string | null>(null);
    dataService = inject(PlanningService); // 👈 4. Inyectar tu DataService (Signal)
    router = inject(Router)
    iconos = signal<string>('');
<<<<<<< HEAD
    routers = signal<MainPagePrimer[]>([]);

    openIndex: number | null = null;


    asignarIcono(nombre: string) {
        const icons: Record<string, string> = {
            Mantenimiento: 'wrench',
            Geología: 'globe-alt',
            Planeamiento: 'map',
            Mina: 'cube-transparent',
            Laboratorio: 'test-tube',
            Planta: 'cog-6-tooth'
        };

        return icons[nombre] || 'test-tube';
    }

=======

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

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    ngOnInit(): void {
        this.routesService.getRoutes().subscribe({
            next: (data) => {
                const dataConIconos = data.map(r => ({
                    ...r,
                    icon: this.asignarIcono(r.nom_ruta_primer)
                }));
                this.routers.set(dataConIconos);
<<<<<<< HEAD
=======

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
            },
            error: () => this.hasError.set('Error al cargar las rutas.')
        });
    }

    getChildren(item: any) {

<<<<<<< HEAD
=======
        // this.planingService.setBloqueoForm(true);  // ← SIEMPRE desbloquear
        // this.planingService.setData([]);
        // console.log("toke la ruta")

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

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
<<<<<<< HEAD

        return text
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '_');
            
    }


    //RUTAS RPIMER
    toggle(index: number) {

        this.openIndex = this.openIndex === index ? null : index;
    }


    //RUTAS SECUNDARIAS
=======
        // this.planingService.setBloqueoForm(true);  // ← SIEMPRE desbloquear
        // this.planingService.setData([]);
        // console.log("toke la ruta")

        return text
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // quita acentos
            .replace(/\s+/g, '-');                              // espacios → guiones
    }



    openIndex: number | null = null;

    toggle(index: number) {
        this.openIndex = this.openIndex === index ? null : index;
    }

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    isOpen(index: number): boolean {
        return this.openIndex === index;
    }

<<<<<<< HEAD
    //RUTAS TERCIARIAS
    // isSubOpen(index: number): boolean {

    //     console.log(index);
    //     return this.subOpenIndex === index;
    // }



    //RUTAS SECUN Y TERC
    subOpenIndex: number | null = null;
    thirdOpenIndex: number | null = null;

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


=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

    closeDrawer() {
        const drawer = document.getElementById('my-drawer-4') as HTMLInputElement;
        if (drawer) {
            drawer.checked = false;
        }

    }

<<<<<<< HEAD

=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
}
