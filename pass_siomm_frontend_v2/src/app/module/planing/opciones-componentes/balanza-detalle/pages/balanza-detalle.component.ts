import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { LabelFiltroComponent } from 'src/app/shared/components/filtros-generales-selects/label-filtro/label-filtro.component';
import { TablaBalanzaDetalleComponent } from '../components/tabla-balanza-detalle/tabla-balanza-detalle.component';
import { MostrarDatosFiltrosService } from '../../../service/mostrar-datos-filtros.service';
import { FiltroAnioComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-anio/filtro-anio.component';
import { FiltroMesComponent } from 'src/app/shared/components/filtros-generales-selects/filtro-mes/filtro-mes.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaginacionComponent } from 'src/app/shared/components/paginacion/paginacion.component';
import { BOTONES_BALANZA_DETALLE, EntradaTicketBalanza, RespuestaTicketBalanza, TicketBalanzaDto, TurnoActivo } from '../interface/balanza-detalle.interface';
import { BalanzaDetalleService } from '../service/balanza-detalle.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { ModalDetalleBallanzaComponent } from '../components/modal-detalle-ballanza/modal-detalle-ballanza.component';
import { BotonesComponent } from 'src/app/shared/components/botones/botones.component';
import { BotonesInterface } from '../../programa-mensual-labores/interface';

@Component({
    selector: 'app-balanza-detalle',
    imports: [
        LabelFiltroComponent,
        TablaBalanzaDetalleComponent,
        // FiltroAnioComponent,
        // FiltroMesComponent,
        ReactiveFormsModule,
        PaginacionComponent,
        TransfornMonthPipe,
        ModalDetalleBallanzaComponent,
        BotonesComponent

    ],
    templateUrl: './balanza-detalle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanzaDetalleComponent implements OnInit {
    private mostrarDatosFiltrosService = inject(MostrarDatosFiltrosService);
    private balanzaDetalleService = inject(BalanzaDetalleService);
    private fb = inject(FormBuilder);
    public modo = signal<'nuevo' | 'visualizar' | 'edicion'>('nuevo')
    listAnios = signal<string[]>([]);
    listMeses = signal<string[]>([]);
    listBalanzaDetalle = signal<TicketBalanzaDto[]>([]);


    paginaActual = signal(1);
    totalPaginas = signal(0);
    totalRegistros = signal(0);
    registrosPorPagina = signal<number>(100);
    codTicketBalanza = signal<string>('');
    isLoading = signal<boolean>(false);
    abrirlModalBlnzDet = signal<boolean>(false);

    /// VARIABLES DE BOTONES

    bloqueo = signal<boolean>(false);

    listBotones = signal<BotonesInterface[]>(BOTONES_BALANZA_DETALLE);

    public onAccionBtn(accion: string) {
        switch(accion){
            case 'refrescar':
                this.cargarTickets();
                break

            case 'nuevo':
                this.onNuevo();
                break
        }
    }

    public bloqueoBtn(accion: string) {
        this.listBotones.update(botones =>
            botones.map(btn => ({
                ...btn,
                bloqueo: btn.accion === accion ? true : false
            }))
        )
    }


    // Solo el formulario de filtros
    form: FormGroup = this.fb.group({
        cod_empresa: ['03'],
        cod_empresa_unidad: ['01'],
        cie_ano: [''],
        cie_per: [null],
        cie_dia: [null],
        pagina: [this.paginaActual()],
        registros_por_pagina: [this.registrosPorPagina]
    });

    ngOnInit(): void {
        this.obtenerAnio();
    }

    private obtenerAnio(): void {
        this.mostrarDatosFiltrosService.getYear().subscribe({
            next: (data) => this.listAnios.set(data)
        });
    }

    private obtenerMes(cie_anio: string): void {
        this.mostrarDatosFiltrosService.getMonths(cie_anio).subscribe({
            next: (data) => this.listMeses.set(data)
        });
    }

    public onAnioCambio(event: Event): void {
        const valor = (event.target as HTMLSelectElement).value;
        this.form.patchValue({ cie_ano: valor || null, cie_per: null, cie_dia: null });

        if (valor) {
            this.obtenerMes(valor);
        } else {
            this.listMeses.set([]);
        }

        this.cargarTickets();
    }

    public onMesCambio(event: Event): void {
        const mes = (event.target as HTMLSelectElement).value;
        const anio = this.form.get('cie_ano')?.value;

        this.form.patchValue({ cie_per: mes || null, cie_dia: null });

        if (anio) {
            this.cargarTickets();
        }
    }


    public onSeleccionar(data: TicketBalanzaDto) {
        this.modo.set('visualizar');
        this.codTicketBalanza.set(data.cod_ticket_balanza);
        this.abrirlModalBlnzDet.set(true);
    }



    public onNuevo() {
        this.modo.set('nuevo');
        this.codTicketBalanza.set('');
        this.abrirlModalBlnzDet.set(true);
        this.bloqueoBtn('nuevo');
    }




    // public onBuscar(): void {
    //     this.paginaActual.set(1);
    //     // this.cargarTickets();
    // }

    public cargarTickets(): void {
        const datosEntrada = {
            ...this.form.getRawValue(),
            cie_ano: this.form.get('cie_ano')?.value || null,
            cie_per: this.form.get('cie_per')?.value || null,
            cie_dia: null,
            pagina: this.paginaActual(),
            registros_por_pagina: this.registrosPorPagina()
        };

        this.isLoading.set(true)

        this.balanzaDetalleService.obtenerBalanzaDetalle(datosEntrada).subscribe({
            next: (resp: RespuestaTicketBalanza) => {
                this.totalRegistros.set(resp.total_registros);
                this.totalPaginas.set(Math.ceil(resp.total_registros / this.registrosPorPagina()));
                this.listBalanzaDetalle.set(resp.data ?? []);
                this.isLoading.set(false);

            },
            error: (err) => {
                console.error(err)
                this.isLoading.set(false);

            }
        });
    }



    public paginaCambio(pagina: number): void {
        this.paginaActual.set(pagina);
        this.cargarTickets();
    }
}
