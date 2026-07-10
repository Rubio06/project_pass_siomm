import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, signal, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';

import { DATOS_SEMANA_AVANCE, EstructuraDatos, ListNumSemanaResponse, MaeSemanaAvance, TH_SEMANA_AVANCE, thTitulos } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/interface/aper-per-oper.interface';
import { PlanningService } from 'src/app/module/planing/opciones-componentes/apertura-periodo-operativo/services/planning.service';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { SemanasAvanceMainService } from '../../../services/semanas-avance-main/semanas-avance-main.service';
import Swal from 'sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';

@Component({
    selector: 'app-semanas-avance-main',
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './semanas-avance-main.component.html',
    styleUrl: './semanas-avance-main.component.css',
})
export class SemanasAvanceMainComponent implements OnInit {
    columnas = signal<thTitulos[]>(TH_SEMANA_AVANCE);
    titulo = this.columnas().map(titulo => titulo.titulo);
    datosColumna = signal<EstructuraDatos[]>(DATOS_SEMANA_AVANCE);
    semana_num_lista = signal<ListNumSemanaResponse[]>([]);
    
    planingCompartido = inject(PlaningCompartidoService);
    semanasAvanceMainService = inject(SemanasAvanceMainService);
    fb = inject(FormBuilder);
    planningService = inject(PlanningService);
    private cd = inject(ChangeDetectorRef);
    
    formUtils = FormUtils;
    private siguienteSemana = 0;
    loading = signal(false);
    hoy = new Date();
    bloqueBotonNuevo = signal<boolean>(true);
    varibale: boolean = true;

    myForm = this.fb.group({
        semanas: this.fb.array<FormGroup>([]),
    });

    get semanas(): FormArray {
        return this.myForm.get('semanas') as FormArray;
    }

    constructor() {
        // Escucha cambios globales para cargar el listado de semanas de avance
        effect(() => {
            const data = this.planingCompartido.dataRoutes();
            if (!data) return;

            const periodo = this.planingCompartido.periodo();
            if (!periodo?.anio || !periodo?.mes) return;

            const semanas = data?.data?.semana_avance || [];
            this.loadSemanas(semanas);
            this.listaEnteros();
        });
    }

    trackByIndex(index: number) {
        return index;
    }

    loadSemanas(data: MaeSemanaAvance[]) {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) return;

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
                            Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)
                        ]
                    ],
                    fec_fin: [
                        this.formUtils.formatDate(item.fec_fin),
                        [
                            Validators.required,
                            Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19\d{2}|20\d{2}|2100)$/)
                        ]
                    ],
                    desc_semana: [item.desc_semana, Validators.required],
                    accion: [],
                    esNuevo: [false]
                }, { validators: this.formUtils.rangoFechasValidator() })
            )
        );

        this.myForm.setControl('semanas', formArray);
    }

    agregarFilas() {
        this.planingCompartido.setBotonesState({
            ...this.planingCompartido.botonesState(),
            editar: true
        });

        const periodo = this.planingCompartido.periodo();
        if (!periodo?.anio || !periodo?.mes) return;

        const semanas_lista = this.semana_num_lista() || [];
        const ultimo = semanas_lista.length > 0
            ? Number(semanas_lista[semanas_lista.length - 1].num_semana)
            : 0;

        this.siguienteSemana = ultimo + 1;

        if (this.siguienteSemana > 7) {
            this.siguienteSemana = 1;
        }

        let fec_fin_nueva = '';
        if (semanas_lista.length > 0) {
            const ultimaFecha = new Date(semanas_lista[semanas_lista.length - 1].fec_fin);
            ultimaFecha.setDate(ultimaFecha.getDate() + 1);
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

        this.semanas.push(nuevoGrupo);
        this.semana_num_lista.set([...semanas_lista, { num_semana: this.siguienteSemana, fec_fin: fec_fin_nueva }]);
    }

    bloquearCampo(row: AbstractControl): boolean {
        return this.planingCompartido.bloqueoFormEditar() && !row.get('esNuevo')?.value;
    }

    async eliminarFila(data: any, index: number) {
        const semana = data.getRawValue ? data.getRawValue() : data.value;
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) return;

        const esNuevo = semana.esNuevo;

        if (esNuevo) {
            this.semanas.removeAt(index);
            return;
        }

        const confirmado = await this.formUtils.confirmarEliminacion();
        if (!confirmado) {
            this.formUtils.alertaNoEliminado();
            return;
        }

        const payload = {
            cie_ano: periodo?.anio,
            cie_per: periodo?.mes,
            num_semana: semana.num_semana,
            fec_ini: this.formUtils.convertToISO(semana.fec_ini),
            fec_fin: this.formUtils.convertToISO(semana.fec_fin),
            desc_semana: semana.desc_semana
        };

        this.semanasAvanceMainService.eliminarSemanaAvance(payload).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.formUtils.alertaEliminado(res.message);
                    this.semanas.removeAt(index);
                    this.refrescarDatos();
                } else {
                    this.formUtils.alertaEliminado(res.message);
                    this.refrescarDatos();
                }
            },
            error: (err) => this.formUtils.mensajeError(err.message)
        });
    }

    private refrescarDatos() {
        this.planingCompartido.setFormFactorBloqueado(true);
        this.planingCompartido.setTablaBloqueada(true);
        this.planingCompartido.ejecutarVisualizar();
    }

    private listaEnteros() {
        const periodo = this.planingCompartido.periodo();

        if (!periodo?.anio || !periodo?.mes) return;

        this.planningService.listaEnteros(periodo?.anio, periodo?.mes, 'semana-avance-secuencia').subscribe({
            next: (data: ListNumSemanaResponse[]) => {
                this.semana_num_lista.set(data);
            },
            error: (err) => console.error('Error al cargar secuencia de semanas:', err),
        });
    }

    ngOnInit() {
        this.planingCompartido.setLastTab('semana_avance');
        this.planingCompartido.registrarFormulario('semana_avance', this.myForm);

        this.myForm.valueChanges.subscribe(() => {
            const filas = this.semanas.getRawValue();
            this.planingCompartido.setSemanaAvance(filas, 'semana_avance');
        });
    }
}