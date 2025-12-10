import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DATOS_METODO_MINADO, SelectExploracion, TH_METODOLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';

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

    fb = inject(FormBuilder);
    planingService = inject(PlanningService);

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

    constructor() {

        // ========================================
        //   EFECTO: CARGA INICIAL
        // ========================================
        effect(() => {
            const data = this.planingService.dataRoutes();
            if (!data) return;

            // Solo cargar una vez si está vacío
            if (this.semanas.length === 0) {
                const backend = data.data?.metodo_minado ?? [];
                this.loadSemanas(backend);
                this.myForm.patchValue(data);
            }
        });


        // ========================================
        //   EFECTO: BLOQUEO DE FORMULARIO
        // ========================================
        effect(() => {
            const bloqueado = this.planingService.bloqueoForm();
            bloqueado ? this.myForm.disable() : this.myForm.enable();
        });

        // Lookups iniciales
        this.loadSelectExploracion();
    }

    // =====================================================
    //   RESETEAR FORMULARIO
    // =====================================================
    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }

    // =====================================================
    //   CARGAR DATOS DESDE BACKEND
    // =====================================================
    loadSemanas(data: any[]) {
        this.semanas.clear();

        data.forEach((item, index) => {
            this.semanas.push(
                this.fb.group({
                    cod_metexp: [{ value: this.cod_metexp()[index]?.nom_metexp || item.cod_metexp, disabled: true }, [Validators.required]],
                    nom_metexp: [{ value: item.nom_metexp || '', disabled: true }, [Validators.required]],
                    ind_calculo_dilucion: [{ value: this.ind_calculo_dilucion()[0].label, disabled: true }], // Valor hardcodeado (lógica original)
                    ind_calculo_leyes_min: [{ value: this.ind_calculo_leyes_min()[0].label, disabled: true }], // Valor hardcodeado (lógica original)
                    ind_act: [{ value: this.ind_act()[0].label, disabled: true }], // Valor hardcodeado (lógica original)
                    accion: new FormControl({ value: '', disabled: true })
                })
            );
        });
    }

    // =====================================================
    //   AGREGAR FILA NUEVA (EDITABLE)
    // =====================================================
    agregarFilas() {

        // Verificar que la última fila esté completa
        if (this.semanas.length > 0) {
            const last = this.semanas.at(this.semanas.length - 1);

            if (last.invalid) {
                last.markAllAsTouched();
                this.message.set("Debes completar la fila antes de agregar otra.");
                return;
            }
        }

        this.semanas.push(
            this.fb.group({
                cod_metexp: ['', Validators.required],
                nom_metexp: ['', Validators.required],
                ind_calculo_dilucion: ['', Validators.required],
                ind_calculo_leyes_min: ['', Validators.required],
                ind_act: ['', Validators.required]
            })
        );

        this.message.set('');
    }

    // =====================================================
    //   ELIMINAR FILA
    // =====================================================
    eliminarFila(index: number) {
        this.semanas.removeAt(index);
        this.message.set(`Fila ${index + 1} eliminada.`);
    }

    // =====================================================
    //   SUBMIT SOLO DE LA ÚLTIMA FILA
    // =====================================================
    ngOnInit() {
        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();

            this.planingCompartido.setMetodoMinado(filas);
            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }

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
