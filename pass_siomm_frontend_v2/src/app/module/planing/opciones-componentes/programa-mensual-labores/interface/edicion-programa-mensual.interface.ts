import { ExportarProgramacion } from "./programa-mensual.interface";

export interface menuItem {
    title: string;
    path: string;
    icono: 'exploracion' | 'desarrollo' | 'preparacion' | 'explotacion';
    cod_fase?: string;
}


export const ICONOS: Record<string, string> = {
    exploracion:
        'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',

    desarrollo:
        'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',

    preparacion:
        'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',

    explotacion:
        'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
};


export interface ProgramaExplotacion {

    // ===== det_prg (NOT NULL)
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    des_labor: string;
    cod_ala: string;
    cod_fase: string;
    cod_empresa: string;
    cod_veta_dos: string;
    cod_nom_veta: string;
    nom_veta: string;
    cod_metexp: string
    // ===== VARCHAR NULL
    cod_cto: string | null;
    cod_cta: string | null;
    ind_tip_roca: string | null;
    prg_tipace: string | null;
    metexp_cod: string | null;
    prg_blocks: string | null;
    prg_progra: string | null;
    cod_tipo_labor_ant: string | null;
    cod_labor_ant: string | null;
    cod_ala_ant: string | null;
    ind_tip_roca_piso: string | null;
    ind_tip_roca_techo: string | null;
    prg_tramin: string | null;
    des_proyecto: string | null;
    nom_proyecto: string | null;
    ind_clasificacion_sos: string | null;
    prg_tramin_prog: string | null;
    ind_taladro_largo: string | null;
    ind_verificacion: string | null;
    val_tipo_fac: string | null;

    // ===== NUMERIC / DECIMAL (NULLABLE)
    prg_avamts: number | null;
    prg_secancho: number | null;
    prg_secaltu: number | null;
    prg_tmsdes: number | null;
    prg_tmsmin: number | null;
    prg_ancmin: number | null;
    prg_ancvet: number | null;
    prg_loncor: number | null;
    prg_altcor: number | null;
    prg_tmsrotvet: number | null;
    prg_tmsrotdil: number | null;
    prg_tmsextraid: number | null;
    prg_leyag: number | null;
    prg_leycu: number | null;
    prg_leypb: number | null;
    prg_leyzn: number | null;
    prg_leyagdil: number | null;
    prg_leycudil: number | null;
    prg_leypbdil: number | null;
    prg_leyzndil: number | null;
    prg_vptdil: number | null;
    prg_homlab: number | null;
    prg_tareas: number | null;
    prg_nroper: number | null;
    prg_nrowinche: number | null;
    prg_nropala: number | null;
    prg_pieper: number | null;
    prg_brocas: number | null;
    prg_barcon: number | null;
    prg_barren: number | null;
    prg_dinami: number | null;
    prg_fulmin: number | null;
    prg_conect: number | null;
    prg_punmar: number | null;
    prg_tablas: number | null;
    prg_pernos: number | null;
    prg_mallas: number | null;
    prg_cimbras: number | null;
    prg_vptmin: number | null;
    dist_desde: number | null;
    dist_hasta: number | null;
    num_buzamiento: number | null;
    por_dilucion: number | null;
    prg_leyau: number | null;
    prg_leyaudil: number | null;
    prg_num_tramin_prog: number | null;
    prg_ancmin_leyes: number | null;
    num_factor_x: number | null;
    num_corte: number | null;
    num_dis_limpieza: number | null;

    prg_num_tramin: number | null;

    // ===== DATETIME
    prg_fecmuestreo: string | null;

    // ===== cab_prg
    prg_est: string | null;
    prg_cutoff: number | null;
    ind_calc_dil: string | null;

    // ===== mae_factor
    fac_vptmin: number | null;

    // ===== mae_zona
    val_vpt: number | null;

    // ===== CAMPOS FIJOS
    ind_calc_tipo_dil: string;
    ind_tipo_ley: string;
    p_block: string;
    as_add: string;
    p_bloques: string;
    // prg_progra: string;
    isNew: boolean;
}

