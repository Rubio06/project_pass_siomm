import { Component, effect, Inject, inject, input, signal, ViewChild, WritableSignal } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { AperPeriodo } from '../../interface/aper-per-oper.interface';
import { PlaningCompartido } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import Swal from 'sweetalert2';
import { CanComponentDeactivate } from 'src/app/core/guards/cambios-guard/cambios-pendientes.guard';
import { ModalPeriodo } from "./modal-periodo/modal-periodo";
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { delay, finalize } from 'rxjs';

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
    imports: [RouterOutlet, TransfornMonthPipe, RouterLink, ReactiveFormsModule, RouterLinkActive, ModalPeriodo],
    templateUrl: './aper-periodo-operativo.component.html',
    styleUrl: './aper-periodo-operativo.component.css',
})
export class AperturPeriodoComponent {



    /* ============================
     * 🔹 INYECCIONES
     * ============================ */
    private planingService = inject(PlanningService);
    private planingCompartido = inject(PlaningCompartido);
    private semanasAvanceService = inject(SemanasAvanceMainService);
    private loadingService = inject(LoadingService);
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
    }

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
        // this.loadingService.loadingOn();

        this.planingService.getDate(mes, anio)
            .subscribe({
                next: data => {
                    this.onPeriodoCargado(data)
                },
                error: () => this.hasError.set('Ocurrió un error al cargar las rutas.'),
            });
    }



    /* ============================
     * 🔹 HANDLERS
     * ============================ */
    sendYear(event: Event): void {
        const year = (event.target as HTMLSelectElement).value;

        this.prevYear = year;
        this.dataAnio.set(year);

        this.cargarMeses(year);
    }

    sendMonth(event: Event): void {
        const month = (event.target as HTMLSelectElement).value;

        this.prevMonth = month;
        this.dataMes.set(month);

        const anio = this.dataAnio();
        this.semanasAvanceService.setPeriodo(month, anio);

        this.cargarPeriodo(month, anio);
    }

    /* ============================
     * 🔹 CALLBACKS
     * ============================ */
    private onPeriodoCargado(data: any[]): void {
        this.hasError.set(null);
        this.planingCompartido.setData(data);
        this.planingCompartido.salirModoVisualizar();

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
        this.showData.reset({ fechaInicio: '', fechaFin: '' });
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
    // hasPendingChanges(): boolean {
    //     return this.planingCompartido.getCambios();
    // }







    private resetEstadoGlobal(): void {
        this.planingCompartido.setData(null);
        this.semanasAvanceService.setPeriodo('', '');
        // this.planingCompartido.setBloqueoForm(true);
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
        this.planingCompartido.setCambios(true);
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
    }

    ///FORMULARIOS NUEVO
    onNuevo() {
        this.planingCompartido.setModoEditar(false);
        this.planingCompartido.setFormBloqueadoCentral(false);
        // this.planingCompartido.enableTableButton();

        // 🔔 reset global
        this.planingCompartido.notifyResetForms();


        this.setBotonesState({
            nuevo: true,          // 🔒 se bloquea
            editar: true,         // 🔒
            copiarPeriodo: true,  // 🔒
            guardar: false,       // ✅
            visualizar: false     // ✅
        });

        this.planingCompartido.setCambios(true); // 👈 IMPORTANTE


        this.planingCompartido.setChanges(false);

    }

    //FORMULARIO visualizar
    onVisualizar() {
        this.planingCompartido.setFormBloqueadoCentral(true);
        this.planingCompartido.setModoEditar(false);
        this.planingCompartido.notifyVisualizar();
        this.limpiarFormulario();

        this.setBotonesState({
            nuevo: true,          // 🔒 se bloquea
            editar: true,         // 🔒
            copiarPeriodo: true,  // 🔒
            guardar: true,       // ✅
            visualizar: true     // ✅
        });

    }

    async onGuardar() {
        const confirmado = await this.formsUtils.confirmarGuardado();
        if (!confirmado) return;

        this.loadingService.loadingOn();

        try {
            await this.guardarDatos(); // 👈 SOLO lógica de guardado

            this.formsUtils.mostrarExito();
            this.onVisualizar();
            this.planingCompartido.setCambios(true); // 👈 IMPORTANTE

            // this.estadoPostGuardar();

        } catch (error) {
            // this.mostrarError();
            console.error(error);

        } finally {
            this.loadingService.loadingOff();
        }
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
