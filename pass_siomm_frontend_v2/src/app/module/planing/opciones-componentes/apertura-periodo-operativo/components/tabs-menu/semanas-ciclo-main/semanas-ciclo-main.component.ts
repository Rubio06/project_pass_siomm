import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnInit, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { FormUtils } from 'src/app/utils/form-utils';

import { DATOS_COLUMNA_SEMANA_CICLO_MINADO, EstructuraDatos, ListNumSemanaResponse, MaeSemanaCiclo, TH_SEMANA_CICLO_MINADO, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import { PaginacionComponent } from 'src/app/shared/components/paginacion/paginacion.component';


@Component({
    selector: 'app-semanas-ciclo-main',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './semanas-ciclo-main.component.html',
    styleUrl: './semanas-ciclo-main.component.css',
})
export class SemanasCicloMainComponent {
    fb = inject(FormBuilder);
    planingService = inject(PlanningService);

    myForm = this.fb.group({
        semanas: this.fb.array<FormGroup>([])
    });


    columnas = signal<thTitulos[]>(TH_SEMANA_CICLO_MINADO);
    titulo = this.columnas().map(titulo => titulo.titulo);

    planingCompartido = inject(PlaningCompartidoService);
    semanasAvanceMainService = inject(SemanasAvanceMainService);

    formUtils = FormUtils;

    private siguienteSemana = 0;

    datosColumna = signal<EstructuraDatos[]>(DATOS_COLUMNA_SEMANA_CICLO_MINADO)

    semana_num_lista = signal<ListNumSemanaResponse[]>([]);

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    private cd = inject(ChangeDetectorRef);


    constructor() {

        effect(
            () => {
                const data = this.planingCompartido.dataRoutes();
                if (!data) return;

                const periodo = this.planingCompartido.periodo();
                if (!periodo?.anio || !periodo?.mes) return;

                const tabSemanaCiclo = data?.data?.semana_ciclo || [];
                this.loadSemanas(tabSemanaCiclo);
                this.listaEnteros();

            }
        );
    }

<<<<<<< HEAD
=======


>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
    trackByIndex(index: number) {
        return index;
    }



    loadSemanas(data: MaeSemanaCiclo[]) {
        const periodo = this.planingCompartido.periodo();

        const formArray = this.fb.array(
            data.map(item =>
                this.fb.group({
                    cie_ano: [periodo?.anio, Validators.required],
                    cie_per: [periodo?.mes, Validators.required],
                    num_semana: [
                        { value: item.num_semana, disabled: true },
                        [
                            Validators.required,
                            Validators.min(1),
                            Validators.max(7),
                            Validators.pattern(/^[1-7]$/)
                        ]
                    ],
                    fec_ini: [
                        this.formUtils.formatDate(item.fec_ini),
                        [
                            Validators.required,
                            Validators.pattern(
                                /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/
                            )
                        ]
                    ],
                    fec_fin: [
                        this.formUtils.formatDate(item.fec_fin),
                        [
                            Validators.required,
                            Validators.pattern(
                                /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/
                            )
                        ]
                    ],
                    desc_semana: [item.desc_semana, Validators.required],
                    accion: [''],
                    esNuevo: [false]
                }, { validators: this.formUtils.rangoFechasValidator() })
            )
        );

        this.myForm.setControl('semanas', formArray);
    }



<<<<<<< HEAD
    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar()
            && !row.get('esNuevo')?.value;
    }


    agregarFilas() {
        this.planingCompartido.setBotonesState({
            ...this.planingCompartido.botonesState(),
            editar: true
        });

=======


    agregarFilas() {
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        const periodo = this.planingCompartido.periodo();
        if (!periodo?.anio || !periodo?.mes) return;

        const semanas_lista = this.semana_num_lista() || [];
<<<<<<< HEAD

=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        const ultimo = semanas_lista.length > 0
            ? Number(semanas_lista[semanas_lista.length - 1].num_semana)
            : 0;

        this.siguienteSemana = ultimo + 1;

<<<<<<< HEAD
        if (this.siguienteSemana > 7) {
            this.siguienteSemana = 1;
        }
=======
        if (this.siguienteSemana > 7) return;
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

        let fec_fin_nueva = '';
        if (semanas_lista.length > 0) {
            const ultimaFecha = new Date(semanas_lista[semanas_lista.length - 1].fec_fin);
            ultimaFecha.setDate(ultimaFecha.getDate() + 1); // suma 1 día
            fec_fin_nueva = this.formUtils.formatDate(ultimaFecha);
        }

        const nuevoGrupo = this.fb.group({
            cie_ano: [periodo.anio, Validators.required],
            cie_per: [periodo.mes, Validators.required],
            num_semana: [{ value: this.siguienteSemana, disabled: true }, Validators.required],
            fec_ini: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
            fec_fin: ['', [Validators.required, Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)]],
            desc_semana: ['', Validators.required],
            esNuevo: [true]
        }, { validators: this.formUtils.rangoFechasValidator() });

<<<<<<< HEAD

=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        this.semanas.push(nuevoGrupo);
        this.semana_num_lista.set([...semanas_lista, { num_semana: this.siguienteSemana, fec_fin: fec_fin_nueva }]);
    }


<<<<<<< HEAD
=======
    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar()
            && !row.get('esNuevo')?.value;
    }


>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;
        const esNuevo = semana.esNuevo;

        const periodo = this.planingCompartido.periodo();

        if (esNuevo) {
<<<<<<< HEAD
            this.semanas.removeAt(index);
            return;
        }


=======
            return;
        }

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        const payload = {
            cie_ano: periodo?.anio,
            cie_per: periodo?.mes,
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

<<<<<<< HEAD

        this.semanasAvanceMainService.eliminarCiclo(payload).subscribe({

            next: (res: any) => {
                if (res.success) {
                    this.formUtils.alertaEliminado(res.message);

                    this.semanas.removeAt(index);

                    this.refrescarDatos();
=======
        this.semanasAvanceMainService.eliminarCiclo(payload).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.formUtils.alertaEliminado(res.message);
                    this.refrescarDatos();

>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
                } else {
                    this.formUtils.alertaEliminado(res.message);
                    this.refrescarDatos();

                }
            },
            error: (err) => this.formUtils.mensajeError(err.message)
        });
    }

    private refrescarDatos() {
        this.planingCompartido.setFormFactorBloqueado(true); // 🔓
        this.planingCompartido.setTablaBloqueada(true);
        this.planingCompartido.ejecutarVisualizar();
    }


    private listaEnteros() {
        const periodo = this.planingCompartido.periodo();
        if (!periodo?.anio || !periodo?.mes) return;

        this.planingService.listaEnteros(periodo.anio, periodo.mes, 'semana-ciclo-secuencia')
            .subscribe({
                next: (data: ListNumSemanaResponse[]) => {
                    this.semana_num_lista.set(data);

                },
                error: (err) => console.error('Error al cargar semanas:', err)
            });
    }

    ngOnInit() {
        this.planingCompartido.setLastTab('semana_ciclo');
        this.planingCompartido.registrarFormulario('semana_ciclo', this.myForm);

        this.myForm.valueChanges.subscribe(val => {
            const filas = this.semanas.getRawValue();
            this.planingCompartido.setSemanaCiclo(filas, 'semana_ciclo');
        });
    }
}
