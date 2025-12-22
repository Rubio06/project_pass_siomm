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

    cod_zona = signal<SelectZona[]>([]);
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
    bloqueoBotonNuevo = signal<boolean>(true);


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
            const data = this.planingCompartido.dataRoutes();
            const semanas = data?.data?.exploracion_extandar || [];

            this.loadSemanas(semanas);
            this.myForm.patchValue(data || {}, { emitEvent: false });

            this.cd.detectChanges();              // opcional

        });

        ///boton editar
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

        ///BOTON VISUALIZAR

        effect(() => {
            const signal = this.planingCompartido.visualizarForms();
            if (signal > 0) {
                this.blockForm();
                this.resetForm();

                // this.resetSelects(); // limpia selects
            }
        });
        this.loadZonas();


    }

    blockForm() {
        this.myForm.disable(); // bloquea todos los campos
        // this.filas.forEach(f => f.disable()); // bloquea filas si tienes tabla
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

            const cod = this.cod_zona()[index];
            if (!cod) return;

            this.semanas.push(
                this.fb.group({
                    cod_zona: [item.cod_zona(index).des_zona, Validators.required],
                    lab_pieper: [item.lab_pieper || ''],
                    lab_broca: [item.lab_broca || ''],
                    lab_barcon: [item.lab_barcon || ''],
                    lab_barren: [item.lab_barren || ''],
                    lab_facpot: [item.lab_facpot || ''],
                    lab_fulmin: [item.lab_fulmin || ''],
                    lab_conect: [item.lab_conect || ''],
                    lab_punmar: [item.lab_punmar || ''],
                    lab_tabla: [item.lab_tabla || ''],
                    ind_act: [item.ind_act || ''],
                    lab_apr: [item.lab_apr || ''],
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

        if (this.semanas.length >= 1) {
            return;
        }

        this.planingCompartido.setBloqueoFormEditar(false);

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
                esNuevo: [true]

            })
        );

        this.planingCompartido.setBloqueo(false);
        this.message.set('');
    }


    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;


        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            this.cd.detectChanges();
            return;
        }


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
            next: (data: any) => this.cod_zona.set(data),
            error: (err) => console.error('Error al cargar zonas:', err),
        });
    }


}


