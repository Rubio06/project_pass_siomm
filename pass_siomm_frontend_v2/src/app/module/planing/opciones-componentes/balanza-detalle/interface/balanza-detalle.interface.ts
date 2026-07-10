import { BotonesInterface } from "../../programa-mensual-labores/interface";

// Entrada
export interface EntradaTicketBalanza {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cie_ano?: string | null;
    cie_per?: string | null;
    cie_dia?: string | null;
    pagina: number;
    registros_por_pagina: number;
}

// Cada ticket
export interface TicketBalanzaDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_ticket_balanza: string;
    fec_pesaje?: Date;
    cod_turno?: string;
    contrata?: string;
    fec_emision?: Date;
    des_placa?: string;
    des_cod_equipo?: string;
    cod_tipo_material?: string;
    num_cantidad_carros?: number;
    num_peso_neto_tmh?: number;
    est_ticket_balanza?: string;
    des_guia_remitente?: string;
    cod_tipo_material_detalle?: string;
    cod_zona?: string;
    ruta_origen?: string;
    ruta_destino?: string;
    fec_peso_entrada?: string;
    num_peso_entrada_tmh?: number;
    fec_peso_salida?: string;
    num_peso_salida_tmh?: number;
    cod_item_ruta?: string;
    cod_ruta_origen?: string;
    cod_ruta_destino?: string;
    cod_proveedor?: string;
    cod_personal?: string;
    cod_tipo_car?: string;
    cod_contrato?: string;
    cod_tipo_car_equipo?: string;
    cod_proced_blza?: string;
    cod_labor?: string;
    nom_labor?: string;
    cod_tipo_labor?: string;
    cod_ala?: string;
    des_chofer?: string;
    des_tipo_transporte?: string;
    des_proced_blza?: string;
    as_check?: string;
}

// Respuesta
export interface RespuestaTicketBalanza {
    total_registros: number;
    data: TicketBalanzaDto[];
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

export interface EntradaTipoDetalle {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_tipo_material: string;
}

export interface TipoDetalleMaterial {
    cod_tipo_material_detalle: string;
    des_tipo_material_det: string;
}


// BOTOENES GENERALES

export const BOTONES_BALANZA_DETALLE: BotonesInterface[] = [
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

]
