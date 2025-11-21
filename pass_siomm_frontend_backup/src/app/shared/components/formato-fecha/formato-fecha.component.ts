import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-formato-fecha',
    templateUrl: './formato-fecha.component.html',
    styleUrls: ['./formato-fecha.component.css']
})
export class FormatoFechaComponent {

    esISO(valor: string): boolean {
        return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(valor);
    }

    formatearISOaDDMMYYYY(fechaISO: string): string {
        if (!fechaISO) return '';
        const fecha = new Date(fechaISO);

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}/${mes}/${anio}`;
    }
}
