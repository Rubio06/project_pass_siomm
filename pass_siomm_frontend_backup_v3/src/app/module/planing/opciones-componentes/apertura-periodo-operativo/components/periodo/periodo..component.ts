import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';
import { PlaningCompartido } from '../../services/planing-compartido.service';


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
    formUtils = FormUtils;

    rutas = this.planingService.dataRoutes;

    bloqueo = inject(PlanningService).bloqueo;

    // private hoy = new Date();

    semanasAvanceMainService = inject(SemanasAvanceMainService);

    private hoy = new Date();

    // Crear una nueva fecha sumándole 1 año y 1 mes
    fechaFutura = new Date(
        this.hoy.getFullYear(),
        this.hoy.getMonth() + 1
    );


    planingCompartido = inject(PlaningCompartido);



    meses = signal<string[]>([
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]);

    private anio = this.fechaFutura.getFullYear();
    private mesNombre = this.meses()[this.fechaFutura.getMonth()];

    // Años que realmente soporta tu select
    anios = signal<string[]>([

        '2014', '2015', '2016', '2017', '2018', '2019', '2020',
        '2021', '2022', '2023', '2024', '2025', '2026'

    ]);


    fieldInputs = signal<fieldName[]>([
        { name: "cie_ano", type: "", label: "Año:", typeControl: 'select', array: this.anios() },
        { name: "cie_per", type: "", label: "Mes:", typeControl: 'select', array: this.meses() },
        { name: "fec_ini", type: "date", label: "Fecha Inicio:", typeControl: 'input', array: [] },
        { name: "fec_fin", type: "date", label: "Fecha Fin:", typeControl: 'input', array: [] },
    ]);

    form: FormGroup = this.fb.group({
        cie_ano: '',
        cie_per: '',
        fec_ini: '',
        fec_fin: ''
    });

    constructor() {

        console.log(this.anio, this.mesNombre)

        // 🟢 Carga datos del backend
        effect(() => {
            const response = this.rutas();
            if (response?.data?.cierre_periodo?.length) {
                const periodo = response.data.cierre_periodo[0];

                this.form.patchValue({
                    cie_ano: periodo.cie_ano, // <- ⭐ Debe ser string
                    cie_per: this.meses()[parseInt(periodo.cie_per, 10) - 1] || '',
                    fec_ini: this.formatDate(periodo.fec_ini),
                    fec_fin: this.formatDate(periodo.fec_fin)
                });
            }
        });

        // 🟢 Solo resetea si NO hay data
        effect(() => {
            const data = this.planingService.dataRoutes();

            // console.log("di click")
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

        effect(() => {


            const bloqueado = this.planingCompartido.getBloqueoFormEditar()();

            bloqueado
                ? this.form.disable({ emitEvent: false })
                : this.form.enable({ emitEvent: false });

            this.form.get('cie_ano')?.disable();
            this.form.get('cie_per')?.disable();
        });


    }

    bloqueoFormulario() {
        const bloqueado = this.planingService.bloqueoForm();

        if (bloqueado) this.form.disable();
        else this.form.enable();

        // ❗ Campos que siempre deben quedar bloqueados
    }

    //     cie_ano: this.anioActual,
    // cie_per: this.mesActualNombre,

    resetearFormulario() {
        this.form.reset({
            cie_ano: this.anio,
            cie_per: this.mesNombre,
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
