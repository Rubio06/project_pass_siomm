import {
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    inject,
    OnInit,
    OnDestroy,
    signal,
    untracked
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    CopiarLabor,
    LaborAvance,
    ProgramaExplotacion,
    ResponsDetprg
} from '../../../../../../interface/edicion-programa-mensual.interface';
import { CommonModule } from '@angular/common';

import {
    BotonAccionService,
    EdicionProgrmaMensualService
} from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/services';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionBloqueComponent } from './modals/evaluacion-bloque/evaluacion-bloque.component';
import { BlockReservasComponent } from './modals/block-reservas/block-reservas.component';
import { PlanosComponent } from './modals/planos/planos.component';
import { UtilidadesPrograma } from './utilidades-programa';
import { FormUtils } from 'src/app/utils/form-utils';
import { ModalListaAvanceComponent } from '../../../../modal-lista-avance/modal-lista-avance.component';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';

@Component({
    selector: 'app-desarrollo-programa',
    imports: [
        ReactiveFormsModule,
        CommonModule,
        EvaluacionBloqueComponent,
        BlockReservasComponent,
        PlanosComponent,
        ModalListaAvanceComponent
    ],
    templateUrl: './programa.component.html',
    styleUrls: ['./programa.component.css']
})
export class ProgramaComponent implements OnInit, OnDestroy {

