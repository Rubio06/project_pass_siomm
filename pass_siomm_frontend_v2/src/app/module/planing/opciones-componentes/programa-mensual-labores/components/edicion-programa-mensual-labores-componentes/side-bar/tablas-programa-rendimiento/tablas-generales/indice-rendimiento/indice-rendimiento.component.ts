import { Component, computed, inject, OnInit, signal, } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Ala, CodCta, CodCto, IndiceRendimiento, ProgramaExplotacion, Sostenimiento, TaladrosLargos, valOperativo } from '../../../../../../interface/edicion-programa-mensual.interface';
import { DecimalPipe } from '@angular/common';
import { EdicionProgrmaMensualService } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/services';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-desarrollo-indice-rendimiento',
    imports: [ReactiveFormsModule],
    templateUrl: './indice-rendimiento.component.html',
    styleUrls: ['./indice-rendimiento.component.css']
})
export class IndiceRendimientoComponent implements OnInit {

    programaState = inject(EdicionProgrmaMensualService);
    // private edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);
    private fb = inject(FormBuilder);

    public listaIndiceRendi = signal<IndiceRendimiento[]>([]);
    public listaCto = signal<CodCto[]>([]);
    public listaCta = signal<CodCta[]>([]);
    public listaAla = signal<Ala[]>([]);

    // public listTipoSostenimiento = signal<Sostenimiento[]>([
    //     { cod_sos: 'M', tipo_sosten: 'Mecanizado' },
    //     { cod_sos: 'C', tipo_sosten: 'Convencional' }
    // ]);

    // public listTaladroLargo = signal<TaladrosLargos[]>([
    //     { cod_taladroLargo: 'N', des_taladroLargo: 'No' },
    //     { cod_taladroLargo: 'S', des_taladroLargo: 'Si' }
    // ]);

    public listValOperativo = signal<valOperativo[]>([]);

    programaForm!: FormGroup;

    // codigo_fase = computed(() =>
    //     this.programaState.codFase()
    // );

    private route = inject(ActivatedRoute);
    codigo_fase = signal<string | null>('');

    ngOnInit(): void {
        this.initForm();
        this.loadAllData();

        this.route.params.subscribe(params => {
            const cod = params['codigo_fase']; // <--- Accede al nombre exacto del path
            if (cod) {
                this.codigo_fase.set(cod);

            }
        });
    }

    private initForm(): void {
        this.programaForm = this.fb.group({
            programas: this.fb.array([])
        });
    }

    get programas(): FormArray {
        return this.programaForm.get('programas') as FormArray;
    }

    private createProgramaFormGroup(edicion: IndiceRendimiento): FormGroup {
        return this.fb.group({
            cod_veta: [edicion.cod_veta],
            cod_nivel: [edicion.cod_nivel],
            cod_tipo_labor: [edicion.cod_tipo_labor],
            cod_labor: [edicion.cod_labor],
            cod_ala: [edicion.cod_ala],
            num_dis_limpieza: [edicion.num_dis_limpieza],
            prg_tareas: [edicion.prg_tareas],
            prg_tipace: [edicion.prg_tipace],
            prg_nroper: [edicion.prg_nroper],
            prg_nrowinche: [edicion.prg_nrowinche],
            prg_nropala: [edicion.prg_nropala],
            prg_pieper: [edicion.prg_pieper],
            prg_brocas: [edicion.prg_brocas],
            prg_barcon: [edicion.prg_barcon],
            prg_barren: [edicion.prg_barren],
            prg_dinami: [edicion.prg_dinami],
            prg_fulmin: [edicion.prg_fulmin],
            prg_conect: [edicion.prg_conect],
            prg_punmar: [edicion.prg_punmar],
            prg_tablas: [edicion.prg_tablas],
            prg_pernos: [edicion.prg_pernos],
            prg_mallas: [edicion.prg_mallas],
            prg_cimbras: [edicion.prg_cimbras],
            dist_desde: [edicion.dist_desde],
            dist_hasta: [edicion.dist_hasta]
        });
    }

    private populateForm(data: IndiceRendimiento[]): void {
        this.programas.clear();
        data.forEach(edicion => {
            this.programas.push(this.createProgramaFormGroup(edicion));
        });
    }

