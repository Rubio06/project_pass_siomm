import { ChangeDetectorRef, Component, effect, EventEmitter, inject, Input, Output, output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { PeriodoDestino } from '../../../interface/aper-per-oper.interface';
import { PlaningCompartidoService } from '../../../services/planing-compartido.service';
import { PlanningService } from '../../../services/planning.service';
import { TransfornMonthPipe } from 'src/app/core/pipe/transforn-month-pipe';
import { startWith } from 'rxjs';

@Component({
    selector: 'app-modal-periodo',
    imports: [ReactiveFormsModule, TransfornMonthPipe],
    templateUrl: './modal-periodo.html',
    styleUrl: './modal-periodo.css',
})
export class ModalPeriodo {

    aceptar = output<PeriodoDestino>();
    private planingCompartido = inject(PlaningCompartidoService);
    formsUtils = FormUtils;

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

    // meses = signal<any[]>([
    //     { value: '01', label: 'Enero' },
    //     { value: '02', label: 'Febrero' },
    //     { value: '03', label: 'Marzo' },
    //     { value: '04', label: 'Abril' },
    //     { value: '05', label: 'Mayo' },
    //     { value: '06', label: 'Junio' },
    //     { value: '07', label: 'Julio' },
    //     { value: '08', label: 'Agosto' },
    //     { value: '09', label: 'Septiembre' },
    //     { value: '10', label: 'Octubre' },
    //     { value: '11', label: 'Noviembre' },
    //     { value: '12', label: 'Diciembre' },
    // ]);


    constructor(
    ) {
        this.createForm();
        this.listenFechasSignal();
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

    private listenFechasSignal(): void {
        effect(() => {
            const fechas = this.planingCompartido.fechas();

            if (!fechas) return;

            this.fechaInicioOrigen = fechas.fec_ini;
            this.fechaInicioDestino = fechas.fec_fin;

            this.anioOrigen = fechas.cie_ano;
            this.mesOrigen = fechas.cie_per;

            this.myForm.patchValue({
                fechaInicioOrigen: fechas.fec_ini,
                fechaFinOrigen: fechas.fec_fin,
                anioOrigen: fechas.cie_ano,
                mesOrigen: fechas.cie_per
            });
        });
    }

    // private patchPeriodoOrigen(): void {
    //     if (!this.anioOrigen || !this.mesOrigen) return;

    //     this.myForm.patchValue({
    //         anioOrigen: this.anioOrigen,
    //         mesOrigen: this.mesOrigen
    //     });
    // }

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

        this.planingCompartido.limpiezaBotonNuevo();
    }


    private cargarMeses(year: string): void {
        this.planingService.getMonths(year).subscribe({
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
