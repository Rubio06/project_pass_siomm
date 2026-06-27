import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { EdicionProgramaMensualRutasComponent } from 'src/app/shared/components/edicion-programa-mensual-rutas/edicion-programa-mensual-rutas.component';
import { EdicionProgrmaMensualService } from '../../../../services/edicionProgrmaMensual.service';
import { MostrarMaeFase } from '../../../../interface';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
    selector: 'app-exploracion',
    imports: [RouterOutlet, EdicionProgramaMensualRutasComponent],
    templateUrl: './exploracion.component.html',
    styleUrls: ['./exploracion.component.css']
})
export class ExploracionComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);


    codigo_fase = signal<string | null>(null)

    ngOnInit() {
        this.mostrarMaeFase();

        // this.route.paramMap.subscribe(params => {
        //     const cie_anio = params.get('cie_anio');
        //     const cie_per = params.get('cie_per');

        //     console.log('anio:', cie_anio);
        //     console.log('periodo:', cie_per);

        //     // Guardarlo en tu servicio si lo usas como estado
        //     // this.edicionProgrmaMensualService.setParametros(cie_anio, cie_per);
        // });

    }



    mostrarMaeFase(): void {
        this.edicionProgrmaMensualService.mostrarMaeFase()
            .subscribe({
                next: (fases: MostrarMaeFase[]) => {
                    // Buscamos la fase (usando find es más seguro que el índice [1])
                    const fase = fases.find(f => f.nom_fase?.toUpperCase().includes('EXPLORACION'));

                    if (fase) {
                        const cod = fase.cod_fase ?? '';
                        this.codigo_fase.set(cod);
                    }
                }
            });
    }
}
