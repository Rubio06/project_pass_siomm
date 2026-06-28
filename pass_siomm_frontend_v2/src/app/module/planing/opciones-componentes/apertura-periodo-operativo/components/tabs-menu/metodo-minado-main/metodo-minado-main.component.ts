import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DATOS_METODO_MINADO, MaePerMetExplotacion, SelectExploracion, TH_METODOLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-metodo-minado-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './metodo-minado-main.component.html',
    styleUrl: './metodo-minado-main.component.css',
})
export class MetodoMinadoMainComponent implements OnInit {

    columnas = signal<thTitulos[]>(TH_METODOLO_MINADO);
    titulo = this.columnas().map(t => t.titulo);
    datosColumna = signal<any[]>(DATOS_METODO_MINADO);

    planingCompartido = inject(PlaningCompartidoService);
    semanasAvanceMainService = inject(SemanasAvanceMainService);
    planingService = inject(PlanningService);
    fb = inject(FormBuilder);
    private cd = inject(ChangeDetectorRef);
    
    formUtils = FormUtils;
    private utils = FormUtils;

    // ========================================
    //   FORMULARIO PRINCIPAL
    // ========================================
    myForm = this.fb.group({
        semanas: this.fb.array<FormGroup>([]),
    });

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    // ========================================
    //   SIGNALS
    // ========================================
    loading = signal(false);
    message = signal<string>('');
    modoVisualizar = signal<boolean>(false);
    cod_metexp = signal<SelectExploracion[]>([]);
    cod_metexpBloqueo = signal<string[]>([]);

    ind_calculo_dilucion = signal<any[]>([
        { value: 'C', label: 'Contrato' },
        { value: 'O', label: "'O'Hara'" }
    ]);

    ind_calculo_leyes_min = signal<any[]>([
        { value: 'C', label: 'Contrato' },
        { value: 'O', label: "'O'Hara'" }
    ]);

    ind_act = signal<any[]>([
        { value: 'S', label: 'Sí' },
        { value: 'N', label: 'No' }
    ]);

    constructor() {
        effect(() => {
            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.metodo_minado || [];
            this.loadSemanas(semanas);
        });

        this.loadSelectExploracion();
    }

    trackByIndex(index: number) {
        return index;
    }

    // =====================================================
    //   CARGAR DATOS DESDE BACKEND
    // =====================================================
    loadSemanas(data: MaePerMetExplotacion[]) {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        const formArray = this.fb.array(
            data.map(item =>
                this.fb.group({
                    cie_ano: [periodo?.anio],
                    cie_per: [periodo?.mes],
                    cod_metexp: [{ value: item.cod_metexp, disabled: true }],
                    nom_metexp: [item.nom_metexp, [Validators.pattern(/^\d+(\.\d+)?$/)]],
                    ind_calculo_dilucion: [item.ind_calculo_dilucion || ''],
                    ind_calculo_leyes_min: [item.ind_calculo_leyes_min || ''],
                    ind_act: [item.ind_act || ''],
                    accion: [''],
                    esNuevo: [false]
                })
            )
        );

        this.myForm.setControl('semanas', formArray);
    }

    // =====================================================
    //   AGREGAR FILA NUEVA (EDITABLE)
    // =====================================================
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
            cod_metexp: ['', Validators.required],
            nom_metexp: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
            ind_calculo_dilucion: ['', Validators.required],
            ind_calculo_leyes_min: ['', Validators.required],
            ind_act: ['', Validators.required],
            esNuevo: [true],
        });

        this.semanas.push(nuevoGrupo);
    }

    valoresSeleccionados(excluirItem: AbstractControl): string[] {
        return this.semanas.controls
            .filter(ctrl => ctrl !== excluirItem)
            .map(ctrl => ctrl.get('cod_metexp')?.value)
            .filter(val => !!val);
    }

    // =====================================================
    //   ELIMINAR FILA
    // =====================================================
    async eliminarFila(data: any, index: number) {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        const semana = data.getRawValue ? data.getRawValue() : data.value;
        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            return;
        }

        const payload = {
            cod_metexp: semana.cod_metexp,
            cie_ano: periodo?.anio,
            cie_per: periodo?.mes,
        };

        const confirmado = await this.utils.confirmarEliminacion();
        if (!confirmado) {
            this.utils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.eliminarMetodoMinado(payload).subscribe({
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

    bloquearCampo(row: AbstractControl): boolean {
        return !row.get('esNuevo')?.value;
    }

    // =====================================================
    //   LÓGICA EN EL CICLO DE VIDA
    // =====================================================
    ngOnInit() {
        this.planingCompartido.setLastTab('metodo_minado');
        this.planingCompartido.registrarFormulario('metodo_minado', this.myForm);

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

            this.planingCompartido.setMetodoMinado(filas, 'metodo_minado');
        });
    }

    // =====================================================
    //   LOOKUP SELECT EXPLORACIÓN
    // =====================================================
    loadSelectExploracion() {
        this.planingService.SelectExploracion().subscribe({
            next: (data) => this.cod_metexp.set(data),
            error: (e) => console.error('Error cargando métodos de exploración', e)
        });
    }

    private bloqueoSelect() {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) {
            return;
        }

        this.planingService.bloqueoSelect(periodo?.anio, periodo?.mes, 'bloqueo-metodo-minado').subscribe({
            next: (data: any) => this.cod_metexpBloqueo.set(data),
            error: (err) => console.error('Error al cargar tipos de labor:', err),
        });
    }
}