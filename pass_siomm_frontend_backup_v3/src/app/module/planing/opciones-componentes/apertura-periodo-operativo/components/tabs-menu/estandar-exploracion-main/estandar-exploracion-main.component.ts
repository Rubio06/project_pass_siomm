import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DATOS_METODO_EXPLORACION, EstructuraDatosOtros, SelectZona, TH_ESTANDAR_EXPLORACION, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartido } from '../../../services/planing-compartido.service';

@Component({
    selector: 'app-estandar-exploracion-main',
    imports: [ReactiveFormsModule, SpinnerComponent],
    templateUrl: './estandar-exploracion-main.component.html',
    styleUrl: './estandar-exploracion-main.component.css',
})
export class EstandarExploracionMainComponent {


    // // Utilidades
    // formUtils = FormUtils;

    // // Configuración de tabla (Señales)
    // columnas = signal<thTitulos[]>(TABLA_DATOS_ESTANDAR_EXPLORACION);
    // titulo = this.columnas().map(titulo => titulo.titulo);

    // // Estado de la UI (Señales)
    // message = signal<string>('');
    // loading = signal(false);
    // // Señal de estado de bloqueo (adaptado de MetodoMinado)
    // readonly estaBloqueado: WritableSignal<boolean> = signal(false);

    // // Señales de Lookups (adaptado de MetodoMinado)
    // listZona = signal<SelectZona[]>([])

    // // Configuración de los datos de la columna (adaptado de ExploracionEstandar original)
    // datosColumna = signal<any[]>([
    //     { tipo: 'select', type: 'text', name: 'cod_zona', width: '210px' },
    //     { tipo: 'input', type: 'text', name: 'lab_pieper', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_broca', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_barcon', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_barren', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_facpot', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_fulmin', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_conect', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_punmar', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_tabla', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'ind_act', width: '20px' },
    //     { tipo: 'input', type: 'text', name: 'lab_apr', width: '20px' },
    // ])
    // cod_metexp = signal<any[]>([]) // Se mantiene la señal cod_metexp aunque parezca no usarse directamente.

    // // Formulario principal
    // myForm: FormGroup = this.fb.group({
    //     semanas: this.fb.array([]) // El FormArray se sigue llamando 'semanas'
    // });

    // // Getter para acceder fácilmente al FormArray
    // get semanas(): FormArray {
    //     return this.myForm.get('semanas') as FormArray;
    // }

    // constructor() {
    //     // Efecto 1 (Carga de Datos Inicial/Cambio): Reacciona a la signal 'dataRoutes' del servicio.
    //     const dataRoutes = this.planingService.data();
    //     // Para prevenir ExpressionChangedAfterItHasBeenCheckedError en los efectos iniciales

    //     setTimeout(() => {
    //         this.recargarSemanasConDatos(dataRoutes);
    //     }, 0);

    //     // Llamada al servicio de lookups al cargar (se mantiene la lógica original)
    //     this.SelectZona();

    //     // Efecto 2 (Bloqueo): Reacciona a la signal de bloqueo del servicio.
    //     effect(() => {
    //         // Para prevenir ExpressionChangedAfterItHasBeenCheckedError
    //         setTimeout(() => {
    //             this.bloqueoFormulario();
    //         }, 0);
    //     });
    // }

    // /**
    //  * Reconstruye el FormArray 'semanas' con los datos proporcionados y aplica el patchValue al formulario principal.
    //  * Es la fuente única de la carga de datos (adaptado de MetodoMinado).
    //  * @param dataRoutes Datos completos de la ruta o selección.
    //  */
    // private recargarSemanasConDatos(dataRoutes: any): void {
    //     this.message.set('');

    //     // Si no hay datos, reseteamos todo.
    //     if (!dataRoutes || Object.keys(dataRoutes).length === 0) {
    //         this.resetearFormulario();
    //         return;
    //     }

    //     // ADAPTADO: La data de la tabla está en exploracion_extandar
    //     const dataExploracionEstandar = dataRoutes?.data?.exploracion_extandar;

    //     // Si la estructura existe pero la parte de exploracion_extandar está vacía, solo limpiamos el FormArray.
    //     if (!dataExploracionEstandar || dataExploracionEstandar.length === 0) {
    //         this.semanas.clear();
    //         this.myForm.patchValue(dataRoutes); // Parchea otros campos del formulario principal
    //         return;
    //     }

