import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { EsptecBaseMedicionComponent } from './components/tabs/esptec-base-medicion/esptec-base-medicion.component';
import { CommonModule } from '@angular/common';
import { ModalGastosGeneralesComponent } from './components/modal-anexos/modal-gastos-generales/modal-gastos-generales.component';
import { ModalTarifarioComponent } from './components/modal-anexos/modal-tarifario/modal-tarifario.component';
import { ModalPreciosUnitariosComponent } from './components/modal-anexos/modal-precios-unitarios/modal-precios-unitarios.component';
import { ContratoDetalleResponse, ContratoEquipoPesado, ContratoMedicion, ContratoParametro, ServicoTransporte } from '../../interfaces/adm-contrato.interface';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServioTransporteService } from './services/servico-transporte.service';
import { MaeContrataAdmDto } from './interfaces/servicio-transporte.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { EquiposAlquiladosComponent } from './components/tabs/equipos-allquilados/equipos-alquilados.component';
import { ParametrosGeneralesComponent } from './components/tabs/parametros-generales/parametros-generales.component';

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

    // ─── Inputs / Outputs ──────────────────────────────────────
    cerrarModal = output<void>();
    obServicioTransporte = input<ContratoDetalleResponse | null>(null);
    modo = input<'nuevo' | 'visualizar' | null>(null);

    // ─── Signals ───────────────────────────────────────────────
    tabActivo = signal('parametros');
    abrirSubModalGastos = signal<boolean>(false);
    abrirSubModalTarifario = signal<boolean>(false);
    abrirSubModalPrecUnitario = signal<boolean>(false);
    listContrataAdm = signal<MaeContrataAdmDto[]>([]);
    formsUtils = FormUtils;

    // ─── Formulario ────────────────────────────────────────────
    miFormulario: FormGroup = this.fb.group({
        cod_empresa: [''],
        cod_empresa_unidad: [''],
        cod_contrato: [''],
        cod_contrata: [''],
        fec_registro: [''],
        fec_inicio: [''],
        fec_termino: [''],
        des_contacto_contrata: ['', [Validators.maxLength(200)]],
        imp_tipo_cambio: ['', [Validators.min(0)]],
        nro_adendum: ['', [Validators.maxLength(50)]],
        des_observacion: ['', [Validators.maxLength(500)]],
        ind_situacion: [''],
        ind_estado: [''],
        flg_vigente: [''],
        fec_firma: [''],
        ind_tipo_contrato: [''],
        cod_usuario_creo: [''],
        fec_usuario_creo: [''],
        cod_usuario_modi: [''],
        fec_usuario_modi: [''],
        ind_moneda: [''],
        ind_tipocambio: [''],
        ind_valorizacion: [''],
        c_t_ruc: [''],
        c_t_representante: [''],
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

    // ─── Lifecycle ─────────────────────────────────────────────
    ngOnInit(): void {
        this.obtenerListaContrata();
        this.onEscucharCambioContrata();
        this.onEscucharCambiosRadio();
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
        return this.fb.group({
            cod_parametro_contrato: [p?.cod_parametro_contrato ?? ''],
            cod_moneda: [p?.cod_moneda ?? ''],
            imp_porcentaje: [p?.imp_porcentaje ?? null],
            imp_monto: [p?.imp_monto ?? null],
            des_observacion: [p?.des_observacion ?? ''],
            flg_vigente: [p?.flg_vigente ?? ''],
            c_t_anexo: [p?.c_t_anexo ?? ''],
            cod_valor: [p?.cod_valor ?? ''],
            cod_tabla_anexo: [p?.cod_tabla_anexo ?? ''],
            cod_item_anexo: [p?.cod_item_anexo ?? ''],
        });
    }

    private crearMedicionGroup(m?: ContratoMedicion): FormGroup {
        return this.fb.group({
            cod_parametro_medicion: [m?.cod_parametro_medicion ?? ''],
            cod_tabla_um_pv: [m?.cod_tabla_um_pv ?? ''],
            cod_item_um_pv: [m?.cod_item_um_pv ?? ''],
            cod_tabla_um_ap: [m?.cod_tabla_um_ap ?? ''],
            cod_item_um_ap: [m?.cod_item_um_ap ?? ''],
            nro_potencia_veta_1: [
                m?.nro_potencia_veta_1 !== undefined && m?.nro_potencia_veta_1 !== null
                    ? Number(m.nro_potencia_veta_1).toFixed(2)
                    : '0.00'
            ],

            // nro_potencia_veta_2: [m?.nro_potencia_veta_2 ?? 0.00],

            nro_potencia_veta_2: [
                m?.nro_potencia_veta_2 !== undefined && m?.nro_potencia_veta_2 !== null
                    ? Number(m.nro_potencia_veta_2).toFixed(2)
                    : '0.00'
            ],
            nro_ancho_pago_1: [
                m?.nro_ancho_pago_1 !== undefined && m?.nro_ancho_pago_1 !== null
                    ? Number(m.nro_ancho_pago_1).toFixed(2)
                    : '0.00'
            ],


            // nro_ancho_pago_1: [m?.nro_ancho_pago_1 ?? 0.00],
            cod_valor_ap: [m?.cod_valor_ap ?? ''],
            cod_valor_pv: [m?.cod_valor_pv ?? ''],
            c_t_pv: [m?.c_t_pv ?? ''],
            c_t_ap: [m?.c_t_ap ?? ''],
        });
    }

    private crearEquipoPesadoGroup(e?: ContratoEquipoPesado): FormGroup {
        return this.fb.group({
            cod_empresa: [e?.cod_empresa ?? ''],
            cod_empresa_unidad: [e?.cod_empresa_unidad ?? ''],
            cod_contrato: [e?.cod_contrato ?? ''],
            cod_equipo_pesado: [e?.cod_equipo_pesado ?? ''],
            cod_equipo_pesado_1: [''],
            ind_moneda: [e?.ind_moneda ?? ''],
            ind_tarifa: [e?.ind_tarifa ?? ''],
            imp_alquiler_equipo: [e?.imp_alquiler_equipo ?? null],
            flg_vigencia: [e?.flg_vigencia ?? ''],
            cod_usuario_creo: [e?.cod_usuario_creo ?? ''],
            fec_usuario_creo: [e?.fec_usuario_creo ?? null],
            cod_usuario_modi: [e?.cod_usuario_modi ?? ''],
            fec_usuario_modi: [e?.fec_usuario_modi ?? null],
        });
    }
    // ─── Modo nuevo / visualizar ───────────────────────────────
    private asignarModo(modo: string | null): void {
        if (modo === 'visualizar') {
            this.miFormulario.disable();

            this.toggleFormArrays(['parametros', 'mediciones', 'equipos'], true);
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
            }



        } else if (modo === 'nuevo') {
            this.miFormulario.enable();

            this.miFormulario.patchValue({ /* ... tu código actual ... */ });

            const camposDeshabilitados = [
                'cod_contrato', 'ind_estado',
                'cod_usuario_creo', 'c_t_ruc', 'fec_usuario_creo'
            ];
            camposDeshabilitados.forEach(campo =>
                this.miFormulario.get(campo)?.disable()
            );

            // ✅ Deshabilitados en nuevo
            this.toggleFormArrays(['parametros', 'mediciones', 'equipos'], false);
        }
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
    private obtenerListaContrata(): void {
        this.servicioTransporte.obtenerServicioTransporte().subscribe({
            next: (resp: MaeContrataAdmDto[]) =>  {
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

    private onEscucharCambiosRadio(): void {
        // 🎧 Escuchamos el evento de cambio del Radio Button de forma reactiva
        this.miFormulario.get('ind_tipo_contrato')?.valueChanges.subscribe((tipoSeleccionado: string) => {

            if (tipoSeleccionado === 'O' || tipoSeleccionado === 'T') {
                this.tabActivo.set('parametros');
            }
            else if (tipoSeleccionado === 'A') {
                this.tabActivo.set('equipos');
            }

        });
    }

    public onGuardar(): void {
        if (this.miFormulario.invalid) return;

        const payload = this.miFormulario.getRawValue();

        console.log("los datos generales son " + JSON.stringify(payload, null, 2))

        console.log('equipos:', payload.equipos); // ✅ ya incluye las filas del hijo
    }
}
