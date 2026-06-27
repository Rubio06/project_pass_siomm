import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EdicionProgrmaMensualService } from '../../../services/edicionProgrmaMensual.service';
import { ContrataDto, MaestrosProgMensual, UndEconomDto, ZonaDto } from '../../../interface/edicion-programa-mensual.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { ActivatedRoute } from '@angular/router';
import { ProgramaMensualInformacion } from '../../../interface';
import { BotonAccionService } from '../../../services/boton-accion.service';

@Component({
    selector: 'app-formulario-programa-mensual',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './formulario-programa-mensual.component.html',
    styleUrls: ['./formulario-programa-mensual.component.css']
})
export class FormularioProgramaMensualComponent implements OnInit {

    private programaState = inject(EdicionProgrmaMensualService);
    private fb = inject(FormBuilder);
    private botonAccionService = inject(BotonAccionService);

    formUtil = FormUtils;
    programaForm!: FormGroup;
    unidadesEcon = signal<UndEconomDto[]>([]);
    zonas = signal<ZonaDto[]>([]);
    contrata = signal<ContrataDto[]>([]);

    datosFormulario = output();

    detallePrg = signal<any[]>([]);


    modoActual = signal<string>('');

    ultimoNroProg = signal<string>('');

    public modo = signal<'nuevo' | 'ver' | 'editar' | null>(null);

    ngOnInit(): void {

        this.initForm();
        this.modo.set(this.programaState.getModo());
        this.obtenerInfoMaestro();

        if (this.modo() !== 'nuevo' && this.programaState.programa().nro_prog) {
            this.infoProgMensual();
        }

        this.aplicarModo();

        this.programaForm.valueChanges.subscribe(() => {

            this.botonAccionService.formularioCabValido.set(this.programaForm.valid);

            if (this.programaForm.invalid) return;

            const data = this.onSudmit();

            this.programaState.setCabecera(data);
        });

        this.programaForm.get('prg_cutoff')?.valueChanges.subscribe(value => {
            this.programaState.setCutoff(value);
        });

        // 4️⃣ Obtener los datos del servicio
        // const datos = this.programaState.programa();
        // console.log('Nro Prog:', datos.nro_prog!);
        // console.log('Año:', datos.cie_ano);
        // console.log('Mes:', datos.cie_per);
    }


    private initForm(): void {
        this.programaForm = this.fb.group({
            cod_und_econom: ['', Validators.required],
            cod_contrata: ['', Validators.required],
            cod_zona: ['', Validators.required],
            prg_cutoff: ['', Validators.required],
            nro_prog: [''],
            cie_ano: [''],
            cie_per: [''],
            fec_emi: [''],
            prg_est: [''],
            ind_calc_dil: [null]
        });
    }

    private aplicarModo(): void {
        if (this.modo() === 'nuevo') {
            const cie_ano = this.programaState.programa().cie_ano;
            const cie_per = this.programaState.programa().cie_per;

            this.programaForm.enable();

            this.programaForm.get('nro_prog')?.disable();
            this.programaForm.get('cie_ano')?.disable();
            this.programaForm.get('cie_per')?.disable();
            this.programaForm.get('fec_emi')?.disable();
            this.programaForm.get('prg_est')?.disable();

            this.programaForm.patchValue({
                cie_ano: cie_ano,
                cie_per: cie_per,
                fec_emi: this.formUtil.formatDate(new Date()),
                prg_est: this.transformarEstado('G')
            });

            this.crearNorProg();

        } else if (this.modo() === 'ver') {
            this.programaForm.disable();
            this.programaForm.get('prg_cutoff')?.enable();

        }
    }

    public crearNorProg(): void {

        this.programaState.crearNorProg().subscribe({
            next: (nro_prog: string) => {

                this.ultimoNroProg.set(nro_prog);

                // 🔥 AQUI recién asignas
                this.programaForm.patchValue({
                    nro_prog: nro_prog
                });

            },
            error: error => console.log(error)
        });
    }


    private cargarFormulario(data: ProgramaMensualInformacion): void {

        const cutoffFormateado = this.cutoffFormateado(data.prg_cutoff?.toString() ?? null);
        const indCalcDil = data.ind_calc_dil;

        this.programaForm.patchValue({
            cod_und_econom: data.cod_und_econom,
            cod_contrata: data.cod_contrata,
            cod_zona: data.cod_zona,
            prg_cutoff: cutoffFormateado,
            nro_prog: data.nro_prog,
            cie_ano: data.cie_ano,
            cie_per: data.cie_per,
            fec_emi: this.formUtil.formatDate(data.fec_emi),

            prg_est: this.transformarEstado(data.prg_est),
            ind_calc_dil: 'C'
        });
        this.actualizarPrgCutoff(Number(cutoffFormateado));
        this.actualizarIndCalcDil(!!indCalcDil);
    }

