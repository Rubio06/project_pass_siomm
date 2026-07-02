import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { EsptecBaseMedicionComponent } from './components/tabs/esptec-base-medicion/esptec-base-medicion.component';
import { CommonModule } from '@angular/common';
import { ModalGastosGeneralesComponent } from './components/modal-anexos/modal-gastos-generales/modal-gastos-generales.component';
import { ModalTarifarioComponent } from './components/modal-anexos/modal-tarifario/modal-tarifario.component';
import { ModalPreciosUnitariosComponent } from './components/modal-anexos/modal-precios-unitarios/modal-precios-unitarios.component';
import { ContratoDetalleResponse, ContratoEquipoPesado, ContratoMedicion, ContratoParametro, ServicoTransporte } from '../../interfaces/adm-contrato.interface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServioTransporteService } from './services/servico-transporte.service';
import { MaeContrataAdmDto, RespuestaServidor } from './interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { EquiposAlquiladosComponent } from './components/tabs/equipos-allquilados/equipos-alquilados.component';
import { ParametrosGeneralesComponent } from './components/tabs/parametros-generales/parametros-generales.component';
import { AdmContratosServvice } from '../../services/adm-contratos.service';

@Component({
    selector: 'app-servicio-transporte',
    imports: [
        EsptecBaseMedicionComponent,
        ParametrosGeneralesComponent,
        EquiposAlquiladosComponent,
        CommonModule,
        ModalGastosGeneralesComponent,
        ModalTarifarioComponent,
        ModalPreciosUnitariosComponent,
        ReactiveFormsModule
    ],
    templateUrl: './servicio-transporte.component.html',
    styleUrl: './servicio-transporte.component.css'

})
export class ServicioTransporteComponent implements OnInit {

    // ─── Injects ───────────────────────────────────────────────
    private fb = inject(FormBuilder);
    private servicioTransporte = inject(ServioTransporteService);
    private admContratosServvice = inject(AdmContratosServvice);
    // ─── Inputs / Outputs ──────────────────────────────────────
    cerrarModal = output<void>();
    modo = input<'nuevo' | 'visualizar' | null>(null);

    obServicioTransporte = input<ContratoDetalleResponse | null>(null);

    // Output para avisarle al abuelo (Componente General)
    // onRefreshContrato = output<void>();
    onAbrirContrato = output<ContratoDetalleResponse>();


    // ─── Signals ───────────────────────────────────────────────
    tabActivo = signal('parametros');
    abrirSubModalGastos = signal<boolean>(false);
    abrirSubModalTarifario = signal<boolean>(false);
    abrirSubModalPrecUnitario = signal<boolean>(false);
    listContrataAdm = signal<MaeContrataAdmDto[]>([]);
    tipoContrato = signal<string>('');
    formsUtils = FormUtils;
    contratoSiguiente = input<string>('');
    private cambiosPendientes = signal<boolean>(false);

    listarAdmContrato = output<void>();

