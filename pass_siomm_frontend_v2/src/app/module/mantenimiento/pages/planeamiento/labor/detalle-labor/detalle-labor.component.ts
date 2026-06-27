import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborMant, NivelMant, ProcedenciaBalanzaMant, TipoLaborMant, UnidadEconomicaMant, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-labor',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-labor.component.html',
})
export class DetalleLaborComponent {

    listLaborRecibida = input<LaborMant | null>(null);
    onGuardarLabor = output<LaborMant>();
    formUtils = FormUtils;
    onRegresar = output<void>();

    listUnidadEconomica = input<UnidadEconomicaMant[]>([]);
    listVetas = input<VetaMant[]>([]);
    listNivel = input<NivelMant[]>([]);
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
            cod_und_econom: ['', [Validators.required]],
            cod_zona: [''],
            cod_veta: ['', [Validators.required]],
            cod_nivel: ['', [Validators.required]],
            cod_tipo_labor: [''],
            cod_labor: ['', [Validators.required, Validators.maxLength(10)]],
            nom_labor: ['', [Validators.maxLength(30)]], // 👈 Asegúrate de que tenga Validators.required para que pinte el error
            des_labor: [{ value: '', disabled: true }],
            ind_tipo_labor: [null],
            est_labor: ['ACT'],
            cod_proced_blza: [''],
            cod_grupo_control: [''],
            cod_tipo_labor_ant: [''],
            cod_labor_ant: [''],


        });

        this.miFormulario.get('nom_labor')?.valueChanges.subscribe(valor => {
            // Replicamos el valor en 'des_labor' sin disparar eventos infinitos
            this.miFormulario.get('des_labor')?.setValue(valor, { emitEvent: false });
        });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const labor = this.listLaborRecibida();

            console.log("la data de la labor es " + JSON.stringify(labor, null, 2))
            if (labor) {
                // --- MODO EDICIÓN ---
                this.modoFormulario.set('EDITAR');
                this.miFormulario.reset(labor);

                // Bloqueo estricto de PKs operacionales del SIOMM
                this.miFormulario.get('cod_labor')?.disable();
                this.miFormulario.get('cod_und_econom')?.disable();
                this.miFormulario.get('cod_nivel')?.disable();
                this.miFormulario.get('cod_tipo_labor')?.disable();

                this.miFormulario.get('cod_tipo_labor_ant')?.disable();

                this.miFormulario.get('cod_veta')?.disable();
            } else {
                // --- MODO NUEVO ---
                this.modoFormulario.set('NUEVO');

                // Inicializamos limpio garantizando que el estado no arrastre bloqueos previos
                this.miFormulario.get('cod_labor')?.enable();
                this.miFormulario.get('cod_und_econom')?.enable();
                this.miFormulario.get('cod_nivel')?.enable();
                this.miFormulario.get('cod_tipo_labor')?.enable();
                this.miFormulario.get('cod_veta')?.enable();
                this.miFormulario.get('est_labor')?.disable();

                this.miFormulario.reset({ est_labor: 'ACT' });
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
        const dataLabor: LaborMant = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',
            cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA'
        };


        // 3. Emitimos hacia el orquestador
        this.onGuardarLabor.emit(dataLabor);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }
}
