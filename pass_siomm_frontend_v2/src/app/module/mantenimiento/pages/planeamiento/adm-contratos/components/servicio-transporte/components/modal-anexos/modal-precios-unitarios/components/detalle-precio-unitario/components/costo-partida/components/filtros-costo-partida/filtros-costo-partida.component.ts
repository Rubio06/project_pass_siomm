import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
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
    public parametrosSeleccionados = input<ParametrosContratoDto[]>([]);
    onDataAceptada = output<ParametrosContratoDto[]>()


    ngOnInit(): void {
        this.listFilasSeleccionadas.set(this.parametrosSeleccionados() ?? []);
        this.obtenerParametrosContratoPu();
    }

    public obtenerParametrosContratoPu(): void {

        this.isLoading.set(true)
        this.servioTransporteService.obtenerParametrosContratoPu().subscribe({
            next: (data) => {
                const parametrosConEstado = data.map(item => ({
                    ...item,
                    bloqueado: this.isPersistido(item)
                }));

                this.listParametrosPu.set(parametrosConEstado);
                this.isLoading.set(false)

            },
            error: (err) => {
                console.error(err)
                this.isLoading.set(false)

            }
        });
    }

    public isPersistido(row: ParametrosContratoDto): boolean {
        return (this.parametrosSeleccionados() ?? []).some(
            x => x.cod_parametro_contrato === row.cod_parametro_contrato
        );
    }

    public isRowSeleccionado(row: ParametrosContratoDto): boolean {
        return this.listFilasSeleccionadas().some(
            x => x.cod_parametro_contrato === row.cod_parametro_contrato
        );
    }

    public onCheckboxChange(event: Event, row: ParametrosContratoDto): void {
        if (row.bloqueado || this.isPersistido(row)) {
            return;
        }

        const checkbox = event.target as HTMLInputElement;
        const seleccionados = this.listFilasSeleccionadas();

        if (checkbox.checked) {
            const existe = seleccionados.some(
                x => x.cod_parametro_contrato === row.cod_parametro_contrato
            );

            if (!existe) {
                this.listFilasSeleccionadas.set([
                    ...seleccionados,
                    row
                ]);
            }
        } else {
            this.listFilasSeleccionadas.set(
                seleccionados.filter(
                    x => x.cod_parametro_contrato !== row.cod_parametro_contrato
                )
            );
        }
    }

    public confirmarSeleccion(): void {
        const dataAEnviar = this.listFilasSeleccionadas().filter(
            item => !this.isPersistido(item)
        );

        if (dataAEnviar.length === 0) return;

        dataAEnviar.forEach(item => item.bloqueado = true);

        this.onDataAceptada.emit(dataAEnviar);
        this.abrirModalCostoPartida.emit(false);
    }

}
