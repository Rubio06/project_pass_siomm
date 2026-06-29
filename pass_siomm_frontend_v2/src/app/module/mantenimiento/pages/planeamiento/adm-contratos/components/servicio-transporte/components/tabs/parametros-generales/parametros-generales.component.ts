import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { ParametroContrato, TablaDetalle, TablaDetalleRequest } from '../../../interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';

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
    private fb = inject(FormBuilder);
    public formUtils = FormUtils;

    cod_contrato = input<string>('');

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


    public onAgregarFila(): void {
        this.parametros().push(this.crearFila());
    }

    // public onEliminarFila(index: number): void {
    //     this.parametros().removeAt(index);
    // }
    public onEliminarFila(index: number, fila: FormGroup): void {
        const esNueva = this.parametros().at(index).get('accion')?.value === 'I';

        if (esNueva) {
            this.parametros().removeAt(index);
            return;
        }

        this.formUtils.confirmarAnulacionClase(
            'Eliminar Fila',
            `¿Desea eliminar este parámetro?`,
            'Sí, Eliminar',
            'No, Cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;

            const dto = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: this.cod_contrato(),
                cod_parametro_contrato: fila.get('cod_parametro_contrato')?.value
            };

            this.servioTransporteService.eliminarParametroContrato(dto).subscribe({
                next: (respuesta) => {
                    if (respuesta.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Eliminación Exitosa', respuesta.mensaje);
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

    private crearFila(): FormGroup {
        return this.fb.group({
            cod_parametro_contrato: [''],
            cod_moneda: [''],
            imp_porcentaje: [null],
            imp_monto: [null],
            des_observacion: [''],
            flg_vigente: [''],
            c_t_anexo: [''],
            cod_valor: [''],
            cod_tabla_anexo: [''],
            cod_item_anexo: [''],
            accion: ['I']
        });
    }
}
