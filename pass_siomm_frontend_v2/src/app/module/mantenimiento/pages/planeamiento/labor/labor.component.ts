import { GrupoControlMant, NivelMant, ProcedenciaBalanzaMant, TipoLaborMant, UnidadEconomicaMant, VetaMant } from '../../../interfaces/manenimiento.interface';
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
import { DetalleLaborComponent } from './detalle-labor/detalle-labor.component';
import { ListaLaborComponent } from './lista-labor/lista-labor.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-labor',
    imports: [CommonModule, ReactiveFormsModule, PaginacionComponent, DetalleLaborComponent, ListaLaborComponent, NavBarComponent],
    templateUrl: './labor.component.html',
    styleUrl: './labor.component.css',
})
export class LaborComponent implements OnInit {
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
    public listLabor = signal<LaborMant[]>([]);
    public idLaborSeleccionada = signal<string | null>(null);
    public tabActivo = signal<string>('lista');
    public isLoading = signal(false);
    public _listZonasMant = signal<ListZonas[]>([]);
    public totalRegistros = signal(0);
    public totalPaginas = signal(0);
    public listLaborRecibida = signal<LaborMant | null>(null);
    public modoFormulario = signal<'NUEVO' | 'EDITAR'>('NUEVO');

    // Signals para Maestros
    public listUnidadEconomica = signal<UnidadEconomicaMant[]>([]);
    public listVetas = signal<VetaMant[]>([]);
    public listNivel = signal<NivelMant[]>([]);
    public listTipoLabor = signal<TipoLaborMant[]>([]);
    public listProcBalanza = signal<ProcedenciaBalanzaMant[]>([]);
    public listGrupoControl = signal<GrupoControlMant[]>([]);

    // =====================================================
    // FORMULARIO Y ENLACES UI
    // =====================================================
    public form!: FormGroup;
    public laborEnEdicion: LaborMant | null = null;

    @ViewChild('detalleLabor') detalleLaborComponent!: DetalleLaborComponent;

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
                    this.listLaborRecibida.set(null);
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
        this.cargarMaestros();
        this.listarZonasMant();

