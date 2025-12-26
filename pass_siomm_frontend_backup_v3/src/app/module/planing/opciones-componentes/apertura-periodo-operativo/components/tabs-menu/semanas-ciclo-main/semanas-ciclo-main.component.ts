import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';

import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { DATOS_COLUMNA_SEMANA_CICLO_MINADO, EstructuraDatos, TH_SEMANA_CICLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';


@Component({
    selector: 'app-semanas-ciclo-main',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, SpinnerComponent],
    templateUrl: './semanas-ciclo-main.component.html',
    styleUrl: './semanas-ciclo-main.component.css',
})
export class SemanasCicloMainComponent {
    fb = inject(FormBuilder);
    planingService = inject(PlanningService);

    myForm = this.fb.group({
        semanas: this.fb.array([])
    });

    columnas = signal<thTitulos[]>(TH_SEMANA_CICLO_MINADO);
    titulo = this.columnas().map(titulo => titulo.titulo);

    loading = signal(false);

    planingCompartido = inject(PlaningCompartidoService);
    semanasAvanceMainService = inject(SemanasAvanceMainService);

    formUtils = FormUtils;

    datosColumna = signal<EstructuraDatos[]>(DATOS_COLUMNA_SEMANA_CICLO_MINADO)

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    loaded: boolean = true;


    private cd = inject(ChangeDetectorRef);

    bloqueoBotonNuevo = signal<boolean>(true);

    constructor() {

        effect(() => {

            const data = this.planingCompartido.dataRoutes();
            const tabSemanaCiclo = data?.data?.semana_ciclo || [];

            if (this.planingCompartido.modoVisualizar()) {
                console.log('haciendo un clickkkk')
                this.resetForm();
                this.blockForm();
                this.cd.detectChanges();
                return;
            }

            this.loadSemanas(tabSemanaCiclo);
            this.myForm.patchValue(data || {}, { emitEvent: false });
            this.cd.detectChanges();
        });


        //BOTRON EDITAR///
        ///
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
                this.myForm.enable({ emitEvent: false });
                this.myForm.reset();
                this.semanas.clear();  // vaciar tabla
                this.cd.detectChanges();
            }
        });

        //BOTON VISUALIZAR
        // effect(() => {
        //     const signal = this.planingCompartido.visualizarForms();
        //     if (signal > 0) {
        //         this.blockForm();
        //         // this.resetForm();

        //         // this.resetSelects(); // limpia selects
        //     }
        // });
    }

    blockForm() {
        this.myForm.disable(); // bloquea todos los campos
        // this.filas.forEach(f => f.disable()); // bloquea filas si tienes tabla
    }


    resetForm() {
        // // 1️⃣ habilitar temporalmente el form
        // this.myForm.enable({ emitEvent: false });

        // // 2️⃣ limpiar todo
        // this.myForm.reset();
        this.semanas.clear();
        // 3️⃣ actualizar cambios
        this.cd.detectChanges();
    }

    loadSemanas(data: any[]) {
        this.semanas.clear();  // limpia todo

        data.forEach((item) => {
            this.semanas.push(
                this.fb.group({
                    num_semana: [item.num_semana],
                    fec_ini: [FormUtils.formatDate(item.fec_ini)],
                    fec_fin: [FormUtils.formatDate(item.fec_fin)],
                    desc_semana: [item.desc_semana],
                    accion: [''],
                    esNuevo: [false]

                })
            );
        });
        this.planingCompartido.notifyFormChanged();

        // this.planingCompartido.notifyFormChanged();

    }

    // guardarCambios() {
    //     const filas = this.semanas.getRawValue();
    //     this.planingCompartido.setSemanaCiclo(filas);
    // }

    agregarFilas() {
        if (this.semanas.length >= 1) {
            return;
        }

        // this.planingCompartido.setBloqueoFormEditar(false);

        this.semanas.push(
            this.fb.group({
                num_semana: ['', [Validators.required, Validators.min(1), Validators.max(7), Validators.pattern(/^[1-7]$/)]],
                fec_ini: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
                fec_fin: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
                desc_semana: ['', [Validators.required]],
                esNuevo: [true]

            })
        );
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
            num_semana: semana.num_semana,
            fec_ini: this.formUtils.convertToISO(semana.fec_ini),
            fec_fin: this.formUtils.convertToISO(semana.fec_fin),
            desc_semana: semana.desc_semana
        };

        const confirmado = await this.formUtils.confirmarEliminacion();
        if (!confirmado) {
            this.formUtils.alertaNoEliminado();
            return;
        }

        this.semanasAvanceMainService.eliminarCiclo(payload).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.formUtils.alertaEliminado(res.message);
                    // this.planingCompartido.setBloqueoForm(false);
                } else {
                    this.formUtils.alertaEliminado(res.message);
                }
            },
            error: (err) => this.formUtils.mensajeError(err.message)
        });
    }

    // ngOnInit() {
    //     this.myForm.valueChanges.subscribe(val => {
    //         const filas = this.tabSemanaCiclo.getRawValue();

    //         this.planingCompartido.setSemanaCiclo(filas);
    //     });
    // }

    hasPendingChanges(): boolean {
        return this.planingCompartido.getCambios();
    }
}
