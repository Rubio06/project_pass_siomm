import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, MaeSemanaCiclo, TABLA_DATOS_SEMANAS_CICLO } from 'src/app/planing/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/planing/services/planning.service';

@Component({
    selector: 'app-semanas-ciclo-main',
    imports: [ReactiveFormsModule],
    templateUrl: './semanas-ciclo-main.component.html',
    styleUrl: './semanas-ciclo-main.component.css',
})
export class SemanasCicloMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_CICLO);


    form!: FormGroup;
    private shared = inject(PlanningService);

    constructor() {
        const response = this.shared.data();

        const datos: MaeSemanaCiclo[] = response?.data?.semana_ciclo || [];

        console.log(datos);
        const rows = datos.map((item: any) => {
            const group: { [key: string]: FormControl } = {};
            this.columnas().forEach(col => {
                const valor = item[col.control];

                group[col.control] = new FormControl(
                    this.shared.esISO(valor)
                        ? this.shared.formatearISOaDDMMYYYY(valor)
                        : valor
                );
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

}

