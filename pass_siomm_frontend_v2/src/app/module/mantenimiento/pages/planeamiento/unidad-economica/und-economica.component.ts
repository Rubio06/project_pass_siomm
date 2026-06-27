import { GrupoControlMant, NivelMant, ProcedenciaBalanzaMant, TipoLaborMant, UnidadEconomica, UnidadEconomicaMant, UsuarioJefeTurno, Veta, VetaMant, Zona } from '../../../interfaces/manenimiento.interface';
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
import { DetalleUndEconomicaComponent } from './detalle-und-economica/detalle-und-economica.component';
import { ListaUndEconomicaComponent } from './lista-und-economica/lista-und-economica.component';

@Component({
    selector: 'app-und-economica',
    imports: [CommonModule, ReactiveFormsModule, DetalleUndEconomicaComponent, ListaUndEconomicaComponent, NavBarComponent],
    templateUrl: './und-economica.component.html',
    styleUrl: './und-economica.component.css',
})
export class UndEconomicaComponent implements OnInit {
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
    public listZona = signal<Zona[]>([]);


    public idNivelSeleccionada = signal<string | null>(null);
    public tabActivo = signal<string>('lista');
    public isLoading = signal(false);
    public _listZonasMant = signal<ListZonas[]>([]);
    public totalRegistros = signal(0);
    public totalPaginas = signal(0);
    public listUndEconomicaRecibida = signal<UnidadEconomicaMant | null>(null);
    public modoFormulario = signal<'NUEVO' | 'EDITAR'>('NUEVO');

    // Signals para Maestros
    public listUnidadEconomica = signal<UnidadEconomicaMant[]>([]);
    public listUsuario = signal<UsuarioJefeTurno[]>([]);
    public listProcBalanza = signal<ProcedenciaBalanzaMant[]>([]);
    public listGrupoControl = signal<GrupoControlMant[]>([]);
    public codigoSiguiente = signal<string>('');
    // =====================================================
    // FORMULARIO Y ENLACES UI
    // =====================================================
    public form!: FormGroup;
    public laborEnEdicion: LaborMant | null = null;

    @ViewChild('detalleUndEconom') detalleUndEconomComponent!: DetalleUndEconomicaComponent;

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
                    this.listUndEconomicaRecibida.set(null);
                    this.obtenerCodigo();
                    this.tabActivo.set('detalle');
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
        // this.listarZonasMant();

        // 🚀 Optimización: Escuchamos cambios de zona de manera reactiva en un solo lugar
        // this.form.get('cod_zona')?.valueChanges.subscribe(valor => {
        //     this.cargarNivel(valor);
        // });
        this.listarZonasMant();
        // this.cargarMaestros();
        this.cargarUndEconomica();
        this.obtenerCodigo();
        this.cargarUsuario();
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
    // public listarZonasMant(): void {
    //     this.isLoading.set(true);
    //     this.laborArray.clear();
    //     const filtro = this.form.getRawValue();

    //     this.mantenimientoService
    //         .listarZonasMant(filtro.cod_empresa, filtro.cod_empresa_unidad)
    //         .subscribe({
    //             next: (resp: ListZonas[]) => {
    //                 this._listZonasMant.set(resp);
    //                 if (resp.length > 0) {
    //                     this.cargarNivel(resp[0].cod_zona);
    //                 }
    //             },
    //             error: (err) => {
    //                 console.error(err);
    //                 this.isLoading.set(false);
    //             }
    //         });
    // }

    // public cargarMaestros(): void {
    //     const form = this.form.getRawValue();

    //     this.mantenimientoService
    //         .obtenerMaestrosLabor(form.cod_empresa, form.cod_empresa_unidad)
    //         .subscribe({
    //             next: (resp: MaestrosLabor) => {
    //                 this.listUnidadEconomica.set(resp.unidadEconomica);
    //             },
    //             error: (err) => console.error(err)
    //         });
    // }

