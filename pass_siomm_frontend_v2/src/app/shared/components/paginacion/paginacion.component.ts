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
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-paginacion',
//   imports: [CommonModule],
//   templateUrl: './paginacion.component.html',
//   styleUrl: './paginacion.component.css',
// })
// export class PaginacionComponent {
//   paginatedData: any[] = [];
//   currentPage = 1;
//   rowsPerPage = 2;
//   totalPages = 1;
//   pages: number[] = [];

// //   ngOnInit() {
// //     this.totalPages = Math.ceil(this.data.length / this.rowsPerPage);
// //     this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
// //     this.updatePaginatedData();
// //   }

// //   updatePaginatedData() {
// //     const start = (this.currentPage - 1) * this.rowsPerPage;
// //     const end = start + this.rowsPerPage;
// //     this.paginatedData = this.data.slice(start, end);
// //   }

// //   goToPage(page: number) {
// //     this.currentPage = page;
// //     this.updatePaginatedData();
// //   }

// //   previousPage() {
// //     if (this.currentPage > 1) {
// //       this.currentPage--;
// //       this.updatePaginatedData();
// //     }
// //   }

// //   nextPage() {
// //     if (this.currentPage < this.totalPages) {
// //       this.currentPage++;
// //       this.updatePaginatedData();
// //     }
// //   }
// }
