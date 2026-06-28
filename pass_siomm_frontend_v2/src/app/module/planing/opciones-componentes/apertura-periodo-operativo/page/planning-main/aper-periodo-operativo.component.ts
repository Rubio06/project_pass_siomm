import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { PeriodoDestino, PlanningData } from '../../interface/aper-per-oper.interface';
import { PlaningCompartidoService } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { ModalPeriodo } from "./modal-periodo/modal-periodo";
import { MostrarDatosFiltrosService } from 'src/app/module/planing/service/mostrar-datos-filtros.service';
import Swal from 'sweetalert2';

export enum ViewMode {
    VISUALIZAR = 'VISUALIZAR',
    NUEVO = 'NUEVO',
    EDITAR = 'EDITAR'
}

export interface TabFormulario {
    nombre: string;
    activo: boolean;
    esValido: boolean;
    getData(): any;
    marerarErrores(): void;
}

@Component({
    selector: 'app-planning-main',
    imports: [CommonModule, RouterOutlet, RouterLink, ReactiveFormsModule, RouterLinkActive, ModalPeriodo, TransfornMonthPipe],
    templateUrl: './aper-periodo-operativo.component.html',
    styleUrl: './aper-periodo-operativo.component.css',
})
export class AperturPeriodoComponent implements OnInit, OnDestroy {
    /* ============================
     * 🔹 INYECCIONES
     * ============================ */
    private planingService = inject(PlanningService);
    public planingCompartido = inject(PlaningCompartidoService);
    private semanasAvanceService = inject(SemanasAvanceMainService);
    private fb = inject(FormBuilder);
    private mostrarDatosFiltrosService = inject(MostrarDatosFiltrosService);

    @ViewChild(ModalPeriodo)
    child!: ModalPeriodo;

    // DECIDE SI QUIERO EDITAR O SOLO GUARDAR
    modoBoton: 'N' | 'E' = 'N';
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

    botoPresionado = signal<string>('');
    botoColor = signal<string>('');

    /* ============================
     * 🔹 FORMULARIO
     * ============================ */
    showData: FormGroup = this.fb.group({
        fechaInicio: [''],
        fechaFin: [''],
    });

    /* ============================
     * 🔹 ESTADO INTERNO
     * ============================ */
    private prevYear = '';
    private prevMonth = '';

    anio!: string;
    mes!: string;
    fechaInicio!: string;
    fechaFin!: string;

    /* ============================
     * 🔹 CONSTRUCTOR
     * ============================ */
    constructor() {
        this.cargarAnios();
        this.sendYear();
        this.sendMonth();

        effect(() => {
            const bloqueo = this.planingCompartido.bloqueoEditar();
            if (bloqueo) {
                this.showData.disable({ emitEvent: false });
            } else {
                this.showData.enable({ emitEvent: false });
            }
        });
    }

    /* ============================
     * 🔹 CICLO DE VIDA
     * ============================ */
    ngOnInit() {
        this.planingCompartido.registrarGuardar(() => this.onGuardarGuard());
        this.planingCompartido.registrarVisualizar(() => this.onVisualizarGuard());
    }

    ngOnDestroy(): void {
        this.planingCompartido.setFormBloqueadoEditar(true);
        this.planingCompartido.limpiezaDataRoutes();
        this.planingCompartido.setCambios(false);
        this.planingCompartido.setFormFactorBloqueado(true);
        this.planingCompartido.setTablaBloqueada(true);
    }

