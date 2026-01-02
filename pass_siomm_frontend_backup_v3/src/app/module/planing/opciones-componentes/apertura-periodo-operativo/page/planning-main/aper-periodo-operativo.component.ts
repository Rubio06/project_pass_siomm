import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanDeactivate, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { PlanningData } from '../../interface/aper-per-oper.interface';
import { PlaningCompartidoService } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import Swal from 'sweetalert2';
import { ModalPeriodo } from "./modal-periodo/modal-periodo";
import { CanComponentDeactivate } from 'src/app/core/guards/cambios-guard/cambios-pendientes.guard';


export enum ViewMode {
    VISUALIZAR = 'VISUALIZAR',
    NUEVO = 'NUEVO',
    EDITAR = 'EDITAR'
}

interface BotonesState {
    nuevo: boolean;
    editar: boolean;
    copiarPeriodo: boolean;
    visualizar: boolean;
    guardar: boolean;
}

@Component({
    selector: 'app-planning-main',
    imports: [CommonModule, RouterOutlet, TransfornMonthPipe, RouterLink, ReactiveFormsModule, RouterLinkActive, ModalPeriodo],
    templateUrl: './aper-periodo-operativo.component.html',
    styleUrl: './aper-periodo-operativo.component.css',
})
export class AperturPeriodoComponent implements CanComponentDeactivate {
    /* ============================
     * 🔹 INYECCIONES
     * ============================ */
    private planingService = inject(PlanningService);
    private planingCompartido = inject(PlaningCompartidoService);
    private semanasAvanceService = inject(SemanasAvanceMainService);
    private fb = inject(FormBuilder);


    formsUtils = FormUtils;

    /* ============================
     * 🔹 SIGNALS
     * ============================ */
    hasError = signal<string | null>(null);

    private _years = signal<string[]>([]);
    readonly years = this._years.asReadonly();

    private _months = signal<string[]>([]);
    readonly months = this._months.asReadonly();

    dataAnio = signal('');
    dataMes = signal('');

    /* ============================
     * 🔹 FORMULARIO
     * ============================ */
    showData: FormGroup = this.fb.group({
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
    });

    /* ============================
     * 🔹 ESTADO INTERNO
     * ============================ */
    private prevYear = '';
    private prevMonth = '';

    /* ============================
     * 🔹 CONSTRUCTOR
     * ============================ */
    constructor() {
        this.cargarAnios();

        this.sendYear();
        this.sendMonth();
    }



    /// GUARD CAMBIOS TABS

    /* ============================
     * 🔹 CICLO DE VIDA
     * ============================ */
    ngOnDestroy(): void {
        this.resetEstadoGlobal();
    }

