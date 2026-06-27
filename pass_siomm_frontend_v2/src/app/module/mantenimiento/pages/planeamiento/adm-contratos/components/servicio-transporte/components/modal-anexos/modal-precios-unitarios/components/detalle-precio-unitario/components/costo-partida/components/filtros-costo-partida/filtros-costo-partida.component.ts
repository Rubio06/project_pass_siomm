import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { ParametrosContratoDto } from 'src/app/module/mantenimiento/pages/planeamiento/adm-contratos/components/servicio-transporte/interfaces/servicio-transporte.interface';
import { ServioTransporteService } from 'src/app/module/mantenimiento/pages/planeamiento/adm-contratos/components/servicio-transporte/services/servico-transporte.service';

@Component({
    selector: 'app-filtros-costo-partida',
    imports: [],
    templateUrl: './filtros-costo-partida.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltrosCostoPartidaComponent implements OnInit {
    isLoading = signal<boolean>(false);
    abrirModalCostoPartida = output<boolean>();
    listCostosFijosDetalle = signal<any[]>([])
    public servioTransporteService = inject(ServioTransporteService);

    public listParametrosPu = signal<ParametrosContratoDto[]>([])
    public listFilasSeleccionadas = signal<ParametrosContratoDto[]>([]);
    onDataAceptada = output<ParametrosContratoDto[]>()


    ngOnInit(): void {
        this.obtenerParametrosContratoPu();
    }

    public obtenerParametrosContratoPu(): void {

        this.isLoading.set(true)
        this.servioTransporteService.obtenerParametrosContratoPu().subscribe({
            next: (data) => {
                this.listParametrosPu.set(data);
                this.isLoading.set(false)

            },
            error: (err) => {
                console.error(err)
                this.isLoading.set(false)

            }
        });
    }

    public onCheckboxChange(event: Event, row: ParametrosContratoDto): void {
        const checkbox = event.target as HTMLInputElement;
        const seleccionadosActuales = this.listFilasSeleccionadas();

        if (checkbox.checked) {
            // Agrega el row completo al Signal de seleccionados
            this.listFilasSeleccionadas.set([...seleccionadosActuales, row]);
        } else {
            // Remueve usando la clave primaria correcta: cod_parametro_contrato
            this.listFilasSeleccionadas.set(
                seleccionadosActuales.filter(item => item.cod_parametro_contrato !== row.cod_parametro_contrato)
            );
        }
    }



    public confirmarSeleccion(): void {
        const dataAEnviar = this.listFilasSeleccionadas();

        if (dataAEnviar.length === 0) return;

        this.onDataAceptada.emit(dataAEnviar);
    }

}
