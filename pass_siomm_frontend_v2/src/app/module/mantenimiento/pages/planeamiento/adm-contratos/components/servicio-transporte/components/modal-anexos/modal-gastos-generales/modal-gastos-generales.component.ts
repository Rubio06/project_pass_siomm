import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ContratoEquipoVehiculoRequest, CostosFijosDetalle, EntradaCostoFijo, GastosGenerales, GastosGeneralesInsertarDTO, GastosGeneralesRequest, GastosGneralesRequest, RespuestCostoFijo } from '../../../interfaces/servicio-transporte.interface';
import { ServioTransporteService } from '../../../services/servico-transporte.service';
import { ModalBusquedaGeneralComponent } from './components/modal-busqueda-general/modal-busqueda-general.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-modal-gastos-generales',
    imports: [DecimalPipe, ModalBusquedaGeneralComponent, ReactiveFormsModule],
    templateUrl: './modal-gastos-generales.component.html',
})
export class ModalGastosGeneralesComponent implements OnInit {
    private readonly servioTransporteService = inject(ServioTransporteService);
    private readonly fb = inject(FormBuilder);
    public formUtils = FormUtils;
    public isLoading = signal<boolean>(false);
    abrirModalBusqueda = signal<boolean>(false);
    onCerrarModalGastos = output<void>();

    cod_contrato = input<string>('');
    ind_estado = input<string>('');
    // FormGroup principal con el FormArray
    form: FormGroup = this.fb.group({
        filas: this.fb.array([])
    });

    // Getter para acceder al FormArray fácilmente
    get filas(): FormArray {
        return this.form.get('filas') as FormArray;
    }

    ngOnInit(): void {
        this.cargarEquiposPorFila();
    }

    public cargarEquiposPorFila(): void {
        this.isLoading.set(true);
        const payload: GastosGeneralesRequest = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato()
        };

