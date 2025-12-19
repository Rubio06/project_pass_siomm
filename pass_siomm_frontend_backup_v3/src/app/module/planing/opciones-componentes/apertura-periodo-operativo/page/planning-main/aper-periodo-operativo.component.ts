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

@Component({
    selector: 'app-planning-main',
    imports: [RouterOutlet, TransfornMonthPipe, RouterLink, ReactiveFormsModule, RouterLinkActive, ModalPeriodo],
    templateUrl: './aper-periodo-operativo.component.html',
    styleUrl: './aper-periodo-operativo.component.css',
})
export class AperturPeriodoComponent {
    planingService = inject(PlanningService);
    planingCompartido = inject(PlaningCompartido);
    semanaAvance = inject(SemanasAvanceMainService);
    loadingService = inject(LoadingService);
    fb = inject(FormBuilder);
    semanasAvanceMainService = inject(SemanasAvanceMainService);

    // Signals
    hasError = signal<string | null>('');
    _getMonths = signal<string[]>([]);
    _getYear = signal<string[]>([]);
    dataAnio = signal<string>('');
    dataMes = signal<string>('');


    bloqueo = signal<boolean>(true);
    visualizarBLoqueo = signal<boolean>(true);
    bloqueoGuardar = signal(true);
    bloqueoEditar = signal<boolean>(true);
    bloquearCopiarPeriodo = signal<boolean>(false);

    // Form
    showData: FormGroup = this.fb.group({
        fechaInicio: ['', [Validators.required]],
        fechaFin: ['', [Validators.required]],
    });

    private prevMonth = '';
    private prevYear = '';

    constructor() {
        this.prevMonth = this.dataMes();
        this.getYear();
    }

    ngOnDestroy() {
        this.planingCompartido.setData(null);
        this.semanaAvance.setPeriodo('', '');
        this.planingCompartido.setBloqueoForm(true);
    }

    /** ------------------- MÉTODOS ------------------- */
    getYear() {
        this.planingService.getYear().subscribe({
            next: (data: string[]) => {
                if (data.length === 0) this.hasError.set('No se encontraron rutas disponibles.');
                else this._getYear.set(data);
            },
            error: () => this.hasError.set('Ocurrió un error al cargar las rutas.'),
        });
    }

    sendYear(event: Event) {
        const yearData = (event.target as HTMLSelectElement).value;

        if (this.semanaAvance.tieneCambios()) {
            FormUtils.guardarCambios();
            (event.target as HTMLSelectElement).value = this.prevYear;
            return;
        }

        this.prevYear = yearData;

        this.planingService.getMonths(yearData).subscribe({
            next: (data: string[]) => {
                if (data.length === 0) this.hasError.set('No hay meses disponibles.');
                else {
                    this.hasError.set(null);
                    this._getMonths.set(data);
                    this.dataAnio.set(yearData);
                }
            },
            error: () => this.hasError.set('Ocurrió un error al cargar las rutas.'),
        });
    }

    sendMonth(event: Event) {
        const select = event.target as HTMLSelectElement;
        const newValue = select.value;

        if (this.semanaAvance.tieneCambios()) {
            FormUtils.guardarCambios();
            select.value = this.prevMonth;
            return;
        }

        const bloqueadoEditar = this.planingCompartido.getBloqueoFormEditar()();
        if (!bloqueadoEditar) {
            FormUtils.editarCambios();
            select.value = this.prevMonth;
            return;
        }

        this.prevMonth = newValue;
        this.dataMes.set(newValue);
        this.planingCompartido.setBloqueoForm(true);
        this.visualizarBLoqueo.set(true);


        const anio = this.dataAnio();
        this.semanaAvance.setPeriodo(newValue, anio);

        this.planingService.getDate(newValue, anio)
            .pipe(
                delay(400), // solo UX, no lógica
                finalize(() => this.loadingService.loadingOff())
            ).subscribe({
                next: (data: any) => {
                    if (data.length === 0) this.hasError.set('No se encontraron rutas disponibles.');
                    else {
                        this.hasError.set(null);
                        this.planingCompartido.setData(data);
                        this.loadingService.loadingOff();
                        this.bloqueo.set(false);
                        this.bloqueoEditar.set(false);
                        this.bloquearCopiarPeriodo.set(false);
                    }
                },
                error: () => this.hasError.set('Ocurrió un error al cargar las rutas.'),
            });
    }

