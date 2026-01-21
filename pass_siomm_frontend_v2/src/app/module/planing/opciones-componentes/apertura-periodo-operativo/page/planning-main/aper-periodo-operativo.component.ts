import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal, ViewChild, WritableSignal } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanDeactivate, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SemanasAvanceMainService } from '../../services/semanas-avance-main/semanas-avance-main.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { PeriodoDestino, PlanningData } from '../../interface/aper-per-oper.interface';
import { PlaningCompartidoService } from '../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import Swal from 'sweetalert2';
import { ModalPeriodo } from "./modal-periodo/modal-periodo";
import { CanComponentDeactivate } from 'src/app/core/guards/cambios-guard/cambios-pendientes.guard';
import { AperPerOperComponent } from '../../components/periodo/periodo..component';


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
    @ViewChild(ModalPeriodo)
    child!: ModalPeriodo;

    //DECIDE SI QUIERO EDITAR O SOLO GUARDAR
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

    /* ============================
     * 🔹 CONSTRUCTOR
     * ============================ */
    constructor() {
        this.cargarAnios();

        this.sendYear();
        this.sendMonth();
    }


    anio!: string;
    mes!: string;
    fechaInicio!: string;
    fechaFin!: string;




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
                    // console.log(years)

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

                    console.log(months)
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

            this.anio = anio;   // AÑO
            this.mes = month;    // MES
        });
    }

    sendMonth(): void {
        this.showData.get('fechaInicio')?.valueChanges.subscribe((anioSeleccionado) => {
            if (!anioSeleccionado) return;

            // Bloquear si hay cambios pendientes
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

            // Cargar meses disponibles para el año seleccionado
            this.cargarMeses(anioSeleccionado);

            // Obtener el mes seleccionado
            const mesSeleccionado = this.showData.get('fechaFin')?.value;


            // Guardar año y mes correctamente

            if (mesSeleccionado) {
                this.cargarPeriodo(mesSeleccionado, anioSeleccionado); // Carga datos del periodo
            }
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


    copiarPeriodo(destino: PeriodoDestino): void {
        const username = localStorage.getItem('username');

        const payload = {
            ...destino,
            username: username ?? ''
        };


        console.log(payload);



        this.semanasAvanceService.copiarPeriodo(payload).subscribe({
            next: (resp) => {
                if (resp.success) {
                    this.formsUtils.exitoPeriodo(resp.message);
                    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
                    this.sendYear();
                    this.sendMonth();
                    this.child.onReset();
                    modal.close();

                    this.setBotonesState({
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
        })
    }

    convertToISO(value: string): string {
        return `${value} 00:00:00.000`;
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

        this.modoBoton = 'E';
        this.planingCompartido.agregarFila(true);

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

        this.modoBoton = 'N';

        this.planingCompartido.agregarFila(false);

        this.planingCompartido.setModoEditar(false);
        // this.planingCompartido.setFormBloqueadoCentral(false);
        this.planingCompartido.setCambios(true);

        this.planingCompartido.notifyResetSemanas();
        // this.planingCompartido.limpiezaBotonNuevo();

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
        this.planingCompartido.agregarFila(true);

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




    public async onGuardarGuard() {
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
        this.planingCompartido.registrarGuardar(() => this.onGuardarGuard());
    }
    mostrarErrorGeneral = false;


    //GUARDAR DATOS COMPONENTE
    private mapModo(): 'N' | 'E' {
        return this.modoBoton === 'N' ? 'N' : 'E';
    }

    public async onGuardar() {

        // if (!this.validarFactorOperativo()) {
        //     this.mostrarErrorGeneral = true;
        //     return;
        // }
        const confirmado = await this.formsUtils.confirmarGuardado();
        if (!confirmado) return;

        this.guardarDatos();
    }




    private guardarDatos() {

        // if (this.form.invalid) {
        //     this.form.markAllAsTouched(); // 🔥 obliga al usuario
        //     return; // ⛔ NO backend
        // }

        const anioOrigen = this.showData.get('fechaInicio')?.value;
        const mesOrigen = this.showData.get('fechaFin')?.value;

        this.planingCompartido.guardarTodo(this.mapModo(), anioOrigen, mesOrigen).subscribe({
            next: () => {
                this.onVisualizar();
                this.formsUtils.mostrarExito();

                this.showData.get('fechaInicio')?.enable();
                this.showData.get('fechaFin')?.enable();
                this.planingCompartido.setCambios(false);
            },
            error: (err) => {
                // mensaje que viene del backend
                const mensaje =
                    err?.error?.mensaje ||
                    err?.error ||
                    'Error al guardar los datos';

                this.formsUtils.errorGuardar(mensaje);
            }
        });
    }
}
