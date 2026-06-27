import { PlaningCompartidoService } from './../module/planing/opciones-componentes/apertura-periodo-operativo/services/planing-compartido.service';
import { effect, inject } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2'

import { ExportarProgramacion } from '../module/planing/opciones-componentes/programa-mensual-labores/interface/programa-mensual.interface';

export class FormUtils {


    static meses: Record<string, string> = {
        '01': 'Enero',
        '02': 'Febrero',
        '03': 'Marzo',
        '04': 'Abril',
        '05': 'Mayo',
        '06': 'Junio',
        '07': 'Julio',
        '08': 'Agosto',
        '09': 'Septiembre',
        '10': 'Octubre',
        '11': 'Noviembre',
        '12': 'Diciembre'
    };

    static formatDate(dateStr: string | Date | null | undefined): string {
        if (!dateStr) return '';

        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    static convertToISO(dateStr: string): string {
        const [day, month, year] = dateStr.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
    }


    static mensajeError(error: any) {
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: `
                <div style="text-align:left;">
                    <b>Detalle técnico:</b><br>
                    <span style="font-size:14px; color:#444;">${error}</span><br><br>
                    <b>Recomendación:</b><br>
                    <span style="font-size:14px; color:#444;">
                        Comuníquese con Soporte TI para más asistencia.
                    </span>
                </div>
            `,
            background: "#fefefe",
            color: "#333",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#d33",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }

    static mensajeErrorClase(error: any) {
        Swal.fire({
            icon: "error",
            title: "Ocurrió un error",
            html: `
                <div style="text-align:left;">
                    <b>Detalle técnico:</b><br>
                    <span style="font-size:14px; color:#444;">${error}</span><br><br>
                    <b>Recomendación:</b><br>
                    <span style="font-size:14px; color:#444;">
                        Comuníquese con Soporte TI para más asistencia.
                    </span>
                </div>
            `,
            background: "#fefefe",
            color: "#333",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#d33",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            customClass: {
                container: 'swal-encima'
            }
        });
    }





    static confirmarEliminacion(): Promise<boolean> {
        return Swal.fire({
            title: "Eliminar registro",
            html: `
            <p style="font-size:14px;">
                Esta acción <strong>no se puede deshacer</strong>.<br>
                ¿Deseas eliminar el registro definitivamente?
            </p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00426F",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(result => result.isConfirmed);
    }


    static guardarCambios() {
        return Swal.fire({
            icon: 'warning',
            title: 'Cambios sin guardar',
            text: 'Debe guardar los cambios antes de cambiar el periodo.',
            confirmButtonColor: '#013B5C',
            confirmButtonText: 'Entendido'
        });
    }

    static editarCambios() {
        return Swal.fire({
            icon: 'warning',
            title: 'Cambios sin guardar',
            text: 'Debe editar y luego guardar cambios para continuar.',
            confirmButtonColor: '#013B5C',
            confirmButtonText: 'Entendido'
        });
    }

    static alertaEliminado(message: string) {
        return Swal.fire({
            title: "Registro eliminado",
            html: `
                    <p style="font-size:14px;">
                        ${message}<br>
                        <span style="color:#4caf50;font-weight:600;">
                        La acción se realizó correctamente.
                        </span>
                    </p>
                    `,
            icon: "success",
            confirmButtonColor: "#00426F",
            confirmButtonText: "Aceptar"
        });
    }

    
    static alertaInactivo(titulo: string, message: string) {
        return Swal.fire({
            title: titulo,
            html: `
                    <p style="font-size:14px;">
                        ${message}<br>
                        <span style="color:#4caf50;font-weight:600;">
                        La acción se realizó correctamente.
                        </span>
                    </p>
                    `,
            icon: "success",
            confirmButtonColor: "#00426F",
            confirmButtonText: "Aceptar"
        });
    }

    static alertaEliminadoClase(message: string) {
        return Swal.fire({
            title: "Registro eliminado",
            html: `
                    <p style="font-size:14px;">
                        ${message}<br>
                        <span style="color:#4caf50;font-weight:600;">
                        La acción se realizó correctamente.
                        </span>
                    </p>
                    `,
            icon: "success",
            confirmButtonColor: "#00426F",
            confirmButtonText: "Aceptar",
            customClass: {
                container: 'swal-encima'
            }
        });
    }

    static alertaNoEliminadoMensaje(mensaje: string) {
        return Swal.fire({
            title: "Acción cancelada",
            html: `
            <p style="font-size:14px;">
                El registro ${mensaje} <strong>no fue eliminado</strong>.<br>
                Puedes revisarlo nuevamente si lo necesitas.
            </p>
            `,
            icon: "info",
            confirmButtonColor: "#00426F",
            confirmButtonText: "Entendido"
        });
    }


    static alertaNoEliminadoMensajeClase(mensaje: string) {
        return Swal.fire({
            title: "Acción cancelada",
            html: `
            <p style="font-size:14px;">
                El registro ${mensaje} <strong>no fue eliminado</strong>.<br>
                Puedes revisarlo nuevamente si lo necesitas.
            </p>
            `,
            icon: "info",
            confirmButtonColor: "#00426F",
            confirmButtonText: "Entendido",
            customClass: {
                container: 'swal-encima'
            }
        });
    }


    static errorCopiado(message: string) {
        const modal = document.getElementById('my_modal_3');

        return Swal.fire({
            target: modal!,   // 👈 CLAVE
            title: "Error al copiar periodo",
            html: `
      <p style="font-size:14px;">
        ${message}<br>
        <span style="color:red;font-weight:600;">
          No se pudo copiar el periodo.
        </span>
      </p>
    `,
            icon: "error",
            confirmButtonColor: "#00426F",
            confirmButtonText: "Aceptar"
        });
    }

    // static alertaEliminado(message: string) {
    //     return Swal.fire({
    //         title: "Eliminado",
    //         text: message,
    //         icon: "success"
    //     });
    // }

    static alertaNoEliminado() {
        return Swal.fire({
            title: "Acción cancelada",
            html: `
            <p style="font-size:14px;">
                El registro <strong>no fue eliminado</strong>.<br>
                Puedes revisarlo nuevamente si lo necesitas.
            </p>
            `,
            icon: "info",
            confirmButtonColor: "#00426F",
            confirmButtonText: "Entendido"
        });
    }


    static async confirmarGuardado(): Promise<boolean> {
        const result = await Swal.fire({
            title: '¿Desea guardar los datos?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#00426F',
            cancelButtonColor: '#9E9E9E',
            reverseButtons: true,
            focusCancel: true,
            allowOutsideClick: false,   // 🚫 click fuera
            allowEscapeKey: false,     // 🚫 ESC
            allowEnterKey: false,
            backdrop: 'rgba(0,0,0,0.4)',
            customClass: {
                popup: 'rounded-xl',
                title: 'text-lg font-bold',
                confirmButton: 'px-6 py-2 rounded-lg font-semibold',
                cancelButton: 'px-6 py-2 rounded-lg font-semibold'
            }
        });

        return result.isConfirmed;
    }

    static mostrarExito() {
        Swal.fire({
            icon: 'success',
            title: 'Guardado correctamente',
            text: 'Los cambios se han guardado exitosamente.',
            confirmButtonColor: '#013B5C'
        });
    }


    static exitoPeriodo(message: string) {
        Swal.fire({
            icon: 'success',
            title: '¡Período copiado!',
            text: message,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#013B5C'

        });
    }



    static mostrarError() {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron guardar los cambios',
            confirmButtonColor: '#013B5C'
        });
    }

    static mensajeSelect() {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe de terminar la edición para cambiar de mes.',
            confirmButtonColor: '#013B5C'
        });
    }


    static errorGuardar(message: string) {
        return Swal.fire({
            title: "Error al guardar",
            html: `
            <p style="font-size:15px; line-height:1.5; margin:0;">
                ${message}
            </p>
        `,
            icon: "error",
            confirmButtonColor: "#C62828",
            confirmButtonText: "Aceptar"
        });
    }
    static mensajeNroProg() {
        return Swal.fire({
            icon: 'info',
            title: 'Programación aprobada',
            html: `
                      <b>La programación ya se encuentra aprobada.</b><br>
                      Solo podrá registrar <b>labores no programadas</b>.
                    `,
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#013B5C',
            backdrop: true
        });
    }


    static planosMensajeTabla(title: string, texto: string) {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: texto,
            confirmButtonColor: '#013B5C'
        });
    }

    static mensajesBlock(titulo: string, texto: string) {
        return Swal.fire({
            icon: 'warning',
            title: titulo,
            text: texto,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#013B5C',
            background: '#f8fafc',
            color: '#1e293b'
        });
    }

    static confirmarEliminacionPlanos(titulo: string, mensaje: string = '', html: string = '') {
        return Swal.fire({
            title: titulo,
            text: mensaje,
            html: html,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#9F1239',
            cancelButtonColor: '#013B5C'
        });
    }

    static confirmarInactivar(titulo: string, mensaje: string = '',textoBoton: string = 'Sí, Inactivar', html: string = '') {
        return Swal.fire({
            title: titulo,
            text: mensaje,
            html: html,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: textoBoton,
            confirmButtonColor: textoBoton.includes('Activar') ? '#0a6e2f' : '#9F1239',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#013B5C'
        });
    }


    static async pedirTituloPlano() {

        const { value } = await Swal.fire({
            title: 'Ingrese título del plano',
            input: 'text',
            inputPlaceholder: 'Título del plano...',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#013B5C',
            inputValidator: (v: any) => {
                if (!v) return 'Debe ingresar un título';
                return null;
            }
        });

        return value;
    }

    static confirmarDescartarCambios(): Promise<boolean> {
        return Swal.fire({
            title: 'Cambios sin guardar',
            text: '¿Desea guardar cambios antes de cambiar de opción?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Guardar Cambios',
            cancelButtonText: 'No, descartar',
            confirmButtonColor: '#033351',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,   // 🚫 click fuera
            allowEscapeKey: false,     // 🚫 ESC
            allowEnterKey: false
        }).then(result => result.isConfirmed);
    }

    static confirmarSalirSinGuardar(): Promise<boolean> {
        return Swal.fire({
            title: 'Cambios pendientes',
            text: 'Tiene cambios pendientes. ¿Desea salir sin guardar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Salir sin guardar',
            cancelButtonText: 'Quedarse',
            confirmButtonColor: '#9E2810',
            cancelButtonColor: '#033351',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        }).then(result => result.isConfirmed);
    }

    static mensajeEliminarLabor(title: string, message: string) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            html: `<b>${message}</b>`, // ✅ aquí sí funciona
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#033351'
        });
    }

    static mensajeEliminarLaborClase(title: string, message: string) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            html: `<b>${message}</b>`, // ✅ aquí sí funciona
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#033351',
            customClass: {
                container: 'swal-encima'
            }
        });
    }



    static isValidField(form: FormGroup, fildName: string): boolean | null {
        return (
            !!form.controls[fildName].errors &&
            form.controls[fildName].touched
        );
    }


    static getFiledError(form: FormGroup, fildName: string): string | null {
        if (!form.controls[fildName]) return null;
        const errors = form.controls[fildName].errors ?? {};

        return FormUtils.getFieldError(errors);
    }


    static getFieldError(error: ValidationErrors) {

        for (const key of Object.keys(error)) {
            switch (key) {
                case 'required':
                    return 'Este campo es requerido';

                case 'minlength':
                    return `Minimo de ${error['minlength'].requiredLength} caracteres`;

                case 'maxlength':
                    return `El formato permitido es hasta ${error['maxlength'].requiredLength} caracteres`;

                case 'min':
                    return `Valor minimo de caracteres permitidos es ${error['min'].min}`;

                case 'max':
                    return `Valor maximo de caracteres pertimidos es ${error['max'].max}`;

                case 'pattern':
                    return this.getPatternErrorMessage(
                        error['pattern'].requiredPattern
                    );
            }
        }
        return null;
    }

    private static getPatternErrorMessage(pattern: string): string {
        const patterns: Record<string, string> = {
            '/^[1-7]$/': 'Solo se permiten semanas del 1 al 7',
            '/^(19\\d{2}|20\\d{2}|2100)$/': 'Debe ingresar un año válido ejem.(2025)',
            '/^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19\\d{2}|20\\d{2}|2100)$/': 'Debe ingresar fecha valida ejem.(22/12/2025)',
            '/^\\d+(\\.\\d+)?$/': 'El campo solo acepta numeros o decimales',
            '/^[A-Z0-9]$/': 'Debe colocar una sola letra en mayuscula o un solo numero.',
            '/^\\d{11}$/': 'El RUC debe contener exactamente 11 digitos',
            '/^\\d{1,20}$/': 'El Nro. telefono debe de contener 20 digitos',
            '/^\\d{10}$/': 'El codigo de labor debe ser menor a 10 digitos',
            '/^\\d{60}$/': 'El nombre de labor debe ser menor a 60 digitos',
            '/^(?!\\+?-?\\d{6}\\.00$)[+-]?\\d+(\\.\\d+)?$/': 'Formato de cota no válido o fuera de rango.',
            '/^\\d{1,6}(\\.\\d{1,4})?$/': 'El campo solo acepta hasta 6 dígitos enteros y 4 decimales',

            '/^\\d{1,10}(\\.\\d{1,3})?$/': 'El campo solo acepta hasta 10 dígitos enteros y 3 decimales',

        };
        return patterns[pattern] ?? 'Formato inválido';
    }



    static isValidFieldInArray(formGroup: AbstractControl, field: string): boolean {
        const control = formGroup.get(field);
        return !!(control && control.invalid && (control.touched || control.dirty));
    }

    static getFiledErrorArray(formGroup: AbstractControl, field: string): string | null {
        const control = formGroup.get(field);
        if (!control || !control.errors) return null;

        const errors = control.errors;
        return FormUtils.getFieldError(errors);
    }

    static isValidFieldDisabled(formGroup: AbstractControl, field: string, filasIncompletas: number[], index: number): boolean {
        const control = formGroup.get(field);
        return !!(control && !control.value && filasIncompletas.includes(index));
    }


    static rangoFechasValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const fecIni = group.get('fec_ini')?.value;
            const fecFin = group.get('fec_fin')?.value;

            if (!fecIni || !fecFin) {
                return null;
            }

            const [d1, m1, y1] = fecIni.split('/');
            const [d2, m2, y2] = fecFin.split('/');

            const fechaIni = new Date(+y1, +m1 - 1, +d1);
            const fechaFin = new Date(+y2, +m2 - 1, +d2);

            if (fechaIni.getTime() === fechaFin.getTime()) {
                return { fechasIguales: true };
            }

            if (fechaFin < fechaIni) {
                return { rangoInvalido: true };
            }

            const diffMs = fechaFin.getTime() - fechaIni.getTime();
            const diffDias = diffMs / (1000 * 60 * 60 * 24);

            // ❌ Mayor a 7 días
            if (diffDias > 7) {
                return { rangoMayorA7Dias: true };
            }

            return null;
        };
    }

    // Helper para estructurar cada fila con sus validaciones tranpsorte-mineral
    static rutasDistintasValidator(group: AbstractControl) {
        if (!group.get('esNuevo')?.value) return null;

        const origen = group.get('cod_ruta_origen')?.value;
        const intermedia = group.get('cod_ruta_intermedia')?.value;
        const destino = group.get('cod_ruta_destino')?.value;

        if (intermedia && (intermedia === origen || intermedia === destino)) {
            return { rutaIntermediaDuplicada: true };
        }
        if (origen && destino && origen === destino) {
            return { rutaOrigenDestinoDuplicada: true };
        }
        return null;
    }


    //ALETAS LISTA-PROGAMA-MENSUAL-LABORES
    static alertaProgAprobada(title: string, text: string) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#17324D',
            background: '#f8fafc',
            color: '#1e293b',
            iconColor: '#f59e0b'
        });
    }

    static alertaProgAnulada(title: string, text: string) {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: text,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#17324D',
            background: '#f8fafc',
            color: '#1e293b',
            iconColor: '#0f394d'
        });
    }

    static confirmarAnulacion(title: string, html: string, confirm: string, cancelar: string) {
        return Swal.fire({
            title: title,
            html: html,
            icon: 'question',
            showCancelButton: true,
            // confirmButtonText: 'Sí, anular',
            confirmButtonText: confirm,

            cancelButtonText: cancelar,
            confirmButtonColor: '#17324D',
            cancelButtonColor: '#6b7280',
            background: '#ffffff',
            color: '#1e293b',
            iconColor: '#17324D'
        });
    }

    static confirmarAnulacionClase(title: string, html: string, confirm: string, cancelar: string) {
        return Swal.fire({
            title: title,
            html: html,
            icon: 'question',
            showCancelButton: true,
            // confirmButtonText: 'Sí, anular',
            confirmButtonText: confirm,

            cancelButtonText: cancelar,
            confirmButtonColor: '#17324D',
            cancelButtonColor: '#6b7280',
            background: '#ffffff',
            color: '#1e293b',
            iconColor: '#17324D',
            customClass: {
                container: 'swal-encima'
            }
        });
    }

    // static confirmarAnulacionImportar(title: string, html: string, confirm: string) {
    //     return Swal.fire({
    //         title: title,
    //         html: html,
    //         icon: 'question',
    //         showCancelButton: true,
    //         confirmButtonText: confirm,
    //         cancelButtonText: 'Cancelar',
    //         confirmButtonColor: '#17324D',
    //         cancelButtonColor: '#6b7280',
    //         background: '#ffffff',
    //         color: '#1e293b',
    //         iconColor: '#17324D'
    //     });
    // }

    static alertaExitoAnulacion(title: string, html: string) {
        return Swal.fire({
            icon: 'success',
            title: title,
            html: html,
            timer: 2200,
            showConfirmButton: false,
            background: '#f0fdf4',
            color: '#065f46',
            iconColor: '#16a34a'
        });
    }

    static alertaErrorAnulacion(title: string, text: string) {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#17324D',
            background: '#fef2f2',
            color: '#7f1d1d',
            iconColor: '#dc2626'
        });
    }

    static alertaNoPermitido(title: string, text: string) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#17324D',
            background: '#fff7ed',
            color: '#7c2d12',
            iconColor: '#ea580c',
        });
    }

    static alertaNoPermitidoClase(title: string, text: string) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#17324D',
            background: '#fff7ed',
            color: '#7c2d12',
            iconColor: '#ea580c',
            customClass: {
                container: 'swal-encima'
            }
        });
    }





    // ESTILOS ARCHIVOS EXCEL


    static buildRows(data: ExportarProgramacion[]) {
        return data.map(x => [
            x.cie_ano,
            x.cie_per,
            x.nro_prog,
            x.fec_emi,
            x.prg_est,
            x.tratamiento,
            x.nom_und_econom,
            x.des_zona,
            x.des_contrata,
            x.nom_fase,
            x.des_veta,
            x.cod_nivel,
            x.cod_labor,
            x.cod_tipo_labor,
            x.cod_ala,
            x.cod_cto,
            x.cod_cta,
            x.prg_blocks,
            x.ind_tip_roca_piso,
            x.ind_tip_roca,
            x.ind_tip_roca_techo,
            x.prg_avamts,
            x.prg_secancho,
            x.prg_secaltu,
            x.prg_tmsdes,
            x.prg_tmsmin,
            (x.prg_tmsdes ?? 0) + (x.prg_tmsmin ?? 0),
            x.prg_ancmin,
            x.prg_ancvet,
            x.prg_secancho,
            x.prg_secaltu,
            x.prg_num_tramin,
            x.prg_loncor,
            x.prg_altcor,
            x.prg_tmsrotvet,
            x.prg_tmsrotdil,
            x.prg_tmsextraid,
            x.prg_fecmuestreo,
            x.prg_leyag,
            x.prg_leycu,
            x.prg_leypb,
            x.prg_leyzn,
            // x.val_vpt,
            x.prg_leyagdil,
            x.prg_leycudil,
            x.prg_leypbdil,
            x.prg_leyzndil,
            x.prg_vptmin,
            x.prg_leyagdil,
            x.nom_metexp,
            x.prg_homlab,
            x.des_proyecto,
            x.nom_proyecto
        ]);
    }


    static headerStyle() {
        return {
            font: { bold: true, color: { rgb: "818181" }, sz: 9 },
            fill: { fgColor: { rgb: "F0F0F0" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: this.border()
        };
    }

    static highlightStyle() {
        return {
            font: { sz: 8, bold: true },
            fill: { fgColor: { rgb: "F0F0F0" } },
            border: this.border()
        };
    }

    static defaultStyle() {
        return {
            font: { sz: 8 },
            border: this.border()
        };
    }

    static border() {
        return {
            top: { style: "dotted", color: { rgb: "808080" } },
            bottom: { style: "dotted", color: { rgb: "808080" } },
            left: { style: "dotted", color: { rgb: "808080" } },
            right: { style: "dotted", color: { rgb: "808080" } }
        };
    }

    static mostrarCargando(mensaje: string = "Cargando...") {
        Swal.fire({
            title: mensaje,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            customClass: {
                popup: 'loader-sistema'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    static cerrarCargando() {
        Swal.close();
    }


    static deseaGuardarCambios(title: string, text: string): Promise<boolean> {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'No, salir sin guardar',
            confirmButtonColor: '#00426F',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(result => result.isConfirmed);
    }


    static formatFecha(fecha?: string | Date | null): string {
        if (!fecha) return '';
        return new Date(fecha).toISOString().split('T')[0];
    }



    static limitarDigitos(event: Event, max: number) {
        const input = event.target as HTMLInputElement;
        if (input.value.length > max) {
            input.value = input.value.slice(0, max);
        }
    }

}
