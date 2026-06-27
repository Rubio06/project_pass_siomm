import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GrupoControlMant, LaborMant, ListZonas, Nivel, NivelMant, ProcedenciaBalanzaMant, TipoLabor, TipoLaborMant, UnidadEconomicaMant, UsuarioJefeTurno, Veta, VetaMant, Zona } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { AccionPlaneamientoService } from 'src/app/module/mantenimiento/services/accion-planeamiento.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-detalle-und-economica',
    imports: [ReactiveFormsModule],
    templateUrl: './detalle-und-economica.component.html',
})
export class DetalleUndEconomicaComponent {

    onRegresar = output<void>();
    listUndEconomicaRecibida = input<UnidadEconomicaMant | null>(null);
    onGuardarUndEconomica = output<UnidadEconomicaMant>();
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
            cod_und_econom: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(10)]],
            nom_und_econom: ['', [Validators.required, Validators.maxLength(40)]],
            des_und_econom: ['', [Validators.required, Validators.maxLength(40)]],
            cod_und_econom_dhlogger: ["", [ Validators.maxLength(20)]],
            ind_act: ['', [Validators.required, Validators.maxLength(1)]],
        });



        // this.miFormulario.get('nom_und_econom')?.valueChanges.subscribe(valor => {
        //     // Replicamos el valor en 'des_veta' sin disparar eventos infinitos
        //     this.miFormulario.get('des_und_econom')?.setValue(valor, { emitEvent: false });
        // });

        // 2. EFFECT 1: Control centralizado de estados (Nuevo / Edición)
        effect(() => {
            const undEconomica = this.listUndEconomicaRecibida();

            console.log("El valor de unidad económica recibida es ", undEconomica);
            if (undEconomica) {
                // --- MODO EDICIÓN ---
                this.modoFormulario.set('EDITAR');

                this.miFormulario.reset({
                    ...undEconomica,
                    // val_vpt: (undEconomica.val_vpt ?? 0).toFixed(2),
                    // nro_den: (undEconomica.nro_den ?? 0).toFixed(2),
                });
                this.miFormulario.get('cod_und_econom')?.disable();

            } else {
                // --- MODO NUEVO ---
                this.modoFormulario.set('NUEVO');
                this.miFormulario.get('ind_act')?.disable();

                this.miFormulario.reset({
                    cod_und_econom: this.codigoSiguiente().toString(),
                    ind_act: 'S',
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
        const undEconomica: UnidadEconomicaMant = {
            ...rawData,
            accion: this.modoFormulario() === 'EDITAR' ? 'E' : 'I',

            cod_empresa: '03',
            cod_empresa_unidad: '01',
            usu_creo: sessionStorage.getItem('username') || 'SISTEMA',

            usu_modi: sessionStorage.getItem('username') || 'SISTEMA',
        };


        // 3. Emitimos hacia el orquestador
        this.onGuardarUndEconomica.emit(undEconomica);

        // 4. Limpiamos la acción global
        this.accionService.emitir('');
    }
}
