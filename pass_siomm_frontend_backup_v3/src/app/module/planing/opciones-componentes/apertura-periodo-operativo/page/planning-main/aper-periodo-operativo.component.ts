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

@Component({
    selector: 'app-planning-main',
    imports: [RouterOutlet, TransfornMonthPipe, RouterLink, ReactiveFormsModule, RouterLinkActive],
    templateUrl: './aper-periodo-operativo.component.html',
    styleUrl: './aper-periodo-operativo.component.css',
})
export class AperturPeriodoComponent {
    planingService = inject(PlanningService);
    hasError = signal<string | null>('');
    _getMonths = signal<string[]>([]);
    _getYear = signal<string[]>([]);
    dataAnio = signal<string>('');
    dataMes = signal<string>('');
    // Señal de bloqueo
    private _bloqueoForm: WritableSignal<boolean> = signal(false);
    public readonly bloqueoForm = this._bloqueoForm.asReadonly();
    semanaAvance = inject(SemanasAvanceMainService);

    private utils = FormUtils;
    bloqueo = signal<boolean>(true);
    visualizarBLoqueo = signal<boolean>(true);

    bloqueoEditar = signal<boolean>(false);
    bloquearCopiarPeriodo = signal<boolean>(false);



    public loadingService = inject(LoadingService);

    router = inject(Router);
    fb = inject(FormBuilder);

    _getDate = signal<AperPeriodo[]>([]);

    textoBoton = 'Bloqueado';
    bloqueoGuardar = signal(true);
    prevMonth = '';   // ← GUARDA el mes anterior



    ngOnDestroy() {
        this.planingService.setData(null);
        this.semanaAvance.setPeriodo("", "");
        this.planingService.setBloqueoForm(true);  // ← SIEMPRE desbloquear
    }

    constructor() {
        this.prevMonth = this.dataMes(); // ← el mes inicial

        this.getYear();


        effect(() => {
            this.textoBoton = this.planingService.bloqueo() ? 'Bloqueado' : 'Desbloqueado';
        });
    }


    showData: FormGroup = this.fb.group({
        fechaInicio: ['', [Validators.required]],
        fechaFin: ['', [Validators.required]]
    });

    private prevYear: string = ''; // ← Guarda el año anterior seleccionado


    public sendYear(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const yearData = selectElement.value;
        if (this.semanaAvance.tieneCambios()) {

            this.utils.guardarCambios();
            selectElement.value = this.prevYear;

            return;
        }

        this.prevYear = yearData;
        this.planingService.getMonths(yearData).subscribe({
            next: (data: string[]) => {
                if (data.length === 0) {
                    this.hasError.set('No hay meses disponibles.');
                } else {
                    this.hasError.set(null);
                    this._getMonths.set(data);
                    this.dataAnio.set(yearData);
                }
            },
            error: (error) => {
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        });
    }


    public getYear() {
        this.planingService.getYear().subscribe({
            next: (data: string[]) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                    this._getYear.set(data);

                }
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        })
    }





    sendMonth(event: Event) {
        const select = event.target as HTMLSelectElement;
        const newValue = select.value;

        if (this.semanaAvance.tieneCambios()) {
            this.utils.guardarCambios();
            select.value = this.prevMonth;

            return;
        }

        this.prevMonth = newValue;
        this.planingService.setBloqueoForm(true);
        this.visualizarBLoqueo.set(true);
        this.dataMes.set(newValue);
        this.loadingService.loadingOn();
        const anio = this.dataAnio();
        this.semanaAvance.setPeriodo(newValue, anio);

        this.planingService.getDate(newValue, anio).subscribe({
            next: (data: any) => {
                if (data.length === 0) {
                    this.hasError.set('No se encontraron rutas disponibles.');
                } else {
                    this.hasError.set(null);
                    this.planingService.setData(data);
                    this.loadingService.loadingOff();
                    this.bloqueo.set(false);
                }
            },
            error: (error) => {
                console.error('Error al traer los meses.', error);
                this.hasError.set('Ocurrió un error al cargar las rutas.');
            }
        });
    }





    toggleBloqueo() {
        this.semanaAvance.setNuevoMode(true);  // ← ahora sí
        this.planingService.setData([]);   // si deseas limpiar
        this.planingService.setBloqueoForm(false);  // ← SIEMPRE desbloquear
        this.bloqueoGuardar.set(false);
        this.visualizarBLoqueo.set(false);
        // this.utils.alertaNoEliminado();
        this.semanaAvance.setCambios(true)
        this.bloqueoEditar.set(true);

        this.bloquearCopiarPeriodo.set(true);
        this.bloqueo.set(true);
    }




    visualizar() {
        this.planingService.setBloqueoForm(true);  // ← SIEMPRE desbloquear
        this.bloqueo.set(false);
        this.semanaAvance.setCambios(false)
        this.visualizarBLoqueo.set(true);


        this.bloqueoEditar.set(false);

        this.bloquearCopiarPeriodo.set(false);
        this.limpiarFormulario();
    }


    desbloquearEdicion() {
        // this.planingService.setBloqueoForm(false);
        // this.bloqueoGuardar.set(false);

        console.log("Entrando al editar")
    }


    guardarTodo() {
        // this.planingCompartido.guardarTodo().subscribe({
        //     next: () => {
        //         this.planingService.setBloqueoForm(true);
        //         this.bloqueoGuardar.set(true);
        //         this.semanaAvance.setCambios(false);
        //     },
        //     error: err => console.error('❌ Error', err)
        // });

        Swal.fire({
            icon: 'success',
            title: 'Guardado correctamente',
            text: 'Los cambios se han guardado exitosamente.',
            confirmButtonColor: '#013B5C'
        });
        this.semanaAvance.setCambios(false)
        this.visualizarBLoqueo.set(true);
        this.planingService.setData([]);   // si deseas limpiar
        this.planingService.setBloqueoForm(true);
        this.bloqueoGuardar.set(true);

                this.bloqueoEditar.set(false);

        this.bloquearCopiarPeriodo.set(false);
        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.showData.reset({
            fechaInicio: '',
            fechaFin: ''
        });
    }
}
