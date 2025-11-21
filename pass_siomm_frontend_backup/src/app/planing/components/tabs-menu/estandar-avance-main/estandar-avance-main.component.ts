import { Component, signal, input, effect, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColumnaTabla, TABLA_DATOS_ESTANDAR_AVANCE } from 'src/app/planing/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/planing/services/planning.service';

@Component({
    selector: 'app-estandar-avance',
    imports: [ReactiveFormsModule],
    templateUrl: './estandar-avance-main.component.html',
    styleUrl: './estandar-avance-main.component.css',
})
export class EstandarAvanceComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_ESTANDAR_AVANCE);
    form!: FormGroup;

    constructor() {
        this.form = new FormGroup({});
        // si quieres generar dinámicamente los controles desde columnas:
        this.columnas().forEach(col => {
            this.form.addControl(col.control, new FormControl(''));
        });
    }
}
