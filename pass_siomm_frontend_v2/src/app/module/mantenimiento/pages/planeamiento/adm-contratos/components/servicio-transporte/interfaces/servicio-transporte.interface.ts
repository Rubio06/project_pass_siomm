import { Observable } from "rxjs";

export interface MaeContrataAdmDto {
    cod_empresa: string;
    cod_contrata: string;
    des_contrata: string;
    ruc_contrata: string;
    nro_telefono: string | null;
    nro_fax: string | null;
    rep_nombre: string | null;
    fec_ingreso: string | null; // 🌟 O Date si manejas instancias de fecha directas
    fec_cese: string | null;
    eml_correo: string | null;
    ind_tipo_contrata: string;
    est_contrata: string;
}

export interface ContratoEquipoVehiculo {
    cod_empresa?: string | null;
    cod_contrata?: string | null;
    cod_equipo?: string | null;
    cod_equipo_tabla?: string | null;
    des_equipo_contrata?: string | null;
    des_marca?: string | null;
    cod_tabla_marca?: string | null;
    cod_item_marca?: string | null;
    des_placa?: string | null;
    des_cod_equipo?: string | null;
    nro_capacidad_tm?: number | null; // 🔢 decimal de C# mapea a number
    nro_tara_tm?: number | null;      // 🔢 decimal de C# mapea a number
    des_ano_fabrica?: string | null;
    flg_vigente?: string | null;
}

export interface ContratoEquipoVehiculoRequest {
    cod_empresa?: string;
    cod_empresa_unidad?: string;
    cod_contrata?: string;
}


export interface ParametroContrato {
    cod_parametro_contrato: string;
    des_parametro_contrato: string;
    nro_orden: number | null;
    cod_operador: string | null;
    cod_valor: string | null;
    des_observacion: string | null;
    flg_vigente: string | null;
    cod_anexo: string | null;
    ind_obligatorio: string | null;
}

export interface TablaDetalle {
    cod_tabla: string;
    cod_item: string;
    des_tabladet: string;
    flg_vigencia: string | null;
    des_tabladet_abrev: string | null;
}


export interface TablaDetalleRequest {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_tabla: string;
}


export interface ParametroMedicionDto {
    cod_parametro_medicion: string;
    des_potencia_veta: string;
    des_ancho_pago: string;
    cod_valor_pv: string | null;
    cod_valor_ap: string | null;
    flg_vigente: string | null;
    ind_obligatorio: string | null;
}

export interface GastosGenerales {
    // Campos provenientes de sval_cab_gastos_generales
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_costo_fijo: string;
    cod_item_det: string;
    imp_costo_fijo: number;
    flg_vigente: string;
    cnt_prog_mes: number;
    imp_prog_mes: number;
    cod_usuario_creo: string;
    fec_usuario_creo: string | Date | null; // Puede llegar como string ISO o nulo
    cod_usuario_modi: string;
    fec_usuario_modi: string | Date | null;

    // Columnas calculadas/unidas en el SP
    c_t_gastos: string;
    c_t_gastos_det: string;
    ind_moneda: string;
}

export interface GastosGeneralesRequest {
    cod_empresa?: string;
    cod_empresa_unidad?: string;
    cod_contrato?: string;
}

export interface CostosFijosMae {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_costo_fijo: string;
    des_costo_fijo: string;
    ind_calculo: string;
    des_tabla: string;
    flg_vigente: string;
    cod_usuario_creo: string;
    fec_usuario_creo: string | null;
    cod_usuario_modi: string;
    fec_usuario_modi: string | null;
}

export interface CostosFijosDetalle {
    // --- CAMPOS PROPIOS DE LA TABLA SVAL_DET_COSTOS_FIJOS ---
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_costo_fijo: string;
    cod_item_det: string;
    des_detalle_costo: string;
    cod_cargo: string;
    flg_vigente: string;

    // --- CAMPOS ADICIONALES GENERADOS POR EL SP (JOINS) ---
    c_t_gastos: string;
    c_t_gastos_det: string;
    c_fl: string;
}


