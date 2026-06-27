import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborMant, ListZonas, Nivel, NivelMant, ProcedenciaBalanzaMant, TipoLabor, TipoLaborMant, UnidadEconomicaMant, Veta, VetaMant } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-veta',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-veta.component.html',
})
export class DetalleVetaComponent {

    onRegresar = output<void>();
    listVetaRecibida = input<Veta | null>(null);
    onGuardarVeta = output<Veta>();
    formUtils = FormUtils;

    listUnidadEconomica = input<UnidadEconomicaMant[]>([]);
    listVeta = input<Veta[]>([]);
    listNivel = input<NivelMant[]>([]);
    listTipoLabor = input<TipoLabor[]>([]);
    listProcBalanza = input<ProcedenciaBalanzaMant[]>([]);
    listGrupoControl = input<GrupoControlMant[]>([]);
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
            cod_und_econom: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(10)]],
            cod_zona: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(20)]],
            cod_veta: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(20)]],
            nom_veta: ['', [Validators.required, Validators.maxLength(40)]],
            ind_veta: ['', [Validators.required, Validators.maxLength(1)]],
            des_veta: ['', [Validators.required, Validators.maxLength(40)]],
            nro_den: [{value: '', disabled: true}, [Validators.maxLength(20)]],
            cod_veta_dhlogger: ['', [Validators.maxLength(20)]],
            est_veta: ['', [Validators.maxLength(20)]]
        });

        this.miFormulario.get('nom_veta')?.valueChanges.subscribe(valor => {
            // Replicamos el valor en 'des_veta' sin disparar eventos infinitos
            this.miFormulario.get('des_veta')?.setValue(valor, { emitEvent: false });
        });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const veta = this.listVetaRecibida();

            if (veta) {
                // --- MODO EDICIÓN ---
                this.modoFormulario.set('EDITAR');
                this.miFormulario.reset(veta);

                // Bloqueo estricto de PKs operacionales del SIOMM
                this.miFormulario.get('cod_veta')?.disable();
                // this.miFormulario.get('des_nivel')?.disable();
            } else {
                // --- MODO NUEVO ---
                this.modoFormulario.set('NUEVO');
                // this.miFormulario.get('des_nivel')?.disable();

                // this.miFormulario.get('est_nivel')?.disable();
                this.miFormulario.get('cod_veta')?.enable();
                this.miFormulario.get('cod_und_econom')?.enable();
                this.miFormulario.get('cod_zona')?.enable();
                this.miFormulario.get('est_veta')?.disable();
                this.miFormulario.get('des_veta')?.disable();

                this.miFormulario.reset({ est_veta: 'ACT' });
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
        const veta: Veta = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',
            cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA'
        };


        // 3. Emitimos hacia el orquestador
        this.onGuardarVeta.emit(veta);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }
}