export interface IndiceRendimiento {

    // ================= STRING =================
    cod_empresa: string;
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    cod_ala: string;
    cod_fase: string;
    cod_cto: string | null;
    cod_cta: string | null;
    ind_tip_roca: string | null;
    prg_tipace: string | null;
    prg_blocks: string | null;
    prg_progra: string | null;
    cod_tipo_labor_ant: string | null;
    cod_labor_ant: string | null;
    cod_ala_ant: string | null;
    ind_tip_roca_piso: string | null;
    ind_tip_roca_techo: string | null;
    prg_tramin: string | null;
    prg_tramin_prog: string | null;
    val_tipo_fac: string | null;
    ind_calc_dil: string | null;
    ind_clasificacion_sos: string | null;
    ind_taladro_largo: string | null;
    ind_verificacion: string | null;
    prg_est: string | null;
    des_proyecto: string | null;
    nom_proyecto: string | null;

    // ================= NUMERIC =================
    prg_avamts: number | null;
    prg_secancho: number | null;
    prg_secaltu: number | null;
    prg_tmsdes: number | null;
    prg_tmsmin: number | null;
    prg_ancmin: number | null;
    prg_ancvet: number | null;
    prg_num_tramin: number | null;
    prg_loncor: number | null;
    prg_altcor: number | null;
    prg_tmsrotvet: number | null;
    prg_tmsrotdil: number | null;
    prg_tmsextraid: number | null;
    prg_leyag: number | null;
    prg_leycu: number | null;
    prg_leypb: number | null;
    prg_leyzn: number | null;
    prg_leyagdil: number | null;
    prg_leycudil: number | null;
    prg_leypbdil: number | null;
    prg_leyzndil: number | null;
    prg_vptdil: number | null;
    prg_homlab: number | null;
    prg_tareas: number | null;
    prg_nroper: number | null;
    prg_nrowinche: number | null;
    prg_nropala: number | null;
    prg_pieper: number | null;
    prg_brocas: number | null;
    prg_barcon: number | null;
    prg_barren: number | null;
    prg_dinami: number | null;
    prg_fulmin: number | null;
    prg_conect: number | null;
    prg_punmar: number | null;
    prg_tablas: number | null;
    prg_pernos: number | null;
    prg_mallas: number | null;
    prg_cimbras: number | null;
    prg_vptmin: number | null;
    dist_desde: number | null;
    dist_hasta: number | null;
    num_buzamiento: number | null;
    por_dilucion: number | null;
    prg_leyau: number | null;
    prg_leyaudil: number | null;
    prg_num_tramin_prog: number | null;
    prg_ancmin_leyes: number | null;
    num_factor_x: number | null;
    num_corte: number | null;
    num_dis_limpieza: number | null;
    val_vpt: number | null;
    fac_vptmin: number | null;

    // ================= DATETIME =================
    prg_fecmuestreo: string | null;
}

export interface BlockReserva {
    cod_empresa: string
    cod_empresa_unidad: string
    nro_prog: string
    cod_und_econom: string
    cod_zona: string
    cod_veta: string
    cod_nivel: string
    cod_tipo_labor: string
    cod_labor: string
    cod_ala: string
    cod_fase: string
    prg_blocks: string

    num_tms?: number
    num_ag_veta?: number
    num_au_veta?: number
    num_cu_veta?: number
    num_pb_veta?: number
    num_zn_veta?: number
    num_anc_veta?: number
    num_anc_min?: number
}

export interface EvaluacionBloques {
    des_labor: string;
    cod_seccion: string;
    cod_eje: string;

    prg_tmsextraid?: number;
    prg_leycu?: number;
    prg_leyau?: number;
    prg_leyag?: number;
    prg_leycueq?: number;
    prg_leynsr?: number;

    prg_perf?: number;

    ind_version: string;

    cie_per: string;
    cie_ano: string;

    nro_prog: string;
    cod_empresa: string;
    cod_empresa_unidad: string;
}

