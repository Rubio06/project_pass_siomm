import { AfterViewInit, Component, inject, OnInit, signal, viewChild, ViewChild } from '@angular/core';

import { FiltrosContratoComponent } from '../../components/filtros-contrato/filtros-contrato.component';
import { TablaContratoComponent } from '../../components/tabla-contrato/tabla-contrato.component';
import { AccionPlaneamientoService } from '../../../../../services/accion-planeamiento.service';
import { BotonesComponent } from 'src/app/shared/components/botones/botones.component';
import { TituloModuloComponent } from 'src/app/shared/components/filtros-generales-selects/titulo-modulo/titulo-modulo.component';
import { CommonModule } from '@angular/common';
import { MantenimientoService } from '../../../../../services/mantenimiento.service';
import { ContratoDetalleResponse, RespuestaCodigo, ServicoTransporte } from '../../interfaces/adm-contrato.interface';
import { AdmContratosServvice } from '../../services/adm-contratos.service';
import { ServicioTransporteComponent } from '../../components/servicio-transporte/servicio-transporte.component';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-adm-contratos',
    imports: [FiltrosContratoComponent, TablaContratoComponent, BotonesComponent, CommonModule, ServicioTransporteComponent],
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
            },
            anular: () => {
                this.setBoton('Anular Registro', 'bg-[#dc2626]');
                this.accionService.emitirAdmContrato('anular');
            },
            guardar: () => {
                this.setBoton('Registro Guardado', 'bg-[#013B5C]');
                this.accionService.emitirAdmContrato('guardar');
            },
            aprobar: () => {
                this.setBoton('Registro Aprobado', 'bg-[#013B5C]');
                this.accionService.emitirAdmContrato('aprobar');
            },
            reversion: () => {
                this.setBoton('Registro en Reversión', 'bg-[#013B5C]');
                this.accionService.emitirAdmContrato('reversion');
            },
            historico: () => {
                this.setBoton('Registro en Histórico', 'bg-[#013B5C]');
                this.accionService.emitirAdmContrato('historico');
            },
            exportar: () => {
                this.setBoton('Exportar Registro', 'bg-[#013B5C]');
                this.accionService.emitirAdmContrato('exportar');
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

}
