import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ServioTransporteService } from '../../../../../services/servico-transporte.service';
import { ActividadTareaMant, CatalogoTarea, PartidaPuInsertDto } from '../../../../../interfaces/servicio-transporte.interface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal-busqueda-parametro',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './modal-busqueda-parametro.component.html',
})
export class ModaBusquedaParametroComponent implements OnInit {
    private fb = inject(FormBuilder);
    servioTransporteService = inject(ServioTransporteService);
    cod_contrato = input<string>();

    isLoading = signal<boolean>(false);
    onCerrarModalParametro = output<boolean>();
    public onContratoSeleccionado = output<void>();

    listActividadTarea = signal<ActividadTareaMant[]>([]);

    listParametro = signal<CatalogoTarea[]>([]);

    // ===========================================================
    // FormGroup principal: filtros de búsqueda (Actividad + Tarea)
    // ===========================================================
    miFormulario: FormGroup = this.fb.group({
        cod_actividad: [''],
        des_tarea: [''],
        filas: this.fb.array([]) // FormArray para los checkboxes de la tabla
    });

    get filas(): FormArray {
        return this.miFormulario.get('filas') as FormArray;
    }

    ngOnInit(): void {
        this.listarActividadTarea();
        this.cargarFilasEnFormArray();
        this.onBuscar();
    }

    public listarActividadTarea(): void {
        this.servioTransporteService.listarActividadTarea().subscribe({
            next: (response) => {
                this.listActividadTarea.set(response);
            },
            error: (error) => {
                console.error('Error al obtener las actividades:', error);
            }
        });
    }

    // ===========================================================
    // Construye el FormArray de checkboxes en base a listParametro
    // ===========================================================
    private cargarFilasEnFormArray(): void {
        this.filas.clear();

        const datos = this.listParametro();

        // 🛡️ Salvaguarda para evitar el error de forEach si viene null o vacío
        if (!datos || datos.length === 0) {
            return;
        }

        datos.forEach(item => {
            this.filas.push(this.fb.group({
                seleccionado: [false],

                // Campos de Control e Identificación
                cod_empresa: [item.cod_empresa],
                cod_empresa_unidad: [item.cod_empresa_unidad],
                cod_catalogo_tarea: [item.cod_catalogo_tarea],
                cod_actividad: [item.cod_actividad],
                cod_catalogo: [item.cod_catalogo],

                // Descripciones y Estados
                des_catalogo_tarea: [item.des_catalogo_tarea],
                des_catalogotarea_abrev: [item.des_catalogotarea_abrev],
                ind_tipo_tarea: [item.ind_tipo_tarea],
                flg_vigente: [item.flg_vigente],

                // Unidades de medida y Tipos
                cod_item_unimed: [item.cod_item_unimed],
                cod_tabla_unimed: [item.cod_tabla_unimed],
                c_fl: [item.c_fl || 'N'],
                c_t_actividad: [item.c_t_actividad],

                // Datos Operacionales de Minado (Valores numéricos)
                cod_metexp: [item.cod_metexp],
                nro_anchopago_1: [item.nro_anchopago_1],
                nro_anchopago_2: [item.nro_anchopago_2],
                cod_seccion_labor: [item.cod_seccion_labor],
                cod_avance_chimenea: [item.cod_avance_chimenea],
                cod_desquinche_perforacion: [item.cod_desquinche_perforacion],

                // Auditoría
                cod_usuario_creo: [item.cod_usuario_creo],
                fec_usuario_creo: [item.fec_usuario_creo]
            }));
        });
    }

    public onBuscar(): void {
        const filtros = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_actividad: this.miFormulario.get('cod_actividad')?.value,
            des_catalogo_tarea: this.miFormulario.get('des_tarea')?.value
        };

        console.log('Buscando con filtros:', filtros);

        this.isLoading.set(true);

        // Aquí llamarías a tu servicio real de búsqueda con los filtros
        this.servioTransporteService.buscarCatalogoTarea(filtros).subscribe({
            next: (response) => {
                this.listParametro.set(response || []);
                this.cargarFilasEnFormArray();
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }



    public onAceptar(): void {
        const seleccionados: PartidaPuInsertDto[] = this.filas.controls
            .filter(control => control.get('seleccionado')?.value === true)
            .map(control => {
                const raw = control.getRawValue();
                return {
                    cod_empresa: '03',
                    cod_empresa_unidad: '01',
                    cod_contrato: this.cod_contrato() ?? '',
                    cod_catalogo_tarea: raw.cod_catalogo_tarea,
                    cod_actividad: raw.cod_actividad,
                    // nro_partida: raw.nro_partida ?? 'A',
                    des_catalogo_tarea: raw.des_catalogo_tarea,
                    imp_valor_calculo: raw.imp_valor_calculo,
                    ind_estado: raw.ind_estado ?? 'A',
                    ind_situacion: raw.ind_situacion ?? '0',
                    ind_zona: raw.ind_zona ?? '0',
                    flg_vigente: raw.flg_vigente ?? '1',
                    cod_usuario_creo: sessionStorage.getItem('username'), // Agregamos el usuario de auditoría
                    cod_tabla_unimed: raw.cod_tabla_unimed,
                    cod_item_unimed: raw.cod_item_unimed,
                    cod_desquinche_perforacion: raw.cod_desquinche_perforacion,
                    imp_costo_directo: raw.imp_costo_directo,
                    imp_gastos_parametros: raw.imp_gastos_parametros,
                    imp_costo_partida: raw.imp_costo_partida,
                    imp_costo_partida_dolar: raw.imp_costo_partida_dolar,
                    ind_tipo_tarea: raw.ind_tipo_tarea,
                    des_observacion: raw.des_observacion,
                    cod_metexp: raw.cod_metexp,
                    nro_anchopago_1: raw.nro_anchopago_1,
                    nro_anchopago_2: raw.nro_anchopago_2,
                    cod_seccion_labor: raw.cod_seccion_labor,
                    cod_avance_chimenea: raw.cod_avance_chimenea,
                    cod_zona: raw.cod_zona,
                };
            });

        this.isLoading.set(true);

        this.servioTransporteService.insertarPartidaPu(seleccionados).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.miFormulario.reset();
                this.onCerrarModalParametro.emit(false);
                this.onContratoSeleccionado.emit();
            },
            error: (err) => {
                this.isLoading.set(false);
            }
        });
    }



    public onRevertir(): void {
        this.miFormulario.reset({
            cod_actividad: '' // 👈 Reemplaza 'codActividad' por el name/formControlName real de tu select
        });

        this.onBuscar();
    }

}
