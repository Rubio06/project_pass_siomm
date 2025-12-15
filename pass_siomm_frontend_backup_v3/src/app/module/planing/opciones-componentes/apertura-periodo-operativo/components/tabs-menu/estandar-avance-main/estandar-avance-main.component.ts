import { Component, signal, input, effect, inject, WritableSignal, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { FormUtils } from 'src/app/utils/form-utils';
import { DATOS_ESTANDER_AVANCE, SelectTipoLabor, TH_ESTANDAR_AVANCE, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-estandar-avance',
    imports: [ReactiveFormsModule, SpinnerComponent],
    templateUrl: './estandar-avance-main.component.html',
    styleUrl: './estandar-avance-main.component.css',
})
export class EstandarAvanceComponent {

    // ===============================
    //   IMPORTS & DEPENDENCIAS
    // ===============================
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);

    // ===============================
    //   CONFIGURACIÓN DE TABLA
    // ===============================
    columnas = signal<thTitulos[]>(TH_ESTANDAR_AVANCE);
    titulo = this.columnas().map(t => t.titulo);

    private utils = FormUtils;
    semanasAvanceMainService = inject(SemanasAvanceMainService);
    datosColumna = signal<any[]>(DATOS_ESTANDER_AVANCE);

    planingCompartido = inject(PlaningCompartido);

    // ===============================
    //   LOOKUPS
    // ===============================
    listLabor = signal<SelectTipoLabor[]>([]);

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

        /**
         * 📌 CARGA INICIAL DESDE BACKEND
         */


        // effect(() => {
        //     const data = this.planingService.dataRoutes();
        //     const semanas = data?.data?.laboratorio_estandar || [];

        //     setTimeout(() => {
        //         this.loadSemanas(semanas);           // refresca FormArray
        //         this.myForm.patchValue(data || {});   // actualiza el formulario
        //         this.cd.detectChanges();              // opcional
        //     }, 0);
        // });


        // /**
        //  * 📌 BLOQUEO CENTRALIZADO
        //  */
        // effect(() => {
        //     const bloqueado = this.planingService.bloqueoForm();
        //     this.estaBloqueado.set(bloqueado);

        //     bloqueado ? this.myForm.disable() : this.myForm.enable();

        //     if (!bloqueado && this.semanas.length === 0) {
        //         const dataRoutes = this.planingService.data();
        //         const labor = dataRoutes?.data?.laboratorio_estandar ?? [];
        //         this.loadSemanas(labor);
        //     }
        // });

        effect(() => {
            const data = this.planingService.dataRoutes();
            const semanas = data?.data?.laboratorio_estandar || [];

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




        // effect(() => {
        //     this.bloqueoFormulario();
        // });


    }

    // bloqueoFormulario() {
    //     const bloqueado = this.planingService.bloqueoForm();

    //     if (bloqueado) this.myForm.disable();
    //     else this.myForm.enable();

    //     // ❗ Campos que siempre deben quedar bloqueados
    //     // this.form.get('cie_ano')?.disable();
    //     // this.form.get('cie_per')?.disable();
    // }

    // ===============================
    //   MÉTODOS
    // ===============================

    /**
     * Limpia el formulario
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
                    cod_tiplab: [{ value: item.cod_tiplab, disabled: true }, Validators.required],
                    nro_lab_ancho: [{ value: item.nro_lab_ancho || '', disabled: true }],
                    nro_lab_altura: [{ value: item.nro_lab_altura || '', disabled: true }],
                    nro_lab_pieper: [{ value: item.nro_lab_pieper || '', disabled: true }],
                    nro_lab_broca: [{ value: item.nro_lab_broca || '', disabled: true }],
                    nro_lab_barcon: [{ value: item.nro_lab_barcon || '', disabled: true }],
                    nro_lab_barren: [{ value: item.nro_lab_barren || '', disabled: true }],
                    nro_lab_facpot: [{ value: item.nro_lab_facpot || '', disabled: true }],
                    nro_lab_fulmin: [{ value: item.nro_lab_fulmin || '', disabled: true }],
                    nro_lab_conect: [{ value: item.nro_lab_conect || '', disabled: true }],
                    nro_lab_punmar: [{ value: item.nro_lab_punmar || '', disabled: true }],
                    nro_lab_tabla: [{ value: item.nro_lab_tabla || '', disabled: true }],
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
                cod_tiplab: ['', Validators.required],
                nro_lab_ancho: ['', Validators.required],
                nro_lab_altura: ['', Validators.required],
                nro_lab_pieper: ['', Validators.required],
                nro_lab_broca: ['', Validators.required],
                nro_lab_barcon: ['', Validators.required],
                nro_lab_barren: ['', Validators.required],
                nro_lab_facpot: ['', Validators.required],
                nro_lab_fulmin: ['', Validators.required],
                nro_lab_conect: ['', Validators.required],
                nro_lab_punmar: ['', Validators.required],
                nro_lab_tabla: ['', Validators.required],
            })
        );

        this.planingService.setBloqueo(false);
        this.message.set('');
    }

    /**
     * Elimina fila específica
     */
    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;

        const payload = {
            cod_tiplab: semana.cod_tiplab,
            anio: this.semanasAvanceMainService.anio(),
            mes: this.semanasAvanceMainService.mes(),
        };

        const confirmado = await this.utils.confirmarEliminacion();
        if (!confirmado) {
            this.utils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.estandarAvance(payload).subscribe({
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
     * Envía datos del formulario
     */
    ngOnInit() {
        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();
            this.planingCompartido.setLaboratorioEstandar(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }


    /**
     * Carga Tipos de Labor desde el servicio (Lookups)
     */
    private loadTiposLabor() {
        this.planingService.SelectTipoLabor().subscribe({
            next: (data: any) => this.listLabor.set(data),
            error: (err) => console.error('Error al cargar tipos de labor:', err),
        });
    }

}


