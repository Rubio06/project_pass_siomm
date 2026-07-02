import { AfterViewInit, Component, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';

import { FiltrosContratoComponent } from '../../components/filtros-contrato/filtros-contrato.component';
import { TablaContratoComponent } from '../../components/tabla-contrato/tabla-contrato.component';
import { AccionPlaneamientoService } from '../../../../../services/accion-planeamiento.service';
import { BotonesComponent } from 'src/app/shared/components/botones/botones.component';
import { TituloModuloComponent } from 'src/app/shared/components/filtros-generales-selects/titulo-modulo/titulo-modulo.component';
import { CommonModule } from '@angular/common';
import { MantenimientoService } from '../../../../../services/mantenimiento.service';
import { AprobarContratoRequest, ContratoDetalleResponse, EliminarContratoRequest, GenericResponseDTO, RespuestaCodigo, ServicoTransporte } from '../../interfaces/adm-contrato.interface';
import { AdmContratosServvice } from '../../services/adm-contratos.service';
import { ServicioTransporteComponent } from '../../components/servicio-transporte/servicio-transporte.component';
import { FormUtils } from 'src/app/utils/form-utils';
import { ReporteComponent } from '../../components/reporte/reporte.component';

@Component({
    selector: 'app-adm-contratos',
    imports: [FiltrosContratoComponent, TablaContratoComponent, BotonesComponent, CommonModule, ServicioTransporteComponent, ReporteComponent],
    templateUrl: './lista-adm-contratos.component.html',
    styleUrl: './lista-adm-contratos.component.css',

})
export class AdmContratosComponent implements OnInit, AfterViewInit {

    // ─── Injects ───────────────────────────────────────────────
    public accionService = inject(AccionPlaneamientoService);
    private mantService = inject(AdmContratosServvice);

    // ─── ViewChilds ────────────────────────────────────────────
    @ViewChild(FiltrosContratoComponent)
    filtrosComponent!: FiltrosContratoComponent;
    hijoTablaContrato = viewChild(TablaContratoComponent);

    reporteContratosComponent = viewChild<ReporteComponent>('reporte');


    // ─── Signals ───────────────────────────────────────────────
    isLoading = signal<boolean>(false);
    botoPresionado = signal<string>('');
    botoColor = signal<string>('');
    listContrato = signal<ContratoDetalleResponse[]>([]);
    abrirModal = signal<boolean>(false);
    modo = signal<'nuevo' | 'visualizar' | null>(null);
    obServicioTransporte = signal<ContratoDetalleResponse | null>(null);
    contratoSiguiente = signal<string>('');
    private formUtils = FormUtils;

    // ─── Lifecycle ─────────────────────────────────────────────
    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.listarAdmContrato();
    }

    // ─── Acciones de botones ───────────────────────────────────
    public onAccion(tipo: string): void {
        const acciones: Record<string, () => void> = {
            refrescar: () => {
                this.setBoton('Refrescar Información', 'bg-[#0369a1]');
                this.listContrato.set([]);
                this.isLoading.set(true);
                this.listarAdmContrato();
                this.accionService.emitirAdmContrato('refrescar');
            },
            nuevo: () => {
                this.setBoton('Nuevo Registro', 'bg-[#047857]');
                this.accionService.emitirAdmContrato('nuevo');
                this.hijoTablaContrato()?.contratoActivo.set(null);
                this.obServicioTransporte.set(null); // 👈 limpia data anterior
                this.modo.set('nuevo');
                this.abrirModal.set(true);
                this.accionService.setBloqueosAdmContrato({
                    refrescar: true,
                    nuevo: true,
                    anular: true,
                    aprobar: true,
                    reversion: true,
                    historico: true,
                    imprimir: true,
                    exportar: true
                });
            },
            anular: () => {
                this.setBoton('Anular Registro', 'bg-[#dc2626]');

                const contratoActivo = this.hijoTablaContrato()?.contratoActivo();

                if (contratoActivo) {
                    this.onAnular(contratoActivo);
                    this.accionService.setBloqueosAdmContrato({
                        refrescar: false,
                        nuevo: false,
                        anular: true,
                        aprobar: true,
                        reversion: true,
                        historico: true,
                        imprimir: false,
                        exportar: false
                    });
                } else {
                    this.formUtils.alertaNoPermitido('Selección requerida', 'Seleccione un contrato antes de anular.');
                }
            },
            guardar: () => {
                this.setBoton('Registro Guardado', 'bg-[#013B5C]');
                this.accionService.emitirAdmContrato('guardar');
            },
            aprobar: () => {
                this.setBoton('Registro Aprobado', 'bg-[#166534]');
                this.accionService.emitirAdmContrato('aprobar');

                const contratoActivo = this.hijoTablaContrato()?.contratoActivo();

                if (contratoActivo) {
                    this.onAprobar(contratoActivo);
                    this.accionService.setBloqueosAdmContrato({
                        refrescar: false,
                        nuevo: false,
                        anular: true,
                        aprobar: true,
                        reversion: true,
                        historico: true,
                        imprimir: false,
                        exportar: false
                    });
                } else {
                    this.formUtils.alertaNoPermitido('Selección requerida', 'Seleccione un contrato antes de aprobar.');
                }

            },
            reversion: () => {
                this.setBoton('Registro en Reversión', 'bg-[#92400e]');
                this.accionService.emitirAdmContrato('reversion');

                const contratoActivo = this.hijoTablaContrato()?.contratoActivo();

                if (contratoActivo) {
                    this.onRevertir(contratoActivo);
                    this.accionService.setBloqueosAdmContrato({
                        refrescar: false,
                        nuevo: false,
                        anular: true,
                        aprobar: true,
                        reversion: true,
                        historico: true,
                        imprimir: false,
                        exportar: false
                    });
                } else {
                    this.formUtils.alertaNoPermitido('Selección requerida', 'Seleccione un contrato antes de revertir.');
                }
            },
            historico: () => {
                this.setBoton('Registro en Histórico', 'bg-[#374151]');
                this.accionService.emitirAdmContrato('historico');
                const contratoActivo = this.hijoTablaContrato()?.contratoActivo();

                if (contratoActivo) {
                    this.onHistorico(contratoActivo);
                    this.accionService.setBloqueosAdmContrato({
                        refrescar: false,
                        nuevo: false,
                        anular: true,
                        aprobar: true,
                        reversion: true,
                        historico: true,
                        imprimir: false,
                        exportar: false
                    });
                } else {
                    this.formUtils.alertaNoPermitido('Selección requerida', 'Seleccione un contrato antes de aprobar.');
                }
            },

            imprimir: () => {
                this.setBoton('Imprimir Registro', 'bg-[#1e40af]');
                this.accionService.emitirAdmContrato('imprimir');
                this.onImprimir();
            },

            exportar: () => {
                this.setBoton('Exportar Registro', 'bg-[#013B5C]');
                this.accionService.emitirAdmContrato('exportar');
                this.onExportar();
            },
        };

        acciones[tipo]?.(); // 👈 ejecuta solo si existe la acción
    }

    // ─── Helpers ───────────────────────────────────────────────
    private setBoton(accion: string, color: string): void {
        this.botoPresionado.set(`Usted ha presionado el botón: ${accion}`);
        this.botoColor.set(color);
    }

    // ─── Doble click en tabla ──────────────────────────────────
    public onAbrirContrato(contrato: ContratoDetalleResponse): void {
        this.modo.set('visualizar');
        this.abrirModal.set(true);
        this.mantService.obtenerServicioTransporte({
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: contrato.cod_contrato ?? ''
        }).subscribe({
            next: (resp) => this.obServicioTransporte.set(resp),
            error: (err) => console.error('Error al obtener contrato:', err)
        });
    }


    // ─── Listar contratos ──────────────────────────────────────
    public listarAdmContrato(): void {
        this.listContrato.set([]);
        this.isLoading.set(true);

        const filtros = this.filtrosComponent.onObtenerFiltros();
        if (!filtros) {
            this.isLoading.set(false);
            return;
        }

        this.mantService.listarAdmContrato(filtros).subscribe({
            next: (contratos) => {
                this.listContrato.set(contratos);
                this.isLoading.set(false);
                this.obtenerCorrelativoContrato()
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error al listar contratos:', err);
            }
        });
    }

    public obtenerCorrelativoContrato() {

        const anioActual = new Date().getFullYear().toString();
        this.mantService.obtenerCorrelativoContrato(anioActual).subscribe({
            next: (resp: RespuestaCodigo) => {
                if (resp.estado === 1) {

                    this.contratoSiguiente.set(resp.codigoGenerado)

                } else {
                    this.formUtils.alertaNoPermitido('Error', resp.mensaje)
                }
            },
            error: (err) => console.error(err)
        })
    }

    // ─── ACCIONES BOTONES ──────────────────────────────────────

    public onAnular(contrato: ContratoDetalleResponse): void {
        if (!contrato) return;
        const codContrato = contrato.cod_contrato;
        const estado = contrato.ind_estado;

        // Opcional: Validación que tenías comentada en PowerBuilder
        // if (estado !== 'G') {
        //   alert('Atención: Solo se pueden eliminar contratos en estado Grabador (G).');
        //   return;
        // }


        this.formUtils.confirmarAnulacionClase(
            'Anular Registros',
            `¿Ud. desea Eliminar el Registro del Contrato: ${codContrato}?`,
            'Sí, Anular',
            'No, Anular'
        ).then(result => {
            if (!result.isConfirmed) return;
            this.isLoading.set(true);

            const payload: EliminarContratoRequest = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: contrato.cod_contrato ?? ''
            };

            this.mantService.eliminarContratoCascada(payload).subscribe({
                next: (response: GenericResponseDTO) => {
                    if (response.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Eliminación exitosa', 'Atención: Eliminación realizada satisfactoriamente...!');
                        this.listarAdmContrato();
                        this.isLoading.set(false);

                    } else {
                        this.formUtils.alertaNoPermitido('Error de Eliminación', `Error al eliminar: ${response.mensaje}`);
                    }
                },
                error: (err) => {
                    console.error('Error crítico del servidor:', err);
                    this.formUtils.alertaNoPermitido('Error', 'Ocurrió un error de red o comunicación con el servidor de base de datos.');
                },
                complete: () => {
                    this.isLoading.set(false);
                }
            });
        })

    }

    public onAprobar(contrato: ContratoDetalleResponse): void {
        if (!contrato) return;

        const codContrato = contrato.cod_contrato;
        const estado = contrato.ind_estado;

        if (estado !== 'G') {
            this.formUtils.mensajeEliminarLaborClase('Estado de Contrato', 'Atención: Solo se pueden aprobar contratos que se encuentren en estado Grabado (G).');

            return;
        }


        this.formUtils.confirmarAnulacionClase(
            'Aprobar Registro',
            `¿Atenciòn', "Ud. desea Aprobar el Registro: ${codContrato}?`,
            'Sí, Aprobar',
            'No, Aprobar'
        ).then(result => {
            if (!result.isConfirmed) return;

            this.isLoading.set(true);

            const payload: AprobarContratoRequest = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: codContrato ?? '',
                ind_estado: 'A', // Aprobado
                cod_usuario_modi: sessionStorage.getItem('username') ?? 'SYSTEM'
            };

            this.mantService.estadoContrato(payload).subscribe({
                next: (response: GenericResponseDTO) => {
                    if (response.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Estado de Aprobación', 'Aprobación realizada satisfactoriamente...!');
                        this.listarAdmContrato();
                        this.isLoading.set(false);
                    } else {
                        this.formUtils.alertaNoPermitido('Error de Aprobación', `Error al aprobar: ${response.mensaje}`);
                    }
                },
                error: (err) => {
                    console.error('Error al aprobar contrato:', err);
                    this.formUtils.alertaNoPermitido('Error de Aprobación', 'Error al actualizar el estado del Contrato en el servidor.');
                },
                complete: () => {
                    this.isLoading.set(false);
                }
            });
        })
    }


    public onRevertir(contrato: ContratoDetalleResponse): void {
        if (!contrato) return;

        const codContrato = contrato.cod_contrato;
        const estado = contrato.ind_estado;

        if (estado !== 'A') {
            this.formUtils.mensajeEliminarLaborClase('Estado de Reversar', 'Atención: Solo se pueden reversar contratos que se encuentren en estado Aprobado (A).');

            return;
        }


        this.formUtils.confirmarAnulacionClase(
            'Reversar Registro',
            `¿Atenciòn', "Ud. desea Reversar el Registro ? ${codContrato}?`,
            'Sí, Reversar',
            'No, Reversar'
        ).then(result => {
            if (!result.isConfirmed) return;

            this.isLoading.set(true);

            const payload: AprobarContratoRequest = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: codContrato ?? '',
                ind_estado: 'G',
                cod_usuario_modi: sessionStorage.getItem('username') ?? 'SYSTEM'
            };

            this.mantService.estadoContrato(payload).subscribe({
                next: (response: GenericResponseDTO) => {
                    if (response.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Estado de Reversar', 'Reversión realizada satisfactoriamente...!');
                        this.listarAdmContrato();
                        this.isLoading.set(false);
                    } else {
                        this.formUtils.alertaNoPermitido('Error de Reversar', `Error al reversar: ${response.mensaje}`);
                    }
                },
                error: (err) => {
                    console.error('Error al aprobar contrato:', err);
                    this.formUtils.alertaNoPermitido('Error de Reversar', `Error al reversar: ${err.mensaje}`);
                },
                complete: () => {
                    this.isLoading.set(false);
                }
            });
        })
    }


    public onHistorico(contrato: ContratoDetalleResponse): void {
        if (!contrato) return;

        const codContrato = contrato.cod_contrato;
        console.log(contrato.fec_termino);
        // TRADUCCIÓN: ld_termino = dw_catalogos.object.fec_termino[li_row]
        if (!contrato.fec_termino) {

            this.formUtils.mensajeEliminarLaborClase('Error Fecha Termino', 'Error: El contrato no cuenta con una fecha de término registrada.');
            return;
        }

        // Setear ambas fechas a las 00:00:00 para comparar únicamente los días (equivalente al Date() de PB)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const fechaTermino = new Date(contrato.fec_termino);
        fechaTermino.setHours(0, 0, 0, 0);

        let mensajeConfirmacion = `¿Ud. desea guardar el histórico del Contrato ${codContrato}?`;

        // TRADUCCIÓN: IF today() <= date(ld_termino) Then
        if (hoy.getTime() <= fechaTermino.getTime()) {
            mensajeConfirmacion = `¿El contrato se encuentra VIGENTE.\n\n¿Ud. desea guardar el histórico del Contrato ${codContrato}?`;
        }

        this.formUtils.confirmarAnulacionClase(
            'Historico de Contrato',
            mensajeConfirmacion,
            'Sí, Guardar',
            'No, Guardar'
        ).then(result => {
            if (!result.isConfirmed) return;


            this.isLoading.set(true);

            const payload: AprobarContratoRequest = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: codContrato ?? '',
                ind_estado: 'H',
                cod_usuario_modi: sessionStorage.getItem('username') ?? 'SYSTEM'
            };

            this.mantService.estadoContrato(payload).subscribe({
                next: (response: GenericResponseDTO) => {
                    if (response.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Histórico realizado satisfactoriamente', 'El histórico del contrato ha sido guardado correctamente.');
                        this.listarAdmContrato();
                        this.isLoading.set(false);
                    } else {
                        this.formUtils.mensajeEliminarLaborClase('Error', `Error: ${response.mensaje}`);
                    }
                },
                error: (err) => {
                    console.error('Error al procesar histórico:', err);
                    this.formUtils.mensajeEliminarLaborClase('Error', `Error: ${err.mensaje}`);
                },
                complete: () => {
                    this.isLoading.set(false);
                }
            });
        })
    }

    public onAbrir(abrirModal: boolean): void {
        this.accionService.setBloqueosAdmContrato({
            refrescar: false,
            nuevo: false,
            anular: true,
            aprobar: true,
            reversion: true,
            historico: true,
            imprimir: false,
            exportar: false
        });
        this.abrirModal.set(abrirModal)
    }

    public onImprimir(): void {
        this.formUtils.confirmarAnulacionClase(
            'Imprimir Contratos',
            '¿Desea ir al panel de impresión?',
            'Sí, Abrir',
            'No, Cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;
            this.reporteContratosComponent()?.imprimir();
        })
    }

    public onExportar(): void {

        this.formUtils.confirmarAnulacionClase(
            'Exportar Contratos',
            'Desea exportar los contratos?',
            'Sí, Exportar',
            'No, Cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;
            this.reporteContratosComponent()?.descargarExcel();
        })
    }

}
