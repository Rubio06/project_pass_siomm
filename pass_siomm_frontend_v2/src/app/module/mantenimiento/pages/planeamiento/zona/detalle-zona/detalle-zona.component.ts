import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborMant, ListZonas, Nivel, NivelMant, ProcedenciaBalanzaMant, TipoLabor, TipoLaborMant, UnidadEconomicaMant, UsuarioJefeTurno, Veta, VetaMant, Zona } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-zona',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-zona.component.html',
})
export class DetalleZonaComponent {

    onRegresar = output<void>();
    listZonaRecibida = input<Zona | null>(null);
    onGuardarZona = output<Zona>();
    formUtils = FormUtils;

    listUnidadEconomica = input<UnidadEconomicaMant[]>([]);
    listZona = input<Zona[]>([]);
    listNivel = input<NivelMant[]>([]);
    listTipoLabor = input<TipoLabor[]>([]);
    listProcBalanza = input<ProcedenciaBalanzaMant[]>([]);
    listGrupoControl = input<GrupoControlMant[]>([]);
    _listZonasMant = input<ListZonas[]>([]);
    codigoSiguiente = input<string>('');
    listUsuario = input<UsuarioJefeTurno[]>([]);
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
            cod_zona: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(10)]],
            des_zona: ['', [Validators.required, Validators.maxLength(40)]],
            obs_zona: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(40)]],
            nro_den: ["", [Validators.min(0), Validators.pattern(/^\d{1,6}(\.\d{1,4})?$/)]],
            ind_dens_estructura: ['', [Validators.maxLength(1)]],
            des_veta: ['', [Validators.maxLength(40)]],
            val_vpt: ["", [Validators.min(0), Validators.pattern(/^\d{1,6}(\.\d{1,4})?$/)]],
            cod_costo_equivalente: ['', [Validators.maxLength(20)]],
            cod_zona_dhlogger: ['', [Validators.maxLength(20)]],
            cod_usuario_responsable: ['', [Validators.maxLength(20)]],
            est_zona: ['', [Validators.maxLength(3)]]
        });



        this.miFormulario.get('des_zona')?.valueChanges.subscribe(valor => {
            // Replicamos el valor en 'des_veta' sin disparar eventos infinitos
            this.miFormulario.get('obs_zona')?.setValue(valor, { emitEvent: false });
        });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const zona = this.listZonaRecibida();

            if (zona) {
                // --- MODO EDICIÓN ---
                this.modoFormulario.set('EDITAR');

                this.miFormulario.reset({
                    ...zona,
                    val_vpt: (zona.val_vpt ?? 0).toFixed(2),
                    nro_den: (zona.nro_den ?? 0).toFixed(2),
                });
                this.miFormulario.get('cod_zona')?.disable();

            } else {
                // --- MODO NUEVO ---
                this.modoFormulario.set('NUEVO');
                this.miFormulario.get('est_zona')?.disable();

                this.miFormulario.reset({
                    est_zona: 'ACT',
                    cod_zona: this.codigoSiguiente().toString(),
                    ind_dens_estructura: 'N',
                    val_vpt: (0).toFixed(2),  // 👈 "0.0000"
                    nro_den: (0).toFixed(2),  // 👈 "0.0000"
                });
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
        const zona: Zona = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',

            cod_empresa: '03',
            cod_empresa_unidad: '01',
            cod_usuario_creo: sessionStorage.getItem('username') || 'SISTEMA',

            cod_usuario_modi: sessionStorage.getItem('username') || 'SISTEMA',
        };


        // 3. Emitimos hacia el orquestador
        this.onGuardarZona.emit(zona);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }


}