export interface GastosGneralesRequest {
    estado: number;
    mensaje: string;
}

export interface GastosGeneralesInsertarDTO {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_costo_fijo: string;
    cod_item_det: string;
    ind_moneda: string;
    imp_costo_fijo: number;
    cnt_prog_mes: number;
    imp_prog_mes: number;
    flg_vigente: string;
    cod_usuario_creo: string;
}

/**
 * DTO de Entrada: Representa los datos de la fila seleccionada
 * que el Frontend debe enviar obligatoriamente al Backend.
 */
export interface EntradaCostoFijo {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_costo_fijo: string;
    cod_item_det: string;
}

/**
 * DTO de Respuesta: Representa la estructura exacta del JSON
 * que devuelve el Backend tras intentar realizar la eliminación.
 */
export interface RespuestCostoFijo {
    /**
     * Estado numérico de la operación:
     * 1 = Éxito (Eliminado correctamente)
     * 0 = No encontrado (No se borró nada)
     * -1 = Error interno en la Base de Datos
     * -2 = Error inesperado en el Servidor
     */
    estado: number;

    /** Mensaje descriptivo de la operación devuelto por el servidor */
    mensaje: string;
}

/**
 * Interfaz opcional para el tipado completo de la fila en tu tabla.
 * Mapea los campos principales que mostraste en tu consulta original.
 */
export interface CostoFijoFila {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_costo_fijo: string;
    cod_item_det: string;
    ind_moneda: string;
    imp_costo_fijo: number;
    cnt_prog_mes: number;
    imp_prog_mes: number;
    flg_vigente: number;
    cod_usuario_creo: string;
    fec_usuario_creo: string;
    cod_usuario_modi: string | null;
    fec_usuario_modi: string | null;
}


export interface EntradaTarifarioDetalle {

    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    ind_material: string;
    pagina: number;
    cantidad_reg: number;

}


export interface EntradaTarifarioDetalleReporte {

    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    ind_material: string;
}

export interface EntradaTarifarioMaterial {

    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;

}

export interface TarifarioTransporteDetalle {
    cod_empresa: string | null;
    cod_empresa_unidad: string | null;
    cod_contrato: string | null;
    cod_item_ruta: string | null;
    cod_ruta_origen: string | null;
    cod_ruta_destino: string | null;
    cod_zona: string | null;
    nro_factor_viajepeso: number | null;
    nro_distancia_km: number | null;
    imp_tmh_km_soles: number | null;
    imp_ruta_pu: number | null;
    flg_vigencia: string | null;
    ind_material: string | null;
    cto_cod: string | null;
    cta_cod: string | null;
    cod_usuario_creo: string | null;
    fec_usuario_creo: Date; // No es anulable en tu C#
    cod_usuario_modi: string | null;
    fec_usuario_modi: Date | null;
    cod_ruta_intermedia: string | null;
    c_t_zona: string | null;
    ind_balanza_desmonte: string | null;
    c_t_origen: string | null;
    c_t_destino: string | null;
    ind_mov_sap: string | null;
    transaccion: string;
}

// 1. Interfaz para Rutas de Transporte
export interface RutaTransporte {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_ruta: string;
    des_ruta: string;
    des_ruta_abrev: string;
    cod_zona: string;
    flg_vigente: string;
    c_t_zona: string; // Descripción desde el LEFT JOIN
}

// 2. Interfaz para Centros de Costo
export interface CentroCosto {
    cto_cod: string;
    cto_des: string;
    cto_vig: string;
    cto_eqp: string;
    cto_tra: string;
    cto_tip: string;
    exp_flg: string;
}

// 3. Interfaz para Cuentas Contables
export interface CuentaContable {
    cta_cod: string;
    cta_des: string;
    cta_vig: string;
}

export interface MaestrosTarifario {
    rutas: RutaTransporte[];
    centrosCosto: CentroCosto[];
    //   cuentasContables: CuentaContable[];
}



export interface DetTarifarioTransporteMaterial {
    // Llaves y campos relacionales principales
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_item_ruta: string;
    cod_tabla: string;
    cod_item: string;

