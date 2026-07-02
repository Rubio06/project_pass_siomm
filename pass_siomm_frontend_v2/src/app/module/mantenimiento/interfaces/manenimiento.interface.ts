export interface UnidadEconomica {

    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_und_econom: string;
    nom_und_econom: string;
    des_und_econom: string;
    ind_act: string;
    cod_und_econom_dhlogger: string;
}


export interface Zona {

    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_zona: string;
    des_zona: string;
    obs_zona: string;

    nro_den: number | null;

    cod_costo_equivalente: string | null;
    cod_partida_equivalente: string | null;

    est_zona: string;

    cod_usuario_creo: string | null;
    fec_usuario_creo: string | Date | null;

    cod_usuario_modi: string | null;
    fec_usuario_modi: string | Date | null;

    val_vpt: number | null;

    des_empresa_zona: string | null;
    cod_zona_dhlogger: string | null;
    cod_usuario_responsable: string | null;

    ind_dens_estructura: string | null;

    cod_cancha_dhlogger: string | null;

    num_espon_min: number | null;
    num_espon_des: number | null;
    accion: string;
}


export interface RespuestaMantenimiento {
    estado: number;
    mensaje: string;
}

export interface BotonesInterface {
    texto: string;
    icono: string;
    color: string;
    accion: string;
    bloqueo: boolean;

}

export interface UsuarioJefeTurno {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_usuario: string;
    nom_usuario: string;
}

export const BOTONES_PLANEAMIENTO: BotonesInterface[] = [
    {
        texto: 'Refrescar',
        accion: 'editar',
        color: 'bg-[#0369a1]',
        icono: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        bloqueo: true
    },
    {
        texto: 'Nuevo Registro',
        accion: 'nuevo',
        color: 'bg-[#047857]',
        icono: 'M12 4v16m8-8H4',
        bloqueo: true
    },
    {
        texto: 'Guardar',
        accion: 'guardar',
        color: 'bg-[#013B5C]',
        icono: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
        bloqueo: true
    },
];

export const BOTONES_PLANEAMIENTO_CONTRATO: BotonesInterface[] = [
    {
        texto: 'Refrescar',
        accion: 'refrescar',
        color: 'bg-[#0369a1]',
        // refresh
        icono: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M4.582 9H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2M19.418 15H15',
        bloqueo: false
    },
    {
        texto: 'Nuevo Registro',
        accion: 'nuevo',
        color: 'bg-[#047857]',
        // plus
        icono: 'M12 4v16m8-8H4',
        bloqueo: false
    },
    {
        texto: 'Anular',
        accion: 'anular',
        color: 'bg-[#991b1b]',
        // x-circle
        icono: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        bloqueo: true
    },
    // 047857

    // {
    //     texto: 'Guardar',
    //     accion: 'guardar',
    //     color: 'bg-[#1e40af]',
    //     // save
    //     icono: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V4',
    //     bloqueo: true
    // },
    {
        texto: 'Aprobar',
        accion: 'aprobar',
        color: 'bg-[#166534]',
        // check-circle
        icono: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        bloqueo: true
    },
    {
        texto: 'Reversión',
        accion: 'reversion',
        color: 'bg-[#92400e]',
        // undo
        icono: 'M3 10h10a4 4 0 110 8H9m-6-8l4-4m-4 4l4 4',
        bloqueo: true
    },
    {
        texto: 'Historico',
        accion: 'historico',
        color: 'bg-[#374151]',
        // clock/history
        icono: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        bloqueo: true
    },
    {
        texto: 'Imprimir',
        accion: 'imprimir',
        color: 'bg-[#1e40af]',
        // document-download
        icono: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z',        
        bloqueo: false
    },
    {
        texto: 'Exportar a Excel',
        accion: 'exportar',
        color: 'bg-[#166534]',
        // document-download
        icono: 'M12 16v-8m0 8l-3-3m3 3l3-3m6 5H3',
        bloqueo: false
    },

];

export interface ZonaInsert {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_zona: string;
    des_zona: string;
    obs_zona?: string; // Opcional
    nro_den: number;
    cod_costo_equivalente?: string;
    est_zona: string;
    cod_usuario_creo: string;
    cod_usuario_modi?: string;
    val_vpt: number;
    cod_zona_dhlogger?: string;
    cod_usuario_responsable?: string;
    ind_dens_estructura: string;
}

export interface ResponseZona {
    estado: number;
    mensaje: string;
}


export interface Veta {
    // Claves Primarias y Relacionales
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_veta: string;