    //     this.loading.set(true);

    //     // NOTA: Se mantiene el setTimeout(500) para simular la latencia asíncrona.
    //     setTimeout(() => {
    //         this.obtenerDatos(dataExploracionEstandar); // Limpia y rellena this.semanas
    //         this.myForm.patchValue(dataRoutes); // Parchea otros campos del formulario principal
    //         this.loading.set(false);
    //     }, 500);
    // }

    // /**
    //  * Gestiona la habilitación/deshabilitación del formulario en respuesta al estado de bloqueo.
    //  * (Adaptado de MetodoMinado)
    //  */
    // bloqueoFormulario() {
    //     const bloqueado = this.planingService.bloqueoForm();
    //     this.estaBloqueado.set(bloqueado);

    //     if (bloqueado) {
    //         this.myForm.disable();
    //         // ADAPTADO: Limpiamos los datos del FormArray para que la tabla se vea vacía al estar bloqueada.
    //         this.semanas.clear();
    //     } else {
    //         this.myForm.enable();

    //         // Si se desbloquea, recargamos la data
    //         const dataRoutes = this.planingService.data();
    //         this.recargarSemanasConDatos(dataRoutes);
    //     }
    // }


    // /**
    //  * Limpia completamente el formulario, reseteando los valores y vaciando el FormArray.
    //  * (Adaptado de MetodoMinado)
    //  */
    // resetearFormulario() {
    //     this.myForm.reset();
    //     this.semanas.clear(); // Asegura que el FormArray se vacíe
    // }

    // /**
    //  * Construye y rellena el FormArray 'semanas' a partir de un arreglo de datos de Exploracion Estandar.
    //  * La lógica interna de creación de FormGroup se mantiene de ExploracionEstandar original.
    //  * @param data Arreglo de objetos.
    //  */
    // obtenerDatos(data: any[]) {
    //     // Limpiamos el FormArray existente antes de rellenar
    //     this.semanas.clear();

    //     const grupos = data.map((item, index) => {
    //         return this.fb.group({
    //             // Se mantiene la lógica de inhabilitación original
    //             cod_zona: [{
    //                 value: this.listZona()[index]?.des_zona || item.cod_zona || '',
    //                 disabled: true
    //             }, [Validators.required]],

    //             // Se mantienen los campos y valores originales de ExploracionEstandar
    //             lab_pieper: [{ value: item.lab_pieper, disabled: true }],
    //             lab_broca: [{ value: item.lab_broca, disabled: true }],
    //             lab_barcon: [{ value: item.lab_barcon, disabled: true }],
    //             lab_barren: [{ value: item.lab_barren, disabled: true }],
    //             lab_facpot: [{ value: item.lab_facpot, disabled: true }],
    //             lab_fulmin: [{ value: item.lab_fulmin, disabled: true }],
    //             lab_conect: [{ value: item.lab_conect, disabled: true }],
    //             lab_punmar: [{ value: item.lab_punmar, disabled: true }],
    //             lab_tabla: [{ value: item.lab_tabla, disabled: true }],
    //             ind_act: [{ value: item.ind_act, disabled: true }],
    //             lab_apr: [{ value: item.lab_apr, disabled: true }],

    //             accion: new FormControl({ value: '', disabled: true })

    //         });
    //     });

    //     // Rellenamos el FormArray
    //     grupos.forEach(group => this.semanas.push(group));
    // }

    // /**
    //  * Agrega una nueva fila (FormGroup) al FormArray 'semanas'.
    //  * (Lógica original de ExploracionEstandar, solo se remueve la validación de length === 0)
    //  */
    // agregarFilas() {
    //     // Se podría agregar validación de la última fila aquí, similar a MetodoMinado,
    //     // pero se mantiene la simpleza original del segundo snippet:
    //     const nuevaSemana = this.crearFila();
    //     this.semanas.push(nuevaSemana);
    //     this.message.set('');
    // }

    // /**
    //  * Crea un FormGroup con validaciones para una nueva fila editable.
    //  */
    // private crearFila(): FormGroup {
    //     this.planingService.setBloqueo(false);

