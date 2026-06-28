import { ChangeDetectorRef, Component, effect, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DATOS_METODO_EXPLORACION, EstructuraDatosOtros, MaeExploEstandar, SelectZona, TH_ESTANDAR_EXPLORACION, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-estandar-exploracion-main',
    imports: [ReactiveFormsModule],
    templateUrl: './estandar-exploracion-main.component.html',
    styleUrl: './estandar-exploracion-main.component.css',
})
export class EstandarExploracionMainComponent implements OnInit {

    // ===============================
    //   IMPORTS / INJECTIONS
    // ===============================
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);
    planingCompartido = inject(PlaningCompartidoService);
    semanasAvanceMainService = inject(SemanasAvanceMainService);
    private cd = inject(ChangeDetectorRef);
    
    formUtils = FormUtils;
    private utils = FormUtils;

    // ===============================
    //   CONFIGURACIÓN DE TABLA
    // ===============================
    columnas = signal<any[]>(TH_ESTANDAR_EXPLORACION);
    titulo = this.columnas().map(t => t.titulo);
    datosColumna = signal<EstructuraDatosOtros[]>(DATOS_METODO_EXPLORACION);

    cod_zona = signal<SelectZona[]>([]);
    cod_metexp = signal<any[]>([]);
    cod_zonaBloqueo = signal<string[]>([]);
    bloqueoBotonNuevo = signal<boolean>(true);

    // ===============================
    //   FORMULARIO PRINCIPAL
    // ===============================
    myForm = this.fb.group({
        semanas: this.fb.array<FormGroup>([]),
    });

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    // ===============================
    //   SIGNALS DE ESTADO
    // ===============================
    loading = signal(false);
    message = signal<string>('');
    estaBloqueado = signal<boolean>(false);

    // ===============================
    //   CONSTRUCTOR
    // ===============================
    constructor() {
        effect(() => {
            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.exploracion_extandar || [];
            this.loadSemanas(semanas);
        });
        
        this.loadZonas();
    }

    trackByIndex(index: number) {
        return index;
    }

    /**
     * Carga data desde backend
     */
    loadSemanas(data: MaeExploEstandar[]) {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        const formArray = this.fb.array(
            data.map(item =>
                this.fb.group({
                    cie_ano: [periodo?.anio],
                    cie_per: [periodo?.mes],
                    cod_zona: [{ value: item.cod_zona, disabled: true }],
                    lab_pieper: [item.lab_pieper, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_broca: [item.lab_broca, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_barcon: [item.lab_barcon, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_barren: [item.lab_barren, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_facpot: [item.lab_facpot, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_fulmin: [item.lab_fulmin, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_conect: [item.lab_conect, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_punmar: [item.lab_punmar, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_tabla: [item.lab_tabla, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    lab_apr: [item.lab_apr, [Validators.pattern(/^[A-Z0-9]$/)]],
                    accion: [''],
                    esNuevo: [false]
                })
            )
        );

        this.myForm.setControl('semanas', formArray);
    }

    /**
     * Agrega una fila nueva editable al FormArray
     */
    agregarFilas() {
        this.planingCompartido.setBotonesState({
            ...this.planingCompartido.botonesState(),
            editar: true
        });

        this.bloqueoSelect();
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        const nuevoGrupo = this.fb.group({
            cie_ano: [periodo?.anio],
            cie_per: [periodo?.mes],
            cod_zona: ['', [Validators.required]],
            lab_pieper: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_broca: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_barcon: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_barren: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_facpot: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_fulmin: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_conect: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_punmar: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_tabla: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            lab_apr: ['', [Validators.pattern(/^[A-Z0-9]$/)]],
            esNuevo: [true]
        });

        this.semanas.push(nuevoGrupo);
    }

    valoresSeleccionados(excluirItem: AbstractControl): string[] {
        return this.semanas.controls
            .filter(ctrl => ctrl !== excluirItem)
            .map(ctrl => ctrl.get('cod_zona')?.value)
            .filter(val => !!val);
    }

    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar() && !row.get('esNuevo')?.value;
    }

    ngOnInit() {
        this.planingCompartido.setLastTab('exploracion_estandar');
        this.planingCompartido.registrarFormulario('exploracion_estandar', this.myForm);

        this.myForm.valueChanges.subscribe(() => {
            const filas = this.semanas.getRawValue().map((fila: any) => {
                const filaProcesada: any = {};

                Object.keys(fila).forEach(key => {
                    filaProcesada[key] = fila[key] === null || fila[key] === undefined || fila[key] === ''
                        ? '00.00'
                        : fila[key];
                });

                return filaProcesada;
            });

            this.planingCompartido.setExploracionExtandar(filas, 'exploracion_estandar');
        });
    }

    /**
     * Elimina una fila del FormArray (local o remota)
     */
    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            return;
        }

        const payload = {
            cod_zona: semana.cod_zona,
            cie_ano: periodo?.anio,
            cie_per: periodo?.mes,
        };

        const confirmado = await this.utils.confirmarEliminacion();
        if (!confirmado) {
            this.utils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.estandarExploracion(payload).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.utils.alertaEliminado(res.message);
                    this.semanas.removeAt(index);
                    this.refrescarDatos();
                } else {
                    this.utils.alertaEliminado(res.message);
                    this.refrescarDatos();
                }
            },
            error: (err) => this.utils.mensajeError(err.message)
        });
    }

    private refrescarDatos() {
        this.planingCompartido.setFormFactorBloqueado(true);
        this.planingCompartido.setTablaBloqueada(true);
        this.planingCompartido.ejecutarVisualizar();
    }

    /**
     * Carga las zonas desde el servicio (Lookups)
     */
    private loadZonas() {
        this.planingService.SelectZona().subscribe({
            next: (data: any) => this.cod_zona.set(data),
            error: (err) => console.error('Error al cargar zonas:', err),
        });
    }

    private bloqueoSelect() {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }
        
        this.planingService.bloqueoSelect(periodo?.anio, periodo?.mes, 'bloqueo-estandar-exploracion').subscribe({
            next: (data: any) => this.cod_zonaBloqueo.set(data),
            error: (err) => console.error('Error al cargar tipos de labor:', err),
        });
    }
}