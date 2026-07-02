import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContratoDetalleResponse } from '../../interfaces/adm-contrato.interface';
import * as ExcelJS from 'exceljs';

@Component({
    selector: 'app-reporte',
    imports: [],
    templateUrl: './reporte.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteComponent {

    listContrato = input<ContratoDetalleResponse[]>([]);
    fechaDesde = input<string>('');
    fechaHasta = input<string>('');

    private tipoLabel(tipo: string): string {
        const map: Record<string, string> = {
            M: 'OPERACION MINA',
            T: 'SERV. TRANSPORTE',
            A: 'ALQ. EQUIPO PESADO',
            O: 'OTROS'
        };
        return map[tipo] ?? 'DESCONOCIDO';
    }

    private estadoLabel(estado: string): string {
        const map: Record<string, string> = {
            G: 'GENERADO',
            A: 'APROBADO',
            X: 'ANULADO',
            H: 'HISTORICO'
        };
        return map[estado] ?? 'DESCONOCIDO';
    }

    private formatFecha(fecha?: string | Date): string {
        if (!fecha) return '00/00/0000';
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return '00/00/0000';
        return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    private agrupar(): Record<string, ContratoDetalleResponse[]> {
        const grupos: Record<string, ContratoDetalleResponse[]> = {};
        for (const c of this.listContrato()) {
            const tipo = c.ind_tipo_contrato ?? '?';
            if (!grupos[tipo]) grupos[tipo] = [];
            grupos[tipo].push(c);
        }
        return grupos;
    }

    public imprimir(): void {
        const ahora = new Date();
        const fechaHora = ahora.toLocaleDateString('es-PE', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        }) + ' ' + ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

        const desde = this.fechaDesde() || '01/01/2019';
        const hasta = this.fechaHasta() || ahora.toLocaleDateString('es-PE', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const grupos = this.agrupar();

        let filasHtml = '';
        for (const tipo of Object.keys(grupos)) {
            const contratos = grupos[tipo];
            filasHtml += `
                <tr>
                <td colspan="11" class="grupo-header"><u>${this.tipoLabel(tipo)}</u></td>
                </tr>
            `;
            for (const c of contratos) {
                filasHtml += `
                <tr>
                    <td>${c.cod_contrato ?? ''}</td>
                    <td>${c.c_t_equipo_alq ?? ''}</td>
                    <td>${c.c_t_contrata ?? ''}</td>
                    <td>${c.c_t_ruc ?? ''}</td>
                    <td>${this.formatFecha(c.fec_firma)}</td>
                    <td>${this.formatFecha(c.fec_inicio)}</td>
                    <td>${this.formatFecha(c.fec_termino)}</td>
                    <td>${c.imp_tipo_cambio?.toFixed(3) ?? ''}</td>
                    <td>${c.nro_adendum ?? ''}</td>
                    <td>${c.c_n_dias_curso ?? ''}</td>
                    <td>${this.estadoLabel(c.ind_estado ?? '')}</td>
                </tr>
                `;
            }
            filasHtml += `
        <tr class="subtotal">
          <td colspan="11">N°.: ${contratos.length}</td>
        </tr>
        <tr><td colspan="11" style="height:8px"></td></tr>
        `;
        }

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Listado de Contratos por Tipo</title>
            <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; }
            .page { padding: 15mm 10mm; }
    
            .header-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .header-top .empresa { font-size: 8.5pt; }
            .header-top .meta { text-align: right; font-size: 8.5pt; }
    
            .titulo { text-align: center; margin: 10px 0 4px; font-size: 11pt; font-weight: bold; }
            .subtitulo { text-align: center; font-size: 9pt; margin-bottom: 12px; }
    
            table { width: 100%; border-collapse: collapse; }
            thead tr th {
                border: 1px solid #000;
                padding: 3px 4px;
                text-align: center;
                font-size: 8pt;
                background: #fff;
            }
            tbody tr td {
                border-bottom: none;
                border-left: none;
                border-right: none;
                border-top: none;
                padding: 2px 4px;
                font-size: 8pt;
                vertical-align: top;
            }
            .grupo-header td {
                font-weight: bold;
                padding: 6px 4px 2px;
                font-size: 8.5pt;
            }
            .subtotal td {
                border-top: 1px dashed #555;
                border-bottom: 1px dashed #555;
                padding: 2px 4px;
                font-size: 8pt;
            }
    
            @media print {
                body { -webkit-print-color-adjust: exact; }
            }
            </style>
        </head>
        <body>
            <div class="page">
            <div class="header-top">
                <div class="empresa">
                <div>Sistema Integrado de Operaciones Minero Metalúrgicas (SIOMM)</div>
                <div>Compañía Minera Condestable S.A.</div>
                <div>Unidad Condestable</div>
                </div>
                <div class="meta">
                <div>${fechaHora}</div>
                <div>Página 1 de 1</div>
                <div>d_r_contrato_gr</div>
                </div>
            </div>
    
            <div class="titulo">LISTADO DE CONTRATOS POR TIPO</div>
            <div class="subtitulo">DEL ${desde} AL ${hasta}</div>
    
            <table>
                <thead>
                <tr>
                    <th>N° Contrato</th>
                    <th>Equipo Alquilado</th>
                    <th>Contrata</th>
                    <th>Ruc</th>
                    <th>Fecha Firma</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Termino</th>
                    <th>Tipo Cambio</th>
                    <th>Ult. Aden.</th>
                    <th>Dias</th>
                    <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                ${filasHtml}
                </tbody>
            </table>
            </div>
        </body>
        </html>
    `;

        const ventana = window.open('', '_blank', 'width=1000,height=700');
        if (!ventana) {
            alert('Por favor permite las ventanas emergentes para imprimir.');
            return;
        }
        ventana.document.write(html);
        ventana.document.close();
        ventana.focus();
        // Después
        setTimeout(() => {
            ventana.print();
            // ← quita el ventana.close()
        }, 500);
    }

    public async descargarExcel(): Promise<void> {
        const grupos = this.agrupar();
        const ahora = new Date();
        const desde = this.fechaDesde() || '01/01/2019';
        const hasta = this.fechaHasta() || ahora.toLocaleDateString('es-PE');

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Contratos');

        // ── Anchos de columna ──
        sheet.columns = [
            { width: 13 }, { width: 16 }, { width: 38 }, { width: 14 },
            { width: 12 }, { width: 12 }, { width: 13 },
            { width: 11 }, { width: 10 }, { width: 7 }, { width: 13 }
        ];

        // ── Fila 1: Título ──
        const filaTitulo = sheet.addRow(['LISTADO DE CONTRATOS POR TIPO']);
        sheet.mergeCells(`A${filaTitulo.number}:K${filaTitulo.number}`);
        filaTitulo.getCell(1).style = {
            font: { bold: true, size: 14, color: { argb: 'FF1e3a5f' } },
            alignment: { horizontal: 'center', vertical: 'middle' },
        };
        filaTitulo.height = 22;

        // ── Fila 2: Subtítulo ──
        const filaSubtitulo = sheet.addRow([`DEL ${desde} AL ${hasta}`]);
        sheet.mergeCells(`A${filaSubtitulo.number}:K${filaSubtitulo.number}`);
        filaSubtitulo.getCell(1).style = {
            font: { bold: true,  size: 10, color: { argb: 'FF374151' } },
            alignment: { horizontal: 'center' },
        };
        filaSubtitulo.height = 16;

        // ── Fila vacía ──
        sheet.addRow([]);

        // ── Encabezados ──
        const encabezados = [
            'N° Contrato', 'Equipo Alquilado', 'Contrata', 'RUC',
            'Fecha Firma', 'Fecha Inicio', 'Fecha Término',
            'Tipo Cambio', 'Ult. Aden.', 'Días', 'Estado'
        ];
        const filaEnc = sheet.addRow(encabezados);
        filaEnc.height = 28;
        filaEnc.eachCell(cell => {
            cell.style = {
                font: { bold: true, size: 9, color: { argb: 'FF000000' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCAD5E2' } },
                alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
                border: {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } },
                }
            };
        });

        // ── Datos por grupo ──
        for (const tipo of Object.keys(grupos)) {
            const contratos = grupos[tipo];

            // Header de grupo
            const filaGrupo = sheet.addRow([this.tipoLabel(tipo)]);
            sheet.mergeCells(`A${filaGrupo.number}:K${filaGrupo.number}`);
            filaGrupo.height = 18;
            filaGrupo.getCell(1).style = {
                font: { bold: true, size: 9, underline: true, color: { argb: 'FF1e3a5f' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFdbeafe' } },
                alignment: { horizontal: 'left', vertical: 'middle' },
                border: {
                    top: { style: 'dashed', color: { argb: 'FF888888' } },
                    bottom: { style: 'dashed', color: { argb: 'FF888888' } },
                    left: { style: 'dashed', color: { argb: 'FF888888' } },
                    right: { style: 'dashed', color: { argb: 'FF888888' } },
                }
            };

            // Filas de datos
            contratos.forEach((c, i) => {
                const fila = sheet.addRow([
                    c.cod_contrato ?? '',
                    c.c_t_equipo_alq ?? '',
                    c.c_t_contrata ?? '',
                    c.c_t_ruc ?? '',
                    this.formatFecha(c.fec_firma),
                    this.formatFecha(c.fec_inicio),
                    this.formatFecha(c.fec_termino),
                    c.imp_tipo_cambio?.toFixed(3) ?? '',
                    c.nro_adendum ?? '',
                    c.c_n_dias_curso ?? '',
                    this.estadoLabel(c.ind_estado ?? '')
                ]);
                fila.height = 16;

                const bgColor = i % 2 === 0 ? 'FFFFFFFF' : 'FFf8fafc';
                fila.eachCell((cell, colNum) => {
                    cell.style = {
                        font: { size: 8, color: { argb: 'FF111827' } },
                        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } },
                        alignment: {
                            horizontal: colNum === 3 ? 'left' : 'center',
                            vertical: 'middle'
                        },
                        border: {
                            top: { style: 'dashed', color: { argb: 'FF555555' } },
                            bottom: { style: 'dashed', color: { argb: 'FF555555' } },
                            left: { style: 'dashed', color: { argb: 'FF555555' } },
                            right: { style: 'dashed', color: { argb: 'FF555555' } },
                        }
                    };
                });
            });

            // Subtotal
            const filaTotal = sheet.addRow([`N°.: ${contratos.length}`]);
            sheet.mergeCells(`A${filaTotal.number}:K${filaTotal.number}`);
            filaTotal.height = 16;
            filaTotal.getCell(1).style = {
                font: { bold: true, size: 8, color: { argb: 'FF374151' } },
                fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf3f4f6' } },
                alignment: { horizontal: 'left' },
                border: {
                    top: { style: 'dashed', color: { argb: 'FF555555' } },
                    bottom: { style: 'dashed', color: { argb: 'FF555555' } },
                }
            };

            sheet.addRow([]);
        }

        // ── Descargar ──
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'listado_contratos.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }
}