    //     // Se mantienen los validadores y campos originales de ExploracionEstandar
    //     return this.fb.group({
    //         cod_zona: ['', [Validators.required]],
    //         lab_pieper: ['', [Validators.required]],
    //         lab_broca: ['', [Validators.required]],
    //         lab_barcon: ['', [Validators.required]],
    //         lab_barren: ['', [Validators.required]],
    //         lab_facpot: ['', [Validators.required]],
    //         lab_fulmin: ['', [Validators.required]],
    //         lab_conect: ['', [Validators.required]],
    //         lab_punmar: ['', [Validators.required]],
    //         lab_tabla: ['', [Validators.required]],
    //         ind_act: ['', [Validators.required]],
    //         lab_apr: ['', [Validators.required]],
    //     });
    // }


    // /**
    //  * Procesa y envía los datos del formulario.
    //  * (Se reemplaza alert() por manejo de mensajes en consola y UI)
    //  */
    // onSubmit() {
    //     if (this.myForm.invalid) {
    //         this.myForm.markAllAsTouched();
    //         // Adaptado: Reemplazado alert()
    //         console.error('Debe completar todos los datos del formulario.');
    //         this.message.set('ERROR: Debe completar todos los datos del formulario para poder enviar.');
    //         return;
    //     }

    //     this.message.set('Datos enviados correctamente (simulación).');
    //     console.log('Payload Exploracion Estandar listo para envío:', this.myForm.getRawValue());

    //     // Lógica de guardado real...
    // }

    // /**
    //  * Llama al servicio para obtener la lista de Zonas (Lookups).
    //  */
    // public SelectZona() {
    //     this.planingService.SelectZona().subscribe({
    //         next: (data: any) => {
    //             this.listZona.set(data);
    //         }, error: (error) => {
    //             console.error('Error al traer las zonas.', error)
    //         }
    //     })
    // }

    // /**
    //  * Elimina una fila específica del FormArray.
    //  * @param index Índice de la fila a eliminar.
    //  */
    // eliminarFila(index: number) {
    //     const fila = this.semanas.at(index).getRawValue();

    //     console.log("Fila que se eliminará:", fila);

    //     this.semanas.removeAt(index);

    //     console.log("Fila eliminada correctamente");
    //     this.message.set(`Fila ${index + 1} eliminada correctamente.`);
    // }



    // ===============================
    //   IMPORTS
    // ===============================
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);

    planingCompartido = inject(PlaningCompartido);

    // ===============================
    //   CONFIGURACIÓN DE TABLA
    // ===============================
    columnas = signal<any[]>(TH_ESTANDAR_EXPLORACION);
    titulo = this.columnas().map(t => t.titulo);

    datosColumna = signal<EstructuraDatosOtros[]>(DATOS_METODO_EXPLORACION);

    listZona = signal<SelectZona[]>([]);
    cod_metexp = signal<any[]>([]);

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
         * 📌 CARGA INICIAL
         * - Solo carga la data si el FormArray está vacío
         * - No se usan setTimeout innecesarios
         */
        effect(() => {
            const dataRoutes = this.planingService.data();

            if (!dataRoutes) return;

            // Si no hay filas, cargamos data
            if (this.semanas.length === 0) {
                const exploracion = dataRoutes.data?.exploracion_extandar ?? [];
                this.loadSemanas(exploracion);

                // Parchear otros campos del formulario si los hay
                this.myForm.patchValue(dataRoutes);
            }
        });
        
        /**
         * 📌 BLOQUEO CENTRALIZADO
         */
        effect(() => {
            const bloqueado = this.planingService.bloqueoForm();
            this.estaBloqueado.set(bloqueado);

            bloqueado ? this.myForm.disable() : this.myForm.enable();

            // Si se desbloquea y no hay filas, recargar
            if (!bloqueado && this.semanas.length === 0) {
                const dataRoutes = this.planingService.data();
                const exploracion = dataRoutes?.data?.exploracion_extandar ?? [];
                this.loadSemanas(exploracion);
            }
        });

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

    /**
     * Elimina fila específica
     */
    eliminarFila(index: number) {
        const fila = this.semanas.at(index).getRawValue();
        console.log("Fila que se eliminará:", fila);

        this.semanas.removeAt(index);
        this.message.set(`Fila ${index + 1} eliminada correctamente.`);
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


