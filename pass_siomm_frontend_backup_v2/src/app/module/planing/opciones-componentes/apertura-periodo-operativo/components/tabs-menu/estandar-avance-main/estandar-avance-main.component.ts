import { Component, signal, input, effect, inject } from '@angular/core';
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

    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_ESTANDAR_AVANCE);
    private fb = inject(FormBuilder);
    titulo = this.columnas().map(titulo => titulo.titulo);
    private planingService = inject(PlanningService);
    formUtils = FormUtils;

    // private semanasAvanceMainService = inject(SemanasAvanceMainService);
    message = signal<string>('');
    loading = signal(false);
    listLabor = signal<SelectTipoLabor[]>([])
    bloqueo = inject(PlanningService).bloqueo;

    datosColumna = signal<any[]>([
        // { type: 'text', name: 'cod_zona' },
        // { type: 'text', name: 'cod_tiplab' },
        { type: 'text', name: 'nro_lab_ancho' },
        { type: 'text', name: 'nro_lab_altura' },
        { type: 'text', name: 'nro_lab_pieper' },
        { type: 'text', name: 'nro_lab_broca' },
        { type: 'text', name: 'nro_lab_barcon' },
        { type: 'text', name: 'nro_lab_barren' },
        { type: 'text', name: 'nro_lab_facpot' },
        { type: 'text', name: 'nro_lab_fulmin' },
        { type: 'text', name: 'nro_lab_conect' },
        { type: 'text', name: 'nro_lab_punmar' },
        { type: 'text', name: 'nro_lab_tabla' },

    ])

    //     { titulo: 'Tipo Labor', control: 'cod_tiplab' },
    // { titulo: 'Ancho', control: 'nro_lab_ancho' },
    // { titulo: 'Altura', control: 'nro_lab_altura' },
    // { titulo: 'Ft Perforado FT/mts', control: 'nro_lab_pieper' },
    // { titulo: 'Nro Broca Und/mts', control: 'nro_lab_broca' },
    // { titulo: 'Barra Cónica Und/mts', control: 'nro_lab_barcon' },
    // { titulo: 'Barreno Und/mts', control: 'nro_lab_barren' },
    // { titulo: 'Potencia kg/mts', control: 'nro_lab_facpot' },
    // { titulo: 'Fulminante Und/mts', control: 'nro_lab_fulmin' },
    // { titulo: 'Conectores Und/mts', control: 'nro_lab_conect' },
    // { titulo: 'Puntal /Marchavante', control: 'nro_lab_punmar' }, // cambiar el nombre en el formGroup
    // { titulo: 'Nro Tabla', control: 'nro_lab_tabla' }


    myForm: FormGroup = this.fb.group({
        semanas: this.fb.array([])
    });

    constructor() {
        effect(() => {
            const data = this.planingService.dataRoutes()?.data?.laboratorio_estandar;
            if (!data) return;

            this.loading.set(true);
            this.message.set('');

            setTimeout(() => {
                this.obtenerDatos(data);
                this.loading.set(false);
            }, 500);

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

        this.SelectTipoLabor();
    }



    resetearFormulario() {
        this.myForm.reset({
            nro_lab_ancho: [''],
            nro_lab_altura: [''],
            nro_lab_pieper: [''],
            nro_lab_broca: [''],
            nro_lab_barcon: [''],
            nro_lab_barren: [''],
            nro_lab_facpot: [''],
            nro_lab_fulmin: [''],
            nro_lab_conect: [''],
            nro_lab_punmar: [''],
            nro_lab_tabla: [''],
        });
    }

    //     { type: 'text', name: 'nro_lab_ancho' },
    // { type: 'text', name: 'nro_lab_altura' },
    // { type: 'text', name: 'nro_lab_pieper' },
    // { type: 'text', name: 'nro_lab_broca' },
    // { type: 'text', name: 'nro_lab_barcon' },
    // { type: 'text', name: 'nro_lab_barren' },
    // { type: 'text', name: 'nro_lab_facpot' },
    // { type: 'text', name: 'nro_lab_fulmin' },
    // { type: 'text', name: 'nro_lab_conect' },
    // { type: 'text', name: 'nro_lab_punmar' },
    // { type: 'text', name: 'nro_lab_tabla' },

    obtenerDatos(data: any[]) {

        const grupos = data.map((item, index) => {
            return this.fb.group({
                cod_tiplab: [{
                    value: this.listLabor()[index]?.nom_metexp || '',
                    disabled: true
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
            });



        });

        const nuevoFormArray = this.fb.array(grupos);
        this.myForm.setControl('semanas', nuevoFormArray);
    }

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    agregarFilas() {
        if (this.semanas.length === 0) {
            const nuevaSemana = this.crearFila();
            this.semanas.push(nuevaSemana);
        }
    }

    //     export interface MaePerMetExplotacion {
    //     cod_metexp: string;
    //     nom_metexp: string;
    //     ind_calculo_dilucion: string;
    //     ind_calculo_leyes_min: string;
    //     ind_act: string;
    // }


    private crearFila(): FormGroup {
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



    onSubmit() {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            alert("Debe enviar todos los datos")
            return;
        }
    }

    public SelectTipoLabor() {
        this.planingService.SelectTipoLabor().subscribe({
            next: (data: any) => {
                this.listLabor.set(data);

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
