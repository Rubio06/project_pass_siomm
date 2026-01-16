namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeFactorOperativoGuardarDto
    {
        // 🔹 Claves
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string val_ano { get; set; } = string.Empty;
        public string val_per { get; set; } = string.Empty;
        public string val_vig { get; set; } = string.Empty;

        // 🔹 Valores AG
        public decimal? val_fac_ag { get; set; }
        public decimal? val_pre_ag { get; set; }

        // 🔹 Valores CU
        public decimal? val_fac_cu { get; set; }
        public decimal? val_pre_cu { get; set; }

        // 🔹 Valores PB
        public decimal? val_fac_pb { get; set; }
        public decimal? val_pre_pb { get; set; }

        // 🔹 Valores ZN
        public decimal? val_fac_zn { get; set; }
        public decimal? val_pre_zn { get; set; }

        // 🔹 Valores AU
        public decimal? val_fac_au { get; set; }
        public decimal? val_pre_au { get; set; }


        // 🔹 Auditoría
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }

        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }

    }
}
