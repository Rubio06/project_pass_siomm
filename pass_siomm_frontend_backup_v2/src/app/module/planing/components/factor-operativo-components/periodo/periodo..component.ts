import { PlanningService } from '../../../services/planning.service';
import { Component, computed, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface fieldName {
    name: string;
    type: string;
    label: string;
}

@Component({
    selector: 'app-periodo',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './periodo.component.html',
    styleUrl: './periodo.component.css',
})
export class AperPerOperComponent {
    private planingService = inject(PlanningService);
    private fb = inject(FormBuilder);

    form: FormGroup;
    rutas = this.planingService.dataRoutes;



    fieldInputs = signal<fieldName[]>([
        { name: "cie_ano", type: "text", label: "Año:" },
        { name: "cie_per", type: "text", label: "Mes:" },
        { name: "fec_ini", type: "date", label: "Fecha Inicio:" },
        { name: "fec_fin", type: "date", label: "Fecha Fin:" },

    ]);


    constructor() {
        this.form = this.fb.group({
            cie_ano: [''],
            cie_per: [''],
            fec_ini: [''],
            fec_fin: ['']
        });

        effect(() => {
            const response = this.rutas();
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];

            if (response?.data?.cierre_periodo?.length) {
                const periodo = response.data.cierre_periodo[0];

                this.form.patchValue({
                    cie_ano: periodo.cie_ano,
                    cie_per: meses[parseInt(periodo.cie_per, 10) - 1] || '',  // convierte "01" → "Enero"
                    fec_ini: this.formatDate(periodo.fec_ini),
                    fec_fin: this.formatDate(periodo.fec_fin)
                });
            }
        });
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().split('T')[0];
    }
}
