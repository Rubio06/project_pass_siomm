import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { TituloModuloComponent } from 'src/app/shared/components/filtros-generales-selects/titulo-modulo/titulo-modulo.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FiltroPlaneamientoService } from '../../services/filtro-planeamiento.service';
import { BotonesComponent } from 'src/app/shared/components/botones/botones.component';
import { AccionPlaneamientoService } from '../../services/accion-planeamiento.service';
import { CommonModule } from '@angular/common';
import { BOTONES_PLANEAMIENTO, BotonesInterface } from '../../interfaces/manenimiento.interface';




@Component({
    selector: 'app-planeamiento',
    imports: [TituloModuloComponent, RouterOutlet, ReactiveFormsModule, BotonesComponent, CommonModule],
    templateUrl: './planeamiento.component.html',
    styleUrl: './planeamiento.component.css',
})
export class PlaneamientoCompoent {

    mantenimientoService = inject(MantenimientoService);
    filtroService = inject(FiltroPlaneamientoService);
    accionService = inject(AccionPlaneamientoService);
    fb = inject(FormBuilder);
    router = inject(Router)

    listEmpresa = signal<any[]>([]);
    listUnidadEmpresa = signal<any[]>([]);

    // botones = signal<BotonesInterface[]>(BOTONES_PLANEAMIENTO);


    botoPresionado = signal<string>('');
    botoColor = signal<string>('');


    // bloqueo = signal<boolean>(true);
    formFiltro: FormGroup = this.fb.group({
        cod_empresa: [{ value: '', disabled: true }],
        cod_empresa_unidad: [{ value: '', disabled: true }]
    });


    ngOnInit(): void {


        this.obtenerDatos();
        this.formFiltro.get('cod_empresa')?.valueChanges.subscribe(valor => {
            this.filtroService.codEmpresa.set(valor);
        });

        this.formFiltro.get('cod_empresa_unidad')?.valueChanges.subscribe(valor => {
            this.filtroService.codEmpresaUnidad.set(valor);
        });

        this.accionService.reset();

        this.accionService.setBloqueos({
            nuevo: true,
            guardar: true,
            cargar: false
        });

    }

    onAccion(tipo: string) {
        switch (tipo) {
            case 'editar':
                this.setBoton('Editar Información', 'bg-[#0369a1]');
                this.obtenerDatos();
                this.accionService.emitir('editar');

                break;

            case 'nuevo':
                this.setBoton('Nuevo Registro', 'bg-[#047857]');
                // this.accionService.setBloqueos({
                //     guardar: false,
                // });

                this.accionService.emitir('nuevo');
                break;

            case 'guardar':
                this.setBoton('Guardar', 'bg-[#013B5C]');
                // this.accionService.setBloqueos({
                //     guardar: true,
                // });
                this.accionService.emitir('guardar');
                break;
        }
    }


    private setBoton(accion: string, color: string) {
        this.botoPresionado.set(`Usted ah presionado el boton ${accion}`);
        this.botoColor.set(color);
    }

    private obtenerDatos(): void {
        forkJoin({
            empresas: this.mantenimientoService.obtenerEmpresa(),
            unidades: this.mantenimientoService.obtenerEmpresaUnidad()
        }).subscribe({
            next: ({ empresas, unidades }) => {

                this.listEmpresa.set(empresas);
                this.listUnidadEmpresa.set(unidades);
                this.formFiltro.patchValue({
                    cod_empresa: empresas[0]?.cod_empresa ?? '',
                    cod_empresa_unidad: unidades[0]?.cod_empresa_unidad ?? ''
                });
            },
            error: error => console.log(error)
        });
    }

    public esRutaContrata(): boolean {
        return this.router.url.includes('contrata');
    }   

    public esAdministracionContratos(): boolean {
        return this.router.url.includes('administracion_de_contratos');
    }
}
