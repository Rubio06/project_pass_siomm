import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServioTransporteService } from '../../../../../../../services/servico-transporte.service';
import { TablaDetalleDto } from '../../../../../../../interfaces/servicio-transporte.interface';

@Component({
    selector: 'app-parametros-principales',
    imports: [ReactiveFormsModule],
    templateUrl: './parametros-principales.component.html',
})
export class ParametrosPrincipalesComponent implements OnInit {
    isLoading = signal<boolean>(false)
    public servioTransporteService = inject(ServioTransporteService);

    public parametroPrincipalArray = input.required<FormArray<FormGroup>>();
    public listUndMedida = signal<TablaDetalleDto[]>([]);


    ngOnInit(): void {
        this.obtenerDetalleTablaPu()
    }

    get filas(): FormGroup[] {
        const array = this.parametroPrincipalArray();
        return array && array.controls ? (array.controls as FormGroup[]) : [];
    }

    public obtenerDetalleTablaPu(): void {
        this.servioTransporteService.obtenerDetalleTablaPu('03', '01').subscribe({
            next: (data: TablaDetalleDto[]) => {
                this.listUndMedida.set(data);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Error capturado en el componente: ', err);
            }
        });
    }




}
