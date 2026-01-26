import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'transfornMonth'
})
export class TransfornMonthPipe implements PipeTransform {

    private readonly meses: Record<string, string> = {
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

    transform(value: string | number): string {
        const key = value.toString().padStart(2, '0');
        return this.meses[key] ?? value.toString();
    }

}
