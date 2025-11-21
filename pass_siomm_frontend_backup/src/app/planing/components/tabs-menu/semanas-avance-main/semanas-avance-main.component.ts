import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, MaeSemanaAvance, TABLA_DATOS_SEMANAS_AVANCES } from 'src/app/planing/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/planing/services/planning.service';

@Component({
    selector: 'app-semanas-avance-main',
    imports: [ReactiveFormsModule],
    templateUrl: './semanas-avance-main.component.html',
    styleUrl: './semanas-avance-main.component.css',
})
export class SemanasAvanceMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_AVANCES);

    form!: FormGroup;
    private shared = inject(PlanningService);

    constructor() {
        const response = this.shared.data();

        const datos: MaeSemanaAvance[] = response?.data?.semana_avance || [];

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

    esISO(valor: string): boolean {
        return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(valor);
    }


}
