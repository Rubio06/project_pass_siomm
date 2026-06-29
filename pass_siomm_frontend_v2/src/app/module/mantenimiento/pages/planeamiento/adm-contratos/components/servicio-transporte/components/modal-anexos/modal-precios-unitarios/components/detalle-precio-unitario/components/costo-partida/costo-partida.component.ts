import { DecimalPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, OnInit, Output, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FiltrosCostoPartidaComponent } from './components/filtros-costo-partida/filtros-costo-partida.component';
import { DetPartidaCostosPuDto, EliminarPartidaDto, ParametrosContratoDto, RespuestaApiDto } from '../../../../../../../interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { ServioTransporteService } from '../../../../../../../services/servico-transporte.service';

@Component({
    selector: 'app-costo-partida',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DecimalPipe, FiltrosCostoPartidaComponent],
    templateUrl: './costo-partida.component.html',
})
export class CostoPartidaComponent implements OnInit {

    private fb = inject(FormBuilder);

    isLoading = signal<boolean>(false);
    abrirModalCostoPartida = signal<boolean>(false);
    public servioTransporteService = inject(ServioTransporteService);
    public costoPartidaArray = input.required<FormArray<FormGroup>>();
    public parametrosSeleccionados = signal<ParametrosContratoDto[]>([]);
    public formUtils = FormUtils;
    cargarPrecioUnitarioCabTab = output<void>()
    public tipoCambioDolares = signal<number>(0)

    public imp_costo_directo = input<number>(0); // El <number> es para definir el tipo
    public c_n_porcentaje = input<number>(0); // El <number> es para definir el tipo
    public c_n_monto = input<number>(0); // El <number> es para definir el tipo
    public nro_trabajador = input<number>(0); // El <number> es para definir el tipo
    public nro_hotras_labor = input<number>(0); // El <number> es para definir el tipo

    onTotalPuSol = output<number>();
    onTotalGeneral = output<number>();


    get filas(): FormGroup[] {

        const array = this.costoPartidaArray();

        return array && array.controls ? (array.controls as FormGroup[]) : [];
    }

    ngOnInit() {
        this.servioTransporteService.getUSDtoPEN().subscribe(rate => {
            this.tipoCambioDolares.set(rate);
        });

        this.sincronizarParametrosSeleccionados();
    }

    private sincronizarParametrosSeleccionados(): void {
        const seleccionados = this.filas.reduce<ParametrosContratoDto[]>((acc, fila) => {
            const codParametro = fila.get('cod_parametro_contrato')?.value;

            if (!codParametro) return acc;

            const yaExiste = acc.some(item => item.cod_parametro_contrato === codParametro);

            if (!yaExiste) {
                acc.push({
                    cod_parametro_contrato: codParametro,
                    des_parametro_contrato: fila.get('c_t_parametro')?.value ?? '',
                    nro_orden: 0,
                    cod_operador: '',
                    cod_valor: fila.get('c_n_valor')?.value ?? '',
                    cod_anexo: '',
                    des_observacion: '',
                    ind_obligatorio: '',
                    flg_vigente: '',
                    bloqueado: true,
                    c_fl: '',
                    esNueva: false
                });
            }

            return acc;
        }, []);

        this.parametrosSeleccionados.set(seleccionados);
    }

    public onDataAceptada(data: ParametrosContratoDto[]): void {
        if (!data || data.length === 0) return;

        const array = this.costoPartidaArray();
        const codigosExistentes = new Set(
            array.controls.map(control => control.get('cod_parametro_contrato')?.value)
        );

        data.forEach(item => {
            if (codigosExistentes.has(item.cod_parametro_contrato)) return;

            array.push(this.fb.group({
                cod_parametro_contrato: [item.cod_parametro_contrato],
                c_t_parametro: [item.des_parametro_contrato],
                c_n_valor: [item.cod_valor],
                c_n_porcentaje: [this.c_n_porcentaje()],
                c_n_monto: [this.c_n_monto()],
                nro_trabajador: [this.nro_trabajador()],
                nro_hotras_labor: [this.nro_hotras_labor()],
                imp_costo_directo: [0],
                imp_precio_soles: [0],
                imp_tipo_cambio: [0],
                accion: ['I']

            }));

            codigosExistentes.add(item.cod_parametro_contrato);
        });

        this.sincronizarParametrosSeleccionados();
    }


