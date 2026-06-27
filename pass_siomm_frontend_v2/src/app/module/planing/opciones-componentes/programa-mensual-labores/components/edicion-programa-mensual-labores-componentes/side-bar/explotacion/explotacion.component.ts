import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { EdicionProgramaMensualRutasComponent } from 'src/app/shared/components/edicion-programa-mensual-rutas/edicion-programa-mensual-rutas.component';
import { EdicionProgrmaMensualService } from '../../../../services/edicionProgrmaMensual.service';
import { MostrarMaeFase } from '../../../../interface';

@Component({
    selector: 'app-explotacion',
    imports: [RouterOutlet, EdicionProgramaMensualRutasComponent],
    templateUrl: './explotacion.component.html',
    styleUrls: ['./explotacion.component.css']
})
export class ExplotacionComponent {

    private edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);


    codigo_fase = signal<string | null>(null)

    ngOnInit() {
        this.mostrarMaeFase();

    }

    

    mostrarMaeFase(): void {
        this.edicionProgrmaMensualService.mostrarMaeFase()
            .subscribe({
                next: (fases: MostrarMaeFase[]) => {
                    // Buscamos la fase (usando find es más seguro que el índice [1])
                    const fase = fases.find(f => f.nom_fase?.toUpperCase().includes('EXPLOTACION'));

                    if (fase) {
                        const cod = fase.cod_fase ?? '';
                        this.codigo_fase.set(cod);
                    }
                }
            });
    }
}
