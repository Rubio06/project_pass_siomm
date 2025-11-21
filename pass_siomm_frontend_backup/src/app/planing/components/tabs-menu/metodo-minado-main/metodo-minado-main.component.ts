import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, MaePerMetExplotacion, TABLA_DATOS_METODO_MINADO } from 'src/app/planing/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/planing/services/planning.service';

@Component({
    selector: 'app-metodo-minado-main',
    imports: [ReactiveFormsModule],
    templateUrl: './metodo-minado-main.component.html',
    styleUrl: './metodo-minado-main.component.css',
})
export class MetodoMinadoMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_METODO_MINADO);
    form!: FormGroup;

    listasSelect: Record<string, any[]> = {
        metodoMinado: [
            { value: 1, label: 'Tajo Abierto' },
            { value: 2, label: 'Subterráneo' },
            { value: 3, label: 'Block Caving' },
            { value: 4, label: 'Método Shrinkage' },
            { value: 5, label: 'Corte y Relleno' }
        ],

        tipoCalculo: [
            { value: 1, label: 'O´hara' },
            { value: 2, label: 'Contrato' }
        ],

        TCalculoDilucionLeyes: [
            { value: 1, label: 'O´hara' },
            { value: 2, label: 'Contrato' }
        ],

        IndAct: [
            { value: 1, label: 'Si' },
            { value: 2, label: 'No' }
        ]
    };

    private shared = inject(PlanningService);

    constructor() {
        const response = this.shared.data();

        const datos: MaePerMetExplotacion[] = response?.data?.metodo_minado || [];

        console.log(datos)

        const rows = datos.map((item: any) => {
            const group: { [key: string]: FormControl } = {};
            this.columnas().forEach(col => {
                group[col.control] = new FormControl(item[col.control] ?? '');
            });
            return new FormGroup(group);
        });

        this.form = new FormGroup({
            rows: new FormArray(rows)
        });
    }

    get rows(): FormGroup[] {
        return (this.form.get('rows') as FormArray).controls as FormGroup[];
    }

    obtenerOpciones(campo: string) {
        return this.listasSelect[campo] ?? [];
    }

}
