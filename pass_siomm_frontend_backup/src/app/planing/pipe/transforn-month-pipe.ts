import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'transfornMonth'
})
export class TransfornMonthPipe implements PipeTransform {

    private months: { [key: string]: string } = {
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

    transform(value: string | number, ...args: unknown[]): unknown {
        const key = value.toString().padStart(2, '0');
        return this.months[key] || value.toString();
    }

}
