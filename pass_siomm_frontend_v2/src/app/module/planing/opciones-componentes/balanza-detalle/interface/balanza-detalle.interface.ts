// Entrada
export interface EntradaTicketBalanza {
    cod_empresa:              string;
    cod_empresa_unidad:       string;
    cie_ano?:                 string | null;
    cie_per?:                 string | null;
    cie_dia?:                 string | null;
    pagina:                   number;
    registros_por_pagina:     number;
}

// Cada ticket
export interface TicketBalanzaDto {
    cod_empresa:               string;
    cod_empresa_unidad:        string;
    cod_ticket_balanza:        string;
    fec_pesaje?:               Date;
    cod_turno?:                string;
    contrata?:                 string;
    fec_emision?:              Date;
    des_placa?:                string;
    des_cod_equipo?:           string;
    cod_tipo_material?:        string;
    num_cantidad_carros?:      number;
    num_peso_neto_tmh?:        number;
    est_ticket_balanza?:       string;
    des_guia_remitente?:       string;
    cod_tipo_material_detalle?: string;
    cod_zona?:                 string;
    ruta_origen?:              string;
    ruta_destino?:             string;
    fec_peso_entrada?:         string;
    num_peso_entrada_tmh?:     number;
    fec_peso_salida?:          string;
    num_peso_salida_tmh?:      number;
    cod_item_ruta?:            string;
    cod_ruta_origen?:          string;
    cod_ruta_destino?:         string;
    cod_proveedor?:            string;
    cod_personal?:             string;
    cod_tipo_car?:             string;
    cod_contrato?:             string;
    cod_tipo_car_equipo?:      string;
    cod_proced_blza?:          string;
    cod_labor?:                string;
    nom_labor?:                string;
    cod_tipo_labor?:           string;
    cod_ala?:                  string;
    des_chofer?:               string;
    des_tipo_transporte?:      string;
    des_proced_blza?:          string;
    as_check?:                 string;
}

// Respuesta
export interface RespuestaTicketBalanza {
    total_registros: number;
    data:            TicketBalanzaDto[];
}


// detalle-ticket-balanza.model.ts

export interface DetalleTicketBalanza {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_ticket_balanza: string;
    fec_emision: string | null;
    cod_turno: string;
    des_comentario: string | null;
    cod_proveedor: string;
    cod_tipo_material: string;
    cod_tipo_material_detalle: string | null;
    cod_personal: string | null;
    cod_contrato: string;
    des_guia_remitente: string | null;
    cod_tipo_car: string;
    cod_tipo_car_equipo: string | null;
    cod_proced_blza: string | null;
    cod_item_ruta: string | null;
    cod_zona: string | null;
    num_cantidad_carros: number | null;
    fec_peso_entrada: string | null;
    num_peso_entrada_tmh: number | null;
    fec_peso_salida: string | null;
    num_peso_salida_tmh: number | null;
    num_peso_neto_tmh: number | null;
    est_ticket_balanza: string;
    cod_usuario_creo: string | null;
    fec_usuario_creo: string | null;
    cod_usuario_modi: string | null;
    fec_usuario_modi: string | null;
    cod_placa: string | null;
    ruta_origen: string | null;
    ruta_destino: string | null;
    cod_usuario_apr: string | null;
    fec_usuario_apr: string | null;
    cod_ruta_origen: string | null;
    cod_ruta_destino: string | null;
    cod_labor: string | null;
    cod_tipo_labor: string;
    cod_ala: string | null;
    des_tipo_car: string | null;
    fec_pesaje: string | null;
    ind_automatico: boolean | null;
    cod_ticket_balanza_copia: string | null;
    cod_nivel: string | null;
    cod_und_econom: string | null;
    cod_veta: string | null;
    cod_fase: string | null;
    ind_tipo_cancha: string | null;
    cod_grupo_control: string | null;
    nom_labor: string;
    cod_maquinaria: string | null;
    des_maquinaria: string | null;
}

// Payload para la consulta del detalle
export interface EntradaDetTicketBalanza {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_ticket_balanza: string;
}


export interface EntradaDatos {
    cod_empresa: string;
    cod_empresa_unidad: string;
}

export interface TurnoActivo {
    cod_turno: string;
    des_turno: string;
    hor_inicio_operacion: string;
    hor_fin_operacion: string;
} 