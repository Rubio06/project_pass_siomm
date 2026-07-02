import { ChangeDetectionStrategy, Component, input, signal, effect, OnInit, inject, output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParametroMedicionDto, TablaDetalle } from '../../../interfaces/servicio-transporte.interface';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-esptec-base-medicion',
    imports: [ReactiveFormsModule],
    templateUrl: './esptec-base-medicion.component.html',
})
export class EsptecBaseMedicionComponent implements OnInit {
    private readonly servioTransporteService = inject(ServioTransporteService);

    isLoading = signal(false);
    public mediciones = input<FormArray<FormGroup>>(new FormArray<FormGroup>([]));
    public listParametroGeneral = signal<TablaDetalle[]>([]);
    public listMedicion = signal<ParametroMedicionDto[]>([]);
    private fb = inject(FormBuilder);
    public formUtils = FormUtils;
    public cod_contrato = input<string>('');
    public onRegistroEliminado = output<string>();
    public ind_estado = input<string>('');
    ngOnInit(): void {
        this.cargarEquiposPorFila();
        this.obtenerMedicion();
    }

    get filas(): FormGroup[] {
        return this.mediciones().controls as FormGroup[];
    }



    public cargarEquiposPorFila(): void {
        this.isLoading.set(true);

        this.servioTransporteService.obtenerTabla('002').subscribe({
            next: (data) => {
                this.listParametroGeneral.set(data)
            },
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });

    }


    public obtenerMedicion(): void {
        this.isLoading.set(true);

        this.servioTransporteService.obtenerMedicion().subscribe({
            next: (data) => this.listMedicion.set(data),
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });

    }


    public onAsignarPM(event: Event, fila: FormGroup): void {
        const codigoSeleccionado = (event.target as HTMLSelectElement).value;
        if (!codigoSeleccionado) return;

        const lista = this.listMedicion();
        const indice = lista.findIndex(item => item.cod_parametro_medicion === codigoSeleccionado);

        if (indice !== -1) {
            const medicionEncontrada = lista[indice];
            const valorApCalculado = (indice < 2) ? '1' : '2';

            fila.patchValue({
                c_t_ap: medicionEncontrada.des_ancho_pago, // El texto que querías antes
                cod_valor_ap: valorApCalculado            // El nuevo valor dinámico (# o %)
            });

        }
    }

    public onAsignarPG(event: Event, fila: FormGroup): void {
        // 1. Capturamos el 'cod_item' seleccionado en el primer select
        const codigoSeleccionado = (event.target as HTMLSelectElement).value;

        if (!codigoSeleccionado) return;

        // 2. Copiamos exactamente ese mismo código en el control del segundo select
        fila.patchValue({
            cod_item_um_ap: codigoSeleccionado,
            cod_item_um_pv: codigoSeleccionado
        });

    }

    public onAsignarCT(event: Event, fila: FormGroup): void {
        // 1. Capturamos el 'cod_item' seleccionado en el select de 'AP'
        const codigoSeleccionado = (event.target as HTMLSelectElement).value;

        if (!codigoSeleccionado) return;

        // 2. Lo copiamos en el control del select de 'PV' (el de arriba)
        fila.patchValue({
            cod_item_um_pv: codigoSeleccionado
        });

    }

    public onAgregarFila(): void {
        this.mediciones().push(this.crearFila());
        this.mediciones().markAsDirty();
    }


    private crearFila(): FormGroup {
        return this.fb.group({
            nro_potencia_veta_1: ['0.00', [Validators.required,
            Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            cod_item_um_pv: ['', [Validators.required]],
            cod_parametro_medicion: ['', [Validators.required]],
            nro_potencia_veta_2: ['0.00', [Validators.required,
            Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            cod_item_um_ap: ['', [Validators.required]],
            c_t_ap: ['', [Validators.required]],
            nro_ancho_pago_1: ['0.00', [Validators.required,
            Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            cod_valor_ap: ['', [Validators.required]],





            cod_tabla_um_pv: [''],
            cod_tabla_um_ap: [''],

            cod_valor_pv: [''],
            c_t_pv: [''],
            accion: ['I']
        });
    }




    isOptionUsada(codParametro: string, indiceFilaActual: number): boolean {
        return this.filas.some((fila, index) => {
            // Ignoramos la fila actual para que el select no se bloquee a sí mismo al desplegarse
            if (index === indiceFilaActual) return false;

            const valorSeleccionado = fila.get('cod_parametro_medicion')?.value;
            return valorSeleccionado === codParametro;
        });
    }



    public onEliminarFila(index: number, fila: FormGroup): void {
        const esNueva = this.mediciones().at(index).get('accion')?.value === 'I';

        if (esNueva) {
            this.mediciones().removeAt(index);
            return;
        }

        this.formUtils.confirmarAnulacionClase(
            'Eliminar Fila',
            `¿Desea eliminar esta medición?`,
            'Sí, Eliminar',
            'No, Cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;

            const dto = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: this.cod_contrato(),
                cod_parametro_medicion: fila.get('cod_parametro_medicion')?.value
            };

            this.servioTransporteService.eliminarDetContratoMedicion(dto).subscribe({
                next: (respuesta) => {
                    if (respuesta.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Eliminación Exitosa', respuesta.mensaje);
                        this.mediciones().removeAt(index);


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





}
// 