    // Información de la Veta
    nom_veta: string;
    des_veta: string;
    ind_veta: string; // 'B', 'V', etc.
    est_veta: string; // 'ACT', 'INA'

    des_zona: string;
    nom_und_econom: string;

    // Auditoría (Opcionales por si el objeto se usa para creación)
    cod_usuario_creo: string;
    fec_usuario_creo?: Date | string;
    cod_usuario_modi?: string;
    fec_usuario_modi?: Date | string;

    // Campos Adicionales / Integración
    cod_veta_old?: string | null;
    cod_veta_dhlogger?: string | null;
    nro_den?: number | null;

    // Comodín para el Backend (G/E)
    accion?: string;
}

export interface UndEconomicaSelectDto {
    cod_und_econom?: string;
    des_und_econom?: string;
}

export interface ZonaSelectDto {
    cod_zona?: string;
    des_zona?: string;
}

export interface VetaSelectDto {
    cod_veta?: string;
    nom_veta?: string;
}


export interface ListasSelectDto {
    zonas: ZonaSelectDto[];
    unidadesEconomicas: UndEconomicaSelectDto[];
    veta: VetaSelectDto[];
}

export interface RespuestaDto {
    estado: number;
    mensaje: string;
}

export interface EliminarVeta {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_veta: string;
    cod_zona: string;
    cod_und_econom: string;
}

export interface Nivel {

    cod_empresa?: string;
    cod_empresa_unidad?: string;
    cod_nivel?: string;

    nom_nivel?: string;
    des_nivel?: string;

    nro_nivel_cot?: string;

    est_nivel?: string;

    cod_usuario_creo?: string;
    fec_usuario_creo?: Date;

    cod_usuario_modi?: string;
    fec_usuario_modi?: Date;

    cod_nivel_dhlogger?: string;
    accion: string;
    esNuevo: boolean;
}

export interface ResponseApi {

    estado: number;
    mensaje: string;

}

export interface ResponseEliminarDto {
    estado: number;
    mensaje: string;
}

export interface TipoLabor {

    cod_empresa?: string;

    cod_empresa_unidad?: string;

    cod_tipo_labor?: string;

    nom_tipo_labor?: string;

    ind_orient?: string;

    ind_tipchm?: string;

    est_tipo_labor?: string;

    cod_usuario_creo?: string;

    fec_usuario_creo?: Date | string | null;

    cod_usuario_modi?: string;

    fec_usuario_modi?: Date | string | null;

    cod_tipo_labor_dhlogger: string;

    ind_cota?: string;

    esNuevo: boolean;

    accion: string;

}

export interface LaborMant {

    cod_empresa: string;

    cod_empresa_unidad: string;

    cod_und_econom: string;

    cod_zona: string;

    cod_veta: string;

    cod_nivel: string;

    cod_tipo_labor: string;

    cod_labor: string;

    nom_labor: string;

    des_labor: string;

    lab_blkgeo: string;

    met_cod: string;

    nro_lab_ag: number;

    nro_lab_au: number;

    nro_lab_cu: number;

    nro_lab_pb: number;

    nro_lab_zn: number;

    ind_tipo_labor: string;

    est_labor: string;

    cod_proced_blza: string;

    cod_usuario_creo: string;

    fec_usuario_creo: Date;

    cod_usuario_modi: string;

    fec_usuario_modi: Date;

    cod_tipo_labor_ant: string;

    cod_labor_ant: string;

    cod_fase: string;

    nom_und_econom: string;
    des_und_econom: string;
    nom_veta: string;
    nom_nivel: string;
    nom_tipo_labor: string;


    cod_grupo_control: string;


    nom_proced_blza: string;
    nom_grupo_control: string;

    accion?: string;

    esNuevo?: boolean;
}

export interface PaginacionLabor {
    totalRegistros: number;
    paginaActual: number;
    cantidadReg: number;
    totalPaginas: number;
    data: LaborMant[]
}

export interface ListZonas {
    cod_zona: string;
    des_zona: string;
}

export interface LaborFiltro {

    cod_empresa: string;

    cod_empresa_unidad: string;

    cod_zona: string;

    texto_busqueda: string | null;

    pagina: number;

    cantidad_reg: number;

}


export interface MaestrosLabor {

    unidadEconomica: UnidadEconomicaMant[];

    vetas: VetaMant[];

    niveles: NivelMant[];

    tipoLabor: TipoLaborMant[];

