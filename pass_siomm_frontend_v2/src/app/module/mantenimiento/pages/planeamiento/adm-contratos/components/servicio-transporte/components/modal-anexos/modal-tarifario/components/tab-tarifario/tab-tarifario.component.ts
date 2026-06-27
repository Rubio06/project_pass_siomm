import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
    selector: 'app-tab-tarifario',
    imports: [],
    templateUrl: './tab-tarifario.component.html',
    styleUrl: './tab-tarifario.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabTarifarioComponent {

    activeTab = input<string>('transporte-mineral');
    onTabChange = output<string>();

    public cambiarTab(nuevaTab: string) {
        this.onTabChange.emit(nuevaTab);
    }
}
