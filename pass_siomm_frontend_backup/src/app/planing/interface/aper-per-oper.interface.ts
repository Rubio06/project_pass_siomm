export interface AperPeriodo {
    cie_per: string;
    fec_ini: string;
    fec_fin: string;
    cie_ano: string;
}

export interface MaeValCanchas {
    val_tms:  string;
    val_ag:   string;
    val_cu:   string;
    val_pb:   string;
    val_zn:   string;
    val_vpt:  string;
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
    fac_denmin:  string;
    fac_dendes:  string;
    fac_vptmin:  string;
    fac_dialab:  string;
    fac_tarhor:  string;
    fac_porcum:  string;
    fac_porhum:  string;
    fac_tms_dif: string;
}

export interface MaeValOperativoDetalle {
    val_fac_rec_ag:    number;
    val_fac_rec_cu:    number;
    val_fac_rec_pb:    number;
    val_fac_rec_zn:    number;
    val_fac_rec_au:    number;
    val_des_tipo_fac:  string;
}

export interface PlanningData {
    cierre_periodo:                   AperPeriodo[];
    factorOperativo:              MaeValOperativo[];
    canchas:                        MaeValCanchas[];
    sobredisolucion:     MaeFactorSobredisolucion[];
    recuperacionBudget:     MaeFactorRecuperacion[];
    factor:                             MaeFactor[];
    operativo_detalle:     MaeValOperativoDetalle[];
}

export interface PlanningResponse {
    success: boolean;
    data: PlanningData;
}





