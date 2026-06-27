import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborMant, Nivel, NivelMant, ProcedenciaBalanzaMant, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-nivel',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-nivel.component.html',
})
export class DetalleNivelComponent {

    listNivelRecibida = input<Nivel | null>(null);
    onGuardarNivel = output<Nivel>();
    formUtils = FormUtils;

    listUnidadEconomica = input<UnidadEconomicaMant[]>([]);
    listVetas = input<VetaMant[]>([]);
    listNivel = input<Nivel[]>([]);
    listTipoLabor = input<TipoLaborMant[]>([]);
    listProcBalanza = input<ProcedenciaBalanzaMant[]>([]);
    listGrupoControl = input<GrupoControlMant[]>([]);

    private fb = inject(FormBuilder);
    public accionService = inject(AccionPlaneamientoService);
    private cdr = inject(ChangeDetectorRef); // 👈 Forzará a Angular a pintar los errores en OnPush

    public miFormulario!: FormGroup;
    public modoFormulario = signal<'NUEVO' | 'EDITAR'>('NUEVO');

    constructor() {
        // 1. Inicialización de la estructura base del formulario

        this.actualizarBloqueos(true, false, true)
        this.miFormulario = this.fb.group({
            cod_nivel: ['', [Validators.required, Validators.maxLength(10)]],
            nom_nivel: ['', [Validators.required, Validators.maxLength(20)]],
            des_nivel: ['', [Validators.required, Validators.maxLength(20)]],
            nro_nivel_cot: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^(?!\+?-?\d{6}\.00$)[+-]?\d+(\.\d+)?$/)]],
            cod_nivel_dhlogger: ['', [Validators.maxLength(20)]],
            est_nivel: ['', [Validators.required, Validators.maxLength(10)]],
            // nom_labor: ['', [Validators.maxLength(30)]], // 👈 Asegúrate de que tenga Validators.required para que pinte el error



        });

        this.miFormulario.get('nom_nivel')?.valueChanges.subscribe(valor => {
            // Replicamos el valor en 'des_labor' sin disparar eventos infinitos
            this.miFormulario.get('des_nivel')?.setValue(valor, { emitEvent: false });
        });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const labor = this.listNivelRecibida();

            if (labor) {
                // --- MODO EDICIÓN ---
                this.modoFormulario.set('EDITAR');
                this.miFormulario.reset(labor);

                // Bloqueo estricto de PKs operacionales del SIOMM
                this.miFormulario.get('cod_nivel')?.disable();
                this.miFormulario.get('des_nivel')?.disable();
            } else {
                // --- MODO NUEVO ---
                this.modoFormulario.set('NUEVO');
                this.miFormulario.get('des_nivel')?.disable();

                this.miFormulario.get('est_nivel')?.disable();

                this.miFormulario.reset({ est_nivel: 'ACT' });
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

    onRegresar = output<void>();

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
        const dataNivel: Nivel = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',
            cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA'
        };


        // 3. Emitimos hacia el orquestador
        this.onGuardarNivel.emit(dataNivel);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }
}
