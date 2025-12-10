import { Component, signal, input, effect, inject, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { FormUtils } from 'src/app/utils/form-utils';
import { ColumnaTabla, SelectTipoLabor, TABLA_DATOS_ESTANDAR_AVANCE } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';

@Component({
    selector: 'app-estandar-avance',
    imports: [ReactiveFormsModule, SpinnerComponent],
    templateUrl: './estandar-avance-main.component.html',
    styleUrl: './estandar-avance-main.component.css',
})
export class EstandarAvanceComponent {

    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);

    // Utilidades
    formUtils = FormUtils;

    // Configuración de tabla (Señales)
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_ESTANDAR_AVANCE);
    titulo = this.columnas().map(titulo => titulo.titulo);

    // Estado de la UI (Señales)
    message = signal<string>('');
    loading = signal(false);
    // Señal de estado de bloqueo (ADAPTADO)
    readonly estaBloqueado: WritableSignal<boolean> = signal(false);

    // Señales de Lookups
    listLabor = signal<SelectTipoLabor[]>([])

    // Configuración de los datos de la columna (se mantiene el original)
    datosColumna = signal<any[]>([
        { type: 'select', name: 'cod_tiplab', width: '210px' },
        { type: 'text', name: 'nro_lab_ancho', width: '20px' },
        { type: 'text', name: 'nro_lab_altura', width: '20px' },
        { type: 'text', name: 'nro_lab_pieper', width: '20px' },
        { type: 'text', name: 'nro_lab_broca', width: '20px' },
        { type: 'text', name: 'nro_lab_barcon', width: '20px' },
        { type: 'text', name: 'nro_lab_barren', width: '20px' },
        { type: 'text', name: 'nro_lab_facpot', width: '20px' },
        { type: 'text', name: 'nro_lab_fulmin', width: '20px' },
        { type: 'text', name: 'nro_lab_conect', width: '20px' },
        { type: 'text', name: 'nro_lab_punmar', width: '20px' },
        { type: 'text', name: 'nro_lab_tabla', width: '20px' },
    ])

    // Formulario principal
    myForm: FormGroup = this.fb.group({
        semanas: this.fb.array([]) // El FormArray se sigue llamando 'semanas'
    });

    // Getter para acceder fácilmente al FormArray
    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    constructor() {
        // Efecto 1 (Carga de Datos Inicial/Cambio): Reacciona a la signal 'dataRoutes' del servicio.
        effect(() => {
            const dataRoutes = this.planingService.data();
            // Para prevenir ExpressionChangedAfterItHasBeenCheckedError en los efectos iniciales
            setTimeout(() => {
                this.recargarSemanasConDatos(dataRoutes);
            }, 0);

            // Llamada al servicio de lookups al cargar (se mantiene la lógica original)
            console.log(this.SelectTipoLabor())

        });

        // Efecto 2 (Bloqueo): Reacciona a la signal de bloqueo del servicio.
        effect(() => {
            // Para prevenir ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => {
                this.bloqueoFormulario();
            }, 0);
        });
    }

    /**
     * Reconstruye el FormArray 'semanas' con los datos proporcionados y aplica el patchValue al formulario principal.
     * Es la fuente única de la carga de datos.
     * @param dataRoutes Datos completos de la ruta o selección.
     */
    private recargarSemanasConDatos(dataRoutes: any): void {
        this.message.set('');

        // Si no hay datos en la ruta o están vacíos, reseteamos todo.
        if (!dataRoutes || Object.keys(dataRoutes).length === 0) {
            this.resetearFormulario();
            return;
        }

        // ADAPTADO: La data de la tabla está en laboratorio_estandar
        const dataLaborEstandar = dataRoutes?.data?.laboratorio_estandar;

        // Si la estructura existe pero la parte de laboratorio_estandar está vacía, solo limpiamos el FormArray.
        if (!dataLaborEstandar || dataLaborEstandar.length === 0) {
            this.semanas.clear();
            this.myForm.patchValue(dataRoutes); // Parchea otros campos del formulario principal
            return;
        }

        this.loading.set(true);

        // NOTA: Se mantiene el setTimeout(500) para simular la latencia asíncrona.
        setTimeout(() => {
            this.obtenerDatos(dataLaborEstandar); // Limpia y rellena this.semanas
            this.myForm.patchValue(dataRoutes); // Parchea otros campos del formulario principal
            this.loading.set(false);
        }, 500);
    }

    /**
     * Gestiona la habilitación/deshabilitación del formulario en respuesta al estado de bloqueo.
     */
    bloqueoFormulario() {
        const bloqueado = this.planingService.bloqueoForm();
        this.estaBloqueado.set(bloqueado);

        if (bloqueado) {
            this.myForm.disable();
            // ADAPTADO: Limpiamos los datos del FormArray para que la tabla se vea vacía al estar bloqueada.
            this.semanas.clear();
        } else {
            this.myForm.enable();

            // Si se desbloquea, recargamos la data
            const dataRoutes = this.planingService.data();
            this.recargarSemanasConDatos(dataRoutes);
        }
    }


    /**
     * Limpia completamente el formulario, reseteando los valores y vaciando el FormArray.
     * (Se simplifica el reset a solo form.reset() y se vacía el FormArray)
     */
    resetearFormulario() {
        this.myForm.reset();
        this.semanas.clear(); // Asegura que el FormArray se vacíe
    }

    /**
     * Construye y rellena el FormArray 'semanas' a partir de un arreglo de datos de Laboratorio Estandar.
     * @param data Arreglo de objetos.
     */
    obtenerDatos(data: any[]) {
        // Limpiamos el FormArray existente antes de rellenar
        this.semanas.clear();

        const grupos = data.map((item, index) => {
            // Se mantiene la lógica original de obtener datos
            return this.fb.group({
                cod_tiplab: [{
                    value: this.listLabor()[index]?.nom_tipo_labor || item.cod_tipo_labor || '',
                    disabled: true // Asumiendo que las filas cargadas deben estar deshabilitadas
                }, [Validators.required]],

                nro_lab_ancho: [{ value: item.nro_lab_ancho, disabled: true }],
                nro_lab_altura: [{ value: item.nro_lab_altura, disabled: true }],
                nro_lab_pieper: [{ value: item.nro_lab_pieper, disabled: true }],
                nro_lab_broca: [{ value: item.nro_lab_broca, disabled: true }],
                nro_lab_barcon: [{ value: item.nro_lab_barcon, disabled: true }],
                nro_lab_barren: [{ value: item.nro_lab_barren, disabled: true }],
                nro_lab_facpot: [{ value: item.nro_lab_facpot, disabled: true }],
                nro_lab_fulmin: [{ value: item.nro_lab_fulmin, disabled: true }],
                nro_lab_conect: [{ value: item.nro_lab_conect, disabled: true }],
                nro_lab_punmar: [{ value: item.nro_lab_punmar, disabled: true }],
                nro_lab_tabla: [{ value: item.nro_lab_tabla, disabled: true }],
                accion: [({ value: '', disabled: true })]

            });
        });

        // Rellenamos el FormArray
        grupos.forEach(group => this.semanas.push(group));
    }


    /**
     * Agrega una nueva fila (FormGroup) al FormArray 'semanas'.
     */
    agregarFilas() {
        // Se mantiene la lógica original de solo agregar si está vacío
        if (this.semanas.length === 0) {
            const nuevaSemana = this.crearFila();
            this.semanas.push(nuevaSemana);
            this.message.set('');
        } else {
            console.warn("La lógica original solo permite una fila. Si desea agregar más, ajuste la condición.");
        }
    }

    /**
     * Crea un FormGroup con validaciones para una nueva fila editable.
     */
    private crearFila(): FormGroup {
        this.planingService.setBloqueo(false);

        // Se mantienen los validadores y campos originales
        return this.fb.group({
            cod_tiplab: ['', [Validators.required]],
            nro_lab_ancho: ['', [Validators.required]],
            nro_lab_altura: ['', [Validators.required]],
            nro_lab_pieper: ['', [Validators.required]],
            nro_lab_broca: ['', [Validators.required]],
            nro_lab_barcon: ['', [Validators.required]],
            nro_lab_barren: ['', [Validators.required]],
            nro_lab_facpot: ['', [Validators.required]],
            nro_lab_fulmin: ['', [Validators.required]],
            nro_lab_conect: ['', [Validators.required]],
            nro_lab_punmar: ['', [Validators.required]],
            nro_lab_tabla: ['', [Validators.required]],
        });
    }

    /**
     * Procesa y envía los datos del formulario.
     * (Se reemplaza alert() por manejo de mensajes en consola y UI)
     */
    onSubmit() {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            // ADAPTADO: Reemplazado alert()
            console.error("Debe completar todos los datos del formulario.");
            this.message.set('ERROR: Debe completar todos los datos del formulario para poder enviar.');
            return;
        }

        this.message.set('Datos enviados correctamente (simulación).');
        console.log('Payload Laboratorio Estandar listo para envío:', this.myForm.getRawValue());

        // Lógica de guardado real...
    }

    /**
     * Llama al servicio para obtener la lista de Tipos de Labor (Lookups).
     */
    public SelectTipoLabor() {
        this.planingService.SelectTipoLabor().subscribe({
            next: (data: any) => {

                console.log(data)
                this.listLabor.set(data);
            }, error: (error) => {
                console.error('Error al traer los tipos de labor.', error)
            }
        })
    }


    /**
     * Elimina una fila específica del FormArray.
     * @param index Índice de la fila a eliminar.
     */
    eliminarFila(index: number) {
        const fila = this.semanas.at(index).getRawValue();

        console.log("Fila que se eliminará:", fila);

        this.semanas.removeAt(index);

        console.log("Fila eliminada correctamente");
        this.message.set(`Fila ${index + 1} eliminada correctamente.`);
    }
}


