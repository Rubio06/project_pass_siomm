import { Component, effect, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlockReserva, ProgramaExplotacion, ReservaGeologicaFiltro, ReservasGeologicas } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/interface/edicion-programa-mensual.interface';
import { EdicionProgrmaMensualService } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/services';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormularioProgramaMensualComponent } from '../../../../../../formulario-programa-mensual/formulario-programa-mensual.component';

@Component({
    selector: 'app-block-explotacion-reservas',
    imports: [ReactiveFormsModule],
    templateUrl: './block-reservas.component.html',
    styleUrl: './block-reservas.component.css',
})
export class BlockReservaExplotacionComponent implements OnInit {

    cie_anio = input<string | null>(null);

    listaEdicionPrograma = input<ProgramaExplotacion | null>(null)


    formUtils = FormUtils;
    edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);
    private fb = inject(FormBuilder);
    cerrar = output<void>();

    enviarResultado = output<object>();

    blockForm!: FormGroup;
    listBlockReserva = signal<BlockReserva[]>([]);

    // _listBlockReserva = input<ProgramaExplotacion[]>([])
    bloquearFila = signal<boolean>(false);

    listaReservasGeologicas = signal<ReservasGeologicas[]>([]);
    ultimoNroProg = signal<string>('');

    ngOnInit(): void {
        this.initForm();
        this.blockReserva();
        this.reservasGeologicas();
    }

    private initForm(): void {
        this.blockForm = this.fb.group({
            blocks: this.fb.array([])
        });
    }

    get blocks(): FormArray {
        return this.blockForm.get('blocks') as FormArray;
    }

    private createBlockFormGroup(block: BlockReserva): FormGroup {
        return this.fb.group({
            prg_blocks: [block.prg_blocks,  Validators.required],
            num_tms: [[{ value: block.num_tms, disabled: true }, Validators.required],],
            num_ag_veta: [[{ value: block.num_ag_veta, disabled: true }, Validators.required],],
            num_au_veta: [[{ value: block.num_au_veta, disabled: true }, Validators.required],],
            num_cu_veta: [[{ value: block.num_cu_veta, disabled: true }, Validators.required],],
            num_pb_veta: [[{ value: block.num_pb_veta, disabled: true }, Validators.required],],
            num_zn_veta: [[{ value: block.num_zn_veta, disabled: true }, Validators.required],],
            num_anc_veta: [[{ value: block.num_anc_veta, disabled: true }, Validators.required],],
            num_anc_min: [[{ value: block.num_anc_min, disabled: true }, Validators.required],]
        });
    }

    agregarFila(): void {
        const nuevaFila: Partial<BlockReserva> = {
            prg_blocks: '',
            num_tms: 0,
            num_ag_veta: 0,
            num_au_veta: 0,
            num_cu_veta: 0,
            num_pb_veta: 0,
            num_zn_veta: 0,
            num_anc_veta: 0,
            num_anc_min: 0
        };
        this.blocks.push(this.createBlockFormGroup(nuevaFila as BlockReserva));
        this.listBlockReserva.update(lista => [...lista, nuevaFila as BlockReserva]);
        this.bloquearFila.set(true);
    }

    eliminarFila(index: number): void {
        this.blocks.removeAt(index);
        this.listBlockReserva.update(lista => lista.filter((_, i) => i !== index));
        this.bloquearFila.set(false);
    }

    closeModalBlock(): void {
        this.cerrar.emit();
    }

    saveModalBlock(): void {

        if (this.blockForm.invalid) {
            this.formUtils.mensajesBlock('Debe tener datos', 'Tiene que ingresar un Block.');
            return;
        }

        const blocks = this.blockForm.value.blocks;

        // validar que todos tengan block
        const blockVacios = blocks.some((b: any) => !b.prg_blocks);

        if (blockVacios) {
            this.formUtils.mensajesBlock('Falta ingresar un Block', 'Tiene que ingresar un Block.');
            return;
        }

        // convertir a "13,14,15"
        const blocksString = blocks
            .map((b: any) => b.prg_blocks)
            .join(',');

        const resultado = {
            blocks: blocks,
            blocksString: blocksString
        };

        this.enviarResultado.emit(resultado);
        this.cerrar.emit();
    }

    public crearNorProg(): void {

        this.edicionProgrmaMensualService.crearNorProg().subscribe({
            next: (nro_prog: string) => {

                this.ultimoNroProg.set(nro_prog);
            },
            error: error => console.log(error)
        });
    }

    private blockReserva(): void {
        const cabecera = this.listaEdicionPrograma();
        console.log(cabecera?.nro_prog)
        this.edicionProgrmaMensualService.blockReserva(cabecera!.nro_prog).subscribe({
            next: edicion => {
                this.listBlockReserva.set(edicion);
                this.blocks.clear();
                edicion.forEach(block => {
                    this.blocks.push(this.createBlockFormGroup(block));
                });
            },
            error: error => {
                console.error('Error en BlockReserva:', error);
            }
        });
    }

    private reservasGeologicas(): void {

        const lista = this.listaEdicionPrograma();

        const cie_ano = this.edicionProgrmaMensualService.programa();


        const filtro: ReservaGeologicaFiltro = {
            cie_ano: cie_ano.cie_ano,
            cod_uni_econom: lista!.cod_und_econom,
            cod_zona: lista!.cod_zona,
            cod_veta: lista!.cod_veta,
            cod_nivel: lista!.cod_nivel
        };

        this.edicionProgrmaMensualService
            .reservasGeologicas(filtro)
            .subscribe({
                next: data => {
                    this.listaReservasGeologicas.set(data);
                },
                error: error => {
                    console.error('Error en Reservas Geologicas:', error);
                }
            });
    }

    onBlockChange(index: number): void {

        const control = this.blocks.at(index);
        const block = control.get('prg_blocks')?.value;

        if (!block) return;

        // validar duplicados
        const blocksIngresados = this.blocks.value.map((b: any) => b.prg_blocks);

        const duplicados = blocksIngresados.filter((b: string) => b === block);

        if (duplicados.length > 1) {
            this.formUtils.mensajesBlock('Existe un Block similar', 'Los Blocks no pueden ser iguales.');
            control.patchValue({
                prg_blocks: ''
            });

            return;
        }

        // buscar datos geológicos
        const reserva = this.listaReservasGeologicas()
            .find(r => r.num_block == block);

        if (!reserva) {
            // alert('Block no encontrado');
            this.formUtils.mensajesBlock('Block no encontrado', 'El Block seleccionado no fue encontrado.');
            return;
        }

        // llenar automáticamente la fila
        control.patchValue({
            num_tms: reserva.num_tms_total,
            num_ag_veta: reserva.num_ag_diluida,
            num_au_veta: reserva.num_au_diluida,
            num_cu_veta: reserva.num_cu_diluida,
            num_pb_veta: reserva.num_pb_diluida,
            num_zn_veta: reserva.num_zn_diluida,
            num_anc_veta: reserva.num_potencia,
            num_anc_min: reserva.num_potencia_diluida
        });

    }
}
