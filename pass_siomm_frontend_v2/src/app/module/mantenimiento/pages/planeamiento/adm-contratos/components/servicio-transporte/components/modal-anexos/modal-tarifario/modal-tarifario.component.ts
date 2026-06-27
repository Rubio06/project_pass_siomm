import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { TransporteMineralComponent } from './components/transporte-mineral/transporte-mineral.component';
import { TransporteMaterialComponent } from './components/transporte-material/transporte-material.component';
import { RutasFijasBalanzaComponent } from './components/rutas-fijas-balanza/rutas-fijas-balanza.component';
import { AlquilerTransporteComponent } from './components/alquiler-transporte/alquiler-transporte.component';
import { TabTarifarioComponent } from './components/tab-tarifario/tab-tarifario.component';
import { PaginacionComponent } from 'src/app/shared/components/paginacion/paginacion.component';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { ConfigTabGuardar, EntradaTarifarioDetalleReporte, ProcesarResult, ReporteTransporteOtrosResponse, RespuestaTarifario, RutasFijasBalanza, SvalDetTarifarioEquiposAlquiler, SvalDetTarifarioTransporte, TarifarioTransporteDetalle } from '../../../interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';

@Component({
    selector: 'app-modal-tarifario',
    imports: [
        TransporteMineralComponent,
        TransporteMaterialComponent,
        RutasFijasBalanzaComponent,
        AlquilerTransporteComponent,
        TabTarifarioComponent,
        PaginacionComponent
    ],
    templateUrl: './modal-tarifario.component.html',
    styleUrl: './modal-tarifario.component.css',
})
export class ModalTarifarioComponent {
    private readonly servioTransporteService = inject(ServioTransporteService);
    private formUtils = FormUtils;
    onCerrarModalTarifario = output<void>();
    tabActivo = signal('transporte-mineral');
    cod_contrato = input<string>('');
    transporteMineral = viewChild(TransporteMineralComponent);

    transporteMaterial = viewChild(TransporteMaterialComponent);

    rutasFijasBalanza = viewChild(RutasFijasBalanzaComponent);
    alquilerTransporte = viewChild(AlquilerTransporteComponent);

    private get activeTarifarioChild() {
        if (this.tabActivo() === 'transporte-mineral') return this.transporteMineral();
        if (this.tabActivo() === 'transporte-material') return this.transporteMaterial();
        return null;
    }

    get paginaActual(): number {
        return this.activeTarifarioChild?.paginaActual() ?? 1;
    }

    get totalPaginas(): number {
        return this.activeTarifarioChild?.totalPaginas() ?? 0;
    }

    get totalRegistros(): number {
        return this.activeTarifarioChild?.totalRegistros() ?? 0;
    }

    onPaginaCambio(pagina: number): void {
        this.activeTarifarioChild?.onPaginaCambio(pagina);
    }

    public async onCerrar(): Promise<void> {
        if (this.onTabPendiente()) {
            const confirmar = await this.formUtils.confirmarSalirSinGuardar();
            if (!confirmar) {
                return;
            }
        }

        this.onCerrarModalTarifario.emit();
    }

    public async onCambiarTab(nuevaTab: string): Promise<void> {
        if (nuevaTab === this.tabActivo()) {
            return;
        }

        if (this.onTabPendiente()) {
            const confirmar = await this.formUtils.confirmarSalirSinGuardar();
            if (!confirmar) {
                return;
            }
        }

        this.tabActivo.set(nuevaTab);
    }

    private onTabPendiente(): boolean {
        if (this.tabActivo() === 'transporte-mineral') {
            const hijoMineral = this.transporteMineral();
            return !!hijoMineral?.miFormulario?.dirty;
        }

        if (this.tabActivo() === 'transporte-material') {
            const hijoMaterial = this.transporteMaterial();
            return !!hijoMaterial?.form?.dirty;
        }

        if (this.tabActivo() === 'rutas-fijas-balanza') {
            const hijoRutaBalanza = this.rutasFijasBalanza();
            return !!hijoRutaBalanza?.formularioTablas?.dirty;
        }

        if (this.tabActivo() === 'alquiler-transporte') {
            const hijoAlquilerTransporte = this.alquilerTransporte();
            return !!hijoAlquilerTransporte?.form?.dirty;
        }

        return false;
    }

