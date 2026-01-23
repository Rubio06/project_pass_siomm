import { Component, signal, input, effect, inject, WritableSignal, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';
import { DATOS_ESTANDER_AVANCE, SelectTipoLabor, TH_ESTANDAR_AVANCE, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-estandar-avance',
    imports: [ReactiveFormsModule],
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

    planingCompartido = inject(PlaningCompartidoService);

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

    formUtils = FormUtils;
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

            // this.cd.detectChanges();              // opcional


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
        this.loadTiposLabor();

        //VALIDACION DE CAMPOS
        effect(() => {
            if (this.planingCompartido.triggerValidacion$()) {
                this.myForm.markAllAsTouched();
            }
        });


    }


    blockForm() {
        this.myForm.disable(); // bloquea todos los campos
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

            this.semanas.push(
                this.fb.group({
                    cie_ano: [item.cie_ano, Validators.required],
                    cie_per: [item.cie_per, Validators.required],
                    cod_tiplab: [item.cod_tiplab, Validators.required],
                    nro_lab_ancho: [item.nro_lab_ancho || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_altura: [item.nro_lab_altura || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_pieper: [item.nro_lab_pieper || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_broca: [item.nro_lab_broca || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_barcon: [item.nro_lab_barcon || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_barren: [item.nro_lab_barren || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_facpot: [item.nro_lab_facpot || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_fulmin: [item.nro_lab_fulmin || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_conect: [item.nro_lab_conect || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_punmar: [item.nro_lab_punmar || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    nro_lab_tabla: [item.nro_lab_tabla || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
                    accion: [''],
                    esNuevo: [false]

                })
            );
        });
    }

    agregarFilas() {


        
        const ultima = this.semanas.length
            ? this.semanas.at(this.semanas.length - 1)?.getRawValue()
            : null;

        const origen = ultima || {
            cie_ano: new Date().getFullYear().toString(),
            cie_per: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        };

        const nuevoGrupo = this.fb.group({
            cie_ano: [origen.cie_ano, Validators.required],
            cie_per: [origen.cie_per, Validators.required],
            cod_tiplab: ['', Validators.required],
            nro_lab_ancho: [origen.nro_lab_ancho || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_altura: [origen.nro_lab_altura || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_pieper: [origen.nro_lab_pieper || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_broca: [origen.nro_lab_broca || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_barcon: [origen.nro_lab_barcon || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_barren: [origen.nro_lab_barren || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_facpot: [origen.nro_lab_facpot || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_fulmin: [origen.nro_lab_fulmin || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_conect: [origen.nro_lab_conect || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_punmar: [origen.nro_lab_punmar || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            nro_lab_tabla: [origen.nro_lab_tabla || '', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            esNuevo: [true]
        });

        this.semanas.push(nuevoGrupo);

        const filaNueva = this.semanas.at(this.semanas.length - 1);
        this.enviarFilaNueva(filaNueva!);

    }

    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar() && !row.get('esNuevo')?.value;
    }


    enviarFilaNueva(row: AbstractControl) {
        this.myForm.valueChanges.subscribe(val => {
            const payload = row.getRawValue(); // objeto plano

            this.planingCompartido.setLaboratorioEstandar(payload, 'estandar_avance', {
                valid: this.myForm.valid,
                dirty: this.myForm.dirty
            });
        });
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
            // const markTouched = this.myForm.markAllAsTouched();
            this.planingCompartido.setLaboratorioEstandar(filas, 'estandar_avance', {
                valid: this.myForm.valid,
                dirty: this.myForm.dirty
            });
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