    procedenciaBalanza: ProcedenciaBalanzaMant[];

    grupoControl: GrupoControlMant[];

}

export interface UnidadEconomicaMant {

    cod_und_econom?: string;

    nom_und_econom?: string;

    cod_empresa?: string;

    des_und_econom?: string;
    ind_act: string;
    cod_und_econom_dhlogger?: string;
    cod_empresa_unidad?: string;

    accion: string;

}

export interface VetaMant {

    nombre?: string;

    cod_empresa?: string;

    cod_empresa_unidad?: string;

    cod_und_econom?: string;

    cod_zona?: string;

    cod_veta?: string;

    nom_veta?: string;

    des_veta?: string;

    ind_veta?: string;

    est_veta?: string;

    cod_usuario_creo?: string;

    fec_usuario_creo?: Date;

    cod_usuario_modi?: string;

    fec_usuario_modi?: Date;

}

export interface NivelMant {

    cod_empresa?: string;

    cod_empresa_unidad?: string;

    cod_nivel?: string;

    nom_nivel?: string;

    des_nivel?: string;

    nro_nivel_cot?: number;

    est_nivel?: string;

}

export interface TipoLaborMant {

    cod_tipo_labor?: string;

    est_tipo_labor?: string;

    nom_tipo_labor?: string;

    ind_orient?: string;

    cod_usuario_creo?: string;

    fec_usuario_creo?: Date;

    cod_usuario_modi?: string;

    fec_usuario_modi?: Date;

    tipo_labor?: string;

    ind_tipchm?: string;

    cod_empresa?: string;

    cod_empresa_unidad?: string;

}

export interface ProcedenciaBalanzaMant {

    cod_proced_blza?: string;

    nom_proced_blza?: string;

    cod_zona?: string;

    ind_tolva_cancha?: string;

    des_zona?: string;

}

export interface GrupoControlMant {

    cod_grupo_control?: string;

    nom_grupo_control?: string;

    est_grupo_control?: string;

}

export interface Contrata {

    cod_empresa?: string;

    cod_contrata?: string;

    des_contrata?: string;

    ruc_contrata?: string;

    nro_telefono?: string;

    nro_fax?: string;

    rep_nombre?: string;

    fec_ingreso?: Date;

    fec_cese?: Date;

    eml_correo?: string;

    ind_tipo_contrata?: string;

    est_contrata?: string;

    idvendor?: string;

    vendor?: string;

    id_vendor?: string;
    accion?: string;

    esNuevo?: boolean;
    texto_busqueda?: string | null;

}


export interface ContrataFiltro {
    cod_empresa: string;
    texto_busqueda?: string | null;
}

export interface RutasTransporteFiltro {
    cod_empresa?: string;
    cod_empresa_unidad?: string;

    texto_busqueda?: string | null;
}

export interface RutaTransporte {

    cod_empresa: string;

    cod_empresa_unidad: string;

    cod_ruta: string;

    des_ruta: string;

    des_ruta_abrev: string;

    cod_zona: string;
    des_zona: string;

    ind_tipo_tolcanc: string;

    flg_vigente: number;

    cod_usuario_creo: string;

    fec_usuario_creo: Date | string | null;

    cod_usuario_modi: string;

    fec_usuario_modi: Date | string | null;

    esNuevo: boolean;
    accion: string;

}

export interface RutasTransporteMovimiento {

    cod_empresa?: string;

    cod_empresa_unidad?: string;

    cod_ruta_transporte?: string;

    cod_ruta_origen?: string;

    cod_ruta_destino?: string;

    des_ruta_origen?: string;

    des_ruta_destino?: string;

    est_ruta_transporte?: string;

    cod_usuario_creo?: string;

    fec_usuario_creo?: Date;

    cod_usuario_modi?: string;

    fec_usuario_modi?: Date;
    esNuevo: boolean,
    accion: string;

}

export interface ListaRutaTransporte {
    cod_ruta: string;
    des_ruta: string;
}


// export interface FiltrosAdmContrato {
//     cod_contrata  : string;       // '%' = todos
//     cod_contrato  : string;       // ''  = todos
//     ind_estado    : string;       // '%' = todos
//     // fec_all       : boolean;      // checkbox activa filtro fecha
//     fec_inicio    : string | null; // null = no filtra
//     fec_termino   : string | null; // null = no filtra
//     // dia_all       : boolean;      // checkbox activa filtro días
//     dia_ini       : number | null; // null = no filtra
//     dia_fin       : number | null; // null = no filtra
// }





