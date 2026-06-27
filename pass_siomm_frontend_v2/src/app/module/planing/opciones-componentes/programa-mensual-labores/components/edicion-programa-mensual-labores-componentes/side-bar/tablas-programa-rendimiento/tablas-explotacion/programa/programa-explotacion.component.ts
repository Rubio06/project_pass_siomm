import { CommonModule, DecimalPipe } from '@angular/common';
import { CopiarLabor, LaborAvance, ResponsDetprg, Sostenimiento, TaladrosLargos, valOperativo } from '../../../../../../interface/edicion-programa-mensual.interface';
import { Component, inject, signal, ChangeDetectorRef, output, computed, effect, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ala, CodCta, CodCto, ProgramaExplotacion } from '../../../../../../interface/edicion-programa-mensual.interface';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { BotonAccionService, EdicionProgrmaMensualService } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/services';

import { ActivatedRoute } from '@angular/router';

import { PlanosExplotacionComponent } from './modals/planos/planos.component';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { UtilidadesExplotacionPrograma } from './utilidades-programa';
import { FormUtils } from 'src/app/utils/form-utils';
import { ModalListaAvanceComponent } from '../../../../modal-lista-avance/modal-lista-avance.component';
import { EvaluacionBloqueExplotacionComponent } from './modals/evaluacion-bloque/evaluacion-bloque.component';
import { BlockReservaExplotacionComponent } from './modals/block-reservas/block-reservas.component';

@Component({
    selector: 'app-explotacion-programa',
    imports: [ModalListaAvanceComponent, ReactiveFormsModule, BlockReservaExplotacionComponent, EvaluacionBloqueExplotacionComponent, PlanosExplotacionComponent, CommonModule],

    templateUrl: './programa-explotacion.component.html',
    styleUrls: ['./programa-explotacion.component.css']
})
export class ProgramaExplotacionComponent implements OnDestroy {
    private formSub?: Subscription;

