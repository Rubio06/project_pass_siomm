import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, MaeTipLabEstandar, TABLA_DATOS_ESTANDAR_EXPLORACION } from 'src/app/planing/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/planing/services/planning.service';

@Component({
    selector: 'app-estandar-exploracion-main',
    imports: [ReactiveFormsModule],
    templateUrl: './estandar-exploracion-main.component.html',
    styleUrl: './estandar-exploracion-main.component.css',
})
export class EstandarExploracionMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_ESTANDAR_EXPLORACION);
    form!: FormGroup;

    private shared = inject(PlanningService);

    constructor() {
        const response = this.shared.data();

        const datos: MaeTipLabEstandar[] = response?.data?.laboratorio_estandar || [];


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
}


