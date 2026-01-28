import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';

import { DATOS_COLUMNA_SEMANA_CICLO_MINADO, EstructuraDatos, MaeSemanaCiclo, TH_SEMANA_CICLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';


@Component({
    selector: 'app-semanas-ciclo-main',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
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
            if (!data) return;

            const tabSemanaCiclo = data?.data?.semana_ciclo || [];

            // ⚡ Solo cargar si no hay filas (primer render)
            if (this.semanas.length === 0) {
                this.loadSemanas(tabSemanaCiclo);
            }
        });





        //BOTRON EDITAR///
        ///
        // effect(() => {

        //     if (!this.myForm) return;

        //     if (this.planingCompartido.bloqueoFormGeneral()) {
        //         this.myForm.disable({ emitEvent: false });

        //     } else {
        //         this.myForm.enable({ emitEvent: false });
        //     }
        // });


    }

    loadSemanas(data: MaeSemanaCiclo[]) {
        this.semanas.clear();  // limpia todo


        data.forEach((item) => {
            this.semanas.push(
                this.fb.group({

                    cie_ano: [item.cie_ano, Validators.required],
                    cie_per: [item.cie_per, Validators.required],
                    num_semana: [item.num_semana, [Validators.required, Validators.min(1), Validators.max(7), Validators.pattern(/^[1-7]$/)]],
                    fec_ini: [this.formUtils.formatDate(item.fec_ini), [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
                    fec_fin: [this.formUtils.formatDate(item.fec_fin), [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
                    desc_semana: [item.desc_semana, [Validators.required]],
                    accion: [''],
                    esNuevo: [false]

                })
            );
        });

    }

    agregarFilas() {
        const ultima = this.semanas.length
            ? this.semanas.at(this.semanas.length - 1)?.getRawValue()
            : null;

        const origen = ultima || {
            cie_ano: new Date().getFullYear().toString(),
            cie_per: (new Date().getMonth() + 1).toString().padStart(2, '0'),
            num_semana: 1
        };

        const numSemanaNueva = ultima ? ultima.num_semana + 1 : origen.num_semana;

        const nuevoGrupo = this.fb.group({
            cie_ano: [origen.cie_ano, Validators.required],
            cie_per: [origen.cie_per, Validators.required],
            num_semana: [numSemanaNueva, [
                Validators.required,
                Validators.min(1),
                Validators.max(7),
                Validators.pattern(/^[1-7]$/)
            ]],
            fec_ini: ['', Validators.required],
            fec_fin: ['', Validators.required],
            desc_semana: ['', Validators.required],
            esNuevo: [true]
        });

        this.semanas.push(nuevoGrupo);

        const filaNueva = this.semanas.at(this.semanas.length - 1);
        this.enviarFilaNueva(filaNueva!);
    }


    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar()
            && !row.get('esNuevo')?.value;
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
    //         const filas = this.myForm.getRawValue();

    //         this.planingCompartido.setSemanaCiclo(filas, 'semana_ciclo');
    //     });
    // }


    ngOnInit() {

        const dataGuardada = this.planingCompartido.datosGlobales().tabPrincipal;

        if (dataGuardada) {
            // Rellenamos el formulario con lo que recuperamos
            this.myForm.patchValue(dataGuardada);
        }

        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();
            this.planingCompartido.setSemanaCiclo(filas, 'semana_ciclo');
            this.planingCompartido.registerForm('semana_ciclo', this.myForm);

            // console.log("📤 TAB semana actualizó servicio:", filas);
        });
    }

    enviarFilaNueva(row: AbstractControl) {
        this.planingCompartido.registerForm('ciclo_minado', this.myForm);
        this.planingCompartido.setActiveTab('ciclo_minado');
        this.myForm.valueChanges.subscribe(val => {
            const payload = row.getRawValue(); // objeto plano

            this.planingCompartido.setSemanaCiclo(payload, 'semana_ciclo');
        });
    }


}