    private infoProgMensual(): void {
        const nroProg = this.programaState.programa().nro_prog;

        this.programaState.infoProgMensual(nroProg!).subscribe({
            next: (info: ProgramaMensualInformacion[]) => {
                if (info.length > 0) {
                    this.detallePrg.set(info);

                    this.cargarFormulario(info[0]);
                }
            },
            error: error => console.log(error)
        });
    }

    private transformarEstado(estado: string | null | undefined): string {
        const estados: Record<string, string> = {
            G: 'Generado',
            A: 'Anulado',
            B: 'Aprobado'
        };

        return estados[estado ?? ''] ?? '';
    }

    private cutoffFormateado(cutoff: string | null | undefined): string {
        // const cutoff = this.programaForm.get('prg_cutoff')?.value;
        return cutoff != null ? Number(cutoff).toFixed(2) : '';
    }

    private obtenerInfoMaestro(): void {
        this.programaState.obtenerInfoMaestro().subscribe({
            next: (info: MaestrosProgMensual) => {
                this.unidadesEcon.set(info.listaUndEcon);
                this.zonas.set(info.listaZona);
                this.contrata.set(info.listContrata);
            },
            error: error => console.log(error)
        });
    }


    private actualizarPrgCutoff(valor: number) {
        this.detallePrg.set(this.detallePrg().map((row: any) => ({
            ...row,
            prg_cutoff: valor
        })));
    }

    private actualizarIndCalcDil(valor: boolean) {
        this.detallePrg().forEach((row, index) => {
            row.ind_calc_dil = valor;
            this.calculoFila(row, index); // tu función equivalente a wf_calculo
        });
    }

    private calculoFila(row: any, index: number) {
        // 0️⃣ Parámetros base
        const facAg = row.facAg ?? 0;
        const facCu = row.facCu ?? 0;
        const facPb = row.facPb ?? 0;
        const facZn = row.facZn ?? 0;
        const facAu = row.facAu ?? 0;

        const densidadMineral = row.densidadMineral ?? 2.7;
        const densidadDesmonte = row.densidadDesmonte ?? 2.0;
        const vptMin = row.vptMin ?? 100;

        // 1️⃣ Calcular ancho minado y dilución
        const resultado = this.calcularAnchoMinado(
            row.tipoCalculoDilucion,   // 'A' o 'M'
            row.metodoCalculoDilucion, // 'O' o 'C'
            row.prgAncvet ?? 0,        // ancho veta
            row.numBuzamiento ?? 0,    // buzamiento
            row.variableOhara ?? 0     // variable Ohara
        );

        row.prgAncmin = resultado.anchoMinado;
        row.prgPorDilucion = resultado.porDilucion;
        row.prgAncDil = resultado.anchoDil;

        // 2️⃣ Calcular VPT
        const vpt = (row.prgLeyAg * facAg) +
            (row.prgLeyCu * facCu) +
            (row.prgLeyPb * facPb) +
            (row.prgLeyZn * facZn) +
            (row.prgLeyAu * facAu);

        row.prgVptMin = vpt;

        // 3️⃣ Calcular toneladas
        if (vpt >= vptMin) {
            row.prgTmsRotVet = Math.round((row.prgAltcor ?? 0) *
                (row.prgNumTraminProg ?? 0) *
                (row.prgAncvet ?? 0) *
                densidadMineral);

            row.prgTmsRotDil = Math.round((row.prgAltcor ?? 0) *
                (row.prgNumTraminProg ?? 0) *
                ((row.prgAncmin ?? 0) - (row.prgAncvet ?? 0)) *
                densidadDesmonte);
        } else {
            row.prgTmsRotVet = 0;
            row.prgTmsRotDil = 0;
        }

        row.prgTmsExtraid = row.prgTmsRotVet + row.prgTmsRotDil;

        // 4️⃣ Calcular leyes diluidas si aplica
        if (row.ind_calc_dil) {
            const ancMin = row.prgAncmin ?? 1;
            const ancVet = row.prgAncvet ?? 1;

            if (ancMin > 0) {
                row.prgLeyAgDil = +(ancVet * row.prgLeyAg / ancMin).toFixed(2);
                row.prgLeyCuDil = +(ancVet * row.prgLeyCu / ancMin).toFixed(2);
                row.prgLeyPbDil = +(ancVet * row.prgLeyPb / ancMin).toFixed(2);
                row.prgLeyZnDil = +(ancVet * row.prgLeyZn / ancMin).toFixed(2);
                row.prgLeyAuDil = +(ancVet * row.prgLeyAu / ancMin).toFixed(2);

                row.prgVptDil = (row.prgLeyAgDil * facAg) +
                    (row.prgLeyCuDil * facCu) +
                    (row.prgLeyPbDil * facPb) +
                    (row.prgLeyZnDil * facZn) +
                    (row.prgLeyAuDil * facAu);
            } else {
                row.prgLeyAgDil = row.prgLeyAg;
                row.prgLeyCuDil = row.prgLeyCu;
                row.prgLeyPbDil = row.prgLeyPb;
                row.prgLeyZnDil = row.prgLeyZn;
                row.prgLeyAuDil = row.prgLeyAu;
                row.prgVptDil = vpt;
            }
        } else {
            row.prgLeyAgDil = row.prgLeyAg;
            row.prgLeyCuDil = row.prgLeyCu;
            row.prgLeyPbDil = row.prgLeyPb;
            row.prgLeyZnDil = row.prgLeyZn;
            row.prgLeyAuDil = row.prgLeyAu;
            row.prgVptDil = vpt;
        }

        // 5️⃣ Actualizar signal
        const detallesActualizados = [...this.detallePrg()];
        detallesActualizados[index] = { ...row };
        this.detallePrg.set(detallesActualizados);
    }