export interface ProgramacionPlan {
    des_labor: string;
    cod_seccion: string;
    cod_eje: string;
    prg_tmsextraid: number;
    prg_leycu: number;
    prg_leyau: number;
    prg_leyag: number;
    prg_leycueq: number;
    prg_leynsr: number;
    prg_perf: number;
    ind_version: number;
}

export interface CodCto {
    cod_centro_costo: string;
    des_centro_costo: string;
}

export interface CodCta {
    cod_cuenta_contable: string;
    des_cuenta_contable: string;
}

export interface Ala {
    cod_ala: string;
    nom_ala: string;
}

export interface Sostenimiento {
    cod_sos: string;
    tipo_sosten: string;
}

export interface TaladrosLargos {
    cod_taladroLargo: string;
    des_taladroLargo: string;
}

export interface valOperativo {
    val_tipo_fac: string;
    val_des_tipo_fac: string;
}

export interface DatosEntradaPrograma {
    nro_prog?: string | null;
    cie_ano: string | null;
    cie_per: string | null;
    // modo: string | null
    // cod: string | null;
}


export interface UndEconomDto {
    cod_und_econom: string;
    nom_und_econom: string;
}

export interface ZonaDto {
    cod_zona: string;
    des_zona: string;
}

export interface MaestrosProgMensual {
    listaUndEcon: UndEconomDto[];
    listaZona: ZonaDto[];
    listContrata: ContrataDto[]
}

export interface ContrataDto {
    cod_contrata: string;
    des_contrata: string;
}

export interface MostrarMaeFase {
    cod_fase: string;
    nom_fase: string;
}

//INTERFACES MODALS TABLAS
export interface PlanoMetadata {
    file: File;
    titulo: string | null;
    nro_prog: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    // cod_ala: string | null;
    cod_fase: string;
}

export interface ResultadoPlano {
    resultado: number;
    mensaje: string;
}


export interface ReservasGeologicas {
    num_block: string;
    num_tms_total: number | null;
    num_potencia: number | null;
    num_potencia_diluida: number | null;
    num_ag_diluida: number | null;
    num_au_diluida: number | null;
    num_cu_diluida: number | null;
    num_pb_diluida: number | null;
    num_zn_diluida: number | null;
    num_vpt_diluida: number | null;
}

export interface ReservaGeologicaFiltro {
    cie_ano: string | null;
    cod_uni_econom: string;
    cod_zona: string;
    cod_veta: string;
    cod_nivel: string;
}

export interface MostrarPlanos {
    cod_empresa: string;
    cod_empresa_unidad: string;

    nro_prog: string;

    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;
    cod_nivel: string;

    cod_tipo_labor: string;
    cod_labor: string;

    cod_ala: string;

    cod_fase: string;

    tipo_archivo: string;

    secuencia: number;

    ruta_archivo?: string;

    nombre_archivo?: string;

    descripcion?: string;
}



export interface EliminarPlano {

    nro_prog: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    cod_ala?: string;
    cod_fase: string;
    secuencia: number;
}

export interface ProgramaResponse {
    blocks: BlockReserva[];
    archivos: MostrarPlanos[];
}

export interface LaborAvance {
    cod_empresa: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;
    // cod_nom_veta: string; // alias del SELECT
    nom_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    nom_labor: string;
    des_labor: string;
    cod_nom_veta: string;
    est_labor: string;

    cod_usuario_creo: string;
    fec_usuario_creo: Date | null;

    cod_usuario_modi: string;
    fec_usuario_modi: Date | null;

    cod_empresa_unidad: string;

    cod_tipo_labor_ant: string;
    cod_labor_ant: string;
}

export interface LaboresAvanceLimit {
    total: number,
    page: number,
    pageSize: number,
    data: LaborAvance[]
}


export interface DetPrg {
    codEmpresa: string;
    codEmpresaUnidad: string;
    codFase: string;
    codLabor: string;
    codNivel: string;
    codTipoLabor: string;
    codVeta: string;
    nroProg: string;
}

export interface ResponsDetprg {

    estado: number;
    mensaje: string;
}

export interface ResponseCabPrg {

    estado: number;
    mensaje: string;
}

export interface CopiarLaborResponse {

    estado: number;
    mensaje: string;
}