    public onEliminarFila(index: number, fila: DetPartidaCostosPuDto): void {
        const array = this.costoPartidaArray();
        const nuevo = array.at(index).get('esNueva')?.value
        if (!nuevo) {
            array.removeAt(index);
            this.sincronizarParametrosSeleccionados();
            return;
        }

        this.formUtils.confirmarInactivar("Eliminando Patida Costo PU",
            `¿Desea eliminar la partida costos PU nro. ${fila.nro_partida}?`,
            'Si, Eliminar').then(result => {

                if (!result.isConfirmed) return;

                // 2. Si el registro ya venía de la Base de Datos, lo borramos físicamente
                if (fila.nro_partida) {
                    const payload: EliminarPartidaDto = {
                        cod_empresa: '03',
                        cod_empresa_unidad: '01',
                        cod_contrato: fila.cod_contrato,
                        cod_catalogo_tarea: fila.cod_catalogo_tarea,
                        cod_actividad: fila.cod_actividad,
                        nro_partida: fila.nro_partida.toString(),
                        cod_parametro_contrato: fila.cod_parametro_contrato
                    };

                    this.servioTransporteService.eliminarPartidaCostoPu(payload).subscribe({
                        next: (res: RespuestaApiDto) => {
                            if (res.estado === 1) {
                                this.formUtils.alertaInactivo('Eliminación Satisfactoria', res.mensaje);
                                this.cargarPrecioUnitarioCabTab.emit();
                            } else {

                                this.formUtils.alertaInactivo('Eliminación Incorrecta', res.mensaje);

                            }
                        },
                        error: (err) => {
                            console.error('Error Controlado:');
                            console.error('Estado de Error:'); // 0
                        }
                    })
                }

            })


    }

    // [disabled]="isEquipoDuplicado(eq.cod_equipo, i)"


    // @for (eq of listEquiposVal(); track eq.cod_equipo) {
    // <option [value]="eq.cod_equipo" [disabled]="isEquipoDuplicado(eq.cod_equipo, i)">
    //     {{ eq.des_equipo }}
    // </option>
    // }


    //                                 public isEquipoDuplicado(codEquipo: string, indexActual: number): boolean {
    //     // Si el valor está vacío, no bloqueamos nada
    //     if (!codEquipo) return false;

    //     // Recorremos los controles del FormArray
    //     return this.filas.controls.some((control, index) => {
    //         // Saltamos la fila actual (un equipo sí puede estar seleccionado en SU propia fila)
    //         if (index === indexActual) return false;

    //         // Obtenemos el valor seleccionado de la fila competidora
    //         const equipoSeleccionado = control.get('cod_equipo')?.value;

    //         // Si coincide con el código que estamos evaluando en el bucle del <option>, devolvemos true
    //         return equipoSeleccionado === codEquipo;
    //     });
    // }


    get subTotalPartida(): number {
        return this.filas.reduce((suma, fila) => {
            const precio = Number(fila.value.imp_precio_soles) || 0;
            return suma + precio;
        }, 0);
    }

    get totalGeneral(): number {
        const sumaPrecioSoles = this.filas.reduce((acc, fila) => {
            return acc + (Number(fila.get('imp_precio_soles')?.value) || 0);
        }, 0);

        const costoDirecto = Number(this.imp_costo_directo()) || 0;
        const resultado = sumaPrecioSoles + costoDirecto;
        this.onTotalGeneral.emit(resultado)
        return sumaPrecioSoles + costoDirecto;
    }


    get totalPuSol(): number {
        const sumaPrecioSoles = this.filas.reduce((acc, fila) => {
            return acc + (Number(fila.get('imp_precio_soles')?.value) || 0);
        }, 0);


        const costoDirecto = Number(this.imp_costo_directo()) || 0;
        const resultado = (sumaPrecioSoles + costoDirecto) / this.tipoCambioDolares();

        this.onTotalPuSol.emit(resultado);

        return (sumaPrecioSoles + costoDirecto) / this.tipoCambioDolares();
    }

    // En tu componente .ts
    // 2. Getter para la etiqueta (tomando el valor de la primera fila como referencia)
    get etiquetaGlobal(): string {
        const primeraFila = this.filas.length > 0 ? this.filas[0] : null;
        const um = primeraFila?.get('um_pago')?.value || 'UNIDAD';
        return `COSTO POR ${um.toUpperCase()} DE AVANCE`;
    }

}
