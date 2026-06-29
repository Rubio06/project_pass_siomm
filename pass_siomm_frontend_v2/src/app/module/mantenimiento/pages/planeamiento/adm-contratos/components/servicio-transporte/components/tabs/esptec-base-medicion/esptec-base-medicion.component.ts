import { ChangeDetectionStrategy, Component, input, signal, effect, OnInit, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
                console.log("la data es " + JSON.stringify(data, null, 2))
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
    }


    private crearFila(): FormGroup {
        return this.fb.group({
            cod_parametro_medicion: [''],
            cod_tabla_um_pv: [''],
            cod_item_um_pv: [''],
            cod_tabla_um_ap: [''],
            cod_item_um_ap: [''],
            nro_potencia_veta_1: ['0.00'],
            nro_potencia_veta_2: ['0.00'],
            nro_ancho_pago_1: ['0.00'],
            cod_valor_ap: [''],
            cod_valor_pv: [''],
            c_t_pv: [''],
            c_t_ap: [''],
            accion: ['I']
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