    // ================================
    // INYECCIONES
    // ================================
    private route = inject(ActivatedRoute);
    private programaState = inject(EdicionProgrmaMensualService);
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);
    public botonAccionService = inject(BotonAccionService);
    utilidades = inject(UtilidadesExplotacionPrograma);
    formUtils = FormUtils;

    // ================================
    // MODO
    // ================================
    modo = signal<'nuevo' | 'ver' | 'editar' | null>(null);

    // ================================
    // ESTADO DE CARGA
    // ================================
    isLoading = signal(false);

    // ================================
    // DATOS
    // ================================
    codigo_fase = signal<string | null>(null);
    cie_anio = signal<string | null>(null);
    cod_labor = signal('');
    cod_tipo_labor = signal('');
    listaEdicionPrograma = signal<ProgramaExplotacion[]>([]);
    listMetExplotacion = signal<any[]>([]);

    listAsociaLabor = signal([
        { ind_taladro_largo: 'N', aso_labor: 'Si' },
        { ind_taladro_largo: 'S', aso_labor: 'No' }
    ]);


    // taladroLargos = signal([
    //     { ind_taladro_largo: 'N', nom_taladro: 'Si' },
    //     { ind_taladro_largo: 'S', nom_taladro: 'No' }
    // ]);

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

    // ================================
    // CONTROL INTERNO
    // ================================
    selecionarIndice = signal<number | null>(null);
    laboresEvaluacionBloque = signal<AbstractControl | null>(null);
    cutoff = computed(() => this.programaState.prgCutoff());

    showModal = false;

    selectedPrograma = signal<ProgramaExplotacion | null>(null);


    //VARIABLES PARA LAS FORMULAS

    _totalProduccion = signal<number>(0);
    _blocksEconomicos = signal<number>(0);
    _blocksNoEconomicos = signal<number>(0);
    _totalPrgAvamts = signal<number>(0);

    _totalVetaDilucion = signal<number>(0);
    _totalVetaDilucionEcono = signal<number>(0);
    _totalVetaDilucionNoEcono = signal<number>(0);


    _totalVeta = signal<number>(0);
    _totalVetaEcono = signal<number>(0);
    _totalVetaNoEcono = signal<number>(0);

    _totalDilucion = signal<number>(0);
    _totalDilucionEcono = signal<number>(0);
    _totalDilucionNoEcono = signal<number>(0);

    _sumaLoncorRotas = signal<number>(0);
    _sumaLoncorEconomicos = signal<number>(0);
    _sumaLoncorNoEconomicos = signal<number>(0);

    _promedioAltcor = signal<number>(0);
    _promedioAltcorEconomico = signal<number>(0);
    _promedioAltcorNoEconomico = signal<number>(0);


    _sumaTmsRotVet = signal<number>(0);
    _sumaTmsRotVetEconomicos = signal<number>(0);
    _sumaTmsRotVetNoEconomicos = signal<number>(0);


    _sumaTmsRotDil = signal<number>(0);
    _sumaTmsRotDilEconomicos = signal<number>(0);
    _sumaTmsRotDilNoEconomicos = signal<number>(0);

    _sumaTmsExtraId = signal<number>(0);
    _sumaTmsExtraIdEconomicos = signal<number>(0);
    _sumaTmsExtraIdNoEconomicos = signal<number>(0);

    _promedioLeyAg = signal<number>(0);
    _promedioLeyAgGeo = signal<number>(0);
    _promedioLeyAgNoEconomicoGeo = signal<number>(0);

    _promedioLeyCu = signal<number>(0);
    _promedioLeyCuEconomicoGeo = signal<number>(0);
    _promedioLeyCuNoEconomicoGeo = signal<number>(0);

    _promedioLeyPb = signal<number>(0);
    _promedioLeyPbEconomicoGeo = signal<number>(0);
    _promedioLeyPbNoEconomicoGeo = signal<number>(0);

    _promedioLeyZn = signal<number>(0);
    _promedioLeyZnEconomicoGeo = signal<number>(0);
    _romedioLeyZnNoEconomicoGeo = signal<number>(0);

    _promedioLeyAu = signal<number>(0);
    _promedioLeyAuEconomicoGeo = signal<number>(0);
    _promedioLeyAuNoEconomicoGeo = signal<number>(0);

    _promedioVptMin = signal<number>(0);
    _promedioVptMinEconomicoGeo = signal<number>(0);
    _promedioVptMinNoEconomicoGeo = signal<number>(0);

    _promedioLeyAgDil = signal<number>(0);
    _promedioLeyAgDilEconomicoMin = signal<number>(0);
    _promedioLeyAgDilNoEconomicoMin = signal<number>(0);

    _promedioLeyCuDil = signal<number>(0);
    _promedioLeyCuDilEconomicoMin = signal<number>(0);
    _promedioLeyCuDilNoEconomicoMin = signal<number>(0);

    _promedioLeyPbDil = signal<number>(0);
    _promedioLeyPbDilEconomicoMin = signal<number>(0);
    _promedioLeyPbDilNoEconomicoMin = signal<number>(0);

    _promedioLeyZnDil = signal<number>(0);
    _promedioLeyZnDilEconomicoMin = signal<number>(0);
    _promedioLeyZnDilNoEconomicoMin = signal<number>(0);

    _promedioLeyAuDil = signal<number>(0);
    _promedioLeyAuDilEconomicoMin = signal<number>(0);
    _promedioLeyAuDilNoEconomicoMin = signal<number>(0);

    _promedioVptDil = signal<number>(0);
    _promedioVptDilEconomicoMin = signal<number>(0);
    _promedioVptDilNoEconomicoMin = signal<number>(0);


    constructor() {
        effect(() => {
            this.calcularRentabilidad();
        })

        effect(() => {
            const recargar = this.programaState.recargar();
            console.log("Entrnado a programa explotacion ")
            if (recargar > 0) {
                this.edicionProgramaMensual(); // 🔥 recarga la data
            }
        });
    }

    ngOnInit(): void {
        this.inicializarDatos();
        this.escucharRuta();


        const modo = this.programaState.modo();
        this.modo.set(modo);
        this.aplicarModo();

        // Escuchar cambios de modo
        this.loadSelectExploracion();
        this.registrarAccionGuardar();

        // this.programaForm.valueChanges.subscribe(value => {
        //     this.onSubmit();
        // });

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
        const fase = this.codigo_fase();
        if (fase && this.labores.length > 0) {
            const datos = this.modo() === 'ver'
                ? this.labores.getRawValue().filter((f: any) => f.isNew === true)
                : this.labores.getRawValue();
            if (datos.length > 0) {
                this.programaState.guardarDatosFase(fase, datos);
            }
        }
        this.programaState.formDirty.set(false);
    }

    loadSelectExploracion() {
        this.planingService.SelectExploracion().subscribe({
            next: (data) => this.listMetExplotacion.set(data),
            error: (e) => console.error('Error cargando métodos de exploración', e)
        });
    }

    //CALCULANDO RENTABILIDAD
    public calcularRentabilidad() {

        const cutoff = this.cutoff();

        this.labores.controls.forEach(control => {
            const grupo = control as FormGroup;
            const vptdil = Number(grupo.get('prg_vptdil')?.value) || 0;
            const resultado = vptdil - cutoff;
            grupo.get('prg_cutoff')?.setValue(resultado.toString(), { emitEvent: false });
        });
    }

    private registrarAccionGuardar(): void {
        // effect(() => {
        const accion = this.botonAccionService.accionActual();
        if (accion === 'Guardar') {
            this.enviarDataProgramaAlServicio();
            this.botonAccionService.accionActual.set('');
        }
        // });
    }

    private enviarDataProgramaAlServicio(): void {
        if (this.programaForm.invalid) {
            this.programaForm.markAllAsTouched();
            console.warn('programaForm inválido: no se envía data al servicio');
            return;
        }

        const data = this.programaForm.getRawValue();
        this.programaState.setCabecera(data);
        this.programaState.formDirty.set(false);
        console.log('Data de programa capturada y guardada en servicio:', data);
    }

    // ================================
    // INICIALIZACIÓN
    // ================================
    private inicializarDatos() {
        const datos = this.programaState.programa();
        this.cie_anio.set(datos.cie_ano);
    }



    private escucharRuta() {
        this.route.params.subscribe(params => {
            const cod = params['codigo_fase'];
            const nroProg = params['nro_prog'];

            if (nroProg === 'nuevo') {
                this.programaState.setModo('nuevo');
            }

            this.codigo_fase.set(cod);

            this.loadAllData();
            this.edicionProgramaMensual();
            // this.aplicarModo();
        });
    }

    // private escucharModo() {
    //     this.route.queryParams.subscribe(params => {
    //         const modo = params['modo'];
    //         this.modoActual.set(modo);

    //         modo === 'nuevo'
    //             ? this.habilitarCampos()
    //             : this.deshabilitarCampos();
    //     });
    // }

    // ================================
    // FORM CONTROL
    // ================================


    // ================================
    // CONFIGURACIÓN
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

    // ================================
    // CARGA DE DATOS
    // ================================
    private async loadAllData(): Promise<void> {
        this.isLoading.set(true);

        try {
            const config = this.obtenerConfiguracion();

            const prefijoBusqueda =
                await this.utilidades.construirPrefijoBusqueda(config);

            await this.utilidades.cargarListas(config, prefijoBusqueda);

            this.edicionProgramaMensual();
        } catch (error) {
            console.error(error);
        }

        this.isLoading.set(false);
    }

    // ================================
    // CARGAR EDICIÓN
    // ================================



    // ================================
    // FORM GROUP
    // ================================
    crearLaborFormGroup(item: ProgramaExplotacion): FormGroup {
        const grupo: FormGroup = this.fb.group({
            cod_veta: [item?.cod_veta || '', Validators.required],
            cod_nom_veta: [item?.cod_nom_veta || ''],
            nom_veta: [item?.nom_veta || ''],
            cod_nivel: [item?.cod_nivel || '', Validators.required],
            cod_tipo_labor: [item?.cod_tipo_labor, Validators.required],
            cod_labor: [item?.cod_labor || '', Validators.required],

            // ✅ validados en el HTML
            cod_ala: [item.cod_ala, Validators.required],
            cod_cto: [item.cod_cto || ''],
            cod_cta: [item.cod_cta || ''],
            prg_blocks: [item.prg_blocks || '', [Validators.required, Validators.pattern(/\S/)]],
            ind_clasificacion_sos: [item.ind_clasificacion_sos, Validators.required],


            ind_tip_roca_piso: [item.ind_tip_roca_piso, Validators.required],
            ind_tip_roca: [item.ind_tip_roca, Validators.required],
            ind_tip_roca_techo: [item.ind_tip_roca_techo, Validators.required],
            prg_avamts: [item.prg_avamts, Validators.required],
            prg_secancho: [item.prg_secancho, Validators.required],
            prg_secaltu: [item.prg_secaltu, Validators.required],
            prg_tmsdes: [item.prg_tmsdes, Validators.required],
            prg_tmsmin: [item.prg_tmsmin, Validators.required],
            tms_total: [{ value: '', disabled: true }],
            prg_ancmin: [item.prg_ancmin],

            prg_ancvet: [item.prg_ancvet],
            // prg_ancdil: ['', Validators.required],
            prg_tramin: [item.prg_tramin],
            prg_num_tramin: [item.prg_num_tramin],
            prg_tramin_prog: [item.prg_tramin_prog],
            prg_num_tramin_prog: [item.prg_num_tramin_prog],
            prg_loncor: [item.prg_loncor],
            prg_altcor: [item.prg_altcor],
            prg_tmsrotvet: [item.prg_tmsrotvet],
            prg_tmsrotdil: [item.prg_tmsrotdil],
            prg_tmsextraid: [item.prg_tmsextraid],
            //p_bloques

            num_corte: [item.num_corte],
            val_tipo_fac: [item.val_tipo_fac, Validators.required],
            prg_fecmuestreo: [item.prg_fecmuestreo, Validators.required],
            prg_leyag: [item.prg_leyag, Validators.required],
            prg_leycu: [item.prg_leycu, Validators.required],
            prg_leypb: [item.prg_leypb, Validators.required],
            prg_leyzn: [item.prg_leyzn, Validators.required],
            prg_leyau: [item.prg_leyau, Validators.required],
            prg_vptmin: [item.prg_vptmin, Validators.required],

            prg_leyagdil: [item.prg_leyagdil],
            prg_leycudil: [item.prg_leycudil],
            prg_leypbdil: [item.prg_leypbdil],
            prg_leyzndil: [item.prg_leyzndil],
            prg_leyaudil: [item.prg_leyaudil],
            prg_vptdil: [item.prg_vptdil],
            prg_ancmin_leyes: [item.prg_ancmin_leyes],
            dif_cutoff: [''],

            cod_metexp: [item.cod_metexp || '', Validators.required],
            num_factor_x: [{ value: '', disabled: true }],
            num_buzamiento: [item.num_buzamiento, Validators.required],
            ind_taladro_largo: [item.ind_taladro_largo],
            prg_homlab: [item.prg_homlab, Validators.required],
            // des_proyecto: [item.des_proyecto],
            // nom_proyecto: [item.nom_proyecto],
            ind_verificacion: item.ind_verificacion ? null : 0,
            //as_add // PLANOS





            prg_progra: [item.prg_progra],

            // ✅ validados en el HTML

            prg_est: [item.prg_est],
            // sin validación en el HTML



            // ❌ disabled - sin validación
            prg_cutoff: [{ value: '', disabled: true }],
            val_vtp: [item.val_vpt],
            isNew: [item.isNew ?? false]
        });

        // grupo.get('prg_tmsmin')?.valueChanges.subscribe(valor => {
        //     grupo.get('tms_total')?.setValue(valor, { emitEvent: false });
        // });

        // grupo.get('cod_metexp')?.valueChanges.subscribe(valor => {
        //     this.validarMetodo(valor, grupo);
        // });
        return grupo;
    }

    inicializarSubscripcionesFila(grupo: FormGroup) {

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

    aplicarValoresIniciales(grupo: FormGroup) {
        const codMetexp = grupo.get('cod_metexp')?.value;
        const tmsmin = grupo.get('prg_tmsmin')?.value;

        if (codMetexp) {
            this.validarMetodo(codMetexp, grupo);
        }

        if (tmsmin) {
            grupo.get('tms_total')?.setValue(tmsmin, { emitEvent: false });
        }

        // cálculo global
        this.calcularRentabilidad();
    }


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


    validarMetodo(valor: string, grupo: FormGroup) {
        const factor = valor === 'SLS' ? "25.00" : "55.00";
        grupo.get('num_factor_x')?.setValue(factor, { emitEvent: false });
    }

    // ================================
    // MODALES
    // ================================
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

    closeModalBlock() {
        this.showModalBlock = false;
        this.selectedIndexBlock = null;
    }


    closeModalReserva() {
        this.showModalReserva = false;
        this.selectedIndexReserva = null;
    }

    openModalPlano(index: number) {
        this.selectedIndexPlano = index;


        // const programa = this.listaEdicionPrograma()[index];

        // console.log("programa seleccionado para plano en el padre: " + JSON.stringify(programa, null, 2));
        // this.cod_labor.set(programa?.cod_labor || '');
        // this.cod_tipo_labor.set(programa?.cod_tipo_labor || '');

        const cabecera = this.programaForm.get('programas')?.value;

        // codFase: cabecera?.cod_fase

        console.log("cabecera en el padre: " + JSON.stringify(cabecera, null, 2));

        this.showModalPlano = true;
    }

    closeModalPlano() {
        this.showModalPlano = false;
        this.selectedIndexPlano = null;
    }


    // ================================
    // EVENTOS
    // ================================
    recibirBlocks(evento: object) {
        console.log("el block es " + evento);
    }

    recibirEvaluacion(evento: object) {

        console.log("evaluacion bloque es " + evento);
    }

    elminarFila(index: number, item: ProgramaExplotacion) {

        const programa = this.programaState.programa();

        if (item.isNew || !item.cod_labor) {
            this.labores.removeAt(index);
            this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });

            // Si la tabla queda vacía, bloqueamos el botón guardar
            if (this.labores.length === 0) {
                this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });
            }
            return; // Terminamos aquí, no hace falta llamar al servidor
        }

        if (item.prg_est === 'B' && item.prg_progra == 'S') {
            this.formUtils.mensajeEliminarLabor('Eliminación de Labor Aprobado', 'No se puede eliminar una labor de un programa aprobado');
            return;
        }

        this.formUtils.confirmarEliminacionPlanos(
            'Eliminación de Detalle Programa',
            '',
            `¿Desea eliminar la labor <b>${item.cod_labor}</b> con el Nro. de programa <b>${programa.nro_prog}</b>?.`
        ).then(result => {
            if (!result.isConfirmed) {
                this.formUtils.alertaErrorAnulacion("Eliminacion de Registro", "Se cancelo la eliminación");
                return;
            }
            const dto = {
                nro_prog: programa.nro_prog,
                cod_labor: item.cod_labor,
                cod_fase: this.codigo_fase()
            };

            this.programaState.eliminarDetalleMensual(dto).subscribe({
                next: (resp: ResponsDetprg) => {
                    if (resp.estado === 1) {

                        this.formUtils.alertaExitoAnulacion("Exito en la eliminación", resp.mensaje);
                        // this.labores.removeAt(index)
                        this.edicionProgramaMensual();
                        this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });

                    }
                    // alert('Labor eliminada correctamente');

                    this.formUtils.mensajeEliminarLabor('Error de Eliminación', resp.mensaje);
                },
                error: (err) => alert(err.error?.mensaje || 'Error al eliminar')
            });
        })
    }



    private aplicarModo(): void {
        if (this.modo() === 'nuevo') {
            // Si hay datos persistidos ya restaurados, no limpiar
            const fase = this.codigo_fase();
            if (fase && this.programaState.obtenerDatosFase(fase)) return;

            this.programaForm.enable();
            this.programaForm.reset();
            this.labores.clear();
            this.listaEdicionPrograma.set([]);
            this.obtenerConfiguracion();
            this.programaState.setProgramaTabla(null);
            const labores = this.programaForm.get('labores') as FormArray;
            while (labores.length !== 0) {
                labores.removeAt(0);
                this.botonAccionService.filasIncompletas.set([])
            }
        } else if (this.modo() === 'ver') {
            this.programaForm.disable();
        }
    }

    //MOSTRAR DATOS EN EL FORMULARIO
    recibirLabor(labor: LaborAvance) {
        // if (this.modo() !== 'nuevo') return;

        // Si no hay filas, crear una
        if (this.labores.length === 0) {

            this.onAgregarFila();
        }

        this.labores.controls.forEach((labor: any) => {
            labor.get('cod_veta')?.disable();
            labor.get('cod_nivel')?.disable();
            labor.get('cod_tipo_labor')?.disable();
            labor.get('cod_labor')?.disable();
        });

        // Obtener la última fila
        const fila = this.labores.at(this.labores.length - 1);

        // Parchar los datos en ESA fila
        fila.patchValue({
            cod_veta: labor.cod_nom_veta,
            // cod_nom_veta: labor.cod_nom_veta,
            nom_veta: labor.nom_veta,
            cod_nivel: labor.cod_nivel,
            cod_tipo_labor: labor.cod_tipo_labor,
            cod_labor: labor.cod_labor
        });

        this.laboresEvaluacionBloque.set(fila);

    }

    filaCopiadaEfecto = signal<number | null>(null);

    copiarLabor(index: number) {
        this.botonAccionService.setBloqueos({
            guardar: true, copiar: false, resumen: true,
            exportar: true, cerrar: false, labores: true
        });
        
        const fila = this.labores.at(index);
        this.selecionarIndice.set(index);

        // 1. Efecto visual: Marcamos la fila como "copiada"
        this.filaCopiadaEfecto.set(index);

        // 2. Quitamos el efecto tras 600ms para que parezca un "flash"
        setTimeout(() => {
            if (this.filaCopiadaEfecto() === index) {
                this.filaCopiadaEfecto.set(null);
            }
        }, 600);

        // --- Tu lógica original ---
        const data = fila.getRawValue();
        const programa = this.programaState.programa().nro_prog;

        const payload: CopiarLabor = {
            ...data,
            cod_ala: data.cod_ala?.trim() || "N",
            nro_prog: programa,
            cod_fase: this.codigo_fase()
        };

        this.botonAccionService.setLaborCopiada(payload);
        // --------------------------
    }


    //FORMULAS
    //FORMULAS

    // _contarVtpMayor = signal<number>(0)
    private edicionProgramaMensual(): void {
        const nroProg = this.programaState.programa().nro_prog;
        const fase = this.codigo_fase()!;

        // Restaurar datos guardados si existen (persistencia entre fases)
        const datosPersistidos = this.programaState.obtenerDatosFase(fase);
        if (datosPersistidos && datosPersistidos.length > 0) {
            this.labores.clear();
            this.listaEdicionPrograma.set(datosPersistidos as ProgramaExplotacion[]);
            datosPersistidos.forEach(item =>
                this.labores.push(this.crearLaborFormGroup(item as ProgramaExplotacion))
            );
            this.recalcularTotales();
            this.aplicarModo();
            return;
        }

        if (!nroProg) return;

        this.isLoading.set(true);

        this.programaState
            .edicionProgramaMensual(nroProg, this.codigo_fase()!)
            .subscribe({
                next: (edicion: ProgramaExplotacion[]) => {

                    this.labores.clear();
                    this.listaEdicionPrograma.set(edicion);

                    edicion.forEach(item =>
                        this.labores.push(this.crearLaborFormGroup(item))
                    );
                    this._totalProduccion.set(this.totalProduccion());
                    this._blocksEconomicos.set(this.blocksEconomicos());
                    this._blocksNoEconomicos.set(this.blocksNoEconomicos());
                    this._totalPrgAvamts.set(this.totalPrgAvamts());


                    this._totalVetaDilucion.set(this.totalVetaDilucion());
                    this._totalVetaDilucionEcono.set(this.totalVetaDilucionEcono());
                    this._totalVetaNoEcono.set(this.totalVetaDilucionNoEcono());


                    this._totalVeta.set(this.totalVeta());
                    this._totalVetaEcono.set(this.totalVetaEcono());
                    this._totalPrgAvamts.set(this.totalPrgAvamts());


                    this._totalDilucion.set(this.totalDilucion());
                    this._totalDilucionEcono.set(this.totalDilucionEcono());
                    this._totalDilucionNoEcono.set(this.totalDilucionNoEcono());

                    this._sumaLoncorRotas.set(this.sumaLoncorRotas());
                    this._sumaLoncorEconomicos.set(this.sumaLoncorEconomicos());
                    this._sumaLoncorNoEconomicos.set(this.sumaLoncorNoEconomicos());


                    this._promedioAltcor.set(this.promedioAltcor());
                    this._promedioAltcorEconomico.set(this.promedioAltcorEconomico());
                    this._promedioAltcorNoEconomico.set(this.promedioAltcorNoEconomico());

                    this._sumaTmsRotVet.set(this.sumaTmsRotVet());
                    this._sumaTmsRotVetEconomicos.set(this.sumaTmsRotVetEconomicos());
                    this._sumaTmsRotVetNoEconomicos.set(this.sumaTmsRotVetNoEconomicos());


                    this._sumaTmsRotDil.set(this.sumaTmsRotDil());
                    this._sumaTmsRotDilEconomicos.set(this.sumaTmsRotDilEconomicos());
                    this._sumaTmsRotDilNoEconomicos.set(this.sumaTmsRotDilNoEconomicos());


                    this._sumaTmsExtraId.set(this.sumaTmsExtraId());
                    this._sumaTmsExtraIdEconomicos.set(this.sumaTmsExtraIdEconomicos());
                    this._sumaTmsExtraIdNoEconomicos.set(this.sumaTmsExtraIdNoEconomicos());

                    this._promedioLeyAg.set(this.promedioLeyAg());
                    this._promedioLeyAgGeo.set(this.promedioLeyAgGeo());
                    this._promedioLeyAgNoEconomicoGeo.set(this.promedioLeyAgNoEconomicoGeo());


                    this._promedioLeyCu.set(this.promedioLeyCu());
                    this._promedioLeyCuEconomicoGeo.set(this.promedioLeyCuEconomicoGeo());
                    this._promedioLeyCuNoEconomicoGeo.set(this.promedioLeyCuNoEconomicoGeo());

                    this._promedioLeyPb.set(this.promedioLeyPb());
                    this._promedioLeyPbEconomicoGeo.set(this.promedioLeyPbEconomicoGeo());
                    this._promedioLeyPbNoEconomicoGeo.set(this.promedioLeyPbNoEconomicoGeo());

                    this._promedioLeyZn.set(this.promedioLeyZn());
                    this._promedioLeyZnEconomicoGeo.set(this.promedioLeyZnEconomicoGeo());
                    this._romedioLeyZnNoEconomicoGeo.set(this.promedioLeyZnNoEconomicoGeo());

                    this._promedioLeyAu.set(this.promedioLeyAu());
                    this._promedioLeyAuEconomicoGeo.set(this.promedioLeyAuEconomicoGeo());
                    this._promedioLeyAuNoEconomicoGeo.set(this.promedioLeyAuNoEconomicoGeo());

                    this._promedioVptMin.set(this.promedioVptMin());
                    this._promedioVptMinEconomicoGeo.set(this.promedioVptMinEconomicoGeo());
                    this._promedioVptMinNoEconomicoGeo.set(this.promedioVptMinNoEconomicoGeo());

                    this._promedioLeyAgDil.set(this.promedioLeyAgDil());
                    this._promedioLeyAgDilEconomicoMin.set(this.promedioLeyAgDilEconomicoMin());
                    this._promedioLeyAgDilNoEconomicoMin.set(this.promedioLeyAgDilNoEconomicoMin());

                    this._promedioLeyCuDil.set(this.promedioLeyCuDil());
                    this._promedioLeyCuDilEconomicoMin.set(this.promedioLeyCuDilEconomicoMin());
                    this._promedioLeyCuDilNoEconomicoMin.set(this.promedioLeyCuDilNoEconomicoMin());

                    this._promedioLeyPbDil.set(this.promedioLeyPbDil());
                    this._promedioLeyPbDilEconomicoMin.set(this.promedioLeyPbDilEconomicoMin());
                    this._promedioLeyPbDilNoEconomicoMin.set(this.promedioLeyPbDilNoEconomicoMin());

                    this._promedioLeyZnDil.set(this.promedioLeyZnDil());
                    this._promedioLeyZnDilEconomicoMin.set(this.promedioLeyZnDilEconomicoMin());
                    this._promedioLeyZnDilNoEconomicoMin.set(this.promedioLeyZnDilNoEconomicoMin());

                    this._promedioLeyAuDil.set(this.promedioLeyAuDil());
                    this._promedioLeyAuDilEconomicoMin.set(this.promedioLeyAuDilEconomicoMin());
                    this._promedioLeyAuDilNoEconomicoMin.set(this.promedioLeyAuDilNoEconomicoMin());

                    this._promedioVptDil.set(this.promedioVptDil());
                    this._promedioVptDilEconomicoMin.set(this.promedioVptDilEconomicoMin());
                    this._promedioVptDilNoEconomicoMin.set(this.promedioVptDilNoEconomicoMin());
                    this.aplicarModo();

                    this.isLoading.set(false);
                },
                error: error => {
                    console.error(error);
                    this.isLoading.set(false);
                }
            });
    }


    private recalcularTotales(): void {
        this._totalProduccion.set(this.totalProduccion());
        this._blocksEconomicos.set(this.blocksEconomicos());
        this._blocksNoEconomicos.set(this.blocksNoEconomicos());
        this._totalPrgAvamts.set(this.totalPrgAvamts());
        this._totalVetaDilucion.set(this.totalVetaDilucion());
        this._totalVetaDilucionEcono.set(this.totalVetaDilucionEcono());
        this._totalVetaNoEcono.set(this.totalVetaDilucionNoEcono());
        this._totalVeta.set(this.totalVeta());
        this._totalVetaEcono.set(this.totalVetaEcono());
        this._totalDilucion.set(this.totalDilucion());
        this._totalDilucionEcono.set(this.totalDilucionEcono());
        this._totalDilucionNoEcono.set(this.totalDilucionNoEcono());
        this._sumaLoncorRotas.set(this.sumaLoncorRotas());
        this._sumaLoncorEconomicos.set(this.sumaLoncorEconomicos());
        this._sumaLoncorNoEconomicos.set(this.sumaLoncorNoEconomicos());
        this._promedioAltcor.set(this.promedioAltcor());
        this._promedioAltcorEconomico.set(this.promedioAltcorEconomico());
        this._promedioAltcorNoEconomico.set(this.promedioAltcorNoEconomico());
        this._sumaTmsRotVet.set(this.sumaTmsRotVet());
        this._sumaTmsRotVetEconomicos.set(this.sumaTmsRotVetEconomicos());
        this._sumaTmsRotVetNoEconomicos.set(this.sumaTmsRotVetNoEconomicos());
        this._sumaTmsRotDil.set(this.sumaTmsRotDil());
        this._sumaTmsRotDilEconomicos.set(this.sumaTmsRotDilEconomicos());
        this._sumaTmsRotDilNoEconomicos.set(this.sumaTmsRotDilNoEconomicos());
        this._sumaTmsExtraId.set(this.sumaTmsExtraId());
        this._sumaTmsExtraIdEconomicos.set(this.sumaTmsExtraIdEconomicos());
        this._sumaTmsExtraIdNoEconomicos.set(this.sumaTmsExtraIdNoEconomicos());
        this._promedioLeyAg.set(this.promedioLeyAg());
        this._promedioLeyAgGeo.set(this.promedioLeyAgGeo());
        this._promedioLeyAgNoEconomicoGeo.set(this.promedioLeyAgNoEconomicoGeo());
        this._promedioLeyCu.set(this.promedioLeyCu());
        this._promedioLeyCuEconomicoGeo.set(this.promedioLeyCuEconomicoGeo());
        this._promedioLeyCuNoEconomicoGeo.set(this.promedioLeyCuNoEconomicoGeo());
        this._promedioLeyPb.set(this.promedioLeyPb());
        this._promedioLeyPbEconomicoGeo.set(this.promedioLeyPbEconomicoGeo());
        this._promedioLeyPbNoEconomicoGeo.set(this.promedioLeyPbNoEconomicoGeo());
        this._promedioLeyZn.set(this.promedioLeyZn());
        this._promedioLeyZnEconomicoGeo.set(this.promedioLeyZnEconomicoGeo());
        this._romedioLeyZnNoEconomicoGeo.set(this.promedioLeyZnNoEconomicoGeo());
        this._promedioLeyAu.set(this.promedioLeyAu());
        this._promedioLeyAuEconomicoGeo.set(this.promedioLeyAuEconomicoGeo());
        this._promedioLeyAuNoEconomicoGeo.set(this.promedioLeyAuNoEconomicoGeo());
        this._promedioVptMin.set(this.promedioVptMin());
        this._promedioVptMinEconomicoGeo.set(this.promedioVptMinEconomicoGeo());
        this._promedioVptMinNoEconomicoGeo.set(this.promedioVptMinNoEconomicoGeo());
        this._promedioLeyAgDil.set(this.promedioLeyAgDil());
        this._promedioLeyAgDilEconomicoMin.set(this.promedioLeyAgDilEconomicoMin());
        this._promedioLeyAgDilNoEconomicoMin.set(this.promedioLeyAgDilNoEconomicoMin());
        this._promedioLeyCuDil.set(this.promedioLeyCuDil());
        this._promedioLeyCuDilEconomicoMin.set(this.promedioLeyCuDilEconomicoMin());
        this._promedioLeyCuDilNoEconomicoMin.set(this.promedioLeyCuDilNoEconomicoMin());
        this._promedioLeyPbDil.set(this.promedioLeyPbDil());
        this._promedioLeyPbDilEconomicoMin.set(this.promedioLeyPbDilEconomicoMin());
        this._promedioLeyPbDilNoEconomicoMin.set(this.promedioLeyPbDilNoEconomicoMin());
        this._promedioLeyZnDil.set(this.promedioLeyZnDil());
        this._promedioLeyZnDilEconomicoMin.set(this.promedioLeyZnDilEconomicoMin());
        this._promedioLeyZnDilNoEconomicoMin.set(this.promedioLeyZnDilNoEconomicoMin());
        this._promedioLeyAuDil.set(this.promedioLeyAuDil());
        this._promedioLeyAuDilEconomicoMin.set(this.promedioLeyAuDilEconomicoMin());
        this._promedioLeyAuDilNoEconomicoMin.set(this.promedioLeyAuDilNoEconomicoMin());
        this._promedioVptDil.set(this.promedioVptDil());
        this._promedioVptDilEconomicoMin.set(this.promedioVptDilEconomicoMin());
        this._promedioVptDilNoEconomicoMin.set(this.promedioVptDilNoEconomicoMin());
    }

    private totalProduccion(): number {
        return this.labores.controls
            .reduce((acc, l) => acc + (l.value.prg_progra === 'S' ? 1 : 0), 0);
    }


    private blocksEconomicos(): number {
        return this.labores.controls.filter(control => {
            const item = control.value;
            const vpt = Number(item.vpt) || 0;
            const val_vpt = Number(item.val_vpt) || 0;
            return vpt >= val_vpt;
        }).length;
    }

    private blocksNoEconomicos(): number {
        return this.labores.controls.filter(control => {
            const item = control.value;
            const vpt = Number(item.vpt) || 0;
            const val_vpt = Number(item.val_vpt) || 0;
            return vpt < val_vpt;
        }).length;
    }

    private totalPrgAvamts(): number {
        return this.labores.value.reduce((acc: number, item: any) =>
            acc + (Number(item.prg_avamts) || 0), 0
        );
    }

    // AREA
    private calcularArea(item: any): number {
        return (item.vpt ?? 0) >= (item.fac_vptmin ?? 0)
            ? (item.prg_loncor ?? 0) * (item.prg_altcor ?? 0)
            : 0;
    }

    // ROTAS
    private calcularRotas(item: any): number {
        return (item.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
    }

    //bloque 1
    //VETA DILUCION
    private totalVeta(): number {
        const data = this.labores.controls.map(c => c.value);

        const totalArea = data.reduce((acc, item) =>
            acc + this.calcularArea(item), 0);

        if (totalArea === 0) return 0;

        const suma = data.reduce((acc, item) => {
            const area = this.calcularArea(item);
            const rotas = this.calcularRotas(item);

            return acc + ((item.prg_ancvet ?? 0) * area * rotas);
        }, 0);

        return suma / totalArea;
    }

    private totalDilucion(): number {
        const data = this.labores.controls.map(c => c.value);

        const totalArea = data.reduce((acc, item) =>
            acc + this.calcularArea(item), 0);

        if (totalArea === 0) return 0;

        const suma = data.reduce((acc, item) => {
            const area = this.calcularArea(item);
            const rotas = this.calcularRotas(item);

            return acc + ((item.prg_ancdil ?? 0) * area * rotas);
        }, 0);

        return suma / totalArea;
    }

    private totalVetaDilucion(): number {
        return this.totalVeta() + this.totalDilucion();
    }

    //NO ECONOIMOCS

    private esEconomico(item: any): number {
        const vpt = item.vpt ?? 0;
        return vpt >= (item.val_vpt ?? 0) ? 1 : 0;
    }

    private esNoEconomico(item: any): number {
        const vpt = item.vpt ?? 0;

        return (vpt >= (item.fac_vptmin ?? 0) && vpt < (item.val_vpt ?? 0))
            ? 1
            : 0;
    }

    private totalVetaEcono(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const area = this.calcularArea(item);
            const rotas = this.calcularRotas(item);
            const econ = this.esEconomico(item);

            const peso = area * rotas * econ;

            totalPeso += peso;
            suma += (item.prg_ancvet ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private totalDilucionEcono(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const area = this.calcularArea(item);
            const rotas = this.calcularRotas(item);
            const econ = this.esEconomico(item);

            const peso = area * rotas * econ;

            totalPeso += peso;
            suma += (item.prg_ancdil ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }


    private totalVetaDilucionEcono(): number {
        return this.totalVetaEcono() + this.totalDilucionEcono();
    }


    //NO ECONOMICAS
    private totalVetaNoEcono(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const area = this.calcularArea(item);
            const rotas = this.calcularRotas(item);
            const noeco = this.esNoEconomico(item);

            const peso = area * rotas * noeco;

            totalPeso += peso;
            suma += (item.prg_ancvet ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }


    private totalDilucionNoEcono(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const area = this.calcularArea(item);
            const rotas = this.calcularRotas(item);
            const noeco = this.esNoEconomico(item);

            const peso = area * rotas * noeco;

            totalPeso += peso;
            suma += (item.prg_ancdil ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private totalVetaDilucionNoEcono(): number {
        return this.totalVetaNoEcono() + this.totalDilucionNoEcono();
    }


    //BLOUE 3

    //LONGITUD ALA

    private sumaLoncorRotas(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);

            return acc + ((item.prg_loncor ?? 0) * rotas);
        }, 0);
    }
    private sumaLoncorEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);
            const econ = this.esEconomico(item);

            return acc + ((item.prg_loncor ?? 0) * rotas * econ);
        }, 0);
    }

    private sumaLoncorNoEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);
            const noeco = this.esNoEconomico(item);

            return acc + ((item.prg_loncor ?? 0) * rotas * noeco);
        }, 0);
    }

    private promedioAltcor(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalArea = 0;

        for (const item of data) {
            const area = this.calcularArea(item);

            totalArea += area;
            suma += (item.prg_altcor ?? 0) * area;
        }

        return totalArea > 0 ? suma / totalArea : 0;
    }


    private promedioAltcorEconomico(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalArea = 0;

        for (const item of data) {
            const area = this.calcularArea(item);
            const econ = this.esEconomico(item);

            totalArea += area;
            suma += (item.prg_altcor ?? 0) * area * econ;
        }

        return totalArea > 0 ? suma / totalArea : 0;
    }

    private promedioAltcorNoEconomico(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalArea = 0;

        for (const item of data) {
            const area = this.calcularArea(item);
            const noeco = this.esNoEconomico(item);

            totalArea += area;
            suma += (item.prg_altcor ?? 0) * area * noeco;
        }

        return totalArea > 0 ? suma / totalArea : 0;
    }


    //ROTA VETA

    private sumaTmsRotVet(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);

            return acc + ((item.prg_tmsrotvet ?? 0) * rotas);
        }, 0);
    }

    private sumaTmsRotVetEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);
            const econ = this.esEconomico(item);

            return acc + ((item.prg_tmsrotvet ?? 0) * rotas * econ);
        }, 0);
    }

    private sumaTmsRotVetNoEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);
            const noeco = this.esNoEconomico(item);

            return acc + ((item.prg_tmsrotvet ?? 0) * rotas * noeco);
        }, 0);
    }

    //tms rotas dilucion
    private sumaTmsRotDil(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);

            return acc + ((item.prg_tmsrotdil ?? 0) * rotas);
        }, 0);
    }


    private sumaTmsRotDilEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);
            const econ = this.esEconomico(item);

            return acc + ((item.prg_tmsrotdil ?? 0) * rotas * econ);
        }, 0);
    }

    private sumaTmsRotDilNoEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const rotas = this.calcularRotas(item);
            const noeco = this.esNoEconomico(item);

            return acc + ((item.prg_tmsrotdil ?? 0) * rotas * noeco);
        }, 0);
    }

    //TMS EXTRAIDO
    private sumaTmsExtraId(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            return acc + (item.prg_tmsextraid ?? 0);
        }, 0);
    }

    private sumaTmsExtraIdEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const econ = this.esEconomico(item);

            return acc + ((item.prg_tmsextraid ?? 0) * econ);
        }, 0);
    }

    private sumaTmsExtraIdNoEconomicos(): number {
        const data = this.labores.controls.map(c => c.value);

        return data.reduce((acc, item) => {
            const noeco = this.esNoEconomico(item);

            return acc + ((item.prg_tmsextraid ?? 0) * noeco);
        }, 0);
    }

    //AG GR

    private promedioLeyAg(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leyag ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyAgGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const economicosGeo =
                (item.prg_vptmin ?? 0) >= (item.val_vpt ?? 0) ? 1 : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * economicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leyag ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyAgNoEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const noeconomicosGeo =
                (item.prg_vptmin ?? 0) >= (item.fac_vptmin ?? 0) &&
                    (item.prg_vptmin ?? 0) < (item.val_vpt ?? 0)
                    ? 1
                    : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * noeconomicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leyag ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //CU %

    private promedioLeyCu(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leycu ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyCuEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const economicosGeo =
                (item.prg_vptmin ?? 0) >= (item.val_vpt ?? 0) ? 1 : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * economicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leycu ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyCuNoEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const noeconomicosGeo =
                (item.prg_vptmin ?? 0) >= (item.fac_vptmin ?? 0) &&
                    (item.prg_vptmin ?? 0) < (item.val_vpt ?? 0)
                    ? 1
                    : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * noeconomicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leycu ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //PB %

    private promedioLeyPb(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leypb ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyPbEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const economicosGeo =
                (item.prg_vptmin ?? 0) >= (item.val_vpt ?? 0) ? 1 : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * economicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leypb ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyPbNoEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const noeconomicosGeo =
                (item.prg_vptmin ?? 0) >= (item.fac_vptmin ?? 0) &&
                    (item.prg_vptmin ?? 0) < (item.val_vpt ?? 0)
                    ? 1
                    : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * noeconomicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leypb ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //ZN %
    private promedioLeyZn(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leyzn ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyZnEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const economicosGeo =
                (item.prg_vptmin ?? 0) >= (item.val_vpt ?? 0) ? 1 : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * economicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leyzn ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyZnNoEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const noeconomicosGeo =
                (item.prg_vptmin ?? 0) >= (item.fac_vptmin ?? 0) &&
                    (item.prg_vptmin ?? 0) < (item.val_vpt ?? 0)
                    ? 1
                    : 0;

            const extraido = peso > 0 ? 1 : 0;

            const factor = peso * noeconomicosGeo * extraido;

            totalPeso += factor;
            suma += (item.prg_leyzn ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    // otro leyau

    private promedioLeyAu(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leyau ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyAuEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor = peso * (item.economicos_geo ?? 0) * (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leyau ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyAuNoEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor = peso * (item.noeconomicos_geo ?? 0) * (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leyau ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }


    //VTP U$

    private promedioVptMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;
        let totalArea = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;
            const area = item.area ?? 0;

            totalArea += area;
            totalPeso += peso;
            suma += (item.prg_vptmin ?? 0) * peso;
        }

        return totalArea > 0 && totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioVptMinEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor = peso * (item.economicos_geo ?? 0) * (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_vptmin ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioVptMinNoEconomicoGeo(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor = peso * (item.noeconomicos_geo ?? 0) * (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_vptmin ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //AG gr

    private promedioLeyAgDil(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leyagdil ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyAgDilEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const economicosMin =
                (item.prg_vptdil ?? 0) >= (item.val_vpt ?? 0) ? 1 : 0;

            const factor = peso * economicosMin * (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leyagdil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyAgDilNoEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const noeconomicosMin =
                (item.prg_vptdil ?? 0) >= (item.fac_vptmin ?? 0) &&
                    (item.prg_vptdil ?? 0) < (item.val_vpt ?? 0)
                    ? 1
                    : 0;

            const factor = peso * noeconomicosMin * (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leyagdil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //CU % LEYES MINABLES

    private promedioLeyCuDil(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leycudil ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyCuDilEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor =
                peso *
                (item.economicos_min ?? 0) *
                (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leycudil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyCuDilNoEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor =
                peso *
                (item.noeconomicos_min ?? 0) *
                (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leycudil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //LEYES MINABLES PB%

    private promedioLeyPbDil(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leypbdil ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyPbDilEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor =
                peso *
                (item.economicos_min ?? 0) *
                (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leypbdil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyPbDilNoEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor =
                peso *
                (item.noeconomicos_min ?? 0) *
                (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leypbdil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //zn LEYES MINABLES
    private promedioLeyZnDil(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            totalPeso += peso;
            suma += (item.prg_leyzndil ?? 0) * peso;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyZnDilEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor =
                peso *
                (item.economicos_min ?? 0) *
                (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leyzndil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioLeyZnDilNoEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;

            const factor =
                peso *
                (item.noeconomicos_min ?? 0) *
                (item.extraido ?? 0);

            totalPeso += factor;
            suma += (item.prg_leyzndil ?? 0) * factor;
        }

        return totalPeso > 0 ? suma / totalPeso : 0;
    }

    //leyes minables au

    private promedioLeyAuDil(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let total = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;
            if (peso <= 0) continue;

            total += peso;
            suma += (item.prg_leyaudil ?? 0) * peso;
        }

        return total > 0 ? suma / total : 0;
    }

    private promedioLeyAuDilEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let total = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;
            if (peso <= 0) continue;

            if (!item.economicos_min || !item.extraido) continue;

            total += peso;
            suma += (item.prg_leyaudil ?? 0) * peso;
        }

        return total > 0 ? suma / total : 0;
    }

    private promedioLeyAuDilNoEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let total = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;
            if (peso <= 0) continue;

            if (!item.noeconomicos_min || !item.extraido) continue;

            total += peso;
            suma += (item.prg_leyaudil ?? 0) * peso;
        }

        return total > 0 ? suma / total : 0;
    }


    //VPT US  LEYES MINABLES

    private promedioVptDil(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let totalPeso = 0;
        let totalArea = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;
            const area = item.area ?? 0;

            totalArea += area;
            totalPeso += peso;
            suma += (item.prg_vptdil ?? 0) * peso;
        }

        return totalArea > 0 && totalPeso > 0 ? suma / totalPeso : 0;
    }

    private promedioVptDilEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let total = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;
            if (peso <= 0) continue;

            if (!item.economicos_min || !item.extraido) continue;

            total += peso;
            suma += (item.prg_vptdil ?? 0) * peso;
        }

        return total > 0 ? suma / total : 0;
    }

    private promedioVptDilNoEconomicoMin(): number {
        const data = this.labores.controls.map(c => c.value);

        let suma = 0;
        let total = 0;

        for (const item of data) {
            const peso = item.prg_tmsextraid ?? 0;
            if (peso <= 0) continue;

            if (!item.noeconomicos_min || !item.extraido) continue;

            total += peso;
            suma += (item.prg_vptdil ?? 0) * peso;
        }

        return total > 0 ? suma / total : 0;
    }

}
