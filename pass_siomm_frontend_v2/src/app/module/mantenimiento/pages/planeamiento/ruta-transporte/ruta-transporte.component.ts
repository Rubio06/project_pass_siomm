import { GrupoControlMant, NivelMant, ProcedenciaBalanzaMant, RutasTransporteFiltro, RutaTransporte, TipoLaborMant, UnidadEconomicaMant, VetaMant } from '../../../interfaces/manenimiento.interface';
import { Component, effect, inject, signal, OnInit, ViewChild } from '@angular/core';
import { MantenimientoService } from '../../../services/mantenimiento.service';
import { FiltroPlaneamientoService } from '../../../services/filtro-planeamiento.service';
import { LaborFiltro, LaborMant, ListZonas, MaestrosLabor, Nivel, PaginacionLabor, ResponseApi, ResponseEliminarDto, TipoLabor } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { PaginacionComponent } from '../../../../../shared/components/paginacion/paginacion.component';
import { AccionPlaneamientoService } from '../../../services/accion-planeamiento.service';
import { FormUtils } from '../../../../../utils/form-utils';

import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import Swal from 'sweetalert2';
import { DetalleRutaTransporteComponent } from './detalle-ruta-transporte/detalle-ruta-transporte.component';
import { ListaRutaTransporteComponent } from './lista-ruta-transporte/lista-ruta-transporte.component';

@Component({
    selector: 'app-tipo-ruta-transporte',
    imports: [CommonModule, ReactiveFormsModule, DetalleRutaTransporteComponent, ListaRutaTransporteComponent, NavBarComponent],
    templateUrl: './ruta-transporte.component.html',
    styleUrl: './ruta-transporte.component.css',
})
export class RutaTransporteComponent implements OnInit {
    // =====================================================
    // INYECCIONES
    // =====================================================
    private fb = inject(FormBuilder);
    public mantenimientoService = inject(MantenimientoService);
    public filtroService = inject(FiltroPlaneamientoService);
    public accionService = inject(AccionPlaneamientoService);

    // =====================================================
    // UTILIDADES
    // =====================================================
    public formUtils = FormUtils;

    // =====================================================
    // SIGNALS / ESTADO
    // =====================================================
    public listRutaTransporte = signal<RutaTransporte[]>([]);
    public idNivelSeleccionada = signal<string | null>(null);
    public tabActivo = signal<string>('lista');
    public isLoading = signal(false);
    public _listZonasMant = signal<ListZonas[]>([]);
    public totalRegistros = signal(0);
    public totalPaginas = signal(0);
    public listRutaTransporteRecibida = signal<RutaTransporte | null>(null);
    public modoFormulario = signal<'NUEVO' | 'EDITAR'>('NUEVO');
    public codigoRutaTransporte = signal<string>('');
    // Signals para Maestros
    public listUnidadEconomica = signal<UnidadEconomicaMant[]>([]);
    public listVetas = signal<VetaMant[]>([]);
    // public listNivel = signal<NivelMant[]>([]);
    // public listTipoLabor = signal<TipoLaborMant[]>([]);
    public listProcBalanza = signal<ProcedenciaBalanzaMant[]>([]);
    public listGrupoControl = signal<GrupoControlMant[]>([]);

    // =====================================================
    // FORMULARIO Y ENLACES UI
    // =====================================================
    public form!: FormGroup;
    public laborEnEdicion: LaborMant | null = null;

    @ViewChild('rutaTransporteDetalle') detalleLaborComponent!: DetalleRutaTransporteComponent;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================
    constructor() {
        // Efecto para reaccionar a acciones globales del navbar/toolbar
        effect(() => {
            const accion = this.accionService.accion();

            switch (accion) {
                case 'editar':
                    this.actualizarBloqueos(false, false, true);
                    this.accionService.emitir('');
                    break;

                case 'nuevo':
                    this.listRutaTransporteRecibida.set(null);
                    this.tabActivo.set('detalle');
                    this.obtenerCodigoRutaTransporte();
                    this.accionService.emitir('');
                    break;
            }
        });

        // Efecto para controlar bloqueos nativos según la pestaña activa
        effect(() => {
            if (this.tabActivo() === 'lista') {
                this.actualizarBloqueos(false, true, true);
            }
        });
    }

    // =====================================================
    // CICLO DE VIDA
    // =====================================================
    ngOnInit(): void {
        this.inicializarFormulario();
        this.actualizarBloqueos(false, true, true);
        // this.cargarMaestros();
        this.listarZonasMant();

        // 🚀 Optimización: Escuchamos cambios de zona de manera reactiva en un solo lugar
        // this.form.get('cod_zona')?.valueChanges.subscribe(valor => {
        //     this.cargarNivel(valor);
        // });

        this.cargarRutaTransporte();

        this.obtenerCodigoRutaTransporte();
    }

