import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
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

    semanasAvanceMainService = inject(SemanasAvanceMainService);

    private hoy = new Date();

    fechaFutura = new Date(
        this.hoy.getFullYear() + 1,
        this.hoy.getMonth() + 1
    );



    meses = signal<string[]>([
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]);

    private anio = this.fechaFutura.getFullYear().toString();


    mesesBloqueados: string[] = []; // estos vienen de tu BD

    mapMeses: Record<string, string> = {
        "Enero": "01",
        "Febrero": "02",
        "Marzo": "03",
        "Abril": "04",
        "Mayo": "05",
        "Junio": "06",
        "Julio": "07",
        "Agosto": "08",
        "Septiembre": "09",
        "Octubre": "10",
        "Noviembre": "11",
        "Diciembre": "12"
    };

    form!: FormGroup

    fieldInputs = signal<fieldName[]>([
        { name: "cie_ano", type: "", label: "Año:", typeControl: 'select', array: [] },
        { name: "cie_per", type: "", label: "Mes:", typeControl: 'select', array: this.meses() },
        { name: "fec_ini", type: "date", label: "Fecha Inicio:", typeControl: 'input', array: [] },
        { name: "fec_fin", type: "date", label: "Fecha Fin:", typeControl: 'input', array: [] },
    ]);

    readonly camposBloqueadosEnEditar = ['cie_ano', 'cie_per'];
    arregloMeses = signal<string[]>([]);


    constructor() {
        this.getYear();

        const { anio, mesNombre } = this.obtenerPeriodoInicial();

        this.form = this.fb.group(
            {
                cie_ano: [anio, Validators.required],
                cie_per: [mesNombre, Validators.required],
                fec_ini: ['', Validators.required],
                fec_fin: ['', Validators.required],
            },
            {
                validators: this.validarRangoFechas,
            }
        );


        effect(() => {
            const periodo = this.rutas()?.data?.cierre_periodo?.[0] ?? null;

            if (!periodo) return;


            // ✅ setear cuando sí hay data
            this.form.patchValue({
                cie_ano: periodo?.cie_ano,
                cie_per: this.meses()[parseInt(periodo?.cie_per, 10) - 1] || '',
                fec_ini: this.formatDate(periodo?.fec_ini),
                fec_fin: this.formatDate(periodo?.fec_fin),
            });

            this.planingCompartido.setFechas({
                cie_ano: periodo?.cie_ano,
                cie_per: periodo?.cie_per,
                fec_ini: this.formatDate(periodo?.fec_ini),
                fec_fin: this.formatDate(periodo?.fec_fin),
            });
        })

        ///PARA BLOQUEAR AÑO Y MES EN MODO EDICION
        effect(() => {
            if (this.planingCompartido.modoEditar()) {
                this.bloquearCamposEditar();
            } else {
                this.desbloquearCamposEditar();
            }
        });

        /// PARA RESETEAR EL CIERRE CIERRE PERIODO
        effect(() => {
            if (!this.planingCompartido.resetPeriodo()) return;

            const { anio, mesNombre } = this.obtenerPeriodoInicial();

            this.form.reset({
                cie_ano: anio.toString(),
                cie_per: mesNombre,
                fec_ini: '',
                fec_fin: '',
            });

            this.cargarMeses(anio.toString());

            this.form.get('cie_ano')?.valueChanges.subscribe((year) => {
                this.cargarMeses(year);
            });

            // this.planingCompartido.clearResetPeriodo();
        });
    }


    private obtenerPeriodoInicial() {
        const hoy = new Date();

        let anio = hoy.getFullYear() + 1; // 🔥 año actual + 1
        let mesIndex = hoy.getMonth() + 1;

        if (mesIndex > 11) {
            mesIndex = 0;
        }

        const meses = this.meses();

        return {
            anio,
            mesNombre: meses[mesIndex],
        };
    }

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


    private bloquearCamposEditar() {
        this.camposBloqueadosEnEditar.forEach(campo => {
            const control = this.form.get(campo);
            if (control && control.enabled) {
                control.disable({ emitEvent: false });
            }
        });
    }

    private desbloquearCamposEditar() {
        this.camposBloqueadosEnEditar.forEach(campo => {
            const control = this.form.get(campo);
            if (control && control.disabled) {
                control.enable({ emitEvent: false });
            }
        });
    }

    private cargarMeses(year: string): void {
        this.planingService.getMonths(year).subscribe({
            next: months => {
                // this.planingCompartido.setMesesBloqueados(months);

                this.arregloMeses.set(months)
                console.log(months)
            },
            error: (error) => console.log(error)
        });
    }


    public getYear(): void {
        this.planingService.getYear().subscribe({
            next: (data: string[]) => {

                const anios = data.includes(this.anio)
                    ? data
                    : [this.anio, ...data];

                this.fieldInputs.update(fields =>
                    fields.map(f =>
                        f.name === 'cie_ano'
                            ? { ...f, array: anios }
                            : f
                    )
                );
            },
            error: err => console.error(err)
        });
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().split('T')[0];
    }


    ngOnInit() {

        // 1️⃣ marcar el tab como activo (UNA VEZ)
        this.planingCompartido.setLastTab('factor_operativo');

        // 2️⃣ registrar el formulario (UNA VEZ)
        this.planingCompartido.registrarFormulario(
            'factor_operativo',
            this.form
        );

        // 3️⃣ (opcional) solo para guardar data
        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) {
                this.planingCompartido.setCierrePeriodo(
                    this.form.getRawValue(), 'factor_operativo'
                );
            }
        });
    }
}
