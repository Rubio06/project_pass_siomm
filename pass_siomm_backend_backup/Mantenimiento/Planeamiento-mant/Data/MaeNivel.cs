namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class NivelDto
    {
        // Claves
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_nivel { get; set; }

        // Descripciones
        public string? nom_nivel { get; set; }
        public string? des_nivel { get; set; }

        // Datos adicionales
        public decimal? nro_nivel_cot { get; set; }
        public string? est_nivel { get; set; }

        // Auditoría
        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        // Integración
        public string? cod_nivel_dhlogger { get; set; }
        public string? accion { get; set; }
    }

    public class ResponseNivelDto
    {
        public int estado { get; set; }

        public string mensaje { get; set; }
    }

    public class ResponseEliminarDto
    {
        public int estado { get; set; }
        public string mensaje { get; set; } = string.Empty;
    }


}
