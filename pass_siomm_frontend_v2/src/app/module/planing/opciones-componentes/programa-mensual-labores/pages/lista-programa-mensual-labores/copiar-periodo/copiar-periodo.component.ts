import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListaMensual } from '../../../interface';
import { ListaMensualService } from '../../../services';
import { FormUtils } from 'src/app/utils/form-utils';
import { CopiarProgramacionRequest, ResponsePrograma } from '../../../interface/programa-mensual.interface';

type Mes = { value: string; label: string };

@Component({
    selector: 'app-copiar-periodo',
    imports: [ReactiveFormsModule],
    templateUrl: './copiar-periodo.component.html',
})
export class CopiarPeriodoComponent {

    private fb = inject(FormBuilder);

    cerrar = output<void>();
    private programaService = inject(ListaMensualService);

    private utils = FormUtils;

    listaPrograma = input<ListaMensual[]>([]);


    form!: FormGroup;

    meses = signal<Mes[]>([
        { value: '01', label: 'Enero' },
        { value: '02', label: 'Febrero' },
        { value: '03', label: 'Marzo' },
        { value: '04', label: 'Abril' },
        { value: '05', label: 'Mayo' },
        { value: '06', label: 'Junio' },
        { value: '07', label: 'Julio' },
        { value: '08', label: 'Agosto' },
        { value: '09', label: 'Septiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' }
    ]);

    ngOnInit() {
        const anioActual = new Date().getFullYear();

        this.form = this.fb.group({
            cie_anio: [anioActual.toString(), Validators.required],
            cie_per: ['01', Validators.required]
        });
    }

    public aceptar() {
        const username = sessionStorage.getItem('username') ?? '';

        const programa = this.listaPrograma()[0];
        if (!programa) return;

        const params: CopiarProgramacionRequest = {
            cod_empresa: programa.cod_empresa,
            cod_empresa_unidad: programa.cod_empresa_unidad,
            nro_prog: programa.nro_prog,
            cie_ano: this.form.value.cie_anio,
            cie_per: this.form.value.cie_per,
            usuario: username
        };


        this.programaService.copiarProgramacion(params)
            .subscribe({
                next: (resp: ResponsePrograma) => {
                    this.utils.alertaExitoAnulacion("Copia de Programación",resp.mensaje);
                    this.cancelar();
                },
                error: (err) => {
                    console.error("Error al copiar programa", err);
                    this.utils.mensajeError("No se pudo copiar el programa");
                }
            });
    }

    public cancelar(): void {
        this.cerrar.emit();
    }
}
