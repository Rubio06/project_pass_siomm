namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{


    public class ActividadTareaMantDto
    {
        public string cod_actividad { get; set; } = string.Empty;
        public string des_actividad { get; set; } = string.Empty;
        public string des_actividad_abrev { get; set; } = string.Empty;
        public string flg_vigente { get; set; } = string.Empty;
        public string cod_usuario_creo { get; set; } = string.Empty;
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; } = string.Empty;
        public DateTime? fec_usuario_modi { get; set; }
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
    }


    public class CatalogoTareaDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public string des_catalogo_tarea { get; set; } = string.Empty;
        public string des_catalogotarea_abrev { get; set; } = string.Empty;
        public string ind_tipo_tarea { get; set; } = string.Empty;
        public string cod_item_unimed { get; set; } = string.Empty;
        public string cod_tabla_unimed { get; set; } = string.Empty;
        public string flg_vigente { get; set; } = string.Empty;
        public string cod_usuario_creo { get; set; } = string.Empty;
        public DateTime? fec_usuario_creo { get; set; }
        public string c_fl { get; set; } = "N";
        public string cod_catalogo { get; set; } = string.Empty;
        public string c_t_actividad { get; set; } = string.Empty;
        public string cod_metexp { get; set; } = string.Empty;
        public decimal? nro_anchopago_1 { get; set; }
        public decimal? nro_anchopago_2 { get; set; }
        public string cod_seccion_labor { get; set; } = string.Empty;
        public string cod_avance_chimenea { get; set; } = string.Empty;
        public string cod_desquinche_perforacion { get; set; } = string.Empty;
    }

    public class EntradaActividadTareaMantDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_actividad { get; set; } = string.Empty;
        public string des_catalogo_tarea { get; set; } = string.Empty;
    }

    public class PartidaPuDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public string nro_partida { get; set; } = string.Empty;
        public string des_catalogo_tarea { get; set; } = string.Empty;
        public decimal? imp_costo_directo { get; set; }
        public decimal? imp_gastos_parametros { get; set; }
        public decimal? imp_costo_partida { get; set; }
        public decimal? imp_costo_partida_dolar { get; set; }
        public string flg_vigente { get; set; } = string.Empty;
        public string cod_tabla_unimed { get; set; } = string.Empty;
        public decimal? imp_valor_calculo { get; set; }
        public string cod_item_unimed { get; set; } = string.Empty;
        public string cod_usuario_modi { get; set; } = string.Empty;
        public DateTime? fec_usuario_creo { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string cod_usuario_creo { get; set; } = string.Empty;

        // Campos Calculados y Pivoteados
        public decimal? tipo_cambio { get; set; }
        public decimal? altura_labor { get; set; }
        public decimal? ancho_labor { get; set; }
        public string equipo { get; set; } = string.Empty;
        public string ind_tipo_tarea { get; set; } = string.Empty;
        public string codigo_precio { get; set; } = string.Empty;
        public string um_pago { get; set; } = string.Empty;

        // Campos Operacionales Adicionales
        public string ind_estado { get; set; } = string.Empty;
        public string ind_situacion { get; set; } = string.Empty;
        public string ind_zona { get; set; } = string.Empty;
        public string cod_metexp { get; set; } = string.Empty;
        public decimal? nro_anchopago_1 { get; set; }
        public decimal? nro_anchopago_2 { get; set; }
        public string cod_seccion_labor { get; set; } = string.Empty;
        public string cod_avance_chimenea { get; set; } = string.Empty;
        public string cod_desquinche_perforacion { get; set; } = string.Empty;
    }

    public class EntradaPartidasPuDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
    }


    public class PartidaPuInsertDto
    {
        // Datos Clave / Contexto Operativo
        public string cod_empresa { get; set; } = string.Empty;       // VARCHAR(2)
        public string cod_empresa_unidad { get; set; } = string.Empty;// VARCHAR(2)
        public string cod_contrato { get; set; } = string.Empty;      // VARCHAR(8)
        public string cod_catalogo_tarea { get; set; } = string.Empty;// VARCHAR(3)
        public string cod_actividad { get; set; } = string.Empty;     // VARCHAR(3)
        public string? nro_partida { get; set; } = string.Empty;       // VARCHAR(10)

        // Maestros y Descripciones
        public string? cod_tabla_unimed { get; set; }                 // VARCHAR(3)
        public string? cod_item_unimed { get; set; }                  // VARCHAR(3)
        public string? cod_desquinche_perforacion { get; set; }       // VARCHAR(3)
        public string des_catalogo_tarea { get; set; } = string.Empty;// VARCHAR(160)

        // Valores Monetarios e Indicadores de Medición (DECIMAL 18,3)
        public decimal? imp_valor_calculo { get; set; }
        public decimal? imp_costo_directo { get; set; }
        public decimal? imp_gastos_parametros { get; set; }
        public decimal? imp_costo_partida { get; set; }
        public decimal? imp_costo_partida_dolar { get; set; }

        // Parámetros de Control y Observaciones
        public string? ind_tipo_tarea { get; set; }                  // VARCHAR(1)
        public string? des_observacion { get; set; }                  // VARCHAR(250)
        public string? cod_metexp { get; set; }                       // VARCHAR(3)
        public decimal? nro_anchopago_1 { get; set; }
        public decimal? nro_anchopago_2 { get; set; }
        public string? cod_seccion_labor { get; set; }                // VARCHAR(3)
        public string? cod_avance_chimenea { get; set; }              // VARCHAR(3)

        // Flags de Configuración de Estado
        public string ind_estado { get; set; } = "A";                 // VARCHAR(1)
        public string ind_situacion { get; set; } = "0";              // VARCHAR(1)
        public string ind_zona { get; set; } = "0";                   // VARCHAR(1)
        public string? cod_zona { get; set; }                         // VARCHAR(10)
        public string flg_vigente { get; set; } = "1";                // VARCHAR(1)

        // Auditoría de Control de Usuarios
        public string? cod_usuario_creo { get; set; }                 // VARCHAR(20)
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }                 // VARCHAR(20)
        public DateTime? fec_usuario_modi { get; set; }
    }

    public class RespuestaSpDto
    {
        public int cod_error { get; set; }
        public string des_mensaje { get; set; } = string.Empty;
        public object? id_generado { get; set; }
    }


    public class PartidaPuListarDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public string nro_partida { get; set; } = string.Empty;
        public string des_catalogo_tarea { get; set; } = string.Empty;
        public string des_tabladet_abrev { get; set; }
        public decimal? imp_costo_directo { get; set; }
        public decimal? imp_gastos_parametros { get; set; }
        public decimal? imp_costo_partida { get; set; }
        public decimal? imp_costo_partida_dolar { get; set; }

        public string flg_vigente { get; set; } = "1";
        public string? cod_tabla_unimed { get; set; }
        public decimal? imp_valor_calculo { get; set; }
        public string? cod_item_unimed { get; set; }

        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string? cod_usuario_creo { get; set; }

        // Columnas calculadas y cruzadas (Joins)
        public decimal? tipo_cambio { get; set; }
        public decimal? altura_labor { get; set; }
        public decimal? ancho_labor { get; set; }
        public string? equipo { get; set; }

        public string? ind_tipo_tarea { get; set; }
        public string codigo_precio { get; set; } = string.Empty;
        public string? um_pago { get; set; }

        public string ind_estado { get; set; } = "A";
        public string ind_situacion { get; set; } = "0";
        public string ind_zona { get; set; } = "0";
        public string? cod_metexp { get; set; }
        public decimal? nro_anchopago_1 { get; set; }
        public decimal? nro_anchopago_2 { get; set; }
        public string? cod_seccion_labor { get; set; }
        public string? cod_avance_chimenea { get; set; }
        public string? cod_desquinche_perforacion { get; set; }
    }

    public class MaeTablaDetalleDto
    {
        public string cod_tabla { get; set; } = string.Empty;
        public string cod_item { get; set; } = string.Empty;
        public string des_tabladet { get; set; } = string.Empty;
        public string flg_vigencia { get; set; } = string.Empty;
        public string des_tabladet_abrev { get; set; } = string.Empty;
    }


    public class EliminarRespuestaDto
    {
        public int estado { get; set; }
        public string mensaje { get; set; } = string.Empty;
    }

    public class EntradaEliminarPrecioUnitario
    {
        //public string cod_empreesa { get; set; }
        //public string cod_empreesa_unidad { get; set; }
        //public string cod_contrato { get; set; }
        //public string cod_catalogo_tarea { get; set; }
        //public string cod_actividad { get; set; }
        public string nro_partida { get; set; }


    }


    // DTOs
    public class DetPartidaPuCabeceraDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public string? cod_tabla_unimed { get; set; }
        public string? cod_item_unimed { get; set; }
        public int nro_partida { get; set; } // Cambiado a int para concordar con la PK numérica
        public string? des_catalogo_tarea { get; set; }
        public decimal? imp_costo_directo { get; set; }
        public decimal? imp_gastos_parametros { get; set; }
        public decimal? imp_costo_partida { get; set; }
        public decimal? imp_costo_partida_dolar { get; set; }
        public string? flg_vigente { get; set; }
        public string? cod_usuario_creo { get; set; }
        public string? des_observacion { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public decimal? imp_valor_calculo { get; set; }
        public string? ind_estado { get; set; }
        public string? ind_situacion { get; set; }
        public string? ind_zona { get; set; }
        public string? cod_zona { get; set; }
        public string? cod_metexp { get; set; }
        public decimal? nro_anchopago_1 { get; set; } // Mapeado con su respectivo guion bajo numérico
        public decimal? nro_anchopago_2 { get; set; } // Mapeado con su respectivo guion bajo numérico
        public string? cod_seccion_labor { get; set; }
        public int? cod_avance_chimenea { get; set; } // Cambiado a int? por compatibilidad con la tabla
        public string? cod_desquinche_perforacion { get; set; }
        public string? c_t_actividad { get; set; } // Nombre exacto devuelto por el LEFT JOIN del SP
        public string? c_t_unidad_medida { get; set; } // Nombre exacto devuelto por el LEFT JOIN del SP
    }

    public class DetPartidaCostosPuDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public int nro_partida { get; set; }
        public string cod_parametro_contrato { get; set; } = string.Empty;
        public decimal? nro_trabajador { get; set; }
        public decimal? nro_hotras_labor { get; set; }
        public decimal? imp_tipo_cambio { get; set; }
        public decimal? imp_precio_soles { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        // Columnas calculadas / alias de los LEFT JOINs
        public string? um_pago { get; set; }
        public string? c_t_parametro { get; set; }
        public string? c_n_valor { get; set; }
        public decimal? c_n_porcentaje { get; set; }
        public decimal? c_n_monto { get; set; }
        public decimal? imp_costo_directo { get; set; }
    }


    public class DetParametrosPartidaPuDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public int nro_partida { get; set; }
        public string cod_parametro_tarea { get; set; } = string.Empty;
        public string? cod_tabla_unimed { get; set; }
        public string? cod_item_unimed { get; set; }
        public string? cod_tabla_um_calculo { get; set; }
        public string? cod_item_um_calculo { get; set; }
        public string? des_valor_1 { get; set; }
        public string? des_valor_2 { get; set; }
        public string? des_valor_3 { get; set; }
        public decimal? nro_valor_1 { get; set; }
        public decimal? nro_valor_calculo { get; set; }
        public string? flg_vigente { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        // Columnas calculadas / alias de los LEFT JOINs
        public string? c_t_parametro { get; set; }
        public string? c_t_equipo { get; set; }
        public string? c_n_valor_1 { get; set; } // Devuelto por el CONVERT(VARCHAR)
    }


    public class DetSubpartidasPuDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public int nro_partida { get; set; }
        public string cod_subpartida { get; set; } = string.Empty;
        public string cod_concepto { get; set; } = string.Empty;
        public string? cod_tabla_unimed { get; set; }
        public string? cod_item_unimed { get; set; }
        public string? des_observacion { get; set; }
        public decimal? imp_calculo { get; set; }
        public decimal? imp_precio_soles { get; set; }
        public decimal? nro_cantidad { get; set; }
        public decimal? imp_subtotal { get; set; }
        public string? flg_vigente { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        // Columnas calculadas / alias de los LEFT JOINs
        public string? um_pago { get; set; }
        public string? c_t_subpartida { get; set; }
        public string? c_t_cargo { get; set; }
        public string? c_t_implemto_seg { get; set; }
        public string? c_t_material { get; set; }
        public string? c_t_explosivos { get; set; }
        public string? c_t_equipo { get; set; }
    }

    // Wrapper de respuesta
    public class DetallePuResultado
    {
        public DetPartidaPuCabeceraDto cabecera { get; set; }
        public List<DetPartidaCostosPuDto> costoPartida { get; set; }
        public List<DetParametrosPartidaPuDto> parametrosPrincipales { get; set; }
        public List<DetSubpartidasPuDto> subParametros { get; set; }
    }

    public class EntradaPartidaPuDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
        public string cod_actividad { get; set; }
        public string cod_catologo_tarea { get; set; }

        public string nro_partida { get; set; }
    }

    public class ZonaPuDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_zona { get; set; } = string.Empty;
        public string des_zona { get; set; } = string.Empty;
        public string? obs_zona { get; set; } // Puede ser nulo
        public decimal? nro_den { get; set; } // Puede ser nulo (ajusta a int/decimal según tu tipo en SQL)
    }

    public class ParametrosContratoDto
    {
        public string cod_parametro_contrato { get; set; } = string.Empty;
        public string des_parametro_contrato { get; set; } = string.Empty;
        public int nro_orden { get; set; }
        public string cod_operador { get; set; } = string.Empty;
        public string cod_valor { get; set; } = string.Empty;
        public string cod_anexo { get; set; } = string.Empty;
        public string des_observacion { get; set; } = string.Empty;
        public string ind_obligatorio { get; set; } = string.Empty;
        public string flg_vigente { get; set; } = string.Empty;
        public string c_fl { get; set; } = "N"; // Valor fijo devuelto por tu consulta
    }

    public class TablaDetallePuDto
    {
        public string cod_tabla { get; set; } = string.Empty;
        public string cod_item { get; set; } = string.Empty;
        public string des_tabladet { get; set; } = string.Empty;
        public string flg_vigencia { get; set; } = string.Empty;
        public string des_tabladet_abrev { get; set; } = string.Empty;
    }

    public class EliminarPartidaDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_catalogo_tarea { get; set; } = string.Empty;
        public string cod_actividad { get; set; } = string.Empty;
        public string nro_partida { get; set; } = string.Empty;
        public string cod_parametro_contrato { get; set; } = string.Empty;
    }

    public class RespuestaApiDto
    {
        public int estado { get; set; }
        public string mensaje { get; set; } = string.Empty;

    }


    // PartidaPUDto.cs
    public class PartidaPUDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_catalogo_tarea { get; set; }
        public string? cod_actividad { get; set; }
        public string? nro_partida { get; set; }


        public string? actividad_tarea_codigo { get; set; }
        public string? des_catalogo_tarea { get; set; }
        public decimal? imp_costo_directo { get; set; }
        public decimal? imp_costo_partida { get; set; }
        public decimal? imp_costo_partida_dolar { get; set; }
        public string? des_observacion { get; set; }
        public string? ind_situacion { get; set; }
        public string? ind_zona { get; set; }
        public string? ind_estado { get; set; }
        public string? cod_zona { get; set; }
        public string? cod_usuario { get; set; }
        public List<CostoPartidaDto> costoPartida { get; set; }
        public List<ParametroPrincipalDto> parametroPrincipal { get; set; }
        public List<SubParametroDto> subParametros { get; set; }
    }

    // CostoPartidaDto.cs
    public class CostoPartidaDto
    {
        public string? accion { get; set; }
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_catalogo_tarea { get; set; }
        public string? cod_actividad { get; set; }
        public string? nro_partida { get; set; }
        public string? cod_parametro_contrato { get; set; }
        public decimal? nro_trabajador { get; set; }
        public decimal? nro_hotras_labor { get; set; }
        public decimal? imp_tipo_cambio { get; set; }
        public decimal? imp_precio_soles { get; set; }
    }

    // ParametroPrincipalDto.cs
    public class ParametroPrincipalDto
    {
        public string? accion { get; set; }
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_catalogo_tarea { get; set; }
        public string? cod_actividad { get; set; }
        public string? nro_partida { get; set; }
        public string? cod_parametro_tarea { get; set; }
        public string? cod_item_unimed { get; set; }
        public string? cod_item_um_calculo { get; set; }
        public string? des_valor_1 { get; set; }
        public string? des_valor_2 { get; set; }
        public string? des_valor_3 { get; set; }
        public decimal? nro_valor_1 { get; set; }
        public decimal? nro_valor_calculo { get; set; }
    }

    // SubParametroDto.cs
    public class SubParametroDto
    {
        public string? accion { get; set; }
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_catalogo_tarea { get; set; }
        public string? cod_actividad { get; set; }
        public string? nro_partida { get; set; }
        public string? cod_subpartida { get; set; }
        public string? cod_concepto { get; set; }
        public string? cod_item_unimed { get; set; }
        public string? des_observacion { get; set; }
        public decimal? imp_precio_soles { get; set; }
        public decimal? nro_cantidad { get; set; }
        public decimal? imp_subtotal { get; set; }
    }

    public class ResultadoDatosDto
    {
        public int estado { get; set; }
        public string mensaje { get; set; }

    }
}