    // =====================================================
    // GETTERS
    // =====================================================
    get laborArray(): FormArray {
        return this.form.get('labor') as FormArray;
    }

    public get paginaActual(): number {
        return this.form.get('pagina')?.value ?? 1;
    }

    // =====================================================
    // INICIALIZADORES
    // =====================================================
    private inicializarFormulario(): void {
        this.form = this.fb.group({
            cod_empresa: ['03'],
            cod_empresa_unidad: ['01'],
            cod_zona: ['01'],
            texto_busqueda: [''],
            pagina: [1],
            cantidad_reg: [20],
            labor: this.fb.array([])
        });
    }

    // =====================================================
    // MÉTODOS HTTP / DATA
    // =====================================================
    public listarZonasMant(): void {
        this.isLoading.set(true);
        this.laborArray.clear();
        const filtro = this.form.getRawValue();

        this.mantenimientoService
            .listarZonasMant(filtro.cod_empresa, filtro.cod_empresa_unidad)
            .subscribe({
                next: (resp: ListZonas[]) => {
                    this._listZonasMant.set(resp);

                },
                error: (err) => {
                    console.error(err);
                    this.isLoading.set(false);
                }
            });
    }

    public cargarRutaTransporte(): void {
        this.isLoading.set(true);
        this.laborArray.clear();
        const filtro = this.form.getRawValue();

        const payload: RutasTransporteFiltro = {
            cod_empresa: filtro.cod_empresa,
            cod_empresa_unidad: filtro.cod_empresa_unidad,
            texto_busqueda: filtro.texto_busqueda,
        };


        this.mantenimientoService
            .obtenerRutasTransporte(payload)
            .subscribe({
                next: (resp: RutaTransporte[]) => {
                    this.listRutaTransporte.set(resp);
                    // this.totalRegistros.set(resp.totalRegistros);
                    // this.totalPaginas.set(resp.totalPaginas);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading.set(false);
                }
            });
    }

    public obtenerCodigoRutaTransporte() {
        this.mantenimientoService.obtenerCodigoRutaTransporte().subscribe({
            next: (resp) => {
                // console.log('Zonas:', resp);
                this.codigoRutaTransporte.set(resp)
                console.log('el codigo nes ' + this.codigoRutaTransporte())
            },
            error: (err) => {
                console.error('Error al cargar zonas:', err);
            }
        })
    }

    // =====================================================
    // EVENTOS UI / NAVEGACIÓN
    // =====================================================
    public intentarSalirADetalle(): void {
        let tieneDatosPendientes = false;

        // 1. Asomarnos al formulario interno del componente Hijo
        if (this.tabActivo() === 'detalle' && this.detalleLaborComponent?.miFormulario) {
            const valoresHijo = this.detalleLaborComponent.miFormulario.value;

            // 2. Evaluamos quirúrgicamente si escribió data real ignorando campos por defecto si aplica
            tieneDatosPendientes = !!(
                (valoresHijo.cod_ruta?.trim()) ||
                (valoresHijo.des_ruta?.trim()) ||
                (valoresHijo.des_ruta_abrev?.trim()) ||
                (valoresHijo.cod_zona?.trim()) ||
                (valoresHijo.ind_tipo_tolcanc?.trim()) ||
                (valoresHijo.flg_vigente?.trim())

            );
        }

        // 3. Interrupción con SweetAlert o escape limpio
        if (tieneDatosPendientes) {
            this.formUtils.confirmarAnulacion(
                'Cambios sin guardar',
                '¿Está seguro de que desea salir del formulario? Perderá los cambios no guardados.',
                'Sí, salir',
                'No, quedarme'
            ).then(result => {
                if (result.isConfirmed) {
                    this.tabActivo.set('lista');
                }
            });
        } else {
            this.tabActivo.set('lista');
        }
    }

    public onRutaTransporteSeleccionada(rutaTransporte: RutaTransporte): void {
        this.listRutaTransporteRecibida.set(rutaTransporte);
        this.idNivelSeleccionada.set(rutaTransporte.cod_ruta ?? '');
        this.accionService.emitir('editar');
        this.tabActivo.set('detalle');
    }

