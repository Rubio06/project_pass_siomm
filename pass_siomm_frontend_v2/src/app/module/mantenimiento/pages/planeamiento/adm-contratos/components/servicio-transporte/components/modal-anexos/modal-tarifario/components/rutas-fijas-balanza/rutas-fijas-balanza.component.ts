import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DetTarifarioTransporteMaterial, EliminarTarifarioTransporteMaterial, EntradaTablaDetalle, EntradaTarifarioMaterial, RutaTransporte, SvalDetTarifarioTransporte, SvalMaeTablaDetalle } from '../../../../../interfaces/servicio-transporte.interface';
import { ServioTransporteService } from '../../../../../services/servico-transporte.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-rutas-fijas-balanza',
    imports: [NgSelectModule, ReactiveFormsModule],
    templateUrl: './rutas-fijas-balanza.component.html',
})
export class RutasFijasBalanzaComponent {
    private readonly servioTransporteService = inject(ServioTransporteService);

    private fb = inject(FormBuilder);

    // Inputs y Estados globales
    public cod_contrato = input<string>('');
    public ind_estado = input<string>('');
    public isLoading = signal<boolean>(false);
    public esModoLectura = signal<boolean>(false); // Controla el estado visual y de edición
    public formUtils = FormUtils;

    // Catálogos maestros para los selectores (Pre-cargados)
    public listTransporteVal = signal<SvalDetTarifarioTransporte[]>([]);
    public listSvalTablaDetalle = signal<SvalMaeTablaDetalle[]>([]);
    // Formulario Raíz
    public formularioTablas!: FormGroup;
    public listRutas = signal<RutaTransporte[]>([]);

    ngOnInit(): void {
        this.inicializarFormulario();
        this.cargarTarifarioMaterial();
        this.obtenerTarifarioLista();
        this.obtenerDatosTabla();
    }

    private inicializarFormulario(): void {
        this.formularioTablas = this.fb.group({
            filasMaterial: this.fb.array([])
        });
    }

    // Getter tipado para recorrer el FormArray en el HTML
    get filas(): FormArray {
        return this.formularioTablas.get('filasMaterial') as FormArray;
    }

    public cargarTarifarioMaterial(): void {
        this.isLoading.set(true);
        const payload: EntradaTarifarioMaterial = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
        };

