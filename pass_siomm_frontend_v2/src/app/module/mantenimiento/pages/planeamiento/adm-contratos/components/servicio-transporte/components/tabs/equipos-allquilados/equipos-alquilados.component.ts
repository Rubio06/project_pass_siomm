import { ChangeDetectionStrategy, Component, input, signal, effect, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    public formUtils = FormUtils
    ngOnInit(): void {
        this.cargarEquiposPorFila();
    }


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
            accion: ['I']

            // ... agrega los campos que necesites
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
                cod_contrato: this.cod_contrata(),
                cod_equipo_pesado: fila.get('cod_equipo_pesado')?.value
            };

            this.servioTransporteService.eliminarTarifarioEquipoPesado(dto).subscribe({
                next: (respuesta) => {
                    if (respuesta.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Eliminación Exitosa', respuesta.mensaje);
                        this.equipos().removeAt(index);
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
    }



}