    // Indicadores y Estados
    ind_balanza_desmonte: string;
    flg_vigente: string;

    // Auditoría
    cod_usuario_creo: string;
    fec_usuario_creo: string | Date | null;
    cod_usuario_modi: string;
    fec_usuario_modi: string | Date | null;
    idFilaTemporal: number;
    // Campos calculados por los LEFT JOINs del SP
    c_t_zona: string;
    c_t_origen: string;
    c_t_destino: string;
}


export interface SvalDetTarifarioTransporte {
    // Llaves primarias e identificadores
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_item_ruta: string;

    // Datos de Rutas y Operaciones
    cod_ruta_origen: string;
    cod_ruta_destino: string;
    cod_ruta_intermedia: string;

    // Métricas e Importes Numéricos
    imp_ruta_pu: number;
    ind_material: string;
    imp_tmh_km_soles: number;
    nro_distancia_km: number;
    nro_factor_viajepeso: number;
    flg_vigencia: string;

    // Contabilidad y Ubicación
    cod_zona: string;
    cta_cod: string;
    cto_cod: string;

    // Campos calculados devueltos por los LEFT JOINs de la consulta
    c_t_zona: string;
    c_t_origen: string;
    c_t_destino: string;
}

export interface SvalMaeTablaDetalle {
    cod_tabla: string;
    cod_item: string;
    des_tabladet: string;
    flg_vigencia: string;
    des_tabladet_abrev: string;
}

export interface EntradaTablaDetalle {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_tabla: string;
}


export interface SvalDetTarifarioEquiposAlquiler {
    // Llaves relacionales
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_equipo: string;

    // Métricas y Tarifas
    imp_alquiler_hora: number;
    ind_turno_trabajo: string;
    flg_vigencia: string;

    // Unidad de Medida
    cod_tabla_unimed: string;
    cod_item_unimed: string;

    // Auditoría (Soportan nulos o string/Date dependiendo de la serialización)
    cod_usuario_creo: string;
    fec_usuario_creo: string | Date | null;
    cod_usuario_modi: string;
    fec_usuario_modi: string | Date | null;

    // Campo calculado devuelto por el LEFT JOIN
    c_t_equipo: string;
}

/**
 * Interfaz exacta para el catálogo maestro de equipos vigentes.
 * Mapea la respuesta JSON proveniente de la API de .NET.
 */
export interface SvalMaeEquipo {
    cod_equipo: string;
    des_equipo: string;
    des_equipo_abrev: string;
    flg_vigente: string;
}

export interface SvalTablaDetalle {
    cod_tabla: string
    cod_item: string;
    des_tabladet: string;
    flg_vigencia: string;
    des_tabladet_abrev: string;

}

export interface PaginacionTarifarioDetalle {
    totalRegistros: number;
    paginaActual: number;
    cantidadReg: number;
    totalPaginas: number;
    data: TarifarioTransporteDetalle[];
}

//ELIMINAR TARIFARIO TRANSPORTE

export interface EliminarTarifarioTransporte {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_item_ruta: string;
    ind_material: string;
}


export interface EliminarTarifarioTransporteMaterial {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_item_ruta: string;
    cod_tabla: string;
    cod_item: string;
    ind_balanza_desmonte: string;

}

export interface EliminarTarifarioEquiposAlquiler {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_equipo: string;
    cod_tabla_unimed: string;
    cod_item_unimed: string;
    ind_turno_trabajo: string;

}


export interface RespuestaTarifario {
    estado: number;
    mensaje: string;
}


export interface RutasFijasBalanza {
    accion: 'I' | 'U';
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_item_ruta: string;
    cod_tabla: string;
    cod_item: string;
    ind_balanza_desmonte: string;
    flg_vigente: string;
    cod_usuario_creo?: string;
    cod_usuario_modi?: string;
}

export interface ProcesarResult {
    estado: number;
    mensaje: string;
}


