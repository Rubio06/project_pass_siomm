export interface AperPeriodo {
    cie_per: string;
    fec_ini: string;
    fec_fin: string;
    cie_ano: string;
}

export interface MaeValCanchas {
    val_tms: string;
    val_ag: string;
    val_cu: string;
    val_pb: string;
    val_zn: string;
    val_vpt: string;
}

export interface MaeValOperativo {
    val_fac_ag: string;
    val_pre_ag: string;
    val_fac_cu: string;
    val_pre_cu: string;
    val_fac_pb: string;
    val_pre_pb: string;
    val_fac_zn: string;
    val_pre_zn: string;
    val_fac_au: string;
    val_pre_au: string;
}
export interface MaeFactorSobredisolucion {
    val_fac_ag: string;
    val_fac_cu: string;
    val_fac_pb: string;
    val_fac_zn: string;
    val_fac_au: string;
}

export interface MaeFactorRecuperacion {
    val_fac_bud_ag: string;
    val_fac_bud_cu: string;
    val_fac_bud_pb: string;
    val_fac_bud_zn: string;
    val_fac_bud_au: string;

    val_con_ag: string;
    val_con_cu: string;
    val_con_pb: string;
    val_con_zn: string;
    val_con_au: string;
}

export interface MaeFactor {
    fac_denmin: string;
    fac_dendes: string;
    fac_vptmin: string;
    fac_dialab: string;
    fac_tarhor: string;
    fac_porcum: string;
    fac_porhum: string;
    fac_tms_dif: string;
}

export interface MaeValOperativoDetalle {
    val_fac_rec_ag: number;
    val_fac_rec_cu: number;
    val_fac_rec_pb: number;
    val_fac_rec_zn: number;
    val_fac_rec_au: number;
    val_des_tipo_fac: string;
}

export interface PlanningData {
    cierre_periodo: AperPeriodo[];
    factorOperativo: MaeValOperativo[];
    canchas: MaeValCanchas[];
    sobredisolucion: MaeFactorSobredisolucion[];
    recuperacionBudget: MaeFactorRecuperacion[];
    factor: MaeFactor[];
    operativo_detalle: MaeValOperativoDetalle[];
    laboratorio_estandar: MaeTipLabEstandar[];
    metodo_minado: MaePerMetExplotacion[];
    semana_ciclo: MaeSemanaCiclo[];
    semana_avance: MaeSemanaAvance[];
    exploracion_extandar: MaeExploEstandar[];
}

export interface MaeExploEstandar {
    cod_zona: string;
    lab_pieper: string;
    lab_broca: string;
    lab_barcon: string;
    lab_barren: string;
    lab_facpot: string;
    lab_fulmin: string;
    lab_conect: string;
    lab_punmar: string;
    lab_tabla: string;
    lab_apr: string;
}

export interface MaePerMetExplotacion {
    cod_metexp: string;
    nom_metexp: string;
    ind_calculo_dilucion: string;
    ind_calculo_leyes_min: string;
    ind_act: string;
}


export interface MaeSemanaCiclo {

    num_semana: number;
    fec_ini: Date;
    fec_fin: Date;
    desc_semana: string;
}


export interface MaeSemanaAvance {

    num_semana: number;
    fec_ini: Date;
    fec_fin: Date;
    desc_semana: string;
}

export interface PlanningResponse {
    success: boolean;
    data: PlanningData;
}

export interface MaeTipLabEstandar {
    cod_tiplab: string;
    nro_lab_ancho: string;
    nro_lab_altura: string;
    nro_lab_pieper: string;
    nro_lab_broca: string;
    nro_lab_barcon: string;
    nro_lab_barren: string;
    nro_lab_facpot: string;
    nro_lab_fulmin: string;
    nro_lab_conect: string;
    nro_lab_punmar: string;
    nro_lab_tabla: string;
}

export interface MaeExploEstandar {
    cod_zona: string;
    lab_pieper: string;
    lab_broca: string;
    lab_barcon: string;
    lab_barren: string;
    lab_facpot: string;
    lab_fulmin: string;
    lab_conect: string;
    lab_punmar: string;
    lab_tabla: string;
    lab_apr: string;
}

export interface SelectExploracion {
    cod_metexp: string;
    nom_metexp: string;
}

export interface SelectZona {
    cod_zona: string;
    des_zona: string;
}

export interface SelectTipoLabor {
    cod_tipo_labor: string;
    nom_tipo_labor: string;
}

export interface TableHeader {
    label: string;
}

export interface TableField {
    type: string;
    name: string;
    readonly: boolean;
}       



export const TH_CAMPOS_TABLE: TableHeader[] = [
    { label: "Ag /Gr" },
    { label: "% Cu" },
    { label: "% Pb" },
    { label: "% Zn" },
    { label: "Au /Gr" },
    { label: "% Ag" },
    { label: "% Cu" },
    { label: "% Pb" },
    { label: "% Zn" },
    { label: "% Au" },
]

export const TD_CAMPOS_TABLE: TableField[] = [
    { type: "text", name: "val_des_tipo_fac", readonly: true },
    { type: "number", name: "val_fac_ag", readonly: true },
    { type: "number", name: "val_fac_cu", readonly: true },
    { type: "number", name: "val_fac_pb", readonly: true },
    { type: "number", name: "val_fac_zn", readonly: true },
    { type: "number", name: "val_fac_au", readonly: true },
    { type: "text", name: "val_fac_rec_ag", readonly: true },
    { type: "text", name: "val_fac_rec_cu", readonly: true },
    { type: "text", name: "val_fac_rec_pb", readonly: true },
    { type: "text", name: "val_fac_rec_zn", readonly: true },
    { type: "text", name: "val_fac_rec_au", readonly: true },
]



