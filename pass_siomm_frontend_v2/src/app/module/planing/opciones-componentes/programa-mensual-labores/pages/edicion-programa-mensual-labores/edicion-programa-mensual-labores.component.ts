import { Component, effect, inject, OnInit, OnDestroy, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TituloModuloComponent } from 'src/app/shared/components/filtros-generales-selects/titulo-modulo/titulo-modulo.component';
import { EdicionProgrmaMensualService } from '../../services/edicionProgrmaMensual.service';
import { ARREGLO_BOTONES_PR_MENSUAL, BotonesInterface, ProgramaMensualInformacion } from '../../interface/programa-mensual.interface';
import { CommonModule } from '@angular/common';
import { BotonAccionService } from '../../services/boton-accion.service';
import { FormularioProgramaMensualComponent } from '../../components/edicion-programa-mensual-labores-componentes/formulario-programa-mensual/formulario-programa-mensual.component';
import { SliderProgramaMensualComponent } from '../../components/edicion-programa-mensual-labores-componentes/slider-programa-mensual/slider-programa-mensual.component';
import { BotonesComponent } from '../../../../../../shared/components/botones/botones.component';
import { ModalListaAvanceComponent } from '../../components/edicion-programa-mensual-labores-componentes/modal-lista-avance/modal-lista-avance.component';
import { CopiarLaborResponse, ExportarProgramaMensual, InsertarCabDetalle, ResponseCabPrg, ResumenDetalle, ResumenProgramaRequest, ResumenProgramaResponse } from '../../interface/edicion-programa-mensual.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { ProgramaComponent } from '../../components/edicion-programa-mensual-labores-componentes/side-bar/tablas-programa-rendimiento/tablas-generales/programa/programa.component';
import { FormArray, FormGroup } from '@angular/forms';
import { Console, error } from 'console';

@Component({
    selector: 'app-edicion-programa-mensual-labores',
    imports: [TituloModuloComponent, FormularioProgramaMensualComponent,
        RouterOutlet,
        SliderProgramaMensualComponent,
        BotonesComponent,
        CommonModule],
    templateUrl: './edicion-programa-mensual-labores.component.html',
    styleUrls: ['./edicion-programa-mensual-labores.component.css']
})
export class EdicionProgramaMensualLaboresComponent implements OnInit, OnDestroy {

    //SERVICIO COMPARTIDO ACCION BOTONES
    botonAccionService = inject(BotonAccionService)
    // private listaMensualService = inject(ListaMensualService);
    botones = this.botonAccionService.botones;
    botoPresionado = signal<string>('');
    botoColor = signal<string>('');

    showModalLabores = signal<boolean>(false);

    arregloaDatos = signal<any[]>([]);

    formUtils = FormUtils

    private router = inject(Router);
    route = inject(ActivatedRoute)
    programaState = inject(EdicionProgrmaMensualService);

    codFase: string | null = null;

    //FORMULARIO PRG_PROG
    @ViewChild(FormularioProgramaMensualComponent)
    formCabProgam!: FormularioProgramaMensualComponent;

    @ViewChild(ProgramaComponent)
    formProgDetalle!: ProgramaComponent;
    ultimoNroProg = signal<string>('')

    ngOnDestroy(): void {
        // Limpiar datos persistidos y FormArray activo al salir de la pantalla
        this.programaState.limpiarTodosDatosFases();
        const formDetalle = this.botonAccionService.getFormulario();
        const labores = formDetalle?.get('labores') as FormArray | null;
        labores?.clear();
    }

