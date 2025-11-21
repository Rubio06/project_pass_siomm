import { Component, signal, input, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { ColumnaTabla, SelectTipoLabor, TABLA_DATOS_ESTANDAR_AVANCE } from '../../../interface/aper-per-oper.interface';
import { PlanningService } from '../../../services/planning.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
    selector: 'app-estandar-avance',
    imports: [FormsModule],
    templateUrl: './estandar-avance-main.component.html',
    styleUrl: './estandar-avance-main.component.css',
})
export class EstandarAvanceComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_ESTANDAR_AVANCE);
    titulo = this.columnas().map(titulo => titulo.titulo);

    private planingService = inject(PlanningService);

    rutas = this.planingService.dataRoutes;
    responseData = signal<any[]>([]);
    listLabor = signal<SelectTipoLabor[]>([])
    public loadingService = inject(LoadingService);


    constructor() {
        effect(() => {
            const data = this.rutas()?.data?.laboratorio_estandar;
            this.loadingService.loadingOn();

            if (data) {
                this.responseData.set(data);
            }
        })

        this.SelectTipoLabor()
    }
    onMetodoSeleccionado(nuevoValor: number) {
        console.log(`Nuevo valor seleccionado: ${nuevoValor}`);
    }

    public SelectTipoLabor() {
        this.planingService.SelectTipoLabor().subscribe({
            next: (data: any) => {
                this.listLabor.set(data);

            }, error: (error) => {
                console.error('Error al traer los meses.', error)
            }
        })
    }

}
