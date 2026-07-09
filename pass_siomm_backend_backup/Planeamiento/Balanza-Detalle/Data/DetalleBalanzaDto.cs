using Microsoft.Data.SqlClient;

namespace pass_siomm_backend.Planeamiento.Balanza_Detalle.Data
{
    public class EntradaTicketBalanzaDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cie_ano { get; set; }
        public string? cie_per { get; set; }
        public string? cie_dia { get; set; }
        public int pagina { get; set; } = 1;
        public int registros_por_pagina { get; set; } = 50;
    }

    public class RespuestaTicketBalanzaDto
    {
        public int total_registros { get; set; }
        public List<TicketBalanzaDto> data { get; set; } = new();
    }

    public class TicketBalanzaDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_ticket_balanza { get; set; }
        public DateTime? fec_pesaje { get; set; }
        public string cod_turno { get; set; }
        public string contrata { get; set; }
        public string des_placa { get; set; }
        public string des_cod_equipo { get; set; }
        public string cod_tipo_material { get; set; }
        public decimal? num_cantidad_carros { get; set; }
        public decimal? num_peso_neto_tmh { get; set; }
        public string est_ticket_balanza { get; set; }
        public string des_guia_remitente { get; set; }
        public string cod_tipo_material_detalle { get; set; }
        public string cod_zona { get; set; }
        public string ruta_origen { get; set; }
        public string ruta_destino { get; set; }
        public DateTime? fec_peso_entrada { get; set; }
        public decimal? num_peso_entrada_tmh { get; set; }
        public DateTime? fec_peso_salida { get; set; }
        public decimal? num_peso_salida_tmh { get; set; }
        public string cod_item_ruta { get; set; }
        public string cod_ruta_origen { get; set; }
        public string cod_ruta_destino { get; set; }
        public string cod_proveedor { get; set; }
        public string cod_personal { get; set; }
        public string cod_tipo_car { get; set; }
        public string cod_contrato { get; set; }
        public string cod_tipo_car_equipo { get; set; }
        public string cod_proced_blza { get; set; }
        public string cod_labor { get; set; }
        public string nom_labor { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_ala { get; set; }
        public string des_chofer { get; set; }
        public string des_tipo_transporte { get; set; }
        public string des_proced_blza { get; set; }
        public string as_check { get; set; }
    }

    public class EntradaDetTicketBlanzaDto
    {

        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_ticket_balanza { get; set; }

    }

    public class DetalleTicketBalanzaDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_ticket_balanza { get; set; }
        public DateTime? fec_emision { get; set; }
        public string cod_turno { get; set; }
        public string des_comentario { get; set; }
        public string cod_proveedor { get; set; }
        public string cod_tipo_material { get; set; }
        public string cod_tipo_material_detalle { get; set; }
        public string cod_personal { get; set; }
        public string cod_contrato { get; set; }
        public string des_guia_remitente { get; set; }
        public string cod_tipo_car { get; set; }
        public string cod_tipo_car_equipo { get; set; }
        public string cod_proced_blza { get; set; }
        public string cod_item_ruta { get; set; }
        public string cod_zona { get; set; }
        public decimal? num_cantidad_carros { get; set; }
        public DateTime? fec_peso_entrada { get; set; }
        public decimal? num_peso_entrada_tmh { get; set; }
        public DateTime? fec_peso_salida { get; set; }
        public decimal? num_peso_salida_tmh { get; set; }
        public decimal? num_peso_neto_tmh { get; set; }
        public string est_ticket_balanza { get; set; }
        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string cod_placa { get; set; }
        public string ruta_origen { get; set; }
        public string ruta_destino { get; set; }
        public string cod_usuario_apr { get; set; }
        public DateTime? fec_usuario_apr { get; set; }
        public string cod_ruta_origen { get; set; }
        public string cod_ruta_destino { get; set; }
        public string cod_labor { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_ala { get; set; }
        public string des_tipo_car { get; set; }
        public DateTime? fec_pesaje { get; set; }
        public bool? ind_automatico { get; set; }
        public string cod_ticket_balanza_copia { get; set; }
        public string cod_nivel { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_veta { get; set; }
        public string cod_fase { get; set; }
        public string ind_tipo_cancha { get; set; }
        public string cod_grupo_control { get; set; }
        public string nom_labor { get; set; }
        public string cod_maquinaria { get; set; }
        public string des_maquinaria { get; set; }
    }

    // CatalogosDtos.cs

    public class TurnoDto
    {
        public string cod_turno { get; set; }
        public string des_turno { get; set; }
        public TimeSpan? hor_inicio_operacion { get; set; }
        public TimeSpan? hor_fin_operacion { get; set; }
    }

    public class TipoMaterialDetalleDto
    {
        public string cod_tipo_material_detalle { get; set; }
        public string des_tipo_material_det { get; set; }
    }

    public class ContrataDto
    {
        public string cod_empresa { get; set; }
        public string cod_contrata { get; set; }
        public string des_contrata { get; set; }
    }

    public class ContratoDto
    {
        public string cod_contrato { get; set; }
        public string cod_contrata { get; set; }
    }

    public class PersonalContrataDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrata { get; set; }
        public string cod_personal { get; set; }
        public string cod_cargo { get; set; }
        public string des_apellido_pat { get; set; }
        public string des_apellido_mat { get; set; }
        public string des_nombre { get; set; }
        public string ind_chofer { get; set; }        // texto, no bool (pendiente confirmar valores reales)
        public string nro_doc_dni { get; set; }
        public string nro_doc_brevete { get; set; }
        public string flg_vigente { get; set; }        // texto, no bool (pendiente confirmar valores reales)
        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string C_T_PERSONAL { get; set; }
    }

    public class TipoCarroDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_tipo_car { get; set; }
        public string des_tipo_car { get; set; }
        public decimal? nro_tipo_car_fac { get; set; }
    }

    public class EquipoContrataDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string equipo { get; set; }
        public string descripcion { get; set; }
        public string placa { get; set; }
    }

    public class MaquinariaDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_maquinaria { get; set; }
        public string des_maquinaria { get; set; }
        public string est_maquinaria { get; set; }
    }

    public class TipoLaborBlnzDto
    {
        public string cod_tipo_labor { get; set; }
        public string nom_tipo_labor { get; set; }
        public string ind_orient { get; set; }
        public string ind_tipchm { get; set; }
        public string est_tipo_labor { get; set; }
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
    }

    public class LaborProgramadaDto
    {
        public string cod_empresa { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_veta { get; set; }
        public string cod_nivel_prg { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string nom_labor { get; set; }
        public string des_labor { get; set; }
        public string lab_blkgeo { get; set; }
        public string met_cod { get; set; }
        public string cod_nivel_labor { get; set; }
        public string est_labor { get; set; }
        public string nom_und_econom { get; set; }
        public string des_zona { get; set; }
        public string nom_veta { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_ala { get; set; }
        public string labor_con { get; set; }
    }

    public class AlaDto
    {
        public string cod_ala { get; set; }
        public string nom_ala { get; set; }
        public string est_ala { get; set; }
        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public string nombre { get; set; }
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
    }

    public class TarifarioTransporteDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_contrato { get; set; }
        public string cod_item_ruta { get; set; }
        public string cod_ruta_origen { get; set; }
        public string cod_ruta_destino { get; set; }
        public string cod_ruta_intermedia { get; set; }
        public decimal? imp_ruta_pu { get; set; }
        public string ind_material { get; set; }
        public decimal? imp_tmh_km_soles { get; set; }
        public decimal? nro_distancia_km { get; set; }
        public decimal? nro_factor_viajepeso { get; set; }
        public string flg_vigencia { get; set; }
        public string cod_zona { get; set; }
        public string cta_cod { get; set; }
        public string cto_cod { get; set; }
        public string c_t_zona { get; set; }
        public string c_t_origen { get; set; }
        public string c_t_destino { get; set; }
    }

    public class EntradaDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }

    }

    public class EntradaEquiposContrataDto
    {
        public string cod_empresa { get; set; }
        public string cod_contrata { get; set; }
    }

    public class EntradaLaboresProgramadosDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cie_ano { get; set; }
        public string cie_mes { get; set; }
        public string cod_tipo_labor { get; set; }
    }

    public class EntradaTipoDetalleDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_tipo_material { get; set; }

    }

    public class EntradaTarifarioTransporteDto
    {
        public string cod_contrato { get; set; }
        public string ind_material { get; set; }
    }

    public static class SqlDataReaderExtensions
    {
        public static string? GetStringOrDefault(this SqlDataReader reader, string columnName)
        {
            // 1. Buscamos el índice sin romper si no existe
            int ordinal = reader.HasColumn(columnName) ? reader.GetOrdinal(columnName) : -1;
            if (ordinal == -1 || reader.IsDBNull(ordinal)) return null;

            // Usamos GetValue().ToString() que es más seguro que GetString() con ciertos tipos de datos varchar/char
            return reader.GetValue(ordinal)?.ToString()?.TrimEnd();
        }

        public static DateTime? GetDateTimeOrDefault(this SqlDataReader reader, string columnName)
        {
            int ordinal = reader.HasColumn(columnName) ? reader.GetOrdinal(columnName) : -1;
            if (ordinal == -1 || reader.IsDBNull(ordinal)) return null;

            var valor = reader.GetValue(ordinal);

            // Si ya viene como DateTime nativo
            if (valor is DateTime dt) return dt;

            // Por si la base de datos devuelve un string con formato de fecha
            if (DateTime.TryParse(valor?.ToString(), out DateTime parsedDate)) return parsedDate;

            return null;
        }

        public static decimal? GetDecimalOrDefault(this SqlDataReader reader, string columnName)
        {
            int ordinal = reader.HasColumn(columnName) ? reader.GetOrdinal(columnName) : -1;
            if (ordinal == -1 || reader.IsDBNull(ordinal)) return null;

            var valor = reader.GetValue(ordinal);
            if (decimal.TryParse(valor?.ToString(), out decimal resultado)) return resultado;

            return null;
        }

        public static bool? GetBoolOrDefault(this SqlDataReader reader, string columnName)
        {
            int ordinal = reader.HasColumn(columnName) ? reader.GetOrdinal(columnName) : -1;
            if (ordinal == -1 || reader.IsDBNull(ordinal)) return null;

            var fieldType = reader.GetFieldType(ordinal);

            if (fieldType == typeof(bool))
                return reader.GetBoolean(ordinal);

            var valor = reader.GetValue(ordinal)?.ToString()?.Trim().ToUpperInvariant();

            return valor switch
            {
                "V" or "S" or "1" or "TRUE" or "SI" => true,
                "F" or "N" or "0" or "FALSE" => false,
                _ => null
            };
        }

        public static TimeSpan? GetTimeSpanOrDefault(this SqlDataReader reader, string columnName)
        {
            int ordinal = reader.HasColumn(columnName) ? reader.GetOrdinal(columnName) : -1;
            if (ordinal == -1 || reader.IsDBNull(ordinal)) return null;

            var valor = reader.GetValue(ordinal);
            if (valor is TimeSpan ts) return ts;
            if (TimeSpan.TryParse(valor?.ToString(), out TimeSpan parsedTs)) return parsedTs;

            return null;
        }

        // Método auxiliar clave para validar la existencia de columnas de forma segura
        public static bool HasColumn(this SqlDataReader reader, string columnName)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(columnName, StringComparison.OrdinalIgnoreCase))
                    return true;
            }
            return false;
        }
    }
}
