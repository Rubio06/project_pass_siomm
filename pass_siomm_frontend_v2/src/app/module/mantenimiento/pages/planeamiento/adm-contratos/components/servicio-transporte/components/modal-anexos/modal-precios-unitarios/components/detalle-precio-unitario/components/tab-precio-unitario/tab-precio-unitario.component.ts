import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
    selector: 'app-tab-precio-unitario',
    standalone: true,
    imports: [],
    templateUrl: './tab-precio-unitario.component.html',
    styleUrl: './tab-precio-unitario.component.css',
})
export class TabPrecioUnitarioComponent {

    activeTab = input<string>('parametros-principales');
    onTabChange = output<string>();

    public cambiarTab(nuevaTab: string) {
        this.onTabChange.emit(nuevaTab);
    }


}