    public onGuardar(tipoLaborRecibido: RutaTransporte): void {
        const payload: RutaTransporte[] = [{
            ...tipoLaborRecibido,
        }];

        const esNuevoRegistro = tipoLaborRecibido.accion === 'I';
        const tituloConfirmacion = esNuevoRegistro ? 'Nuevo Registro' : 'Actualizar Registro';
        const mensajeConfirmacion = esNuevoRegistro
            ? `¿Desea crear la ruta de trasnporte minero ${tipoLaborRecibido.cod_ruta}?`
            : `¿Desea editar la ruta de transporte minero ${tipoLaborRecibido.cod_ruta}?`;

        this.formUtils.confirmarAnulacion(tituloConfirmacion, mensajeConfirmacion, 'Sí, confirmar', 'No, Cancelar')
            .then(result => {
                if (result.isConfirmed) {
                    this.isLoading.set(true);

                    this.mantenimientoService.guardarRutaTrasnporte(payload).subscribe({
                        next: (resp: ResponseApi) => {
                            this.isLoading.set(false);

                            if (resp.estado === 1) {
                                this.formUtils.alertaExitoAnulacion('Guardar ruta transporte', resp.mensaje);
                                this.idNivelSeleccionada.set(tipoLaborRecibido.cod_ruta ?? '');
                                this.cargarRutaTransporte(); // Sincroniza la grilla inmediatamente
                                this.actualizarBloqueos(true, false, true);
                                this.tabActivo.set('lista');
                            } else if (resp.estado === 0) {

                                this.formUtils.alertaErrorAnulacion('Existe un error', resp.mensaje);
                                this.actualizarBloqueos(false, false, true);
                            }
                        },
                        error: (err) => {
                            this.isLoading.set(false);
                            this.formUtils.alertaErrorAnulacion('Error de comunicación', 'No se pudo conectar con el servidor.');
                            console.error(err);
                        }
                    });
                }
            });
    }


    public onEliminar(grupo: RutaTransporte): void {
        // 1. Validamos el estado actual mapeando la columna 'act' de la base de datos
        // Si guarda 'S' / 'N', evaluamos contra 'S'. Si guarda 'ACT' / 'INA', evaluamos contra 'ACT'.
        const esActivo = grupo.flg_vigente === 1;

        const tituloModal = esActivo ? 'Inactivar Registro' : 'Activar Registro';

        const tituloInactivo = esActivo ? 'Registro Inactivado' : 'Registro Activado';
        const textoBotonConfirmar = esActivo ? 'Sí, Inactivar' : 'Sí, Activar';
        const preguntaModal = esActivo
            ? `¿Desea inactivar la ruta transporte ${grupo.des_ruta}?`
            : `¿Desea activar la ruta transporte ${grupo.des_ruta}?`;


        // 2. Lanzamos la confirmación con los títulos y preguntas inteligentes
        this.formUtils.confirmarInactivar(tituloModal, preguntaModal, textoBotonConfirmar).then(result => {
            if (!result.isConfirmed) return;

            // 3. Ejecutamos el servicio pasándole el código de la ruta convertido a string
            this.mantenimientoService.eliminarRutaTransporte(grupo.cod_ruta!.toString()).subscribe({
                next: (res: ResponseEliminarDto) => {
                    if (res.estado === 1) {
                        // Muestra el mensaje dinámico que viene del SP ('fue inactivada...' o 'fue activada...')
                        this.formUtils.alertaInactivo(tituloInactivo, res.mensaje);

                        // Recargamos la grilla para actualizar los botones (verde/rojo) y badges en la tabla
                        this.cargarRutaTransporte();

                        this.actualizarBloqueos(false, true, false);
                        this.idNivelSeleccionada.set(grupo.cod_ruta);
                    }
                    else if (res.estado === 0) {
                        this.formUtils.alertaNoEliminadoMensaje(res.mensaje);
                    }
                    else if (res.estado === -1) {
                        this.formUtils.mensajeError(res.mensaje);
                    }
                },
                error: (err) => {
                    this.formUtils.mensajeError('Error en el servidor');
                    console.error(err);
                }
            });
        });
    }

    // =====================================================
    // HELPERS / LIMPIEZA
    // =====================================================
    public onLimpiarFormulario(): void {
        this.form.patchValue({
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            texto_busqueda: ''
        });
        this.actualizarBloqueos(false, true, false);
        this.cargarRutaTransporte();
    }

    public keBuscar(): void {
        this.cargarRutaTransporte();
    }

    private actualizarBloqueos(nuevo: boolean, guardar: boolean, editar: boolean): void {
        this.accionService.setBloqueos({ nuevo, guardar, editar });
    }

    public onPaginaCambio(pagina: number): void {
        this.form.patchValue({ pagina });
        this.cargarRutaTransporte();
    }




}