    // ================================
    // INYECCIONES
    // ================================
    private route = inject(ActivatedRoute);
    private programaState = inject(EdicionProgrmaMensualService);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);
    private planingService = inject(PlanningService);
    public botonAccionService = inject(BotonAccionService);
    utilidades = inject(UtilidadesPrograma);
    formUtils = FormUtils;

    // ================================
    // ESTADO
    // ================================
    isLoading = signal(false);

    // Inicializa con el valor real para evitar NG0100
    modo = signal<'nuevo' | 'ver' | 'editar' | null>(
        this.programaState.modo()
    );

    codigo_fase = signal<string | null>(null);
    cie_anio = signal<string | null>(null);
    cod_labor = signal('');
    cod_tipo_labor = signal('');

    listaEdicionPrograma = signal<ProgramaExplotacion[]>([]);
    listMetExplotacion = signal<any[]>([]);
    listAsociaLabor = signal([
        { cod_aso_labor: 'N', aso_labor: 'Si' },
        { cod_aso_labor: 'S', aso_labor: 'No' }
    ]);

    // ================================
    // TOTALES Y PROMEDIOS
    // ================================
    _totalProduccion = signal<number>(0);
    _totalPrgAvamts = signal<number>(0);
    _totalTmsDes = signal<number>(0);
    _totalTmsMin = signal<number>(0);
    _totalTmsToal = signal<number>(0);
    _promedioLeyAg = signal<number>(0);
    _promedioLeyCu = signal<number>(0);
    _promedioLeyPb = signal<number>(0);
    _promedioLeyZn = signal<number>(0);
    _promedioLeyAu = signal<number>(0);
    _promedioVptMin = signal<number>(0);

    // ================================
    // FORMULARIO
    // ================================
    programaForm: FormGroup = this.fb.group({ labores: this.fb.array([]) });

    get labores(): FormArray {
        return this.programaForm.get('labores') as FormArray;
    }

    // ================================
    // MODALES
    // ================================
    showModalBlock = false;
    showModalReserva = false;
    showModalPlano = false;
    mostrarModalLabores = this.botonAccionService.mostrarModal;

    selectedIndexBlock: number | null = null;
    selectedIndexReserva: number | null = null;
    selectedIndexPlano: number | null = null;
    selectedIndex: number | null = null;

    selectedPrograma = signal<ProgramaExplotacion | null>(null);

    // ================================
    // CONTROL INTERNO
    // ================================
    selecionarIndice = signal<number | null>(null);
    laboresEvaluacionBloque = signal<AbstractControl | null>(null);
    filaCopiadaEfecto = signal<number | null>(null);
    cutoff = computed(() => this.programaState.prgCutoff());

    private formSub?: Subscription;

    // ================================
    // CONSTRUCTOR — solo effects
    // ================================
    constructor() {
        // Recalcula rentabilidad cuando cambia el cutoff
        // allowSignalWrites evita NG0100 al escribir en controles del form
        effect(() => {
            this.cutoff(); // suscribirse al signal
            untracked(() => this.calcularRentabilidad());
        }, { allowSignalWrites: true });

        // Recarga datos cuando el estado lo indica
        effect(() => {
            const recargar = this.programaState.recargar();
            if (recargar > 0) {
                untracked(() => this.edicionProgramaMensual());
            }
        });
    }

    // ================================
    // CICLO DE VIDA
    // ================================
    ngOnInit(): void {
        this.cie_anio.set(this.programaState.programa().cie_ano);

        this.escucharRuta();
        this.aplicarModo();
        this.loadSelectExploracion();

        this.botonAccionService.registrarFormulario(this.programaForm);
        this.programaState.registrarFormularioActivo(this.programaForm);

        this.formSub = this.programaForm.valueChanges.subscribe(() => {
            if (this.programaForm.dirty) {
                this.programaState.formDirty.set(true);
            }
        });
    }

    ngOnDestroy(): void {
        this.formSub?.unsubscribe();
        this.programaState.registrarFormularioActivo(null);
        this.persistirDatosFase();
        this.programaState.formDirty.set(false);
    }

    // ================================
    // CARGA DE DATOS
    // ================================
    private escucharRuta(): void {
        this.route.params.subscribe(params => {
            const cod = params['codigo_fase'];
            const nroProg = params['nro_prog'];

            if (nroProg === 'nuevo') {
                this.programaState.setModo('nuevo');
            }

            this.codigo_fase.set(cod);
            this.loadAllData();
            this.edicionProgramaMensual();
        });
    }

    private async loadAllData(): Promise<void> {
        this.isLoading.set(true);
        try {
            const config = this.obtenerConfiguracion();
            const prefijo = await this.utilidades.construirPrefijoBusqueda(config);
            await this.utilidades.cargarListas(config, prefijo);
        } catch (error) {
            console.error('Error cargando listas:', error);
        }
        this.isLoading.set(false);
    }

    loadSelectExploracion(): void {
        this.planingService.SelectExploracion().subscribe({
            next: (data) => this.listMetExplotacion.set(data),
            error: (e) => console.error('Error cargando métodos de exploración', e)
        });
    }

    private edicionProgramaMensual(): void {

        const nroProg = this.programaState.programa().nro_prog;
        const fase = this.codigo_fase()!;

        // Restaurar datos persistidos entre fases
        const persistidos = this.programaState.obtenerDatosFase(fase);
        if (persistidos?.length) {
            this.cargarLaboresEnForm(persistidos as ProgramaExplotacion[]);
            this.recalcularTotales();
            this.aplicarModo();
            return;
        }

        if (!nroProg) return;

        this.isLoading.set(true);

        this.programaState.edicionProgramaMensual(nroProg, fase).subscribe({
            next: (edicion: ProgramaExplotacion[]) => {
                this.cargarLaboresEnForm(edicion);
                this.recalcularTotales();
                this.aplicarModo();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error cargando edición:', err);
                this.isLoading.set(false);
            }
        });
    }

    private cargarLaboresEnForm(edicion: ProgramaExplotacion[]): void {
        this.labores.clear();
        this.listaEdicionPrograma.set(edicion);
        edicion.forEach(item => {
            const grupo = this.crearLaborFormGroup(item);
            this.labores.push(grupo);
            this.inicializarSubscripcionesFila(grupo);
            this.aplicarValoresIniciales(grupo);
        });
    }

    // ================================
    // FORM GROUP
    // ================================
    crearLaborFormGroup(item: ProgramaExplotacion): FormGroup {
        return this.fb.group({
            // Solo lectura — disabled manual
            cod_veta: [item?.cod_veta || '', Validators.required],
            cod_nom_veta: [item?.cod_nom_veta || ''],
            nom_veta: [item?.nom_veta || ''],
            cod_nivel: [item?.cod_nivel || '', Validators.required],
            cod_tipo_labor: [item?.cod_tipo_labor, Validators.required],
            cod_labor: [item?.cod_labor || '', Validators.required],
            num_factor_x: [{ value: '', disabled: true }],
            tms_total: [{ value: '', disabled: true }],
            prg_cutoff: [{ value: '', disabled: true }],

            // Campos editables
            cod_ala: [item.cod_ala || '', Validators.required],
            cod_cto: [item.cod_cto || ''],
            cod_cta: [item.cod_cta || ''],
            prg_est: [item.prg_est],
            prg_blocks: [item.prg_blocks || '', [Validators.required, Validators.pattern(/\S/)]],
            prg_avamts: [item.prg_avamts, Validators.required],
            prg_secancho: [item.prg_secancho, Validators.required],
            prg_secaltu: [item.prg_secaltu, Validators.required],
            prg_tmsdes: [item.prg_tmsdes, Validators.required],
            prg_tmsmin: [item.prg_tmsmin, Validators.required],
            prg_ancmin: [item.prg_ancmin, Validators.required],
            prg_progra: [item.prg_progra],
            ind_tip_roca_piso: [item.ind_tip_roca_piso, Validators.required],
            ind_tip_roca: [item.ind_tip_roca, Validators.required],
            ind_tip_roca_techo: [item.ind_tip_roca_techo, Validators.required],
            ind_taladro_largo: [item.ind_taladro_largo],
            ind_clasificacion_sos: [item.ind_clasificacion_sos, Validators.required],
            val_tipo_fac: [item.val_tipo_fac, Validators.required],
            prg_fecmuestreo: [item.prg_fecmuestreo, Validators.required],

            // Leyes — siempre Number para evitar conflicto con type="number"
            prg_leyag: [item.prg_leyag != null ? Number(item.prg_leyag) : null, Validators.required],
            prg_leycu: [item.prg_leycu != null ? Number(item.prg_leycu) : null, Validators.required],
            prg_leypb: [item.prg_leypb != null ? Number(item.prg_leypb) : null, Validators.required],
            prg_leyzn: [item.prg_leyzn != null ? Number(item.prg_leyzn) : null, Validators.required],
            prg_leyau: [item.prg_leyau != null ? Number(item.prg_leyau) : null, Validators.required],

            prg_vptmin: [item.prg_vptmin != null ? Number(item.prg_vptmin) : null, Validators.required],
            prg_vptdil: [item.prg_vptdil],
            cod_metexp: [item.cod_metexp || '', Validators.required],
            num_buzamiento: [item.num_buzamiento, Validators.required],
            prg_homlab: [item.prg_homlab, Validators.required],
            val_vtp: [item.val_vpt],
            ind_verificacion: [item.ind_verificacion ? null : 0],
            isNew: [item.isNew ?? false]
        });
    }

    private inicializarSubscripcionesFila(grupo: FormGroup): void {
        grupo.get('prg_tmsmin')?.valueChanges.subscribe(valor => {
            grupo.get('tms_total')?.setValue(valor, { emitEvent: false });
        });

        grupo.get('cod_metexp')?.valueChanges.subscribe(valor => {
            this.validarMetodo(valor, grupo);
        });

        grupo.get('prg_vptdil')?.valueChanges.subscribe(() => {
            this.calcularRentabilidad();
        });
    }

    private aplicarValoresIniciales(grupo: FormGroup): void {
        const codMetexp = grupo.get('cod_metexp')?.value;
        const tmsmin = grupo.get('prg_tmsmin')?.value;

        if (codMetexp) this.validarMetodo(codMetexp, grupo);
        if (tmsmin) grupo.get('tms_total')?.setValue(tmsmin, { emitEvent: false });

        this.calcularRentabilidad();
    }

    // ================================
    // MODALES — abrir / cerrar
    // ================================

    closeModalBlock(): void {
        this.showModalBlock = false;
        this.selectedIndexBlock = null;
    }
    openModalBlock(index: number): void {
        this.selectedIndexBlock = index;
        const programa = this.listaEdicionPrograma()[index];
        this.selectedPrograma.set(programa);

        this.showModalBlock = true;

    }

    openModalReserva(index: number): void {
        this.selectedIndexReserva = index;
        const programa = this.listaEdicionPrograma()[index];
        this.selectedPrograma.set(programa);
        this.cod_labor.set(programa?.cod_labor || '');
        this.cod_tipo_labor.set(programa?.cod_tipo_labor || '');
        this.showModalReserva = true;
    }

    closeModalReserva(): void {
        this.showModalReserva = false;
        this.selectedIndexReserva = null;
    }

    openModalPlano(index: number): void {
        this.selectedIndexPlano = index;
        this.showModalPlano = true;
    }

    closeModalPlano(): void {
        this.showModalPlano = false;
        this.selectedIndexPlano = null;
    }

    // ================================
    // EVENTOS DE MODALES
    // ================================
    recibirBlocks(_evento: any): void {
        // TODO: implementar lógica de blocks

        console.log("los datos en bloques reservas es " + _evento);
    }

    recibirEvaluacion(evento: any): void {
        if (this.selectedIndexReserva === null) return;

        const data = evento[0];
        const index = this.selectedIndexReserva;
        const fila = this.labores.at(index) as FormGroup;
        const campos: (keyof typeof data)[] = ['prg_leycu', 'prg_leyau', 'prg_leyag'];

        // Habilita → patchValue → deshabilita si modo 'ver'
        // queueMicrotask ejecuta fuera del ciclo de CD actual → evita NG0100
        queueMicrotask(() => {
            campos.forEach((c: any) => fila.get(c)?.enable({ emitEvent: false }));

            fila.patchValue({
                prg_leycu: Number(Number(data.prg_leycu).toFixed(2)),
                prg_leyau: Number(Number(data.prg_leyau).toFixed(2)),
                prg_leyag: Number(Number(data.prg_leyag).toFixed(2)),
            }, { emitEvent: false });

            if (this.modo() === 'ver') {
                campos.forEach((c: any) => fila.get(c)?.disable({ emitEvent: false }));
            }

            this.cdr.detectChanges();
        });
    }

    recibirLabor(labor: LaborAvance): void {
        if (this.labores.length === 0) this.onAgregarFila();

        // Deshabilitar campos de identificación en todas las filas
        this.labores.controls.forEach((ctrl: any) => {
            ['cod_veta', 'cod_nivel', 'cod_tipo_labor', 'cod_labor']
                .forEach(c => ctrl.get(c)?.disable());
        });

        const fila = this.labores.at(this.labores.length - 1);
        fila.patchValue({
            cod_veta: labor.cod_nom_veta,
            nom_veta: labor.nom_veta,
            cod_nivel: labor.cod_nivel,
            cod_tipo_labor: labor.cod_tipo_labor,
            cod_labor: labor.cod_labor
        });

        this.laboresEvaluacionBloque.set(fila);
    }

    // ================================
    // ACCIONES DE TABLA
    // ================================
    public onAgregarFila(): void {
        this.botonAccionService.setBloqueos({
            guardar: true, copiar: true, resumen: true,
            exportar: true, cerrar: false, labores: false
        });
        this.filaCopiadaEfecto.set(null);


        const nuevaFila = this.crearLaborFormGroup({ isNew: true } as ProgramaExplotacion);
        nuevaFila.enable({ emitEvent: false });

        this.labores.push(nuevaFila);
        this.inicializarSubscripcionesFila(nuevaFila);

        this.aplicarValoresIniciales(nuevaFila);

        this.botonAccionService.setBloqueos({ guardar: false, labores: false });
        setTimeout(() => {
            this.restaurarErrores();
        });

    }

    //RESTAURAR ERRORES EN LOS INPUTS
    private restaurarErrores(): void {

        const fase = this.codigo_fase();

        if (!fase) return;

        const indices = this.programaState.obtenerErroresFase(fase);

        indices.forEach(index => {

            const fila = this.labores.at(index) as FormGroup;

            if (fila) {

                Object.keys(fila.controls).forEach(key => {

                    const control = fila.get(key);

                    control?.markAsTouched();

                    control?.markAsDirty();

                    control?.updateValueAndValidity();

                });

            }

        });

    }

    copiarLabor(index: number): void {
        this.botonAccionService.setBloqueos({
            guardar: true, copiar: false, resumen: true,
            exportar: true, cerrar: false, labores: true
        });

        this.selecionarIndice.set(index);
        this.filaCopiadaEfecto.set(index);

        setTimeout(() => {
            if (this.filaCopiadaEfecto() === index) {
                this.filaCopiadaEfecto.set(null);
            }
        }, 600);

        const data = this.labores.at(index).getRawValue();
        const programa = this.programaState.programa().nro_prog;

        const payload: CopiarLabor = {
            ...data,
            cod_ala: data.cod_ala?.trim() || 'N',
            nro_prog: programa,
            cod_fase: this.codigo_fase()
        };

        this.botonAccionService.setLaborCopiada(payload);
    }

    eliminarFila(index: number, item: ProgramaExplotacion): void {
        const programa = this.programaState.programa();

        // Fila nueva — solo existe en el form, no en BD
        if (item.isNew || !item.cod_labor) {
            this.labores.removeAt(index);
            this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });

            if (this.labores.length === 0) {
                this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });
            }
            return;
        }

        // Fila aprobada — no se puede eliminar
        if (item.prg_est === 'B' && item.prg_progra === 'S') {
            this.formUtils.mensajeEliminarLabor(
                'Eliminación de Labor Aprobado',
                'No se puede eliminar una labor de un programa aprobado'
            );
            return;
        }

        // Fila existente en BD — confirmar antes de eliminar
        this.formUtils.confirmarEliminacionPlanos(
            'Eliminación de Detalle Programa', '',
            `¿Desea eliminar la labor <b>${item.cod_labor}</b> con el Nro. de programa <b>${programa.nro_prog}</b>?.`
        ).then(result => {
            if (!result.isConfirmed) {
                this.formUtils.alertaErrorAnulacion('Eliminación de Registro', 'Se canceló la eliminación');
                return;
            }

            this.programaState.eliminarDetalleMensual({
                nro_prog: programa.nro_prog,
                cod_labor: item.cod_labor,
                cod_fase: this.codigo_fase()
            }).subscribe({
                next: (resp: ResponsDetprg) => {
                    if (resp.estado === 1) {
                        this.formUtils.alertaExitoAnulacion('Éxito en la eliminación', resp.mensaje);
                        this.edicionProgramaMensual();
                        this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });

                    } else {
                        this.formUtils.mensajeEliminarLabor('Error de Eliminación', resp.mensaje);
                    }
                },
                error: (err) => alert(err.error?.mensaje || 'Error al eliminar')
            });
        });
    }

    // ================================
    // CÁLCULOS
    // ================================
    validarMetodo(valor: string, grupo: FormGroup): void {
        const factor = valor === 'SLS' ? '25.00' : '55.00';
        grupo.get('num_factor_x')?.setValue(factor, { emitEvent: false });
    }

    calcularRentabilidad(): void {
        const cutoff = this.cutoff();
        this.labores.controls.forEach(control => {
            const grupo = control as FormGroup;
            const vptdil = Number(grupo.get('prg_vptdil')?.value) || 0;
            const resultado = vptdil - cutoff;
            grupo.get('prg_cutoff')?.setValue(
                resultado.toString(),
                { emitEvent: false, onlySelf: true }
            );
        });
    }

    private recalcularTotales(): void {
        this._totalProduccion.set(this.calcTotalProduccion());
        this._totalPrgAvamts.set(this.calcTotalPrgAvamts());
        this._totalTmsDes.set(this.calcTotalTmsDes());
        this._totalTmsMin.set(this.calcTotalTmsMin());
        this._totalTmsToal.set(this.calcTotalTmsToal());
        this._promedioLeyAg.set(this.calcPromedioPonderado('prg_leyag'));
        this._promedioLeyCu.set(this.calcPromedioPonderado('prg_leycu'));
        this._promedioLeyPb.set(this.calcPromedioPonderado('prg_leypb'));
        this._promedioLeyZn.set(this.calcPromedioPonderado('prg_leyzn'));
        this._promedioLeyAu.set(this.calcPromedioPonderado('prg_leyau'));
        this._promedioVptMin.set(this.calcPromedioVptMin());
    }

    private calcTotalProduccion(): number {
        return this.labores.controls
            .filter(c => c.value.prg_progra === 'S').length;
    }

    private calcTotalPrgAvamts(): number {
        return this.labores.value
            .reduce((acc: number, item: any) => acc + (Number(item.prg_avamts) || 0), 0);
    }

    private calcTotalTmsDes(): number {
        return this.labores.controls
            .reduce((acc, c) => acc + (Number(c.value.prg_tmsdes) || 0), 0);
    }

    private calcTotalTmsMin(): number {
        return this.labores.controls
            .reduce((acc, c) => acc + (Number(c.value.prg_tmsmin) || 0), 0);
    }

    private calcTotalTmsToal(): number {
        return this.labores.controls
            .reduce((acc, c) => acc + (Number(c.value.tms_total) || 0), 0);
    }

    // Promedio ponderado genérico por prg_tmsextraid
    private calcPromedioPonderado(campo: string): number {
        let suma = 0, totalPeso = 0;
        this.labores.controls.forEach(c => {
            const peso = Number(c.value.prg_tmsextraid) || 0;
            totalPeso += peso;
            suma += (Number(c.value[campo]) || 0) * peso;
        });
        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private calcPromedioVptMin(): number {
        let suma = 0, totalPeso = 0, totalArea = 0;
        this.labores.controls.forEach(c => {
            const peso = Number(c.value.prg_tmsextraid) || 0;
            const area = Number(c.value.area) || 0;
            totalArea += area;
            totalPeso += peso;
            suma += (Number(c.value.prg_vptmin) || 0) * peso;
        });
        return totalArea > 0 && totalPeso > 0 ? suma / totalPeso : 0;
    }

    // ================================
    // MODO
    // ================================
    private aplicarModo(): void {
        const modo = this.modo();

        if (modo === 'nuevo') {
            const fase = this.codigo_fase();
            if (fase && this.programaState.obtenerDatosFase(fase)) return;

            this.programaForm.enable();
            this.programaForm.reset();
            this.labores.clear();
            this.listaEdicionPrograma.set([]);
            this.programaState.setProgramaTabla(null);
            this.botonAccionService.filasIncompletas.set([]);
        } else if (modo === 'ver') {
            this.labores.controls.forEach((grupo: any) => {

                const raw = grupo.getRawValue();

                if (raw.isNew === true) {
                    grupo.enable({ emitEvent: false });
                } else {
                    grupo.disable({ emitEvent: false });
                }

            });
        }
    }

    // ================================
    // PERSISTENCIA
    // ================================
    // private persistirDatosFase(): void {
    //     const fase = this.codigo_fase();
    //     if (!fase || this.labores.length === 0) return;

    //     const datos = this.modo() === 'ver'
    //         ? this.labores.getRawValue().filter((f: any) => f.isNew === true)
    //         : this.labores.getRawValue();

    //     if (datos.length > 0) {
    //         this.programaState.guardarDatosFase(fase, datos);
    //     }
    // }
    private persistirDatosFase(): void {

        const fase = this.codigo_fase();

        if (!fase || this.labores.length === 0) return;

        const datos = this.labores.getRawValue();

        this.programaState.guardarDatosFase(fase, datos);
    }

    // ================================
    // GUARDAR
    // ================================
    private obtenerConfiguracion() {
        const cabecera = this.programaForm.get('programas')?.value;
        const programa = this.programaState.programa();
        return {
            codFase: cabecera?.cod_fase,
            codZona: cabecera?.cod_zona,
            cie_ano: programa.cie_ano,
            cie_per: programa.cie_per
        };
    }

    // Llamado desde el servicio de botones (sin effect para evitar NG0100)
    onGuardar(): void {
        const accion = this.botonAccionService.accionActual();
        if (accion !== 'Guardar') return;

        if (this.programaForm.invalid) {
            this.programaForm.markAllAsTouched();
            this.botonAccionService.accionActual.set('');
            return;
        }

        const data = this.programaForm.getRawValue();
        this.programaState.setCabecera(data);
        this.programaState.formDirty.set(false);
        this.botonAccionService.accionActual.set('');
    }
}