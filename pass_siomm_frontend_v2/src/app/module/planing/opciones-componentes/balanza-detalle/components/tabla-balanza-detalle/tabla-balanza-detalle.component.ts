import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { TicketBalanzaDto } from '../../interface/balanza-detalle.interface';

@Component({
    selector: 'app-tabla-balanza-detalle',
    imports: [],
    templateUrl: './tabla-balanza-detalle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaBalanzaDetalleComponent {


    listBalanzaDetalle = input<TicketBalanzaDto[]>([])

    isLoading = input<boolean>(false);

    obBalanzaDetalle = output<TicketBalanzaDto>()

    codTicketBalanza = input<string>('');

    public onSelecionar(dt: TicketBalanzaDto) {
        this.obBalanzaDetalle.emit(dt)
    }





}
