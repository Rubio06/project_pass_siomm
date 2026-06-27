import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { ParametroContrato, TablaDetalle, TablaDetalleRequest } from '../../../interfaces/servicio-transporte.interface';

@Component({
    selector: 'app-parametros-generales',
    imports: [ReactiveFormsModule],
    templateUrl: './parametros-generales.component.html',
})
export class ParametrosGeneralesComponent implements OnInit {
    private readonly servioTransporteService = inject(ServioTransporteService);

    isLoading = signal(false);
    public parametros = input<FormArray<FormGroup>>(new FormArray<FormGroup>([]));

    public listParametroContato = signal<ParametroContrato[]>([]);

    public listParametroGeneral = signal<TablaDetalle[]>([]);


    ngOnInit(): void {
        this.cargarParametroContrato();
    }

    get filas(): FormGroup[] {
        return this.parametros().controls as FormGroup[];
    }

    public cargarParametroContrato(): void {
        this.servioTransporteService.obtenerParametrosContato().subscribe({
            next: (data) => {
                this.listParametroContato.set(data);
                this.cargarEquiposPorFila();

            },
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });
    }

    public cargarEquiposPorFila(): void {
        this.isLoading.set(true);

        this.servioTransporteService.obtenerTabla('005').subscribe({
            next: (data) => this.listParametroGeneral.set(data),
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });

    }
}
