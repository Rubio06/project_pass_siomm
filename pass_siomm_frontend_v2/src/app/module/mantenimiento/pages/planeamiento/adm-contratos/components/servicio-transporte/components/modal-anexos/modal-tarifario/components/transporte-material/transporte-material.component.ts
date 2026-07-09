import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServioTransporteService } from '../../../../../services/servico-transporte.service';
import { CentroCosto, CuentaContable, EliminarTarifarioTransporte, PaginacionTarifarioDetalle, RutaTransporte, TarifarioTransporteDetalle } from '../../../../../interfaces/servicio-transporte.interface';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { SweetAlertResult } from 'sweetalert2';
import { FormUtils } from 'src/app/utils/form-utils';
// NgSelectComponent
@Component({
    selector: 'app-transporte-material',
    imports: [ReactiveFormsModule, NgSelectModule],
    templateUrl: './transporte-material.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransporteMaterialComponent implements OnInit {

    private readonly servioTransporteService = inject(ServioTransporteService);
    private readonly fb = inject(FormBuilder);
    private readonly cdr = inject(ChangeDetectorRef);
    public formUtils = FormUtils;
    public codigoSiguienmte = signal<number>(0);
    public ind_estado = input<string>('');

    isLoading = signal(false);
    cod_contrato = input<string>('');

    paginaActual = signal(1);
    totalRegistros = signal(0);
    totalPaginas = signal(0);

    public listRutas = signal<RutaTransporte[]>([]);
    public listCentrosCosto = signal<CentroCosto[]>([]);
    public listCuentas = signal<CuentaContable[]>([]);

    onPaginaCambio(pagina: number): void {
        const filasNuevas = this.filas.controls
            .filter(f => f.get('esNuevo')?.value === true)
            .map(f => f.value);

        this.paginaActual.set(pagina);

        this.cargarFilas(() => {
            filasNuevas.forEach(item => this.filas.push(this.crearFila(item, true)));
        });
    }


    public form: FormGroup = this.fb.group({ filas: this.fb.array([]) });

    get filas(): FormArray {
        return this.form.get('filas') as FormArray;
    }

    ngOnInit(): void {
        this.cargarMaestros();
    }

    public cargarFilas(callback?: () => void): void {
        this.isLoading.set(true);
        const payload = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            ind_material: 'D',
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
        if (this.filas.length === 0) {
            this.servioTransporteService.obtenerSiguienteItem('03', '01', this.cod_contrato()).subscribe({
                next: (res) => this.codigoSiguienmte.set(res.siguienteCodItem),
                error: (err) => console.error(err)
            });
        } else {
            const ultimaFila = this.filas.at(this.filas.length - 1) as FormGroup;
            this.codigoSiguienmte.set(parseInt(ultimaFila.get('cod_item_ruta')?.value || '0', 10) + 1);
        }
    }

    private crearFila(item: TarifarioTransporteDetalle, esNuevo: boolean = false): FormGroup {
        const group = this.fb.group({
            cod_empresa: [item.cod_empresa],
            cod_empresa_unidad: [item.cod_empresa_unidad],
            cod_contrato: [item.cod_contrato],

            cod_item_ruta: [item.cod_item_ruta],
            cod_ruta_origen: [item.cod_ruta_origen],
            cod_ruta_destino: [item.cod_ruta_destino],
            cod_ruta_intermedia: [item.cod_ruta_intermedia],
            c_t_zona: [item.c_t_zona],
            nro_distancia_km: [(item.nro_distancia_km ?? 0).toFixed(3), [Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            imp_tmh_km_soles: [(item.imp_tmh_km_soles ?? 0).toFixed(3), [Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            imp_ruta_pu: [(item.imp_ruta_pu ?? 0).toFixed(3), [Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            cod_zona: [item.cod_zona],
            cto_cod: [item.cto_cod],
            cta_cod: [item.cta_cod],
            flg_vigencia: [item.flg_vigencia],
            ind_material: [item.ind_material],
            ind_mov_sap: [item.ind_material],
            esNuevo: [esNuevo]
        }, { validators: this.formUtils.rutasDistintasValidator });
        
        if (this.ind_estado() !== 'G') {
            group.disable();
        }
        return group;
    }

    public onRutaOrigenChange(index: number, codRuta: string): void {
        const ruta = this.listRutas().find(r => r.cod_ruta === codRuta);
        const fila = this.filas.at(index) as FormGroup;
        fila.get('c_t_zona')?.setValue(ruta?.c_t_zona ?? '');
    }


    public onAgregarFila(): void {
        // Buscar si ya hay filas nuevas en el FormArray
        const filasNuevas = this.filas.controls.filter(f => f.get('esNuevo')?.value === true);

        if (filasNuevas.length) {
            // Ya hay filas nuevas — tomar el mayor cod_item_ruta y sumar 1
            const maxCodigo = Math.max(...filasNuevas.map(f => parseInt(f.get('cod_item_ruta')?.value || '0', 10)));
            this.agregarFilaConCodigo(maxCodigo + 1);
        } else {
            // No hay filas nuevas — consultar al backend
            this.servioTransporteService.obtenerSiguienteItem('03', '01', this.cod_contrato()).subscribe({
                next: (res) => this.agregarFilaConCodigo(res.siguienteCodItem),
                error: (err) => console.error(err)
            });
        }
    }

    private agregarFilaConCodigo(codigo: number): void {
        const nuevoItem = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.cod_contrato(),
            cod_item_ruta: codigo.toString(),
            cod_ruta_origen: '',
            cod_ruta_intermedia: '',
            cod_ruta_destino: '',
            c_t_zona: '',
            nro_distancia_km: 0,
            imp_tmh_km_soles: 0,
            imp_ruta_pu: 0,
            cod_zona: '',
            cto_cod: '',
            cta_cod: '',
            flg_vigencia: '1',
            ind_mov_sap: '',
            ind_material: 'D'

        } as TarifarioTransporteDetalle;

        this.filas.push(this.crearFila(nuevoItem, true));
        this.totalRegistros.set(this.totalRegistros() + 1);
        this.paginaActual.set(this.totalPaginas());
        this.form.markAsDirty();

        setTimeout(() => {
            const contenedorTabla = document.getElementById('scrollContenedor');
            if (contenedorTabla) contenedorTabla.scrollTo({ top: contenedorTabla.scrollHeight, behavior: 'smooth' });
        }, 50);

        this.cdr.markForCheck();
    }

    public cargarMaestros(): void {
        this.servioTransporteService.obtenerRutas().subscribe(r => this.listRutas.set(r));
        this.servioTransporteService.obtenerCentrosCosto().subscribe(c => this.listCentrosCosto.set(c));
        this.servioTransporteService.obtenerCuentasContables().subscribe({
            next: c => {
                this.listCuentas.set(c)
                this.cargarFilas();
            }
        });
    }

    public onEliminar(index: number, filaGroup: AbstractControl): void {
        const group = filaGroup as FormGroup;

        const esFilaNueva = group.get('esNuevo')?.value;

        if (esFilaNueva === true) {
            this.filas.removeAt(index);
            this.form.markAsDirty();
            return;
        }

        // Escenario B: Ya existe en la base de datos de la mina, requiere confirmación
        this.formUtils.confirmarEliminacionPlanos(
            'Eliminacion de una Fila',
            `¿Desea eliminar el transporte material con el codigo de ruta ${group.get('cod_item_ruta')?.value}?`
        ).then(result => {

            if (!result.isConfirmed) return;
            const payload: EliminarTarifarioTransporte = {
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: this.cod_contrato(),
                cod_item_ruta: group.get('cod_item_ruta')?.value,
                ind_material: 'D'
            };

            this.servioTransporteService.eliminarTarifarioTransporte(payload)
                .subscribe({
                    next: (resp) => {
                        if (resp.estado === 1) {
                            // this.filas.removeAt(index); // Se quita de la vista tras el éxito en SQL Server
                            this.formUtils.alertaEliminadoClase(resp.mensaje);
                            this.cargarFilas();

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

}