        this.servioTransporteService.obtenerGastosGenerales(payload).subscribe({
            next: (data) => {
                this.filas.clear();
                data.forEach(item => this.filas.push(this.crearFila(item)));
            },
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });
    }

    // Crea un FormGroup por cada fila
    private crearFila(item: GastosGenerales, esNueva = false): FormGroup {
        return this.fb.group({
            c_t_gastos: [item.c_t_gastos],
            c_t_gastos_det: [item.c_t_gastos_det],
            ind_moneda: ['D'],
            cod_costo_fijo: [item.cod_costo_fijo],
            cod_item_det: [item.cod_item_det],
            imp_costo_fijo: [(item.imp_costo_fijo ?? 0).toFixed(3), [
                Validators.required,
                Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)
            ]],
            cnt_prog_mes: [(item.cnt_prog_mes ?? 0).toFixed(3), [
                Validators.required,
                Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)
            ]],
            flg_vigente: [item.flg_vigente],
            esNueva: [esNueva],
            accion: [esNueva ? 'I' : 'U'] // 'I' para insertar, 'U' para actualizar
        });
    }

    get tieneCambiosPendientes(): boolean {
        const hayFilasNuevas = this.filas.controls.some(fila => fila.get('esNueva')?.value === true);
        return this.form.dirty || this.filas.dirty || this.filas.controls.some(fila => fila.dirty) || hayFilasNuevas;
    }

    public onCerrar(): void {
        if (!this.tieneCambiosPendientes) {
            this.onCerrarModalGastos.emit();
            return;
        }

        this.formUtils.confirmarAnulacionClase(
            '¿Salir sin guardar?',
            'Tiene cambios pendientes. ¿Está seguro de salir?',
            'Sí, salir',
            'No, quedarme'
        ).then(result => {
            if (result.isConfirmed) {
                this.onCerrarModalGastos.emit();
            }
        });
    }
    // Recibe datos del modal hijo y los agrega al FormArray
    public onModalBusqueda(costos: CostosFijosDetalle[]): void {
        const existentes = new Set(
            this.filas.controls.map(fila =>
                `${fila.get('c_t_gastos')?.value}|${fila.get('c_t_gastos_det')?.value}`
            )
        );

        const tieneDuplicados = costos.some(costo =>
            existentes.has(`${costo.c_t_gastos}|${costo.c_t_gastos_det}`)
        );

        if (tieneDuplicados) {
            this.formUtils.alertaNoPermitidoClase('Registros Existentes', 'No se puede ingresar registros duplicados');
            return;
        }

        costos.forEach(costo => {
            this.filas.push(this.crearFila(costo as any, true));
        });

        this.abrirModalBusqueda.set(false);
    }

    public onEliminarFila(index: number, fila: CostosFijosDetalle): void {
        const esNueva = this.filas.at(index).get('esNueva')?.value === true;

        if (esNueva) {
            this.filas.removeAt(index);
            return;
        }

        // if (!confirm('Este registro ya está guardado. ¿Desea eliminarlo permanentemente de la base de datos?')) {
        //     return;
        // }


        const dtoEliminar: EntradaCostoFijo = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            cod_costo_fijo: fila.cod_costo_fijo,
            cod_item_det: fila.cod_item_det
        };

        // Confirmación antes de guardar
        this.formUtils.confirmarAnulacionClase(
            'Eliminar Fila',
            `¿Desea eliminar el costo fijo ${fila.cod_costo_fijo} con el detalle ${fila.c_t_gastos_det}?`,
            'Sí, Eliminar',
            'No, Eliminar'
        ).then(result => {
            if (!result.isConfirmed) return;

            this.servioTransporteService.eliminarCostoFijoDetalle(dtoEliminar).subscribe({
                next: (respuesta: RespuestCostoFijo) => {
                    if (respuesta.estado === 1) {
                        this.formUtils.mensajeEliminarLaborClase('Eliminación Exitosa', respuesta.mensaje);

                        this.filas.removeAt(index);
                        this.cargarEquiposPorFila();
                    } else if (respuesta.estado === 0) {
                        this.formUtils.alertaNoPermitidoClase('Error de Eliminación', respuesta.mensaje);
                    }
                },
                error: (err) => {
                    const msg = err.error?.mensaje || 'Error al intentar eliminar el registro.';
                    alert(`Error: ${msg}`);
                }
            });
        })
    }

    public onGuardar(): void {
        if (this.filas.length === 0) {
            this.formUtils.alertaNoPermitidoClase('Sin datos', 'No hay registros para guardar.');
            return;
        }

        // Marca todos los campos como touched para mostrar errores visuales
        this.filas.controls.forEach(fila => (fila as FormGroup).markAllAsTouched());

        if (this.form.invalid) {
            this.formUtils.alertaNoPermitidoClase('Datos inválidos', 'Verifica los campos con error antes de guardar.');
            return;
        }

        // 1. Determinamos qué filas procesar
        // Supongamos que tienes una propiedad 'this.esUpdate' (true/false) en tu componente
        const esUpdate = true; // <-- Reemplaza con tu lógica o condición real

        const filasAProcesar = esUpdate
            ? this.filas.controls.filter(fila => fila.dirty) // SOLO las modificadas si es UPDATE
            : this.filas.controls;                          // TODAS las filas si es INSERT

        // 2. Si es un UPDATE y nadie modificó nada, detenemos el proceso
        if (filasAProcesar.length === 0) {
            this.formUtils.alertaNoPermitidoClase('Sin cambios', 'No se encontraron modificaciones para actualizar.');
            return;
        }

        // 3. Mapeamos el payload únicamente con las filas filtradas
        const payload: GastosGeneralesInsertarDTO[] = filasAProcesar.map((fila) => {
            return {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: this.cod_contrato(),
                cod_costo_fijo: fila.get('cod_costo_fijo')?.value,
                cod_item_det: fila.get('cod_item_det')?.value,
                ind_moneda: fila.get('ind_moneda')?.value,
                imp_costo_fijo: Number(fila.get('imp_costo_fijo')?.value),
                cnt_prog_mes: Number(fila.get('cnt_prog_mes')?.value),
                // Ojo: Como filtramos el array, 'i' ya no coincide con el índice original.
                // Es mucho mejor obtener el importe directamente desde los controles de la fila actual:
                imp_prog_mes: Number(fila.get('imp_prog_mes')?.value) || 0,
                flg_vigente: fila.get('flg_vigente')?.value,
                cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA',
                accion: fila.get('accion')?.value
            };
        });

        console.log('Payload a enviar:', JSON.stringify(payload, null, 2)); // Para depuración
        // Confirmación antes de guardar
        this.formUtils.confirmarAnulacionClase(
            'Guardar Registros',
            '¿Está seguro de guardar los gastos generales?',
            'Sí, guardar',
            'No, cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;

            this.isLoading.set(true);

            this.servioTransporteService.guardarGastosGenerales(payload).subscribe({
                next: (res: GastosGneralesRequest) => { // Nota: en tu código tenías 'next', lo mantengo igual
                    if (res.estado === 1) {
                        this.formUtils.alertaExitoAnulacion('Guardado', res.mensaje);

                        // IMPORTANTE: Resetea el estado dirty del formulario tras el éxito
                        this.filas.markAsPristine();
                        this.filas.markAsUntouched();

                        this.onCerrarModalGastos.emit();
                    } else {
                        this.formUtils.alertaNoPermitidoClase('Error al Guardar', res.mensaje);
                    }
                },
                error: (err) => {
                    this.formUtils.alertaNoPermitidoClase('Error', err.error?.mensaje ?? 'Error al guardar.');
                },
                complete: () => this.isLoading.set(false)
            });
        });
    }

    // Importe calculado por fila: imp_costo_fijo * cnt_prog_mes
    public getImporte(index: number): number {
        const fila = this.filas.at(index);
        const monto = Number(fila.get('imp_costo_fijo')?.value) ?? 0;
        const cantidad = Number(fila.get('cnt_prog_mes')?.value) ?? 0;
        return monto * cantidad;
    }

    // ── TOTALES ──────────────────────────────────────────────

    get totalCantidad(): number {
        return this.filas.controls.reduce((sum, fila) =>
            sum + (Number(fila.get('cnt_prog_mes')?.value) ?? 0), 0);
    }

    get totalImporteProg(): number {
        return this.filas.controls.reduce((sum, _, i) =>
            sum + this.getImporte(i), 0);
    }

    // // Agrupa las filas del FormArray por cod_costo_fijo
    get filasAgrupadas(): { grupo: string; label: string; indices: number[] }[] {
        const mapa = new Map<string, { label: string; indices: number[] }>();

        this.filas.controls.forEach((fila, index) => {
            const cod = fila.get('cod_costo_fijo')?.value;
            const label = fila.get('c_t_gastos')?.value;

            if (!mapa.has(cod)) {
                mapa.set(cod, { label, indices: [] });
            }
            mapa.get(cod)!.indices.push(index);
        });

        return Array.from(mapa.entries()).map(([grupo, val]) => ({
            grupo,
            label: val.label,
            indices: val.indices
        }));
    }

    // Subtotal monto por grupo
    getSubtotalMonto(indices: number[]): number {
        return indices.reduce((sum, i) =>
            sum + (Number(this.filas.at(i).get('imp_costo_fijo')?.value) ?? 0), 0);
    }

    // Subtotal cantidad por grupo
    getSubtotalCantidad(indices: number[]): number {
        return indices.reduce((sum, i) =>
            sum + (Number(this.filas.at(i).get('cnt_prog_mes')?.value) ?? 0), 0);
    }

    // Subtotal importe (monto * cantidad) por grupo
    getSubtotalImporte(indices: number[]): number {
        return indices.reduce((sum, i) => sum + this.getImporte(i), 0);
    }
}
