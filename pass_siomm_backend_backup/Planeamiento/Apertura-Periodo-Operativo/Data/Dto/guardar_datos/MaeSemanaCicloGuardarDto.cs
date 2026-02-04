namespace pass_siomm_backend.Planeamiento.Data.Dto.guardar_datos
{
    public class MaeSemanaCicloGuardarDto
    {
        // 🔹 Claves
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cie_ano { get; set; } = string.Empty;
        public string cie_per { get; set; } = string.Empty;
        public int num_semana { get; set; }

        // 🔹 Fechas (nullable)
        public DateTime? fec_ini { get; set; }
        public DateTime? fec_fin { get; set; }

        // 🔹 Descripción
        public string? desc_semana { get; set; }

        // 🔹 Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }

    }
}
