import { ActivatedRoute, Router } from '@angular/router';
import { Component, effect, ElementRef, EventEmitter, inject, input, Output, output, signal, ViewChild } from '@angular/core';
import {
    ARREGLO_BOTONES_PR_MENSUAL, BotonesInterface, ExportarProgramacion,
    ExportarProgramacionResponse,
    HEADERS_PROGRAM, ListaMensual, PreAprobacionResponse,
    responseImportar
} from '../../../interface/programa-mensual.interface';
import { CommonModule } from '@angular/common';
import { ListaMensualService } from '../../../services/lista-mensual.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { DatosLoginCompartidoService } from 'src/app/module/planing/service/datos-login-compartido.service';
import { MaeUsuario } from 'src/app/module/auth/interfaces/auth.interface';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { finalize } from 'rxjs/operators';
import { EdicionProgrmaMensualService } from '../../../services';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';

export interface BotonColores {
    texto: string;
    color: string;
}

export interface BotonesEstado {
    nuevo: boolean,
    anular: boolean,
    aprobar: boolean,
    preAprobar: boolean,
    copiar: boolean,
    exportar: boolean
}

@Component({
    selector: 'app-nav-bar-botones',
    imports: [CommonModule],
    templateUrl: './nav-bar-botones.component.html',
})
export class NavBarBotonesComponent {
    private datosLoginCompartidoService = inject(DatosLoginCompartidoService);

    botones = signal<BotonesInterface[]>(ARREGLO_BOTONES_PR_MENSUAL);


    private listaMensualService = inject(ListaMensualService);

