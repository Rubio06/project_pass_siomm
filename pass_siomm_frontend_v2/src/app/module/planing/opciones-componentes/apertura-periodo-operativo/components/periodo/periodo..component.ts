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
        this.hoy.getFullYear() + 1,
        this.hoy.getMonth() + 1
    );



    meses = signal<string[]>([
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]);

    private anio = this.fechaFutura.getFullYear().toString();
    private mesNombre = this.meses()[this.fechaFutura.getMonth()];


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

    // anios = signal<string[]>([]);

    fieldInputs = signal<fieldName[]>([
        { name: "cie_ano", type: "", label: "Año:", typeControl: 'select', array: [] },
        { name: "cie_per", type: "", label: "Mes:", typeControl: 'select', array: this.meses() },
        { name: "fec_ini", type: "date", label: "Fecha Inicio:", typeControl: 'input', array: [] },
        { name: "fec_fin", type: "date", label: "Fecha Fin:", typeControl: 'input', array: [] },
    ]);




    form: FormGroup = this.fb.group({
        cie_ano: [this.anio, [Validators.required]],
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
                // this.resetearFormulario();
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

                this.fieldInputs.update(fields =>
                    fields.map(f =>
                        f.name === 'cie_ano'
                            ? { ...f, array: data }
                            : f
                    )
                );
                const controlAnio = this.form.get('cie_ano')?.value;

                this.cargarMeses(controlAnio);

                // this.initAndListenYear();
                // this.form.statusChanges.subscribe(status => {
                //     this.planingCompartido.setPeriodoValido(status === 'VALID');
                // });

            },
            error: (err) => console.error(err)
        });
    }

    private initAndListenYear(): void {
        const controlAnio = this.form.get('cie_ano');
        if (!controlAnio) return;

        // 1️⃣ inicialización (obligatoria)
        if (controlAnio.value) {
            this.cargarMeses(String(controlAnio.value));
        }

        // 2️⃣ reacción al cambio (obligatoria)
        controlAnio.valueChanges.subscribe(year => {
            if (!year) return;

            this.mesesBloqueados = [];
            this.cargarMeses(String(year));
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

    private cargarMeses(year: string): void {
        this.planingService.getMonths(year).subscribe({
            next: (months) => {
                // this.listenYearValueChanges();

                this.mesesBloqueados = months ?? [];
            },
            error: () => {
                this.mesesBloqueados = [];
            }
        });
    }

    private initPeriodo(): void {
        const anio = this.form.get('cie_ano')?.value;

        if (anio) {
            this.mesesBloqueados = [];
            this.cargarMeses(String(anio));
        }
    }


    ngOnInit() {
        // cuando el form ya existe
        this.initPeriodo();
        this.initAndListenYear();        // const year = this.form.get('cie_ano')?.value;
        // if (year) {
        //     this.cargarMeses(year);
        // }

        // cargar por defecto (2027)
        this.form.valueChanges.subscribe(val => {

            const filas = this.form.getRawValue();

            console.log("los datos que estoy enviando son " + JSON.stringify(filas));

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
