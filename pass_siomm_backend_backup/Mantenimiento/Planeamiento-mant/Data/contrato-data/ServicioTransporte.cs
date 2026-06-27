namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{


    public class ServicioTranporteRequestDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
    }

    // DTO secundario para el Result Set 2 (Parámetros del contrato)
    public class ContratoParametroDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_parametro_contrato { get; set; }
        public string? cod_moneda { get; set; }
        public decimal? imp_porcentaje { get; set; }
        public decimal? imp_monto { get; set; }
        public string? des_observacion { get; set; }
        public string? flg_vigente { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string? c_t_anexo { get; set; } // Alias C_T_ANEXO del SP
        public string? cod_valor { get; set; }
        public string? cod_tabla_anexo { get; set; }
        public string? cod_item_anexo { get; set; }
    }

    // DTO secundario para el Result Set 3 (Mediciones del contrato)
    public class ContratoMedicionDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_parametro_medicion { get; set; }
        public string? cod_tabla_um_pv { get; set; }
        public string? cod_item_um_pv { get; set; }
        public string? cod_tabla_um_ap { get; set; }
        public string? cod_item_um_ap { get; set; }
        public decimal? nro_potencia_veta_1 { get; set; }
        public decimal? nro_potencia_veta_2 { get; set; }
        public decimal? nro_ancho_pago_1 { get; set; }
        public string? cod_valor_ap { get; set; }
        public string? cod_valor_pv { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string? c_t_pv { get; set; }
        public string? c_t_ap { get; set; }
    }

    // 👑 DTO Principal Unificado que hereda/contiene todo
    public class ContratoDetalleResponseDto
    {
        // Datos de la Cabecera (Result Set 1)
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_contrata { get; set; }
        public DateTime? fec_registro { get; set; }
        public DateTime? fec_inicio { get; set; }
        public DateTime? fec_termino { get; set; }
        public string? des_contacto_contrata { get; set; }
        public decimal? imp_tipo_cambio { get; set; }
        public string? nro_adendum { get; set; }
        public string? des_observacion { get; set; }
        public string? ind_situacion { get; set; }
        public string? ind_estado { get; set; }
        public int? flg_vigente { get; set; }
        public DateTime? fec_firma { get; set; }
        public string? ind_tipo_contrato { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string? ind_moneda { get; set; }
        public string? ind_tipocambio { get; set; }
        public string? ind_valorizacion { get; set; }
        public string? c_t_ruc { get; set; }
        public string? c_t_representante { get; set; }

        // 📥 Listas hijas inicializadas listas para el mapeo secuencial
        public List<ContratoParametroDto> parametros { get; set; } = new();
        public List<ContratoMedicionDto> mediciones { get; set; } = new();

        public List<ContratoEquipoPesadoDto> equipos { get; set; } = new();

    }

    public class ContratoEquipoPesadoDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_equipo_pesado { get; set; }
        public string? ind_moneda { get; set; }
        public string? ind_tarifa { get; set; }
        public decimal? imp_alquiler_equipo { get; set; }
        public string? flg_vigencia { get; set; }
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
    }

    public class MaeContrataAdmDto
    {
        public string cod_empresa { get; set; }
        public string cod_contrata { get; set; }
        public string des_contrata { get; set; }
        public string ruc_contrata { get; set; }
        public string nro_telefono { get; set; }
        public string nro_fax { get; set; }
        public string rep_nombre { get; set; }
        public DateTime? fec_ingreso { get; set; }
        public DateTime? fec_cese { get; set; }
        public string eml_correo { get; set; }
        public string ind_tipo_contrata { get; set; }
        public string est_contrata { get; set; }
    }


    public class EquipoContrataDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_contrata { get; set; }
        public string? cod_equipo { get; set; }
        public string? cod_equipo_tabla { get; set; }
        public string? des_equipo_contrata { get; set; }
        public string? des_marca { get; set; }
        public string? cod_tabla_marca { get; set; }
        public string? cod_item_marca { get; set; }
        public string? des_placa { get; set; }
        public string? des_cod_equipo { get; set; }
        public decimal? nro_capacidad_tm { get; set; }
        public decimal? nro_tara_tm { get; set; }
        public string? des_ano_fabrica { get; set; }
        public string? flg_vigente { get; set; }
    }

    public class EquiposContrataRequestDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrata { get; set; }
    }


    public class ParametroContratoDto
    {
        public string cod_parametro_contrato { get; set; } = string.Empty;
        public string des_parametro_contrato { get; set; } = string.Empty;
        public int? nro_orden { get; set; }
        public string? cod_operador { get; set; }
        public string? cod_valor { get; set; }
        public string? des_observacion { get; set; }
        public string? flg_vigente { get; set; }
        public string? cod_anexo { get; set; }
        public string? ind_obligatorio { get; set; }
    }


    public class TablaDetalleDto
    {
        public string cod_tabla { get; set; } = string.Empty;
        public string cod_item { get; set; } = string.Empty;
        public string des_tabladet { get; set; } = string.Empty;
        public string? flg_vigencia { get; set; }
        public string? des_tabladet_abrev { get; set; }
    }


    public class ParametroMedicionDto
    {
        public string cod_parametro_medicion { get; set; } = string.Empty;
        public string des_potencia_veta { get; set; } = string.Empty;
        public string des_ancho_pago { get; set; } = string.Empty;
        public string? cod_valor_pv { get; set; }
        public string? cod_valor_ap { get; set; }

        public string? flg_vigente { get; set; }

        public string? ind_obligatorio { get; set; }
    }


    public class GastosGeneralesDTO
    {
        // Campos provenientes de sval_cab_gastos_generales
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string cod_costo_fijo { get; set; } = string.Empty;
        public string cod_item_det { get; set; } = string.Empty;
        public decimal imp_costo_fijo { get; set; }
        public string flg_vigente { get; set; } = string.Empty;
        public decimal cnt_prog_mes { get; set; }
        public decimal imp_prog_mes { get; set; }
        public string cod_usuario_creo { get; set; } = string.Empty;
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; } = string.Empty;
        public DateTime? fec_usuario_modi { get; set; }
        public string ind_moneda { get; set; } = string.Empty;

        // Columnas calculadas/unidas en el SP
        public string c_t_gastos { get; set; } = string.Empty;
        public string c_t_gastos_det { get; set; } = string.Empty;
    }
    public class GastosGeneralesRequestDTO
    {
        public int estado { get; set; }
        public string mensaje { get; set; }

    }

    public class CostosFijosMaeDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_costo_fijo { get; set; }
        public string des_costo_fijo { get; set; }
        public string ind_calculo { get; set; }
        public string des_tabla { get; set; }
        public string flg_vigente { get; set; }
        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
    }

    public class CostosFijosDetalleDto
    {
        // --- CAMPOS PROPIOS DE LA TABLA SVAL_DET_COSTOS_FIJOS ---
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_costo_fijo { get; set; }
        public string cod_item_det { get; set; }
        public string des_detalle_costo { get; set; }
        public string cod_cargo { get; set; }
        public string flg_vigente { get; set; }

        // --- CAMPOS ADICIONALES GENERADOS POR EL SP (JOINS) ---
        public string c_t_gastos { get; set; }
        public string c_t_gastos_det { get; set; }
        public string c_fl { get; set; }
    }

    public class RespuestCostoFijoDto
    {
        public int estado { get; set; }      // Ejemplo: 200 para éxito, 404 para no encontrado, 500 para error
        public string mensaje { get; set; }  // El texto descriptivo para el usuario o frontend
    }

    public class EntradaCostoFijoDto 
    {
    
        public string cod_empresa { get; set; }      // Ejemplo: 200 para éxito, 404 para no encontrado, 500 para error
        public string cod_empresa_unidad { get; set; }      // Ejemplo: 200 para éxito, 404 para no encontrado, 500 para error
        public string cod_contrato { get; set; }      // Ejemplo: 200 para éxito, 404 para no encontrado, 500 para error

        public string cod_costo_fijo { get; set; }      // Ejemplo: 200 para éxito, 404 para no encontrado, 500 para error

        public string cod_item_det { get; set; }      // Ejemplo: 200 para éxito, 404 para no encontrado, 500 para error

    }
}



