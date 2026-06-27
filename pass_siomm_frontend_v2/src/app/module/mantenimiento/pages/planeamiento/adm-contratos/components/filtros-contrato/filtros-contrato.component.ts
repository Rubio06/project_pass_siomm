import { ChangeDetectionStrategy, Component, inject, input, output, signal, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Contrata } from 'src/app/module/mantenimiento/interfaces/manenimiento.interface';
import { MantenimientoService } from 'src/app/module/mantenimiento/services/mantenimiento.service';
import { FiltrosAdmContrato } from '../../interfaces/adm-contrato.interface';

@Component({
    selector: 'app-filtros-contrato',
    imports: [ReactiveFormsModule],
    templateUrl: './filtros-contrato.component.html',
})
export class FiltrosContratoComponent implements OnInit {
    private fb = inject(FormBuilder);
    private mantenimientoService = inject(MantenimientoService);

    public listContrata = signal<Contrata[]>([]);

    public loadingChange = output<boolean>();

    form!: FormGroup;


    activarLoading() {
        this.loadingChange.emit(true);
    }

    ngOnInit(): void {
        this.inicializarFormulario();
        this.obtenerAdmContrata();
        this.onDetectarFiltros();

    }




    public obtenerAdmContrata() {
        this.mantenimientoService.obtenerAdmContrata().subscribe({
            next: (contratas) => {
                this.listContrata.set([
                    {
                        cod_contrata: '%',
                        des_contrata: '== TODO =='
                    },
                    ...contratas
                ]);

            }, error: (error) => {
                console.error('Error al obtener las contratas:', error);
            }
        })
    }

    private inicializarFormulario(): void {
        this.form = this.fb.group({
            cod_contrata: ['%'],
            cod_contrato: [''],
            ind_estado: ['%'],
            fec_all: [false],
            fec_registro: [''],
            fec_inicio: [{ value: '', disabled: true }],
            fec_termino: [{ value: '', disabled: true }],
            dia_all: [false],
            dia_ini: [{ value: '', disabled: true }],
            dia_fin: [{ value: '', disabled: true }],
        });
    }


    private onObtenerUltFecha(fecha: Date): string {
        return fecha.toISOString().split('T')[0];
    }

    private obtenerDiasDelAnio(): number {
        const anio = new Date().getFullYear();
        return new Date(anio, 1, 29).getMonth() === 1
            ? 366
            : 365;
    }

    private onDetectarFiltros(): void {

        this.form.get('fec_all')?.valueChanges.subscribe((checked) => {
            if (checked) {
                const fechaActual = new Date();
                const inicioAnio = `${fechaActual.getFullYear()}-01-01`;

                this.form.patchValue({
                    fec_inicio: inicioAnio,
                    fec_termino: this.onObtenerUltFecha(fechaActual)
                });
            } else {

                this.form.patchValue({
                    fec_inicio: null,
                    fec_termino: null
                });
            }
        });

        this.form.get('dia_all')?.valueChanges.subscribe((checked) => {

            if (checked) {
                this.form.patchValue({
                    dia_ini: 1,
                    dia_fin: this.obtenerDiasDelAnio()
                });

            } else {
                this.form.patchValue({
                    dia_ini: null,
                    dia_fin: null
                });

            }

        })


    }

    public onObtenerFiltros(): FiltrosAdmContrato {
        return this.form.getRawValue();
    }

    public onLimpiarFiltros(): void {
        this.form.reset({
            cod_contrata: '%',
            cod_contrato: '',
            ind_estado: '%',
            fec_all: false,
            fec_registro: '',
            fec_inicio: { value: '', disabled: true },
            fec_termino: { value: '', disabled: true },
            dia_all: false,
            dia_ini: { value: '', disabled: true },
            dia_fin: { value: '', disabled: true },
        });
    }

}
