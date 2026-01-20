namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class AperPeriodoCierreGuardarDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cie_ano { get; set; } = string.Empty;
        public string cie_per { get; set; } = string.Empty;
        public DateTime? fec_ini { get; set; }
        public DateTime? fec_fin { get; set; }

        // Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }

        public string? validacion { get; set; }

    }
}