        this.servioTransporteService.obtenerTarifarioMaterial(payload).subscribe({
            next: (data: DetTarifarioTransporteMaterial[]) => {
                this.filas.clear();
                data.forEach(item => {
                    this.filas.push(this.crearGrupoFila(item));
                });
            },
            error: (err) => {
                console.log(err)
                this.isLoading.set(false)
            },
            complete: () => this.isLoading.set(false)
        });
    }

    public obtenerTarifarioLista(): void {

        this.servioTransporteService.obtenerTarifarioLista().subscribe({
            next: (data: SvalDetTarifarioTransporte[]) => {

                this.listTransporteVal.set(data)
            },
            error: (err) => {
                this.isLoading.set(false)
            },
            complete: () => this.isLoading.set(false)
        });
    }

    public onItemRutaChange(index: number, codItemRuta: string): void {
        // 1. Obtener el grupo de la fila actual del FormArray
        const filaForm = this.filas.at(index);

        // Si seleccionó "Inactivo" o limpia el select, reseteamos las celdas e indicador
        if (!codItemRuta || codItemRuta === '0') {
            filaForm.patchValue({
                c_t_zona: '',
                c_t_origen: '',
                c_t_destino: '',
                ind_balanza_desmonte: 'B' // Reseteo por defecto a Balanza
            });
            return;
        }

        // 2. Buscar el objeto completo en tu lista de transportes (Signal)
        const transporteSeleccionado = this.listTransporteVal().find(
            (tra) => tra.cod_item_ruta === codItemRuta
        );

        // 3. Si lo encuentra, evalúa el texto e inyecta los valores en esa fila específica
        if (transporteSeleccionado) {

            // --- NUEVA LÓGICA DE AUTOMATIZACIÓN ---
            // Concatenamos el origen y destino para buscar la palabra "DESMONTERA" en cualquiera de los dos campos
            const textoCompletoRuta = `${transporteSeleccionado.c_t_origen} ${transporteSeleccionado.c_t_destino}`.toUpperCase();

            let indicadorCalculado = 'B'; // Por defecto 'B' (Balanza)

            if (textoCompletoRuta.includes('DESMONTERA')) {
                indicadorCalculado = 'D'; // Si encuentra la palabra, cambia a 'D' (Desmonte)
            }
            // --------------------------------------

            filaForm.patchValue({
                c_t_zona: transporteSeleccionado.c_t_zona,
                c_t_origen: transporteSeleccionado.c_t_origen,
                c_t_destino: transporteSeleccionado.c_t_destino,

                // Inyectamos el indicador calculado directamente en el control de esta fila
                ind_balanza_desmonte: indicadorCalculado
            });
        }
    }


    public obtenerDatosTabla(): void {
        const payload: EntradaTablaDetalle = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_tabla: '001',
        };

        this.servioTransporteService.obtenerDatosTabla(payload).subscribe({
            next: (data: SvalMaeTablaDetalle[]) => {

                console.log(data)
                this.listSvalTablaDetalle.set(data)
            },
            error: (err) => {
                console.log(err)
            },
        });
    }

    public onAgregarFila(): void {
        // this.obtenerSiguienteItem();

        const nuevoItem = {
            cod_empresa: '03',

            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),

            cod_item_ruta: '',
            c_t_zona: '',
            c_t_origen: '',
            c_t_destino: '',
            cod_item: '',
            cod_tabla: '001',

            flg_vigente: ''
        } as DetTarifarioTransporteMaterial;

        const nuevoFormGroup = this.crearGrupoFila(nuevoItem, true);
        this.filas.push(nuevoFormGroup);
        this.formularioTablas.markAsDirty();

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

    private crearGrupoFila(item: DetTarifarioTransporteMaterial, esNuevo: boolean = false): FormGroup {
        return this.fb.group({
            // cod_empresa: [item.cod_empresa],

            // cod_empresa_unidad: [item.cod_empresa_unidad],
            // cod_contrato: [this.cod_contrato()],
            cod_item_ruta: [item.cod_item_ruta, Validators.required], // El código del tarifario suele ser de solo lectura
            c_t_zona: [item.c_t_zona],
            c_t_origen: [item.c_t_origen],
            c_t_destino: [item.c_t_destino],

            cod_item: [item.cod_item], // Campo de apoyo informativo
            flg_vigente: [item.flg_vigente], // Calculado desde base de datos
            cod_empresa: [item.cod_empresa], // Calculado desde base de datos
            cod_empresa_unidad: [item.cod_empresa_unidad], // Calculado desde base de datos
            cod_contrato: [item.cod_contrato], // Calculado desde base de datos
            cod_tabla: [item.cod_tabla], // Calculado desde base de datos
            ind_balanza_desmonte: [item.ind_balanza_desmonte], // Calculado desde base de datos
            esNuevo: [esNuevo]
        });
    }

    public cargarMaestros(): void {
        this.servioTransporteService.obtenerRutas().subscribe({
            next: r => {
                this.listRutas.set(r)
            }
        });
    }



    public onEliminar(index: number, filaGroup: AbstractControl): void {
        const group = filaGroup as FormGroup;

        const esFilaNueva = group.get('esNuevo')?.value;

        if (esFilaNueva === true) {
            this.filas.removeAt(index);
            this.formularioTablas.markAsDirty();
            return;
        }

        // Escenario B: Ya existe en la base de datos de la mina, requiere confirmación
        this.formUtils.confirmarEliminacionPlanos(
            'Eliminacion de una Fila',
            `¿Desea eliminar el codigo rutas fijas balanza ${group.get('cod_item_ruta')?.value}?`
        ).then(result => {

            if (!result.isConfirmed) return;
            const payload: EliminarTarifarioTransporteMaterial = {
                cod_empresa: group.get('cod_empresa')?.value,
                cod_empresa_unidad: group.get('cod_empresa_unidad')?.value,
                cod_contrato: group.get('cod_contrato')?.value,
                cod_item_ruta: group.get('cod_item_ruta')?.value,
                cod_tabla: group.get('cod_tabla')?.value,
                cod_item: group.get('cod_item')?.value,
                ind_balanza_desmonte: group.get('ind_balanza_desmonte')?.value,

            };

            this.servioTransporteService.eliminarTarifarioTransporteMaterial(payload)
                .subscribe({
                    next: (resp) => {
                        if (resp.estado === 1) {
                            // this.filas.removeAt(index); // Se quita de la vista tras el éxito en SQL Server
                            this.formUtils.alertaEliminadoClase(resp.mensaje);
                            // this.cargarFilas();
                            this.cargarTarifarioMaterial();

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


}
