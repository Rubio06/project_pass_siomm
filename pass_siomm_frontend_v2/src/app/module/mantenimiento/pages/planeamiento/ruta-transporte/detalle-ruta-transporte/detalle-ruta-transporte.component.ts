import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborMant, ListZonas, Nivel, NivelMant, ProcedenciaBalanzaMant, RutaTransporte, TipoLabor, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-ruta-transporte',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-ruta-transporte.component.html',
})
export class DetalleRutaTransporteComponent {

    onRegresar = output<void>();
    listRutaTransporteRecibida = input<RutaTransporte | null>(null);
    onGuardarRutaTransporter = output<RutaTransporte>();
    formUtils = FormUtils;

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

            cod_ruta: ['', [Validators.required, Validators.maxLength(10)]],
            des_ruta: ['', [Validators.required, Validators.maxLength(50)]],  // ❌ sin Validators.required
            des_ruta_abrev: ['', [Validators.required, Validators.maxLength(50)]],  // ❌ sin Validators.required
            cod_zona: ['', [Validators.required, Validators.maxLength(10)]],  // ❌ sin Validators.required
            ind_tipo_tolcanc:['', [Validators.required, Validators.maxLength(1)]],
            flg_vigente: ['', [Validators.required, Validators.maxLength(1)]],

        });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const labor = this.listRutaTransporteRecibida();

            if (labor) {
                // --- MODO EDICIÓN ---
                this.modoFormulario.set('EDITAR');
                this.miFormulario.reset(labor);
                // Bloqueo estricto de PKs operacionales del SIOMM
                this.miFormulario.get('cod_ruta')?.disable();
            } else {

                // --- MODO NUEVO ---
                this.modoFormulario.set('NUEVO');
                // this.miFormulario.get('des_nivel')?.disable();

                this.miFormulario.get('flg_vigente')?.disable();

                this.miFormulario.reset({ flg_vigente: '1' });
                this.miFormulario.get('cod_ruta')?.disable();

                this.miFormulario.patchValue({
                    cod_ruta: this.codigoRutaTransporte()
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

        // 🛠️ Construcción del Payload con banderas de control del SIOMM
        const dataNivel: RutaTransporte = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',
            cod_ruta: String(this.miFormulario.get('cod_ruta')?.value ?? ''),
            cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA'
        };


        // 3. Emitimos hacia el orquestador
        this.onGuardarRutaTransporter.emit(dataNivel);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }
}
