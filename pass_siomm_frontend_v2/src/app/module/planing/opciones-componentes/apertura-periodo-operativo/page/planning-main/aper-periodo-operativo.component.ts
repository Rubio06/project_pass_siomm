import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
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
<<<<<<< HEAD
import Swal from 'sweetalert2';
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190


export enum ViewMode {
    VISUALIZAR = 'VISUALIZAR',
    NUEVO = 'NUEVO',
    EDITAR = 'EDITAR'
}

<<<<<<< HEAD
=======
interface BotonesState {
    nuevo: boolean;
    editar: boolean;
    copiarPeriodo: boolean;
    visualizar: boolean;
    guardar: boolean;
}
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190


export interface TabFormulario {
    nombre: string;
    activo: boolean;
    esValido: boolean;
    getData(): any;
    marcarErrores(): void;
}

@Component({
    selector: 'app-planning-main',
    imports: [CommonModule, RouterOutlet, RouterLink, ReactiveFormsModule, RouterLinkActive, ModalPeriodo, TransfornMonthPipe],
    templateUrl: './aper-periodo-operativo.component.html',
    styleUrl: './aper-periodo-operativo.component.css',
})
export class AperturPeriodoComponent {
    /* ============================
     * 🔹 INYECCIONES
     * ============================ */
    private planingService = inject(PlanningService);
<<<<<<< HEAD
    public planingCompartido = inject(PlaningCompartidoService);
=======
    private planingCompartido = inject(PlaningCompartidoService);
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    private semanasAvanceService = inject(SemanasAvanceMainService);
    private fb = inject(FormBuilder);

    private mostrarDatosFiltrosService = inject(MostrarDatosFiltrosService)

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

        effect(() => {
            const bloqueo = this.planingCompartido.bloqueoEditar();

            if (bloqueo) {
                this.showData.disable({ emitEvent: false });
            } else {
                this.showData.enable({ emitEvent: false });
            }
        });
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
        // this.resetEstadoGlobal();

        this.planingCompartido.setFormBloqueadoEditar(true);

        this.planingCompartido.limpiezaDataRoutes();


        this.planingCompartido.setCambios(false);

        this.planingCompartido.setFormFactorBloqueado(true); // 🔓
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
    // this.formsUtils.mensajeSelect();


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

            // Cargar meses disponibles para el año seleccionado
            this.cargarMeses(anioSeleccionado);

