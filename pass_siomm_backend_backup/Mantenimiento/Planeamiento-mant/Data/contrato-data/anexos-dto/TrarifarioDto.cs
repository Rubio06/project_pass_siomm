namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class TarifarioTransporteDetalleDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_item_ruta { get; set; }
        public string? cod_ruta_origen { get; set; }
        public string? cod_ruta_destino { get; set; }
        public string? cod_zona { get; set; }
        public decimal? nro_factor_viajepeso { get; set; }
        public decimal? nro_distancia_km { get; set; }
        public decimal? imp_tmh_km_soles { get; set; }
        public decimal? imp_ruta_pu { get; set; }
        public string? flg_vigencia { get; set; }
        public string? ind_material { get; set; }
        public string? cto_cod { get; set; }
        public string? cta_cod { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; } // Anulable por si no se ha modificado
        public string? cod_ruta_intermedia { get; set; }
        public string? c_t_zona { get; set; } // Viene del JOIN
        public string? ind_balanza_desmonte { get; set; }
        public string? c_t_origen { get; set; } // Viene del JOIN
        public string? c_t_destino { get; set; } // Viene del JOIN
        public string? ind_mov_sap { get; set; }
        public string c_t_intermedio { get; set; }
    }

    public class EntradaTarifarioDetalleDto
    {

        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_contrato { get; set; }

        public string? ind_material { get; set; }
        public int pagina { get; set; }
        public int cantidad_reg { get; set; }

    }

    public class EntradaTarifarioDetalleImprimrDto
    {

        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_contrato { get; set; }

        public string? ind_material { get; set; }
    }

    // 1. DTO para Rutas de Transporte
    public class RutaTransporteDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_ruta { get; set; }
        public string? des_ruta { get; set; }
        public string? des_ruta_abrev { get; set; }
        public string? cod_zona { get; set; }
        public string? flg_vigente { get; set; }
        public string? c_t_zona { get; set; } // Viene del LEFT JOIN
    }

    // 2. DTO para Centros de Costo
    public class CentroCostoDto
    {
        public string? cto_cod { get; set; }
        public string? cto_des { get; set; }
        public string? cto_vig { get; set; }
        public string? cto_eqp { get; set; }
        public string? cto_tra { get; set; }
        public string? cto_tip { get; set; }
        public string? exp_flg { get; set; }
    }

    // 3. DTO para Cuentas Contables
    public class CuentaContableDto
    {
        public string? cta_cod { get; set; }
        public string? cta_des { get; set; }
        public string? cta_vig { get; set; }
    }


    public class TarifarioTransporteMaterialDto
    {
        // Llaves y campos relacionales principales
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_item_ruta { get; set; } = string.Empty;
        public string cod_tabla { get; set; } = string.Empty;
        public string cod_item { get; set; } = string.Empty;

        // Indicadores y Estados
        public string ind_balanza_desmonte { get; set; } = string.Empty;
        public string flg_vigente { get; set; } = string.Empty;

        // Auditoría de Creación y Modificación
        public string cod_usuario_creo { get; set; } = string.Empty;
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; } = string.Empty;
        public DateTime? fec_usuario_modi { get; set; }

        // ==========================================================================
        // CAMPOS CALCULADOS (Provenientes de los LEFT JOINs en el SP)
        // ==========================================================================
        public string c_t_zona { get; set; } = string.Empty;
        public string c_t_origen { get; set; } = string.Empty;
        public string c_t_destino { get; set; } = string.Empty;
    }

    public class EntradaTarifarioMaterialDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }

        public string cod_contrato { get; set; }

    }

    public class ListarTarifarioDto
    {
        // Llaves primarias y campos de identidad
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_item_ruta { get; set; } = string.Empty;

        // Rutas del tarifario
        public string cod_ruta_origen { get; set; } = string.Empty;
        public string cod_ruta_destino { get; set; } = string.Empty;
        public string cod_ruta_intermedia { get; set; } = string.Empty;

        // Indicadores y métricas operativas
        public decimal imp_ruta_pu { get; set; }
        public string ind_material { get; set; } = string.Empty;
        public decimal imp_tmh_km_soles { get; set; }
        public decimal nro_distancia_km { get; set; }
        public decimal nro_factor_viajepeso { get; set; }
        public string flg_vigencia { get; set; } = string.Empty;

        // Ubicaciones y Contabilidad
        public string cod_zona { get; set; } = string.Empty;
        public string cta_cod { get; set; } = string.Empty;
        public string cto_cod { get; set; } = string.Empty;

        // ==========================================================================
        // PROPIEDADES DE NAVEGACIÓN (Mapeadas desde los LEFT JOINs de la consulta)
        // ==========================================================================
        public string c_t_zona { get; set; } = string.Empty;
        public string c_t_origen { get; set; } = string.Empty;
        public string c_t_destino { get; set; } = string.Empty;
    }

    public class SvalMaeTablaDetalleDto
    {
        public string cod_tabla { get; set; } = string.Empty;
        public string cod_item { get; set; } = string.Empty;
        public string des_tabladet { get; set; } = string.Empty;
        public string flg_vigencia { get; set; } = string.Empty;
        public string des_tabladet_abrev { get; set; } = string.Empty;
    }

    public class EntradaTablaDto
    {
        //[FromQuery] string cod_empresa, [FromQuery] string cod_empresa_unidad, [FromQuery] string cod_tabla

        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_tabla { get; set; }

    }


    public class SvalDetTarifarioEquiposAlquilerDto
    {
        // Llaves y campos relacionales primarios
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_equipo { get; set; } = string.Empty;

        // Tarifas y turnos
        public decimal imp_alquiler_hora { get; set; }
        public string ind_turno_trabajo { get; set; } = string.Empty;
        public string flg_vigencia { get; set; } = string.Empty;

        // Unidad de medida (Maestro detalle)
        public string cod_tabla_unimed { get; set; } = string.Empty;
        public string cod_item_unimed { get; set; } = string.Empty;

        // Campos de auditoría
        public string cod_usuario_creo { get; set; } = string.Empty;
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; } = string.Empty;
        public DateTime? fec_usuario_modi { get; set; }

        // ==========================================================================
        // PROPIEDAD DE NAVEGACIÓN (LEFT JOIN)
        // ==========================================================================
        public string c_t_equipo { get; set; } = string.Empty;
    }

    public class SvalMaeEquipoDto
    {
        public string cod_equipo { get; set; } = string.Empty;
        public string des_equipo { get; set; } = string.Empty;
        public string des_equipo_abrev { get; set; } = string.Empty;
        public string flg_vigente { get; set; } = string.Empty;
    }

    public class SvalTablaDetalleDto
    {
        public string cod_tabla { get; set; } = string.Empty;
        public string cod_item { get; set; } = string.Empty;
        public string des_tabladet { get; set; } = string.Empty;
        public string flg_vigencia { get; set; } = string.Empty;
        public string des_tabladet_abrev { get; set; } = string.Empty;

    }


    public class PaginacionTarifarioDetalleDto
    {

        public int totalRegistros { get; set; }

        public int paginaActual { get; set; }

        public int cantidadReg { get; set; }

        public int totalPaginas { get; set; }

        public List<TarifarioTransporteDetalleDto> data { get; set; }
    }

    public class ReporteTransporteOtrosResponse
    {
        public List<TarifarioTransporteDetalleDto> rutasActivas { get; set; } = new();
        public List<TarifarioTransporteDetalleDto> rutasInactivas { get; set; } = new();
    }


}