    private calcularAnchoMinado(
        tipoCalculo: 'A' | 'M',            // as_ind_tipo_calculo_dilucion
        metodoCalculo: 'O' | 'C',          // as_ind_calculo_dilucion
        anchoVeta: number,                  // adc_ancho_veta
        buzamiento: number,                 // adc_buzamiento
        variableOhara: number               // adc_variable_ohara
    ): { anchoMinado: number, porDilucion: number, anchoDil: number } {

        let porDilucion = 0;
        let anchoDil = 0;
        let anchoMinado = 0;

        switch (tipoCalculo) {
            case 'A': // Automático
            case 'M': // Manual
                if (metodoCalculo === 'O') {
                    if (buzamiento < 45) {
                        porDilucion = variableOhara / (Math.sqrt(anchoVeta) * Math.sin(((90 - buzamiento) * Math.PI) / 180));
                    } else {
                        porDilucion = variableOhara / (Math.sqrt(anchoVeta) * Math.cos(((90 - buzamiento) * Math.PI) / 180));
                    }

                    porDilucion = porDilucion / 100; // convertir a porcentaje
                    anchoDil = +(anchoVeta * porDilucion / (1 - porDilucion)).toFixed(2);

                    if (anchoVeta > 1.5) {
                        anchoMinado = +(anchoVeta + anchoDil).toFixed(2);
                    } else {
                        anchoMinado = 1.5;
                    }

                } else if (metodoCalculo === 'C') {
                    // Cálculo por contrato
                    if (tipoCalculo === 'A') { // caso automático + contrato
                        if (anchoVeta <= 0.5) anchoMinado = 0.8;
                        else if (anchoVeta <= 0.8) anchoMinado = anchoVeta + 0.3;
                        else if (anchoVeta <= 1.0) anchoMinado = anchoVeta * 1.15;
                        else if (anchoVeta <= 1.2) anchoMinado = anchoVeta * 1.10;
                        else anchoMinado = anchoVeta;
                    }
                    // si es 'M' y 'C', se ingresa manualmente, no se calcula
                }
                break;
        }
        console.log("los tres datos " + anchoMinado, porDilucion, anchoDil)

        return { anchoMinado, porDilucion, anchoDil };
    }

    private transformarEstadoInvertido(estado: string | null | undefined): string {
        const estados: Record<string, string> = {
            'Generado': 'G',
            'Anulado': 'A',
            'Aprobado': 'B'
        };

        return estados[estado ?? ''] ?? '';
    }

    onSudmit() {
        const username = sessionStorage.getItem('username');



        const data = this.programaForm.getRawValue();

        data.nro_prog = data.nro_prog.toString();
        // 👇 aquí lo fuerzas
        data.ind_calc_dil = data.ind_calc_dil ?? 'C';
        data.prg_est = this.transformarEstadoInvertido(data.prg_est);
        data.cod_usuario_creo = username ?? 'desconocido';
        data.fec_emi = new Date().toISOString();

        return data;
    }

    // enviarDataServicio() {
    //     const data = this.onSudmit();

    //     // console.log("enviando al servicio " + JSON.stringify(data, null, 2));

    //     this.programaState.setCabecera(data);
    // }

}
