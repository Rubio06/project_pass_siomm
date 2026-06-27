import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
    selector: 'app-nav-bar',
    imports: [],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {

    detalleTexto = input<string>('');
    listaTexto = input<string>('');

    tabActivo = input.required<string>();
    onTabChange = output<string>();

    public cambiarTab(nuevaTab: string) {
        // this.tabActivo.set(nuevaTab);
        this.onTabChange.emit(nuevaTab);
    }
}