    botonNuevo() {
        // Configuración para crear un nuevo registro
        this.semanaAvance.setNuevoMode(true);
        this.semanaAvance.setCambios(true);

        // Limpiar datos temporales
        this.planingCompartido.setData([]);
        this.limpiarFormulario();

        // Permitir edición
        // this.planingCompartido.setBloqueoForm(false);
        this.planingCompartido.setBloqueoFormEditar(false);

        // Flags visuales
        this.bloqueoGuardar.set(false);
        this.visualizarBLoqueo.set(false);
        this.bloqueoEditar.set(true);
        this.bloquearCopiarPeriodo.set(true);
        this.bloqueo.set(true);

        // Botones de tabla
        this.planingCompartido.enableTableButton();
    }

    visualizar() {
        // Bloquear edición de todos los formularios
        // this.planingCompartido.setBloqueoForm(true);       // Bloquea edición general
        this.planingCompartido.setBloqueoFormEditar(true); // Bloquea edición específica de formularios
        this.semanaAvance.setCambios(false);               // No hay cambios pendientes

        // Flags de visualización
        this.bloqueo.set(true);            // Bloqueo general
        this.visualizarBLoqueo.set(true);  // Indica modo solo visualización
        this.bloqueoEditar.set(true);      // No se puede editar
        this.bloqueoGuardar.set(true);     // Guardar deshabilitado
        this.bloquearCopiarPeriodo.set(false); // Copiar periodo deshabilitado

        // Resetear datos temporales y formularios a su estado inicial
        this.planingCompartido.setData([]);
        this.limpiarFormulario();          // Limpia inputs y deja valores iniciales
    }

    desbloquearEdicion() {
        // Permitir edición nuevamente
        // this.planingCompartido.setBloqueoForm(false);
        this.planingCompartido.setBloqueoFormEditar(false);
        // Flags visuales
        this.bloqueoGuardar.set(false);
        this.bloquearCopiarPeriodo.set(true);
        this.semanaAvance.setCambios(true);
        this.visualizarBLoqueo.set(false);
        this.bloqueo.set(true);
        this.bloqueoEditar.set(true);
    }

    async guardarTodo() {
        // Confirmación antes de guardar
        const result = await Swal.fire({
            title: '¿Desea guardar los datos?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#00426F',
            cancelButtonColor: '#9E9E9E',
            reverseButtons: true,
            focusCancel: true,
            backdrop: 'rgba(0,0,0,0.4)',
            customClass: {
                popup: 'rounded-xl',
                title: 'text-lg font-bold',
                confirmButton: 'px-6 py-2 rounded-lg font-semibold',
                cancelButton: 'px-6 py-2 rounded-lg font-semibold'
            }
        });

        if (!result.isConfirmed) return;

        // Bloquear edición mientras se guarda
        // this.planingCompartido.setBloqueoForm(true);
        this.planingCompartido.setBloqueoFormEditar(true);
        this.bloqueoGuardar.set(true);
        this.semanaAvance.setCambios(false);
        this.visualizarBLoqueo.set(true);
        this.bloqueoEditar.set(true);
        this.bloquearCopiarPeriodo.set(false);

        // Desactivar botones de tabla y limpiar temporal
        this.planingCompartido.disableTableButton();
        this.planingCompartido.setData([]);
        this.limpiarFormulario();

        // Feedback de guardado
        Swal.fire({
            icon: 'success',
            title: 'Guardado correctamente',
            text: 'Los cambios se han guardado exitosamente.',
            confirmButtonColor: '#013B5C'
        });

        // Guardado real
        this.loadingService.loadingOn();
        this.planingCompartido.guardarTodo().subscribe({
            next: () => this.loadingService.loadingOff(),
            error: (err) => {
                this.loadingService.loadingOff();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron guardar los cambios',
                    confirmButtonColor: '#013B5C'
                });
            }
        });
    }

    limpiarFormulario() {
        this.showData.reset({ fechaInicio: '', fechaFin: '' });
    }

    abrirModal() {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal.showModal();
    }

    recibirDatos(event: any) {
        console.log('Datos recibidos', event);
    }


    hasPendingChanges(): boolean {
        return this.semanasAvanceMainService.getCambios(); // revisa los cambios pendientes
    }
}
