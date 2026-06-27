<<<<<<< HEAD
import { ChangeDetectorRef, Component, inject, input, Input, signal } from '@angular/core';
=======
import { Component, inject, signal } from '@angular/core';
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
import { FiltroAnioComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-anio/filtro-anio.component';
import { FiltroMesComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-mes/filtro-mes.component';
import { LabelFiltroComponent } from 'src/app/shared/components/filtros-generales-selects/label-filtro/label-filtro.component';
import { TituloModuloComponent } from 'src/app/shared/components/filtros-generales-selects/titulo-modulo/titulo-modulo.component';
<<<<<<< HEAD
import { BotonesInterface, ListaMensual, ListMensualIncidencias } from '../../interface/programa-mensual.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MostrarDatosFiltrosService } from 'src/app/module/planing/service/mostrar-datos-filtros.service';
import { ListaMensualService } from '../../services/lista-mensual.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FormUtils } from 'src/app/utils/form-utils';
import { BotonColores, NavBarBotonesComponent } from '../../components/lista-programa-mensual-labores-component/nav-bar-botones/nav-bar-botones.component';
import { TituloBotonesComponent } from '../../components/lista-programa-mensual-labores-component/titulo-botones/titulo-botones.component';
import { EdicionProgrmaMensualService } from '../../services';
import { CopiarPeriodoComponent } from './copiar-periodo/copiar-periodo.component';
=======
import { BotonesComponent } from '../../components/botones/botones.component';
import { ARREGLO_BOTONES, BotonesInterface } from '../../interface/programa-mensual.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

@Component({
    selector: 'app-lista-programa-mensual-labores',
    imports: [
        FiltroAnioComponent,
        LabelFiltroComponent,
        FiltroMesComponent,
        TituloModuloComponent,
<<<<<<< HEAD
        CommonModule,
        ReactiveFormsModule,
        DatePipe,
        TransfornMonthPipe,
        RouterOutlet,
        NavBarBotonesComponent,
        TituloBotonesComponent,
        CopiarPeriodoComponent
=======
        BotonesComponent,
        CommonModule,
        ReactiveFormsModule
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    ],
    templateUrl: './lista-programa-mensual-labores.component.html',
    styleUrl: './lista-programa-mensual-labores.component.css',
})
export class ListaProgramaMensualLaboresComponent {

    private fb = inject(FormBuilder);
<<<<<<< HEAD
    private mostrarFiltrosService = inject(MostrarDatosFiltrosService);
    private listaMensualService = inject(ListaMensualService);
    formUtil = FormUtils;

    private edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);

    isModalOpen = false;
    selectedIndex: number | null = null;


    listaAnio = signal<string[]>([]);
    listaMeses = signal<string[]>([]);

    _cargarListaMensual = signal<ListaMensual[]>([]);
    _cargarListaMensualIncidencias = signal<ListMensualIncidencias[]>([]);

    filaSeleccionada = signal<string>('');
    esDisabled = signal<boolean>(true);

    // private restaurandoEstado = false;
    listaPrograma = signal<ListaMensual[]>([]);

    myForm: FormGroup = this.fb.group({
        cie_anio: [''],
        cie_per: [null],
    });

    cie_anio = signal<string>('');
    cie_per = signal<string | null>('');


    private router = inject(Router);
    private route = inject(ActivatedRoute);
    botonActivo = signal<BotonColores | null>(null);

    constructor() {
        this.eventosFiltros();
        this.cargarAnios();
    }
    // bloquearBotones = signal<boolean>(true)


    estadoBotones = signal({
        nuevo: true,
        anular: true,
        aprobar: true,
        importar: true,
        preAprobar: true,
        copiar: true,
        exportar: true
    });

    private restaurandoEstado = false;

    setBoton(btn: BotonColores) {
        this.botonActivo.set(btn);
    }


    eventosFiltros() {
        const anioControl = this.myForm.get('cie_anio')!;
        const mesControl = this.myForm.get('cie_per')!;

        anioControl.valueChanges.subscribe(cie_anio => {
            // if (!cie_anio || this.restaurandoEstado) return;
            if (this.restaurandoEstado) return;
            this.cargarMeses(cie_anio);
            const cie_per = mesControl.value;

            this.cie_anio.set(cie_anio);
            if (cie_per) {
                this.cargarListaMensual(cie_anio, cie_per);

                this.estadoBotones.update(estado => ({
                    ...estado,
                    nuevo: true
                }));


            } else {
                this.cargarListaMensual(cie_anio);


            }
        });

        mesControl.valueChanges.subscribe(cie_per => {
            if (this.restaurandoEstado) return;
            const cie_anio = anioControl.value;
            if (!cie_anio) return;

            this.cie_per.set(cie_per);

            if (cie_per) {
                this.cargarListaMensual(cie_anio, cie_per);
                this.esDisabled.set(false);
                this.estadoBotones.update(estado => ({
                    ...estado,
                    importar: false,
                    nuevo: false,
                    exportar: false
                }));
            } else {
                this.cargarListaMensual(cie_anio);
                this.estadoBotones.update(estado => ({
                    ...estado,
                    importar: false,
                    nuevo: false,
                    exportar: false

                }));

            }
=======

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
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        });
    }


<<<<<<< HEAD
    private cargarAnios(): void {
        this.mostrarFiltrosService.getYear().subscribe({
            next: years => {
                this.listaAnio.set(years);

                const filtros = this.listaMensualService.getFiltros();

                if (filtros?.anio) {
                    this.restaurandoEstado = true;

                    this.mostrarFiltrosService.getMonths(filtros.anio).subscribe({
                        next: months => {
                            this.listaMeses.set(months);

                            setTimeout(() => {
                                this.myForm.patchValue({
                                    cie_anio: filtros.anio,
                                    cie_per: filtros.mes ?? null
                                }, { emitEvent: false });

                                this.restaurandoEstado = false;
                                this.cargarListaMensual(filtros.anio, filtros.mes);

                                const nroProg = this.listaMensualService.getNroProgSeleccionado();
                                if (nroProg) {
                                    this.filaSeleccionada.set(nroProg);
                                    this.estadoBotones.update(estado => ({
                                        ...estado,
                                        anular: false,
                                        aprobar: false,
                                        nuevo: true,
                                        preAprobar: false,
                                        copiar: false,
                                        exportar: false,
                                        importar: false


                                    }));
                                }
                                this.esDisabled.set(false);
                            }, 0); // 🔥 un tick es suficiente para que el DOM hijo se renderice
                        }
                    });
                }
            },
            error: error => console.log(error)
        });
    }

    private cargarMeses(year: string): void {
        this.mostrarFiltrosService.getMonths(year).subscribe({
            next: months => {
                this.listaMeses.set(months);
            },
            error: error => console.log(error)
        });
    }

    public cargarListaMensual(anio: string, mes?: string | null): void {

        const mesFinal = mes || null;

        this.listaMensualService.cargarListaMensual(anio, mesFinal).subscribe({
            next: (lista: ListaMensual[]) => {
                this._cargarListaMensual.set(lista);
                this.listaMensualService.setFiltros(anio, mesFinal);
            },
            error: error => console.log(error)
        });
    }

    public async onPasarNroProg(item: ListaMensual) {

        if (item.prg_est === 'B') {

            const result = await this.formUtil.mensajeNroProg();

            if (!result.isConfirmed) {
                return;
            }

        }

        this.listaMensualService.setNroProgSeleccionado(item.nro_prog);

        this.router.navigate(['../detalle-programacion', item.nro_prog, item.cie_ano, item.cie_per], { relativeTo: this.route });
        this.edicionProgrmaMensualService.setModo('ver');
    }




    limpiarMes() {
        const anio = this.myForm.get('cie_anio')?.value;
        this.myForm.get('cie_per')?.setValue(null);
        // this.myForm.get('cie_anio')?.setValue('');
        this.myForm.get('nro_prog')?.setValue('');
        this.filaSeleccionada.set('');

        this.listaPrograma.set([])
        this._cargarListaMensualIncidencias.set([]);
        this.cargarListaMensual(anio);

        this.estadoBotones.update(estado => ({
            ...estado,
            anular: true,
            aprobar: true,
            nuevo: true,
            preAprobar: true,
            copiar: true,

        }));
        this.listaMensualService.limpiarEstado();

        // this.esDisabled.set(true)

    }


    onPasarDatos(item: ListaMensual) {
        // this.bloquearBotones.set(false);
        this.estadoBotones.update(estado => ({
            ...estado,
            anular: false,
            aprobar: false,
            nuevo: true,
            preAprobar: false,
            copiar: false


        }));
        this.filaSeleccionada.set(item.nro_prog);
        this.listaPrograma.set([item])

        // this.prograMensual.set(item);

    }


    public cerrarModal() {
        this.isModalOpen = false;
        this.selectedIndex = null;
    }

    public abrirModal(index: number) {
        this.selectedIndex = index;
        this.isModalOpen = true;
    }

    public mostrarIndicencias(item: ListaMensual) {
        // console.log("mostrnado incidencias");

        this.filaSeleccionada.set(item.nro_prog);
        // this.listaMensualService.setFilaSeleccionada(item.nro_prog);

        this.listaMensualService.cargarListaMensualIncidencias(item.nro_prog).subscribe({
            next: (lista: ListMensualIncidencias[]) => {
                this._cargarListaMensualIncidencias.set(lista);

                this.estadoBotones.update(estado => ({
                    ...estado,
                    anular: false,
                    aprobar: false,
                    nuevo: true,
                    preAprobar: true,
                    copiar: true,
                    exportar: false
                }));

            },
            error: error => console.log(error)
        });
=======
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
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    }
}
