import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BalanzaDetalleService } from '../../service/balanza-detalle.service';
import { DetalleTicketBalanza, EntradaDetTicketBalanza, EntradaTipoDetalle, TipoDetalleMaterial, TurnoActivo } from '../../interface/balanza-detalle.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { EstadoTicketBalanzaPipe } from 'src/app/core/pipe/EstadoTicketBalanza-pipe';

@Component({
    selector: 'app-modal-detalle-ballanza',
    imports: [ReactiveFormsModule, EstadoTicketBalanzaPipe],
    templateUrl: './modal-detalle-ballanza.component.html',
})
export class ModalDetalleBallanzaComponent implements OnInit {

    public onCerrar = output<boolean>();
    public balanzaDetalleService = inject(BalanzaDetalleService)
    miFormulario!: FormGroup;
    private fb = inject(FormBuilder);
    codTicketBalanza = input<string>('')
    formUtils = FormUtils;
    public listTurnosActivos = signal<TurnoActivo[]>([]);
    public listTipoMaterial = signal<TipoDetalleMaterial[]>([]);
    modo = input<'nuevo' | 'visualizar' | 'edicion'>('visualizar');
    modoObtenido = signal<'nuevo' | 'visualizar' | 'edicion'>('visualizar');

    ngOnInit(): void {
        this.construirFormulario();
        this.aplicarModo();
        this.obtenerTurnosActivos();

        if (this.modo() === 'nuevo') {
            this.aplicarValoresPorDefecto();
        } else {
            this.obtenerBalanzaDetalleTicket();
        }
    }


    private aplicarValoresPorDefecto(): void {
        const ahora = new Date();

        this.miFormulario.patchValue({
            fec_emision: this.formUtils.formatFecha(ahora),
            cod_empresa: '03',           // 👈 vendría de tu sesión/contexto real
            cod_empresa_unidad: '01',    // 👈 idem
            est_ticket_balanza: 'G',     // Generado, según tu catálogo de estados
            fec_usuario_creo: this.formUtils.formatFecha(ahora),
            num_cantidad_carros: 0,
            num_peso_entrada_tmh: 0,
            num_peso_salida_tmh: 0,
            num_peso_neto_tmh: 0,
        });
    }


    public aplicarModo(): void {
        const modoActual = this.modo();
        this.modoObtenido.set(modoActual);

        this.miFormulario.disable();

        this.camposPorModo[modoActual].forEach((campo) => {
            this.miFormulario.get(campo)?.enable();
        });
    }

    private camposPorModo: Record<'nuevo' | 'visualizar' | 'edicion', string[]> = {
        nuevo: ['cod_turno', 'cod_tipo_material', 'cod_tipo_material_detalle'],
        edicion: [],
        visualizar: []
    };

    private obtenerBalanzaDetalleTicket(): void {
        if (this.modo() === 'nuevo') return;

        const data: EntradaDetTicketBalanza = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_ticket_balanza: this.codTicketBalanza()
        };

        this.balanzaDetalleService.obtenerBalanzaDetalleTicket(data).subscribe({
            next: (detalle: DetalleTicketBalanza) => {
                this.miFormulario.patchValue({
                    ...detalle,
                    fec_emision: this.formUtils.formatFecha(detalle.fec_emision),
                });
                this.cargarTipoMaterial(detalle.cod_tipo_material);
            },
            error: (err) => console.error('Error al cargar el detalle del ticket', err)
        });
    }

    private cargarTipoMaterial(codTipoMaterial:string ): void {
        if (!codTipoMaterial) return;

        const payload: EntradaTipoDetalle = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_tipo_material: codTipoMaterial
        };

        this.balanzaDetalleService.obtenerTipoMaterial(payload).subscribe({
            next: (opciones: TipoDetalleMaterial[]) => {
                this.listTipoMaterial.set(opciones);
            },
            error: (err) => console.error('Error al cargar tipo material detalle', err)
        });
    }

    public onTipoMaterial(event: Event): void {
        const codigo = (event.target as HTMLSelectElement).value;
        this.cargarTipoMaterial(codigo);
    }


    public construirFormulario() {
        this.miFormulario = this.fb.group({
            // --- Datos Balanza ---
            fec_emision: [{ value: '', disabled: true }, Validators.required],
            cod_turno: [{ value: '', disabled: true }, Validators.required],
            est_ticket_balanza: [{ value: '', disabled: true }],
            cod_ticket_balanza: [{ value: '', disabled: true }, Validators.required],
            des_guia_remitente: [{ value: '', disabled: true }],
            cod_tipo_material: [{ value: '', disabled: true }, Validators.required],
            cod_tipo_material_detalle: [{ value: '', disabled: true }],

            // --- Características del Transporte ---
            cod_proveedor: [{ value: '', disabled: true }, Validators.required],
            cod_contrato: [{ value: '', disabled: true }, Validators.required],
            cod_personal: [{ value: '', disabled: true }, Validators.required],
            cod_tipo_car: [{ value: '', disabled: true }, Validators.required],
            cod_tipo_car_equipo: [{ value: '', disabled: true }],
            cod_placa: [{ value: '', disabled: true }, Validators.required],
            cod_maquinaria: [{ value: '', disabled: true }],
            des_maquinaria: [{ value: '', disabled: true }],
            cod_tipo_labor: [{ value: '', disabled: true }, Validators.required],
            nom_labor: [{ value: '', disabled: true }, Validators.required],
            cod_ala: [{ value: '', disabled: true }],
            num_cantidad_carros: [{ value: '', disabled: true }],
            cod_item_ruta: [{ value: '', disabled: true }],
            ruta_origen: [{ value: '', disabled: true }],
            ruta_destino: [{ value: '', disabled: true }],

            // --- Pesos ---
            fec_peso_entrada: [{ value: '', disabled: true }],
            num_peso_entrada_tmh: [{ value: '', disabled: true }],
            fec_peso_salida: [{ value: '', disabled: true }],
            num_peso_salida_tmh: [{ value: '', disabled: true }],
            num_peso_neto_tmh: [{ value: '', disabled: true }],

            // --- Comentarios ---
            des_comentario: [{ value: '', disabled: true }],
        });

    }

    public obtenerTurnosActivos() {
        this.balanzaDetalleService.obtenerTurnosActivos({ cod_empresa: '03', cod_empresa_unidad: '01' }).subscribe({
            next: (data: TurnoActivo[]) => this.listTurnosActivos.set(data),
            error: (err) => console.error(err)
        })
    }

    // public onTipoMaterial(event: Event): void {
    //     const codigo = (event.target as HTMLSelectElement).value;
    //     this.cargarTipoMaterialDetalle(codigo);
    // }

    // private cargarTipoMaterialDetalle(codigo: string): void {
    //     if (!codigo) {
    //         this.listTipoMaterial.set([]);
    //         return;
    //     }

    //     const payload: EntradaTipoDetalle = {
    //         cod_empresa: '03',
    //         cod_empresa_unidad: '01',
    //         cod_tipo_material: codigo
    //     };

    //     this.balanzaDetalleService.obtenerTipoMaterial(payload).subscribe({
    //         next: (data: TipoDetalleMaterial[]) => this.listTipoMaterial.set(data),
    //         error: (err) => console.error(err)
    //     });
    // }


    public onGuardar(): void {
        if (this.miFormulario.invalid) {
            this.miFormulario.markAllAsTouched();
            return;
        }
        console.log(this.miFormulario.getRawValue());
        // aquí iría tu lógica de guardado
    }
}
