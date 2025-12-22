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
    cod_tiplab = signal<SelectTipoLabor[]>([]);

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

    bloqueoBotonNuevo = signal<boolean>(true);

    constructor() {
        effect(() => {
            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.laboratorio_estandar || [];

            this.loadSemanas(semanas);
            this.myForm.patchValue(data || {}, { emitEvent: false });
            this.cd.detectChanges();              // opcional

        });

        ///BOTON EDITAR
        effect(() => {
            if (!this.myForm) return;

            if (this.planingCompartido.bloqueoFormGeneral()) {
                this.myForm.disable({ emitEvent: false });
            } else {
                this.myForm.enable({ emitEvent: false });
            }
        });

        ///BOTON NUEVO
        effect(() => {
            const resetSignal = this.planingCompartido.resetAllForms();
            if (resetSignal > 0) {
                this.resetForm();
            }
        });


        // BOTON VISUALIZAR

        effect(() => {
            const signal = this.planingCompartido.visualizarForms();
            if (signal > 0) {
                this.blockForm();
                this.resetForm();
            }
        });

        this.loadTiposLabor();


    }

    blockForm() {
        this.myForm.disable(); // bloquea todos los campos
        // this.filas.forEach(f => f.disable()); // bloquea filas si tienes tabla
    }

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

            const cod = this.cod_tiplab()[index];
            if (!cod) return;

            this.semanas.push(
                this.fb.group({
                    cod_tiplab: [this.cod_tiplab(), Validators.required],
                    nro_lab_ancho: [item.nro_lab_ancho || ''],
                    nro_lab_altura: [item.nro_lab_altura || ''],
                    nro_lab_pieper: [item.nro_lab_pieper || ''],
                    nro_lab_broca: [item.nro_lab_broca || ''],
                    nro_lab_barcon: [item.nro_lab_barcon || ''],
                    nro_lab_barren: [item.nro_lab_barren || ''],
                    nro_lab_facpot: [item.nro_lab_facpot || ''],
                    nro_lab_fulmin: [item.nro_lab_fulmin || ''],
                    nro_lab_conect: [item.nro_lab_conect || ''],
                    nro_lab_punmar: [item.nro_lab_punmar || ''],
                    nro_lab_tabla: [item.nro_lab_tabla || ''],
                    accion: [''],
                    esNuevo: [false]

                })
            );
        });
        this.planingCompartido.notifyFormChanged();

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
                esNuevo: [true]

            })
        );

        this.planingCompartido.setBloqueo(false);
        this.message.set('');
    }

    /**
     * Elimina fila específica
     */
    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;

        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            this.cd.detectChanges();
            return;
        }

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
                    this.utils.alertaEliminado(res.message);
                    this.semanas.removeAt(index);
                    this.cd.detectChanges();
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
            next: (data: any) => this.cod_tiplab.set(data),
            error: (err) => console.error('Error al cargar tipos de labor:', err),
        });
    }

}


