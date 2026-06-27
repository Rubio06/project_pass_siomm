import { DecimalPipe } from '@angular/common';
import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlockReserva, EvaluacionBloques, LaborAvance, ProgramacionPlan, ProgramaExplotacion } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/interface/edicion-programa-mensual.interface';
import { EdicionProgrmaMensualService } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/services';

@Component({
    selector: 'app-evaluacion-bloque',
    imports: [ReactiveFormsModule, DecimalPipe],
    templateUrl: './evaluacion-bloque.component.html',
    styleUrl: './evaluacion-bloque.component.css',

})
export class EvaluacionBloqueComponent implements OnInit {
    // nro_prog = input<string>("");
    // cod_labor = input<string>("");
    // cod_tipo_labor = input<string>("");

    edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);
    private fb = inject(FormBuilder);
    cerrarReserva = output<void>();

    blockReservaForm!: FormGroup;
    listBlockReserva = signal<EvaluacionBloques[]>([]);

    programacionLabor = signal<ProgramacionPlan[]>([]);

    enviarEvaluacion = output<object>();

    _listBlockReserva = input<ProgramaExplotacion | null>(null);

    laboresEvaluacionBloque = input<AbstractControl | null>(null);
    // laboresEvaluacionBloque = signal<AbstractControl | null>(null);
    bloquearFila = signal<boolean>(false);

    _totalToneladas = signal(0);
    _leyPonderadaCu = signal(0);
    _totalMetalAu = signal(0);
    _leyPonderadaAg = signal(0);
    _leyPonderadaCuEq = signal(0);

    ngOnInit(): void {
        this.initForm();
        this.EvaluacionBloques();



        this.reservas.valueChanges.subscribe(() => {

            this._totalToneladas.set(this.totalToneladas());

            this._leyPonderadaCu.set(this.leyPonderadaCu());

            this._totalMetalAu.set(this.leyPonderadaAu());

            this._leyPonderadaAg.set(this.leyPonderadaAg());

            this._leyPonderadaCuEq.set(this.leyPonderadaCuEq());

        });


    }

    private initForm(): void {
        this.blockReservaForm = this.fb.group({
            reservas: this.fb.array([])
        });
    }

    private ultimaCabecera: any;



    constructor() {
        effect(() => {
            const cab = this.edicionProgrmaMensualService.cabecera();

            if (!cab) return;

            // 🔥 evita repetir llamadas
            if (JSON.stringify(cab) === JSON.stringify(this.ultimaCabecera)) return;

            this.ultimaCabecera = cab;

        });
    }



    get reservas(): FormArray {
        return this.blockReservaForm.get('reservas') as FormArray;
    }

    private createBlockFormGroup(block: EvaluacionBloques): FormGroup {
        return this.fb.group({
            des_labor: [{ value: block.des_labor, disabled: true }, Validators.required],
            cod_seccion: [block.cod_seccion, Validators.required],

            cod_eje: [{ value: block.cod_eje, disabled: true }, Validators.required],
            prg_tmsextraid: [{ value: block.prg_tmsextraid, disabled: true }, Validators.required],
            prg_leycu: [{ value: block.prg_leycu, disabled: true }, Validators.required],
            prg_leyau: [{ value: block.prg_leyau, disabled: true }, Validators.required],
            prg_leyag: [{ value: block.prg_leyag, disabled: true }, Validators.required],
            prg_leycueq: [{ value: block.prg_leycueq, disabled: true }, Validators.required],

        });
    }



    agregarFila(): void {
        const item = this._listBlockReserva();
        console.log("el arreglo es " + JSON.stringify(item, null, 2))

        const nuevaFila: Partial<EvaluacionBloques> = {
            des_labor: item?.des_labor,
            cod_seccion: '',
            cod_eje: '',
            prg_tmsextraid: 0,
            prg_leycu: 0,
            prg_leyau: 0,
            prg_leyag: 0,
            prg_leycueq: 0,
        };
        this.reservas.push(this.createBlockFormGroup(nuevaFila as EvaluacionBloques));
        this.ProgramacionLabor();
        this.bloquearFila.set(true);
    }

    eliminarFila(index: number): void {
        this.reservas.removeAt(index);
        this.bloquearFila.set(false);
    }

    closeModalReserva(): void {
        this.cerrarReserva.emit();
    }

    onSelectLabor(event: Event, index: number): void {
        const value = (event.target as HTMLSelectElement).value;

        const itemSeleccionado = this.programacionLabor()
            .find(x => x.cod_seccion === value);

        if (!itemSeleccionado) return;

        const fila = this.reservas.at(index);

        fila.patchValue({

            cod_eje: itemSeleccionado.cod_eje,
            prg_tmsextraid: itemSeleccionado.prg_tmsextraid,
            prg_leycu: itemSeleccionado.prg_leycu,
            prg_leyau: itemSeleccionado.prg_leyau,
            prg_leyag: itemSeleccionado.prg_leyag,
            prg_leycueq: itemSeleccionado.prg_leycueq

        });
    }

    private EvaluacionBloques(): void {
        const item = this._listBlockReserva();


        this.edicionProgrmaMensualService.EvaluacionBloques(item!.nro_prog, item!.cod_labor).subscribe({
            next: edicion => {
                this.listBlockReserva.set(edicion);
                this.reservas.clear();
                edicion.forEach(block => {
                    this.reservas.push(this.createBlockFormGroup(block));
                });
            },
            error: error => {
                console.error('Error en EvaluacionBloques:', error);
            }
        });
    }



    private ProgramacionLabor(): void {
        const item = this._listBlockReserva();
        this.edicionProgrmaMensualService.ProgramacionLabor(item!.des_labor).subscribe({
            next: edicion => {
                this.programacionLabor.set(edicion);
            },
            error: error => {
                console.error('Error en EvaluacionBloques:', error);
            }
        });
    }

    saveModalReserva(): void {

        if (this.blockReservaForm.invalid) return;

        const filas = this.reservas.getRawValue();

        const filasFormateadas = filas.map((x: any) => ({

            ...x,

            prg_tmsextraid: Number(x.prg_tmsextraid || 0).toFixed(2),

            prg_leycu: Number(x.prg_leycu || 0).toFixed(2),

            prg_leyau: Number(x.prg_leyau || 0).toFixed(2),

            prg_leyag: Number(x.prg_leyag || 0).toFixed(2),

            prg_leycueq: Number(x.prg_leycueq || 0).toFixed(2)

        }));

        this.enviarEvaluacion.emit(filasFormateadas);

        this.cerrarReserva.emit();

    }

    private totalToneladas(): number {

        return this.reservas.controls.reduce((total, fila) => {

            return total + Number(fila.get('prg_tmsextraid')?.value || 0);

        }, 0);

    }
    private calcularLeyPonderada(campo: string): number {

        let totalMetal = 0;
        let totalToneladas = 0;

        this.reservas.controls.forEach(fila => {

            const tms = Number(fila.get('prg_tmsextraid')?.value || 0);
            const ley = Number(fila.get(campo)?.value || 0);

            totalMetal += (tms * ley);
            totalToneladas += tms;

        });

        if (totalToneladas === 0) {
            return 0;
        }

        return totalMetal / totalToneladas;

    }

    private leyPonderadaCu(): number {
        return this.calcularLeyPonderada('prg_leycu');
    }

    private leyPonderadaAu(): number {
        return this.calcularLeyPonderada('prg_leyau');
    }

    private leyPonderadaAg(): number {
        return this.calcularLeyPonderada('prg_leyag');
    }

    private leyPonderadaCuEq(): number {
        return this.calcularLeyPonderada('prg_leycueq');
    }

}
