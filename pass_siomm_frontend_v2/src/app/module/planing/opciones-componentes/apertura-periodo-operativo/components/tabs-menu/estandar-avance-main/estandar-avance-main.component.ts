import { Component, signal, input, effect, inject, WritableSignal, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';
import { DATOS_ESTANDER_AVANCE, MaeTipLabEstandar, SelectTipoLabor, TH_ESTANDAR_AVANCE, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-estandar-avance',
    imports: [ReactiveFormsModule],
    templateUrl: './estandar-avance-main.component.html',
    styleUrl: './estandar-avance-main.component.css',
})
export class EstandarAvanceComponent {

    // ===============================
    //   IMPORTS & DEPENDENCIAS
    // ===============================
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);

    // ===============================
    //   CONFIGURACIÓN DE TABLA
    // ===============================
    columnas = signal<thTitulos[]>(TH_ESTANDAR_AVANCE);
    titulo = this.columnas().map(t => t.titulo);

    private utils = FormUtils;
    semanasAvanceMainService = inject(SemanasAvanceMainService);
    datosColumna = signal<any[]>(DATOS_ESTANDER_AVANCE);

    planingCompartido = inject(PlaningCompartidoService);

    // ===============================
    //   LOOKUPS
    // ===============================
    cod_tiplab = signal<SelectTipoLabor[]>([]);

    cod_tiplabBloqueo = signal<any[]>([]);

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

    private cd = inject(ChangeDetectorRef);

    formUtils = FormUtils;
    // ===============================
    //   CONSTRUCTOR
    // ===============================

    bloqueoBotonNuevo = signal<boolean>(true);

    constructor() {
        effect(() => {
            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.laboratorio_estandar || [];

            this.loadSemanas(semanas);
        });

        this.loadTiposLabor();

    }



    trackByIndex(index: number) {
        return index;
    }

    /**
     * Carga data desde backend
     */
    loadSemanas(data: MaeTipLabEstandar[]) {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        const valorDefecto = (val: any) => (val === null || val === '' ? '00.00' : val);

        const formArray = this.fb.array(
            data.map(item =>
                this.fb.group({
                    cie_ano: [periodo?.anio, Validators.required],
                    cie_per: [periodo?.mes, Validators.required],
                    cod_tiplab: [{ value: item.cod_tiplab, disabled: true }],
                    nro_lab_ancho: [item.nro_lab_ancho, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_altura: [item.nro_lab_altura, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_pieper: [item.nro_lab_pieper, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_broca: [item.nro_lab_broca, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_barcon: [item.nro_lab_barcon, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_barren: [item.nro_lab_barren, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_facpot: [item.nro_lab_facpot, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_fulmin: [item.nro_lab_fulmin, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_conect: [item.nro_lab_conect, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_punmar: [item.nro_lab_punmar, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_tabla: [item.nro_lab_tabla, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    accion: [''],
                    esNuevo: [false]
                })
            )
        );
        this.myForm.setControl('semanas', formArray);
    }

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
            cie_ano: [periodo?.anio, Validators.required],
            cie_per: [periodo?.mes, Validators.required],
            cod_tiplab: ['', Validators.required],
            nro_lab_ancho: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_altura: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_pieper: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_broca: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_barcon: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_barren: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_facpot: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_fulmin: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_conect: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_punmar: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_tabla: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            esNuevo: [true]
        });

        this.semanas.push(nuevoGrupo);

    }

    valoresSeleccionados(excluirItem: AbstractControl): string[] {
        return this.semanas.controls
            .filter(ctrl => ctrl !== excluirItem)                   // Excluimos la fila actual
            .map(ctrl => ctrl.get('cod_tiplab')?.value)        // Tomamos el valor
            .filter(val => !!val);                                  // Quitamos nulos/vacíos
    }


    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar() && !row.get('esNuevo')?.value;
    }

    /**
     * Elimina fila específica
     */
    async eliminarFila(data: any, index: number) {

        const semana = data.getRawValue ? data.getRawValue() : data.value;

        const esNuevo = semana.esNuevo;

        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        if (esNuevo) {
            this.semanas.removeAt(index);
            return;
        }

        const payload = {
            cod_tiplab: semana.cod_tiplab,
            cie_ano: periodo?.anio,
            cie_per: periodo?.mes,
        };

        const confirmado = await this.utils.confirmarEliminacion();
        if (!confirmado) {
            this.utils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.estandarAvance(payload).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.utils.alertaEliminado(res.message);
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
        this.planingCompartido.setFormFactorBloqueado(true); // 🔓
        this.planingCompartido.setTablaBloqueada(true);
        this.planingCompartido.ejecutarVisualizar();
    }

    /**
     * Envía datos del formulario
     */

    ngOnInit() {
        this.planingCompartido.setLastTab('estandar_avance');
        this.planingCompartido.registrarFormulario('estandar_avance', this.myForm);

        this.myForm.valueChanges.subscribe(() => {
            // Tomamos los valores actuales
            const filas = this.semanas.getRawValue().map((fila: any) => {
                const filaProcesada: any = {};

                Object.keys(fila).forEach(key => {
                    // Reemplazamos nulos, undefined o strings vacíos por '00.00'
                    filaProcesada[key] = fila[key] === null || fila[key] === undefined || fila[key] === ''
                        ? '00.00'
                        : fila[key];
                });

                return filaProcesada;
            });

            // Enviamos filas ya procesadas
            this.planingCompartido.setLaboratorioEstandar(filas, 'estandar_avance');
        });
    }

    /**
     * Carga Tipos de Labor desde el servicio (Lookups)
     */
    private loadTiposLabor() {
        this.planingService.SelectTipoLabor().subscribe({
            next: (data: any) => this.cod_tiplab.set(data),
            error: (err) => console.error('Error al cargar tipos de labor:', err),
        });
    }

    private bloqueoSelect() {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        this.planingService.bloqueoSelect(periodo?.anio, periodo?.mes, 'bloqueo-estandar-avance').subscribe({
            next: (data: any) => this.cod_tiplabBloqueo.set(data),
            error: (err) => console.error('Error al cargar tipos de labor:', err),
        });
    }

}


