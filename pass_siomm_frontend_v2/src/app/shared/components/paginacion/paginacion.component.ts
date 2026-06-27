import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-paginacion',
    imports: [CommonModule],
    templateUrl: './paginacion.component.html',
    styleUrl: './paginacion.component.css',
})
export class PaginacionComponent {
    paginaActual = input.required<number>();
    totalPaginas = input.required<number>();
    totalRegistros = input.required<number>();

    paginaCambio = output<number>();

    totalPagesArray(): number[] {
        return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
    }

    irPagina(event: Event): void {
        const pagina = Number((event.target as HTMLSelectElement).value);
        this.paginaCambio.emit(pagina);
    }
}
