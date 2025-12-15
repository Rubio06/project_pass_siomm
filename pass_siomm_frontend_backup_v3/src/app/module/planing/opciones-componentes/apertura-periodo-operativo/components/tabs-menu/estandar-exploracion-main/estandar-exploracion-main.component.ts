import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DATOS_METODO_EXPLORACION, EstructuraDatosOtros, SelectZona, TH_ESTANDAR_EXPLORACION, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-estandar-exploracion-main',
    imports: [ReactiveFormsModule, SpinnerComponent],
    templateUrl: './estandar-exploracion-main.component.html',
    styleUrl: './estandar-exploracion-main.component.css',
})
export class EstandarExploracionMainComponent {

    // ===============================
    //   IMPORTS
    // ===============================
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);

    planingCompartido = inject(PlaningCompartido);
    semanasAvanceMainService = inject(SemanasAvanceMainService);

    // ===============================
    //   CONFIGURACIÓN DE TABLA
    // ===============================
    columnas = signal<any[]>(TH_ESTANDAR_EXPLORACION);
    titulo = this.columnas().map(t => t.titulo);

    datosColumna = signal<EstructuraDatosOtros[]>(DATOS_METODO_EXPLORACION);

    listZona = signal<SelectZona[]>([]);
    cod_metexp = signal<any[]>([]);

    private utils = FormUtils;

    // ===============================
    //   FORMULARIO PRINCIPAL
    // ===============================
    myForm = this.fb.group({
        semanas: this.fb.array([]),
    });

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    // ===============================
    //   SIGNALS DE ESTADO
    // ===============================
    loading = signal(false);
    message = signal<string>('');
    estaBloqueado = signal<boolean>(false);

    private cd = inject(ChangeDetectorRef);

    // ===============================
    //   CONSTRUCTOR
    // ===============================
    constructor() {


        // effect(() => {
        //     const data = this.planingService.dataRoutes();
        //     const semanas = data?.data?.exploracion_extandar || [];

        //     setTimeout(() => {
        //         this.loadSemanas(semanas);           // refresca FormArray
        //         this.myForm.patchValue(data || {});   // actualiza el formulario
        //         this.cd.detectChanges();              // opcional
        //     }, 0);
        // });


        effect(() => {
            const data = this.planingService.dataRoutes();
            const semanas = data?.data?.exploracion_extandar || [];

            this.loadSemanas(semanas);
            this.myForm.patchValue(data || {}, { emitEvent: false });

            this.cd.detectChanges();              // opcional

        });



        // ========================================
        //   EFECTO: BLOQUEO DE FORMULARIO
        // ========================================
        effect(() => {
            const bloqueado = this.planingService.bloqueoForm();
            bloqueado ? this.myForm.disable() : this.myForm.enable();
        });



        /**
         * 📌 BLOQUEO CENTRALIZADO
         */
        // effect(() => {
        //     const bloqueado = this.planingService.bloqueoForm();
        //     this.estaBloqueado.set(bloqueado);

        //     bloqueado ? this.myForm.disable() : this.myForm.enable();

        //     // Si se desbloquea y no hay filas, recargar
        //     if (!bloqueado && this.semanas.length === 0) {
        //         const dataRoutes = this.planingService.data();
        //         const exploracion = dataRoutes?.data?.exploracion_extandar ?? [];
        //         this.loadSemanas(exploracion);
        //     }
        // });

        // Carga de Lookups
        this.loadZonas();


    }

    // ===============================
    //   MÉTODOS
    // ===============================

    /**
     * Limpia el formulario por completo
     */
    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }

    /**
     * Carga data desde backend
     */
    loadSemanas(data: any[]) {
        this.semanas.clear();

        data.forEach((item, index) => {
            this.semanas.push(
                this.fb.group({
                    cod_zona: [{ value: item.cod_zona || '', disabled: true }, Validators.required],
                    lab_pieper: [{ value: item.lab_pieper || '', disabled: true }],
                    lab_broca: [{ value: item.lab_broca || '', disabled: true }],
                    lab_barcon: [{ value: item.lab_barcon || '', disabled: true }],
                    lab_barren: [{ value: item.lab_barren || '', disabled: true }],
                    lab_facpot: [{ value: item.lab_facpot || '', disabled: true }],
                    lab_fulmin: [{ value: item.lab_fulmin || '', disabled: true }],
                    lab_conect: [{ value: item.lab_conect || '', disabled: true }],
                    lab_punmar: [{ value: item.lab_punmar || '', disabled: true }],
                    lab_tabla: [{ value: item.lab_tabla || '', disabled: true }],
                    ind_act: [{ value: item.ind_act || '', disabled: true }],
                    lab_apr: [{ value: item.lab_apr || '', disabled: true }],
                    accion: [{ value: '', disabled: true }],
                })
            );
        });
    }

    /**
     * Agrega fila editable nueva
     */

    agregarFilas() {
        this.semanas.push(
            this.fb.group({
                cod_zona: ['', Validators.required],
                lab_pieper: ['', Validators.required],
                lab_broca: ['', Validators.required],
                lab_barcon: ['', Validators.required],
                lab_barren: ['', Validators.required],
                lab_facpot: ['', Validators.required],
                lab_fulmin: ['', Validators.required],
                lab_conect: ['', Validators.required],
                lab_punmar: ['', Validators.required],
                lab_tabla: ['', Validators.required],
                ind_act: ['', Validators.required],
                lab_apr: ['', Validators.required],
            })
        );

        this.planingService.setBloqueo(false);
        this.message.set('');
    }


    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;

        const payload = {
            cod_zona: semana.cod_zona,
            anio: this.semanasAvanceMainService.anio(),
            mes: this.semanasAvanceMainService.mes(),
        };

        const confirmado = await this.utils.confirmarEliminacion();
        if (!confirmado) {
            this.utils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.estandarExploracion(payload).subscribe({
            next: (res: any) => {
                if (res.success) {
                    // 👉 Elimina del FormArray

                    // 👉 Muestra alerta de éxito desde el utilitario
                    this.utils.alertaEliminado(res.message);
                    this.semanas.removeAt(index);
                    this.cd.detectChanges();              // opcional

                } else {
                    this.utils.alertaEliminado(res.message);

                }
            },
            error: (err) => this.utils.mensajeError(err.message)
        });
    }

    /**
     * Envía datos (simulación)
     */

    ngOnInit() {
        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();
            this.planingCompartido.setExploracionExtandar(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }

    /**
     * Carga las zonas desde el servicio (Lookups)
     */
    private loadZonas() {
        this.planingService.SelectZona().subscribe({
            next: (data: any) => this.listZona.set(data),
            error: (err) => console.error('Error al cargar zonas:', err),
        });
    }


}