    public cargarUsuario(): void {
        const form = this.form.getRawValue();

        this.mantenimientoService
            .ObtenerUsuariosJefeTurno()
            .subscribe({
                next: (resp: UsuarioJefeTurno[]) => {
                    this.listUsuario.set(resp);
                },
                error: (err) => console.error(err)
            });
    }

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
    public cargarUndEconomica(): void {
        this.isLoading.set(true);
        this.laborArray.clear();
        const filtro = this.form.getRawValue();


        this.mantenimientoService
            .obtenerUndEconomica(filtro.cod_empresa,
                filtro.cod_empresa_unidad,
                filtro.texto_busqueda)
            .subscribe({
                next: (resp: UnidadEconomicaMant[]) => {

                    this.listUnidadEconomica.set(resp);
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

    private obtenerCodigo() {
        this.mantenimientoService.obtenerCodigoSiguiente().subscribe({
            next: (codigo: string) => {
                // this.form.patchValue({ cod_zona: String(codigo) });

                this.codigoSiguiente.set(codigo);
            }

        })

    }

    // =====================================================
    // EVENTOS UI / NAVEGACIÓN
    // =====================================================
    public intentarSalirADetalle(): void {
        let tieneDatosPendientes = false;

        // 1. Asomarnos al formulario interno del componente Hijo
        if (this.tabActivo() === 'detalle' && this.detalleUndEconomComponent.miFormulario) {
            const valoresHijo = this.detalleUndEconomComponent.miFormulario.value;

            // 2. Evaluamos quirúrgicamente si escribió data real ignorando campos por defecto si aplica
            tieneDatosPendientes = !!(
                (valoresHijo.cod_und_econom?.trim()) ||
                (valoresHijo.nom_und_econom?.trim()) ||
                (valoresHijo.desc_und_econom?.trim()) ||
                (valoresHijo.cod_und_econom_dhlogger?.toString().trim()) ||        // 👈 number necesita toString()
                (valoresHijo.ind_act?.trim())
            );
        }

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

    public onUndEconomicaSeleccionada(und: UnidadEconomicaMant): void {
        this.listUndEconomicaRecibida.set(und);

        // this.idNivelSeleccionada.set(`${zona.cod_veta}-${zona.cod_zona}-${zona.cod_und_econom}`);
        this.idNivelSeleccionada.set(und.cod_und_econom!);

        this.accionService.emitir('editar');
        this.tabActivo.set('detalle');
    }

    public onGuardar(undRecibida: UnidadEconomicaMant): void {
        const payload: UnidadEconomicaMant[] = [{
            ...undRecibida,
        }];

        const esNuevoRegistro = undRecibida.accion === 'I';
        const tituloConfirmacion = esNuevoRegistro ? 'Nuevo Registro' : 'Actualizar Registro';
        const mensajeConfirmacion = esNuevoRegistro
            ? `¿Desea crear la unidad económica ${undRecibida.des_und_econom}?`
            : `¿Desea editar la unidad económica ${undRecibida.des_und_econom}?`;

        this.formUtils.confirmarAnulacion(tituloConfirmacion, mensajeConfirmacion, 'Sí, confirmar', 'No, Cancelar')
            .then(result => {
                if (result.isConfirmed) {
                    this.isLoading.set(true);

                    this.mantenimientoService.guardarUndEconomica(payload).subscribe({
                        next: (resp: ResponseApi) => {
                            this.isLoading.set(false);

                            if (resp.estado === 1) {
                                this.formUtils.alertaExitoAnulacion('Guardar la Unidad Económica', resp.mensaje);
                                // ${zonaRecibida.cod}-${zonaRecibida.cod_zona}-${zonaRecibida.cod_und_econom}`
                                this.idNivelSeleccionada.set(undRecibida.cod_und_econom!);
                                this.cargarUndEconomica(); // Sincroniza la grilla inmediatamente
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

    public onEliminar(grupo: UnidadEconomicaMant): void {

        const esActivo = grupo.ind_act === 'S';

        const tituloModal = esActivo ? 'Inactivar Registro' : 'Activar Registro';

        const tituloInactivo = esActivo ? 'Registro Inactivado' : 'Registro Activado';
        const textoBotonConfirmar = esActivo ? 'Sí, Inactivar' : 'Sí, Activar';
        const preguntaModal = esActivo
            ? `¿Desea inactivar la unidad económica ${grupo.des_und_econom}?`
            : `¿Desea activar la unidad económica ${grupo.des_und_econom}?`;

        this.formUtils.confirmarInactivar(tituloModal, preguntaModal, textoBotonConfirmar).then(result => {
            if (!result.isConfirmed) return;

            this.mantenimientoService.eliminarUnidadEconomica('03', '01', grupo.cod_und_econom!).subscribe({
                next: (res: ResponseEliminarDto) => {
                    if (res.estado === 1) {
                        this.formUtils.alertaInactivo(tituloInactivo, res.mensaje);

                        this.cargarUndEconomica();

                        this.actualizarBloqueos(false, true, false);
                        this.idNivelSeleccionada.set(grupo.cod_und_econom!);
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
        this.cargarUndEconomica();
    }

    public keBuscar(): void {
        this.cargarUndEconomica();
    }

    private actualizarBloqueos(nuevo: boolean, guardar: boolean, editar: boolean): void {
        this.accionService.setBloqueos({ nuevo, guardar, editar });
    }

    public onPaginaCambio(pagina: number): void {
        this.form.patchValue({ pagina });
        this.cargarUndEconomica();
    }


}
