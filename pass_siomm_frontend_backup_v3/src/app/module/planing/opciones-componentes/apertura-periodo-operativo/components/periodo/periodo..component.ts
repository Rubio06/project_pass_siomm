import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';


interface fieldName {
    name: string;
    type: string;
    label: string;
    typeControl: string;
    array: string[]
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
    rutas = this.planingService.data;

    bloqueo = inject(PlanningService).bloqueo;

    private hoy = new Date();

    
    private anioActual = String(this.hoy.getFullYear());
    private mesActualIndex = this.hoy.getMonth(); // 0 = Enero
    private mesActualNombre = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ][this.mesActualIndex];


    // Años que realmente soporta tu select
    anios = signal<string[]>([
        '2007', '2008', '2009', '2010', '2011', '2012', '2013',
        '2014', '2015', '2016', '2017', '2018', '2019', '2020',
        '2021', '2022', '2023', '2024', '2025'

    ]);

    meses = signal<string[]>([
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]);

    fieldInputs = signal<fieldName[]>([
        { name: "cie_ano", type: "", label: "Año:", typeControl: 'select', array: this.anios() },
        { name: "cie_per", type: "", label: "Mes:", typeControl: 'select', array: this.meses() },
        { name: "fec_ini", type: "date", label: "Fecha Inicio:", typeControl: 'input', array: [] },
        { name: "fec_fin", type: "date", label: "Fecha Fin:", typeControl: 'input', array: [] },
    ]);

    constructor() {
        this.form = this.fb.group({
            cie_ano: this.anioActual,
            cie_per: this.mesActualNombre,
            fec_ini: '',
            fec_fin: ''
        });

        // 🟢 Carga datos del backend
        effect(() => {
            const response = this.rutas();

            if (response?.data?.cierre_periodo?.length) {
                const periodo = response.data.cierre_periodo[0];

                this.form.patchValue({
                    cie_ano: String(periodo.cie_ano), // <- ⭐ Debe ser string
                    cie_per: this.meses()[parseInt(periodo.cie_per, 10) - 1] || '',
                    fec_ini: this.formatDate(periodo.fec_ini),
                    fec_fin: this.formatDate(periodo.fec_fin)
                });
            }
        });

        // 🟢 Solo resetea si NO hay data
        effect(() => {
            const data = this.planingService.data();

            if (!data || data?.length === 0) {
                this.resetearFormulario();
                return;
            }

            this.form.patchValue(data);
        });

        // 🟢 Control bloqueo formulario
        effect(() => {
            this.bloqueoFormulario();
        });
    }

    bloqueoFormulario() {
        const bloqueado = this.planingService.bloqueoForm();

        if (bloqueado) this.form.disable();
        else this.form.enable();
    }

    resetearFormulario() {
        this.form.reset({
            cie_ano: this.anioActual,
            cie_per: this.mesActualNombre,
            fec_ini: '',
            fec_fin: ''
        });
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().split('T')[0];
    }
}
