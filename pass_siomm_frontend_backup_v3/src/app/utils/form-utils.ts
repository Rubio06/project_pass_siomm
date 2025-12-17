import { FormGroup, ValidationErrors } from '@angular/forms';
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
                    // Puedes usar requiredPattern o dar un mensaje genérico según el control
                    const pattern = error['pattern'].requiredPattern;
                    return `Formato inválido. Debe cumplir con: ${pattern}`;
            }
        }
        return null;
    }

}
