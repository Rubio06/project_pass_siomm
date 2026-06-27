import { ChangeDetectorRef, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EdicionProgrmaMensualService } from '../../../services/edicionProgrmaMensual.service';
import { LaborAvance, LaboresAvanceLimit } from '../../../interface/edicion-programa-mensual.interface';
import { CommonModule, JsonPipe } from '@angular/common';
import { BotonAccionService } from '../../../services';

@Component({
    selector: 'app-modal-lista-avance',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './modal-lista-avance.component.html',
})
export class ModalListaAvanceComponent implements OnInit {
    programaState = inject(EdicionProgrmaMensualService);
    Math = Math;

    total = signal<number>(0);
    page = signal<number>(0);
    pageSize = signal<number>(20); // 🔥 NUNCA 0

    arregloaDatos = signal<any[]>([]);

    cerrarModal = output<void>();
    // listaAvance = signal<LaborAvance[]>([]);
    cdr = inject(ChangeDetectorRef);
    fb = inject(FormBuilder);

    datoEst = input<string>('')

    filaSeleccionada = signal<LaborAvance | null>(null);

    enviarLabor = output<LaborAvance>();

    formularioLabores = this.fb.group({
        labores: this.fb.array([])
    });

    get labores() {
        return this.formularioLabores.get('labores') as FormArray;
    }

    private infoProgMensual(): void {
        const nroProg = this.programaState.programa().nro_prog;

        this.programaState.infoProgMensual(nroProg!).subscribe({
            next: info => {

                this.arregloaDatos.set(info);

            },
            error: error => console.log(error)
        });
    }

    cargarLabores(data: LaborAvance[]) {
        this.labores.clear();

        data.forEach((item, index) => {

            this.labores.push(this.fb.group({
                cod_labor: [item.cod_labor],
                des_labor: [item.des_labor],
                cod_nom_veta: [item.cod_nom_veta],
                cod_nivel: [item.cod_nivel],
                cod_tipo_labor: [item.cod_tipo_labor],
                cod_tipo_labor_ant: [item.cod_tipo_labor_ant],
                cod_labor_ant: [item.cod_labor_ant]
            }));
        });
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.listaAvanceLabores();
        this.infoProgMensual();
    }


    public seleccionarFila(item: LaborAvance) {
        this.filaSeleccionada.set(item);
    }

    public onGuardar() {

        if (this.formularioLabores.invalid) {
            return;
        }
        const fila = this.filaSeleccionada();

        if (!fila) {
            console.warn("No hay fila seleccionada");
            return;
        }
        const data = {
            fila: { ...fila }
        };

        this.enviarLabor.emit(data.fila);

        this.onCerrar();
    }

    private listaAvanceLabores(): void {
        const page = this.page() + 1; // backend empieza en 1
        const pageSize = this.pageSize();

        this.programaState.listaAvanceLabores("02", "01", page, pageSize).subscribe({
            next: (res: LaboresAvanceLimit) => {
                this.total.set(res.total);
                // 🔥 convertir a base 0
                this.page.set(res.page - 1);

                this.pageSize.set(res.pageSize || 20);

                this.cargarLabores(res.data);
            },
            error: error => {
                console.error('Error en listaAvanceLabores:', error);
            }
        });
    }

    trackByIndex(index: number) {
        return index;
    }

    totalPages(): number {
        if (this.pageSize() === 0) return 0;
        return Math.ceil(this.total() / this.pageSize());
    }

    cambiarPagina(p: number) {
        const nuevaPagina = Number(p);

        if (nuevaPagina === this.page()) return;
        if (nuevaPagina < 0 || nuevaPagina >= this.totalPages()) return;

        this.page.set(nuevaPagina);
        this.listaAvanceLabores();
    }

    getDesde(): number {
        if (this.total() === 0) return 0;
        return this.page() * this.pageSize() + 1;
    }

    getHasta(): number {
        const hasta = (this.page() + 1) * this.pageSize();
        return hasta > this.total() ? this.total() : hasta;
    }

    totalPagesArray() {
        return Array(this.totalPages());
    }

    private botonAccionService = inject(BotonAccionService);


    onCerrar() {
        this.botonAccionService.cerrar();
    }
}
