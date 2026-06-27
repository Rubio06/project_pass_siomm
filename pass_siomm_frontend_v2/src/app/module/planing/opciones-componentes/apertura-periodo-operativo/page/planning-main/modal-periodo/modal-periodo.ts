import { ChangeDetectorRef, Component, effect, EventEmitter, inject, Input, Output, output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { PeriodoDestino } from '../../../interface/aper-per-oper.interface';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { PlanningService } from '../../../services/planning.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { startWith } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MostrarDatosFiltrosService } from 'src/app/module/planing/service/mostrar-datos-filtros.service';

@Component({
    selector: 'app-modal-periodo',
    imports: [ReactiveFormsModule, TransfornMonthPipe, DatePipe],
    templateUrl: './modal-periodo.html',
    styleUrl: './modal-periodo.css',
})
export class ModalPeriodo {

    aceptar = output<PeriodoDestino>();
    private planingCompartido = inject(PlaningCompartidoService);
    formsUtils = FormUtils;

    private ostrarDatosFiltrosService = inject(MostrarDatosFiltrosService);

    private planingService = inject(PlanningService);

    private fb = inject(FormBuilder);

    readonly mesesMap: Record<string, string> = {
        '01': 'Enero',
        '02': 'Febrero',
        '03': 'Marzo',
        '04': 'Abril',
        '05': 'Mayo',
        '06': 'Junio',
        '07': 'Julio',
        '08': 'Agosto',
        '09': 'Septiembre',
        '10': 'Octubre',
        '11': 'Noviembre',
        '12': 'Diciembre'
    };

    private hoy = new Date();
    /* =======================
     * Inputs
     * ======================= */
    // @Input() anioOrigen!: string;
    // @Input() mesOrigen!: string;

    /* =======================
     * Formulario
     * ======================= */
    myForm!: FormGroup;

    /* =======================
     * Estado local
     * ======================= */
    fechaInicioOrigen = '';
    fechaInicioDestino = '';

    mesOrigen = '';
    anioOrigen = '';

    private cd = inject(ChangeDetectorRef);

    mesesBloqueadosArray = signal<string[]>([]);


    constructor(
    ) {
        this.createForm();
        this.listenFechasSignal();
        this.listenMesDestino();
    }

    ngOnInit(): void {
        const control = this.myForm.get('anioDestino');

        control?.valueChanges
            .pipe(startWith(control.value))
            .subscribe(year => {
                if (!year || year.length !== 4) return;
                this.cargarMeses(year);
            });
    }

    /* =======================
     * Ciclo de vida
     * ======================= */
    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes['anioOrigen'] || changes['mesOrigen']) {
    //         this.patchPeriodoOrigen();
    //     }
    // }

    /* =======================
     * Métodos privados
     * ======================= */

    private createForm(): void {
        this.myForm = this.fb.group({
            anioDestino: [
                new Date().getFullYear().toString(),
                [Validators.required, Validators.pattern(/^(19\d{2}|20\d{2}|2100)$/)]
            ],
            mesDestino: ['', Validators.required],

            fechaInicioOrigen: [{ value: '', disabled: true }, [Validators.required]],
            fechaFinOrigen: [{ value: '', disabled: true }, [Validators.required]],

            anioOrigen: [{ value: '', disabled: true }, [Validators.required]],
            mesOrigen: [{ value: '', disabled: true }, [Validators.required]],

        });
    }


    private getInicioFinMes(anio: string, mes: string) {
        const year = Number(anio);
        const month = Number(mes) - 1;

        return {
            inicio: new Date(year, month, 1).toISOString(),
            fin: new Date(year, month + 1, 0).toISOString()
        };
    }

    private listenFechasSignal(): void {
        effect(() => {
            const fechas = this.planingCompartido.fechas();
            if (!fechas) return;

            this.myForm.patchValue({
                anioOrigen: fechas.cie_ano,
                mesOrigen: fechas.cie_per
            }, { emitEvent: false });
        });
    }

    private listenMesDestino(): void {
        this.myForm.get('mesDestino')?.valueChanges.subscribe(mes => {
            const anio = this.myForm.get('anioDestino')?.value;

            if (!anio || !mes) return;

            const { inicio, fin } = this.getInicioFinMes(anio, mes);

            this.myForm.patchValue({
                fechaInicioOrigen: inicio,
                fechaFinOrigen: fin
            }, { emitEvent: false });
        });
    }

    onSubmit(): void {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched();
            return;
        }

        const payload = this.myForm.getRawValue();

        this.aceptar.emit(payload as PeriodoDestino);

        // this.onReset();
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal.close();

        this.planingCompartido.limpiezaDataRoutes();
    }


    private cargarMeses(year: string): void {
        this.ostrarDatosFiltrosService.getMonths(year).subscribe({
            next: (months) => {

                this.planingCompartido.setMesesBloqueados(months);
                this.mesesBloqueadosArray.set(months ?? []);
                this.cd.detectChanges(); // ⚡ evita NG0100

            },
            error: () => {
                this.planingCompartido.setMesesBloqueados([]);
                this.mesesBloqueadosArray.set([]);
                this.cd.detectChanges();

            }
        });
    }


    onReset() {
        this.myForm.reset({
            anioDestino: this.hoy.getFullYear().toString(),
            mesDestino: '',
            fechaInicioDestino: '',
            fechaFinDestino: '',
        });
    }

    onCancelar() {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        modal.close();
        // this.onReset();
    }
}
