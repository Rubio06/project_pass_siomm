import { Component, signal, input, effect, inject, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { FormUtils } from 'src/app/utils/form-utils';
import { DATOS_ESTANDER_AVANCE, SelectTipoLabor, TH_ESTANDAR_AVANCE, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';

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

    // ===============================
    //   CONSTRUCTOR
    // ===============================
    constructor() {

        /**
         * 📌 CARGA INICIAL DESDE BACKEND
         */
        effect(() => {
            const dataRoutes = this.planingService.data();

            if (!dataRoutes) return;

            if (this.semanas.length === 0) {
                const labor = dataRoutes.data?.laboratorio_estandar ?? [];
                this.loadSemanas(labor);
                this.myForm.patchValue(dataRoutes);
            }

            // Carga de lookups
            this.loadTiposLabor();
        });

        /**
         * 📌 BLOQUEO CENTRALIZADO
         */
        effect(() => {
            const bloqueado = this.planingService.bloqueoForm();
            this.estaBloqueado.set(bloqueado);

            bloqueado ? this.myForm.disable() : this.myForm.enable();

            if (!bloqueado && this.semanas.length === 0) {
                const dataRoutes = this.planingService.data();
                const labor = dataRoutes?.data?.laboratorio_estandar ?? [];
                this.loadSemanas(labor);
            }
        });
    }

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
                    cod_tiplab: [{ value: this.listLabor()[index]?.nom_tipo_labor || item.cod_tipo_labor || '', disabled: true }, Validators.required],
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
    eliminarFila(index: number) {
        const fila = this.semanas.at(index).getRawValue();
        console.log("Fila que se eliminará:", fila);

        FormUtils.alertaEliminarFila(index);


        this.semanas.removeAt(index);
        this.message.set(`Fila ${index + 1} eliminada correctamente.`);
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


