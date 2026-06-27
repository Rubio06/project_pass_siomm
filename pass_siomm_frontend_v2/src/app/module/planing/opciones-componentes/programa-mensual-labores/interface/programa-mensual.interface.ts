export interface BotonesInterface {
    texto: string;
    accion: string;
    icono: string;
    color: string;
    bloqueo?: boolean
}

export const ARREGLO_BOTONES: BotonesInterface[] = [
    // { texto: 'Nuevo', accion: 'nuevo', icono: 'M12 4v16m8-8H4', color: 'bg-[#047857]' },
    { texto: 'Guardar', accion: 'guardar', icono: 'M5 13l4 4L19 7', color: 'bg-[#033351]', bloqueo: true },
    { texto: 'Copiar Labor', accion: 'copiar', icono: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z', color: 'bg-[#5b21b6]', bloqueo: true },
    { texto: 'Resumen', accion: 'resumen', icono: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'bg-[#92400e]', bloqueo: true },
    // { texto: 'Importar', accion: 'importar', icono: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'bg-[#155e75]' },
    { texto: 'Exportar', accion: 'exportar', icono: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10', color: 'bg-[#3730a3]', bloqueo: true },
    { texto: 'Labores', accion: 'labores', icono: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'bg-[#115e59]', bloqueo: true },
    { texto: 'Cerrar', accion: 'cerrar', icono: 'M6 18L18 6M6 6l12 12', color: 'bg-[#475569]', bloqueo: true }
]


export interface ListMensualIncidencias {
    cod_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    cod_ala: string;
    descripcion: string;
    nom_veta: string;

}

export interface ListaMensual {
    cod_empresa: string;
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_contrata: string;
    des_contrata: string;
    cie_ano: string;
    cie_per: string;

    fec_emi: string | null;

    prg_est: string;

    prg_cutoff: number | null;

    cod_usuario_creo: string;
    fec_usuario_creo: string | null;

    cod_usuario_modi: string;
    fec_usuario_modi: string | null;

    cod_usuario_apr: string;
    fec_usuario_apr: string | null;

    cod_usuario_anu: string;
    fec_usuario_anu: string | null;

    prg_pre_apr: string;
    prg_apr_geo: string;
    prg_apr_min: string;

    cod_usuario_apr_geo: string;
    fec_usuario_apr_geo: string | null;

    cod_usuario_apr_min: string;
    fec_usuario_apr_min: string | null;

    ind_calc_dil: string;

    // Zona
    des_zona: string;
    des: string;

    // Unidad económica
    nom_und_econom: string;

    tipo_incidencia: string;

    imagen: string;
}


export interface ProgramaMensualInformacion {

    cod_empresa: string;
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_und_econom: string;
    cod_zona: string;
    cod_contrata: string;
    des_contrata: string;
    cie_ano: string;
    cie_per: string;

    fec_emi: Date | null;
    prg_est: string;

    cod_usuario_creo: string;
    fec_usuario_creo: Date | null;

    cod_usuario_modi: string;
    fec_usuario_modi: Date | null;

    prg_cutoff: number | null;
    prg_pre_apr: number | null;

    ind_calc_dil: string;
}

export const ARREGLO_BOTONES_PR_MENSUAL: BotonesInterface[] = [
    {
        texto: 'Nuevo',
        accion: 'nuevo',
        icono: 'M12 4v16m8-8H4',
        color: 'bg-[#0f3d57] hover:bg-[#0b2f43]', // azul petróleo
        bloqueo: true
    },
    // {
    //     texto: 'Detalles',
    //     accion: 'detalles',
    //     icono: 'M3 7h18M3 12h18M3 17h18',
    //     color: 'bg-[#3f3f46] hover:bg-[#27272a' // violeta técnico
    // },
    {
        texto: 'Anular',
        accion: 'anular',
        icono: 'M6 18L18 6M6 6l12 12',
        color: 'bg-[#9a3412] hover:bg-[#7c2d12]', // cobre / óxido
        bloqueo: true
    },
    {
        texto: 'Aprobar',
        accion: 'aprobar',
        icono: 'M5 13l4 4L19 7',
        color: 'bg-[#065f46] hover:bg-[#064e3b]', // verde operación minera
        bloqueo: true
    },
    // {
    //     texto: 'Pre-Aprobación',
    //     accion: 'preAprobar',
    //     icono: 'M12 8v4l3 3M12 3l7 4v5c0 5-3.5 9-7 10c-3.5-1-7-5-7-10V7l7-4z',
    //     color: 'bg-[#374151] hover:bg-[#1f2937]', // gris maquinaria pesada
    //     bloqueo: true
    // },
    {
        texto: 'Importar',
        accion: 'importar',
        icono: 'M9 12h6m-6 4h6M9 8h6M7 3h10l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z',
        color: 'bg-[#0f766e] hover:bg-[#0d5c57]' // teal industrial
    },
    {
        texto: 'Copiar Programa',
        accion: 'copiar',
        icono: 'M9 9h10v10H9zM5 5h10v10H5z',
        color: 'bg-[#57534e] hover:bg-[#44403c]', // gris roca
        bloqueo: true
    },
    {
        texto: 'Exportar',
        accion: 'exportar',
        icono: 'M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14',
        color: 'bg-[#15803d] hover:bg-[#166534]', // verde reporte / salida
        bloqueo: true
    }
];

export interface ResponseProgramacion {
    estado: number;
    mensaje: string;

}

export interface ExportarProgramacion {
    cod_empresa_unidad: string;
    nro_prog: string;
    cod_und_econom: string;
    nom_und_econom: string;
    cod_zona: string;
    des_zona: string;
    cod_veta: string;
    des_veta: string;
    cod_nivel: string;
    cod_tipo_labor: string;
    cod_labor: string;
    cod_ala: string;
    cod_fase: string;
    nom_fase: string;
    cod_cto: string;
    cod_cta: string;
    ind_tip_roca: string;
    prg_tipace: string;
    prg_avamts: string;
    metexp_cod: string;
    nom_metexp: string;
    prg_secancho: string;
    prg_secaltu: string;
    prg_tmsdes: string;
    prg_tmsmin: string;
    prg_blocks: string;
    prg_ancmin: string;
    prg_ancvet: string;
    prg_loncor: string;
    prg_altcor: string;
    prg_tmsrotvet: string;
    prg_tmsrotdil: string;
    prg_tmsextraid: string;
    prg_fecmuestreo: Date | null;
    prg_leyag: string;
    prg_leycu: string;
    prg_leypb: string;
    prg_leyzn: string;
    prg_leyagdil: string;
    prg_leycudil: string;
    prg_leypbdil: string;
    prg_leyzndil: string;
    prg_vptdil: string;
    prg_homlab: string;
    prg_tareas: string;
    prg_nroper: string;
    prg_nrowinche: string;
    prg_nropala: string;
    prg_pieper: string;
    prg_brocas: string;
    prg_barcon: string;
    prg_barren: string;
    prg_dinami: string;
    prg_fulmin: string;
    prg_conect: string;
    prg_punmar: string;
    prg_tablas: string;
    prg_pernos: string;
    prg_mallas: string;
    prg_cimbras: string;
    prg_progra: string;
    cod_tipo_labor_ant: string;
    cod_labor_ant: string;
    cod_ala_ant: string;
    ind_tip_roca_piso: string;
    ind_tip_roca_techo: string;
    prg_tramin: string;
    prg_vptmin: string;
    cod_empresa: string;
    prg_est: string;
    fac_vptmin: string;
    // val_vpt: string;
    dist_desde: string;
    dist_hasta: string;
    prg_cutoff: string;
    prg_num_tramin: string;
    des_proyecto: string;
    nom_proyecto: string;
    cie_ano: string;
    cie_per: string;
    fec_emi: Date | null;
    cod_contrata: string;
    des_contrata: string;
    prg_leyau: string;
    prg_leyaudil: string;
    tratamiento: string;
}

export const HEADERS_PROGRAM: string[] = [
    "Año",
    "Mes",
    "Nro\nProg",
    "Fecha\nEmision",
    "Estado",
    "Tratamiento",
    "Und\nEconomica",
    "Zona",
    "Contrata",
    "Fase",
    "Veta",
    "Nivel",
    "Labor",
    "Tipo\nLab.",
    "Ala",
    "Cod\nCto",
    "Cod\nCta",
    "Blocks",
    "RMR\nPiso",
    "RMR\nVeta",
    "RMR\nTecho",
    "Avance\nMTS",
    "Sección\nAncho",
    "Sección\nAltura",
    "TMS\nDesmonte",
    "TMS\nMineral",
    "TMS\nTotal",
    "Ancho\nMinado",
    "Ancho\nVeta",
    "Ancho\nDilucion",
    "Tramo\nMinable",
    "Nro Tram\nMin",
    "Longitud\nCorte",
    "Altura\nCorte",
    "TMS Rotas\nVeta",
    "TMS Rotas\nDilucion",
    "TMS\nExtraido",
    "Fecha\nMuestreo",
    "Ag\n(gr)",
    "Cu\n(%)",
    "Pb\n(%)",
    "Zn\n(%)",
    "VPT\nUS$",
    "Ag (gr)\nMinable",
    "Cu (%)\nMinable",
    "Pb (%)\nMinable",
    "Zn (%)\nMinable",
    "VPT US$\nMinable",
    "Rentabilidad",
    "Metodo\nMinado",
    "Hombres\nx Labor",
    "Descripcion del\nProyecto",
    "Nombre del\nProyecto"
];

export interface PreAprobacionResponse {
    ok: boolean;
    mensaje: string | null;
    nuevo_estado: string | null;
}

export interface CopiarProgramacionRequest {
    cod_empresa: string;
    cod_empresa_unidad: string;
    nro_prog: string;
    cie_ano: string;
    cie_per: string;
    usuario: string;
}

export interface ResponsePrograma {
    mensaje: string;
    nro_prog_nuevo: string
}

export interface responseImportar {
    respuesta: boolean;
    totalFilas: number;
    mensaje: string;
    // resultado: ImportarProgramacion[];


}


export interface ExportarProgramacionResponse {
    estado: number;
    mensaje: string;
    data: ExportarProgramacion[];
}









