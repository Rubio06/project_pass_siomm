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
        fec_fin: ['', [Validators.required]],
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
                    fec_fin: this.formatDate(periodo.fec_fin),
                });

                this.planingCompartido.setFechas({
                    cie_ano: periodo.cie_ano,  // <- ⭐ Debe ser string
                    cie_per: periodo.cie_per,
                    fec_ini: this.formatDate(periodo.fec_ini),
                    fec_fin: this.formatDate(periodo.fec_fin)
                });
            }
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
            if (!this.planingCompartido.resetSemanas()) return;
            this.resetearFormulario();

            this.prepararFormularioNuevo();

            // 🔥 recargar meses del año actual
            this.cargarMeses(this.anio);
        });


        effect(() => {
            const year = this.planingCompartido.anioSeleccionado();
            console.log(year);
            if (year) {
                this.form.get('cie_ano')?.setValue(year, { emitEvent: false });
            }
        });

        effect(() => {
            const month = this.planingCompartido.mesSeleccionado();
            if (month) {
                this.form.get('cie_per')?.setValue(month, { emitEvent: false });
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


    public getYear(): void {
        this.planingService.getYear().subscribe({
            next: (data: string[]) => {

                // ✅ 1️⃣ Asegurar que el año por defecto exista
                const anios = data.includes(this.anio)
                    ? data
                    : [this.anio, ...data];

                // ✅ 2️⃣ Cargar opciones del select
                this.fieldInputs.update(fields =>
                    fields.map(f =>
                        f.name === 'cie_ano'
                            ? { ...f, array: anios }
                            : f
                    )
                );

                // ✅ 3️⃣ Setear año por defecto DESPUÉS del render
                queueMicrotask(() => {
                    this.form.get('cie_ano')?.setValue(this.anio, {
                        emitEvent: false
                    });

                    // 🔥 cargar meses del año seleccionado
                    this.cargarMeses(this.anio);
                });

                // ✅ 4️⃣ Escuchar cambios SOLO una vez
                this.initAndListenYear();
            },
            error: err => console.error(err)
        });
    }


    private initAndListenYear(): void {
        const controlAnio = this.form.get('cie_ano');
        if (!controlAnio) return;

        // 🔥 inicialización
        if (controlAnio.value) {
            this.cargarMeses(String(controlAnio.value));
        }

        // 🔥 reacción a cambios
        controlAnio.valueChanges.subscribe(year => {
            if (!year) return;
            this.cargarMeses(String(year));
        });
    }


    private resetearFormulario(): void {
        this.form.reset({
            cie_ano: this.anio,
            cie_per: null,
            fec_ini: '',
            fec_fin: '',
        });
    }


    private cargarMeses(year: string, desdeNuevo = false): void {
        this.planingService.getMonths(year).subscribe({
            next: (months) => {
                this.mesesBloqueados = months ?? [];
                if (desdeNuevo) {
                    this.seleccionarMesDisponible();
                }
            },
            error: () => {
                this.mesesBloqueados = [];
            }
        });
    }

    private prepararFormularioNuevo(): void {
        // 1️⃣ Reset
        this.resetearFormulario();

        // 2️⃣ Setear año por defecto (2027)
        this.form.get('cie_ano')?.setValue(this.anio);

        // 3️⃣ Cargar meses del año
        this.cargarMeses(this.anio, true);
    }

    // public seleccionarMesDisponible(): void {
    //     const controlMes = this.form.get('cie_per');
    //     if (!controlMes) return;

    //     const meses = Object.keys(this.mapMeses);

    //     for (const mes of meses) {
    //         if (!this.mesesBloqueados.includes(this.mapMeses[mes])) {
    //             controlMes.setValue(mes);
    //             return;
    //         }
    //     }
    // }


    public seleccionarMesDisponible(): void {
        const controlMes = this.form.get('cie_per');
        if (!controlMes) return;

        const meses = Object.keys(this.mapMeses);
        const indiceInicial = meses.indexOf(this.mesNombre);

        // Si no existe el mes, empezar desde 0
        const inicio = indiceInicial >= 0 ? indiceInicial : 0;

        // ✅ validación única solicitada
        const mesesDisponibles = meses.filter(
            mes => !this.mesesBloqueados.includes(this.mapMeses[mes])
        );

        if (mesesDisponibles.length === 1) {
            controlMes.setValue(mesesDisponibles[0]);
            return;
        }

        for (let i = inicio; i < meses.length; i++) {
            const mes = meses[i];

            if (!this.mesesBloqueados.includes(this.mapMeses[mes])) {
                controlMes.setValue(mes);
                return;
            }
        }
        // 🚨 si todos están bloqueados
        // controlMes.setValue(null);
    }

    ngOnInit(): void {
        this.form.valueChanges.subscribe(() => {

            if (this.form.invalid) return;

            const payload = this.form.getRawValue();

            console.log(payload);

            this.planingCompartido.setCierrePeriodo(
                payload,
                'factor_operativo'
            );
        });
    }

    private formatDate(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().split('T')[0];
    }
}