export interface EstructuraDatos {
    type: string;
    name: string;
    placeholder: string;
}

export interface EstructuraDatosOtros {
    type: string;
    name: string;
    width: string;
}

export interface thTitulos {
    titulo: string;
}


/***** SEMANA CICLO DATA ****/
export const DATOS_COLUMNA_SEMANA_CICLO_MINADO: EstructuraDatos[] = [
    { type: 'number', name: 'num_semana', placeholder: 'Ingrese una semana ' },
    { type: 'text', name: 'fec_ini', placeholder: '' },
    { type: 'text', name: 'fec_fin', placeholder: '' },
    { type: 'text', name: 'desc_semana', placeholder: '' },
]

export const TH_SEMANA_CICLO_MINADO: thTitulos[] = [
    { titulo: 'Num.' },
    { titulo: 'Fec. Inicio' },
    { titulo: 'Fec. Fin' },
    { titulo: 'Descripción' },
]

/**SEMANA AVANCE**/

export const TH_SEMANA_AVANCE: thTitulos[] = [
    { titulo: 'Num.' },
    { titulo: 'Fec. Inicio' },
    { titulo: 'Fec. Fin' },
    { titulo: 'Descripción' },
]

export const DATOS_SEMANA_AVANCE: EstructuraDatos[] = [
    { type: 'number', name: 'num_semana', placeholder: 'Ingrese una semana ' },
    { type: 'text', name: 'fec_ini', placeholder: '' },
    { type: 'text', name: 'fec_fin', placeholder: '' },
    { type: 'text', name: 'desc_semana', placeholder: '' },
]



/**METODO MINADO**/
export const TH_METODOLO_MINADO: thTitulos[] = [
    { titulo: 'Metodo Minado' },
    { titulo: 'Factor' },
    { titulo: 'Tipo Calculo Dilución' },
    { titulo: 'Tipo Calculo Dilución Leyes' },
    { titulo: 'Ind Act' }
]

export const DATOS_METODO_MINADO: EstructuraDatos[] = [
    { type: 'select', name: 'cod_metexp', placeholder: 'Seleccione un método' },
    { type: 'text', name: 'nom_metexp', placeholder: 'Ingrese nombre' },
    { type: 'select', name: 'ind_calculo_dilucion', placeholder: 'Seleccione' },
    { type: 'select', name: 'ind_calculo_leyes_min', placeholder: 'Seleccione' },
    { type: 'select', name: 'ind_act', placeholder: 'Seleccione' },
]

/**ESTANDAR EXPLORACION**/
export const TH_ESTANDAR_EXPLORACION: thTitulos[] = [
    { titulo: 'Zona' },
    { titulo: 'Pie Perforado' },
    { titulo: 'Broca' },
    { titulo: 'Barra Crónico' },
    { titulo: 'Bareno' },
    { titulo: 'Factor Potencia' },
    { titulo: 'Fulminante' },
    { titulo: 'Conectores' },
    { titulo: 'Puntal Marchavante' },
    { titulo: 'Tabla' }, 
    { titulo: 'Activ.' },
    { titulo: 'Aprobado' }
]

export const DATOS_METODO_EXPLORACION: EstructuraDatosOtros[] = [
    { type: 'select', name: 'cod_zona', width: '210px' },
    { type: 'text', name: 'lab_pieper', width: '20px' },
    { type: 'text', name: 'lab_broca', width: '20px' },
    { type: 'text', name: 'lab_barcon', width: '20px' },
    { type: 'text', name: 'lab_barren', width: '20px' },
    { type: 'text', name: 'lab_facpot', width: '20px' },
    { type: 'text', name: 'lab_fulmin', width: '20px' },
    { type: 'text', name: 'lab_conect', width: '20px' },
    { type: 'text', name: 'lab_punmar', width: '20px' },
    { type: 'text', name: 'lab_tabla', width: '20px' },
    { type: 'text', name: 'ind_act', width: '20px' },
    { type: 'text', name: 'lab_apr', width: '20px' },
]


/**ESTANDAR AVANCE**/
export const TH_ESTANDAR_AVANCE = [
    { titulo: 'Tipo Labor' },
    { titulo: 'Ancho' },
    { titulo: 'Altura' },
    { titulo: 'Ft Perforado FT/mts' },
    { titulo: 'Nro Broca Und/mts' },
    { titulo: 'Barra Cónica Und/mts' },
    { titulo: 'Barreno Und/mts' },
    { titulo: 'Potencia kg/mts' },
    { titulo: 'Fulminante Und/mts' },
    { titulo: 'Conectores Und/mts' },
    { titulo: 'Puntal /Marchavante' }, // cambiar el nombre en el formGroup
    { titulo: 'Nro Tabla' }
]

export const DATOS_ESTANDER_AVANCE: EstructuraDatosOtros[] = [
    { type: 'select', name: 'cod_tiplab', width: '210px' },
    { type: 'text', name: 'nro_lab_ancho', width: '20px' },
    { type: 'text', name: 'nro_lab_altura', width: '20px' },
    { type: 'text', name: 'nro_lab_pieper', width: '20px' },
    { type: 'text', name: 'nro_lab_broca', width: '20px' },
    { type: 'text', name: 'nro_lab_barcon', width: '20px' },
    { type: 'text', name: 'nro_lab_barren', width: '20px' },
    { type: 'text', name: 'nro_lab_facpot', width: '20px' },
    { type: 'text', name: 'nro_lab_fulmin', width: '20px' },
    { type: 'text', name: 'nro_lab_conect', width: '20px' },
    { type: 'text', name: 'nro_lab_punmar', width: '20px' },
    { type: 'text', name: 'nro_lab_tabla', width: '20px' },
]


















