using NPOI.OpenXmlFormats.Spreadsheet;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{

    public class EliminarTarifarioTransporteDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
        public string cod_item_ruta { get; set; }
        public string ind_material { get; set; }
    }

    public class EliminarTarifarioTransporteMaterialDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
        public string cod_item_ruta { get; set; }
        public string cod_tabla { get; set; }
        public string cod_item { get; set; }
        public string ind_balanza_desmonte { get; set; }


    }

    public class EliminarTarifarioEquiposAlquilerDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
        public string cod_equipo { get; set; }
        public string cod_tabla_unimed { get; set; }
        public string cod_item_unimed { get; set; }
        public string ind_turno_trabajo { get; set; }


    }

    public class RespuestaTarifarioDto
    {
        public int estado { get; set; }
        public string mensaje { get; set; }
    }

    public class TarifarioDetalleDto
    {
        public bool? esNuevo { get; set; }
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
        public string cod_item_ruta { get; set; }
        public string cod_ruta_origen { get; set; }
        public string cod_ruta_intermedia { get; set; }
        public string cod_ruta_destino { get; set; }
        public decimal nro_distancia_km { get; set; }
        public decimal imp_tmh_km_soles { get; set; }
        public decimal imp_ruta_pu { get; set; }
        public string accion { get; set; }
        public string cod_zona { get; set; }
        public string cto_cod { get; set; }
        public string cta_cod { get; set; }
        public string flg_vigencia { get; set; }
        public string ind_mov_sap { get; set; }
        public string ind_material { get; set; }
        public string? cod_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
    }


    public class RutasFijasBalanzaModel
    {
        public string? accion { get; set; } // "I" o "U"
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrato { get; set; }
        public string? cod_item_ruta { get; set; }

        public string? c_t_destino { get; set; }
        public string? c_t_origen { get; set; }
        public string? c_t_zona { get; set; }
        public string? cod_tabla { get; set; }
        public string? cod_item { get; set; }
        public string? ind_balanza_desmonte { get; set; }
        public string? flg_vigente { get; set; }
        public string? cod_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
    }

    public class TarifarioAlquilerEquiposModel
    {
        public string accion { get; set; } // 'I' para Insertar, 'U' para Actualizar
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
        public string cod_equipo { get; set; }
        public string cod_tabla_unimed { get; set; }
        public string cod_item_unimed { get; set; }
        public decimal imp_alquiler_hora { get; set; }
        public string ind_turno_trabajo { get; set; } // 'D', 'N', etc.
        public string flg_vigencia { get; set; } // '1' o '0'
        public string? cod_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public decimal imp_alquiler_hora_dolar { get; set; }
    }

    public class ProcesarResult
    {
        public int estado { get; set; }
        public string mensaje { get; set; }
    }
}