    ngOnInit(): void {

        this.botonAccionService.resetBotones();

        this.route.paramMap.subscribe(params => {

            const nroProgParam = params.get('nro_prog');

            const data = {
                nro_prog: nroProgParam === 'nuevo' ? null : nroProgParam,
                cie_ano: params.get('cie_ano'),
                cie_per: params.get('cie_per'),
            };

            this.programaState.setPrograma(data);

            if (nroProgParam === 'nuevo') {
                this.botonAccionService.setBloqueos({ guardar: true, labores: true, cerrar: false });
            } else {
                this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });
            }

        });
    }

    onFaseClick(codigo: string): void {
        this.codFase = codigo;
        // console.log(    "Fase seleccionada en componente:", this.codFase);

        this.programaState.setPrograma({
            nro_prog: this.programaState.programa().nro_prog || null,
            cie_ano: this.programaState.programa().cie_ano,
            cie_per: this.programaState.programa().cie_per,
            // modo: 'nuevo'
        });
    }


    public crearNorProg(): void {

        this.programaState.crearNorProg().subscribe({
            next: (nro_prog: string) => {

                this.ultimoNroProg.set(nro_prog);

            },
            error: error => console.log(error)
        });
    }


    ///LOGICA PARA LOS BOTONES ///

    public onAccion(tipo: string) {
        switch (tipo) {
            case 'nuevo':
                this.onNuevo();
                break;

            case 'guardar':
                this.onGuardar();
                break;

            case 'eliminar':
                this.onEliminar();
                break;

            case 'copiar':
                this.onCopiarLabor();
                break;

            case 'resumen':
                this.onResumen();
                break;

            case 'importar':
                this.onImportar();
                break;

            case 'exportar':
                this.onExportar();
                break;

            case 'labores':
                this.onLabores();
                break;

            case 'cerrar':
                this.onCerrar();
                break;



            default:
                console.warn('Acción no reconocida:', tipo);
        }
    }


    public infoProgMensual(): void {
        const nroProg = this.programaState.programa().nro_prog;

        this.programaState.infoProgMensual(nroProg!).subscribe({
            next: (info: ProgramaMensualInformacion[]) => {

                if (!info.length) return;

                const prg_est = info[0].prg_est;

                if (prg_est === 'B') {
                    alert("La labor seleccionada es una labor programada y el programa se encuentra aprobado.")
                    return;
                }
                // this.abrirModal();

                // console.log("los datos obtenidos son", info);
            },
            error: error => console.log(error)
        });
    }

    private setBoton(accion: string, color: string) {
        this.botoPresionado.set(`Usted se encuentra en el modo ${accion}`);
        this.botoColor.set(color);
    }

    private onNuevo() {
        this.programaState.setModo('nuevo');
        this.setBoton('Nuevo', 'bg-[#047857]');
    }


    private onGuardar() {
        // 1. Configuración inicial de UI y Estado
        this.setBoton('Guardar', 'bg-[#033351]');
        // this.programaState.setModo('nuevo');

        // 2. Validar Cabecera
        if (this.formCabProgam.programaForm.invalid) {
            this.formCabProgam.programaForm.markAllAsTouched();
            this.formUtils.alertaNoPermitido('Datos de Cabecera', 'Por favor, complete los campos obligatorios de la cabecera.');
            return;
        }

        // 3. Validar Detalle (Formulario actual)
        const formDetalle = this.botonAccionService.getFormulario();
        if (!formDetalle) return;

        if (this.validarFilasIncompletas(formDetalle)) {
            this.formUtils.alertaNoPermitido('Filas Incompletas', 'Existen campos vacíos en la tabla de labores.');
            return;
        }

        // 4. Preparación de Datos
        const cab = this.formCabProgam.onSudmit();
        const faseActual = this.programaState.codFase() || '01';
        const dataActual = formDetalle.getRawValue();

        // Sincronizar fase actual en el estado antes de recolectar todo
        if (dataActual.labores?.length > 0) {
            this.programaState.guardarDatosFase(faseActual, dataActual.labores);
        }

        // 5. Procesamiento Global de Labores (Todas las fases)
        const todasLasLabores = this.procesarLaboresGlobales();

        if (todasLasLabores.length === 0) {
            this.formUtils.alertaNoPermitido('Sin Datos', 'No hay nuevas labores para guardar.');
            return;
        }

        // 6. Confirmación y Envío
        const envioData: InsertarCabDetalle = { cabecera: cab, detalle: todasLasLabores };

        this.confirmarYGuardar(envioData);
    }

    /**
     * Valida si el formulario actual tiene filas incompletas
     * y marca los controles como tocados para mostrar errores en UI.
     */

    // private validarFilasIncompletas(formDetalle: FormGroup): boolean {
    //     if (formDetalle.invalid) {
    //         formDetalle.markAllAsTouched();
    //         return true;
    //     }
    //     return false;
    // }

    private validarFilasIncompletas(formDetalle: FormGroup): boolean {

        const labores = formDetalle.get('labores') as FormArray;

        const indicesInvalidos = labores.controls
            .map((grupo, i) => {

                if (grupo.invalid) {

                    grupo.markAllAsTouched();

                    return i;
                }

                return -1;

            })
            .filter(i => i !== -1);

        const fase = this.programaState.codFase();

        if (fase) {

            this.programaState.guardarErroresFase(
                fase,
                indicesInvalidos
            );

        }

        return indicesInvalidos.length > 0;
    }



    /**
     * Recolecta y limpia las labores de todas las fases del State
     */
    private procesarLaboresGlobales(): any[] {
        const listaLimpia: any[] = [];

        this.programaState.obtenerTodasLasFases().forEach((laboresFase, codFase) => {
            laboresFase
                .filter((item: any) => item.isNew === true)
                .forEach((item: any) => {
                    listaLimpia.push({
                        ...item,
                        cod_fase: codFase,
                        prg_progra: 'N',
                        ind_taladro_largo: item.ind_taladro_largo ?? 'N',
                        ind_verificacion: item.ind_verificacion ? null : 'S',
                        cod_veta: this.limpiarCodigoVeta(item.cod_veta)
                    });
                });
        });
        return listaLimpia;
    }

    private limpiarCodigoVeta(veta: string): string {
        return veta?.includes(' - ') ? veta.split(' - ').pop()! : veta;
    }

    /**
     * Maneja la suscripción al servicio de guardado
     */
    private confirmarYGuardar(envioData: InsertarCabDetalle) {
        const mensajeConfirmacion = `<b>¿Desea agregar un programa nuevo?</b> <br>Los registros se almacenarán en la base de datos.`;

        this.formUtils.confirmarAnulacion('Ingresar Programa', mensajeConfirmacion, 'Si, Insertar Datos', 'No Insertar')
            .then(result => {
                if (!result.isConfirmed) return;

                this.programaState.insertarCabDeta(envioData).subscribe({
                    next: (info: ResponseCabPrg) => {
                        if (info.estado === 1) {
                            this.finalizarGuardado(info.mensaje);
                            this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });

                        }
                    },
                    error: err => console.error('Error al guardar programa:', err)
                });
            });
    }

    private finalizarGuardado(mensaje: string) {
        this.formUtils.alertaExitoAnulacion('Creación de Programa', mensaje);

        // 1. Cambiamos el modo a 'ver' (esto activará el opacity-50 y el bloqueo por señal)
        this.programaState.setModo('ver');
        this.setBoton('Ver', 'bg-[#475569]');

        // 2. Limpiamos los datos persistidos en memoria del State 
        // para obligar a que la siguiente consulta vaya a la Base de Datos
        this.programaState.limpiarTodosDatosFases();

        // 3. Disparamos la recarga. 
        // Al ejecutar edicionProgramaMensual(), se llenará el FormArray con isNew = false
        // y prg_progra vendrá con el valor real de la BD.
        this.programaState.triggerRecargar();

        this.crearNorProg();
        this.botonAccionService.setBloqueos({
            guardar: true, copiar: true, resumen: false,
            exportar: false, cerrar: false, labores: true
        });
    }
    private onEliminar() {
        this.setBoton('Eliminar', 'bg-[#9f1239]');
    }

    private onCopiarLabor() {

        this.setBoton('Copiar Labor', 'bg-[#5b21b6]');

        const data = this.botonAccionService.laborCopiada();

        this.botonAccionService.setBloqueos({ guardar: true, copiar: false, resumen: true, exportar: true, cerrar: false, labores: true });


        this.formUtils.confirmarAnulacion('Copiar Labores', `<b>¿Desea Copiar La labor?</b> <br>Se procedera almacenar en la BD.`,
            'Si, copiar datos', 'No Copiar')

            .then(result => {
                if (!result.isConfirmed) return;
                this.programaState.copiarLabor(data).subscribe({
                    next: (info: CopiarLaborResponse) => {
                        if (info.estado === 1) {
                            this.formUtils.alertaExitoAnulacion('Creacion de Programa Mensual', info.mensaje);

                            this.crearNorProg();
                            this.botonAccionService.laborCopiada.set({
                                // ...data,
                                cod_ala: ''
                            });
                            this.botonAccionService.setBloqueos({ guardar: true, copiar: true, resumen: false, exportar: false, cerrar: false, labores: true });
                            this.programaState.triggerRecargar();
                        }
                    },
                    error: error => console.log(error)
                });
            })
    }

    // imports necesarios


    // ── Botón ──
    private onResumen() {
        this.setBoton('Resumen', 'bg-[#92400e]');

        const cab = this.formCabProgam.onSudmit();
        const fase = this.programaState.codFase() || '01';

        const payload: ResumenProgramaRequest = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            nro_prog: cab.nro_prog,
            cod_fase: fase
        };

        this.programaState.getResumenPrograma(payload).subscribe({
            next: (res) => {
                this.abrirVentanaImpresion(res)
            },
            error: () => { }   // ya lo maneja el servicio
        });
    }

    // ── Ventana de impresión ──
    private abrirVentanaImpresion(data: ResumenProgramaResponse) {

        const cab = data.cabecera;
        const det = data.detalle;
        const fecha = new Date().toLocaleString('es-PE');

        const meses: Record<string, string> = {
            '01': 'ENERO', '02': 'FEBRERO', '03': 'MARZO',
            '04': 'ABRIL', '05': 'MAYO', '06': 'JUNIO',
            '07': 'JULIO', '08': 'AGOSTO', '09': 'SETIEMBRE',
            '10': 'OCTUBRE', '11': 'NOVIEMBRE', '12': 'DICIEMBRE'
        };

        const total = det.reduce((acc, d) => ({
            prg_avamts: acc.prg_avamts + (d.prg_avamts ?? 0),
            prg_ancmin: acc.prg_ancmin + (d.prg_ancmin ?? 0),
            prg_ancvet: acc.prg_ancvet + (d.prg_ancvet ?? 0),
            prg_ancdil: acc.prg_ancdil + (d.prg_ancdil ?? 0),
            prg_tmsmin: acc.prg_tmsmin + (d.prg_tmsmin ?? 0),
            prg_leyau: acc.prg_leyau + (d.prg_leyau ?? 0),
            prg_leyaudil: acc.prg_leyaudil + (d.prg_leyaudil ?? 0),
            prg_vptmin: acc.prg_vptmin + (d.prg_vptmin ?? 0),
            prg_vptdil: acc.prg_vptdil + (d.prg_vptdil ?? 0),
            dif_cutoff: acc.dif_cutoff + (d.dif_cutoff ?? 0),
            prg_homlab: acc.prg_homlab + (d.prg_homlab ?? 0),
            prg_tareas: acc.prg_tareas + (d.prg_tareas ?? 0),
            prg_nroper: acc.prg_nroper + (d.prg_nroper ?? 0),
        }), {
            prg_avamts: 0, prg_ancmin: 0, prg_ancvet: 0, prg_ancdil: 0,
            prg_tmsmin: 0, prg_leyau: 0, prg_leyaudil: 0, prg_vptmin: 0,
            prg_vptdil: 0, dif_cutoff: 0, prg_homlab: 0, prg_tareas: 0, prg_nroper: 0
        });

        // =====================================================
        // HELPERS
        // =====================================================
        const calcArea = (d: ResumenDetalle) =>
            (d.prg_vptmin ?? 0) >= (d.fac_vptmin ?? 0)
                ? (d.prg_loncor ?? 0) * (d.prg_altcor ?? 0)
                : 0;

        const calcRotas = (d: ResumenDetalle) =>
            (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;

        const esEco = (d: ResumenDetalle) =>
            (d.prg_vptmin ?? 0) >= (d.val_vpt ?? 0) ? 1 : 0;

        const esNoEco = (d: ResumenDetalle) =>
            (d.prg_vptmin ?? 0) >= (d.fac_vptmin ?? 0) &&
                (d.prg_vptmin ?? 0) < (d.val_vpt ?? 0) ? 1 : 0;

        const esEcoMin = (d: ResumenDetalle) =>
            (d.prg_vptdil ?? 0) >= (d.val_vpt ?? 0) ? 1 : 0;

        const esNoEcoMin = (d: ResumenDetalle) =>
            (d.prg_vptdil ?? 0) >= (d.fac_vptmin ?? 0) &&
                (d.prg_vptdil ?? 0) < (d.val_vpt ?? 0) ? 1 : 0;

        // =====================================================
        // TOTAL PRODUCCIÓN
        // =====================================================
        const totalPro = {
            count: det.filter(d => d.prg_progra === 'S').length,
            prg_avamts: det.reduce((a, d) => a + (d.prg_avamts ?? 0), 0),

            anchoMinado: (() => {
                const totalArea = det.reduce((a, d) => a + calcArea(d), 0);
                if (totalArea === 0) return 0;
                const suma = det.reduce((a, d) => {
                    const area = calcArea(d); const rotas = calcRotas(d);
                    return a + ((d.prg_ancvet ?? 0) + (d.prg_ancdil ?? 0)) * area * rotas;
                }, 0);
                return suma / totalArea;
            })(),

            prg_ancvet: (() => {
                const totalArea = det.reduce((a, d) => a + calcArea(d), 0);
                if (totalArea === 0) return 0;
                return det.reduce((a, d) => a + (d.prg_ancvet ?? 0) * calcArea(d) * calcRotas(d), 0) / totalArea;
            })(),

            prg_ancdil: (() => {
                const totalArea = det.reduce((a, d) => a + calcArea(d), 0);
                if (totalArea === 0) return 0;
                return det.reduce((a, d) => a + (d.prg_ancdil ?? 0) * calcArea(d) * calcRotas(d), 0) / totalArea;
            })(),

            prg_loncor: det.reduce((a, d) => a + (d.prg_loncor ?? 0) * calcRotas(d), 0),
            prg_altcor: (() => {
                const totalArea = det.reduce((a, d) => a + calcArea(d), 0);
                if (totalArea === 0) return 0;
                return det.reduce((a, d) => a + (d.prg_altcor ?? 0) * calcArea(d), 0) / totalArea;
            })(),
            prg_tmsrotvet: det.reduce((a, d) => a + (d.prg_tmsrotvet ?? 0) * calcRotas(d), 0),
            prg_tmsrotdil: det.reduce((a, d) => a + (d.prg_tmsrotdil ?? 0) * calcRotas(d), 0),
            prg_tmsextraid: det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0), 0),

            prg_leyau: (() => {
                const peso = det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0), 0);
                return peso > 0 ? det.reduce((a, d) => a + (d.prg_leyau ?? 0) * (d.prg_tmsextraid ?? 0), 0) / peso : 0;
            })(),
            prg_leycu: (() => {
                const peso = det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0), 0);
                return peso > 0 ? det.reduce((a, d) => a + (d.prg_leycu ?? 0) * (d.prg_tmsextraid ?? 0), 0) / peso : 0;
            })(),
            prg_leypb: (() => {
                const peso = det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0), 0);
                return peso > 0 ? det.reduce((a, d) => a + (d.prg_leypb ?? 0) * (d.prg_tmsextraid ?? 0), 0) / peso : 0;
            })(),
            prg_leyzn: (() => {
                const peso = det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0), 0);
                return peso > 0 ? det.reduce((a, d) => a + (d.prg_leyzn ?? 0) * (d.prg_tmsextraid ?? 0), 0) / peso : 0;
            })(),
            prg_vptmin: (() => {
                const peso = det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0), 0);
                const area = det.reduce((a, d) => a + calcArea(d), 0);
                return area > 0 && peso > 0 ? det.reduce((a, d) => a + (d.prg_vptmin ?? 0) * (d.prg_tmsextraid ?? 0), 0) / peso : 0;
            })(),
            dif_cutoff: det.reduce((a, d) => a + (d.dif_cutoff ?? 0), 0),
            prg_homlab: det.reduce((a, d) => a + (d.prg_homlab ?? 0), 0),
        };

        // =====================================================
        // BLOCKS ECONÓMICOS
        // =====================================================
        const totalEco = {
            count: det.filter(d => esEco(d) > 0).length,
            prg_avamts: det.reduce((a, d) => a + (d.prg_avamts ?? 0) * esEco(d), 0),
            prg_loncor: det.reduce((a, d) => a + (d.prg_loncor ?? 0) * calcRotas(d) * esEco(d), 0),
            prg_altcor: (() => {
                const totalArea = det.reduce((a, d) => a + calcArea(d), 0);
                if (totalArea === 0) return 0;
                return det.reduce((a, d) => a + (d.prg_altcor ?? 0) * calcArea(d) * esEco(d), 0) / totalArea;
            })(),
            prg_tmsrotvet: det.reduce((a, d) => a + (d.prg_tmsrotvet ?? 0) * calcRotas(d) * esEco(d), 0),
            prg_tmsrotdil: det.reduce((a, d) => a + (d.prg_tmsrotdil ?? 0) * calcRotas(d) * esEco(d), 0),
            prg_tmsextraid: det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0) * esEco(d), 0),

            anchoMinado: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const peso = calcArea(d) * calcRotas(d) * esEco(d);
                    totalPeso += peso;
                    suma += ((d.prg_ancvet ?? 0) + (d.prg_ancdil ?? 0)) * peso;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),

            prg_leyau: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esEco(d) * extraido;
                    totalPeso += factor;
                    suma += (d.prg_leyau ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_leycu: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_leycu ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_leypb: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_leypb ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_leyzn: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_leyzn ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_vptmin: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_vptmin ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            dif_cutoff: det.reduce((a, d) => a + (d.dif_cutoff ?? 0) * esEco(d), 0),
            prg_homlab: det.reduce((a, d) => a + (d.prg_homlab ?? 0) * esEco(d), 0),
        };

        // =====================================================
        // BLOCKS NO ECONÓMICOS
        // =====================================================
        const totalNoEco = {
            count: det.filter(d => esNoEco(d) > 0).length,
            prg_avamts: det.reduce((a, d) => a + (d.prg_avamts ?? 0) * esNoEco(d), 0),
            prg_loncor: det.reduce((a, d) => a + (d.prg_loncor ?? 0) * calcRotas(d) * esNoEco(d), 0),
            prg_altcor: (() => {
                const totalArea = det.reduce((a, d) => a + calcArea(d), 0);
                if (totalArea === 0) return 0;
                return det.reduce((a, d) => a + (d.prg_altcor ?? 0) * calcArea(d) * esNoEco(d), 0) / totalArea;
            })(),
            prg_tmsrotvet: det.reduce((a, d) => a + (d.prg_tmsrotvet ?? 0) * calcRotas(d) * esNoEco(d), 0),
            prg_tmsrotdil: det.reduce((a, d) => a + (d.prg_tmsrotdil ?? 0) * calcRotas(d) * esNoEco(d), 0),
            prg_tmsextraid: det.reduce((a, d) => a + (d.prg_tmsextraid ?? 0) * esNoEco(d), 0),

            anchoMinado: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const peso = calcArea(d) * calcRotas(d) * esNoEco(d);
                    totalPeso += peso;
                    suma += ((d.prg_ancvet ?? 0) + (d.prg_ancdil ?? 0)) * peso;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),

            prg_leyau: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esNoEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_leyau ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_leycu: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esNoEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_leycu ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_leypb: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esNoEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_leypb ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_leyzn: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esNoEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_leyzn ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            prg_vptmin: (() => {
                let suma = 0, totalPeso = 0;
                for (const d of det) {
                    const extraido = (d.prg_tmsextraid ?? 0) > 0 ? 1 : 0;
                    const factor = (d.prg_tmsextraid ?? 0) * esNoEco(d) * extraido;
                    totalPeso += factor; suma += (d.prg_vptmin ?? 0) * factor;
                }
                return totalPeso > 0 ? suma / totalPeso : 0;
            })(),
            dif_cutoff: det.reduce((a, d) => a + (d.dif_cutoff ?? 0) * esNoEco(d), 0),
            prg_homlab: det.reduce((a, d) => a + (d.prg_homlab ?? 0) * esNoEco(d), 0),
        };

        const periodo = `${meses[cab.cie_per] ?? cab.cie_per} ${cab.cie_ano}`;

        const n = (v: any, dec = 2) => {
            const num = parseFloat(v);
            return !isNaN(num) ? num.toFixed(dec) : '-';
        };

        const nt = (v: number) => v != null ? v.toLocaleString('es-PE') : '-';



        const filas = det.map(d => {
            const esRojo = (d.prg_progra ?? '').trim().toUpperCase() === 'N';

            const clases = esRojo ? 'text-red-500' : '';

            return `
                <tr class="${clases}">
                    <td>${d.cod_veta ?? ''}</td>
                    <td>${d.cod_nivel ?? ''}</td>
                    <td>${d.cod_tipo_labor ?? ''}</td>

                    <td>${d.cod_labor ?? ''}</td>
                    <td>${d.cod_ala ?? ''}</td>
                    <td>${d.cod_cto ?? ''}</td>
                    <td>${d.prg_blocks ?? ''}</td>

                    <td class="num">${d.ind_tip_roca_piso ?? ''}</td>
                    <td class="num">${n(d.ind_tip_roca)}</td>
                    <td class="num">${n(d.ind_tip_roca_techo)}</td>
                    <td class="num">${n(d.prg_avamts)}</td>

                    <td class="num">${n(d.prg_secancho)}</td>

                    <td class="num">${n(d.prg_tmsdes)}</td>
                    <td class="num">${n(d.prg_tmsmin)}</td>
                    <td class="num">${n(d.prg_tmsmin)}</td>
                    <td class="num">${n(d.prg_ancvet)}</td>
                    <td class="num">${nt(d.prg_ancdil)}</td>
                    <td class="num">${n(d.prg_tramin)}</td>
                    <td class="num">${n(d.prg_num_tramin)}</td>
                    <td class="num">${n(d.prg_loncor)}</td>
                    <td class="num">${n(d.prg_altcor)}</td>
                    <td class="num">${n(d.prg_tmsrotvet)}</td>
                    <td class="num">${nt(d.prg_tmsrotdil)}</td>
                    <td class="num">${d.prg_fecmuestreo ?? ''}</td>
                    <td class="num">${nt(d.prg_leyag)}</td>
                    <td class="num">${nt(d.prg_leycu)}</td>
                    <td class="num">${nt(d.prg_leypb)}</td>
                    <td class="num">${nt(d.prg_leyzn)}</td>
                    <td class="num">${nt(d.prg_vptmin)}</td>
                    <td class="num">${nt(d.dif_cutoff)}</td>
                    <td class="num">${d.metexp_cod ?? ''}</td>
                    <td class="num">${nt(d.prg_homlab)}</td>
                    <td class="num">${d.des_proyecto ?? ''}</td>
                    <td class="num">${d.nom_proyecto ?? ''}</td>
                </tr>
            `;
        }).join('');

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Resumen del Programa</title>
            <style>
                * { margin:0; padding:0; box-sizing:border-box; }
                body { font-family:Arial,sans-serif; font-size:11px; color:#000; background:#888; }


                .tabla-wrapper {
                    width: 100%;
                    overflow: visible;
                }
                .tabla-wrapper table {
                    transform-origin: top left;
                    transform: scale(0.75);   /* ajusta este valor */
                    width: 133%;              /* compensa el scale: 100/0.75 */
                }
                .acciones {
                    display:flex; justify-content:center;
                    gap:12px; padding:14px 0;
                }
                .acciones button {
                    padding:5px 28px; border:1px solid #aaa;
                    border-radius:3px; cursor:pointer;
                    font-size:13px; background:#f0f0f0;
                }
                .acciones button:hover { background:#ddd; }

                .page {
                    background:white; width:297mm;
                    min-height:210mm; margin:0 auto;
                    padding:12mm 10mm; border:1px solid #ccc;
                }

                /* cabecera */
                .rep-cab {
                    display:flex; justify-content:space-between;
                    font-size:10px; padding-bottom:6px;
                    border-bottom:1px solid #000; margin-bottom:6px;
                }
                .rep-cab-right { text-align:right; }

                /* info empresa */
                .rep-info {
                    display:grid; grid-template-columns:repeat(3,1fr);
                    gap:3px 12px; font-size:9px;
                    border-bottom:1px solid #ccc;
                    padding:5px 0; margin-bottom:8px;
                }
                .rep-info span  { color:#555; }
                .rep-info strong{ color:#000; }

                /* título */
                .titulo { text-align:center; margin:8px 0 10px; }
                .titulo h1 { font-size:13px; font-weight:bold; }
                .titulo h2 { font-size:11px; font-weight:normal; margin-top:4px; }

                /* tabla */
                table { width:100%; border-collapse:collapse; font-size:8.5px; }
                thead tr { background:#c0c0c0; }
                th {
                    border:1px solid #666; padding:3px 4px;
                    text-align:center; font-weight:bold;
                }
                td  { border:1px solid #bbb; padding:2px 4px; white-space:nowrap; }
                td.num { text-align:right; }
                tr:nth-child(even) td { background:#f5f5f5; }

                /* footer */
                .rep-footer {
                    margin-top:10px; font-size:9px; color:#555;
                    border-top:1px solid #ccc; padding-top:5px;
                    display:flex; justify-content:space-between;
                }

                @media print {
                    body  { background:white; }
                    .page { margin:0; border:none; width:100%; }
                    .acciones { display:none; }
                    @page { size:A4 landscape; margin:8mm; }
                }
            </style>
        </head>
        <body>

            <div class="acciones">
                <button onclick="window.print()">Print</button>
                <button onclick="window.close()">Cancelar</button>
            </div>

            <div class="page">

                <div class="rep-cab">
                    <div>
                        <div>Sistema Integrado de Operaciones Minero Metalúrgicas (SIOMM)</div>
                        <div>${cab.nom_empresa}</div>
                        <div>${cab.nom_empresa_unidad}</div>
                    </div>
                    <div class="rep-cab-right">
                        <div>${fecha}</div>
                        <div>Página 1 de 1</div>
                        <div>d_sq_co_rept_programa_resumen</div>
                    </div>
                </div>

                <div class="rep-info">
                    <div><span>Unidad Económica: </span><strong>${cab.des_und_econom}</strong></div>
                    <div><span>Zona: </span><strong>${cab.des_zona}</strong></div>
                    <div><span>Contrata: </span><strong>${cab.des_contrata}</strong></div>
                    <div><span>Nro. Programa: </span><strong>${cab.nro_prog}</strong></div>
                    <div><span>Cutoff: </span><strong>${cab.prg_cutoff}</strong></div>
                    <div><span>Estado: </span><strong>${cab.prg_est}</strong></div>
                </div>

                <div class="titulo">
                    <h1>RESUMEN GENERAL : PROGRAMA GENERAL DE MINA</h1>
                    <h2>${periodo}</h2>
                </div>

                <div class="tabla-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Veta</th>
                                <th>Nivel</th>
                                <th>Tipo Labor</th>
                                <th>Labor</th>
                                <th>Ala</th>
                                <th>Cod.Cto</th>
                                <th>Blocks</th>
                                <th>RMR Piso</th>
                                <th>RMR Veta</th>
                                <th>RMR Techo</th>
                                <th>Avance MTS</th>
                                <th>Sección Altura</th>
                                <th>TMS Desmonte</th>
                                <th>TMS Total</th>
                                <th>Ancho Veta</th>
                                <th>Ancho Dilución</th>
                                <th>Tramo Minable <br> (Ej. 00@10;20@30..)</th>
                                <th>Nro. Tram Min</th>
                                <th>Longitud <br> de Corte</th>
                                <th>Altura de Corte</th>
                                <th>TMS <BR> Rotas <br> Veta</th>
                                <th>TMS Rotas Dilución</th>
                                <th>TMS Extraido</th>
                                <th>Fecha <br> Muestreo</th>
                                <th>Ag (gr)</th>
                                <th>Cu (%)</th>
                                <th>Pb (%)</th>
                                <th>Zn (%)</th>
                                <th>VTP U$$</th>
                                <th>Rentabilidad</th>
                                <th>Método <br> Minado</th>
                                <th>Hombres <br> Labor</th>
                                <th>Descripción del Proyecto</th>
                                <th>Nombre del Proyecto</th>

                            </tr>
                        </thead>
                        <tbody>
                            ${det.length
                ? filas
                : '<tr><td colspan="18" style="text-align:center;padding:10px">Sin datos</td></tr>'}
                        </tbody>

                        <tfoot>
                            <tr style="background:#d0d0d0; font-weight:bold;">
                                <td colspan="7">TOTALES</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(total.prg_avamts)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(total.prg_tmsmin)}</td>
                                <td class="num">${n(total.prg_ancvet)}</td>
                                <td class="num">${nt(total.prg_ancdil)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${nt(total.prg_leyau)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${nt(total.prg_vptmin)}</td>
                                <td class="num">${nt(total.dif_cutoff)}</td>
                                <td class="num">—</td>
                                <td class="num">${nt(total.prg_homlab)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                            </tr>

                                                        <!-- TOTAL PRODUCCIÓN -->
                            <tr style="background:#c8dae8; font-weight:bold;">
                                <td colspan="7">Total Producción (${totalPro.count})</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalPro.prg_avamts)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalPro.prg_tmsextraid)}</td>
                                <td class="num">${n(totalPro.prg_ancvet)}</td>
                                <td class="num">${nt(totalPro.prg_ancdil)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${nt(totalPro.prg_leyau)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${nt(totalPro.prg_vptmin)}</td>
                                <td class="num">${nt(totalPro.dif_cutoff)}</td>
                                <td class="num">—</td>
                                <td class="num">${nt(totalPro.prg_homlab)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                            </tr>

                            <!-- BLOCKS ECONÓMICOS -->
                            <tr style="background:#d4edda; font-weight:bold;">
                                <td colspan="7">Blocks Económicos (${totalEco.count})</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalEco.prg_avamts)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalEco.prg_tmsextraid)}</td>
                                <td class="num">${n(totalEco.anchoMinado)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalEco.prg_loncor)}</td>
                                <td class="num">${n(totalEco.prg_altcor)}</td>
                                <td class="num">${n(totalEco.prg_tmsrotvet)}</td>
                                <td class="num">${n(totalEco.prg_tmsrotdil)}</td>
                                <td class="num">${nt(totalEco.prg_leyau)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${nt(totalEco.prg_vptmin)}</td>
                                <td class="num">${nt(totalEco.dif_cutoff)}</td>
                                <td class="num">—</td>
                                <td class="num">${nt(totalEco.prg_homlab)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                            </tr>

                            <!-- BLOCKS NO ECONÓMICOS -->
                            <tr style="background:#f8d7da; font-weight:bold;">
                                <td colspan="7">Blocks No Económicos (${totalNoEco.count})</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalNoEco.prg_avamts)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalNoEco.prg_tmsextraid)}</td>
                                <td class="num">${n(totalNoEco.anchoMinado)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${n(totalNoEco.prg_loncor)}</td>
                                <td class="num">${n(totalNoEco.prg_altcor)}</td>
                                <td class="num">${n(totalNoEco.prg_tmsrotvet)}</td>
                                <td class="num">${n(totalNoEco.prg_tmsrotdil)}</td>
                                <td class="num">${nt(totalNoEco.prg_leyau)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                                <td class="num">${nt(totalNoEco.prg_vptmin)}</td>
                                <td class="num">${nt(totalNoEco.dif_cutoff)}</td>
                                <td class="num">—</td>
                                <td class="num">${nt(totalNoEco.prg_homlab)}</td>
                                <td class="num">—</td>
                                <td class="num">—</td>
                            </tr>
                        </tfoot>

                        

                    </table>
                
                </div>

                <div class="rep-footer">
                    <span>Nro.Prog: ${cab.nro_prog} | Fase: ${det[0]?.nom_fase ?? ''}</span>
                    <span>Cutoff: ${cab.prg_cutoff} | Cálc.Dil: ${cab.ind_calc_dil}</span>
                </div>

            </div>
        </body>
        </html>
    `;

        const ventana = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
        if (!ventana) {
            this.formUtils.mensajeError('El navegador bloqueó la ventana emergente. Permite popups para este sitio.');
            return;
        }
        ventana.document.write(html);
        ventana.document.close();
    }


    private onImportar() {
        this.setBoton('Importar', 'bg-[#155e75]');
    }

    private onExportar() {

        this.setBoton('Exportar', 'bg-[#3730a3]');

        const cab = this.formCabProgam.onSudmit();
        const fase = this.programaState.codFase() || '01';

        const payload: ExportarProgramaMensual = {
            cod_empresa: '03',
            cod_empresa_unidad: '01',
            nro_prog: cab.nro_prog,
            cod_fase: fase
        };

        this.formUtils.confirmarAnulacion('Exportar Datos', `<b>¿Desea exportar el Nro. Programa ${cab.nro_prog} con fase ${fase}?</b> <br>Se guardara la información en un archivo excel.`,
            'Si, exportar datos', 'No exportar')
            .then(result => {
                if (!result.isConfirmed) return;
                this.programaState.exportarProgramaMensual(payload)
                    .subscribe({
                        next: (response: any) => {

                            // 👇 Detectar si es Blob o error JSON
                            if (response instanceof Blob) {

                                const file = new Blob([response], {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                });

                                const url = window.URL.createObjectURL(file);

                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'ReporteProgramaMensual.xlsx';
                                a.click();

                                window.URL.revokeObjectURL(url);
                                // this.formUtils.alertaExitoAnulacion('Exportar Datos', `<b>Los datos del Nro.prog ${cab.nro_prog} con fase ${fase} se exportaron correctamente</b>`);

                            } else {
                                // 👇 caso cuando backend devuelve JSON dentro de "next"
                                this.formUtils.mensajeError(response?.mensaje || 'Error al exportar');
                            }

                        },
                        error: (error) => {

                            const reader = new FileReader();

                            reader.onload = () => {
                                try {
                                    const err = JSON.parse(reader.result as string);

                                    const msg = err?.mensaje || 'Error inesperado al exportar';

                                    // this.formUtils.mensajeError(msg);
                                    this.formUtils.mensajeEliminarLabor('Datos Vacios', msg);


                                } catch {
                                    this.formUtils.mensajeError('Error inesperado al exportar');
                                }
                            };

                            if (error.error instanceof Blob) {
                                reader.readAsText(error.error);
                            } else {
                                this.formUtils.mensajeError(error?.error?.mensaje || 'Error inesperado al exportar');
                            }
                        }
                    });
            })
    }


    private onLabores() {
        this.setBoton('Labores', 'bg-[#115e59]');
        // this.infoProgMensual();
        this.abrirModal();

        // if( this.arregloaDatos().length){
        // this.abrirModal();
        // }
    }

    private onCerrar() {
        this.setBoton('Cerrar', 'bg-[#475569]');
        this.router.navigate(['/menu-principal/planeamiento/programa_mensual_de_labores/lista-detalle']);
    }

    abrirModal() {
        this.botonAccionService.abrir();
    }

}