export interface ConfigTabGuardar {
    componente: any;             // Instancia del componente hijo (Signal value)
    propiedadForm: string;       // El nombre de la variable de formulario ('miFormulario', 'form', etc.)
    metodoRecarga: string;       // Nombre del método para recargar los datos tras el éxito
    servicioMetodo: (datos: any[]) => Observable<any>; // Puntero al servicio HTTP correspondiente
}

export interface ReporteTransporteOtrosResponse {
    rutasActivas: TarifarioTransporteDetalle[];
    rutasInactivas: TarifarioTransporteDetalle[];
}

export interface ActividadTareaMant {
    cod_actividad: string;
    des_actividad: string;
    des_actividad_abrev: string;
    flg_vigente: string;
    cod_usuario_creo: string;
    fec_usuario_creo: string | Date | null; // Puede llegar como string ISO o convertirse a Date
    cod_usuario_modi: string;
    fec_usuario_modi: string | Date | null;
    cod_empresa: string;
    cod_empresa_unidad: string;
}

// BUSCAR CATALOGO TAREA

export interface CatalogoTareaFiltro {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_actividad?: string | null;       // Opcional en el formulario
    des_catalogo_tarea?: string | null;   // Opcional en el formulario
}

export interface CatalogoTarea {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    des_catalogo_tarea: string;
    des_catalogotarea_abrev: string;
    ind_tipo_tarea: string;
    cod_item_unimed: string;
    cod_tabla_unimed: string;
    flg_vigente: string;
    cod_usuario_creo: string;
    fec_usuario_creo: string | Date | null;
    c_fl: string;
    cod_catalogo: string;
    c_t_actividad: string;
    cod_metexp: string;
    nro_anchopago_1: number | null; // Mapea los decimal? de .NET
    nro_anchopago_2: number | null; // Mapea los decimal? de .NET
    cod_seccion_labor: string;
    cod_avance_chimenea: string;
    cod_desquinche_perforacion: string;
}


export interface PartidaPuInsertDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    nro_partida?: string;

    cod_tabla_unimed?: string | null;
    cod_item_unimed?: string | null;
    cod_desquinche_perforacion?: string | null;
    des_catalogo_tarea: string;

    imp_valor_calculo?: number | null;
    imp_costo_directo?: number | null;
    imp_gastos_parametros?: number | null;
    imp_costo_partida?: number | null;
    imp_costo_partida_dolar?: number | null;

    ind_tipo_tarea?: string | null;
    des_observacion?: string | null;
    cod_metexp?: string | null;
    nro_anchopago_1?: number | null;
    nro_anchopago_2?: number | null;
    cod_seccion_labor?: string | null;
    cod_avance_chimenea?: string | null;

    ind_estado: string;
    ind_situacion: string;
    ind_zona: string;
    cod_zona?: string | null;
    flg_vigente: string;
    cod_usuario_creo?: string | null;
}

export interface RespuestaSpDto {
    success: boolean;
    mensaje: string;
    idGenerado?: any;
    codigoError?: number;
}


export interface PartidaPuListarDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    nro_partida: string;
    des_catalogo_tarea: string;
    des_tabladet_abrev: string;
    // Importes y Costos
    imp_costo_directo: number | null;
    imp_gastos_parametros: number | null;
    imp_costo_partida: number | null;
    imp_costo_partida_dolar: number | null;

    flg_vigente: string;
    cod_tabla_unimed: string | null;
    imp_valor_calculo: number | null;
    cod_item_unimed: string | null;

    // Auditoría
    cod_usuario_modi: string | null;
    fec_usuario_creo: Date | string | null; // Puede mapearse como Date o string ISO
    fec_usuario_modi: Date | string | null;
    cod_usuario_creo: string | null;

    // Columnas Calculadas desde SQL Server (Joins)
    tipo_cambio: number | null;
    altura_labor: number | null;
    ancho_labor: number | null;
    equipo: string | null;

    ind_tipo_tarea: string | null;
    codigo_precio: string;
    um_pago: string | null;

    // Estados y Flags Operacionales
    ind_estado: string;
    ind_situacion: string;
    ind_zona: string;
    cod_metexp: string | null;

    // Datos Geomecánicos
    nro_anchopago_1: number | null;
    nro_anchopago_2: number | null;

    cod_seccion_labor: string | null;
    cod_avance_chimenea: string | null;
    cod_desquinche_perforacion: string | null;
}


