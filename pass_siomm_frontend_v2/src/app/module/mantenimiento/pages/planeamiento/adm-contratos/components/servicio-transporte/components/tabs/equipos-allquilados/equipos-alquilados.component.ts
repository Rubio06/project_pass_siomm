import { ChangeDetectionStrategy, Component, input, signal, effect, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { ContratoEquipoVehiculo, ContratoEquipoVehiculoRequest } from '../../../interfaces/servicio-transporte.interface';

@Component({
    selector: 'app-equipos-alquilados',
    imports: [ReactiveFormsModule],
    templateUrl: './equipos-alquilados.component.html',
})
export class EquiposAlquiladosComponent implements OnInit {

    private readonly servioTransporteService = inject(ServioTransporteService);
    private fb = inject(FormBuilder);

    public isLoading = signal<boolean>(false);
    public listEquiposContrata = signal<ContratoEquipoVehiculo[]>([]);
    public cod_contrata = input<string>('');
    // 📥 Recibes el FormArray enviado desde el componente Padre como un Input de tipo Signal
    public equipos = input.required<FormArray<FormGroup>>();

    ngOnInit(): void {
        this.cargarEquiposPorFila();
    }

    /**
     * 📐 Getter corregido para tu HTML: Extrae los controles resolviendo la señal del input con ()
     */
    get filas(): FormGroup[] {
        return this.equipos().controls as FormGroup[];
    }

    private crearFila(): FormGroup {
        return this.fb.group({
            cod_equipo_pesado: [''],
            cod_equipo_pesado_1: [''],

            des_descripcion: [''],
            ind_tarifa: [''],
            ind_moneda: [''],
            imp_alquiler_equipo: [''],
            flg_vigencia: [''],

            // ... agrega los campos que necesites
        });
    }

    /**
     * 📥 Obtiene la lista de equipos autorizados/disponibles para la contrata
     */
    public cargarEquiposPorFila(): void {

        this.isLoading.set(true);
        const payload: ContratoEquipoVehiculoRequest = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrata: this.cod_contrata()


        }

        this.servioTransporteService.obtenerEquiposContrata(payload).subscribe({
            next: (data) => {
                this.listEquiposContrata.set(data);
            },
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });
    }

    onEquipoChange(event: Event, fila: FormGroup): void {
        const codigo = (event.target as HTMLSelectElement).value;
        
        fila.patchValue({
            cod_equipo_pesado_1: codigo
        });
    }

    public onEliminarFila(index: number) {
        this.equipos().removeAt(index);
    }

    // ✅ Agregar fila al FormArray del padre (modifica directamente la referencia)
    public onAgregarFila(): void {
        this.equipos().push(this.crearFila());
    }



}
