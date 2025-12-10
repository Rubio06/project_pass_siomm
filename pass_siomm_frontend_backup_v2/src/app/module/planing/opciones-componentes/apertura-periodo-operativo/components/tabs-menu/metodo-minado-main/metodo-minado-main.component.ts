import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit, WritableSignal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { ColumnaTabla, SelectExploracion, TABLA_DATOS_METODO_MINADO } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-metodo-minado-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './metodo-minado-main.component.html',
    styleUrl: './metodo-minado-main.component.css',
})
export class MetodoMinadoMainComponent {
    // Servicios y dependencias inyectadas
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);
    // Aunque no se usa en el onSubmit de Metodo Minado, se mantiene por la estructura solicitada.
    private semanasAvanceMainService = inject(SemanasAvanceMainService);

    // Utilidades
    formUtils = FormUtils;

    // Configuración de tabla (Señales) - ADAPTADO A MÉTODO MINADO
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_METODO_MINADO);
    titulo = this.columnas().map(titulo => titulo.titulo);

    // Estado de la UI (Señales)
    message = signal<string>('');
    loading = signal(false);
    readonly estaBloqueado: WritableSignal<boolean> = signal(false);

    // Configuración de los datos de la columna - ADAPTADO A MÉTODO MINADO
    datosColumna = signal<any[]>([
        { type: 'select', name: 'cod_metexp', placeholder: 'Seleccione un método' },
        { type: 'text', name: 'nom_metexp', placeholder: 'Ingrese nombre' },
        { type: 'select', name: 'ind_calculo_dilucion', placeholder: 'Seleccione' },
        { type: 'select', name: 'ind_calculo_leyes_min', placeholder: 'Seleccione' },
        { type: 'select', name: 'ind_act', placeholder: 'Seleccione' },
    ]);

    // Señales de Lookups - ADAPTADO A MÉTODO MINADO
    cod_metexp = signal<SelectExploracion[]>([])

    ind_calculo_dilucion = signal<any[]>([
        { value: 1, label: 'Contrato' },
        { value: 2, label: 'O´hara' }
    ]);

    ind_calculo_leyes_min = signal<any[]>([
        { value: 1, label: 'Contrato' },
        { value: 2, label: 'O´hara' }
    ]);

    ind_act = signal<any[]>([
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' }
    ]);


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
        const dataRoutes = this.planingService.dataRoutes();
        // Para prevenir ExpressionChangedAfterItHasBeenCheckedError en los efectos iniciales
        setTimeout(() => {
            this.recargarSemanasConDatos(dataRoutes);
        }, 0);

        // Llamada al servicio de lookups al cargar (se mantiene la lógica original)
        this.SelectExploracion();

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

        // ADAPTADO: La data de la tabla está en metodo_minado
        const dataMetodoMinado = dataRoutes?.data?.metodo_minado;

        // Si la estructura existe pero la parte de metodo_minado está vacía, solo limpiamos el FormArray.
        if (!dataMetodoMinado || dataMetodoMinado.length === 0) {
            this.semanas.clear();
            this.myForm.patchValue(dataRoutes); // Parchea otros campos del formulario principal
            return;
        }

        this.loading.set(true);

        // NOTA: Se mantiene el setTimeout(500) para simular la latencia asíncrona.
        setTimeout(() => {
            this.obtenerDatos(dataMetodoMinado); // Limpia y rellena this.semanas
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
            const dataRoutes = this.planingService.dataRoutes();
            this.recargarSemanasConDatos(dataRoutes);
        }
    }


    /**
     * Limpia completamente el formulario, reseteando los valores y vaciando el FormArray.
     */
    resetearFormulario() {
        this.myForm.reset();
        this.semanas.clear(); // Asegura que el FormArray se vacíe
    }

    /**
     * Construye y rellena el FormArray 'semanas' a partir de un arreglo de datos de Metodo Minado.
     * @param data Arreglo de objetos.
     */
    obtenerDatos(data: any[]) {

        // ADAPTADO: Lógica de inicialización de Metodo Minado (usando los lookups)
        const grupos = data.map((item, index) => {
            // Se asume que item tiene las propiedades necesarias para la inicialización real de un FormGroup
            // La lógica proporcionada por el usuario es la siguiente (y se mantiene, aunque parezca incompleta para un 'patch' de datos):
            return this.fb.group({
                // Se está usando el nombre del metodo de exploracion como valor inicial
                cod_metexp: [{ value: this.cod_metexp()[index]?.nom_metexp || item.cod_metexp, disabled: true }, [Validators.required]],
                nom_metexp: [{ value: item.nom_metexp || '', disabled: true }, [Validators.required]],
                ind_calculo_dilucion: [{ value: this.ind_calculo_dilucion()[0].label, disabled: true }], // Valor hardcodeado (lógica original)
                ind_calculo_leyes_min: [{ value: this.ind_calculo_leyes_min()[0].label, disabled: true }], // Valor hardcodeado (lógica original)
                ind_act: [{ value: this.ind_act()[0].label, disabled: true }], // Valor hardcodeado (lógica original)
                accion: new FormControl({ value: '', disabled: true })

            });
        });

        // Limpiamos el FormArray existente antes de rellenar
        this.semanas.clear();
        grupos.forEach(group => this.semanas.push(group));
    }

    /**
     * Agrega una nueva fila (FormGroup) al FormArray 'semanas'.
     */
    agregarFilas() {
        // ADAPTADO: Se remueve la lógica de correlativo numérico.
        if (this.semanas.length > 0) {
            const ultimaFila = this.semanas.at(this.semanas.length - 1) as FormGroup;

            // Validación de la última fila antes de agregar una nueva
            if (ultimaFila.invalid) {
                ultimaFila.markAllAsTouched();
                console.warn("Debe completar la fila actual antes de agregar otra.");
                this.message.set('Debe completar la fila actual antes de agregar otra.');
                return;
            }
        }

        this.semanas.push(this.crearFila());
        this.message.set('');
    }

    /**
     * Crea un FormGroup con validaciones para una nueva fila editable.
     */
    private crearFila(): FormGroup {
        this.planingService.setBloqueo(false);

        // ADAPTADO: Se usan los validadores de Metodo Minado, no el regex de fecha.
        return this.fb.group({
            cod_metexp: ['', [Validators.required]],
            nom_metexp: ['', [Validators.required]],
            ind_calculo_dilucion: ['', [Validators.required]],
            ind_calculo_leyes_min: ['', [Validators.required]],
            ind_act: ['', [Validators.required]]
        });

    }


    /**
     * Procesa y envía los datos de la última fila, incluyendo la lógica de duplicados.
     */
    onSubmit() {
        const ultimaFila = this.semanas.at(this.semanas.length - 1);

        // Validar que la última fila esté completa
        if (ultimaFila.invalid) {
            ultimaFila.markAllAsTouched();
            // ADAPTADO: Se reemplaza alert() por mensaje de error en la consola y la UI
            console.error('Completa todos los campos de la última fila');
            this.message.set('Completa todos los campos de la última fila para poder enviar.');
            return;
        }

        const lastRow = ultimaFila.getRawValue(); // incluye campos disabled (si los hubiera)
        const selectedValue = lastRow.cod_metexp; // valor del select

        // Verificar si ya existe en otras filas (excluyendo la última)
        const existeDuplicado = this.semanas.controls
            .slice(0, this.semanas.length - 1)
            .some(control => control.get('cod_metexp')?.value === selectedValue);

        if (existeDuplicado) {
            // ADAPTADO: Se reemplaza alert() por mensaje de error en la consola y la UI
            console.error('La opción seleccionada ya se encuentra seleccionada en otra fila.');
            this.message.set('ERROR: La opción seleccionada ya se encuentra seleccionada en otra fila.');
            return;
        }

        this.message.set('Datos enviados correctamente (simulación).');
        console.log('Payload Metodo Minado listo para envío:', lastRow);

        // Lógica de guardado real (no incluida en el snippet del usuario, se omite el subscribe)
    }

    /**
     * Llama al servicio para obtener la lista de Métodos de Exploración (Lookups).
     */
    public SelectExploracion() {
        this.planingService.SelectExploracion().subscribe({
            next: (data: any) => {
                this.cod_metexp.set(data);
            }, error: (error) => {
                console.error('Error al traer los métodos de exploración.', error)
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
