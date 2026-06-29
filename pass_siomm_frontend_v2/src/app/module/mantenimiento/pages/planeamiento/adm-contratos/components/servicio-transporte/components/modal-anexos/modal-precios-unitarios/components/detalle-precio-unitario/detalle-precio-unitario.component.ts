import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal, viewChild, ViewChild } from '@angular/core';
import { TabPrecioUnitarioComponent } from './components/tab-precio-unitario/tab-precio-unitario.component';
import { FormUtils } from 'src/app/utils/form-utils';
import { CostoPartidaComponent } from './components/costo-partida/costo-partida.component';
import { ParametrosPrincipalesComponent } from './components/parametros-principales/parametros-principales.component';
import { SubParametrosComponent } from './components/sub-parametros/sub-parametros.component';
import { CostoPartidaModel, DetParametrosPartidaPuDto, DetPartidaCostosPuDto, DetSubpartidasPuDto, EntradaPuCabTab, ParametroPrincipalModel, PartidaPuListarDto, PartidaPUModel, ResultadoDatosDto, SubParametroModel, ZonaPu } from '../../../../../interfaces/servicio-transporte.interface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServioTransporteService } from '../../../../../services/servico-transporte.service';

@Component({
    selector: 'app-detalle-precio-unitario',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TabPrecioUnitarioComponent,
        CostoPartidaComponent,
        ParametrosPrincipalesComponent,
        SubParametrosComponent
    ],
    templateUrl: './detalle-precio-unitario.component.html',
})
export class DetallePrecioUnitarioComponent implements OnInit {
    onCerrarModalPreUnitarioDetalle = output<boolean>();
    public detallePartida = input<PartidaPuListarDto | null>(null);
    public servioTransporteService = inject(ServioTransporteService);
    private fb = inject(FormBuilder);
    public formUtils = FormUtils;
    tabActivo = signal('parametros-principales');
    public listZonasPu = signal<ZonaPu[]>([])
    public tipoCambioDolares = signal<number>(0);
    cargarEquiposPorFila = output<void>();

    ngOnInit(): void {
        this.cargarPrecioUnitarioCabTab();
        this.obtenerZona();

        this.servioTransporteService.getUSDtoPEN().subscribe(rate => {
            this.tipoCambioDolares.set(rate);
        })

    }


    miFormulario: FormGroup = this.fb.group({
        nro_partida: [''],
        c_t_actividad: [{ value: '', disabled: true }],
        actividad_tarea_codigo: [{ value: '', disabled: true }],
        cod_actividad: [],
        //DDESCRIPCION
        des_catalogo_tarea: [''],
        imp_costo_directo: [{ value: '', disabled: true }],
        des_observacion: [''],
        ind_situacion: [false],
        ind_zona: [false],
        ind_estado: [''],
        cod_catalogo_tarea: [''],
        c_t_unidad_medida: [{ value: '', disabled: true }],
        imp_costo_partida: [{ value: '0.000', disabled: true }],
        imp_costo_partida_dolar: [{ value: '0.000', disabled: true }],
        cod_zona: [''],
        esNuevo: [true],
        costoPartida: this.fb.array([]),
        parametroPrincipal: this.fb.array([]),
        subParametros: this.fb.array([]),
    })

    get costoPartidaArray(): FormArray<FormGroup> {
        return this.miFormulario.get('costoPartida') as FormArray<FormGroup>;
    }

    get parametroPrincipalArray(): FormArray<FormGroup> {
        return this.miFormulario.get('parametroPrincipal') as FormArray<FormGroup>;
    }

    get subParametrosArray(): FormArray<FormGroup> {
        return this.miFormulario.get('subParametros') as FormArray<FormGroup>;
    }

    public onSubTotalChange(total: number): void {
        this.miFormulario.patchValue({
            imp_costo_partida: total.toFixed(3)
        });
    }

    // Cuando cambies el total en el hijo:

