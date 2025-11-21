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
}

export interface MaePerMetExplotacion {
    cod_metexp: string;
    nom_metexp: string;
    ind_calculo_dilucion: string;
    ind_calculo_leyes_min: string;
    ind_act: string;
}

export interface MaeTipLabEstandar {
    cod_tiplab: string;
    nro_lab_ancho: number;
    nro_lab_altura: number;
    nro_lab_pieper: number;
    nro_lab_broca: number;
    nro_lab_barcon: number;
    nro_lab_barren: number;
    nro_lab_facpot: number;
    nro_lab_fulmin: number;
    nro_lab_conect: number;
    nro_lab_punmar: number;
    nro_lab_tabla: number;
}

export interface MaeSemanaCiclo {

    num_semana: number;
    fec_ini: Date;
    fec_fin: Date;
    desc_Semana: string;
}


export interface MaeSemanaAvance {

    num_semana: number;
    fec_ini: Date;
    fec_fin: Date;
    desc_Semana: string;
}








export interface PlanningResponse {
    success: boolean;
    data: PlanningData;
}


export interface ColumnaTabla {
    titulo:   string;
    control:  string;
    tipo?:    string;
    campo?:   string;   // acepta cualquier string

}

export const TABLA_DATOS_ESTANDAR_AVANCE = [
    { titulo: 'Tipo Labor', control: 'cod_tiplab' },
    { titulo: 'Ancho', control: 'nro_lab_ancho' },
    { titulo: 'Altura', control: 'nro_lab_altura' },
    { titulo: 'Ft Perforado FT/mts', control: 'nro_lab_pieper' },
    { titulo: 'Nro Broca Und/mts', control: 'nro_lab_broca' },
    { titulo: 'Barra Cónica Und/mts', control: 'nro_lab_barcon' },
    { titulo: 'Barreno Und/mts', control: 'nro_lab_barren' },
    { titulo: 'Potencia kg/mts', control: 'nro_lab_facpot' },
    { titulo: 'Fulminante Und/mts', control: 'nro_lab_fulmin' },
    { titulo: 'Conectores Und/mts', control: 'nro_lab_conect' },
    { titulo: 'Puntal /Marchavante', control: 'nro_lab_punmar' }, // cambiar el nombre en el formGroup
    { titulo: 'Nro Tabla', control: 'nro_lab_tabla' }
]


export const TABLA_DATOS_ESTANDAR_EXPLORACION = [
    { titulo: 'Zona', control: 'val_fac_ag' },
    { titulo: 'Pie Perforado', control: 'val_fac_cu' },
    { titulo: 'Broca', control: 'val_fac_pb' },
    { titulo: 'Barra Crónico', control: 'val_fac_zn' },
    { titulo: 'Bareno', control: 'val_fac_au' },
    { titulo: 'Factor Potencia', control: 'val_fac_rec_ag' },
    { titulo: 'Fulminante', control: 'val_fac_rec_cu' },
    { titulo: 'Conectores', control: 'val_fac_rec_pb' },
    { titulo: 'Puntal Marchavante', control: 'val_fac_rec_zn' },
    { titulo: 'Tabla', control: 'val_fac_rec_zn2' }, // cambiar el nombre en el formGroup
    { titulo: 'Aprobado', control: 'val_fac_rec_zn3' }
]

export const TABLA_DATOS_METODO_MINADO = [
    { titulo: 'Metodo Minado', control: 'cod_metexp', tipo: 'select', campo: 'metodoMinado' },
    { titulo: 'Factor', control: 'nom_metexp',  tipo: 'input' },
    { titulo: 'Tipo Calculo Dilución', control: 'ind_calculo_dilucion',  tipo: 'select', campo: 'tipoCalculo' },
    { titulo: 'Tipo Calculo Dilución Leyes', control: 'ind_calculo_leyes_min',  tipo: 'select', campo: 'TCalculoDilucionLeyes' },
    { titulo: 'Ind Act', control: 'ind_act',  tipo: 'select', campo: 'IndAct' }
]

export const TABLA_DATOS_SEMANAS_AVANCES = [
    { titulo: 'Num.', control: 'num_semana' },
    { titulo: 'Fec. Inicio', control: 'fec_ini' },
    { titulo: 'Fec. Fin', control: 'fec_fin' },
    { titulo: 'Descripción', control: 'desc_semana' },
]

export const TABLA_DATOS_SEMANAS_CICLO = [
    { titulo: 'Num.', control: 'num_semana' },
    { titulo: 'Fec. Inicio', control: 'fec_ini' },
    { titulo: 'Fec. Fin', control: 'fec_fin' },
    { titulo: 'Descripción', control: 'desc_semana' },
]








