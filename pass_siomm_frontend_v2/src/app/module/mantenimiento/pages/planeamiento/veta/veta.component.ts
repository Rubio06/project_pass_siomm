import { GrupoControlMant, NivelMant, ProcedenciaBalanzaMant, TipoLaborMant, UnidadEconomicaMant, Veta, VetaMant } from '../../../interfaces/manenimiento.interface';
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
import { DetalleVetaComponent } from './detalle-veta/detalle-veta.component';
import { ListaVetaComponent } from './lista-veta/lista-veta.component';

@Component({
    selector: 'app-veta',
    imports: [CommonModule, ReactiveFormsModule, DetalleVetaComponent, ListaVetaComponent, NavBarComponent],
    templateUrl: './veta.component.html',
    styleUrl: './veta.component.css',
})
export class VetaComponent implements OnInit {
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
    public listVeta = signal<Veta[]>([]);


    public idNivelSeleccionada = signal<string | null>(null);
    public tabActivo = signal<string>('lista');
    public isLoading = signal(false);
    public _listZonasMant = signal<ListZonas[]>([]);
    public totalRegistros = signal(0);
    public totalPaginas = signal(0);
    public listVetaRecibida = signal<Veta | null>(null);
    public modoFormulario = signal<'NUEVO' | 'EDITAR'>('NUEVO');

    // Signals para Maestros
    public listUnidadEconomica = signal<UnidadEconomicaMant[]>([]);
    // public listVetas = signal<Veta[]>([]);
    // public listNivel = signal<NivelMant[]>([]);
    // public listTipoLabor = signal<TipoLaborMant[]>([]);
    public listProcBalanza = signal<ProcedenciaBalanzaMant[]>([]);
    public listGrupoControl = signal<GrupoControlMant[]>([]);

    // =====================================================
    // FORMULARIO Y ENLACES UI
    // =====================================================
    public form!: FormGroup;
    public laborEnEdicion: LaborMant | null = null;

    @ViewChild('detalleVeta') detalleLaborComponent!: DetalleVetaComponent;

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
                    this.listVetaRecibida.set(null);
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
        this.cargarMaestros();
        this.cargarVeta();
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

    public cargarMaestros(): void {
        const form = this.form.getRawValue();

        this.mantenimientoService
            .obtenerMaestrosLabor(form.cod_empresa, form.cod_empresa_unidad)
            .subscribe({
                next: (resp: MaestrosLabor) => {
                    this.listUnidadEconomica.set(resp.unidadEconomica);
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
    public cargarVeta(): void {
        this.isLoading.set(true);
        this.laborArray.clear();
        const filtro = this.form.getRawValue();


        this.mantenimientoService
            .obtenerVeta(filtro.cod_empresa,
                filtro.cod_empresa_unidad,
                filtro.texto_busqueda)
            .subscribe({
                next: (resp: Veta[]) => {
                    this.listVeta.set(resp);
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
                (valoresHijo.cod_und_econom?.trim()) ||
                (valoresHijo.cod_veta?.trim()) ||

                (valoresHijo.cod_zona?.trim()) ||
                (valoresHijo.nom_veta?.trim()) ||
                (valoresHijo.ind_veta?.trim()) ||
                (valoresHijo.des_veta?.trim()) ||
                (valoresHijo.nro_den?.trim()) ||
                (valoresHijo.cod_veta_dhlogger?.trim()) ||
                (valoresHijo.est_veta?.trim()) ||
                (valoresHijo.des_veta?.trim())
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

    public onVetaSeleccionada(veta: Veta): void {
        this.listVetaRecibida.set(veta);

        this.idNivelSeleccionada.set(`${veta.cod_veta}-${veta.cod_zona}-${veta.cod_und_econom}`);

        this.accionService.emitir('editar');
        this.tabActivo.set('detalle');
    }

    public onGuardar(vetaRecibida: Veta): void {
        const payload: Veta[] = [{
            ...vetaRecibida,
        }];

        const esNuevoRegistro = vetaRecibida.accion === 'I';
        const tituloConfirmacion = esNuevoRegistro ? 'Nuevo Registro' : 'Actualizar Registro';
        const mensajeConfirmacion = esNuevoRegistro
            ? `¿Desea crear el tipo de labor minero ${vetaRecibida.cod_veta}?`
            : `¿Desea editar el tipo de labor minero minero ${vetaRecibida.cod_veta}?`;

        this.formUtils.confirmarAnulacion(tituloConfirmacion, mensajeConfirmacion, 'Sí, confirmar', 'No, Cancelar')
            .then(result => {
                if (result.isConfirmed) {
                    this.isLoading.set(true);

                    this.mantenimientoService.guardarVeta(payload).subscribe({
                        next: (resp: ResponseApi) => {
                            this.isLoading.set(false);

                            if (resp.estado === 1) {
                                this.formUtils.alertaExitoAnulacion('Guardar la veta', resp.mensaje);

                                this.idNivelSeleccionada.set(`${vetaRecibida.cod_veta}-${vetaRecibida.cod_zona}-${vetaRecibida.cod_und_econom}`);
                                this.cargarVeta(); // Sincroniza la grilla inmediatamente
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

    public onEliminar(grupo: Veta): void {

        const esActivo = grupo.est_veta === 'ACT';

        const tituloModal = esActivo ? 'Inactivar Registro' : 'Activar Registro';

        const tituloInactivo = esActivo ? 'Registro Inactivado' : 'Registro Activado';
        const textoBotonConfirmar = esActivo ? 'Sí, Inactivar' : 'Sí, Activar';
        const preguntaModal = esActivo
            ? `¿Desea inactivar la veta ${grupo.des_veta}?`
            : `¿Desea activar la veta ${grupo.des_veta}?`;

        this.formUtils.confirmarInactivar(tituloModal, preguntaModal, textoBotonConfirmar).then(result => {
            if (!result.isConfirmed) return;

            this.mantenimientoService.eliminarVeta(grupo.cod_veta!, grupo.cod_zona!, grupo.cod_und_econom!).subscribe({
                next: (res: ResponseEliminarDto) => {
                    if (res.estado === 1) {
                        this.formUtils.alertaInactivo(tituloInactivo, res.mensaje);

                        this.cargarVeta();

                        this.actualizarBloqueos(false, true, false);
                        this.idNivelSeleccionada.set(`${grupo.cod_veta}-${grupo.cod_zona}-${grupo.cod_und_econom}`);
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
        this.cargarVeta();
    }

    public keBuscar(): void {
        this.cargarVeta();
    }

    private actualizarBloqueos(nuevo: boolean, guardar: boolean, editar: boolean): void {
        this.accionService.setBloqueos({ nuevo, guardar, editar });
    }

    public onPaginaCambio(pagina: number): void {
        this.form.patchValue({ pagina });
        this.cargarVeta();
    }


}
