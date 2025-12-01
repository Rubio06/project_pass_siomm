import { FormArray, FormGroup } from "@angular/forms";



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


    static obtenerMensajeError(semanas: FormArray, i: number, campo: string): string {

        const fila = semanas.at(i) as FormGroup;
        const control = fila.get(campo);

        if (control?.hasError('required')) {
            switch (campo) {
                case 'num_semana': return 'El número de semana es obligatorio';
                case 'fec_ini': return 'La fecha de inicio es obligatoria';
                case 'fec_fin': return 'La fecha fin es obligatoria';
                case 'desc_semana': return 'La descripción es obligatoria';
            }
        }

        if (control?.hasError('pattern')) {
            return 'El formato ejemplo debe ser (Ej: 27/12/2019)';
        }

        if (control?.hasError('min')) {
            return 'La semana mínima es 1';
        }
        if (control?.hasError('max')) {
            return 'La semana máxima es 7';
        }

        return 'Campo inválido';
    }



    static esInvalido(semanas: FormArray, i: number, campo: string): boolean {
        const fila = semanas.at(i) as FormGroup;
        const control = fila.get(campo);
        return !!(control && control.touched && control.invalid);
    }
}