export interface MaeTablaDetalleDto {
    cod_tabla: string;
    cod_item: string;
    des_tabladet: string;
    flg_vigencia: string;
    des_tabladet_abrev: string;
}


export interface MaeTablaDetalleRequest {
    cod_empresa: string;
    cod_empresa_unidad: string;
}


export interface EliminarRespuestaDto {
    estado: number;
    mensaje: string;
}

export interface EntradaEliminarPrecioUnitario {
    // cod_empresa: string;
    // cod_empresa_unidad: string;
    // cod_contrato: string;
    // cod_catalogo_tarea: string;
    // cod_actividad: string;
    nro_partida: string;


}



export interface DetPartidaPuCabeceraDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    cod_tabla_unimed?: string | null;
    cod_item_unimed?: string | null;
    nro_partida: number;
    des_catalogo_tarea?: string | null;
    imp_costo_directo?: number | null;
    imp_gastos_parametros?: number | null;
    imp_costo_partida?: number | null;
    imp_costo_partida_dolar?: number | null;
    flg_vigente?: string | null;
    cod_usuario_creo?: string | null;
    des_observacion?: string | null;
    fec_usuario_creo?: string | Date | null;
    cod_usuario_modi?: string | null;
    fec_usuario_modi?: string | Date | null;
    imp_valor_calculo?: number | null;
    ind_estado?: string | null;
    ind_situacion?: string | null;
    ind_zona?: string | null;
    cod_zona?: string | null;
    cod_metexp?: string | null;
    nro_anchopago_1?: number | null;
    nro_anchopago_2?: number | null;
    cod_seccion_labor?: string | null;
    cod_avance_chimenea?: number | null;
    cod_desquinche_perforacion?: string | null;
    c_t_actividad?: string | null;
    c_t_unidad_medida?: string | null;
}

export interface DetPartidaCostosPuDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    nro_partida: number;
    cod_parametro_contrato: string;
    nro_trabajador?: number | null;
    nro_horas_labor?: number | null;
    imp_tipo_cambio?: number | null;
    imp_precio_soles?: number | null;
    cod_usuario_creo?: string | null;
    fec_usuario_creo?: string | Date | null;
    cod_usuario_modi?: string | null;
    fec_usuario_modi?: string | Date | null;
    um_pago?: string | null;
    c_t_parametro?: string | null;
    c_n_valor?: string | null;
    c_n_porcentaje?: number | null;
    c_n_monto?: number | null;
    imp_costo_directo?: number | null;
    esNuevo: boolean;
}

export interface DetParametrosPartidaPuDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    nro_partida: number;
    cod_parametro_tarea: string;
    cod_tabla_unimed?: string | null;
    cod_item_unimed?: string | null;
    cod_tabla_um_calculo?: string | null;
    cod_item_um_calculo?: string | null;
    des_valor_1?: string | null;
    des_valor_2?: string | null;
    des_valor_3?: string | null;
    nro_valor_1?: number | null;
    nro_valor_calculo?: number | null;
    flg_vigente?: string | null;
    cod_usuario_creo?: string | null;
    fec_usuario_creo?: string | Date | null;
    cod_usuario_modi?: string | null;
    fec_usuario_modi?: string | Date | null;
    c_t_parametro?: string | null;
    c_t_equipo?: string | null;
    c_n_valor_1?: string | null;
}

export interface DetSubpartidasPuDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    nro_partida: number;
    cod_subpartida: string;
    cod_concepto: string;
    cod_tabla_unimed?: string | null;
    cod_item_unimed?: string | null;
    des_observacion?: string | null;
    imp_calculo?: number | null;
    imp_precio_soles?: number | null;
    nro_cantidad?: number | null;
    imp_subtotal?: number | null;
    flg_vigente?: string | null;
    cod_usuario_creo?: string | null;
    fec_usuario_creo?: string | Date | null;
    cod_usuario_modi?: string | null;
    fec_usuario_modi?: string | Date | null;
    um_pago?: string | null;
    c_t_subpartida?: string | null;
    c_t_cargo?: string | null;
    c_t_implemto_seg?: string | null;
    c_t_material?: string | null;
    c_t_explosivos?: string | null;
    c_t_equipo?: string | null;
}

