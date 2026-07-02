import { ChangeDetectionStrategy, Component, input, signal, effect, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { ContratoEquipoVehiculo, ContratoEquipoVehiculoRequest } from '../../../interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';

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
    public formUtils = FormUtils;
    public onRegistroEliminado = output<string>();
    public cod_contrato = input<string>('')
    public ind_estado = input<string>('');

    ngOnInit(): void {
        this.cargarEquiposPorFila();
    }


    get filas(): FormGroup[] {
        return this.equipos().controls as FormGroup[];
    }

    private crearFila(): FormGroup {
        return this.fb.group({
            cod_equipo_pesado: ['', [Validators.required]],
            cod_equipo_pesado_1: [{ value: '', disabled: true }, [Validators.required]],

            // des_descripcion: ['', [Validators.required]],
            ind_tarifa: ['', [Validators.required]],
            ind_moneda: ['', [Validators.required]],
            imp_alquiler_equipo: ['', [Validators.required,
            Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            flg_vigencia: [{ value: '1', disabled: true }, [Validators.required]],
            accion: ['I']

            // ... agrega los campos que necesites
        });
    }
    isOptionUsada(codParametro: string, indiceFilaActual: number): boolean {
        return this.filas.some((fila, index) => {
            // Ignoramos la fila actual para que el select no se bloquee a sí mismo al desplegarse
            if (index === indiceFilaActual) return false;

            const valorSeleccionado = fila.get('cod_equipo_pesado')?.value;
            return valorSeleccionado === codParametro;
        });
    }

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

    formatearCorrelativo(index: number): string {
        // index + 1 convierte el 0 en 1, el 1 en 2, etc.
        const numeroFila = index + 1;

        // padStart(3, '0') asegura que el texto tenga un largo de 3 caracteres rellenando con '0'
        return numeroFila.toString().padStart(3, '0');
    }

    public onEliminarFila(index: number, fila: FormGroup): void {
        const esNueva = this.equipos().at(index).get('accion')?.value === 'I';

        if (esNueva) {
            this.equipos().removeAt(index);
            return;
        }

        this.formUtils.confirmarAnulacionClase(
            'Eliminar Fila',
            `¿Desea eliminar este equipo?`,
            'Sí, Eliminar',
            'No, Cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;

            const dto = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: this.cod_contrato(),
                cod_equipo_pesado: fila.get('cod_equipo_pesado')?.value
            };

            this.servioTransporteService.eliminarTarifarioEquipoPesado(dto).subscribe({
                next: (respuesta) => {
                    if (respuesta.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Eliminación Exitosa', respuesta.mensaje);
                        this.equipos().removeAt(index);
                        this.cargarEquiposPorFila();

                    } else {
                        this.formUtils.alertaNoPermitidoClase('Error', respuesta.mensaje);
                    }
                },
                error: (err) => {
                    const msg = err.error?.mensaje || 'Error al eliminar.';
                    alert(`Error: ${msg}`);
                }
            });
        });
    }

    public onAgregarFila(): void {
        this.equipos().push(this.crearFila());
        this.equipos().markAsDirty();
    }



}