    /* ============================
     * 🔹 CARGA DE DATOS
     * ============================ */
    private cargarAnios(): void {
        this.planingService.getYear().subscribe({
            next: years => {
                if (!years.length) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                    return;
                }
                this._years.set(years);
            },
            error: () => this.hasError.set('Ocurrió un error al cargar los años.'),
        });
    }

    private cargarMeses(year: string): void {
        this.planingService.getMonths(year).subscribe({
            next: months => {
                if (!months.length) {
                    this.hasError.set('No hay meses disponibles.');
                    return;
                }
                this.hasError.set(null);
                this._months.set(months);

            },
            error: () => this.hasError.set('Ocurrió un error al cargar los meses.'),
        });
    }

    private cargarPeriodo(mes: string, anio: string): void {

        this.planingService.getDate(mes, anio)
            .subscribe({
                next: data => {
                    this.onPeriodoCargado(data)
                    // this.planingCompartido.notifyFormChanged(); // notifica a los tabs

                },
                error: () => this.hasError.set('Ocurrió un error al cargar las rutas.'),
            });
    }

    /* ============================
     * 🔹 HANDLERS
     * ============================ */

    sendYear() {

        this.showData.get('fechaFin')?.valueChanges.subscribe((month) => {
            if (!month) return;

            // Bloquea cambio si hay cambios pendientes
            if (this.planingCompartido.getCambios()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cambios sin guardar',
                    text: 'Debes guardar o visualizar los cambios antes de cambiar de mes.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#00426F',
                    allowOutsideClick: false
                });

                // Revertir el FormControl al valor anterior
                this.showData.get('fechaFin')?.setValue(this.prevMonth, { emitEvent: false });
                return;
            }

            const anio = this.showData.get('fechaInicio')?.value || '';
            this.cargarPeriodo(month, anio);

        });
    }

    sendMonth(): void {

        this.showData.get('fechaInicio')?.valueChanges.subscribe((year) => {
            if (!year) return;

            if (this.planingCompartido.getCambios()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cambios sin guardar',
                    text: 'Debes guardar o visualizar los cambios antes de cambiar de año.',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#00426F',
                    allowOutsideClick: false
                });

                this.showData.get('fechaInicio')?.setValue(this.prevYear, { emitEvent: false });
                return;
            }
            this.cargarMeses(year);
        });
    }

    /* ============================
     * 🔹 CALLBACKS
     * ============================ */
    private onPeriodoCargado(data: any) {
        this.hasError.set(null);
        this.planingCompartido.setData(data);

        this.setBotonesState({
            nuevo: false,
            editar: false,
            copiarPeriodo: false,
            visualizar: true,
            guardar: true,
        });
    }

    /* ============================
     * 🔹 UI
     * ============================ */
    limpiarFormulario(): void {
        // Limpiar formulario
        this.showData.reset({ fechaInicio: '', fechaFin: '' });

        // Limpiar variables de control
        this.prevYear = '';
        this.prevMonth = '';
        this.dataAnio.set('');
        this.dataMes.set('');

        // Limpiar select de meses
        this._months.set([]);
    }

    abrirModal(): void {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal?.showModal();
    }

    recibirDatosPeriodo(data: any): void {
        console.log('Datos recibidos:', data);
    }

    /* ============================
    * 🔹 UTILIDADES
    * ============================ */

    ////GUARD PARA CAMBIAR DE RUTAS

    hasPendingChanges(): boolean {
        return this.planingCompartido.getCambios();
    }

    private resetEstadoGlobal(): void {
        this.semanasAvanceService.setPeriodo('', '');
    }


    botonesState = signal({
        nuevo: true,
        editar: true,
        copiarPeriodo: true,
        visualizar: true,
        guardar: true
    });


    setBotonesState(state: Partial<BotonesState>) {
        this.botonesState.update(current => ({ ...current, ...state }));
    }


    ///FORMULARIOS EDITAR
    onEditar() {
        this.planingCompartido.setFormBloqueadoCentral(false);
        this.planingCompartido.setModoEditar(true);

        this.setBotonesState({
            nuevo: true,          // 🔒 se bloquea
            editar: true,         // 🔒
            copiarPeriodo: true,  // 🔒
            guardar: false,       // ✅
            visualizar: false     // ✅
        });

        this.planingCompartido.setCambios(true); // 👈 IMPORTANTE
        this.planingCompartido.setChanges(true);
        //GUARD PARA PROTEGER TABS


        const inicioControl = this.showData.get('fechaInicio');
        const finControl = this.showData.get('fechaFin');

        if (inicioControl) inicioControl.disable({ emitEvent: false });
        if (finControl) finControl.disable({ emitEvent: false });
    }


    onNuevo() {
        this.planingCompartido.setModoEditar(false);
        this.planingCompartido.setFormBloqueadoCentral(false);
        this.planingCompartido.setCambios(true);

        this.planingCompartido.notifyResetSemanas();
        this.planingCompartido.limpiezaBotonNuevo();

        this.limpiarFormulario();

        this.setBotonesState({
            nuevo: true,          // 🔒 se bloquea
            editar: true,         // 🔒
            copiarPeriodo: true,  // 🔒
            guardar: false,       // ✅
            visualizar: false     // ✅
        });

        const inicioControl = this.showData.get('fechaInicio');
        const finControl = this.showData.get('fechaFin');

        if (inicioControl) inicioControl.disable({ emitEvent: false });
        if (finControl) finControl.disable({ emitEvent: false });
    }

    onVisualizar() {

        this.planingCompartido.onVisualizarGlobal();
        this.planingCompartido.notifyResetSemanas();
        this.planingCompartido.limpiezaBotonNuevo();
        this.limpiarFormulario();
        this.setBotonesState({
            nuevo: true,
            editar: true,
            copiarPeriodo: true,
            guardar: true,
            visualizar: true
        });

        this.showData.get('fechaInicio')?.enable();
        this.showData.get('fechaFin')?.enable();
    }



    // ngOnInit() {
    //     console.log('onGuardar dentro del componente:', this.onGuardar());
    // }


    public async onGuardar() {
        const confirmado = await this.formsUtils.confirmarGuardado();
        if (!confirmado) return;

        try {
            await this.guardarDatos();  // ⏳ ahora sí espera


            this.onVisualizar();
            this.formsUtils.mostrarExito();


            this.showData.get('fechaInicio')?.enable();
            this.showData.get('fechaFin')?.enable();
            this.planingCompartido.setCambios(false);


        } catch (error) {
            console.error(error);

        }
    }


    tieneCambios(): boolean {
        return this.planingCompartido.getCambios();
    }



    ngOnInit() {
        this.planingCompartido.registrarOnGuardar(() => this.onGuardar());
    }



    private async guardarDatos() {
        this.planingCompartido.guardarTodo().subscribe({
            next: () => {
            },
            error: (err) => {

            }
        });
    }
}