// Interfaz que representa el objeto completo devuelto por el endpoint del controlador
export interface DetallePuResultado {
    cabecera?: DetPartidaPuCabeceraDto;
    costoPartida: DetPartidaCostosPuDto[];
    parametrosPrincipales: DetParametrosPartidaPuDto[];
    subParametros: DetSubpartidasPuDto[];
}

export interface EntradaPuCabTab {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_actividad: string;
    cod_catologo_tarea: string;
    nro_partida: string;
}

export interface ZonaPu {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_zona: string;
    des_zona: string;
    obs_zona?: string | null; // Nullable desde la BD
    nro_den?: number | null;  // Nullable desde la BD (decimal/numeric mapea a number)
}

export interface ParametrosContratoDto {
    cod_parametro_contrato: string;
    des_parametro_contrato: string;
    nro_orden: number;
    cod_operador: string;
    cod_valor: string;
    cod_anexo: string;
    des_observacion: string;
    ind_obligatorio: string;
    flg_vigente: string;
    bloqueado?: boolean;

    c_fl: string; // Recibe el valor 'N' enviado por el backend
    esNueva: boolean;
}


export interface TablaDetalleDto {
    cod_tabla: string;
    cod_item: string;
    des_tabladet: string;
    flg_vigencia: string;
    des_tabladet_abrev: string;
}

export interface EliminarPartidaDto {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    nro_partida: string;
    cod_parametro_contrato: string;
}

export interface RespuestaApiDto {
    estado: number;
    mensaje: string;
}


// models/partida-pu.model.ts

export interface CostoPartidaModel {
    accion: string;
    cod_parametro_contrato: string;
    c_t_parametro?: string;
    c_n_valor?: string;
    c_n_porcentaje?: number;
    c_n_monto?: number;
    imp_precio_dolar: number;
    nro_trabajador?: number;
    nro_hotras_labor?: number;
    imp_costo_directo?: number;
    imp_precio_soles?: number;
    imp_tipo_cambio?: number;

}

export interface ParametroPrincipalModel {
    accion: string;
    cod_parametro_tarea: string;
    c_t_parametro?: string;
    des_valor_1?: string;
    nro_valor_1?: number;
    des_valor_2?: string;
    c_t_equipo?: string;
    nro_valor_calculo?: number;
    cod_item_um_calculo?: string;
    des_valor_3?: string;
    cod_item_unimed?: string;
}

export interface SubParametroModel {
    accion: string;
    cod_subpartida: string;
    c_t_subpartida?: string;
    cod_item_unimed?: string;
    cod_tabla_unimed?: string;

    imp_precio_soles?: number;
    cod_concepto?: string;
    nro_cantidad?: number;
    imp_subtotal?: number;
    des_observacion?: string;
}

export interface PartidaPUModel {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_contrato?: string;
    nro_partida?: string;
    c_t_actividad?: string;
    // actividad_tarea_codigo: string;
    cod_tabla_unimed: string;
    cod_item_unimed: string;
    cod_desquinche_perforacion: string;
    cod_catalogo_tarea: string;
    cod_actividad: string;
    des_catalogo_tarea: string;
    imp_costo_directo: number;
    des_observacion?: string;
    ind_situacion: string;
    ind_zona: string;
    ind_estado: string;
    c_t_unidad_medida?: string;
    imp_costo_partida: number;
    imp_costo_partida_dolar: number;
    imp_valor_calculo: number;
    imp_gastos_parametros: number;
    cod_zona?: string;
    cod_usuario: string;
    costoPartida: CostoPartidaModel[];
    parametroPrincipal: ParametroPrincipalModel[];
    subParametros: SubParametroModel[];
}

export interface ResultadoDatosDto {
    estado: number;
    mensaje: string;

}