    /* ============================
     * 🔹 CARGA DE DATOS
     * ============================ */
    private cargarAnios(): void {
        this.mostrarDatosFiltrosService.getYear().subscribe({
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
        this.mostrarDatosFiltrosService.getMonths(year).subscribe({
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
        this.planingService.getDate(mes, anio).subscribe({
            next: data => {
                this.onPeriodoCargado(data);
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
            const anio = this.showData.get('fechaInicio')?.value || '';
            this.cargarPeriodo(month, anio);
            this.planingCompartido.setPeriodo(anio, month);
        });
    }

    sendMonth(): void {
        this.showData.get('fechaInicio')?.valueChanges.subscribe((anioSeleccionado) => {
            if (!anioSeleccionado) return;
            this.cargarMeses(anioSeleccionado);

            const mesSeleccionado = this.showData.get('fechaFin')?.value;
            if (mesSeleccionado) {
                //  Cambiado 'electionSeleccionado' por 'anioSeleccionado'
                this.cargarPeriodo(mesSeleccionado, anioSeleccionado);
            }
        });
    }

    /* ============================
     * 🔹 CALLBACKS
     * ============================ */
    private onPeriodoCargado(data: any) {
        this.hasError.set(null);
        this.planingCompartido.setData(data);

        this.planingCompartido.setBotonesState({
            nuevo: false,
            editar: false,
            copiarPeriodo: false,
            visualizar: true,
            guardar: true,
        });
    }

    /* ============================
     * 🔹 UI & ACCIONES
     * ============================ */
    limpiarFormulario(): void {
        this.showData.reset({ fechaInicio: '', fechaFin: '' });
        this.prevYear = '';
        this.prevMonth = '';
        this.dataAnio.set('');
        this.dataMes.set('');
        this._months.set([]);
    }

    abrirModal(): void {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal?.showModal();
    }

    copiarPeriodo(destino: PeriodoDestino): void {
        this.setBoton('Copiar Periodo', 'bg-[gray-500]');
        const username = localStorage.getItem('username');
        const payload = {
            ...destino,
            username: username ?? ''
        };

        this.semanasAvanceService.copiarPeriodo(payload).subscribe({
            next: (resp) => {
                if (resp.success) {
                    this.formsUtils.exitoPeriodo(resp.message);
                    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
                    this.sendYear();
                    this.sendMonth();
                    this.child.onReset();
                    modal.close();

                    this.planingCompartido.setBotonesState({
                        copiarPeriodo: true,
                    });

                    this.limpiarFormulario();
                } else {
                    this.formsUtils.errorCopiado(resp.message);
                }
            },
            error: error => {
                this.formsUtils.errorCopiado(error.error.message);
            }
        });
    }

    convertToISO(value: string): string {
        return `${value} 00:00:00.000`;
    }

    private setBoton(accion: string, color: string) {
        this.botoPresionado.set(`Usted se encuentra en el modo ${accion}`);
        this.botoColor.set(color);
    }

    onEditar() {
        this.setBoton('Editar', 'bg-[#455A64]');
        this.modoBoton = 'E';
        this.planingCompartido.agregarFila(true);
        this.planingCompartido.setFormFactorBloqueado(false);
        this.planingCompartido.setTablaBloqueada(false);
        this.planingCompartido.setModoEditar(true);
        this.planingCompartido.bloqueoEditar.set(true);
        this.planingCompartido.setCambios(true);

        this.planingCompartido.setBotonesState({
            nuevo: true,
            editar: true,
            copiarPeriodo: true,
            guardar: false,
            visualizar: false
        });
    }

    onNuevo() {
        this.setBoton('Nuevo', 'bg-[green]');
        this.modoBoton = 'N';
        this.planingCompartido.triggerResetPeriodo();
        this.planingCompartido.setFormFactorBloqueado(false);
        this.planingCompartido.setTablaBloqueada(true);
        this.planingCompartido.limpiezaDataRoutes();
        this.planingCompartido.bloqueoEditar.set(true);
        this.planingCompartido.setCambios(true);
        this.planingCompartido.setAgregarRegistro(false);

        this.planingCompartido.setBotonesState({
            nuevo: true,
            editar: true,
            copiarPeriodo: true,
            guardar: false,
            visualizar: false
        });
    }

    async onVisualizar() {
        if (this.modoBoton === 'N' || this.modoBoton === 'E') {
            const result = await Swal.fire({
                title: 'Cambios sin guardar',
                text: this.modoBoton === 'N'
                    ? 'Tiene cambios sin guardar. ¿Desea cambiar a modo visualizar?'
                    : 'Puede tener cambios pendientes en modo editar. ¿Desea cambiar a modo visualizar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#002B48',
                cancelButtonColor: '#d33'
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        this.setBoton('Visualizar', 'bg-[#012D96]');
        this.planingCompartido.onVisualizarGlobal();
        this.planingCompartido.setFormBloqueadoEditar(true);
        this.planingCompartido.setAgregarRegistro(true);
        this.planingCompartido.setCambios(false);
        this.planingCompartido.bloqueoEditar.set(false);

        this.onVisualizarGuard();

        this.planingCompartido.setFormFactorBloqueado(true);
        this.planingCompartido.setTablaBloqueada(true);

        this.planingCompartido.setBotonesState({
            nuevo: false,
            editar: false,
            copiarPeriodo: true,
            guardar: true,
            visualizar: true
        });
    }

    public async onGuardarGuard() {
        try {
            await this.guardarDatos();
            this.onVisualizar();
            this.formsUtils.mostrarExito();
            this.showData.get('fechaInicio')?.enable();
            this.showData.get('fechaFin')?.enable();
            this.planingCompartido.setCambios(false);
        } catch (error) {
            console.error(error);
        }
    }

    public async onVisualizarGuard() {
        this.showData.get('fechaInicio')?.enable();
        this.showData.get('fechaFin')?.enable();
        this.planingCompartido.setCambios(false);
    }

    private mapModo(): 'N' | 'E' {
        return this.modoBoton === 'N' ? 'N' : 'E';
    }

    public async onGuardar() {
        const esValido = this.planingCompartido.validarTabActivo();

        if (!esValido) {
            this.formsUtils.errorGuardar('El formulario tiene errores, revíselos');
            return;
        }

        const confirmado = await this.formsUtils.confirmarGuardado();
        if (!confirmado) return;
        this.guardarDatos();
    }

    private guardarDatos() {
        this.planingCompartido.guardarTodo(this.mapModo()).subscribe({
            next: () => {
                this.planingCompartido.triggerResetPeriodo();
                this.planingCompartido.setFormFactorBloqueado(true);
                this.planingCompartido.setTablaBloqueada(true);
                this.planingCompartido.setCambios(false);
                this.formsUtils.mostrarExito();
                this.planingCompartido.setAgregarRegistro(true);
                this.onVisualizarGuard();
                this.planingCompartido.bloqueoEditar.set(false);

                this.planingCompartido.setBotonesState({
                    nuevo: true,
                    editar: true,
                    copiarPeriodo: true,
                    guardar: true,
                    visualizar: true
                });
            },
            error: (err) => {
                const mensaje = err?.error?.mensaje || err?.error || 'Error al guardar los datos';
                this.formsUtils.errorGuardar(mensaje);
            }
        });
    }
}