        // 🚀 Optimización: Escuchamos cambios de zona de manera reactiva en un solo lugar
        this.form.get('cod_zona')?.valueChanges.subscribe(valor => {
            this.cargarLabor(valor);
        });
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
                    if (resp.length > 0) {
                        this.cargarLabor(resp[0].cod_zona);
                    }
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading.set(false);
                }
            });
    }

    public cargarLabor(valor?: string | null, texto_busqueda?: string | null): void {
        this.isLoading.set(true);
        this.laborArray.clear();
        const form = this.form.getRawValue();

        const filtros: LaborFiltro = {
            cod_empresa: form.cod_empresa,
            cod_empresa_unidad: form.cod_empresa_unidad,
            cod_zona: valor ?? form.cod_zona,
            texto_busqueda: texto_busqueda ?? form.texto_busqueda,
            pagina: form.pagina,
            cantidad_reg: form.cantidad_reg,
        };

        this.mantenimientoService
            .obtenerLabor(filtros)
            .subscribe({
                next: (resp: PaginacionLabor) => {
                    this.listLabor.set(resp.data);
                    this.totalRegistros.set(resp.totalRegistros);
                    this.totalPaginas.set(resp.totalPaginas);
                    this.isLoading.set(false);
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading.set(false);
                }
            });
    }

    public cargarMaestros(): void {
        const form = this.form.getRawValue();

        this.mantenimientoService
            .obtenerMaestrosLabor(form.cod_empresa, form.cod_empresa_unidad)
            .subscribe({
                next: (resp: MaestrosLabor) => {
                    this.listUnidadEconomica.set(resp.unidadEconomica);
                    this.listVetas.set(resp.vetas);
                    this.listNivel.set(resp.niveles);
                    this.listTipoLabor.set(resp.tipoLabor);
                    this.listProcBalanza.set(resp.procedenciaBalanza);
                    this.listGrupoControl.set(resp.grupoControl);
                },
                error: (err) => console.error(err)
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
                (valoresHijo.cod_labor?.trim()) ||
                (valoresHijo.nom_labor?.trim()) ||
                (valoresHijo.des_labor?.trim()) ||
                (valoresHijo.cod_und_econom?.trim()) ||
                (valoresHijo.cod_veta?.trim()) ||
                (valoresHijo.cod_nivel?.trim()) ||
                (valoresHijo.cod_tipo_labor?.trim()) ||
                (valoresHijo.ind_tipo_labor?.trim()) ||
                (valoresHijo.cod_proced_blza?.trim()) ||
                (valoresHijo.cod_grupo_control?.trim())
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

    public onLaborSeleccionada(labor: LaborMant): void {
        this.listLaborRecibida.set(labor);
        this.idLaborSeleccionada.set(labor.cod_labor);
        this.accionService.emitir('editar');
        this.tabActivo.set('detalle');
    }

    public onGuardar(laborRecibido: LaborMant): void {
        const payload: LaborMant[] = [{
            ...laborRecibido,
            cod_zona: this.form.get('cod_zona')?.value
        }];

        const esNuevoRegistro = laborRecibido.accion === 'I';
        const tituloConfirmacion = esNuevoRegistro ? 'Nuevo Registro' : 'Actualizar Registro';
        const mensajeConfirmacion = esNuevoRegistro
            ? `¿Desea crear la labor minera ${laborRecibido.cod_labor}?`
            : `¿Desea editar la labor minera ${laborRecibido.cod_labor}?`;

        this.formUtils.confirmarAnulacion(tituloConfirmacion, mensajeConfirmacion, 'Sí, confirmar', 'No, Cancelar')
            .then(result => {
                if (result.isConfirmed) {
                    this.isLoading.set(true);

                    this.mantenimientoService.guardarLabor(payload).subscribe({
                        next: (resp: ResponseApi) => {
                            this.isLoading.set(false);

                            if (resp.estado === 1) {
                                this.formUtils.alertaExitoAnulacion('Guardar la Labor', resp.mensaje);
                                this.idLaborSeleccionada.set(laborRecibido.cod_labor);
                                this.cargarLabor(); // Sincroniza la grilla inmediatamente
                                this.actualizarBloqueos(true, false, true);
                                this.tabActivo.set('lista');
                            } else if (resp.estado === - 1) {

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

    public onEliminar(grupo: LaborMant): void {

        const esActivo = grupo.est_labor === 'ACT';

        const tituloModal = esActivo ? 'Inactivar Registro' : 'Activar Registro';

        const tituloInactivo = esActivo ? 'Registro Inactivado' : 'Registro Activado';
        const textoBotonConfirmar = esActivo ? 'Sí, Inactivar' : 'Sí, Activar';
        const preguntaModal = esActivo
            ? `¿Desea inactivar la labor ${grupo.des_labor}?`
            : `¿Desea activar la labor ${grupo.des_labor}?`;

    
        this.formUtils.confirmarInactivar(tituloModal, preguntaModal, textoBotonConfirmar).then(result => {
            if (!result.isConfirmed) return;

            // 3. Ejecutamos el servicio pasándole el objeto completo
            this.mantenimientoService.eliminarLabor(grupo).subscribe({
                next: (res: ResponseEliminarDto) => {
                    // Ajustamos a 'res.estado === 1' para mantener la estandarización estricta numérica
                    if (res.estado === 1) {
                        this.formUtils.alertaInactivo(tituloInactivo, res.mensaje);

                        // Recargamos la grilla para refrescar los componentes visuales (badges/botones)
                        this.cargarLabor();

                        this.actualizarBloqueos(false, true, false);
                        this.idLaborSeleccionada.set(grupo.cod_labor);

                    } else if (res.estado === 0) {
                        this.formUtils.alertaNoEliminadoMensaje(res.mensaje);
                    } else if (res.estado === -1) {
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
        this.cargarLabor();
    }

    public keBuscar(): void {
        const texto = this.form.get('texto_busqueda')?.value;
        this.cargarLabor(undefined, texto);
    }

    private actualizarBloqueos(nuevo: boolean, guardar: boolean, editar: boolean): void {
        this.accionService.setBloqueos({ nuevo, guardar, editar });
    }

    public onPaginaCambio(pagina: number): void {
        this.form.patchValue({ pagina });
        this.cargarLabor();
    }


}