    public cargarPrecioUnitarioCabTab(): void {
        const payload: EntradaPuCabTab = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_contrato: this.detallePartida()?.cod_contrato ?? '',
            cod_actividad: this.detallePartida()?.cod_actividad ?? '',
            cod_catologo_tarea: this.detallePartida()?.cod_catalogo_tarea ?? '',
            nro_partida: this.detallePartida()?.nro_partida ?? ''
        };

        this.servioTransporteService.obtenerPrecioUnitarioCabTab(payload).subscribe({
            next: (data) => {
                console.log(data)
                if (!data) return;

                if (data.cabecera) {
                    // 1. Preparar las variables calculadas de forma segura
                    const codActividad = data.cabecera.cod_actividad?.trim() || '';
                    const codTarea = data.cabecera.cod_catalogo_tarea || '';

                    this.miFormulario.patchValue({
                        ...data.cabecera,
                        actividad_tarea_codigo: codActividad + codTarea,
                        ind_situacion: data.cabecera.ind_situacion === '1',
                        ind_zona: data.cabecera.ind_zona === '1',
                        imp_costo_partida: data.cabecera.imp_costo_partida
                            ? Number(data.cabecera.imp_costo_partida).toFixed(3)
                            : '0.000',
                        imp_costo_partida_dolar: data.cabecera.imp_costo_partida_dolar
                            ? Number(data.cabecera.imp_costo_partida_dolar).toFixed(3)
                            : '0.000',

                        imp_costo_directo: data.cabecera.imp_costo_directo
                            ? Number(data.cabecera.imp_costo_directo).toFixed(3)
                            : '0.000'
                    });
                }
                // 2. Cargamos las tablas iterativas usando métodos dedicados
                this.llenarCostoPartida(data.costoPartida);
                this.llenarParametrosPrincipales(data.parametrosPrincipales);
                this.llenarSubParametros(data.subParametros);

                // "Considera que este formulario no ha sido modificado."
                this.miFormulario.markAsPristine();
                // "Considera que el usuario nunca tocó ningún control."
                this.miFormulario.markAsUntouched();
            },
            error: (err) => console.error(err),
        });
    }


    public obtenerZona(): void {
        this.servioTransporteService.obtenerZonaPu().subscribe({
            next: (data) => {
                this.listZonasPu.set(data);
            },
            error: (err) => console.error(err),
        });
    }

    // ─── MÉTODOS PRIVADOS DE LLENADO DE ARRAYS ───────────────────────────────

    private llenarCostoPartida(costos: DetPartidaCostosPuDto[], accion = 'U', esNueva = true): void {
        const array = this.miFormulario.get('costoPartida') as FormArray;
        array.clear();

        if (!costos) return;
        costos.forEach(item => {
            array.push(this.fb.group({
                cod_parametro_contrato: [item.cod_parametro_contrato],
                c_t_parametro: [item.c_t_parametro],
                c_n_porcentaje: [item.c_n_porcentaje],
                nro_trabajador: [item.nro_trabajador],
                nro_horas_labor: [item.nro_horas_labor],
                cod_contrato: [item.cod_contrato],
                cod_catalogo_tarea: [item.cod_catalogo_tarea],
                cod_actividad: [item.cod_actividad],
                nro_partida: [item.nro_partida],
                imp_tipo_cambio: [item.imp_tipo_cambio],
                c_n_valor: [item.c_n_valor],
                c_n_monto: [item.c_n_monto],

                imp_costo_directo: [
                    item && item.imp_costo_directo != null
                        ? (Number(item.imp_costo_directo) || 0).toFixed(3)
                        : '0.000'],
                imp_precio_soles: [
                    item && item.imp_precio_soles != null
                        ? (Number(item.imp_precio_soles) || 0).toFixed(3)
                        : '0.000',
                    [Validators.required,
                    Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)],
                ],
                accion: [accion],
                esNueva: [esNueva]
            }));
        });
    }

    private llenarParametrosPrincipales(parametros: DetParametrosPartidaPuDto[]): void {
        const array = this.miFormulario.get('parametroPrincipal') as FormArray;
        array.clear();
        // nro_valor_1
        if (!parametros) return;
        parametros.forEach(item => {
            array.push(this.fb.group({
                cod_parametro_tarea: [item.cod_parametro_tarea],
                c_t_parametro: [item.c_t_parametro],
                des_valor_1: [item.des_valor_1],
                nro_valor_1: [item.nro_valor_1 !== null && item.nro_valor_1 !== undefined
                    ? Number(item.nro_valor_1).toFixed(3)
                    : '0.000'],
                des_valor_2: [item.des_valor_2],
                c_t_equipo: [item.c_t_equipo],
                nro_valor_calculo: [item.nro_valor_calculo !== null && item.nro_valor_calculo !== undefined
                    ? Number(item.nro_valor_calculo).toFixed(3)
                    : '0.000'],
                cod_item_um_calculo: [item.cod_item_um_calculo],
                des_valor_3: [item.des_valor_3],
                cod_item_unimed: [item.cod_item_unimed]
            }));
        });
    }

    private llenarSubParametros(subParametros: DetSubpartidasPuDto[]): void {
        const array = this.miFormulario.get('subParametros') as FormArray;
        array.clear();

        if (!subParametros) return;
        subParametros.forEach(item => {
            array.push(this.fb.group({
                cod_subpartida: [item.cod_subpartida],
                c_t_subpartida: [item.c_t_subpartida],
                cod_item_unimed: [item.cod_item_unimed],
                imp_precio_soles: [item.imp_precio_soles !== null && item.imp_precio_soles !== undefined
                    ? Number(item.imp_precio_soles).toFixed(3)
                    : '0.000'],
                cod_concepto: [item.cod_concepto],
                // nro_cantidad: [item.nro_cantidad],

                nro_cantidad: [item.nro_cantidad !== null && item.nro_cantidad !== undefined
                    ? Number(item.nro_cantidad).toFixed(3)
                    : '0.000'],

                imp_subtotal: [item.imp_subtotal !== null && item.imp_subtotal !== undefined
                    ? Number(item.imp_subtotal).toFixed(3)
                    : '0.000'],
                des_observacion: [item.des_observacion]
            }));
        });
    }

    public async onCambiarTab(nuevaTab: string): Promise<void> {
        if (nuevaTab === this.tabActivo()) {
            return;
        }
        this.tabActivo.set(nuevaTab);
    }


    public async onCerrarModal(): Promise<void> {
        if (this.miFormulario.dirty) {
            console.log("LA ACCION DEL FORMULARIO ES " + this.miFormulario.dirty)
            const confirmar = await this.formUtils.confirmarSalirSinGuardar();
            if (!confirmar) {
                return;
            }
        }
        this.onCerrarModalPreUnitarioDetalle.emit(false);
    }

    public onGuardar() {
        const data = this.miFormulario.getRawValue();

        const payload: PartidaPUModel = {
            cod_empresa: '03',           // del login/sesión
            cod_empresa_unidad: '01', // del login/sesión
            cod_contrato: this.detallePartida()?.cod_contrato.toString(),
            cod_catalogo_tarea: data.cod_catalogo_tarea,
            cod_actividad: data.cod_actividad,
            nro_partida: data.nro_partida.toString(),
            cod_tabla_unimed: data.cod_tabla_unimed,
            cod_item_unimed: data.cod_item_unimed,
            cod_desquinche_perforacion: data.cod_desquinche_perforacion,
            imp_gastos_parametros: data.imp_gastos_parametros,
            // del formulario padre
            cod_usuario: sessionStorage.getItem('username') ?? '',           // del login/sesión
            c_t_actividad: data.c_t_actividad,
            // actividad_tarea_codigo: data.actividad_tarea_codigo,
            des_catalogo_tarea: data.des_catalogo_tarea,
            imp_costo_directo: Number(data.imp_costo_directo),
            des_observacion: data.des_observacion,
            ind_situacion: data.ind_situacion ? '1' : '0',
            ind_zona: data.ind_zona ? '1' : '0',
            ind_estado: data.ind_estado,
            c_t_unidad_medida: data.c_t_unidad_medida,
            imp_costo_partida: Number(data.imp_costo_partida),
            imp_costo_partida_dolar: Number(data.imp_costo_partida_dolar),
            imp_valor_calculo: data.imp_valor_calculo,
            cod_zona: data.cod_zona,

            costoPartida: data.costoPartida.map((item: CostoPartidaModel) => ({
                ...item,
                accion: item.accion,
                cod_empresa: '03',           // del login/sesión
                cod_empresa_unidad: '01', // del login/sesión
                cod_contrato: this.detallePartida()?.cod_contrato.toString(),
                cod_catalogo_tarea: data.cod_catalogo_tarea,
                cod_actividad: data.cod_actividad,
                nro_partida: this.detallePartida()?.nro_partida.toString(),
                imp_precio_dolar: Number(item.imp_precio_dolar),
                imp_precio_soles: Number(item.imp_precio_soles),
                imp_costo_directo: Number(item.imp_costo_directo),
                imp_tipo_cambio: this.tipoCambioDolares(),

            })),
            parametroPrincipal: data.parametroPrincipal.map((item: ParametroPrincipalModel) => ({
                ...item,
                cod_empresa_unidad: '01', // del login/sesión
                cod_contrato: this.detallePartida()?.cod_contrato.toString(),
                cod_catalogo_tarea: data.cod_catalogo_tarea,
                cod_actividad: data.cod_actividad,
                nro_partida: this.detallePartida()?.nro_partida.toString(),
                nro_valor_1: Number(item.nro_valor_1),
                nro_valor_calculo: Number(item.nro_valor_calculo),
                accion: item.accion,

            })),
            subParametros: data.subParametros.map((item: SubParametroModel) => ({
                ...item,
                accion: item.accion,
                cod_empresa_unidad: '01', // del login/sesión
                cod_contrato: this.detallePartida()?.cod_contrato.toString(),
                cod_catalogo_tarea: data.cod_catalogo_tarea,
                cod_actividad: data.cod_actividad,
                nro_partida: this.detallePartida()?.nro_partida.toString(),
                imp_precio_soles: Number(item.imp_precio_soles),
                nro_cantidad: Number(item.nro_cantidad),
                imp_subtotal: Number(item.imp_subtotal),

            }))
        };
        // costoPartida: CostoPartidaModel[];
        // parametroPrincipal: ParametroPrincipalModel[];
        // subParametros: SubParametroModel[];
        console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

        this.formUtils.confirmarAnulacionClase(
            'Guardar Registros',
            '¿Está seguro de guardar el Precio Unitario Detalle?',
            'Sí, guardar',
            'No, cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;
            this.servioTransporteService.guardarPartida(payload).subscribe({
                next: (res: ResultadoDatosDto) => {
                    if (res.estado === 1) {
                        this.formUtils.alertaExitoAnulacion('Guardando Datos', res.mensaje);
                        this.cargarEquiposPorFila.emit();
                        this.cargarPrecioUnitarioCabTab();
                    } else {
                        this.formUtils.alertaNoPermitidoClase('Error al Guardar', res.mensaje);
                    }
                },
                error: (err) => {
                    console.error('Error al guardar:', err);
                }
            });
        })

    }

    onSubtotalChange(subtotal: number): void {
        this.miFormulario.patchValue({
            imp_costo_directo: subtotal.toFixed(3), // 👈 "1234.000"
        });
    }

    onTotalPuSol(subtotal: number): void {
        this.miFormulario.patchValue({
            imp_costo_partida_dolar: subtotal.toFixed(3), // 👈 "1234.000"
        });

    }
    onTotalGeneral(total: number): void {

        this.miFormulario.patchValue({
            imp_costo_partida: total.toFixed(3), // 👈 "1234.000"
        });

    }

}
