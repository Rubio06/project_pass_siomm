import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contrata, GrupoControlMant, LaborMant, ListZonas, Nivel, NivelMant, ProcedenciaBalanzaMant, RutaTransporte, TipoLabor, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-contrata',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-contrata.component.html',
})
export class DetalleContrataComponent {

    onRegresar = output<void>();
    listContrataRecibida = input<Contrata | null>(null);
    onGuardarContrata = output<Contrata>();
    formUtils = FormUtils;
    obtenerCodigoContrato = input<string>('');
    // listUnidadEconomica = input<UnidadEconomicaMant[]>([]);
    // listVetas = input<VetaMant[]>([]);
    // listNivel = input<NivelMant[]>([]);
    // listRutaTransporte = input<RutaTransporte[]>([]);
    // listProcBalanza = input<ProcedenciaBalanzaMant[]>([]);
    // listGrupoControl = input<GrupoControlMant[]>([]);
    codigoRutaTransporte = input<string>('');
    _listZonasMant = input<ListZonas[]>([]);
    private fb = inject(FormBuilder);
    public accionService = inject(AccionPlaneamientoService);
    private cdr = inject(ChangeDetectorRef); // 👈 Forzará a Angular a pintar los errores en OnPush

    public miFormulario!: FormGroup;
    public modoFormulario = signal<'NUEVO' | 'EDITAR'>('NUEVO');

    constructor() {
        // 1. Inicialización de la estructura base del formulario
        // console.log("Los datos recibidos son " + listTipoLaborRecibida());

        this.actualizarBloqueos(true, false, true)
        this.miFormulario = this.fb.group({
            cod_contrata: [''],

            ruc_contrata: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
            des_contrata: ['', [Validators.required, Validators.maxLength(30)]],  // ❌ sin Validators.required
            nro_telefono: ['', [Validators.maxLength(20), Validators.pattern(/^\d{1,20}$/)]],  // ❌ sin Validators.required
            rep_nombre: ['', [Validators.maxLength(30)]],  // ❌ sin Validators.required
            eml_correo: ['', [Validators.maxLength(30)]],
            est_contrata: ['', [Validators.maxLength(3)]],
            ind_tipo_contrata: ['E'],

        });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const contrata = this.listContrataRecibida();
            if (contrata) {
                this.modoFormulario.set('EDITAR');

                // 👇 Cambia reset() por patchValue() y maneja el null
                this.miFormulario.patchValue({
                    ...contrata,
                    ind_tipo_contrata: contrata.ind_tipo_contrata ?? 'E' // 👈 si viene null usa 'E'
                });

                this.miFormulario.get('ruc_contrata')?.disable();
            } else {
                this.modoFormulario.set('NUEVO');
                this.miFormulario.get('est_contrata')?.disable();
                this.miFormulario.patchValue({
                    cod_contrata: this.obtenerCodigoContrato().toString() || '', // 👈 asigna el nuevo código generado
                    est_contrata: 'ACT',
                    ind_tipo_contrata: 'E' 
                })
            }
            this.cdr.markForCheck();
        });

        // 3. EFFECT 2: Intercepción del disparador guardar del orquestador
        effect(() => {
            const accion = this.accionService.accion();
            if (accion === 'guardar') {

                this.onGuardar();
            }
        });
    }

    // ❌ REMOVIMOS COMPLETAMENTE EL ngOnInit() QUE HACÍA EL PATCHVALUE MANUAL ❌
    // Ya no es necesario porque el primer effect se encarga perfectamente del ciclo de vida del input()

    private actualizarBloqueos(nuevo: boolean, guardar: boolean, editar: boolean): void {
        this.accionService.setBloqueos({ nuevo, guardar, editar });
    }


    public presionoRegresar() {
        this.onRegresar.emit(); // Solo avisa "me quiero ir"
    }

    public onGuardar() {
        // 1. Validamos localmente
        if (this.miFormulario.invalid) {
            this.miFormulario.markAllAsTouched();
            this.cdr.markForCheck(); // 👈 OBLIGA a Angular a redibujar el HTML mostrando las alertas rojas
            this.accionService.emitir(''); // Desbloqueamos el botón global
            return;
        }

        // 2. Extraemos la data limpia
        const rawData = this.miFormulario.getRawValue();

        const contrata: Contrata = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',
            ruc_contrata: rawData.ruc_contrata.toString(),
            nro_telefono: rawData.nro_telefono.toString(),
            cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA'
        };

        // 3. Emitimos hacia el orquestador
        this.onGuardarContrata.emit(contrata);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }
}