    private edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);

    private router = inject(Router);
    private formUtils = FormUtils;
    botonSeleccionado = output<BotonColores>({});

    // cargarListaMensual = output()


    cargarListaMensual = output<{ anio: string, mes?: string | null }>();

    abrirModalCopiar = output<number>();

    cie_anio = input<string>('');
    cie_per = input<string | null>('');

    listaPrograma = input<ListaMensual[]>([]);

    @ViewChild('fileInput') fileInput!: ElementRef;


    botonesBloqueados = input<BotonesEstado>();

    estadoBotones = signal<any>({});

    constructor() {

        effect(() => {
            const usuarioRecibido = this.datosLoginCompartidoService.usuario();
            this.devolverUsuArea(usuarioRecibido)
            this.estadoBotones.set(this.botonesBloqueados());
        })


    }



    public onAccion(tipo: string) {

        const boton = this.botones().find(b => b.accion === tipo);

        if (boton) {
            this.botonSeleccionado.emit({
                texto: boton.texto,
                color: boton.color
            });
        }

        switch (tipo) {
            case 'nuevo':
                this.formUtils.confirmarAnulacion('Crear Nuevos programas', `
                <b>¿Desea agregar nuevo programa mensual?</b> <br>
                Se enviara a una nueva interaz para agregar registros.
                `, 'Si, ir a nuevo', 'No, quedarme').then(result => {
                    if (!result.isConfirmed) return;
                    this.onNuevo();
                })

                break;

            case 'anular':
                this.onAnular();
                break;

            case 'aprobar':
                this.onAprobar();
                break;

            case 'preAprobar':
                this.onPreAprobacion();
                break;



            case 'importar':

                if (!this.cie_anio()) {
                    this.formUtils.alertaErrorAnulacion(
                        'Importación de Archivo',
                        'Debe seleccionar al menos el año para importar',
                    );
                    break;
                }

                const anio = this.cie_anio();
                const mesIndex = this.cie_per();

                const mesTexto = mesIndex != null
                    ? this.formUtils.meses[mesIndex]
                    : null;

                const mensaje = mesTexto
                    ? `<b>¿Desea importar el archivo con el año ${anio} y mes ${mesTexto}?</b><br>`
                    : `<b>¿Desea importar el archivo con el año ${anio}?</b><br>`;

                this.formUtils.confirmarAnulacion(
                    'Importación de Archivo',
                    mensaje + 'El archivo se subirá a la BD.',
                    'Sí, Importar', 'No Importar'
                ).then(result => {
                    if (!result.isConfirmed) return;
                    this.fileInput.nativeElement.click();
                });

                break;

            case 'copiar':
                this.onCopiaPrograma();
                break;

            case 'exportar':
                this.formUtils.confirmarAnulacion('Exportación de Archivo', `
                <b>¿Estás seguro de que deseas exportar este archivo?</b> <br>
                El archivo se guardara en su ordenador.
                `, 'Si, Exportar', 'No Exportar').then(result => {
                    if (!result.isConfirmed) return;
                    this.onExpotar();
                })

                break;

            default:
                console.warn('Acción no reconocida:', tipo);
        }
    }

    //ACCCIONES BOTONES
    private onExpotar() {
        this.exportarPrograma();
    }

    private onCopiaPrograma() {
        this.abrirModalCopiar.emit(1);
    }




    public onImportar(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        this.formUtils.mostrarCargando("Importando Archivo...");
        this.listaMensualService
            .importarArchivo(formData)
            .subscribe({
                next: (resp: responseImportar) => {
                    if (resp.respuesta) {
                        this.formUtils.alertaExitoAnulacion("Importación de Archivo", resp.mensaje);
                        input.value = '';
                    } else {
                        this.formUtils.alertaErrorAnulacion("Error en Importación", resp.mensaje);
                        input.value = '';
                    }
                },
                error: error => console.log(error)
            });
    }

    private async onPreAprobacion() {
        const row = this.listaPrograma()[0];
        const prg_est = row.prg_est;
        const nro_prog = row.nro_prog;
        const prg_pre_apr = row.prg_pre_apr || null;

        if (prg_est === "B") {
            this.formUtils.alertaNoPermitido(
                "Programación Pre-aprobado",
                "Programación no puede ser pre-aprobado, ya fue Aprobado..."
            );
            return;
        }

        if (prg_est === "A") {
            this.formUtils.alertaNoPermitido(
                "Programación Pre-aprobado",
                "Programación no puede ser pre-aprobado, ya fue anulado..."
            );
            return;
        }

        this.formUtils.confirmarAnulacion(
            'Confirmar Pre-Aprobación',
            `<b>Pre-Aprobación de la Programación:</b> ${nro_prog} <br>
        Esta acción cambiará el estado a <b>Pre-Aprobación</b>.`,
            'Si, Pre-aprobar', 'No Pre-aprobar'
        ).then(result => {

            // ❌ SI CANCELA
            if (!result.isConfirmed) {
                this.formUtils.alertaNoPermitido(
                    'Operación cancelada',
                    'El usuario canceló la pre-aprobación.'
                );
                return;
            }

            // ✔ SI CONFIRMA
            this.listaMensualService.preAprobacion(nro_prog, prg_pre_apr).subscribe({
                next: (resp: PreAprobacionResponse) => {
                    if (resp.ok) {
                        this.formUtils.alertaExitoAnulacion(
                            "Pre-aprobación exitosa",
                            resp.mensaje as string
                        );
                        row.prg_pre_apr = resp.nuevo_estado as string;
                    } else {
                        this.formUtils.alertaNoPermitido(
                            "Hubo un error",
                            resp.mensaje as string
                        );
                    }
                },
                error: () => {
                    this.formUtils.alertaErrorAnulacion(
                        'Error en la operación',
                        'Ocurrió un problema al intentar pre-aprobar.'
                    );
                }
            });
        });
    }


    private onNuevo() {
        if (!this.cie_anio() || !this.cie_per()) {
            this.formUtils.alertaProgAnulada('Datos Obligatorios', 'Debe enviar el año y el mes obligatoriamente.');
            return;
        }

        this.edicionProgrmaMensualService.setModo('nuevo');

        this.router.navigate([
            '/menu-principal/planeamiento/programa_mensual_de_labores/detalle-programacion',
            'nuevo',
            this.cie_anio(),
            this.cie_per(),
        ]);
    }

    private onAnular() {
        const username = sessionStorage.getItem('username');


        const prog = this.listaPrograma()[0];
        if (!prog) return;

        const estado = prog.prg_est;
        const nroProg = prog.nro_prog;

        if (estado === 'B') {
            this.formUtils.alertaProgAprobada('Programación Aprobada', 'No es posible anular esta programación porque ya fue aprobada.');
            return;
        }

        if (estado === 'A') {
            this.formUtils.alertaProgAnulada('Programación ya anulada.', 'Esta programación ya se encuentra en estado ANULADO.');
            return;
        }

        if (estado === 'G') {

            this.formUtils.confirmarAnulacion('Confirmar anulación', `
                <b>Programación:</b> ${nroProg} <br>
                Esta acción cambiará el estado a <b>ANULADO</b>.
            `, 'Si, Anular', 'No Anular').then(result => {

                if (!result.isConfirmed) return;

                prog.prg_est = 'A';

                this.listaMensualService.anularProgramacion(nroProg).subscribe({
                    next: () => {
                        this.formUtils.alertaExitoAnulacion('Programación anulada', `La programación <b>${nroProg}</b> fue anulada correctamente.`),
                            this.cargarListaMensual.emit({
                                anio: this.cie_anio(),
                                mes: this.cie_per()
                            })
                    },
                    error: () => {
                        this.formUtils.alertaErrorAnulacion('Error en la operación', 'Ocurrió un problema al intentar anular la programación.');
                    }
                });
            });

            return;
        }

        this.formUtils.alertaNoPermitido('Acción no permitida', 'La programación no puede ser anulada en su estado actual.');
    }


    private onAprobar() {
        if (!this.listaPrograma()) {
            return;
        }

        const prg_est = this.listaPrograma()[0].prg_est;
        const nro_prog = this.listaPrograma()[0].nro_prog;

        // Programación ya aprobada
        if (prg_est === 'B') {
            this.formUtils.alertaProgAprobada('Programación Aprobada', 'Programación no puede ser aprobada, ya fue Aprobada...');
            return;
        }

        // Programación anulada
        if (prg_est === 'A') {
            this.formUtils.alertaProgAnulada('Programación ya anulada.', 'Programación no puede ser aprobada, ya fue anulada...');
            return;
        }

        const confirmar = this.formUtils.confirmarAnulacion('Confirmar anulación',
            `Aprobación de la Programación ${nro_prog} ...?`, 'Si, Anular', 'No Anular')

        if (!confirmar) {
            return;
        }

        const prg_apr_geo = this.listaPrograma()[0].prg_apr_geo;

        const prg_apr_min = this.listaPrograma()[0].prg_apr_min;
        const prg_pre_apr = this.listaPrograma()[0].prg_pre_apr;

        const cod_usuario_apr = this.listaPrograma()[0].cod_usuario_apr;

        this.formUtils
            .confirmarAnulacion(
                'Confirmar Aprobación',
                `
                    <b>Programación:</b> ${nro_prog} <br>
                    Esta acción cambiará el estado a <b>APROBADO</b>. ¿Desea aprobarlo?
                    `, 'Si, Aprobar' ,'No Aprobar'
            )
            .then((result) => {

                // Si el usuario cancela
                if (!result.isConfirmed) {
                    this.formUtils.alertaNoPermitido(
                        'Acción cancelada',
                        'La aprobación de la programación fue cancelada.'
                    );
                    return;
                }
                // Si el usuario confirma
                this.listaMensualService
                    .aprobarProgramacion(nro_prog, cod_usuario_apr)
                    .subscribe({
                        next: () => {
                            // this.listaPrograma()[0].prg_est = 'B';

                            this.formUtils.alertaExitoAnulacion(
                                'Programación Aprobada',
                                `La programación <b>${nro_prog}</b> fue aprobada correctamente.`
                            );
                            this.cargarListaMensual.emit({
                                anio: this.cie_anio(),
                                mes: this.cie_per()
                            })
                        },
                        error: () => {
                            this.formUtils.alertaErrorAnulacion(
                                'Alerta no Aprobación',
                                'Error al aprobar la programación.'
                            );
                        }
                    });
            });


    }






    // PARA VALIDAR CON LOS USUARIOS
    private devolverUsuArea(usuarioRecibido: MaeUsuario | null): string {
        if (!usuarioRecibido) return '';

        if (usuarioRecibido.ind_usu_geo === 'S') return 'GEO';

        if (usuarioRecibido.ind_usu_min === 'S') return 'MIN';

        if (usuarioRecibido.ind_usu_plt === 'S') return 'PLA';

        return '';
    }


    // METODOS PARA EXPORTAR A ARCHIVOS EXCEL
    private exportarExcel(data: ExportarProgramacion[]) {

        const headers = HEADERS_PROGRAM;
        const rows = this.formUtils.buildRows(data);

        const dataSheet = [headers, ...rows];
        const worksheet = XLSX.utils.aoa_to_sheet(dataSheet);

        this.autoWidth(worksheet, dataSheet);
        this.applyStyles(worksheet, headers);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista-programa-mensual');

        XLSX.writeFile(workbook, 'Programa-Mensual.xlsx', {
            compression: true,
            cellStyles: true
        });
    }

    private autoWidth(worksheet: XLSX.WorkSheet, dataSheet: any[]) {
        const colCount = dataSheet[0].length;
        const colWidths = [];

        for (let i = 0; i < colCount; i++) {
            let maxLength = 0;

            dataSheet.forEach(row => {
                const value = row[i] ?? "";
                const length = value.toString().length;
                if (length > maxLength) maxLength = length;
            });

            // max width limitado a 40 caracteres
            colWidths.push({ wch: Math.min(maxLength + 3, 40) });
        }

        worksheet['!cols'] = colWidths;
    }

    private applyStyles(worksheet: XLSX.WorkSheet, headers: string[]) {

        const range = XLSX.utils.decode_range(worksheet['!ref']!);

        const columnasResaltadas = [
            headers.indexOf("Tratamiento"),
            headers.indexOf("Nivel"),
            headers.indexOf("Veta"),
            headers.indexOf("Tipo Lab."),
            headers.indexOf("TMS Total"),
            headers.indexOf("Nro Tram Min"),
            headers.indexOf("TMS Extraido"),
            headers.indexOf("Rentabilidad")
        ];

        for (let r = range.s.r; r <= range.e.r; r++) {
            for (let c = range.s.c; c <= range.e.c; c++) {

                const cellAddress = XLSX.utils.encode_cell({ r, c });

                if (!worksheet[cellAddress]) {
                    worksheet[cellAddress] = { t: "s", v: "" };
                }

                if (r === 0) {
                    worksheet[cellAddress].s = this.formUtils.headerStyle();
                }
                else if (columnasResaltadas.includes(c)) {
                    worksheet[cellAddress].s = this.formUtils.highlightStyle();
                }
                else {
                    worksheet[cellAddress].s = this.formUtils.defaultStyle();
                }
            }
        }
    }

    public exportarPrograma() {

        const filtros = this.listaMensualService.getFiltros();
        const nroProgState = this.listaMensualService.getNroProgSeleccionado();

        // ✅ usar fallback directo

        const cie_anio = this.cie_anio() || filtros?.anio || '';
        const cie_per = this.cie_per() || filtros?.mes || null;
        const nro_prog = this.listaPrograma()?.[0]?.nro_prog || nroProgState || null;

        console.log("🚀 ~ file: nav-bar-botones.component.ts:257 ~ cie_anio:", cie_anio,
            "🚀 ~ file: nav-bar-botones.component.ts:257 ~ cie_per:", cie_per,
            "🚀 ~ file: nav-bar-botones.component.ts:257 ~ nro_prog:", nro_prog)

        const soloAnio = cie_anio && !cie_per && !nro_prog;
        const periodoConPrograma = cie_per && nro_prog && cie_anio;

        if (!soloAnio && !periodoConPrograma) {
            this.formUtils.alertaNoPermitido(
                'Validación para Exportar',
                'Solo se permite:\n- Solo Año\n- Periodo + Número de programa'
            );
            return;
        }

        
        this.formUtils.mostrarCargando('Generando Excel...');

        this.listaMensualService
            .exportarPrograma(cie_anio, cie_per, nro_prog)
            .subscribe({
                next: (resp: ExportarProgramacionResponse) => {
                    this.formUtils.cerrarCargando();

                    if (resp.estado === 0) {
                        this.formUtils.alertaNoPermitido(
                            'Exportación',
                            resp.mensaje || `No existe data para el año ${cie_anio}`
                        );
                        return;
                    }

                    if (!resp.data || resp.data.length === 0) {
                        this.formUtils.alertaNoPermitido(
                            'Exportación',
                            `No existe data para el programa ${nro_prog}, mes ${cie_per}, año ${cie_anio}`
                        );
                        return;
                    }

                    this.exportarExcel(resp.data);
                    this.formUtils.cerrarCargando(); // ✅ cierra después de generar
                },
                error: error => {
                    this.formUtils.cerrarCargando();
                    console.log(error);
                }
            });
    }
}