            // Obtener el mes seleccionado
            const mesSeleccionado = this.showData.get('fechaFin')?.value;



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

<<<<<<< HEAD
        this.planingCompartido.setBotonesState({
=======
        this.setBotonesState({
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
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
<<<<<<< HEAD

        this.setBoton('Copiar Periodo', 'bg-[gray-500]');   // azul

=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
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

<<<<<<< HEAD
                    this.planingCompartido.setBotonesState({
=======
                    this.setBotonesState({
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
                        copiarPeriodo: true,
                    });

                    // this.planingCompartido.notifyResetSemanas();

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



<<<<<<< HEAD


=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    convertToISO(value: string): string {
        return `${value} 00:00:00.000`;
    }


    /* ============================
    * 🔹 UTILIDADES
    * ============================ */

    ////GUARD PARA CAMBIAR DE RUTAS

    // hasPendingChanges(): boolean {
    //     return this.planingCompartido.getCambios();
    // }

<<<<<<< HEAD
    // botonesState = signal({
    //     nuevo: true,
    //     editar: true,
    //     copiarPeriodo: true,
    //     visualizar: true,
    //     guardar: true
    // });


    // setBotonesState(state: Partial<BotonesState>) {
    //     this.botonesState.update(current => ({ ...current, ...state }));
    // }
=======
    botonesState = signal({
        nuevo: false,
        editar: true,
        copiarPeriodo: true,
        visualizar: true,
        guardar: true
    });


    setBotonesState(state: Partial<BotonesState>) {
        this.botonesState.update(current => ({ ...current, ...state }));
    }
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190


    ///FORMULARIOS EDITAR
    onEditar() {
<<<<<<< HEAD
        this.setBoton('Editar', 'bg-[#455A64]');   // azul
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

        this.modoBoton = 'E';
        this.planingCompartido.agregarFila(true);

        this.planingCompartido.setFormFactorBloqueado(false); // 🔓
        this.planingCompartido.setTablaBloqueada(false);

        this.planingCompartido.setModoEditar(true);


        this.planingCompartido.bloqueoEditar.set(true);

        this.planingCompartido.setCambios(true); // 👈 IMPORTANTE

<<<<<<< HEAD
        this.planingCompartido.setBotonesState({
=======
        this.setBotonesState({
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
            nuevo: true,          // 🔒 se bloquea
            editar: true,         // 🔒
            copiarPeriodo: true,  // 🔒
            guardar: false,       // ✅
            visualizar: false     // ✅
        });
    }

    onNuevo() {
<<<<<<< HEAD
        this.setBoton('Nuevo', 'bg-[green]');   // azul
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

        this.modoBoton = 'N';

        this.planingCompartido.triggerResetPeriodo();

        this.planingCompartido.setFormFactorBloqueado(false); // 🔓
        this.planingCompartido.setTablaBloqueada(true);

        this.planingCompartido.limpiezaDataRoutes();
<<<<<<< HEAD
        this.planingCompartido.bloqueoEditar.set(true);
=======
        this.planingCompartido.bloqueoEditar.set(false);
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190


        this.planingCompartido.setCambios(true);
        this.planingCompartido.setAgregarRegistro(false);

<<<<<<< HEAD
        this.planingCompartido.setBotonesState({
=======
        this.setBotonesState({
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
            nuevo: true,          // 🔒 se bloquea
            editar: true,         // 🔒
            copiarPeriodo: true,  // 🔒
            guardar: false,       // ✅
            visualizar: false     // ✅
        });

    }

<<<<<<< HEAD
    botoPresionado = signal<string>('');
    botoColor = signal<string>('');


    private setBoton(accion: string, color: string) {
        this.botoPresionado.set(`Usted se encuentra en el modo ${accion}`);
        this.botoColor.set(color);
    }



    async onVisualizar() {

        // Verificar si hay cambios pendientes
        if (this.modoBoton === 'N') {

            const result = await Swal.fire({
                title: 'Cambios sin guardar',
                text: 'Tiene cambios sin guardar. ¿Desea cambiar a modo visualizar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#002B48',
                cancelButtonColor: '#d33'
            });

            if (!result.isConfirmed) {
                return; // ❌ se queda en modo nuevo
            }
        }

        if (this.modoBoton === 'E') {

            const result = await Swal.fire({
                title: 'Cambios sin guardar',
                text: 'Puede tener cambios pendientes en modo editar. ¿Desea cambiar a modo visualizar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#002B48',
                cancelButtonColor: '#d33'
            });

            if (!result.isConfirmed) {
                return; // ❌ se queda en modo nuevo
            }
        }

        this.setBoton('Visualizar', 'bg-[#012D96]');   // azul

=======
    onVisualizar() {
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        this.planingCompartido.onVisualizarGlobal();
        this.planingCompartido.setFormBloqueadoEditar(true);
        this.planingCompartido.setAgregarRegistro(true);

        this.planingCompartido.setCambios(false); // 👈 IMPORTANTE
        this.planingCompartido.bloqueoEditar.set(false);


        this.onVisualizarGuard();

        this.planingCompartido.setFormFactorBloqueado(true); // 🔓
        this.planingCompartido.setTablaBloqueada(true);

<<<<<<< HEAD
        this.planingCompartido.setBotonesState({
            nuevo: false,
            editar: false,
            copiarPeriodo: true,
            guardar: true,
            visualizar: true
        });


    }


=======
        this.setBotonesState({
            nuevo: false,
            editar: false,
            copiarPeriodo: true,
            guardar: false,
            visualizar: true
        });
    }




>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
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

    public async onVisualizarGuard() {
        // this.onVisualizar();


        this.showData.get('fechaInicio')?.enable();
        this.showData.get('fechaFin')?.enable();
        this.planingCompartido.setCambios(false);

    }


    // tieneCambios(): boolean {
    //     return this.planingCompartido.getCambios();
    // }


    ngOnInit() {
        this.planingCompartido.registrarGuardar(() => this.onGuardarGuard());

        this.planingCompartido.registrarVisualizar(() => this.onVisualizarGuard());
    }





    //GUARDAR DATOS COMPONENTE
    private mapModo(): 'N' | 'E' {
        return this.modoBoton === 'N' ? 'N' : 'E';
    }





    public async onGuardar() {
<<<<<<< HEAD


=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        const esValido = this.planingCompartido.validarTabActivo();

        if (!esValido) {
            this.formsUtils.errorGuardar(
                'El formulario tiene errores, reviselos'
            );
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
                this.planingCompartido.setFormFactorBloqueado(true); // 🔓
                this.planingCompartido.setTablaBloqueada(true);
                this.planingCompartido.setCambios(false);
                this.formsUtils.mostrarExito();
                this.planingCompartido.setAgregarRegistro(true);
                this.onVisualizarGuard();
<<<<<<< HEAD
                // this.setBoton('Guardar', 'bg-[#002B48]');   // azul
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

                this.planingCompartido.bloqueoEditar.set(false);


<<<<<<< HEAD
                this.planingCompartido.setBotonesState({
=======
                this.setBotonesState({
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
                    nuevo: true,
                    editar: true,
                    copiarPeriodo: true,
                    guardar: true,
                    visualizar: true
                });
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
