import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoTicketBalanza',
})
export class EstadoTicketBalanzaPipe implements PipeTransform {
    private readonly estados: Record<string, string> = {
        'G': 'Generado',
        'B': 'Aprobado',
        'A': 'Anulado'
    };

    transform(codigo: string | null | undefined): string {
        if (!codigo) return '';
        return this.estados[codigo] ?? codigo;
    }
}