export interface CopiarLabor {
    nro_prog: string;
    cod_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    cod_fase: string;

}

export interface InsertarProgramacionDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_contrata: string;
    cie_ano: string;
    cie_per: string;
    fec_emi: string; // 👈 importante
    cod_usuario_creo: string;
    prg_cutoff: string;
    prg_pre_apr: string;
    ind_calc_dil: string;
}

export interface InsertarCabDetalle {

    cabecera: InsertarProgramacionDto;
    detalle: ExportarProgramacion[];
}

export interface ExportarProgramaMensual {

    cod_empresa: string;
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_fase: string;
}

export interface RespuestaBase {
  estado: number;
  mensaje: string;
}




// edicion-programa-mensual.interface.ts

export interface ResumenProgramaRequest {
    cod_empresa: string;
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_fase: string;
}

export interface ResumenCabecera {
    cod_empresa: string;
    nom_empresa: string;
    cod_empresa_unidad: string;
    nom_empresa_unidad: string;
    cod_und_econom: string;
    des_und_econom: string;
    cod_zona: string;
    des_zona: string;
    cod_contrata: string;
    des_contrata: string;
    prg_cutoff: number;
    cie_ano: string;
    cie_per: string;
    nro_prog: string;
    prg_est: string;
    ind_calc_dil: string;
}

export interface ResumenDetalle {
    cod_empresa: string;
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    cod_ala: string;
    cod_fase: string;
    nom_fase: string;
    cod_cto: string;
    cod_cta: string;
    ind_tip_roca: number;
    ind_tip_roca_piso: number;
    ind_tip_roca_techo: number;
    prg_tipace: string;
    prg_avamts: number;
    metexp_cod: string;
    prg_secancho: number;
    prg_secaltu: number;
    prg_tmsdes: number;
    prg_tmsmin: number;
    prg_ancdil: number;
    dif_cutoff: number;
    prg_blocks: number;
    prg_ancmin: number;
    prg_ancvet: number;
    prg_ancmin_leyes: number;
    prg_loncor: number;
    prg_altcor: number;
    prg_tmsrotvet: number;
    prg_tmsrotdil: number;
    prg_tmsextraid: number;
    prg_fecmuestreo: string | null;
    prg_leyag: number;
    prg_leycu: number;
    prg_leypb: number;
    prg_leyzn: number;
    prg_leyagdil: number;
    prg_leycudil: number;
    prg_leypbdil: number;
    prg_leyzndil: number;
    prg_leyau: number;
    prg_leyaudil: number;
    prg_vptdil: number;
    prg_vptmin: number;
    prg_homlab: number;
    prg_tareas: number;
    prg_nroper: number;
    prg_nrowinche: number;
    prg_nropala: number;
    prg_pieper: number;
    prg_brocas: number;
    prg_barcon: number;
    prg_barren: number;
    prg_dinami: number;
    prg_fulmin: number;
    prg_conect: number;
    prg_punmar: number;
    prg_tablas: number;
    prg_pernos: number;
    prg_mallas: number;
    prg_cimbras: number;
    prg_progra: string;
    cod_tipo_labor_ant: string;
    cod_labor_ant: string;
    cod_ala_ant: string;
    prg_tramin: number;
    prg_num_tramin: number;
    prg_tramin_prog: number;
    prg_num_tramin_prog: number;
    dist_desde: number;
    dist_hasta: number;
    des_proyecto: string;
    nom_proyecto: string;
    num_buzamiento: number;
    por_dilucion: number;
    ind_clasificacion_sos: string;
    ind_taladro_largo: string;
    ind_verificacion: string;
    num_factor_x: number;
    val_tipo_fac: number;
    num_corte: number;
    num_dis_limpieza: number;
    prg_est: string;
    prg_cutoff: number;
    ind_calc_dil: string;
    fac_vptmin: number;
    val_vpt: number;
    ind_calc_tipo_dil: string;
    ind_tipo_ley: string;
}

export interface ResumenProgramaResponse {
    cabecera: ResumenCabecera;
    detalle: ResumenDetalle[];
}