    public onGuardar(): void {
        const tabActual = this.tabActivo();

        // 1. Diccionario de configuración por cada pestaña activa
        const mapaTabs: Record<string, ConfigTabGuardar> = {
            'transporte-mineral': {
                componente: this.transporteMineral(),
                propiedadForm: 'miFormulario',
                metodoRecarga: 'cargarTarifarioDetalle',
                servicioMetodo: (d) => this.servioTransporteService.guardarTarifarioDetalle(d)
            },
            'transporte-material': {
                componente: this.transporteMaterial(),
                propiedadForm: 'form',
                metodoRecarga: 'cargarFilas',
                servicioMetodo: (d) => this.servioTransporteService.guardarTarifarioDetalle(d)
            },
            'rutas-fijas-balanza': {
                componente: this.rutasFijasBalanza(),
                propiedadForm: 'formularioTablas',
                metodoRecarga: 'cargarTarifarioMaterial',
                servicioMetodo: (d) => this.servioTransporteService.guardarRutaBalanza(d)
            },
            'alquiler-transporte': {
                componente: this.alquilerTransporte(),
                propiedadForm: 'form',
                metodoRecarga: 'cargarDatosEquipo',
                servicioMetodo: (d) => this.servioTransporteService.guardarAlquilerEquipo(d)
            }
        };

        // 2. Extraemos la configuración del Tab actual
        const config = mapaTabs[tabActual];
        if (!config || !config.componente) return;

        const componenteHijo = config.componente;
        const formulario = componenteHijo[config.propiedadForm];
        if (!formulario) return;

        // 3. Validaciones de Formulario de forma genérica
        formulario.markAllAsTouched();
        if (formulario.invalid) return;

        // 4. Extracción y construcción balanceada del lote a enviar (I / U)
        const username = sessionStorage.getItem('username');
        const listaFinalEnviar: any[] = [];
        const controlesFilas = componenteHijo.filas?.controls || [];

        controlesFilas.forEach((controlFila: any) => {
            const valorFila = controlFila.getRawValue();

            if (valorFila.esNuevo === true) {
                listaFinalEnviar.push({ ...valorFila, accion: 'I', cod_usuario_creo: username });
            } else if (controlFila.dirty) {
                listaFinalEnviar.push({ ...valorFila, accion: 'U', cod_usuario_modi: username });
            }
        });

        if (listaFinalEnviar.length === 0) {
            this.formUtils.alertaNoPermitidoClase('Cambios no existentes', 'No se detectaron cambios ni filas nuevas para guardar.');
            return;
        }

        // 5. Ventana emergente de confirmación unificada
        this.formUtils.confirmarAnulacionClase(
            'Guardar Registros',
            '¿Está de acuerdo en guardar los datos escritos?',
            'Sí, guardar',
            'No, cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;

            // 6. Ejecución dinámica del servicio inyectado
            config.servicioMetodo(listaFinalEnviar).subscribe({
                next: (res: any) => {
                    if (res.estado === 1) {
                        this.formUtils.alertaExitoAnulacion('Datos Guardados', `¡Éxito!: ${res.mensaje}`);

                        // 🔥 Bucle inteligente: Limpiamos de forma segura el estado de CUALQUIER pestaña abierta
                        this.transporteMineral()?.miFormulario?.markAsPristine();
                        this.transporteMaterial()?.form?.markAsPristine();
                        this.rutasFijasBalanza()?.formularioTablas?.markAsPristine();
                        this.alquilerTransporte()?.form?.markAsPristine();

                        // Ejecutamos dinámicamente la recarga del componente hijo actual
                        if (typeof componenteHijo[config.metodoRecarga] === 'function') {
                            componenteHijo[config.metodoRecarga]();
                        }
                    } else {
                        this.formUtils.alertaNoPermitidoClase('Error al Guardar', res.mensaje);
                    }
                },
                error: (err) => {
                    console.error(`Error al guardar el tarifario en la pestaña [${tabActual}]:`, err);
                    alert(`Error: ${err.error?.mensaje || 'Ocurrió un error inesperado.'}`);
                }
            });
        });
    }

    // IMPRIMIR TABLAS
    public onImprimir(): void {
        if (this.tabActivo() === 'rutas-fijas-balanza') {
            // 5. Ventana emergente de confirmación unificada
            this.formUtils.confirmarAnulacionClase(
                'Imprimir Datos',
                '¿Desea imprimir los datos de la tabla Rutas Fijas Balanza?',
                'Sí, Imprimir',
                'No, cancelar'
            ).then(result => {
                if (!result.isConfirmed) return;
                this.imprimirRutasFijas(); // El método que creamos antes
            })
        } else if (this.tabActivo() === 'transporte-mineral') {
            // 5. Ventana emergente de confirmación unificada
            this.formUtils.confirmarAnulacionClase(
                'Imprimir Datos',
                '¿Desea imprimir los datos de la tabla Transporte Mineral?',
                'Sí, Imprimir',
                'No, cancelar'
            ).then(result => {
                if (!result.isConfirmed) return;
                this.imprimirTransporteMineral();
            })
        } else if (this.tabActivo() === 'transporte-material') {
            // 5. Ventana emergente de confirmación unificada
            this.formUtils.confirmarAnulacionClase(
                'Imprimir Datos',
                '¿Desea imprimir los datos de la tabla Trasnporte Material (Otros)?',
                'Sí, Imprimir',
                'No, cancelar'
            ).then(result => {
                if (!result.isConfirmed) return;
                this.imprimirTransporteOtros();
            })
        }

    }

    public imprimirRutasFijas(): void {
        // 1. Extraemos la instancia del componente hijo usando el ViewChild Signal
        const componenteHijo = this.rutasFijasBalanza();
        if (!componenteHijo) {
            this.formUtils.alertaNoPermitidoClase('Error', 'No se pudo cargar el componente de alquiler de transporte.');
            return;
        }

        // 2. Obtenemos el array de datos crudos directamente desde el FormArray del hijo
        // Nota: Asegúrate de que 'filas' es el FormArray dentro de AlquilerTransporteComponent
        const filasEquipos = componenteHijo.filas?.value || [];

        if (filasEquipos.length === 0) {
            this.formUtils.alertaNoPermitidoClase('Sin Datos', 'No hay registros en la tabla para imprimir.');
            return;
        }

        // 3. Crear el lienzo en formato A4 vertical
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const ahora = new Date();
        const fechaStr = ahora.toLocaleDateString('es-PE'); // 17/06/2026
        const horaStr = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const widthPage = doc.internal.pageSize.getWidth();
        const alturaEncabezado = 45;
        const titulo = 'RUTAS DE MATERIAL DE PESAJE FIJO POR BALANZA';

        const dibujarEncabezado = (paginaActual: number) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`FECHA: ${fechaStr}`, widthPage - 40, 15);
            doc.text(`HORA: ${horaStr}`, widthPage - 40, 20);
            doc.text(`PÁGINA: ${paginaActual}`, widthPage - 40, 25);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(titulo, widthPage / 2, 35, { align: 'center' });
        };

        dibujarEncabezado(1);

        // 6. Mapear los controles del formulario a matrices de texto simples para el reporte
        const matrizDatos = filasEquipos.map((fila: any) => {
            const materialSeleccionado = componenteHijo.listSvalTablaDetalle().find(
                (item: any) => item.cod_item === fila.cod_item
            );

            return [
                fila.cod_item_ruta || '',
                fila.c_t_zona,
                fila.c_t_origen,
                fila.c_t_destino,
                materialSeleccionado?.des_tabladet || fila.cod_item || '',
                fila.flg_vigente === '1' ? 'ACTIVO' : 'INACTIVO'
            ];
        });

        // 7. Definición de Columnas de la Tabla
        const columnasEncabezado = [
            'Cód. Ruta',
            'Zona',
            'Punto Origen',
            'Punto Destino',
            'Material',
            'Estado'
        ];

        // 8. Dibujar la tabla estructurada
        autoTable(doc, {
            head: [columnasEncabezado],
            body: matrizDatos,
            startY: alturaEncabezado,
            margin: { top: alturaEncabezado, left: 12, right: 12, bottom: 15 },
            pageBreak: 'auto',
            theme: 'plain',
            headStyles: {
                fillColor: [230, 230, 230],
                textColor: [0, 0, 0],
                font: 'helvetica',
                fontStyle: 'bold',
                fontSize: 8.5,
                halign: 'center',
                lineWidth: 0.1,
            },
            styles: {
                font: 'helvetica',
                fontSize: 8,
                textColor: [40, 40, 40],
                lineWidth: 0.1,
            },
            columnStyles: {
                0: { cellWidth: 20, halign: 'center' },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 48, halign: 'center' },
                3: { cellWidth: 48, halign: 'center' },
                4: { cellWidth: 20, halign: 'center' },
                5: { cellWidth: 20, halign: 'center' },

            },
            didDrawPage: (data) => {
                const paginaActual = doc.getNumberOfPages();
                dibujarEncabezado(paginaActual);

                const finalY = data.cursor ? data.cursor.y : 60;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.text(`Total Equipos: ${matrizDatos.length}`, 12, finalY + 7);
            }
        });

        // 9. Abrir visor de impresión en pestaña nueva
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
    }

    public imprimirTransporteMineral(): void {
        // 🎯 1. Preparamos el payload de filtros extrayéndolos de tus estados, signals o formulario activo
        const filtrosReporte: EntradaTarifarioDetalleReporte = {
            cod_empresa: '03',               // Reemplaza por tu forma de obtener el código de empresa actual
            cod_empresa_unidad: '01', // Reemplaza por tu unidad actual
            cod_contrato: this.cod_contrato(),             // Reemplaza por tu contrato actual
            ind_material: 'M'                        // Forzamos el indicador de material requerido
        };

        // 🎯 2. Invocamos al servicio de backend para traer TODOS los registros sin paginar
        this.servioTransporteService.obtenerTransporteMineralReporte(filtrosReporte).subscribe({
            next: (filasEquipos: TarifarioTransporteDetalle[]) => {

                // Si la base de datos no arrojó ningún registro con esos filtros
                if (!filasEquipos || filasEquipos.length === 0) {
                    this.formUtils.alertaNoPermitidoClase('Sin Datos', 'No hay registros en la base de datos para imprimir con los filtros seleccionados.');
                    return;
                }

                // 🎯 3. Inicializamos el documento PDF con la data completa obtenida
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const widthPage = doc.internal.pageSize.getWidth(); // 210mm
                const margenLateral = 15;
                const anchoUtil = widthPage - (margenLateral * 2); // 180mm disponibles

                const ahora = new Date();
                const dia = String(ahora.getDate()).padStart(2, '0');
                const mes = String(ahora.getMonth() + 1).padStart(2, '0');
                const anio = ahora.getFullYear();
                const fechaStr = `${dia}/${mes}/${anio}`;

                const horas = String(ahora.getHours()).padStart(2, '0');
                const minutos = String(ahora.getMinutes()).padStart(2, '0');
                const segundos = String(ahora.getSeconds()).padStart(2, '0');
                const horaStr = `${horas}:${minutos}:${segundos}`;

                const formatoNum = (valor: any): string => {
                    const n = Number(valor);
                    return isNaN(n) ? '.000' : n.toFixed(3);
                };

                // Agrupamos el set completo por la categoría del material
                const grupos = new Map<string, any[]>();
                filasEquipos.forEach((fila: any) => {
                    const categoria = (fila.ind_material || 'SIN CATEGORÍA').toString().toUpperCase().trim();
                    if (!grupos.has(categoria)) {
                        grupos.set(categoria, []);
                    }
                    grupos.get(categoria)!.push(fila);
                });

                // Estampamos encabezados de fecha/hora fijos
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.text(`FECHA:     ${fechaStr}`, 165, 15);
                doc.text(`HORA:      ${horaStr}`, 165, 20);

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text('RESUMEN DE PRECIOS UNITARIOS DEL SERVICIO DE TRANSPORTE', widthPage / 2, 35, { align: 'center' });

                doc.setFontSize(10);
                doc.text(
                    `Nº DOCUMENTO: ${this.cod_contrato()} - CONTRATA: Cn Mineria Y Construccion S.A.C.`,
                    widthPage / 2, 41, { align: 'center' }
                );

                let posicionY = 48;
                let totalFilasGlobal = 0;

                const anchoCodRuta = 10;
                const anchoOrigen = 32;
                const anchoIntermedio = 32;
                const anchoDestino = 32;
                const anchoZona = 17;
                const anchoDistKm = 13;
                const anchoPU = 13;
                const anchoPrecio = 14;
                const anchoCentroCostos = anchoUtil - (
                    anchoCodRuta + anchoOrigen + anchoIntermedio + anchoDestino +
                    anchoZona + anchoDistKm + anchoPU + anchoPrecio
                );

                grupos.forEach((filasGrupo, nombreCategoria) => {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(10);
                    doc.text('RUTAS ACTIVAS', widthPage / 2, posicionY, { align: 'center' });

                    const anchoTextoLinea = 27;
                    doc.line(
                        (widthPage / 2) - (anchoTextoLinea / 2),
                        posicionY + 1,
                        (widthPage / 2) + (anchoTextoLinea / 2),
                        posicionY + 1
                    );

                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(9);
                    doc.text('MINERAL', margenLateral, posicionY + 8);

                    // Mapeamos las propiedades exactas devueltas por el DTO del backend
                    const matrizDatos = filasGrupo.map((fila: any) => [
                        fila.cod_item_ruta || '',
                        fila.c_t_origen || '',       // Descripción del origen desde el LEFT JOIN
                        fila.c_t_intermedio || '',   // Nueva descripción intermedia resuelta
                        fila.c_t_destino || '',      // Descripción del destino desde el LEFT JOIN
                        fila.c_t_zona || '',         // Descripción de la zona desde el LEFT JOIN
                        formatoNum(fila.nro_distancia_km),
                        formatoNum(fila.imp_tmh_km_soles),
                        formatoNum(fila.imp_ruta_pu),
                        fila.cto_cod || ''
                    ]);

                    totalFilasGlobal += matrizDatos.length;

                    autoTable(doc, {
                        startY: posicionY + 11,
                        margin: { left: margenLateral, right: margenLateral },
                        tableWidth: anchoUtil,
                        head: [
                            [
                                { content: 'Cód.\nRuta', rowSpan: 2 },
                                { content: 'Lugar', colSpan: 3, styles: { halign: 'center' } },
                                { content: 'Zona', rowSpan: 2 },
                                { content: 'Dist.\nKM', rowSpan: 2 },
                                { content: 'PU S/.\nTMH x\nKM', rowSpan: 2 },
                                { content: 'Precio S/.\nx Proced.', rowSpan: 2 },
                                { content: 'Centro\nCostos', rowSpan: 2 }
                            ],
                            [
                                'Origen',
                                'Intermedio',
                                'Destino'
                            ]
                        ],
                        body: matrizDatos,
                        theme: 'plain',
                        headStyles: {
                            fillColor: [235, 235, 235],
                            textColor: [0, 0, 0],
                            fontStyle: 'bold',
                            fontSize: 6,
                            halign: 'center',
                            valign: 'middle',
                            lineWidth: 0.1
                        },
                        bodyStyles: {
                            fontSize: 6,
                            font: 'helvetica',
                            textColor: [40, 40, 40],
                            lineWidth: 0.1
                        },
                        columnStyles: {
                            0: { cellWidth: anchoCodRuta, halign: 'center' },
                            1: { cellWidth: anchoOrigen, halign: 'left' },
                            2: { cellWidth: anchoIntermedio, halign: 'left' },
                            3: { cellWidth: anchoDestino, halign: 'left' },
                            4: { cellWidth: anchoZona, halign: 'center' },
                            5: { cellWidth: anchoDistKm, halign: 'right' },
                            6: { cellWidth: anchoPU, halign: 'right' },
                            7: { cellWidth: anchoPrecio, halign: 'right' },
                            8: { cellWidth: anchoCentroCostos, halign: 'center' }
                        },
                        styles: {
                            cellPadding: 1,
                            overflow: 'ellipsize'
                        }
                    });

                    // @ts-ignore
                    posicionY = (doc as any).lastAutoTable.finalY + 12;
                });

                // 🎯 4. Estampamos la numeración dinámica en cada hoja generada de forma limpia
                const totalPaginas = doc.getNumberOfPages();
                for (let i = 1; i <= totalPaginas; i++) {
                    doc.setPage(i);

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);
                    doc.text(`PÁGINA:    ${i} de ${totalPaginas}`, margenLateral, doc.internal.pageSize.getHeight() - 10);

                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8.5);
                    doc.text(`Nro: ${totalFilasGlobal}`, widthPage - margenLateral, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
                }

                // 🎯 5. Renderizado seguro vía URL de objeto en memoria (Previene bloqueos de popups)
                const blobUrl = doc.output('bloburl');
                window.open(blobUrl, '_blank');
            },
            error: () => {
                // El manejo visual de la alerta de error ya está cubierto internamente por el catchError de tu servicio
            }
        });
    }

    public imprimirTransporteOtros(): void {
        // 🎯 1. Preparamos el payload de filtros extrayéndolos de tus estados
        const filtrosReporte: EntradaTarifarioDetalleReporte = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            ind_material: 'D' // 'D' para Desmonte / Otros
        };

        // 🎯 2. Invocamos al servicio de backend que ahora retorna { rutasActivas: [], rutasInactivas: [] }
        this.servioTransporteService.obtenerTransporteOtrosReporteEstructurado(filtrosReporte).subscribe({
            next: (respuesta: ReporteTransporteOtrosResponse) => {

                const activas = respuesta.rutasActivas || [];
                const inactivas = respuesta.rutasInactivas || [];

                if (activas.length === 0 && inactivas.length === 0) {
                    this.formUtils.alertaNoPermitidoClase('Sin Datos', 'No hay registros en la base de datos para imprimir.');
                    return;
                }

                // 🎯 3. Inicializamos el documento PDF
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const widthPage = doc.internal.pageSize.getWidth(); // 210mm
                const margenLateral = 15;
                const anchoUtil = widthPage - (margenLateral * 2); // 180mm disponibles

                // Captura de fecha y hora exacta
                const ahora = new Date();
                const dia = String(ahora.getDate()).padStart(2, '0');
                const mes = String(ahora.getMonth() + 1).padStart(2, '0');
                const anio = ahora.getFullYear();
                const fechaStr = `${dia}/${mes}/${anio}`;

                const horas = String(ahora.getHours()).padStart(2, '0');
                const minutos = String(ahora.getMinutes()).padStart(2, '0');
                const segundos = String(ahora.getSeconds()).padStart(2, '0');
                const horaStr = `${horas}:${minutos}:${segundos}`;

                // Formateador idéntico a la imagen: si es 0 o nulo muestra '.000', sino conserva el formato decimal
                const formatoNum = (valor: any): string => {
                    const n = Number(valor);
                    if (isNaN(n) || n === 0) return '.000';
                    return n.toFixed(3);
                };

                // Títulos principales de la cabecera
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text('RESUMEN DE PRECIOS UNITARIOS DEL SERVICIO DE TRANSPORTE', widthPage / 2, 35, { align: 'center' });

                doc.setFontSize(10);
                doc.text(
                    `Nº DOCUMENTO: ${this.cod_contrato()} - CONTRATA: Cn Mineria Y Construccion S.A.C.`,
                    widthPage / 2, 41, { align: 'center' }
                );

                let posicionY = 48;
                // Contador global basado en la suma total de elementos procesados
                let totalFilasGlobal = activas.length + inactivas.length;

                // Anchos de columna calculados con precisión milimétrica para rellenar los 180mm
                const anchoCodRuta = 13;
                const anchoOrigen = 31;
                const anchoIntermedio = 31;
                const anchoDestino = 31;
                const anchoZona = 16;
                const anchoDistKm = 11;
                const anchoPU = 14;
                const anchoPrecio = 15;
                const anchoCentroCostos = anchoUtil - (anchoCodRuta + anchoOrigen + anchoIntermedio + anchoDestino + anchoZona + anchoDistKm + anchoPU + anchoPrecio);

                // 🛠️ Función interna para renderizar cada bloque (Activas / Inactivas)
                const renderizarBloqueTabla = (tituloBloque: string, registros: any[]) => {
                    if (registros.length === 0) return;

                    // Título centrado y subrayado exacto
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(10);
                    doc.text(tituloBloque, widthPage / 2, posicionY, { align: 'center' });

                    const anchoTextoLinea = tituloBloque === 'RUTAS ACTIVAS' ? 28 : 30;
                    doc.line(
                        (widthPage / 2) - (anchoTextoLinea / 2), posicionY + 1,
                        (widthPage / 2) + (anchoTextoLinea / 2), posicionY + 1
                    );

                    // Subcategoría izquierda (MATERIAL - OTROS)
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(9);
                    doc.text('MATERIAL - OTROS', margenLateral, posicionY + 8);

                    // Mapeo del cuerpo
                    const matrizDatos = registros.map((fila: any) => [
                        fila.cod_item_ruta || '',
                        fila.c_t_origen || '',
                        fila.c_t_intermedio || '',
                        fila.c_t_destino || '',
                        fila.c_t_zona || '',
                        formatoNum(fila.nro_distancia_km),
                        formatoNum(fila.imp_tmh_km_soles),
                        formatoNum(fila.imp_ruta_pu),
                        fila.cto_cod || ''
                    ]);

                    // 🎯 Cálculo de sumatoria para la fila totalizadora del bloque
                    const sumaTotalBloque = registros.reduce((acc, fila) => acc + Number(fila.imp_ruta_pu || 0), 0);

                    matrizDatos.push([
                        {
                            content: `Total de ${tituloBloque === 'RUTAS ACTIVAS' ? 'Rutas de Transporte' : 'Rutas Inactivas'} (S/.) :`,
                            colSpan: 7,
                            styles: { halign: 'right', fontStyle: 'bold', fontSize: 6.5, fillColor: [255, 255, 255] }
                        },
                        {
                            content: formatoNum(sumaTotalBloque),
                            styles: { halign: 'right', fontStyle: 'bold', fontSize: 6.5, fillColor: [225, 225, 225] }
                        },
                        {
                            content: '',
                            styles: { fillColor: [255, 255, 255] }
                        }
                    ]);

                    autoTable(doc, {
                        startY: posicionY + 11,
                        margin: { top: 30, left: margenLateral, right: margenLateral, bottom: 18 },
                        tableWidth: anchoUtil,
                        head: [
                            [
                                { content: 'Cód.\nRuta', rowSpan: 2 },
                                { content: 'Lugar', colSpan: 3, styles: { halign: 'center' } },
                                { content: 'Zona', rowSpan: 2 },
                                { content: 'Dist.\nKM', rowSpan: 2 },
                                { content: 'PU S/.\nTMH x\nKM', rowSpan: 2 },
                                { content: 'Precio S/.\nx Proced.', rowSpan: 2 },
                                { content: 'Centro\nCostos', rowSpan: 2 }
                            ],
                            [
                                'Origen',
                                'Intermedio',
                                'Destino'
                            ]
                        ],
                        body: matrizDatos,
                        theme: 'plain',
                        headStyles: {
                            fillColor: [240, 240, 240],
                            textColor: [0, 0, 0],
                            fontStyle: 'bold',
                            fontSize: 6,
                            halign: 'center',
                            valign: 'middle',
                            lineWidth: 0.1,
                            lineColor: [200, 200, 200]
                        },
                        bodyStyles: {
                            fontSize: 6,
                            font: 'helvetica',
                            textColor: [30, 30, 30],
                            lineWidth: 0.1,
                            lineColor: [210, 210, 210],
                            valign: 'middle'
                        },
                        columnStyles: {
                            0: { cellWidth: anchoCodRuta, halign: 'center' },
                            1: { cellWidth: anchoOrigen, halign: 'left' },
                            2: { cellWidth: anchoIntermedio, halign: 'left' },
                            3: { cellWidth: anchoDestino, halign: 'left' },
                            4: { cellWidth: anchoZona, halign: 'center' },
                            5: { cellWidth: anchoDistKm, halign: 'right' },
                            6: { cellWidth: anchoPU, halign: 'right' },
                            7: { cellWidth: anchoPrecio, halign: 'right' },
                            8: { cellWidth: anchoCentroCostos, halign: 'center' }
                        },
                        styles: {
                            cellPadding: 1,
                            overflow: 'ellipsize'
                        }
                    });

                    // @ts-ignore
                    posicionY = (doc as any).lastAutoTable.finalY + 14;
                };

                // 🚀 Renderizamos bloque 1
                renderizarBloqueTabla('RUTAS ACTIVAS', ...[activas]);

                // Control de salto de página inteligente antes del bloque 2
                if (posicionY > doc.internal.pageSize.getHeight() - 45) {
                    doc.addPage();
                    posicionY = 32;
                }

                // 🚀 Renderizamos bloque 2
                renderizarBloqueTabla('RUTA INACTIVAS', ...[inactivas]);

                // =========================================================
                // 🎯 4. CAPA DE ENCABEZADOS SUPERIORES FLOTANTES (Fiel a la Imagen)
                // =========================================================
                const totalPaginas = doc.getNumberOfPages();
                for (let i = 1; i <= totalPaginas; i++) {
                    doc.setPage(i);

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);

                    // Bloque alineado en el extremo derecho tal como muestra la captura
                    const xPosLabels = 168;
                    doc.text('FECHA:', xPosLabels, 15);
                    doc.text('HORA:', xPosLabels, 19);
                    doc.text('PÁGINA:', xPosLabels, 23);

                    doc.text(fechaStr, xPosLabels + 16, 15);
                    doc.text(horaStr, xPosLabels + 16, 19);
                    doc.text(`${i} de ${totalPaginas}`, xPosLabels + 16, 23);

                    // Nro al pie de página (Lado izquierdo inferior)
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8);
                    doc.text(`Nro: ${totalFilasGlobal}`, margenLateral, doc.internal.pageSize.getHeight() - 10);
                }

                // 🎯 5. Apertura e impresión
                const blobUrl = doc.output('bloburl');
                window.open(blobUrl, '_blank');
            },
            error: () => { }
        });
    }

    public onExportar(): void {
        if (this.tabActivo() === 'rutas-fijas-balanza') {
            // 5. Ventana emergente de confirmación unificada
            this.formUtils.confirmarAnulacionClase(
                'Exportar Datos',
                '¿Desea exportar los datos de la tabla Rutas Fijas Balanza?',
                'Sí, Exportar',
                'No, cancelar'
            ).then(result => {
                if (!result.isConfirmed) return;
                this.exportarRutasFijasExcel();
            })
        } else if (this.tabActivo() === 'transporte-mineral') {
            // 5. Ventana emergente de confirmación unificada
            this.formUtils.confirmarAnulacionClase(
                'Exportar Datos',
                '¿Desea exportar los datos de la tabla Transporte Mineral?',
                'Sí, exportar',
                'No, cancelar'
            ).then(result => {
                if (!result.isConfirmed) return;
                this.exportarExcelTransporteOtros('M', 'MINERAL', 'Mineral');
            })
        } else if (this.tabActivo() === 'transporte-material') {
            this.formUtils.confirmarAnulacionClase(
                'Exportar Datos',
                '¿Desea imprimir los datos de la tabla Trasnporte Material (Otros)?',
                'Sí, exportar',
                'No, cancelar'
            ).then(result => {
                if (!result.isConfirmed) return;
                this.exportarExcelTransporteOtros('D', 'MATERIAL - OTROS', 'Tarifario_Otros');
            })
        }

    }

    public exportarRutasFijasExcel(): void {
        const componenteHijo = this.rutasFijasBalanza();
        if (!componenteHijo) {
            this.formUtils.alertaNoPermitidoClase('Error', 'No se pudo cargar el componente para la exportación.');
            return;
        }

        const filasEquipos = componenteHijo.filas?.value || [];
        if (filasEquipos.length === 0) {
            this.formUtils.alertaNoPermitidoClase('Sin Datos', 'No hay registros en la tabla para exportar.');
            return;
        }

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Rutas Fijas');

        // 1. Formato exacto de Fecha y Hora del PDF
        const ahora = new Date();
        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const anio = ahora.getFullYear();
        const fechaStr = `${dia}/${mes}/${anio}`; // 👈 Fuerza estrictamente el formato DD/MM/AAAA sin importar el entorno

        const horaStr = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // Encabezado del reporte
        worksheet.mergeCells('A3:F3');
        const celdaTitulo = worksheet.getCell('A3');
        celdaTitulo.value = 'RUTAS DE MATERIAL DE PESAJE FIJO POR BALANZA';
        celdaTitulo.font = { name: 'Arial', size: 12, bold: true };
        celdaTitulo.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 25;

        // Bloque lateral de metadata igual al PDF
        worksheet.mergeCells('E1:F1');
        worksheet.mergeCells('E2:F2');

        worksheet.getCell('F1').value = `FECHA: ${fechaStr}`;
        worksheet.getCell('F1').font = { name: 'Arial', size: 8, bold: false };
        worksheet.getCell('F1').alignment = { horizontal: 'right' };

        worksheet.getCell('F2').value = `HORA: ${horaStr}`;
        worksheet.getCell('F2').font = { name: 'Arial', size: 8, bold: false };
        worksheet.getCell('F2').alignment = { horizontal: 'right' };

        worksheet.addRow([]); // Espaciador

        // Definición de estilo para bordes negros delgados continuos (Malla)
        const bordeNegroDelgado = {
            top: { style: 'dashed', color: { argb: 'FF000000' } },
            left: { style: 'dashed', color: { argb: 'FF000000' } },
            bottom: { style: 'dashed', color: { argb: 'FF000000' } },
            right: { style: 'dashed', color: { argb: 'FF000000' } }
        } as const;

        // 2. Encabezados de la Tabla
        const columnasEncabezado = ['Cód. Ruta', 'Zona', 'Punto Origen', 'Punto Destino', 'Material', 'Estado'];
        const headerRow = worksheet.addRow(columnasEncabezado);
        headerRow.height = 22;

        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE6E6E6' } // Gris #E6E6E6 del PDF
            };
            cell.font = { name: 'Arial', size: 8.5, bold: true, color: { argb: 'FF000000' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = bordeNegroDelgado; // 👈 Borde negro
        });

        // 3. Filas de Datos de la Tabla
        filasEquipos.forEach((fila: any) => {
            const materialSeleccionado = componenteHijo.listSvalTablaDetalle().find(
                (item: any) => item.cod_item === fila.cod_item
            );

            const dataRow = worksheet.addRow([
                fila.cod_item_ruta || '',
                fila.c_t_zona || '',
                fila.c_t_origen || '',
                fila.c_t_destino || '',
                materialSeleccionado?.des_tabladet || fila.cod_item || '',
                fila.flg_vigente === '1' ? 'ACTIVO' : 'INACTIVO'
            ]);

            dataRow.height = 18;

            dataRow.eachCell((cell) => {
                cell.font = { name: 'Arial', size: 8 };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = bordeNegroDelgado; // 👈 Mismo contorno de borde negro para la cuadrícula
            });
        });

        // Totalizador al pie de la tabla
        worksheet.addRow([]);
        const totalRow = worksheet.addRow([`Total Equipos: ${filasEquipos.length}`]);
        totalRow.getCell(1).font = { name: 'Arial', size: 9, bold: true };

        // Dimensionamiento de anchos de columna
        worksheet.columns = [
            { width: 15 }, // Cód. Ruta
            { width: 18 }, // Zona
            { width: 26 }, // Punto Origen
            { width: 26 }, // Punto Destino
            { width: 22 }, // Material
            { width: 15 }  // Estado
        ];

        // Descarga del libro
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `Reporte_Rutas_Fijas_${fechaStr.replace(/\//g, '-')}.xlsx`);
        }).catch(err => console.error('Error al generar Excel:', err));
    }


    public exportarExcelTransporteMineral(): void {
        const filtrosReporte: EntradaTarifarioDetalleReporte = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            ind_material: 'M'
        };

        this.servioTransporteService.obtenerTransporteMineralReporte(filtrosReporte).subscribe({
            next: async (filasEquipos: TarifarioTransporteDetalle[]) => {

                if (!filasEquipos || filasEquipos.length === 0) {
                    this.formUtils.alertaNoPermitidoClase('Sin Datos', 'No hay registros en la base de datos para exportar con los filtros seleccionados.');
                    return;
                }

                const formatoNum = (valor: any): number => {
                    const n = Number(valor);
                    return isNaN(n) ? 0 : Number(n.toFixed(3));
                };

                const grupos = new Map<string, any[]>();
                filasEquipos.forEach((fila: any) => {
                    const categoria = (fila.ind_material || 'SIN CATEGORÍA').toString().toUpperCase().trim();
                    if (!grupos.has(categoria)) {
                        grupos.set(categoria, []);
                    }
                    grupos.get(categoria)!.push(fila);
                });

                const ahora = new Date();
                const dia = String(ahora.getDate()).padStart(2, '0');
                const mes = String(ahora.getMonth() + 1).padStart(2, '0');
                const anio = ahora.getFullYear();
                const fechaStr = `${dia}/${mes}/${anio}`;

                // =========================================================
                // Construcción del workbook con ExcelJS
                // =========================================================
                const workbook = new Workbook();
                const hoja = workbook.addWorksheet('Transporte Mineral');

                hoja.columns = [
                    { width: 10 },  // Cód. Ruta
                    { width: 28 },  // Origen
                    { width: 28 },  // Intermedio
                    { width: 28 },  // Destino
                    { width: 14 },  // Zona
                    { width: 10 },  // Dist KM
                    { width: 14 },  // PU
                    { width: 14 },  // Precio
                    { width: 14 }   // Centro Costos
                ];

                const bordeFino = {
                    top: { style: 'thin' as const },
                    left: { style: 'thin' as const },
                    bottom: { style: 'thin' as const },
                    right: { style: 'thin' as const }
                };

                // ----- Título principal -----
                hoja.mergeCells('A1:I1');
                const filaTitulo = hoja.getCell('A1');
                filaTitulo.value = 'RESUMEN DE PRECIOS UNITARIOS DEL SERVICIO DE TRANSPORTE';
                filaTitulo.font = { bold: true, size: 12 };
                filaTitulo.alignment = { horizontal: 'center' };

                hoja.mergeCells('A2:I2');
                const filaContrato = hoja.getCell('A2');
                filaContrato.value = `Nº DOCUMENTO: ${this.cod_contrato()} - CONTRATA: Cn Mineria Y Construccion S.A.C.`;
                filaContrato.font = { bold: false, size: 10 };
                filaContrato.alignment = { horizontal: 'center' };

                hoja.mergeCells('A3:I3');
                const filaFecha = hoja.getCell('A3');
                filaFecha.value = `FECHA: ${fechaStr}`;
                filaFecha.font = { size: 9 };
                filaFecha.alignment = { horizontal: 'right' };

                hoja.addRow([]); // separación

                // =========================================================
                // Por cada categoría agrupada
                // =========================================================
                grupos.forEach((filasGrupo, nombreCategoria) => {

                    const filaRutasActivasIdx = hoja.lastRow!.number + 1;
                    hoja.mergeCells(`A${filaRutasActivasIdx}:I${filaRutasActivasIdx}`);
                    const celdaRutasActivas = hoja.getCell(`A${filaRutasActivasIdx}`);
                    celdaRutasActivas.value = 'RUTAS ACTIVAS';
                    celdaRutasActivas.font = { bold: true, size: 11 };
                    celdaRutasActivas.alignment = { horizontal: 'center' };

                    const filaCategoriaIdx = filaRutasActivasIdx + 1;
                    const celdaCategoria = hoja.getCell(`A${filaCategoriaIdx}`);
                    celdaCategoria.value = nombreCategoria;
                    celdaCategoria.font = { bold: true, size: 10 };

                    // ----- Header de 2 niveles -----
                    const filaHeaderSupIdx = filaCategoriaIdx + 1;
                    const filaHeaderInfIdx = filaHeaderSupIdx + 1;

                    hoja.getRow(filaHeaderSupIdx).values = [
                        'Cód.\nRuta', 'Lugar', '', '', 'Zona', 'Dist.\nKM', 'PU S/.\nTMH x KM', 'Precio S/.\nx Proced.', 'Centro\nCostos'
                    ];
                    hoja.getRow(filaHeaderInfIdx).values = [
                        '', 'Origen', 'Intermedio', 'Destino', '', '', '', '', ''
                    ];

                    // Merges del header
                    hoja.mergeCells(filaHeaderSupIdx, 1, filaHeaderInfIdx, 1); // Cód. Ruta
                    hoja.mergeCells(filaHeaderSupIdx, 2, filaHeaderSupIdx, 4); // Lugar (colspan 3)
                    hoja.mergeCells(filaHeaderSupIdx, 5, filaHeaderInfIdx, 5); // Zona
                    hoja.mergeCells(filaHeaderSupIdx, 6, filaHeaderInfIdx, 6); // Dist KM
                    hoja.mergeCells(filaHeaderSupIdx, 7, filaHeaderInfIdx, 7); // PU
                    hoja.mergeCells(filaHeaderSupIdx, 8, filaHeaderInfIdx, 8); // Precio
                    hoja.mergeCells(filaHeaderSupIdx, 9, filaHeaderInfIdx, 9); // Centro Costos

                    // Estilo de ambas filas de header
                    [filaHeaderSupIdx, filaHeaderInfIdx].forEach(numFila => {
                        const fila = hoja.getRow(numFila);
                        fila.eachCell({ includeEmpty: true }, celda => {
                            celda.font = { bold: true, size: 9 };
                            celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                            celda.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFEBEBEB' }
                            };
                            celda.border = bordeFino;
                        });
                    });

                    // ----- Filas de datos -----
                    filasGrupo.forEach((fila: any) => {
                        const nuevaFila = hoja.addRow([
                            fila.cod_item_ruta || '',
                            fila.c_t_origen || '',
                            fila.c_t_intermedio || '',
                            fila.c_t_destino || '',
                            fila.c_t_zona || '',
                            formatoNum(fila.nro_distancia_km),
                            formatoNum(fila.imp_tmh_km_soles),
                            formatoNum(fila.imp_ruta_pu),
                            fila.cto_cod || ''
                        ]);

                        nuevaFila.eachCell({ includeEmpty: true }, (celda, numCol) => {
                            celda.font = { size: 9 };
                            celda.border = bordeFino;
                            celda.alignment = {
                                horizontal: [1, 5, 9].includes(numCol) ? 'center' : ([6, 7, 8].includes(numCol) ? 'right' : 'left'),
                                vertical: 'middle'
                            };
                            if ([6, 7, 8].includes(numCol)) {
                                celda.numFmt = '0.000';
                            }
                        });
                    });

                    hoja.addRow([]); // separación entre grupos
                });

                // =========================================================
                // Generamos el archivo y lo descargamos
                // =========================================================
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'Reporte_Tarifario_Mineral.xlsx');
            },
            error: () => {
                // Manejo de error ya cubierto por el catchError del servicio
            }
        });
    }


    public async exportarExcelTransporteOtros(ind_material: string, titulo: string, nombreSalida: string): Promise<void> {
        const filtrosReporte: EntradaTarifarioDetalleReporte = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            ind_material: ind_material
        };

        this.servioTransporteService.obtenerTransporteOtrosReporteEstructurado(filtrosReporte).subscribe({
            next: async (respuesta: ReporteTransporteOtrosResponse) => {

                const activas = respuesta.rutasActivas || [];
                const inactivas = respuesta.rutasInactivas || [];

                if (activas.length === 0 && inactivas.length === 0) {
                    this.formUtils.alertaNoPermitidoClase('Sin Datos', 'No hay registros en la base de datos para exportar.');
                    return;
                }

                const formatoNum = (valor: any): number => {
                    const n = Number(valor);
                    return isNaN(n) ? 0 : Number(n.toFixed(3));
                };

                const ahora = new Date();
                const dia = String(ahora.getDate()).padStart(2, '0');
                const mes = String(ahora.getMonth() + 1).padStart(2, '0');
                const anio = ahora.getFullYear();
                const fechaStr = `${dia}/${mes}/${anio}`;

                const horas = String(ahora.getHours()).padStart(2, '0');
                const minutos = String(ahora.getMinutes()).padStart(2, '0');
                const segundos = String(ahora.getSeconds()).padStart(2, '0');
                const horaStr = `${horas}:${minutos}:${segundos}`;

                const workbook = new Workbook();
                const hoja = workbook.addWorksheet(titulo);

                hoja.columns = [
                    { width: 10 },  // Cód. Ruta
                    { width: 28 },  // Origen
                    { width: 28 },  // Intermedio
                    { width: 28 },  // Destino
                    { width: 14 },  // Zona
                    { width: 10 },  // Dist KM
                    { width: 14 },  // PU
                    { width: 14 },  // Precio
                    { width: 14 }   // Centro Costos
                ];

                const bordeFino = {
                    top: { style: 'dashed' as const },
                    left: { style: 'dashed' as const },
                    bottom: { style: 'dashed' as const },
                    right: { style: 'dashed' as const }
                };

                // ----- Título principal -----
                hoja.mergeCells('A1:I1');
                const filaTitulo = hoja.getCell('A1');
                filaTitulo.value = 'RESUMEN DE PRECIOS UNITARIOS DEL SERVICIO DE TRANSPORTE';
                filaTitulo.font = { bold: true, size: 12 };
                filaTitulo.alignment = { horizontal: 'center' };

                hoja.mergeCells('A2:I2');
                const filaContrato = hoja.getCell('A2');
                filaContrato.value = `Nº DOCUMENTO: ${this.cod_contrato()} - CONTRATA: Cn Mineria Y Construccion S.A.C.`;
                filaContrato.font = { size: 10 };
                filaContrato.alignment = { horizontal: 'center' };

                hoja.mergeCells('A3:I3');
                const filaFechaHora = hoja.getCell('A3');
                filaFechaHora.value = `FECHA: ${fechaStr}    HORA: ${horaStr}`;
                filaFechaHora.font = { size: 9 };
                filaFechaHora.alignment = { horizontal: 'right' };

                hoja.addRow([]); // separación

                // =========================================================
                // Función reutilizable para renderizar cada bloque
                // =========================================================
                const renderizarBloque = (tituloBloque: string, registros: any[]) => {
                    if (registros.length === 0) return;

                    const filaTituloBloqueIdx = hoja.lastRow!.number + 1;
                    hoja.mergeCells(`A${filaTituloBloqueIdx}:I${filaTituloBloqueIdx}`);
                    const celdaTitulo = hoja.getCell(`A${filaTituloBloqueIdx}`);
                    celdaTitulo.value = tituloBloque;
                    celdaTitulo.font = { bold: true, size: 11 };
                    celdaTitulo.alignment = { horizontal: 'center' };

                    const filaSubcatIdx = filaTituloBloqueIdx + 1;
                    const celdaSubcat = hoja.getCell(`A${filaSubcatIdx}`);
                    celdaSubcat.value = titulo;
                    celdaSubcat.font = { bold: true, size: 10 };

                    // ----- Header de 2 niveles -----
                    const filaHeaderSupIdx = filaSubcatIdx + 1;
                    const filaHeaderInfIdx = filaHeaderSupIdx + 1;

                    hoja.getRow(filaHeaderSupIdx).values = [
                        'Cód.\nRuta', 'Lugar', '', '', 'Zona', 'Dist.\nKM', 'PU S/.\nTMH x KM', 'Precio S/.\nx Proced.', 'Centro\nCostos'
                    ];
                    hoja.getRow(filaHeaderInfIdx).values = [
                        '', 'Origen', 'Intermedio', 'Destino', '', '', '', '', ''
                    ];

                    hoja.mergeCells(filaHeaderSupIdx, 1, filaHeaderInfIdx, 1);
                    hoja.mergeCells(filaHeaderSupIdx, 2, filaHeaderSupIdx, 4);
                    hoja.mergeCells(filaHeaderSupIdx, 5, filaHeaderInfIdx, 5);
                    hoja.mergeCells(filaHeaderSupIdx, 6, filaHeaderInfIdx, 6);
                    hoja.mergeCells(filaHeaderSupIdx, 7, filaHeaderInfIdx, 7);
                    hoja.mergeCells(filaHeaderSupIdx, 8, filaHeaderInfIdx, 8);
                    hoja.mergeCells(filaHeaderSupIdx, 9, filaHeaderInfIdx, 9);

                    [filaHeaderSupIdx, filaHeaderInfIdx].forEach(numFila => {
                        hoja.getRow(numFila).eachCell({ includeEmpty: true }, celda => {
                            celda.font = { bold: true, size: 9 };
                            celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                            celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F0F0' } };
                            celda.border = bordeFino;
                        });
                    });

                    // ----- Filas de datos -----
                    registros.forEach((fila: any) => {
                        const nuevaFila = hoja.addRow([
                            fila.cod_item_ruta || '',
                            fila.c_t_origen || '',
                            fila.c_t_intermedio || '',
                            fila.c_t_destino || '',
                            fila.c_t_zona || '',
                            formatoNum(fila.nro_distancia_km),
                            formatoNum(fila.imp_tmh_km_soles),
                            formatoNum(fila.imp_ruta_pu),
                            fila.cto_cod || ''
                        ]);

                        nuevaFila.eachCell({ includeEmpty: true }, (celda, numCol) => {
                            celda.font = { size: 9 };
                            celda.border = bordeFino;
                            celda.alignment = {
                                horizontal: [1, 5, 9].includes(numCol) ? 'center' : ([6, 7, 8].includes(numCol) ? 'right' : 'left'),
                                vertical: 'middle'
                            };
                            if ([6, 7, 8].includes(numCol)) {
                                celda.numFmt = '0.000';
                            }
                        });
                    });

                    // ----- Fila de Total (usando fórmula real, no valor calculado en TS) -----
                    const filaInicioDatos = filaHeaderInfIdx + 1;
                    const filaFinDatos = filaInicioDatos + registros.length - 1;

                    const filaTotalIdx = hoja.lastRow!.number + 1;
                    hoja.mergeCells(`A${filaTotalIdx}:G${filaTotalIdx}`);
                    const celdaTextoTotal = hoja.getCell(`A${filaTotalIdx}`);
                    celdaTextoTotal.value = `Total de ${tituloBloque === 'RUTAS ACTIVAS' ? 'Rutas de Transporte' : 'Rutas Inactivas'} (S/.) :`;
                    celdaTextoTotal.font = { bold: true, size: 9 };
                    celdaTextoTotal.alignment = { horizontal: 'right' };

                    const celdaValorTotal = hoja.getCell(`H${filaTotalIdx}`);
                    celdaValorTotal.value = { formula: `SUM(H${filaInicioDatos}:H${filaFinDatos})` };
                    celdaValorTotal.font = { bold: true, size: 9 };
                    celdaValorTotal.numFmt = '0.000';
                    celdaValorTotal.alignment = { horizontal: 'right' };
                    celdaValorTotal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE1E1E1' } };

                    hoja.addRow([]); // separación entre bloques
                };

                renderizarBloque('RUTAS ACTIVAS', activas);
                renderizarBloque('RUTA INACTIVAS', inactivas);

                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `Reporte_${nombreSalida}.xlsx`);
            },
            error: () => { }
        });
    }

}


