import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, TABLA_DATOS_SEMANAS_AVANCES } from '../../../interface/aper-per-oper.interface';
import { PlanningService } from '../../../services/planning.service';

@Component({
    selector: 'app-semanas-avance-main',
    imports: [ReactiveFormsModule, DatePipe, CommonModule, FormsModule],
    templateUrl: './semanas-avance-main.component.html',
    styleUrl: './semanas-avance-main.component.css',
})
export class SemanasAvanceMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_AVANCES);

    titulo = this.columnas().map(titulo => titulo.titulo);
    private planingService = inject(PlanningService);

    rutas = this.planingService.dataRoutes;
    responseData = signal<any[]>([]);



    constructor() {

        effect(() => {
            const data = this.rutas()?.data?.semana_avance;
            console.log(data)
            if (data) {
                this.responseData.set(data);
            }
        })
    }

    agregarNuevo() {
        const nuevaFila: any = {};

        TABLA_DATOS_SEMANAS_AVANCES.forEach(campo => {
            nuevaFila[campo.control] = ""; // cada input empieza vacío
        });

        this.responseData.update(data => [...data, nuevaFila]);
    }
    evnviarDatos() {

    }


}
