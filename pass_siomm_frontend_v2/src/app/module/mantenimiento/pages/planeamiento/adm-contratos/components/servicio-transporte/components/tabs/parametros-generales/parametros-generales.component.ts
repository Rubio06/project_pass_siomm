import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { ParametroContrato, TablaDetalle, TablaDetalleRequest } from '../../../interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { ContratoDetalleResponse, EntradaEliminarParametro } from '../../../../../interfaces/adm-contrato.interface';

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

    public dataContrato = input<any>();

    // El output ahora transporta un string (el código del contrato)

    onAbrirContrato = output<ContratoDetalleResponse>();

    cod_contrato = input<string>('');

    cod_contrata = input<string>('');

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

    isOptionUsada(codParametro: string, indiceFilaActual: number): boolean {
        // 1. Si está en modo visualizar, no bloqueamos nada en absoluto
        // if (this.modo() === 'visualizar') return false;

        // 2. Buscamos en el FormArray (las filas en pantalla) si ya se usó este 'codParametro'
        return this.filas.some((fila, index) => {
            // Ignoramos la fila actual para que el select no se bloquee a sí mismo al desplegarse
            if (index === indiceFilaActual) return false;

            const valorSeleccionado = fila.get('cod_parametro_contrato')?.value;    
            return valorSeleccionado === codParametro;
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
        this.parametros().markAsDirty();
    }

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

            const dto: EntradaEliminarParametro = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: this.cod_contrato(),
                cod_parametro_contrato: fila.get('cod_parametro_contrato')?.value
            };

            this.servioTransporteService.eliminarParametroContrato(dto).subscribe({
                next: (respuesta) => {
                    if (respuesta.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Eliminación Exitosa', respuesta.mensaje);
                        this.parametros().removeAt(index);
                        this.cargarParametroContrato();
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
            cod_parametro_contrato: ['', [Validators.required]],
            cod_moneda: [''],
            imp_porcentaje: [null, [Validators.required,
            Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            imp_monto: [null, [Validators.required,
            Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            des_observacion: [''],
            flg_vigente: [''],
            c_t_anexo: [''],
            cod_valor: [''],
            cod_usuario_modi: [null],
            cod_usuario_creo: [sessionStorage.getItem('username') ?? null],
            cod_tabla_anexo: ['005'],
            cod_item_anexo: ['', [Validators.required]],
            accion: ['I']
        });
    }


}
