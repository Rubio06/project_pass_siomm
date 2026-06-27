import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { EdicionProgramaMensualRutasComponent } from 'src/app/shared/components/edicion-programa-mensual-rutas/edicion-programa-mensual-rutas.component';
import { EdicionProgrmaMensualService } from '../../../../services/edicionProgrmaMensual.service';
import { MostrarMaeFase } from '../../../../interface';

@Component({
    selector: 'app-desarrollo',
    imports: [RouterOutlet, EdicionProgramaMensualRutasComponent],
    templateUrl: './desarrollo.component.html',
    styleUrls: ['./desarrollo.component.css']
})
export class DesarrolloComponent implements OnInit {
    private edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);


    codigo_fase = signal<string | null>(null);

    ngOnInit() {
        this.mostrarMaeFase();
    }

    mostrarMaeFase(): void {
        this.edicionProgrmaMensualService.mostrarMaeFase()
            .subscribe({
                next: (fases: MostrarMaeFase[]) => {

                    const fase = fases.find(f =>
                        f.nom_fase?.toUpperCase().includes('DESARROLLO')
                    );

                    if (fase) {
                        const cod = fase.cod_fase ?? '';
                        this.codigo_fase.set(cod);
                    }
                }
            });
    }
}
