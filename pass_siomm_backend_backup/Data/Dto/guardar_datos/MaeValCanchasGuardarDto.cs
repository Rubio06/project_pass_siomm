namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeValCanchasGuardarDto
    {

        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cie_ano { get; set; } = string.Empty;
        public string cie_per { get; set; } = string.Empty;

        // 🔹 Valores decimales (nullable)
        public decimal? val_tms { get; set; }
        public decimal? val_ag { get; set; }
        public decimal? val_cu { get; set; }
        public decimal? val_pb { get; set; }
        public decimal? val_zn { get; set; }
        public decimal? val_vpt { get; set; }

        // 🔹 Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }

    }
}
