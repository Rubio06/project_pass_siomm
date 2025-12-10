import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { ColumnaTabla, MaeSemanaCiclo, TABLA_DATOS_SEMANAS_CICLO } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { SemanasAvanceMainService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/semanas-avance-main/semanas-avance-main.service';
import { debounceTime } from 'rxjs';



@Component({
    selector: 'app-semanas-ciclo-main',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
    templateUrl: './semanas-ciclo-main.component.html',
    styleUrl: './semanas-ciclo-main.component.css',
})
export class SemanasCicloMainComponent {
    // // Servicios y dependencias inyectadas
    // private fb = inject(FormBuilder);
    // private planingService = inject(PlanningService);
    // private semanasAvanceMainService = inject(SemanasAvanceMainService);

    // // Utilidades
    // formUtils = FormUtils;

    // // Configuración de tabla (Señales)
    // columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_CICLO);
    // titulo = this.columnas().map(titulo => titulo.titulo);

    // // Estado de la UI (Señales)
    // message = signal<string>('');
    // loading = signal(false);
    // readonly estaBloqueado: WritableSignal<boolean> = signal(false);

    // // Configuración de los datos de la columna
    // datosColumna = signal<any[]>([
    //     { type: 'number', name: 'num_semana', placeholder: 'Ingrese una semana ' },
    //     { type: 'text', name: 'fec_ini', placeholder: '' },
    //     { type: 'text', name: 'fec_fin', placeholder: '' },
    //     { type: 'text', name: 'desc_semana', placeholder: '' },
    // ])

    // // Formulario principal
    // myForm: FormGroup = this.fb.group({
    //     semanas: this.fb.array([])
    // });

    // // Getter para acceder fácilmente al FormArray
    // get semanas(): FormArray {
    //     return this.myForm.get('semanas') as FormArray;
    // }

    // constructor() {

    //     // ➡️ SIN CARGA MANUAL: Eliminamos el setTimeout(0) de carga.
    //     // La carga inicial se manejará a través del 'effect' (Paso 2).

    //     // ➡️ PERSISTENCIA AUTOMÁTICA: Se mantiene el escuchador para guardar cambios al escribir.
    //     this.semanas.valueChanges.pipe(
    //         debounceTime(500)
    //     ).subscribe(() => {
    //         this.guardarEnLocalStorage();
    //     });

    //     // Efecto 1 (Carga de Datos Inicial/Cambio de Ruta): Esta es la fuente de verdad.


    //     effect(() => {
    //         const dataRoutes = this.planingService.dataRoutes();
    //         this.recargarSemanasConDatos(dataRoutes); // ⬅️ La carga se gestiona aquí.
    //     });

    //     // Efecto 2 (Bloqueo): Se mantiene la lógica original.
    //     effect(() => {
    //         this.bloqueoFormulario();
    //     });

    //     effect(() => {
    //         // ⚠️ Asegúrate de leer la signal correcta: bloqueoFormEdit
    //         const bloqueado = this.planingService.bloqueoFormEdit();

    //         // Ejecuta tu lógica que deshabilita/habilita
    //         this.gestionBloqueoFormulario(bloqueado);
    //     });
    // }
    // private yaCargoData = signal(false);


    // /**
    //  * Reconstruye el FormArray 'semanas' con los datos proporcionados y aplica el patchValue al formulario principal.
    //  * Es la fuente única de la carga de datos.
    //  */
    // private recargarSemanasConDatos(dataRoutes: any): void {

    //     // 🛑 Si ya cargamos una vez, NO volvas a resetear
    //     if (this.yaCargoData()) return;

    //     if (!dataRoutes || dataRoutes.length === 0) {
    //         this.resetearFormulario();
    //         return;
    //     }

    //     const dataSemanas = dataRoutes?.data?.semana_ciclo;

    //     this.loading.set(true);
    //     this.message.set('');

    //     setTimeout(() => {
    //         this.obtenerDatos(dataSemanas);
    //         this.myForm.patchValue(dataRoutes);

    //         this.loading.set(false);

    //         // 🔐 MARCAMOS QUE YA CARGAMOS
    //         this.yaCargoData.set(true);

    //     }, 1000);
    // }



    // /**
    //  * Gestiona la habilitación/deshabilitación del formulario en respuesta al estado de bloqueo.
    //  */
    // bloqueoFormulario() {
    //     const bloqueado = this.planingService.bloqueoForm();
    //     this.estaBloqueado.set(bloqueado);

    //     if (bloqueado) {
    //         this.myForm.disable();
    //         // Limpiamos los datos del FormArray para que la tabla se vea vacía al estar bloqueada.
    //         this.semanas.clear();
    //     } else {
    //         this.myForm.enable();

    //         const dataRoutes = this.planingService.dataRoutes();
    //         this.recargarSemanasConDatos(dataRoutes);

    //     }
    // }

    // private gestionBloqueoFormulario(bloqueado: boolean) {
    //     if (bloqueado) {
    //         // Cuando está en true (bloqueado), deshabilita
    //         this.myForm.disable();
    //     } else {
    //         this.myForm.enable();
    //         // Cuando está en false (desbloqueado), habilita
    //     }
    // }




    // /**
    //  * Limpia completamente el formulario, reseteando los valores y vaciando el FormArray.
    //  */
    // resetearFormulario() {
    //     this.myForm.reset();
    //     this.semanas.clear();
    // }

    // /**
    //  * Construye y rellena el FormArray 'semanas' a partir de un arreglo de datos.
    //  * @param data Arreglo de objetos MaeSemanaCiclo.
    //  */
    // obtenerDatos(data: MaeSemanaCiclo[]) {
    //     const grupos = data.map(item => {
    //         return this.fb.group({
    //             // Los campos se marcan como disabled: true, asumiendo que son solo para visualización.
    //             num_semana: new FormControl({ value: Number(item.num_semana), disabled: true }),
    //             fec_ini: new FormControl({ value: FormUtils.formatDate(item.fec_ini), disabled: true }),
    //             fec_fin: new FormControl({ value: FormUtils.formatDate(item.fec_fin), disabled: true }),
    //             desc_semana: new FormControl({ value: item.desc_semana, disabled: true }),

    //             accion: [({ value: '', disabled: true })]

    //         });
    //     });

    //     // Limpiamos el FormArray existente antes de rellenar
    //     this.semanas.clear();
    //     grupos.forEach(group => this.semanas.push(group));
    // }

    // /**
    //  * Agrega una nueva fila (FormGroup) al FormArray 'semanas'.
    //  */
    // agregarFilas() {
    //     // Lógica para el primer elemento
    //     if (this.semanas.length === 0) {
    //         this.semanas.push(this.crearFila(1));

    //         // 💾 GUARDA EN LOCALSTORAGE (Primera fila)
    //         this.guardarEnLocalStorage();
    //         return;
    //     }

    //     const ultimaFila = this.semanas.at(this.semanas.length - 1) as FormGroup;

    //     // Validación de la última fila antes de agregar una nueva
    //     if (ultimaFila.invalid) {
    //         ultimaFila.markAllAsTouched();
    //         console.warn("Debe completar la fila actual antes de agregar otra.");
    //         return;
    //     }

    //     // Determinar el correlativo siguiente
    //     const ultimoNumSemana = ultimaFila.get('num_semana')?.value || 0;
    //     const siguienteCorrelativo = Number(ultimoNumSemana) + 1;

    //     this.semanas.push(this.crearFila(siguienteCorrelativo));

    //     // 💾 GUARDA EN LOCALSTORAGE (Fila subsiguiente)
    //     this.guardarEnLocalStorage();
    // }

    // private guardarEnLocalStorage(): void {
    //     // 1. Obtener el valor de todo el FormArray (todas las filas).
    //     const dataToSave = this.semanas.getRawValue();

    //     // 2. Convertir el objeto JavaScript a una cadena de texto JSON.
    //     const jsonString = JSON.stringify(dataToSave);

    //     // 3. Almacenar la cadena de texto en localStorage con una clave única.
    //     localStorage.setItem('fila', jsonString);
    // }

    // /**
    //  * Crea un FormGroup con validaciones para una nueva fila editable.
    //  * @param numSemana Número correlativo de la semana.
    //  */
    // private crearFila(numSemana: number, data?: any): FormGroup {

    //     // Este effect se dispara SOLAMENTE cuando se crea una fila desde cero,
    //     // y no durante la rehidratación.
    //     if (!data) {
    //         this.planingService.setBloqueo(false);
    //     }

    //     const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-9]|2[0-9]|3[01])\/\d{4}$/;

    //     return this.fb.group({
    //         // ➡️ VALOR: Prioriza el dato existente (data?.) sobre el correlativo si está cargando.
    //         num_semana: [
    //             { value: data?.num_semana || numSemana, disabled: true },
    //             [Validators.required, Validators.min(1), Validators.max(7)]
    //         ],
    //         // ➡️ VALOR: Si data.fec_ini existe, lo usa; si no, usa una cadena vacía ('').
    //         fec_ini: [
    //             data?.fec_ini || '',
    //             [Validators.required, Validators.pattern(regexFecha)]
    //         ],
    //         fec_fin: [
    //             data?.fec_fin || '',
    //             [Validators.required, Validators.pattern(regexFecha)]
    //         ],
    //         desc_semana: [
    //             data?.desc_semana || '',
    //             [Validators.required]
    //         ],
    //     });
    // }




    // /**
    //  * Procesa y envía los datos de la última fila.
    //  */
    // onSubmit() {
    //     if (this.myForm.invalid) {
    //         this.myForm.markAllAsTouched();
    //         // Uso de console.error en lugar de alert() para mejor experiencia de usuario
    //         console.error("Debe enviar todos los datos");
    //         return;
    //     }

    //     // Usar getRawValue() para incluir los campos deshabilitados (como num_semana, fec_ini/fin si se editan)
    //     const lastRow = this.semanas.at(this.semanas.length - 1).getRawValue();

    //     const payload = {
    //         num_semana: Number(lastRow.num_semana),
    //         fec_ini: this.formUtils.convertToISO(lastRow.fec_ini),
    //         fec_fin: this.formUtils.convertToISO(lastRow.fec_fin),
    //         desc_semana: lastRow.desc_semana,
    //     };

    //     this.semanasAvanceMainService.saveDataSemanaCiclo(payload).subscribe({
    //         next: (data: any) => {
    //             console.log('Datos guardados:', data);
    //         },
    //         error: (error) => {
    //             console.error('Error al guardar num_semana:', error);
    //         }
    //     });
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
    // }


    fb = inject(FormBuilder);
    planingService = inject(PlanningService);

    myForm = this.fb.group({
        semanas: this.fb.array([])
    });
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_SEMANAS_CICLO);
    titulo = this.columnas().map(titulo => titulo.titulo);

    loading = signal(false);

    datosColumna = signal<any[]>([
        { type: 'number', name: 'num_semana', placeholder: 'Ingrese una semana ' },
        { type: 'text', name: 'fec_ini', placeholder: '' },
        { type: 'text', name: 'fec_fin', placeholder: '' },
        { type: 'text', name: 'desc_semana', placeholder: '' },
    ])

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    constructor() {

        /**
         * Carga inicial / recarga si cambian dataRoutes
         * 🔥 YA NO USA SETTIMEOUT
         * 🔥 NO SE DISPARA EN LOOP
         */
        effect(() => {
            const data = this.planingService.dataRoutes();

            // Solo carga cuando dataRoutes viene del backend
            if (!this.semanas.length) {
                const semanas = data?.data?.semana_ciclo || [];
                this.loadSemanas(semanas);
                this.myForm.patchValue(data);
            }
        });


        /**
         * Manejo de bloqueo centralizado
         */
        effect(() => {
            const bloqueado = this.planingService.bloqueoForm();

            if (bloqueado) this.myForm.disable();
            else this.myForm.enable();
        });
    }



    // ===============================
    //   METODOS CENTRALIZADOS
    // ===============================

    resetForm() {
        this.myForm.reset();
        this.semanas.clear();
    }

    loadSemanas(data: any[]) {
        this.semanas.clear();

        data.forEach((item) => {
            this.semanas.push(this.fb.group({
                num_semana: [{ value: item.num_semana, disabled: true }],
                fec_ini: [{ value: FormUtils.formatDate(item.fec_ini), disabled: true }],
                fec_fin: [{ value: FormUtils.formatDate(item.fec_fin), disabled: true }],
                desc_semana: [{ value: item.desc_semana, disabled: true }],
                accion: [{ value: '', disabled: true }]
            }));
        });
    }

    agregarFilas() {
        // const correlativo = this.semanas.length + 1;
        this.semanas.push(
            this.fb.group({
                num_semana: ['', Validators.required],
                fec_ini: ['', Validators.required],
                fec_fin: ['', Validators.required],
                desc_semana: ['', Validators.required],
            })
        );
    }

    eliminarFila(index: number) {
        this.semanas.removeAt(index);
    }

    onSubmit() {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            return;
        }

        const lastRow = this.semanas.at(this.semanas.length - 1).getRawValue();
        console.log("Enviar:", lastRow);

        // Aquí llamas a tu servicio de Save
    }
}
