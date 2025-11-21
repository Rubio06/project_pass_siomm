import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, TABLA_DATOS_SEMANAS_CICLO } from '../../../interface/aper-per-oper.interface';
import { PlanningService } from '../../../services/planning.service';
import { LoadingService } from '../../../services/loading.service';


@Component({
    selector: 'app-semanas-ciclo-main',
    imports: [ReactiveFormsModule, CommonModule, DatePipe],
    templateUrl: './semanas-ciclo-main.component.html',
    styleUrl: './semanas-ciclo-main.component.css',
})
export class SemanasCicloMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_CICLO);

    titulo = this.columnas().map(titulo => titulo.titulo);
    private planingService = inject(PlanningService);

    rutas = this.planingService.dataRoutes;
    responseData = signal<any[]>([]);

    public loadingService = inject(LoadingService);

    constructor() {

        effect(()=> {
            const data = this.rutas()?.data?.semana_ciclo;
            if (data) {
                this.responseData.set(data);
            }
        })
    }




}

