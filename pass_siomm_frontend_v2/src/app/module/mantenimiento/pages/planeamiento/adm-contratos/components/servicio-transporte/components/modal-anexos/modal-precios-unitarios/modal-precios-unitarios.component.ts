import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModaBusquedaParametroComponent } from './components/modal-busqueda-parametro/modal-busqueda-parametro.component';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { EliminarRespuestaDto, EntradaEliminarPrecioUnitario, GastosGeneralesRequest, MaeTablaDetalleDto, MaeTablaDetalleRequest, PartidaPuInsertDto, PartidaPuListarDto } from '../../../interfaces/servicio-transporte.interface';
import { DecimalPipe } from '@angular/common';
import { FormUtils } from 'src/app/utils/form-utils';
import { DetallePrecioUnitarioComponent } from './components/detalle-precio-unitario/detalle-precio-unitario.component';

@Component({
    selector: 'app-modal-precios-unitarios',
    standalone: true,
    imports: [ModaBusquedaParametroComponent, DecimalPipe, ReactiveFormsModule, DetallePrecioUnitarioComponent],
    templateUrl: './modal-precios-unitarios.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalPreciosUnitariosComponent implements OnInit {
    private formUtils = FormUtils;
    isLoading = signal(false);
    servioTransporteService = inject(ServioTransporteService);
    private fb = inject(FormBuilder);
    // Tu definición del Signal (ejemplo por si no lo tenías así)
    public contratoActivo = signal<PartidaPuListarDto | null>(null);
    public detallePartida = signal<PartidaPuListarDto | null>(null);

    public formPreciosUnitarios!: FormGroup;

    cod_contrato = input<string>()
    onCerrarModalPrecUnitario = output<void>();
    onCerrarModalPrecUnitarioDetalle = output<void>();
    ind_estado = input<string>('');


    public onAbrirModalPrecioUnitarioDetalle = signal<boolean>(false);
    public onAbrirlModalParametro = signal<boolean>(false);

    public listPreciosUnitarios = signal<PartidaPuListarDto[]>([])


    public listMaestro = signal<MaeTablaDetalleDto[]>([]);

    ngOnInit(): void {
        this.inicializarFormulario();
        this.cargarEquiposPorFila();
        this.cargarMaestroDetalle();
    }


    public cargarEquiposPorFila(): void {
        this.isLoading.set(true);
        const payload: GastosGeneralesRequest = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato()
        };

        this.servioTransporteService.listarPartidaPu(payload).subscribe({
            next: (data) => {
                this.listPreciosUnitarios.set(data);
                this.filas.clear();
                data.forEach(item => this.filas.push(this.crearGrupoFila(item)));
            },
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });
    }

    public cargarMaestroDetalle(): void {
        // this.isLoading.set(true);

        const request: MaeTablaDetalleRequest = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
        };

        this.servioTransporteService.obtenerTablaDetalle(request).subscribe({
            next: (data: MaeTablaDetalleDto[]) => {
                this.listMaestro.set(data)
                // this.listaDetalles = data;
                // this.cargando = false;
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error capturado en el componente: ', err);
            }
        });
    }

    private inicializarFormulario(): void {
        this.formPreciosUnitarios = this.fb.group({
            filas: this.fb.array([])
        });
    }

    private crearGrupoFila(item: PartidaPuListarDto): FormGroup {
        return this.fb.group({
            seleccionado: [false],
            nro_partida: [item.nro_partida],
            codigo_precio: [item.codigo_precio],
            cod_contrato: [this.cod_contrato()],
            cod_actividad: [item.cod_actividad],
            cod_catalogo_tarea: [item.cod_catalogo_tarea],
            des_catalogo_tarea: [item.des_catalogo_tarea],
            cod_item_unimed: [{ value: item.cod_item_unimed, disabled: true }],
            ancho_labor: [item.ancho_labor],
            altura_labor: [item.altura_labor],
            equipo: [item.equipo],
            des_tabladet_abrev: [item.des_tabladet_abrev],
            imp_costo_partida: [item.imp_costo_partida || '0.000'],
            imp_costo_partida_dolar: [item.imp_costo_partida_dolar || '0.000'],
            ind_estado: [item.ind_estado],
            ind_situacion: [item.ind_situacion === '1']
        });
    }


    get filas(): FormArray {
        return this.formPreciosUnitarios.get('filas') as FormArray;
    }


    /**
     * Actualiza el contrato activo al hacer clic en la fila
     * @param datosFila Valores del FormGroup de la fila seleccionada
     */
    public seleccionarFila(datosFila: PartidaPuListarDto): void {
        this.contratoActivo.set(datosFila);
        this.onAbrirModalPrecioUnitarioDetalle.set(true);
        this.detallePartida.set(datosFila)
    }


    // this.formUtils.confirmarInactivar(tituloModal, preguntaModal, textoBotonConfirmar).then(result => {
    //     if (!result.isConfirmed) return;

    //     this.mantenimientoService.eliminarNivel(grupo.cod_nivel!).subscribe({
    //         next: (res: ResponseEliminarDto) => {
    //             if (res.estado === 1) {
    //                 this.formUtils.alertaInactivo(tituloInactivo, res.mensaje);

    public eliminarFila(index: number, datosFila: PartidaPuInsertDto): void {

        // this.filas.removeAt(index);

        this.formUtils.confirmarInactivar("Eliminando Precio Unitario",
            `¿Desea eliminar el Precio Unitario con codigo ${datosFila.nro_partida} de la descripción ${datosFila.des_catalogo_tarea}?`,
            'Si, Eliminar').then(result => {

                if (!result.isConfirmed) return;

                // 2. Si el registro ya venía de la Base de Datos, lo borramos físicamente
                if (datosFila.nro_partida) {
                    const payload: EntradaEliminarPrecioUnitario = {
                        // cod_empresa: datosFila.cod_empresa,
                        // cod_empresa_unidad: datosFila.cod_empresa_unidad,
                        // cod_contrato: datosFila.cod_contrato,
                        // cod_catalogo_tarea: datosFila.cod_catalogo_tarea,
                        // cod_actividad: datosFila.cod_actividad,
                        nro_partida: datosFila.nro_partida
                    };

                    this.servioTransporteService.eliminarPartidaPu(payload).subscribe({
                        next: (res: EliminarRespuestaDto) => {
                            if (res.estado === 1) {
                                this.formUtils.alertaInactivo('Eliminación Satisfactoria', res.mensaje);
                                this.cargarEquiposPorFila();
                            } else {

                                this.formUtils.alertaInactivo('Eliminación Incorrecta', res.mensaje);

                            }
                        },
                        error: (err) => {
                            // Si cae en BadRequest (status 400), el objeto viene dentro de err.error
                            console.error('Error Controlado:');
                            console.error('Estado de Error:'); // 0

                            // 🔄 Reversión en la grilla si falló
                            // this.filas.insert(index, filaClonada);
                        }
                    })
                }

            })
        //     if (!result.isConfirmed) return;

    }

}
