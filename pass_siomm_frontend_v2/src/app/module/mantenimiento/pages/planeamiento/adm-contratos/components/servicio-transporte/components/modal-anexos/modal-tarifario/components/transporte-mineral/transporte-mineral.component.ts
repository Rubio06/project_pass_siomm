import { FormUtils } from './../../../../../../../../../../../../utils/form-utils';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnInit, signal } from '@angular/core';
import { CentroCosto, CuentaContable, EliminarTarifarioTransporte, EntradaTarifarioDetalle, PaginacionTarifarioDetalle, RutaTransporte, TarifarioTransporteDetalle } from '../../../../../interfaces/servicio-transporte.interface';
import { ServioTransporteService } from '../../../../../services/servico-transporte.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NgOptionComponent, NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-transporte-mineral',
    imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
    templateUrl: './transporte-mineral.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransporteMineralComponent implements OnInit {
    private readonly servioTransporteService = inject(ServioTransporteService);
    private readonly fb = inject(FormBuilder);

    public formUtils = FormUtils
    public cod_contrato = input<string>('');
    public isLoading = signal(false);
    public codigoSiguienmte = signal<number>(0)

    public listRutas = signal<RutaTransporte[]>([]);
    public listCentrosCosto = signal<CentroCosto[]>([]);
    public listCuentas = signal<CuentaContable[]>([]);
    public miFormulario!: FormGroup;
    private readonly cdr = inject(ChangeDetectorRef);

    public paginaActual = signal(1);
    public totalRegistros = signal(0);
    public totalPaginas = signal(0);

    public onPaginaCambio(pagina: number): void {
        // Preservar filas nuevas antes de recargar
        const filasNuevas = this.filas.controls
            .filter(f => f.get('esNuevo')?.value === true)
            .map(f => f.value);

        this.paginaActual.set(pagina);

        this.cargarTarifarioDetalle(() => {
            // Restaurar filas nuevas despues de recargar
            filasNuevas.forEach(item => this.filas.push(this.crearFila(item, true)));
        });
    }


    ngOnInit(): void {
        this.inicializarFormulario();
        this.cargarMaestros();
        // this.cargarTarifarioDetalle();

    }

    private inicializarFormulario(): void {
        this.miFormulario = this.fb.group({
            pagina: [1],
            cantidad_reg: [20],
            filasTarifario: this.fb.array([]) // Aquí se almacenarán las filas dinámicamente
        });
    }

    // Getter para acceder cómodamente al FormArray desde el TS y HTML
    get filas(): FormArray {
        return this.miFormulario.get('filasTarifario') as FormArray;
    }



    private crearFila(item: TarifarioTransporteDetalle, esNuevo: boolean = false): FormGroup {
        return this.fb.group({
            cod_empresa: [item.cod_empresa],
            cod_empresa_unidad: [item.cod_empresa_unidad],
            cod_contrato: [item.cod_contrato],
            cod_item_ruta: [item.cod_item_ruta], // Código identificador
            cod_ruta_origen: [item.cod_ruta_origen],
            cod_ruta_intermedia: [item.cod_ruta_intermedia],
            cod_ruta_destino: [item.cod_ruta_destino],
            c_t_zona: [item.c_t_zona, [Validators.required]],
            // Tratamiento seguro de decimales para evitar el '0' por defecto si es nulo
            nro_distancia_km: [(item.nro_distancia_km ?? 0).toFixed(3), [Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            imp_tmh_km_soles: [(item.imp_tmh_km_soles ?? 0).toFixed(3), [Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            imp_ruta_pu: [(item.imp_ruta_pu ?? 0).toFixed(3), [Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            cod_zona: [item.cod_zona],
            cto_cod: [item.cto_cod],
            cta_cod: [item.cta_cod],
            flg_vigencia: [item.flg_vigencia],
            ind_mov_sap: [item.ind_mov_sap],
            ind_material:[item.ind_material],
            esNuevo: [esNuevo]
        }, { validators: this.formUtils.rutasDistintasValidator });
    }

    public cargarTarifarioDetalle(callback?: () => void): void {
        this.isLoading.set(true);
        const payload: EntradaTarifarioDetalle = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            ind_material: 'M',
            pagina: this.paginaActual(),
            cantidad_reg: 10
        };

        this.servioTransporteService.obtenerTarifarioDetalle(payload).subscribe({
            next: (data: PaginacionTarifarioDetalle) => {
                this.filas.clear();
                data.data.forEach(item => this.filas.push(this.crearFila(item)));
                this.totalRegistros.set(data.totalRegistros);
                this.totalPaginas.set(data.totalPaginas);
                this.paginaActual.set(data.paginaActual);
                callback?.();
            },
            error: (err) => console.error(err),
            complete: () => this.isLoading.set(false)
        });
    }


    public obtenerSiguienteItem(): void {
        // CASO A: Si la tabla visual está vacía, vamos a .NET / SQL Server a buscar el punto de partida
        if (this.filas.length === 0) {
            this.servioTransporteService.obtenerSiguienteItem('03', '01', this.cod_contrato())
                .subscribe({
                    next: (res) => {
                        this.codigoSiguienmte.set(res.siguienteCodItem);
                    },
                    error: (err) => console.error(err),
                });
        }
        // CASO B: Si ya hay filas en la pantalla, NO vamos a la base de datos.
        // Simplemente tomamos el ID de la última fila visual y le sumamos +1 nosotros mismos.
        else {
            const ultimaFila = this.filas.at(this.filas.length - 1) as FormGroup;
            const ultimoId = parseInt(ultimaFila.get('cod_item_ruta')?.value || '0', 10);

            this.codigoSiguienmte.set(ultimoId + 1);

        }
    }

    public cargarMaestros(): void {
        this.servioTransporteService.obtenerRutas().subscribe(r => this.listRutas.set(r));
        this.servioTransporteService.obtenerCentrosCosto().subscribe(c => this.listCentrosCosto.set(c));
        this.servioTransporteService.obtenerCuentasContables().subscribe({
            next: c => {
                this.listCuentas.set(c);
                this.cargarTarifarioDetalle();

            }
        });
    }

    public onAgregarFila(): void {
        const filasNuevas = this.filas.controls.filter(f => f.get('esNuevo')?.value === true);

        if (filasNuevas.length > 0) {
            const maxCodigo = Math.max(...filasNuevas.map(f => parseInt(f.get('cod_item_ruta')?.value || '0', 10)));
            this.agregarFilaConCodigo(maxCodigo + 1);
        } else {
            this.servioTransporteService.obtenerSiguienteItem('03', '01', this.cod_contrato()).subscribe({
                next: (res) => this.agregarFilaConCodigo(res.siguienteCodItem),
                error: (err) => console.error(err)
            });
        }
    }

    private agregarFilaConCodigo(codigo: number): void {
        const nuevoItem: TarifarioTransporteDetalle = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            cod_item_ruta: codigo.toString(),
            cod_ruta_origen: '',
            cod_ruta_intermedia: '',
            cod_ruta_destino: '',
            cod_zona: '',
            c_t_zona: '',
            nro_distancia_km: 0,
            imp_tmh_km_soles: 0,
            imp_ruta_pu: 0,
            cto_cod: '',
            cta_cod: '',
            flg_vigencia: '1',
            ind_mov_sap: '',
            ind_material: 'M'
        } as TarifarioTransporteDetalle;


        this.filas.push(this.crearFila(nuevoItem, true));

        const nuevoTotal = this.totalRegistros() + 1;
        this.totalRegistros.set(nuevoTotal);
        this.totalPaginas.set(Math.ceil(nuevoTotal / 10)); // recalcular en base al nuevo total

        this.paginaActual.set(this.totalPaginas()); // ahora sí apunta a la página correcta
        this.miFormulario.markAsDirty();

        setTimeout(() => {
            const contenedorTabla = document.getElementById('scrollContenedor');
            if (contenedorTabla) contenedorTabla.scrollTo({ top: contenedorTabla.scrollHeight, behavior: 'smooth' });
        }, 50);


        // al final de agregarFilaConCodigo
        this.cdr.markForCheck();
    }

    public onRutaOrigenChange(index: number, codRuta: string): void {
        const ruta = this.listRutas().find(r => r.cod_ruta === codRuta);
        const fila = this.filas.at(index) as FormGroup;
        fila.get('c_t_zona')?.setValue(ruta?.c_t_zona ?? '');
    }

    public onEliminar(index: number, filaGroup: AbstractControl): void {
        const group = filaGroup as FormGroup;

        const esFilaNueva = group.get('esNuevo')?.value;

        if (esFilaNueva === true) {
            this.filas.removeAt(index);
            this.miFormulario.markAsDirty();
            return;
        }

        // Escenario B: Ya existe en la base de datos de la mina, requiere confirmación
        this.formUtils.confirmarEliminacionPlanos(
            'Eliminacion de una Fila',
            `¿Desea eliminar el transporte mineral con el codigo de ruta ${group.get('cod_item_ruta')?.value}?`
        ).then(result => {

            if (!result.isConfirmed) return;
            const payload: EliminarTarifarioTransporte = {
                cod_empresa: group.get('cod_empresa')?.value,
                cod_empresa_unidad: group.get('cod_empresa_unidad')?.value,
                cod_contrato: group.get('cod_contrato')?.value,
                cod_item_ruta: group.get('cod_item_ruta')?.value,
                ind_material: 'M'
            };

            this.servioTransporteService.eliminarTarifarioTransporte(payload)
                .subscribe({
                    next: (resp) => {
                        if (resp.estado === 1) {
                            // this.filas.removeAt(index); // Se quita de la vista tras el éxito en SQL Server
                            this.formUtils.alertaEliminadoClase(resp.mensaje);
                            this.cargarTarifarioDetalle();

                        } else {
                            this.formUtils.alertaNoEliminadoMensajeClase(resp.mensaje);
                        }
                    },
                    error: (err) => {
                        // console.error('Error al intentar eliminar el registro:', err);
                        // alert('Ocurrió un error al eliminar el registro.');
                        this.formUtils.alertaNoEliminadoMensajeClase(err);
                    }
                });


        })
    }


    // public obtenerNombreCuentaContable(codigo: string): string {
    //     if (!codigo) return '';
    //     const cta = this.listCuentas().find(c => c.cta_cod === codigo);
    //     return cta ? cta.cta_des : '';
    // }

    // ==========================================
    // MÉTODOS EVENTO (CHANGE) PARA CAPTURAR EL CÓDIGO REAL
    // ==========================================



    // public onCuentaContableSeleccionada(event: Event, index: number): void {
    //     const inputElement = event.target as HTMLInputElement;
    //     const nombreSeleccionado = inputElement.value;

    //     const ctaEncontrado = this.listCuentas().find(c => c.cta_des === nombreSeleccionado);
    //     const filaGroup = this.filas.at(index) as FormGroup;

    //     if (ctaEncontrado) {
    //         filaGroup.get('cta_cod')?.setValue(ctaEncontrado.cta_cod);
    //     } else {
    //         filaGroup.get('cta_cod')?.setValue('');
    //         inputElement.value = '';
    //     }
    //     filaGroup.get('cta_cod')?.markAsDirty();
    // }
    // ==========================================
    // ACCIÓN: ELIMINAR FILA
    // ==========================================
    // public onEliminarFila(index: number): void {
    //     const fila = this.filas.at(index).value;

    //     if (!confirm(`¿Desea eliminar la ruta código ${fila.cod_item_ruta}?`)) {
    //         return;
    //     }

    //     // Si el registro ya existe en la Base de Datos (tiene ID de ruta)
    //     if (fila.cod_item_ruta) {
    //         this.isLoading.set(true);
    //         this.servioTransporteService.eliminarTarifarioDetalle(fila).subscribe({
    //             next: (res) => {
    //                 this.filas.removeAt(index);
    //                 alert('Registro eliminado de la base de datos.');
    //             },
    //             error: (err) => alert('Error al eliminar: ' + err.message),
    //             complete: () => this.isLoading.set(false)
    //         });
    //     } else {
    //         // Si era una fila nueva del frontend no guardada aún
    //         this.filas.removeAt(index);
    //     }
    // }

}
