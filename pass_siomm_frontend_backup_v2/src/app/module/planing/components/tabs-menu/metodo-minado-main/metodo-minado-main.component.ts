import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, SelectExploracion, TABLA_DATOS_METODO_MINADO } from '../../../interface/aper-per-oper.interface';
import { PlanningService } from '../../../services/planning.service';

@Component({
    selector: 'app-metodo-minado-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './metodo-minado-main.component.html',
    styleUrl: './metodo-minado-main.component.css',
})
export class MetodoMinadoMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_METODO_MINADO);
    titulo = this.columnas().map(titulo => titulo.titulo);

    private planingService = inject(PlanningService);

    rutas = this.planingService.dataRoutes;
    responseData = signal<any[]>([]);

    cod_metexp = signal<SelectExploracion[]>([])



    ind_calculo_dilucion = signal<any[]>([
        { value: 1, label: 'Contrato' },
        { value: 2, label: 'O´hara' }
    ])


    ind_calculo_leyes_min = signal<any[]>([
        { value: 2, label: 'Contrato' },
        { value: 1, label: 'O´hara' }
    ])

    ind_act = signal<any[]>([
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' }
    ])


    constructor() {

        effect(() => {
            const data = this.rutas()?.data?.metodo_minado;

            if (data) {
                const dataConValores = data.map((fila: any) => ({
                    metodoSeleccionado: fila.cod_metexp,
                    metodo: fila.nom_metexp
                }));

                this.responseData.set(dataConValores);
            }
        })

        this.SelectExploracion()
    }


    onMetodoSeleccionado(nuevoValor: number) {
        console.log(`Nuevo valor seleccionado: ${nuevoValor}`);
    }

    onMetodoDilucion(nuevoValor: number) {
        console.log(`Nuevo valor seleccionado: ${nuevoValor}`);
    }

    onMetodoLeyesMin(nuevoValor: number) {
        console.log(`Nuevo valor seleccionado: ${nuevoValor}`);
    }

    onMetodoIndActi(nuevoValor: number) {
        console.log(`Nuevo valor seleccionado: ${nuevoValor}`);
    }


    public SelectExploracion() {
        this.planingService.SelectExploracion().subscribe({
            next: (data: any) => {
                this.cod_metexp.set(data);
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
            }
        })
    }
}
