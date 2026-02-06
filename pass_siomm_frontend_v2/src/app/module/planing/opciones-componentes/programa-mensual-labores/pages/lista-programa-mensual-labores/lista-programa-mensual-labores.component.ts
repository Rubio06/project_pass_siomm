import { Component, inject, signal } from '@angular/core';
import { FiltroAnioComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-anio/filtro-anio.component';
import { FiltroMesComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-mes/filtro-mes.component';
import { LabelFiltroComponent } from 'src/app/shared/components/filtros-generales-selects/label-filtro/label-filtro.component';
import { TituloModuloComponent } from 'src/app/shared/components/filtros-generales-selects/titulo-modulo/titulo-modulo.component';
import { BotonesComponent } from '../../components/botones/botones.component';
import { ARREGLO_BOTONES, BotonesInterface } from '../../interface/programa-mensual.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-lista-programa-mensual-labores',
    imports: [
        FiltroAnioComponent,
        LabelFiltroComponent,
        FiltroMesComponent,
        TituloModuloComponent,
        BotonesComponent,
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './lista-programa-mensual-labores.component.html',
    styleUrl: './lista-programa-mensual-labores.component.css',
})
export class ListaProgramaMensualLaboresComponent {

    private fb = inject(FormBuilder);

    myForm: FormGroup = this.fb.group({
        anio: ['',],
        mes: ['',],
    });




    listaAnio = signal<string[]>([
        "2019",
        "2020",
    ]);

    listaMeses = signal<string[]>([
        "Enero",
        "Febrero"
    ]);

    constructor() {
        this.onEventoAnio();
        this.onEventoMes();
    }

    onEventoAnio() {
        this.myForm.get('anio')!.valueChanges.subscribe(anio => {
            console.log('Año seleccionado:', anio);
            // aquí puedes actualizar otros controles si quieres
        });
    }

    onEventoMes() {
        this.myForm.get('mes')!.valueChanges.subscribe(mes => {
            console.log('Año seleccionado:', mes);
            // aquí puedes actualizar otros controles si quieres
        });
    }


    // private cargarAnios(): void {
    //     this.planingService.getYear().subscribe({
    //         next: years => {
    //             if (!years.length) {
    //                 this.hasError.set('No se encontraron rutas disponibles.');
    //                 // console.log(years)

    //                 return;
    //             }
    //             this._years.set(years);
    //         },
    //         error: () => this.hasError.set('Ocurrió un error al cargar los años.'),
    //     });
    // }

    // private cargarMeses(year: string): void {
    //     this.planingService.getMonths(year).subscribe({
    //         next: months => {
    //             if (!months.length) {

    //                 this.hasError.set('No hay meses disponibles.');
    //                 return;
    //             }
    //             this.hasError.set(null);
    //             this._months.set(months);

    //         },
    //         error: () => this.hasError.set('Ocurrió un error al cargar los meses.'),
    //     });
    // }










    botones = signal<BotonesInterface[]>(ARREGLO_BOTONES)
    botoPresionado = signal<string>('');
    botoColor = signal<string>('');      // color del botón presionado


    ///LOGICA PARA LOS BOTONES ///

    public onAccion(tipo: string) {
        console.log('Acción recibida:', tipo);

        switch (tipo) {
            case 'nuevo':
                this.onNuevo();
                break;

            case 'editar':
                this.onEditar();
                break;

            case 'eliminar':
                this.onEliminar();
                break;

            case 'exportar':
                this.onExportar();
                break;

            default:
                console.warn('Acción no reconocida:', tipo);
        }
    }

    private setBoton(accion: string, color: string) {
        this.botoPresionado.set(`Usted se encuentra en el modo ${accion}`);
        this.botoColor.set(color);
    }

    private onNuevo() {
        this.setBoton('Nuevo', 'bg-[green]');   // azul

    }

    private onEditar() {
        this.setBoton('Editar', 'bg-[#012D96]');  //
    }

    private onEliminar() {
        this.setBoton('Eliminar', 'bg-[#002B48]');
    }

    private onExportar() {
        this.setBoton('Exportar', 'bg-green-500');
    }
}
