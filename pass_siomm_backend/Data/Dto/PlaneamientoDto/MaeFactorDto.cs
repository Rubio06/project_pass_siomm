namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeFactorDto
    {

        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cie_ano { get; set; }
        public string? cie_per { get; set; }
        public decimal? fac_denmin { get; set; }
        public decimal? fac_denminyac { get; set; }
        public decimal? fac_dendes { get; set; }
        public decimal? fac_dialab { get; set; }
        public decimal? fac_vptmin { get; set; }
        public decimal? fac_tarhor { get; set; }
        public string? usu_creo { get; set; }
        public DateTime? fec_creo { get; set; } // Fecha
        public string? usu_modi { get; set; }
        public DateTime? fec_modi { get; set; } // Fecha
        public decimal? fac_porcum { get; set; }
        public decimal? fac_porhum { get; set; } 
        public decimal? fac_tms_dif { get; set; }


    }
}