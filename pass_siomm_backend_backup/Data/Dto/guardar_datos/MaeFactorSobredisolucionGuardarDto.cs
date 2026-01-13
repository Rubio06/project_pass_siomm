namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeFactorSobredisolucionGuardarDto
    {
        // 🔹 Claves
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cie_ano { get; set; } = string.Empty;
        public string cie_per { get; set; } = string.Empty;

        // 🔹 Factores decimales (nullable)
        public decimal? val_fac_ag { get; set; }
        public decimal? val_fac_cu { get; set; }
        public decimal? val_fac_pb { get; set; }
        public decimal? val_fac_zn { get; set; }
        public decimal? val_fac_au { get; set; }

        // 🔹 Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }

    }
}
