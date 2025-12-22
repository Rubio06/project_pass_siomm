import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DATOS_METODO_MINADO, SelectExploracion, TH_METODOLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-metodo-minado-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './metodo-minado-main.component.html',
    styleUrl: './metodo-minado-main.component.css',
})
export class MetodoMinadoMainComponent {

    columnas = signal<thTitulos[]>(TH_METODOLO_MINADO);
    titulo = this.columnas().map(t => t.titulo);

    datosColumna = signal<any[]>(DATOS_METODO_MINADO);

    planingCompartido = inject(PlaningCompartido);

    formUtils = FormUtils;

    semanasAvanceMainService = inject(SemanasAvanceMainService);
    private utils = FormUtils;
    planingService = inject(PlanningService);

    fb = inject(FormBuilder);

    // ========================================
    //   FORMULARIO PRINCIPAL
    // ========================================
    myForm = this.fb.group({
        semanas: this.fb.array([]),
    });

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    // ========================================
    //   SIGNALS
    // ========================================
    loading = signal(false);
    message = signal<string>('');

    cod_metexp = signal<SelectExploracion[]>([]);

    ind_calculo_dilucion = signal<any[]>([
        { value: 1, label: 'Contrato' },
        { value: 2, label: 'O´hara' }
    ]);

    ind_calculo_leyes_min = signal<any[]>([
        { value: 1, label: 'Contrato' },
        { value: 2, label: 'O´hara' }
    ]);

    ind_act = signal<any[]>([
        { value: 1, label: 'Sí' },
        { value: 2, label: 'No' }
    ]);

    private cd = inject(ChangeDetectorRef);

    constructor() {

        effect(() => {


            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.metodo_minado || [];


            this.loadSemanas(semanas);
            this.myForm.patchValue(data || {}, { emitEvent: false });

            this.cd.detectChanges();              // opcional

        });


        // effect(() => {
        //     const data = this.planingCompartido.dataRoutes();
        //     const semanas = data?.data?.semana_avance || [];

        //     this.loadSemanas(semanas);
        //     this.myForm.patchValue(data || {}, { emitEvent: false });
        //     this.cd.detectChanges();              // opcional
        // });


        this.loadSelectExploracion();

        // Lookups iniciales


        effect(() => {
            this.planingCompartido.formVersion(); // dependencia
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

        ///BOTON VISUALIZAR

        effect(() => {
            const signal = this.planingCompartido.visualizarForms();

            if (signal > 0) {
                this.blockForm();
                this.resetForm();
                this.cod_metexp.set([]);
                this.ind_calculo_dilucion.set([]);
                this.ind_calculo_leyes_min.set([]);
                this.ind_act.set([]);

                // this.resetSelects(); // limpia selects
            }
        });
    }

    blockForm() {
        if (this.myForm) {
            this.myForm.disable({ emitEvent: false });
        }// bloquea todos los campos
        // this.filas.forEach(f => f.disable()); // bloquea filas si tienes tabla
    }

    // =====================================================
    //   RESETEAR FORMULARIO
    // =====================================================
    resetForm() {
        this.myForm.reset();
        this.semanas.clear();

        setTimeout(() => this.semanas.clear());

        // this.planingCompartido.notifyFormChanged();
    }

    // =====================================================
    //   CARGAR DATOS DESDE BACKEND
    // =====================================================
    loadSemanas(data: any[]) {
        this.semanas.clear();


        data.forEach((item, index) => {
            const cod = this.cod_metexp()[index];
            if (!cod) return;


            this.semanas.push(
                this.fb.group({
                    cod_metexp: [this.cod_metexp()[index].nom_metexp, [Validators.required]],
                    nom_metexp: [item.nom_metexp, [Validators.required]],
                    ind_calculo_dilucion: [this.ind_calculo_dilucion()[0].label],
                    ind_calculo_leyes_min: [this.ind_calculo_leyes_min()[0].label],
                    ind_act: [this.ind_act()[0].label],
                    accion: ['',],
                    esNuevo: [false]

                })
            );
        });
        // this.myForm.disable({ emitEvent: false });

        this.planingCompartido.notifyFormChanged();


    }

    // =====================================================
    //   AGREGAR FILA NUEVA (EDITABLE)
    // =====================================================
    agregarFilas() {
        if (this.semanas.length >= 1) {
            return;
        }

        this.planingCompartido.setBloqueoFormEditar(false);

        this.semanas.push(
            this.fb.group({
                cod_metexp: ['', Validators.required], // 👈 CLAVE
                nom_metexp: ['', Validators.required],
                ind_calculo_dilucion: ['', Validators.required],
                ind_calculo_leyes_min: ['', Validators.required],
                ind_act: ['', Validators.required],
                esNuevo: [true]
            })
        );
    }

    // =====================================================
    //   ELIMINAR FILA
    // =====================================================
    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;
        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            this.cd.detectChanges();
            return;
        }

        const payload = {
            cod_metexp: semana.cod_metexp,
            anio: this.semanasAvanceMainService.anio(),
            mes: this.semanasAvanceMainService.mes(),
        };

        const confirmado = await this.utils.confirmarEliminacion();
        if (!confirmado) {
            this.utils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.eliminarMetodoMinado(payload).subscribe({
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
    // =====================================================
    //   SUBMIT SOLO DE LA ÚLTIMA FILA
    // =====================================================
    // ngOnInit() {
    //     this.myForm.valueChanges.subscribe(val => {
    //         const filas = this.semanas.getRawValue();

    //         this.planingCompartido.setMetodoMinado(filas);
    //     });
    // }

    // =====================================================
    //   LOOKUP SELECT EXPLORACIÓN
    // =====================================================
    loadSelectExploracion() {
        this.planingService.SelectExploracion().subscribe({
            next: (data) => this.cod_metexp.set(data),
            error: (e) => console.error('Error cargando métodos de exploración', e)
        });
    }
}
