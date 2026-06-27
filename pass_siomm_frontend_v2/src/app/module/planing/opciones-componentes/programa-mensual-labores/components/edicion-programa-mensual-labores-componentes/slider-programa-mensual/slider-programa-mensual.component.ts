import { ICONOS, menuItem, MostrarMaeFase } from '../../../interface/edicion-programa-mensual.interface';
import { Component, signal, OnInit, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EdicionProgrmaMensualService } from '../../../services/edicionProgrmaMensual.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-slider-programa-mensual',
    imports: [RouterLinkActive, RouterLink],
    templateUrl: './slider-programa-mensual.component.html',
    styleUrls: ['./slider-programa-mensual.component.css']
})
export class SliderProgramaMensualComponent implements OnInit {
    iconos = ICONOS;
    listaFases = signal<menuItem[]>([]);
    edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);

    codFaseSelected = output<string>();

    ngOnInit(): void {
        this.mostrarMaeFase();
    }

    private mostrarMaeFase(): void {
        this.edicionProgrmaMensualService.mostrarMaeFase()
            .subscribe({
                next: (fases: MostrarMaeFase[]) => {
                    const menu: menuItem[] = fases.map(f => {
                        const cod = f.cod_fase?.trim() ?? '';
                        const nombre = f.nom_fase?.trim().toLowerCase() ?? '';

                        return {
                            path: `edicion-${nombre}`,
                            title: `${cod} - ${nombre.toUpperCase()}`,
                            icono: nombre as 'exploracion' | 'desarrollo' | 'preparacion' | 'explotacion',
                            cod_fase: cod
                        };

                    });

                    this.listaFases.set(menu);
                },
                error: (error) => console.error('Error cargando fases:', error)
            });
    }

    programaState = inject(EdicionProgrmaMensualService);

    onFaseClick(cod_fase: string): void {

        this.codFaseSelected.emit(cod_fase);
        this.programaState.setCodFase(cod_fase) ?? '01';

    }



}
