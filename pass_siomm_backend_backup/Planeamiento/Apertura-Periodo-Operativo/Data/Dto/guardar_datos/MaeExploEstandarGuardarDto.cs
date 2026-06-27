namespace pass_siomm_backend.Planeamiento.Data.Dto.guardar_datos
{
    public class MaeExploEstandarGuardarDto
    {

        // 🔹 Claves
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cie_ano { get; set; } = string.Empty;
        public string cie_per { get; set; } = string.Empty;
        public string cod_zona { get; set; } = string.Empty;

        // 🔹 Valores decimales (nullable)
        public decimal? lab_pieper { get; set; }
        public decimal? lab_broca { get; set; }
        public decimal? lab_barcon { get; set; }
        public decimal? lab_barren { get; set; }
        public decimal? lab_facpot { get; set; }
        public decimal? lab_fulmin { get; set; }
        public decimal? lab_conect { get; set; }
        public decimal? lab_punmar { get; set; }
        public decimal? lab_tabla { get; set; }

        // 🔹 Indicadores
        public string? lab_apr { get; set; }

        // 🔹 Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }
        public string? usu_apr { get; set; }
        public DateTime? fec_apr { get; set; }
    }
}
