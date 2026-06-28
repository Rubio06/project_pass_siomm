import { ChangeDetectorRef, Component, inject, input, Input, signal } from '@angular/core';
import { FiltroAnioComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-anio/filtro-anio.component';
import { FiltroMesComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-mes/filtro-mes.component';
import { LabelFiltroComponent } from 'src/app/shared/components/filtros-generales-selects/label-filtro/label-filtro.component';
import { TituloModuloComponent } from 'src/app/shared/components/filtros-generales-selects/titulo-modulo/titulo-modulo.component';
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

@Component({
    selector: 'app-lista-programa-mensual-labores',
    imports: [
        FiltroAnioComponent,
        LabelFiltroComponent,
        FiltroMesComponent,
        TituloModuloComponent,
        CommonModule,
        ReactiveFormsModule,
        DatePipe,
        TransfornMonthPipe,
        RouterOutlet,
        NavBarBotonesComponent,
        TituloBotonesComponent,
        CopiarPeriodoComponent
    ],
    templateUrl: './lista-programa-mensual-labores.component.html',
    styleUrl: './lista-programa-mensual-labores.component.css',
})
export class ListaProgramaMensualLaboresComponent {

    private fb = inject(FormBuilder);
    private mostrarFiltrosService = inject(MostrarDatosFiltrosService);
    private listaMensualService = inject(ListaMensualService);
    private edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    formUtil = FormUtils;

    isModalOpen = false;
    selectedIndex: number | null = null;
    private restaurandoEstado = false;

    listaAnio = signal<string[]>([]);
    listaMeses = signal<string[]>([]);
    listaPrograma = signal<ListaMensual[]>([]);
    _cargarListaMensual = signal<ListaMensual[]>([]);
    _cargarListaMensualIncidencias = signal<ListMensualIncidencias[]>([]);
    filaSeleccionada = signal<string>('');
    esDisabled = signal<boolean>(true);
    botonActivo = signal<BotonColores | null>(null);

    cie_anio = signal<string>('');
    cie_per = signal<string | null>('');

    estadoBotones = signal({
        nuevo: true,
        anular: true,
        aprobar: true,
        importar: true,
        preAprobar: true,
        copiar: true,
        exportar: true
    });

    myForm: FormGroup = this.fb.group({
        cie_anio: [''],
        cie_per: [null],
    });

    constructor() {
        this.eventosFiltros();
        this.cargarAnios();
    }

    setBoton(btn: BotonColores) {
        this.botonActivo.set(btn);
    }

    eventosFiltros() {
        const anioControl = this.myForm.get('cie_anio')!;
        const mesControl = this.myForm.get('cie_per')!;

        anioControl.valueChanges.subscribe(cie_anio => {
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
        });
    }

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
                            }, 0);
                        }
                    });
                }
            },
            error: error => console.log(error)
        });
    }

    private cargarMeses(year: string): void {
        this.mostrarFiltrosService.getMonths(year).subscribe({
            next: months => this.listaMeses.set(months),
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
            if (!result.isConfirmed) return;
        }

        this.listaMensualService.setNroProgSeleccionado(item.nro_prog);
        this.router.navigate(['../detalle-programacion', item.nro_prog, item.cie_ano, item.cie_per], { relativeTo: this.route });
        this.edicionProgrmaMensualService.setModo('ver');
    }

    limpiarMes() {
        const anio = this.myForm.get('cie_anio')?.value;
        this.myForm.get('cie_per')?.setValue(null);
        this.myForm.get('nro_prog')?.setValue('');
        this.filaSeleccionada.set('');
        this.listaPrograma.set([]);
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
    }

    onPasarDatos(item: ListaMensual) {
        this.estadoBotones.update(estado => ({
            ...estado,
            anular: false,
            aprobar: false,
            nuevo: true,
            preAprobar: false,
            copiar: false
        }));
        this.filaSeleccionada.set(item.nro_prog);
        this.listaPrograma.set([item]);
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
        this.filaSeleccionada.set(item.nro_prog);
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
    }
}