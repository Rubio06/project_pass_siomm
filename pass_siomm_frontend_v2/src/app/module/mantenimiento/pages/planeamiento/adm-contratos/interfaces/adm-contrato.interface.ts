
// export interface AdmContrato {

//     cod_empresa?: string;

//     cod_empresa_unidad?: string;

//     cod_contrato?: string;

//     cod_contrata?: string;

//     fec_registro?: Date | string;

//     fec_firma?: Date | string;

//     fec_inicio?: Date | string;

//     fec_termino?: Date | string;

//     des_contacto_contrata?: string;

//     imp_tipo_cambio?: number;

//     nro_adendum?: number;

//     des_observacion?: string;

//     ind_situacion?: string;

//     ind_estado?: string;

//     ind_tipo_contrato?: string;

//     flg_vigente?: number;

//     cod_usuario_creo?: string;

//     fec_usuario_creo?: Date | string;

//     c_n_dias_curso?: number;

//     c_n_dias_contrato?: number;

//     c_t_ruc?: string;

//     c_t_contrata?: string;

//     c_t_equipo_alq?: string;
// }

export interface EntradaEliminarParametro {

    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_parametro_contrato: string;
}

export interface ContratoParametro {
    cod_empresa?: string;
    cod_empresa_unidad?: string;
    cod_contrato?: string;
    cod_parametro_contrato?: string;
    cod_moneda?: string;
    imp_porcentaje?: number;
    imp_monto?: number;
    des_observacion?: string;
    flg_vigente?: string;
    c_t_anexo?: string;
    cod_valor?: string;
    cod_tabla_anexo?: string;
    cod_usuario_modi?: string | null;
    cod_usuario_creo?: string | null;
    cod_item_anexo?: string;
}

export interface ContratoMedicion {
    cod_empresa?: string;
    cod_empresa_unidad?: string;
    cod_contrato?: string;
    cod_parametro_medicion?: string;
    cod_tabla_um_pv?: string;
    cod_item_um_pv?: string;
    cod_tabla_um_ap?: string;
    cod_item_um_ap?: string;
    nro_potencia_veta_1?: number;
    nro_potencia_veta_2?: number;
    nro_ancho_pago_1?: number;
    cod_valor_ap?: string;
    cod_valor_pv?: string;
    c_t_pv?: string;
    c_t_ap?: string;
}

export interface ContratoDetalleResponse {
    // Cabecera
    cod_empresa?: string;

    cod_empresa_unidad?: string;

    cod_contrato?: string;

    cod_contrata?: string;

    fec_registro?: Date | string;

    fec_firma?: Date | string;

    fec_inicio?: Date | string;

    fec_termino?: Date | string;

    des_contacto_contrata?: string;

    imp_tipo_cambio?: number;

    nro_adendum?: number;

    des_observacion?: string;

    ind_situacion?: string;

    ind_estado?: string;

    ind_tipo_contrato?: string;

    flg_vigente?: number;

    cod_usuario_creo?: string;

    fec_usuario_creo?: Date | string;

    c_n_dias_curso?: number;

    c_n_dias_contrato?: number;

    c_t_ruc?: string;

    c_t_contrata?: string;

    c_t_equipo_alq?: string;
    fec_usuario_modi: Date;
    // Listas hijas
    parametros: ContratoParametro[];
    mediciones: ContratoMedicion[];
    equipos: ContratoEquipoPesado[];
}

export interface FiltrosAdmContrato {
    cod_contrata: string;
    cod_contrato: string;
    ind_estado: string;
    fec_all: string;
    fec_registro: string;
    fec_inicio: string | null;
    fec_termino: string | null;
    dia_all: string;
    dia_ini: string;
    dia_fin: string;
}

export interface ServicoTransporte {
    cod_empresa?: string;
    cod_empresa_unidad?: string;
    cod_contrato?: string;
    cod_contrata?: string;
    fec_registro?: Date;
    fec_inicio?: Date;
    fec_termino?: Date;
    des_contacto_contrata?: string;
    imp_tipo_cambio?: number;
    nro_adendum?: string;
    des_observacion?: string;
    ind_situacion?: string;
    ind_estado?: string;
    flg_vigente?: number;
    fec_firma?: Date;
    ind_tipo_contrato?: string;
    cod_usuario_creo?: string;
    fec_usuario_creo?: Date;
    cod_usuario_modi?: string;
    fec_usuario_modi?: Date;
    ind_moneda?: string;
    ind_tipocambio?: string;
    ind_valorizacion?: string;
    c_t_ruc?: string;
    c_t_representante?: string;
}

export interface ContratoEquipoPesado {
    cod_empresa?: string | null;
    cod_empresa_unidad?: string | null;
    cod_contrato?: string | null;
    cod_equipo_pesado?: string | null;
    ind_moneda?: string | null;
    ind_tarifa?: string | null;
    imp_alquiler_equipo?: number | null;
    flg_vigencia?: string | null;
    cod_usuario_creo?: string | null;
    fec_usuario_creo?: string | null;
    cod_usuario_modi?: string | null;
    fec_usuario_modi?: string | null;
}

export interface ServicioTransporteEntrada {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
}

export interface RespuestaCodigo {
    estado: number;
    codigoGenerado: string;
    mensaje: string;
}

export interface EliminarContratoRequest {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
}

export interface AprobarContratoRequest {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    ind_estado: string; 
    cod_usuario_modi: string; 
}

// Interfaz para la respuesta estandarizada que devuelve tu API en .NET
export interface GenericResponseDTO {
    estado: number;
    mensaje: string;
}


