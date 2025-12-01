import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { ColumnaTabla, SelectExploracion, TABLA_DATOS_METODO_MINADO } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';

@Component({
    selector: 'app-metodo-minado-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './metodo-minado-main.component.html',
    styleUrl: './metodo-minado-main.component.css',
})
export class MetodoMinadoMainComponent {
    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_METODO_MINADO);
    private fb = inject(FormBuilder);
    titulo = this.columnas().map(titulo => titulo.titulo);
    private planingService = inject(PlanningService);
    formUtils = FormUtils;

    // private semanasAvanceMainService = inject(SemanasAvanceMainService);
    message = signal<string>('');
    loading = signal(false);
    bloqueo = inject(PlanningService).bloqueo;

    datosColumna = signal<any[]>([
        { type: 'select', name: 'cod_metexp' },
        { type: 'text', name: 'nom_metexp' },
        { type: 'select', name: 'ind_calculo_dilucion' },
        { type: 'select', name: 'ind_calculo_leyes_min' },
        { type: 'select', name: 'ind_act' },

    ])

    cod_metexp = signal<SelectExploracion[]>([])


    ind_calculo_dilucion = signal<any[]>([
        { value: 1, label: 'Contrato' },
        { value: 2, label: 'O´hara' }
    ])


    ind_calculo_leyes_min = signal<any[]>([
        { value: 1, label: 'Contrato' },
        { value: 2, label: 'O´hara' }
    ])

    ind_act = signal<any[]>([
        { value: 1, label: 'Si' },
        { value: 2, label: 'No' }
    ])

    myForm: FormGroup = this.fb.group({
        semanas: this.fb.array([])
    });

    constructor() {
        effect(() => {
            const data = this.planingService.dataRoutes()?.data?.metodo_minado;
            if (!data) return;

            this.loading.set(true);
            this.message.set('');

            setTimeout(() => {
                this.obtenerDatos(data);
                this.loading.set(false);
            }, 500);

            console.log("select " + this.SelectExploracion())
            this.SelectExploracion();
        });


        effect(() => {
            const data = this.planingService.dataRoutes();

            if (data === null || data?.length === 0) {
                this.resetearFormulario();   // 🔥 Se ejecuta en TODOS los componentes
                return;
            }

            // si hay data, llenas tus formularios
            this.myForm.patchValue(data);
        });



    }

    resetearFormulario() {
        this.myForm.reset();

    }




    obtenerDatos(data: any[]) {

        const grupos = data.map((item, index) => {
            return this.fb.group({
                cod_metexp: [this.cod_metexp()[index]?.nom_metexp, [Validators.required]],
                nom_metexp: ['', [Validators.required]],
                ind_calculo_dilucion: [this.ind_calculo_dilucion()[0].label],
                ind_calculo_leyes_min: [this.ind_calculo_leyes_min()[0].label],
                ind_act: [this.ind_act()[0].label]
            });
        });

        const nuevoFormArray = this.fb.array(grupos);
        this.myForm.setControl('semanas', nuevoFormArray);
    }

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    agregarFilas() {
        const nuevaSemana = this.crearFila();
        this.semanas.push(nuevaSemana);

    }

    private crearFila(): FormGroup {
        this.planingService.setBloqueo(false);

        return this.fb.group({
            cod_metexp: ['', [Validators.required]],
            nom_metexp: ['', [Validators.required]],
            ind_calculo_dilucion: ['', [Validators.required]],
            ind_calculo_leyes_min: ['', [Validators.required]],
            ind_act: ['', [Validators.required]]
        });
    }


    onSubmit() {
        const ultimaFila = this.semanas.at(this.semanas.length - 1);

        // Validar que la última fila esté completa
        if (ultimaFila.invalid) {
            ultimaFila.markAllAsTouched();
            alert('Completa todos los campos de la última fila');
            return;
        }

        const lastRow = ultimaFila.getRawValue(); // incluye campos disabled
        const selectedValue = lastRow.cod_metexp; // valor del select

        // Verificar si ya existe en otras filas
        const existeDuplicado = this.semanas.controls
            .slice(0, this.semanas.length - 1) // todas menos la última fila
            .some(control => control.get('cod_metexp')?.value === selectedValue);

        if (existeDuplicado) {
            alert('La opción seleccionada ya se encuentra seleccionada en otra fila.');
            return;
        }

        // Payload listo para enviar
        const payload = {
            lastWeek: lastRow
        };

        console.log('Payload a enviar:', payload);

        // Descomenta cuando tengas el servicio listo
        // this.semanasAvanceMainService.saveDataSemanaAvance(payload).subscribe({
        //     next: (data: any) => console.log('Datos guardados:', data),
        //     error: (error) => console.error('Error al guardar:', error)
        // });
    }


    public SelectExploracion() {
        this.planingService.SelectExploracion().subscribe({
            next: (data: any) => {
                this.cod_metexp.set(data);
            }, error: (error) => {
                console.error('Error al traer los meses.', error)
            }
        })
    }


    eliminarFila(index: number) {
        const fila = this.semanas.at(index).getRawValue(); // 🔥 obtienes los valores

        console.log("Fila que se eliminará:", fila);

        this.semanas.removeAt(index); // 🔥 elimina la fila

        console.log("Fila eliminada correctamente");

    }



}
