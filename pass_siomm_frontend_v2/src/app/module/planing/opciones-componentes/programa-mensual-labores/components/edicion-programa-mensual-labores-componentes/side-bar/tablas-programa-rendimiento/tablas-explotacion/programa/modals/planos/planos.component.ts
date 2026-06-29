import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { EdicionProgrmaMensualService } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/services';
import { FormUtils } from 'src/app/utils/form-utils';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EliminarPlano, MostrarPlanos, PlanoMetadata, ProgramaExplotacion } from 'src/app/module/planing/opciones-componentes/programa-mensual-labores/interface/edicion-programa-mensual.interface';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-planos-explotacion',
    imports: [CommonModule],
    templateUrl: './planos.component.html',
    styleUrl: './planos.component.css',
})
export class PlanosExplotacionComponent implements OnInit {
    pdfSeleccionado!: SafeResourceUrl;
    domSanitizer = inject(DomSanitizer);

    edicionProgrmaMensualService = inject(EdicionProgrmaMensualService);

    listMostrarPlanos = signal<MostrarPlanos[]>([]);

    formUtils = FormUtils;

    _listMostrarPlanos = input<ProgramaExplotacion[]>([]);
    laboresEvaluacionBloque = input<AbstractControl | null>(null);
    private ultimaCabecera: any;
    private fase: any;
    cerrarPlano = output<void>();


    filaSelecionada = signal<number>(0);

    ngOnInit(): void {
        this.mostrarPlanos();
    }

    // constructor() {
    //     effect(() => {
    //         const cab = this.edicionProgrmaMensualService.cabecera();
    //         const fase = this.edicionProgrmaMensualService.codFase();

    //         if (!cab) return;

    //         // 🔥 evita repetir llamadas
    //         if (JSON.stringify(cab) === JSON.stringify(this.ultimaCabecera)) return;

    //         this.ultimaCabecera = cab;

    //         this.fase = fase;
    //         // console.log("🔥 fase en el componente de planos:", this.fase);

    //         // console.log("🔥 fase cambió:", fase);
    //     });

    //     // this.mostrarPlanos();

    // }


    closeModalPlano(): void {
        this.cerrarPlano.emit();
    }

    public subirArchivo(event: any): void {

        const input = event.target as HTMLInputElement;
        const file: File | null = input.files?.[0] ?? null;
        if (!file) return;

        this.formUtils.pedirTituloPlano().then(titulo => {
            if (!titulo) {
                input.value = '';
                return;
            }

            // console.log("item es " + JSON.stringify(item, null, 2));

            // const control = this.laboresEvaluacionBloque();
            // const data = control?.getRawValue();
            // const cab = this.edicionProgrmaMensualService.cabecera();
            const fase = this.edicionProgrmaMensualService.codFase();

            const lista = this._listMostrarPlanos()[0];

            const metadata: PlanoMetadata = {
                file: file,
                titulo: titulo,
                nro_prog: lista.nro_prog,
                cod_und_econom: lista.cod_und_econom,
                cod_zona: lista.cod_zona,
                cod_veta: lista.cod_veta,
                cod_nivel: lista.cod_nivel,
                cod_tipo_labor: lista.cod_tipo_labor,
                cod_labor: lista.cod_labor,
                // cod_ala: item.cod_ala || '',

                cod_fase: fase || '01',
            };

            this.edicionProgrmaMensualService.subirPlano(metadata).subscribe({
                next: (resp) => {
                    if (resp.resultado === 1) {
                        this.formUtils.mensajesBlock(resp.mensaje, 'El plano fue ingresado exitosamente.');
                    } else {
                        this.formUtils.mensajesBlock(resp.mensaje, 'Hubo un error al subir el Plano.');
                    }
                    this.mostrarPlanos();
                    this.closeModalPlano();
                },
                error: (error) => console.error(error)
            });

            input.value = '';
        });
    }

    private mostrarPlanos(): void {

        const fase = this.edicionProgrmaMensualService.codFase();

        const lista = this._listMostrarPlanos()[0];

        const datos: any = {

            nro_prog: lista.nro_prog,
            cod_und_econom: lista.cod_und_econom,
            cod_zona: lista.cod_zona,
            cod_veta: lista.cod_veta?.split(' - ')[0]?.trim() ?? '',
            cod_nivel: lista.cod_nivel,
            cod_tipo_labor: lista.cod_tipo_labor,
            cod_labor: lista.cod_labor,
            // cod_ala: item.cod_ala || '',
            cod_fase: fase || '01',
        };

        this.edicionProgrmaMensualService.mostrarPlanos(datos).subscribe({
            next: plano => {
                this.listMostrarPlanos.set(plano);
            },

            error: error => {
                console.log(error)
            }
        });
    }

    selecionarLista(plano: MostrarPlanos): void {

        this.filaSelecionada.set(plano.secuencia);
        const url =
            `https://localhost:44334/planeamiento/edicion-programa-mensual/planos/${plano.nombre_archivo}`;

        this.pdfSeleccionado =
            this.domSanitizer.bypassSecurityTrustResourceUrl(url);

    }

    eliminarPlano() {
        if (!this.listMostrarPlanos() || this.listMostrarPlanos().length === 0) {
            this.formUtils.planosMensajeTabla('Sin registros', 'No hay datos en la tabla para eliminar.');
            return;
        }

        if (!this.filaSelecionada()) {
            this.formUtils.planosMensajeTabla('Seleccione un plano', 'Debe seleccionar un plano de la lista para eliminar.');
            return;
        }

        this.formUtils.confirmarEliminacionPlanos(
            '¿Eliminar plano?',
            'Esta acción eliminará el plano seleccionado.'
        ).then(result => {

            if (!result.isConfirmed) return;
            // const cab = this.edicionProgrmaMensualService.cabecera();

            // const control = this.laboresEvaluacionBloque();
            // const data = control?.getRawValue();

            const lista = this._listMostrarPlanos()[0];
            const fase = this.edicionProgrmaMensualService.codFase();

            const datos: EliminarPlano = {
                nro_prog: lista.nro_prog,
                cod_und_econom: lista.cod_und_econom,
                cod_zona: lista.cod_zona,
                cod_veta: lista.cod_veta,
                cod_nivel: lista.cod_nivel,
                cod_tipo_labor: lista.cod_tipo_labor,
                cod_labor: lista.cod_labor,
                // cod_ala: item.cod_ala || '',
                cod_fase: fase || '01',
                secuencia: this.filaSelecionada()
            };

            this.edicionProgrmaMensualService.eliminarPlano(datos)
                .subscribe({
                    next: res => {

                        if (!res) return;

                        if (res.resultado === 1) {
                            this.formUtils.alertaEliminado(res.mensaje);
                            this.mostrarPlanos();
                            this.pdfSeleccionado = '';
                        }
                        else {
                            this.formUtils.mensajeError(res.mensaje);
                        }

                    }
                });
        });
    }
}

