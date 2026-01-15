import { Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';
import { PlaningCompartidoService } from '../../services/planing-compartido.service';


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
    planingCompartido = inject(PlaningCompartidoService);

    rutas = this.planingCompartido.dataRoutes;

    // bloqueo = inject(PlaningCompartido).bloqueo;
    semanasAvanceMainService = inject(SemanasAvanceMainService);

    private hoy = new Date();

    fechaFutura = new Date(
        this.hoy.getFullYear(),
        this.hoy.getMonth() + 1
    );



    meses = signal<string[]>([
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]);

    private anio = this.fechaFutura.getFullYear();
    private mesNombre = this.meses()[this.fechaFutura.getMonth()];

    anios = signal<string[]>([]);

    fieldInputs = signal<fieldName[]>([
        { name: "cie_ano", type: "", label: "Año:", typeControl: 'select', array: [] },
        { name: "cie_per", type: "", label: "Mes:", typeControl: 'select', array: this.meses() },
        { name: "fec_ini", type: "date", label: "Fecha Inicio:", typeControl: 'input', array: [] },
        { name: "fec_fin", type: "date", label: "Fecha Fin:", typeControl: 'input', array: [] },
    ]);

    form: FormGroup = this.fb.group({
        cie_ano: ['', [Validators.required]],
        cie_per: [this.mesNombre, [Validators.required]],
        fec_ini: ['', [Validators.required]],
        fec_fin: ['', [Validators.required]]
    },
        {
            validators: this.validarRangoFechas
        });


    validarRangoFechas(form: AbstractControl): ValidationErrors | null {

        const fecIni = form.get('fec_ini')?.value;
        const fecFin = form.get('fec_fin')?.value;

        if (!fecIni || !fecFin) {
            return null; // required ya se encarga
        }

        const ini = new Date(fecIni);
        const fin = new Date(fecFin);

        return fin >= ini ? null : { fechaFinMenor: true };
    }

    constructor() {
        this.getYear();



        effect(() => {
            const response = this.rutas();
            if (response?.data?.cierre_periodo?.length) {
                const periodo = response.data.cierre_periodo[0];

                this.form.patchValue({
                    cie_ano: periodo.cie_ano,  // <- ⭐ Debe ser string
                    cie_per: this.meses()[parseInt(periodo.cie_per, 10) - 1] || '',
                    fec_ini: this.formatDate(periodo.fec_ini),
                    fec_fin: this.formatDate(periodo.fec_fin)
                });
            }
        });

        effect(() => {
            const data = this.planingCompartido.dataRoutes();

            if (!data || data?.length === 0) {
                this.resetearFormulario();
                return;
            }

            this.form.patchValue(data);
        });

        //BOTON EDITAR //
        effect(() => {
            if (!this.form) return;

            if (this.planingCompartido.bloqueoFormGeneral()) {
                this.form.disable({ emitEvent: false });
            } else {
                this.form.enable({ emitEvent: false });

                // 👇 VUELVES A BLOQUEAR SOLO LOS CAMPOS PROHIBIDOS EN EDITAR
                if (this.planingCompartido.modoEditar()) {
                    this.bloquearCamposEditar();
                }
            }
        });


        //EFECTO PARA RESETEAR LOS FORMULARIOS
        effect(() => {

            if (!this.planingCompartido.resetSemanas()) {
                // this.semanas.clear();
                this.resetearFormulario();

                return;
            }

        });
    }


    blockForm() {
        this.form.disable();
    }


    readonly camposBloqueadosEnEditar = ['cie_ano', 'cie_per'];

    private bloquearCamposEditar() {
        this.camposBloqueadosEnEditar.forEach(campo => {
            const control = this.form.get(campo);
            if (control && control.enabled) {
                control.disable({ emitEvent: false });
            }
        });
    }


    public getYear() {
        this.planingService.getYear().subscribe({
            next: (data: string[]) => {

                // convertir a número
                const years = data.map(Number);

                // último año REAL en BD
                const lastYear = Math.max(...years);

                // siguiente año lógico
                const nextYear = (lastYear + 1).toString();

                // lista final (sin duplicados)
                const result = Array.from(
                    new Set([...years.map(String), nextYear])
                ).sort((a, b) => Number(b) - Number(a));

                // actualizar select
                this.fieldInputs.update(fields =>
                    fields.map(f =>
                        f.name === 'cie_ano'
                            ? { ...f, array: result }
                            : f
                    )
                );

                // seleccionar por defecto el siguiente año
                this.form.get('cie_ano')?.setValue(nextYear);
            },
            error: (err) => console.error(err)
        });
    }


    // bloqueoFormulario() {
    //     const bloqueado = this.planingCompartido.bloqueoForm();

    //     if (bloqueado) this.form.disable();
    //     else this.form.enable();
    // }

    resetearFormulario() {
        this.form.reset({
            cie_ano: this.anio,
            cie_per: this.mesNombre,
            fec_ini: '',
            fec_fin: ''
        });
    }

    ngOnInit() {

        // this.form.statusChanges.subscribe(status => {
        //     this.planingCompartido.setPeriodoValido(status === 'VALID');
        // });

        this.form.valueChanges.subscribe(val => {

            const filas = this.form.getRawValue();

            this.planingCompartido.setCierrePeriodo(filas, 'factor_operativo');
        });
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().split('T')[0];
    }
}
