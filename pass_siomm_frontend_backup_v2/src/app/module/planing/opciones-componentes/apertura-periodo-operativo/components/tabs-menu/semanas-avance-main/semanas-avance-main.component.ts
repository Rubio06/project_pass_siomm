import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { FormUtils } from 'src/app/utils/form-utils';

import { ColumnaTabla, MaeSemanaAvance, MaeSemanaCiclo, TABLA_DATOS_SEMANAS_AVANCES } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { SemanasAvanceMainService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/semanas-avance-main/semanas-avance-main.service';

@Component({
    selector: 'app-semanas-avance-main',
    standalone: true, // Agregado standalone: true para consistencia con el componente Ciclo
    imports: [ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './semanas-avance-main.component.html',
    styleUrl: './semanas-avance-main.component.css',
})
export class SemanasAvanceMainComponent {


    // Servicios y dependencias inyectadas
    private fb = inject(FormBuilder);
    private planingService = inject(PlanningService);
    private semanasAvanceMainService = inject(SemanasAvanceMainService);

    // Utilidades
    formUtils = FormUtils;

    // Configuración de tabla (Señales)
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_AVANCES);
    titulo = this.columnas().map(titulo => titulo.titulo);

    // Estado de la UI (Señales)
    message = signal<string>('');
    loading = signal(false);
    readonly estaBloqueado: WritableSignal<boolean> = signal(false);

    // Configuración de los datos de la columna
    datosColumna = signal<any[]>([
        { type: 'number', name: 'num_semana', placeholder: 'Ingrese una semana ' },
        { type: 'text', name: 'fec_ini', placeholder: '' },
        { type: 'text', name: 'fec_fin', placeholder: '' },
        { type: 'text', name: 'desc_semana', placeholder: '' },
    ])

    // Formulario principal
    myForm: FormGroup = this.fb.group({
        semanas: this.fb.array([])
    });

    // Getter para acceder fácilmente al FormArray
    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    constructor() {
        // Efecto 1 (Carga de Datos Inicial/Cambio): Reacciona a la signal 'dataRoutes' del servicio.
        effect(() => {
            const dataRoutes = this.planingService.dataRoutes();
            this.recargarSemanasConDatos(dataRoutes);
        });

        // Efecto 2 (Bloqueo): Reacciona a la signal de bloqueo del servicio.
        effect(() => {
            this.bloqueoFormulario();
        })
    }

    /**
     * Reconstruye el FormArray 'semanas' con los datos proporcionados y aplica el patchValue al formulario principal.
     * Es la fuente única de la carga de datos.
     * @param dataRoutes Datos completos de la ruta o selección.
     */
    private recargarSemanasConDatos(dataRoutes: any): void {

        // Si no hay datos en la ruta o están vacíos, reseteamos todo.
        if (!dataRoutes || dataRoutes.length === 0) {
            this.resetearFormulario();
            return;
        }

        const dataSemanas = dataRoutes?.data?.semana_avance;

        // Si la estructura existe pero la parte de semanas está vacía, solo limpiamos el FormArray.
        if (!dataSemanas || dataSemanas.length === 0) {
            this.semanas.clear();
            this.myForm.patchValue(dataRoutes);
            return;
        }

        this.loading.set(true);
        this.message.set('');

        // NOTA: En una aplicación real, el 'setTimeout' debería ser reemplazado por
        // una llamada asíncrona real (ej. un Observable de un servicio de datos).
        setTimeout(() => {
            this.obtenerDatos(dataSemanas); // Limpia y rellena this.semanas
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
            // Limpiamos los datos del FormArray para que la tabla se vea vacía al estar bloqueada.
            this.semanas.clear();
        } else {
            this.myForm.enable();

            const dataRoutes = this.planingService.dataRoutes();
            this.recargarSemanasConDatos(dataRoutes);

        }
    }


    /**
     * Limpia completamente el formulario, reseteando los valores y vaciando el FormArray.
     */
    resetearFormulario() {
        this.myForm.reset();
        this.semanas.clear();
    }

    /**
     * Construye y rellena el FormArray 'semanas' a partir de un arreglo de datos.
     * @param data Arreglo de objetos MaeSemanaCiclo.
     */
    obtenerDatos(data: MaeSemanaCiclo[]) {
        const grupos = data.map(item => {
            return this.fb.group({
                // Los campos se marcan como disabled: true, asumiendo que son solo para visualización.
                num_semana: new FormControl({ value: Number(item.num_semana), disabled: true }),
                fec_ini: new FormControl({ value: FormUtils.formatDate(item.fec_ini), disabled: true }),
                fec_fin: new FormControl({ value: FormUtils.formatDate(item.fec_fin), disabled: true }),
                desc_semana: new FormControl({ value: item.desc_semana, disabled: true }),
                accion: new FormControl({value: '', disabled: true})

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
        // Lógica para el primer elemento
        if (this.semanas.length === 0) {
            this.semanas.push(this.crearFila(1));
            return;
        }

        const ultimaFila = this.semanas.at(this.semanas.length - 1) as FormGroup;

        // Validación de la última fila antes de agregar una nueva
        if (ultimaFila.invalid) {
            ultimaFila.markAllAsTouched();
            console.warn("Debe completar la fila actual antes de agregar otra.");
            return;
        }

        // Determinar el correlativo siguiente
        const ultimoNumSemana = ultimaFila.get('num_semana')?.value || 0;
        const siguienteCorrelativo = Number(ultimoNumSemana) + 1;

        this.semanas.push(this.crearFila(siguienteCorrelativo));
    }




    /**
     * Crea un FormGroup con validaciones para una nueva fila editable.
     * @param numSemana Número correlativo de la semana.
     */
    private crearFila(numSemana: number): FormGroup {
        // Este efecto de lado puede estar bien si se requiere habilitar la edición al agregar filas.
        this.planingService.setBloqueo(false);

        const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/\d{4}$/;

        return this.fb.group({
            num_semana: [numSemana, [Validators.required, Validators.min(1), Validators.max(7)]],
            fec_ini: ['', [Validators.required, Validators.pattern(regexFecha)]],
            fec_fin: ['', [Validators.required, Validators.pattern(regexFecha)]],
            desc_semana: ['', [Validators.required]],
        });

    }


    /**
     * Procesa y envía los datos de la última fila.
     */
    onSubmit() {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            // Uso de console.error en lugar de alert() para mejor experiencia de usuario
            console.error("Debe enviar todos los datos");
            return;
        }

        // Usar getRawValue() para incluir los campos deshabilitados (como num_semana, fec_ini/fin si se editan)
        const lastRow = this.semanas.at(this.semanas.length - 1).getRawValue();

        const payload = {
            num_semana: Number(lastRow.num_semana),
            fec_ini: this.formUtils.convertToISO(lastRow.fec_ini),
            fec_fin: this.formUtils.convertToISO(lastRow.fec_fin),
            desc_semana: lastRow.desc_semana,
        };

        this.semanasAvanceMainService.saveDataSemanaCiclo(payload).subscribe({
            next: (data: any) => {
                console.log('Datos guardados:', data);
            },
            error: (error) => {
                console.error('Error al guardar num_semana:', error);
            }
        });
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
    }




}
