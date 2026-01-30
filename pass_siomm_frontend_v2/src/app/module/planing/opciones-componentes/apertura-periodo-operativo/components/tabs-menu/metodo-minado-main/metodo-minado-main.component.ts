import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DATOS_METODO_MINADO, MaePerMetExplotacion, SelectExploracion, TH_METODOLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import { FormUtils } from 'src/app/utils/form-utils';

@Component({
    selector: 'app-metodo-minado-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './metodo-minado-main.component.html',
    styleUrl: './metodo-minado-main.component.css',
})
export class MetodoMinadoMainComponent {

    columnas = signal<thTitulos[]>(TH_METODOLO_MINADO);
    titulo = this.columnas().map(t => t.titulo);

    datosColumna = signal<any[]>(DATOS_METODO_MINADO);

    planingCompartido = inject(PlaningCompartidoService);

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

    modoVisualizar = signal<boolean>(false);

    cod_metexp = signal<SelectExploracion[]>([]);

    ind_calculo_dilucion = signal<any[]>([
        { value: 'C', label: 'Contrato' },
        { value: null, label: 'O´hara' }
    ]);

    ind_calculo_leyes_min = signal<any[]>([
        { value: 'C', label: 'Contrato' },
        { value: null, label: 'O´hara' }
    ]);

    ind_act = signal<any[]>([
        { value: 'S', label: 'Sí' },
        { value: null, label: 'No' }
    ]);

    private cd = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.metodo_minado || [];

            this.loadSemanas(semanas);
            this.myForm.patchValue(data || {}, { emitEvent: false });
            // this.cd.detectChanges();

        });

        this.loadSelectExploracion();

        // Lookups iniciales


        // effect(() => {
        //     if (!this.myForm) return;

        //     if (this.planingCompartido.bloqueoFormGeneral()) {
        //         this.myForm.disable({ emitEvent: false });
        //     } else {
        //         this.myForm.enable({ emitEvent: false });
        //     }
        // });
    }


    // hasPendingChanges(): boolean {
    //     return this.planingCompartido.getCambios(); // revisa los cambios pendientes
    // }





    blockForm() {
        this.myForm.disable(); // bloquea todos los campos
        // this.filas.forEach(f => f.disable()); // bloquea filas si tienes tabla
    }

    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }



    // =====================================================
    //   CARGAR DATOS DESDE BACKEND
    // =====================================================
    loadSemanas(data: MaePerMetExplotacion[]) {
        this.semanas.clear(); // limpiar FormArray

        const periodo = this.planingCompartido.periodo();

        data.forEach(item => {

            this.semanas.push(
                this.fb.group({
                    cie_ano: [periodo?.anio],
                    cie_per: [periodo?.mes],
                    cod_metexp: [{ value: item.cod_metexp, disabled: true }, Validators.required],
                    nom_metexp: [item.nom_metexp || '', Validators.required],
                    ind_calculo_dilucion: [item.ind_calculo_dilucion || ''],
                    ind_calculo_leyes_min: [item.ind_calculo_leyes_min || ''],
                    ind_act: [item.ind_act || ''],
                    accion: [''],
                    esNuevo: [false]
                })
            );
        });

    }

    // =====================================================
    //   AGREGAR FILA NUEVA (EDITABLE)
    // =====================================================


    agregarFilas() {

        const periodo = this.planingCompartido.periodo();


        const nuevoGrupo = this.fb.group({
            cie_ano: [periodo?.anio, Validators.required],
            cie_per: [periodo?.mes, Validators.required],
            cod_metexp: ['', Validators.required], // 👈 CLAVE
            nom_metexp: ['', Validators.required],
            ind_calculo_dilucion: ['', Validators.required],
            ind_calculo_leyes_min: ['', Validators.required],
            ind_act: ['', Validators.required],
            esNuevo: [true],
        });

        this.semanas.push(nuevoGrupo);

        const filaNueva = this.semanas.at(this.semanas.length - 1);
        this.enviarFilaNueva(filaNueva!);

    }



    // =====================================================
    //   ELIMINAR FILA
    // =====================================================
    async eliminarFila(data: any, index: number) {

        const periodo = this.planingCompartido.periodo();

        const semana = data.getRawValue ? data.getRawValue() : data.value;
        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            this.cd.detectChanges();
            return;
        }

        const payload = {
            cod_metexp: semana.cod_metexp,
            cie_ano: periodo?.anio,
            cie_per: periodo?.mes,
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


    bloquearCampo(row: AbstractControl): boolean {
        return !row.get('esNuevo')?.value;
    }



    enviarFilaNueva(row: AbstractControl) {

        // this.planingCompartido.registerForm('metodo_minado', this.myForm);
        // this.planingCompartido.setActiveTab('metodo_minado');
        this.myForm.valueChanges.subscribe(val => {
            const payload = row.getRawValue(); // objeto plano

            console.log(payload);
            this.planingCompartido.setMetodoMinado(payload, 'metodo_minado');
        });
    }


    // =====================================================
    //   SUBMIT SOLO DE LA ÚLTIMA FILA
    // =====================================================
    ngOnInit() {

        // this.planingCompartido.registerForm('metodo_minado', this.myForm);
        // this.planingCompartido.setActiveTab('metodo_minado');
        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();

            // console.log(filas)
            this.planingCompartido.setMetodoMinado(filas, 'metodo_minado');
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