    onSubmit(): void {
        if (this.programaForm.valid) {
            const formData = this.programaForm.value.programas.map((programa: any) => ({
                ...programa,
                num_dis_limpieza: programa.num_dis_limpieza ? Number(programa.num_dis_limpieza).toFixed(2) : null,
                prg_tareas: programa.prg_tareas ? Number(programa.prg_tareas).toFixed(2) : null,
                prg_nroper: programa.prg_nroper ? Number(programa.prg_nroper).toFixed(2) : null,
                prg_nrowinche: programa.prg_nrowinche ? Number(programa.prg_nrowinche).toFixed(2) : null,
                prg_nropala: programa.prg_nropala ? Number(programa.prg_nropala).toFixed(2) : null,
                prg_pieper: programa.prg_pieper ? Number(programa.prg_pieper).toFixed(2) : null,
                prg_brocas: programa.prg_brocas ? Number(programa.prg_brocas).toFixed(2) : null,
                prg_barcon: programa.prg_barcon ? Number(programa.prg_barcon).toFixed(2) : null,
                prg_barren: programa.prg_barren ? Number(programa.prg_barren).toFixed(2) : null,
                prg_dinami: programa.prg_dinami ? Number(programa.prg_dinami).toFixed(2) : null,
                prg_fulmin: programa.prg_fulmin ? Number(programa.prg_fulmin).toFixed(2) : null,
                prg_conect: programa.prg_conect ? Number(programa.prg_conect).toFixed(2) : null,
                prg_punmar: programa.prg_punmar ? Number(programa.prg_punmar).toFixed(2) : null,
                prg_tablas: programa.prg_tablas ? Number(programa.prg_tablas).toFixed(2) : null,
                prg_pernos: programa.prg_pernos ? Number(programa.prg_pernos).toFixed(2) : null,
                prg_mallas: programa.prg_mallas ? Number(programa.prg_mallas).toFixed(2) : null,
                prg_cimbras: programa.prg_cimbras ? Number(programa.prg_cimbras).toFixed(2) : null,
                dist_desde: programa.dist_desde ? Number(programa.dist_desde).toFixed(2) : null,
                dist_hasta: programa.dist_hasta ? Number(programa.dist_hasta).toFixed(2) : null
            }));
            console.log('Datos a guardar:', formData);
        }
    }

    private async loadAllData(): Promise<void> {

        // this.isLoading.set(true);

        const cabecera = this.programaForm.get('programas')?.value;
        const codFase = cabecera?.cod_fase || '01';
        const codZona = cabecera?.cod_zona;

        const prefijoMap: Record<string, string> = {
            '01': 'E', '02': 'D', '03': 'P', '04': 'T', '05': 'O', '06': 'R', '07': 'O'
        };

        const prefFase = prefijoMap[codFase];

        const cie_ano = this.programaState.programa().cie_ano;
        const cie_per = this.programaState.programa().cie_per;

        try {

            const [prefParametro, prefZona] = await Promise.all([
                this.programaState.obtenerPrefCtoMina().toPromise(),
                this.programaState.obtenerPrefZona(codZona).toPromise()
            ]);

            let prefijoBusqueda = '';

            if (codFase === '07') {
                prefijoBusqueda = prefFase;
            } else {
                prefijoBusqueda = `${prefParametro.pref_cto_mina}-${prefZona.cod_costo_equivalente}${prefFase}`;
            }
            const cie_ano = this.programaState.programa().cie_ano;
            const cie_per = this.programaState.programa().cie_per;
            const cod = ''
            Promise.all([
                this.programaState.selectCodCto(cie_ano!, prefijoBusqueda).toPromise(),
                this.programaState.selectCodCta(cie_ano!).toPromise(),
                this.programaState.selectAla().toPromise(),
                this.programaState.selectValOperativo(cie_ano!, cie_per!).toPromise()
            ]).then(([cto, cta, ala, valOp]) => {
                this.listaCto.set(cto || []);
                this.listaCta.set(cta || []);
                this.listaAla.set(ala || []);
                this.listValOperativo.set(valOp || []);
                this.indiceRendimiento();
            });
        } catch (error) {
            console.log(error);
        }
    }


    private indiceRendimiento(): void {
        const nroProg = this.programaState.programa().nro_prog;

        if (!nroProg) {
            console.error('No existe nro_prog en la ruta');
            return;
        }

        this.programaState.indiceRendimiento(nroProg, this.codigo_fase()!).subscribe({
            next: ind => {
                this.listaIndiceRendi.set(ind);
                this.populateForm(ind);
            },
            error: error => console.log(error)
        });
    }

    calcularTotal(campo: string): string {
        const total = this.listaIndiceRendi().reduce((sum, item: any) => {
            const valor = item[campo];
            return sum + (valor ? Number(valor) : 0);
        }, 0);
        return total.toFixed(2);
    }

}
