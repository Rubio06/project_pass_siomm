import { PlaningCompartidoService } from './../module/planing/opciones-componentes/apertura-periodo-operativo/services/planing-compartido.service';
import { effect, inject } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

export class FormUtils {
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




    static confirmarEliminacion(): Promise<boolean> {
        return Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
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
            title: "Eliminado",
            text: message,
            icon: "success"
        });
    }

    static alertaNoEliminado() {
        return Swal.fire({
            title: "Cancelado",
            text: "El registro NO fue eliminado.",
            icon: "info"
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

    static mostrarError() {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron guardar los cambios',
            confirmButtonColor: '#013B5C'
        });
    }

    static confirmarDescartarCambios(): Promise<boolean> {
        return Swal.fire({
            title: 'Cambios sin guardar',
            text: 'Tiene cambios pendientes. ¿Desea descartarlos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, descartar',
            cancelButtonText: 'No',
            confirmButtonColor: '#A3361D',
            cancelButtonColor: '#033351'
        }).then(result => result.isConfirmed);
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

                case 'min':
                    return `Valor minimo de  ${error['min'].min}`;

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
            '/^(0[1-9]|[12]\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19\\d{2}|20\\d{2}|2100)$/': 'Debe ingresar fecha valida ejem.(22/12/2025)'
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


}
