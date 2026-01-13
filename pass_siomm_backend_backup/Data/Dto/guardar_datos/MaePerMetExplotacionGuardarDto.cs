namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaePerMetExplotacionGuardarDto
    {

        // 🔹 Claves
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cie_ano { get; set; } = string.Empty;
        public string cie_per { get; set; } = string.Empty;
        public string cod_metexp { get; set; } = string.Empty;

        // 🔹 Datos adicionales
        public string? nom_metexp { get; set; }

        // 🔹 Factor decimal (nullable)
        public decimal? fac_metexp { get; set; }

        // 🔹 Indicadores
        public string? ind_act { get; set; }
        public string? ind_calculo_dilucion { get; set; }
        public string? ind_calculo_leyes_min { get; set; }

        // 🔹 Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }

    }
}
