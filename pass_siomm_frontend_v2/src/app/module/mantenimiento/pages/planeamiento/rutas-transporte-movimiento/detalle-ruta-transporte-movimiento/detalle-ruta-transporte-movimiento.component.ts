import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborMant, ListaRutaTransporte, ListZonas, Nivel, NivelMant, ProcedenciaBalanzaMant, RutasTransporteMovimiento, RutaTransporte, TipoLabor, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-ruta-transporte-movimiento',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-ruta-transporte-movimiento.component.html',
})
export class DetalleRutaTransporteMovimientoComponent {

    onRegresar = output<void>();
    listRutasMovimientoTransporteRecibida = input<RutasTransporteMovimiento | null>(null);
    onGuardarRutaTransporteMovimiento = output<RutasTransporteMovimiento>();
    formUtils = FormUtils;

    // listUnidadEconomica = input<UnidadEconomicaMant[]>([]);
    // listVetas = input<VetaMant[]>([]);
    // listNivel = input<NivelMant[]>([]);
    listRutaTransporte = input<ListaRutaTransporte[]>([]);
    // listProcBalanza = input<ProcedenciaBalanzaMant[]>([]);
    // listGrupoControl = input<GrupoControlMant[]>([]);
    codigoRutaTransporte = input<string>('');
    _listZonasMant = input<ListZonas[]>([]);
    private fb = inject(FormBuilder);
    codigoRutaTransporteMovimiento = input<string>('');
    public accionService = inject(AccionPlaneamientoService);
    private cdr = inject(ChangeDetectorRef); // 👈 Forzará a Angular a pintar los errores en OnPush

    public miFormulario!: FormGroup;
    public modoFormulario = signal<'NUEVO' | 'EDITAR'>('NUEVO');

    constructor() {
        // 1. Inicialización de la estructura base del formulario
        // console.log("Los datos recibidos son " + listTipoLaborRecibida());

        this.actualizarBloqueos(true, false, true)
        this.miFormulario = this.fb.group({

            cod_ruta_transporte: ['', [Validators.required, Validators.maxLength(10)]],
            cod_ruta_origen: ['', [Validators.required, Validators.maxLength(50)]],  // ❌ sin Validators.required
            cod_ruta_destino: ['', [Validators.required, Validators.maxLength(50)]],  // ❌ sin Validators.required
            est_ruta_transporte: ['', [Validators.required, Validators.maxLength(10)]],

        });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const labor = this.listRutasMovimientoTransporteRecibida();

            if (labor) {
                // --- MODO EDICIÓN ---
                this.modoFormulario.set('EDITAR');
                this.miFormulario.reset(labor);
                // Bloqueo estricto de PKs operacionales del SIOMM
                this.miFormulario.get('cod_ruta_transporte')?.disable();
            } else {

                // --- MODO NUEVO ---
                this.modoFormulario.set('NUEVO');
                // this.miFormulario.get('des_nivel')?.disable();

                                // this.miFormulario.get('des_nivel')?.disable();
                this.miFormulario.get('cod_ruta_transporte')?.disable();

                this.miFormulario.get('est_ruta_transporte')?.disable();
                
                this.miFormulario.reset({ est_ruta_transporte: 'ACT' });

                this.miFormulario.patchValue({
                    cod_ruta_transporte: this.codigoRutaTransporteMovimiento()
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
        const dataTransporteMovimiento: RutasTransporteMovimiento = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',
            cod_ruta_transporte: String(this.miFormulario.get('cod_ruta_transporte')?.value ?? ''),
            cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA'
        };


        // 3. Emitimos hacia el orquestador
        this.onGuardarRutaTransporteMovimiento.emit(dataTransporteMovimiento);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }
}
