namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeLaboratorioEstandarGuardarDto
    {

        // 🔹 Claves
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cie_ano { get; set; } = string.Empty;
        public string cie_per { get; set; } = string.Empty;
        public string cod_tiplab { get; set; } = string.Empty;

        // 🔹 Valores decimales (nullable)
        public decimal? nro_lab_ancho { get; set; }
        public decimal? nro_lab_altura { get; set; }
        public decimal? nro_lab_pieper { get; set; }
        public decimal? nro_lab_broca { get; set; }
        public decimal? nro_lab_barcon { get; set; }
        public decimal? nro_lab_barren { get; set; }
        public decimal? nro_lab_facpot { get; set; }
        public decimal? nro_lab_fulmin { get; set; }
        public decimal? nro_lab_conect { get; set; }
        public decimal? nro_lab_punmar { get; set; }
        public decimal? nro_lab_tabla { get; set; }

        // 🔹 Indicador
        public string? ind_lab_apr { get; set; }

        // 🔹 Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }

        // 🔹 Aprobación
        public string? usu_apr { get; set; }
        public DateTime? fec_apr { get; set; }
    }
}
