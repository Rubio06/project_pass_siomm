import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServioTransporteService } from '../../../../../services/servico-transporte.service';
import { EliminarTarifarioEquiposAlquiler, EntradaTablaDetalle, EntradaTarifarioMaterial, SvalDetTarifarioEquiposAlquiler, SvalMaeEquipo, SvalMaeTablaDetalle, SvalTablaDetalle } from '../../../../../interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-alquiler-transporte',
    imports: [ReactiveFormsModule],
    templateUrl: './alquiler-transporte.component.html',
})
export class AlquilerTransporteComponent {

    private readonly fb = inject(FormBuilder);
    private readonly servioTransporteService = inject(ServioTransporteService);
    public listSvalTablaDetalle = signal<SvalMaeTablaDetalle[]>([]);
    public listEquiposVal = signal<SvalMaeEquipo[]>([]);
    public listTablaDetalle = signal<SvalTablaDetalle[]>([])
    public formUtils = FormUtils
    ind_estado = input<string>('');

    isLoading = signal(false);
    cod_contrato = input<string>('');

    form: FormGroup = this.fb.group({
        filas: this.fb.array([])
    });

    get filas(): FormArray {
        return this.form.get('filas') as FormArray;
    }

    // Opciones para los selects (las cargarías desde el servicio)


    ngOnInit(): void {
        this.cargarDatosEquipo();
        this.obtenerDatosTabla();
        this.listarEquipo();
        this.listarTablaDetalle();
    }

    public cargarDatosEquipo(): void {
        this.isLoading.set(true);
        const payload: EntradaTarifarioMaterial = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
        };

        this.servioTransporteService.obtenerTarifarioEquipos(payload).subscribe({
            next: (data: SvalDetTarifarioEquiposAlquiler[]) => {
                this.filas.clear();

                data.forEach(item => {
                    this.filas.push(this.crearGrupoFila(item));
                });
            },
            error: (err) => {
                this.isLoading.set(false)
            },
            complete: () => this.isLoading.set(false)
        });
    }

    public obtenerDatosTabla(): void {
        const payload: EntradaTablaDetalle = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_tabla: '001',
        };

        this.servioTransporteService.obtenerDatosTabla(payload).subscribe({
            next: (data: SvalMaeTablaDetalle[]) => {
                this.listSvalTablaDetalle.set(data)
            },
            error: (err) => {
                console.log(err)
            },
        });
    }

    public listarEquipo(): void {


        this.servioTransporteService.listarEquipo().subscribe({
            next: (data: SvalMaeEquipo[]) => {
                this.listEquiposVal.set(data)
            },
            error: (err) => {
                console.log(err)
            },
        });
    }

    public listarTablaDetalle(): void {


        this.servioTransporteService.listarTablaDetalle().subscribe({
            next: (data: SvalTablaDetalle[]) => {
                this.listTablaDetalle.set(data)
            },
            error: (err) => {
                console.log(err)
            },
        });
    }


    private crearGrupoFila(item: SvalDetTarifarioEquiposAlquiler, esNuevo: boolean = false): FormGroup {
        const group = this.fb.group({
            cod_empresa: [item.cod_empresa],
            cod_empresa_unidad: [item.cod_empresa_unidad],
            cod_contrato: [item.cod_contrato],
            cod_equipo: [item.cod_equipo, [Validators.required]],
            cod_item_unimed: [item.cod_item_unimed ?? '', Validators.required],
            imp_alquiler_hora: [item.imp_alquiler_hora ?? 0, [Validators.required, Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]],
            flg_vigencia: [item.flg_vigencia, Validators.required],
            cod_tabla_unimed: ['002'],
            ind_turno_trabajo: [item.ind_turno_trabajo],
            esNuevo: [esNuevo]
        });

        // Si no es estado G, deshabilitar todos los controles
        if (this.ind_estado() !== 'G') {
            group.disable();
        }

        return group;
    }
    public onAgregarFila(): void {
        // this.obtenerSiguienteItem();

        const nuevoItem: SvalDetTarifarioEquiposAlquiler = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            cod_equipo: '',
            cod_item_unimed: '',
            imp_alquiler_hora: 0,
            flg_vigencia: '',
            cod_tabla_unimed: '002',
            ind_turno_trabajo: ''
        } as SvalDetTarifarioEquiposAlquiler;

        const nuevoFormGroup = this.crearGrupoFila(nuevoItem, true);
        this.filas.push(nuevoFormGroup);
        this.form.markAsDirty();

        setTimeout(() => {
            const contenedorTabla = document.getElementById('scrollContenedor');
            if (contenedorTabla) {
                contenedorTabla.scrollTo({
                    top: contenedorTabla.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }


    public onEliminar(index: number, filaGroup: AbstractControl): void {
        const group = filaGroup as FormGroup;

        const esFilaNueva = group.get('esNuevo')?.value;

        if (esFilaNueva === true) {
            this.filas.removeAt(index);
            this.form.markAsDirty();
            return;
        }

        // Escenario B: Ya existe en la base de datos de la mina, requiere confirmación
        this.formUtils.confirmarEliminacionPlanos(
            'Eliminacion de una Fila',
            `¿Desea eliminar el codigo de equipo ${group.get('cod_equipo')?.value}?`
        ).then(result => {

            if (!result.isConfirmed) return;
            const payload: EliminarTarifarioEquiposAlquiler = {
                cod_empresa: group.get('cod_empresa')?.value,
                cod_empresa_unidad: group.get('cod_empresa_unidad')?.value,
                cod_contrato: group.get('cod_contrato')?.value,
                cod_equipo: group.get('cod_equipo')?.value,
                cod_tabla_unimed: group.get('cod_tabla_unimed')?.value,
                cod_item_unimed: group.get('cod_item_unimed')?.value,
                ind_turno_trabajo: group.get('ind_turno_trabajo')?.value,

            };

            this.servioTransporteService.eliminarTarifarioEquiposAlquiler(payload)
                .subscribe({
                    next: (resp) => {
                        if (resp.estado === 1) {
                            // this.filas.removeAt(index); // Se quita de la vista tras el éxito en SQL Server
                            this.formUtils.alertaEliminadoClase(resp.mensaje);
                            this.cargarDatosEquipo();

                        } else {
                            this.formUtils.alertaNoEliminadoMensajeClase(resp.mensaje);
                        }
                    },
                    error: (err) => {
                        // console.error('Error al intentar eliminar el registro:', err);
                        // alert('Ocurrió un error al eliminar el registro.');
                        this.formUtils.alertaNoEliminadoMensajeClase(err);
                    }
                });


        })
    }

    // bloqueo de filas duplicadas
    public isEquipoDuplicado(codEquipo: string, indexActual: number): boolean {
        // Si el valor está vacío, no bloqueamos nada
        if (!codEquipo) return false;

        // Recorremos los controles del FormArray
        return this.filas.controls.some((control, index) => {
            // Saltamos la fila actual (un equipo sí puede estar seleccionado en SU propia fila)
            if (index === indexActual) return false;

            // Obtenemos el valor seleccionado de la fila competidora
            const equipoSeleccionado = control.get('cod_equipo')?.value;

            // Si coincide con el código que estamos evaluando en el bucle del <option>, devolvemos true
            return equipoSeleccionado === codEquipo;
        });
    }


}