    // ─── Formulario ────────────────────────────────────────────
    miFormulario: FormGroup = this.fb.group({
        cod_empresa: [''],
        cod_empresa_unidad: [''],
        cod_contrato: ['', [Validators.required, Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
        cod_contrata: ['', [Validators.required]],
        fec_registro: ['', [Validators.required]],
        fec_inicio: ['', [Validators.required]],
        fec_termino: ['', [Validators.required]],
        des_contacto_contrata: ['', [Validators.maxLength(200)]],
        imp_tipo_cambio: ['', [Validators.min(0), Validators.required]],
        nro_adendum: ['', [Validators.maxLength(50)]],
        des_observacion: ['', [Validators.maxLength(500), Validators.required]],
        ind_situacion: [''],
        ind_estado: ['', [Validators.required]],
        flg_vigente: ['1'],
        fec_firma: ['', [Validators.required]],
        ind_tipo_contrato: ['', [Validators.required]],
        cod_usuario_creo: [''],
        fec_usuario_creo: ['', [Validators.required]],
        cod_usuario_modi: [''],
        fec_usuario_modi: [''],
        ind_moneda: ['', [Validators.required]],
        ind_tipocambio: ['', [Validators.required]],
        ind_valorizacion: ['', [Validators.required]],
        c_t_ruc: ['', [Validators.required]],
        c_t_representante: ['', [Validators.required]],
        accion: ['U'],
        parametros: this.fb.array([]),
        mediciones: this.fb.array([]),
        equipos: this.fb.array([]),
    });

    // ─── Getters ───────────────────────────────────────────────
    get parametrosArray(): FormArray<FormGroup> {
        return this.miFormulario.get('parametros') as FormArray<FormGroup>;
    }

    get medicionesArray(): FormArray<FormGroup> {
        return this.miFormulario.get('mediciones') as FormArray<FormGroup>;
    }

    get equiposArray(): FormArray<FormGroup> {
        return this.miFormulario.get('equipos') as FormArray<FormGroup>;
    }
    // ─── Constructor ───────────────────────────────────────────
    constructor() {
        // Carga cabecera + arrays cuando llega o cambia la data
        effect(() => {
            const data = this.obServicioTransporte();
            if (!data) return;
            this.cargarCabecera(data);
            this.cargarArrays(data);


        });

        // Aplica modo nuevo/visualizar
        effect(() => {
            this.asignarModo(this.modo());
        });

    }
    // 1. Declara el signal

    // ─── Lifecycle ─────────────────────────────────────────────
    ngOnInit(): void {
        this.obtenerListaContrata();
        this.onEscucharCambioContrata();
        this.onEscucharCambiosRadio();
        this.suscribirCambiosPendientes();
    }


    // ─── Carga de datos ────────────────────────────────────────
    private cargarCabecera(data: ContratoDetalleResponse): void {
        this.miFormulario.patchValue({
            ...data,
            imp_tipo_cambio: data.imp_tipo_cambio?.toFixed(3) ?? '0.000',
            fec_registro: this.formsUtils.formatFecha(data.fec_registro),
            fec_inicio: this.formsUtils.formatFecha(data.fec_inicio),
            fec_termino: this.formsUtils.formatFecha(data.fec_termino),
            fec_firma: this.formsUtils.formatFecha(data.fec_firma),
            fec_usuario_creo: this.formsUtils.formatFecha(data.fec_usuario_creo),
            fec_usuario_modi: this.formsUtils.formatFecha(data.fec_usuario_modi),
        });
    }

    private cargarArrays(data: ContratoDetalleResponse): void {
        this.parametrosArray.clear();
        data.parametros.forEach(p =>
            this.parametrosArray.push(this.crearParametroGroup(p))
        );

        this.medicionesArray.clear();
        data.mediciones.forEach(m =>
            this.medicionesArray.push(this.crearMedicionGroup(m))
        );

        this.equiposArray.clear();
        data.equipos.forEach(e =>
            this.equiposArray.push(this.crearEquipoPesadoGroup(e))
        );
    }

    private crearParametroGroup(p?: ContratoParametro): FormGroup {
        const group = this.fb.group({
            cod_parametro_contrato: [{ value: p?.cod_parametro_contrato ?? '', disabled: true }],
            cod_moneda: [p?.cod_moneda ?? ''],
            imp_porcentaje: [p?.imp_porcentaje ?? null,
            [Validators.required, Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]
            ],
            imp_monto: [p?.imp_monto ?? null,
            [Validators.required, Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]
            ],
            des_observacion: [p?.des_observacion ?? ''],
            flg_vigente: [p?.flg_vigente ?? ''],
            c_t_anexo: [p?.c_t_anexo ?? ''],
            cod_valor: [p?.cod_valor ?? ''],
            cod_tabla_anexo: [p?.cod_tabla_anexo ?? ''],
            cod_item_anexo: [p?.cod_item_anexo ?? ''],
            cod_usuario_modi: [p?.cod_usuario_modi ?? ''],
            cod_usuario_creo: [p?.cod_usuario_creo ?? ''],
            accion: ['U']
        });

        return group;
    }

    private crearMedicionGroup(m?: ContratoMedicion): FormGroup {
        return this.fb.group({
            cod_parametro_medicion: [{ value: m?.cod_parametro_medicion ?? '', disabled: true }],
            cod_tabla_um_pv: [m?.cod_tabla_um_pv ?? ''],
            cod_item_um_pv: [m?.cod_item_um_pv ?? ''],
            cod_tabla_um_ap: [m?.cod_tabla_um_ap ?? ''],
            cod_item_um_ap: [m?.cod_item_um_ap ?? ''],
            nro_potencia_veta_1: [
                m?.nro_potencia_veta_1 !== undefined && m?.nro_potencia_veta_1 !== null
                    ? Number(m.nro_potencia_veta_1).toFixed(2)
                    : '0.00', [Validators.required,
                    Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]
            ],

            // nro_potencia_veta_2: [m?.nro_potencia_veta_2 ?? 0.00],

            nro_potencia_veta_2: [
                m?.nro_potencia_veta_2 !== undefined && m?.nro_potencia_veta_2 !== null
                    ? Number(m.nro_potencia_veta_2).toFixed(2)
                    : '0.00',
                [Validators.required,
                Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]
            ],
            nro_ancho_pago_1: [
                m?.nro_ancho_pago_1 !== undefined && m?.nro_ancho_pago_1 !== null
                    ? Number(m.nro_ancho_pago_1).toFixed(2)
                    : '0.00', [Validators.required,
                    Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]
            ],


            // nro_ancho_pago_1: [m?.nro_ancho_pago_1 ?? 0.00],
            cod_valor_ap: [m?.cod_valor_ap ?? ''],
            cod_valor_pv: [m?.cod_valor_pv ?? ''],
            c_t_pv: [m?.c_t_pv ?? ''],
            c_t_ap: [m?.c_t_ap ?? ''],

            accion: ['U']

        });
    }


    private crearEquipoPesadoGroup(e?: ContratoEquipoPesado): FormGroup {
        return this.fb.group({
            cod_empresa: [e?.cod_empresa ?? ''],
            cod_empresa_unidad: [e?.cod_empresa_unidad ?? ''],
            cod_contrato: [e?.cod_contrato ?? ''],
            cod_equipo_pesado: [{ value: e?.cod_equipo_pesado ?? '', disabled: true }],
            cod_equipo_pesado_1: [{ value: e?.cod_equipo_pesado ?? '', disabled: true }],
            ind_moneda: [e?.ind_moneda ?? ''],
            ind_tarifa: [e?.ind_tarifa ?? ''],
            // des_descripcion: ['', [Validators.required]],

            imp_alquiler_equipo: [e?.imp_alquiler_equipo ?? null, [Validators.required,
            Validators.pattern(/^\d{1,10}(\.\d{1,3})?$/)]],
            flg_vigencia: [e?.flg_vigencia ?? ''],
            cod_usuario_creo: [e?.cod_usuario_creo ?? ''],
            fec_usuario_creo: [e?.fec_usuario_creo ?? null],
            cod_usuario_modi: [{ value: e?.cod_usuario_modi ?? '', disabled: true }],
            fec_usuario_modi: [e?.fec_usuario_modi ?? null],
            accion: ['U']

        });
    }

    // ─── Modo nuevo / visualizar ───────────────────────────────
    private asignarModo(modo: string | null): void {

        if (modo === 'visualizar') {
            this.miFormulario.disable();

            this.toggleFormArrays(['parametros', 'mediciones', 'equipos'], true);

            // 🔒 Re-bloquear el código incremental después de habilitar el array
            this.bloquearCodParametroContrato();
            this.bloquearCodParametroMedicion();
            this.bloquearCodEquipoPesado1();

            if (this.obServicioTransporte()?.ind_estado === 'G') {
                const camposHabilitados = [
                    'cod_contrata', 'des_observacion', 'fec_inicio',
                    'fec_registro', 'imp_tipo_cambio', 'ind_tipocambio',
                    'ind_moneda', 'fec_termino', 'fec_firma',
                    'ind_valorizacion', 'ind_tipo_contrato'
                ];
                camposHabilitados.forEach(campo =>
                    this.miFormulario.get(campo)?.enable()
                );

                // ✅ Habilitados en visualizar
                this.toggleFormArrays(['parametros', 'mediciones', 'equipos'], true);

                // 🔒 Re-bloquear otra vez, porque toggleFormArrays se volvió a llamar
                this.bloquearCodParametroContrato();
                this.bloquearCodParametroMedicion();
                this.bloquearCodEquipoPesado1();

            }
        } else if (modo === 'nuevo') {
            // 1. PRIMERO: Seteamos todos los valores iniciales en el formulario
            this.miFormulario.patchValue({
                cod_empresa: '03',
                cod_empresa_unidad: '01',
                cod_contrato: this.contratoSiguiente(),
                ind_tipo_contrato: 'M',
                fec_inicio: this.formsUtils.formatFecha(new Date()),
                fec_firma: this.formsUtils.formatFecha(new Date()),
                ind_moneda: 'S',
                fec_usuario_creo: this.formsUtils.formatFecha(new Date()),
                ind_valorizacion: '1',
                ind_estado: 'G',
                ind_tipocambio: 'M',
                cod_usuario_creo: sessionStorage.getItem('username') ?? null,
                fec_registro: this.formsUtils.formatFecha(new Date()),
                accion: 'I'
            });

            // 2. SEGUNDO: Bloqueamos los campos que no deben ser editados por el usuario
            // Usamos emitEvent: false para que sea una transición limpia en la UI
            this.miFormulario.get('cod_contrato')?.disable({ emitEvent: false });
            this.miFormulario.get('c_t_ruc')?.disable({ emitEvent: false });
            this.miFormulario.get('ind_estado')?.disable({ emitEvent: false });
            this.miFormulario.get('fec_usuario_creo')?.disable({ emitEvent: false });
            this.miFormulario.get('cod_usuario_creo')?.disable({ emitEvent: false });

        }
    }




    // Método auxiliar: bloquea el código incremental en todas las filas de parametros
    private bloquearCodParametroContrato(): void {
        this.parametrosArray.controls.forEach(fila =>
            fila.get('cod_parametro_contrato')?.disable()
        );
    }

    private bloquearCodParametroMedicion(): void {
        this.medicionesArray.controls.forEach(fila =>
            fila.get('cod_parametro_medicion')?.disable()
        );
    }

    private bloquearCodEquipoPesado1(): void {
        this.equiposArray.controls.forEach(fila => {
            fila.get('cod_equipo_pesado_1')?.disable();
            fila.get('cod_equipo_pesado')?.disable();
        });
    }

    // ✅ Método auxiliar para habilitar/deshabilitar FormArrays y sus controles internos
    private toggleFormArrays(arrayNames: string[], habilitar: boolean): void {
        arrayNames.forEach(nombre => {
            const formArray = this.miFormulario.get(nombre) as FormArray;
            if (!formArray) return;

            formArray.controls.forEach(control => {
                habilitar ? control.enable() : control.disable();
            });

            habilitar ? formArray.enable() : formArray.disable();
        });
    }

    // ─── APIs ──────────────────────────────────────────────────

    // public reenviarAvisoAlAbuelo(): void {
    //     this.onRefreshContrato.emit();
    // }


    // ─── APIs ──────────────────────────────────────────────────
    private obtenerListaContrata(): void {
        this.servicioTransporte.obtenerServicioTransporte().subscribe({
            next: (resp: MaeContrataAdmDto[]) => {
                this.listContrataAdm.set(resp)
            },
            error: (err) => console.error('Error al obtener contratas:', err)
        });
    }


    // ─── EVENTOS ──────────────────────────────────────────────────
    private onEscucharCambioContrata(): void {
        this.miFormulario.get('cod_contrata')?.valueChanges.subscribe(cod => {
            if (!cod) return;

            const contrata = this.listContrataAdm().find(i => i.cod_contrata === cod);
            if (contrata) {
                this.miFormulario.patchValue({ c_t_ruc: contrata.ruc_contrata });
            }
        });
    }

    private suscribirCambiosPendientes(): void {
        this.miFormulario.valueChanges.subscribe(() => this.registrarCambio());
        this.parametrosArray.valueChanges.subscribe(() => this.registrarCambio());
        this.medicionesArray.valueChanges.subscribe(() => this.registrarCambio());
        this.equiposArray.valueChanges.subscribe(() => this.registrarCambio());
    }

    private registrarCambio(): void {
        if (!this.cambiosPendientes()) {
            this.cambiosPendientes.set(true);
        }
    }

    private resetCambiosPendientes(): void {
        this.cambiosPendientes.set(false);
    }

    private onEscucharCambiosRadio(): void {
        // 🎧 Escuchamos el evento de cambio del Radio Button de forma reactiva
        this.miFormulario.get('ind_tipo_contrato')?.valueChanges.subscribe((tipoSeleccionado: string) => {

            if (tipoSeleccionado === 'M' || tipoSeleccionado === 'T') {
                this.tabActivo.set('parametros');
            }
            else if (tipoSeleccionado === 'A') {
                this.tabActivo.set('equipos');
            }

        });
    }


    public abrirTarifario(): void {
        const cod_contrato = this.obServicioTransporte()?.cod_contrato;
        if (!cod_contrato) return;

        this.servicioTransporte.verificarTarifario(cod_contrato).subscribe({
            next: (count) => {
                if (count === 0) {
                    this.formsUtils.alertaNoPermitido('Mano de Obra', 'Ingrese el tarifario de Mano de Obra...!')
                    return;
                }
                this.abrirSubModalTarifario.set(true);
            },
            error: (err) => console.error(err)
        });
    }

    private tieneCambiosPendientes(): boolean {
        return this.miFormulario.dirty
            || this.parametrosArray.dirty
            || this.medicionesArray.dirty
            || this.equiposArray.dirty;
    }

    public async onCerrarConConfirmacion(): Promise<void> {
        if (this.tieneCambiosPendientes()) {
            const confirmar = await this.formsUtils.confirmarSalirSinGuardar();
            if (!confirmar) {
                return;
            }
        }

        this.cerrarModal.emit();
    }

    public recargar(): void {
        const data = this.obServicioTransporte();
        if (data) this.onAbrirContrato.emit(data);

    }

    public onGuardar(): void {
        if (this.miFormulario.invalid) {
            this.miFormulario.markAllAsTouched();
            return;
        }

        const rawForm = this.miFormulario.getRawValue();

        const { cod_empresa, cod_empresa_unidad, cod_contrato } = rawForm;

        const parametrosArray = this.miFormulario.get('parametros') as FormArray;
        const medicionesArray = this.miFormulario.get('mediciones') as FormArray;
        const equiposArray = this.miFormulario.get('equipos') as FormArray;

        const payloadCompleto = {
            ...rawForm,
            flg_vigente: "1",
            ind_valorizacion: this.miFormulario.get('ind_valorizacion')?.value ? '1' : '0',
            cod_usuario_modi: sessionStorage.getItem('username') ?? null,
            cod_usuario_creo: sessionStorage.getItem('username') ?? null,

            parametros: parametrosArray.controls
                .filter(control => control.dirty)
                .map(control => ({
                    ...control.getRawValue(),
                    cod_empresa,
                    cod_empresa_unidad,
                    cod_contrato,
                    cod_usuario_modi: sessionStorage.getItem('username') ?? null,
                    cod_usuario_creo: sessionStorage.getItem('username') ?? null
                })),

            mediciones: medicionesArray.controls
                .filter(control => control.dirty)
                .map(control => ({
                    ...control.getRawValue(),
                    cod_empresa,
                    cod_empresa_unidad,
                    cod_contrato,
                    cod_usuario_modi: sessionStorage.getItem('username') ?? null,
                    cod_usuario_creo: sessionStorage.getItem('username') ?? null,
                })),

            equipos: equiposArray.controls
                .filter(control => control.dirty)
                .map(control => ({
                    ...control.getRawValue(),
                    cod_empresa,
                    cod_empresa_unidad,
                    cod_contrato,
                    cod_usuario_modi: sessionStorage.getItem('username') ?? null,
                    cod_usuario_creo: sessionStorage.getItem('username') ?? null,
                }))
        };


        // 5. Ventana emergente de confirmación unificada
        this.formsUtils.confirmarAnulacionClase(
            'Guardar Registros',
            '¿Está de acuerdo en guardar los datos escritos?',
            'Sí, guardar',
            'No, cancelar'
        ).then(result => {
            if (!result.isConfirmed) return;
            this.servicioTransporte.guardarServicioTransporte(payloadCompleto).subscribe({
                next: (respuesta: RespuestaServidor) => {
                    if (respuesta.estado === 1) {
                        this.formsUtils.alertaExitoAnulacion('Operación Exitosa', respuesta.mensaje);
                        this.miFormulario.markAsPristine();
                        this.parametrosArray.markAsPristine();
                        this.medicionesArray.markAsPristine();
                        this.equiposArray.markAsPristine();
                        this.resetCambiosPendientes();
                        this.recargar();
                        this.listarAdmContrato.emit();
                    } else {
                        this.formsUtils.alertaNoPermitidoClase('Atención', respuesta.mensaje);
                    }
                },
                error: (err) => {
                    console.error('Error de red o servidor:', err);
                    const msgError = err.error?.mensaje || 'No se pudo establecer comunicación con el servidor central.';
                    this.formsUtils.alertaNoPermitidoClase('Error Crítico', msgError);
                }
            });
        })

    }

}
