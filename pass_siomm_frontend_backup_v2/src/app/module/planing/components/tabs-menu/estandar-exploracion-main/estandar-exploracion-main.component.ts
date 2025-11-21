import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, SelectZona, TABLA_DATOS_ESTANDAR_EXPLORACION } from '../../../interface/aper-per-oper.interface';
import { PlanningService } from '../../../services/planning.service';

@Component({
    selector: 'app-estandar-exploracion-main',
    imports: [FormsModule],
    templateUrl: './estandar-exploracion-main.component.html',
    styleUrl: './estandar-exploracion-main.component.css',
})
export class EstandarExploracionMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_ESTANDAR_EXPLORACION);

    titulo = this.columnas().map(titulo => titulo.titulo);

    private planingService = inject(PlanningService);

    rutas = this.planingService.dataRoutes;
    responseData = signal<any[]>([]);

    listZona = signal<SelectZona[]>([])
    onMetodoSeleccionado(nuevoValor: number) {
        console.log(`Nuevo valor seleccionado: ${nuevoValor}`);
    }


    constructor() {

        effect(() => {
            const data = this.rutas()?.data?.exploracion_extandar;
            if (data) {
                this.responseData.set(data);
            }
        })
        this.SelectZona();
    }

    public SelectZona() {
        this.planingService.SelectZona().subscribe({
            next: (data: any) => {
                this.listZona.set(data);
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
            }
        })
    }

}


