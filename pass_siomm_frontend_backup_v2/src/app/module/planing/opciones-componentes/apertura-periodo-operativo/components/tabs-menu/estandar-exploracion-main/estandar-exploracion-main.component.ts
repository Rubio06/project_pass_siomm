import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { ColumnaTabla, SelectExploracion, SelectZona, TABLA_DATOS_ESTANDAR_EXPLORACION } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';

@Component({
    selector: 'app-estandar-exploracion-main',
    imports: [ReactiveFormsModule, SpinnerComponent],
    templateUrl: './estandar-exploracion-main.component.html',
    styleUrl: './estandar-exploracion-main.component.css',
})
export class EstandarExploracionMainComponent {

    columnas = signal<ColumnaTabla[]>(TABLA_DATOS_ESTANDAR_EXPLORACION);
    private fb = inject(FormBuilder);
    titulo = this.columnas().map(titulo => titulo.titulo);
    private planingService = inject(PlanningService);
    formUtils = FormUtils;

    // private semanasAvanceMainService = inject(SemanasAvanceMainService);
    message = signal<string>('');
    loading = signal(false);
    listZona = signal<SelectZona[]>([])
    bloqueo = inject(PlanningService).bloqueo;


    datosColumna = signal<any[]>([
        { tipo: 'select', type: 'text', name: 'cod_zona' },
        { tipo: 'input', type: 'text', name: 'lab_pieper' },
        { tipo: 'input', type: 'text', name: 'lab_broca' },
        { tipo: 'input', type: 'text', name: 'lab_barcon' },
        { tipo: 'input', type: 'text', name: 'lab_barren' },
        { tipo: 'input', type: 'text', name: 'lab_facpot' },
        { tipo: 'input', type: 'text', name: 'lab_fulmin' },
        { tipo: 'input', type: 'text', name: 'lab_conect' },
        { tipo: 'input', type: 'text', name: 'lab_punmar' },
        { tipo: 'input', type: 'text', name: 'lab_tabla' },
        { tipo: 'input', type: 'text', name: 'ind_act' },
        { tipo: 'input', type: 'text', name: 'lab_apr' },


    ])
    cod_metexp = signal<SelectExploracion[]>([])

    myForm: FormGroup = this.fb.group({
        semanas: this.fb.array([])
    });

    constructor() {
        effect(() => {
            const data = this.planingService.dataRoutes()?.data?.exploracion_extandar;
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

        this.listZona();
    }

    resetearFormulario() {
        this.myForm.reset();

    }

    obtenerDatos(data: any[]) {

        const grupos = data.map((item, index) => {
            return this.fb.group({
                cod_zona: [{
                    value: this.listZona()[index]?.des_zona || '',
                }, [Validators.required]],

                lab_pieper: [item.lab_pieper],
                lab_broca: [item.lab_broca],
                lab_barcon: [item.lab_barcon],
                lab_barren: [item.lab_barren],
                lab_facpot: [item.lab_facpot],
                lab_fulmin: [item.lab_fulmin],
                lab_conect: [item.lab_conect],
                lab_punmar: [item.lab_punmar],
                lab_tabla: [item.lab_tabla],
                ind_act: [item.ind_act],
                lab_apr: [item.lab_apr],
            });
        });

        const nuevoFormArray = this.fb.array(grupos);
        this.myForm.setControl('semanas', nuevoFormArray);
    }

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    agregarFilas() {
        // if (this.semanas.length === 0) {
        const nuevaSemana = this.crearFila();
        this.semanas.push(nuevaSemana);
        // }
    }

    private crearFila(): FormGroup {
        this.planingService.setBloqueo(false);

        return this.fb.group({
            cod_zona: ['', [Validators.required]],
            lab_pieper: ['', [Validators.required]],
            lab_broca: ['', [Validators.required]],
            lab_barcon: ['', [Validators.required]],
            lab_barren: ['', [Validators.required]],
            lab_facpot: ['', [Validators.required]],
            lab_fulmin: ['', [Validators.required]],
            lab_conect: ['', [Validators.required]],
            lab_punmar: ['', [Validators.required]],
            lab_tabla: ['', [Validators.required]],
            ind_act: ['', [Validators.required]],
            lab_apr: ['', [Validators.required]],
        });
    }


    onSubmit() {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            alert("Debe enviar todos los datos")
            return;
        }
    }

    public SelectZona() {
        this.planingService.SelectZona().subscribe({
            next: (data: any) => {
                this.listZona.set(data);
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


