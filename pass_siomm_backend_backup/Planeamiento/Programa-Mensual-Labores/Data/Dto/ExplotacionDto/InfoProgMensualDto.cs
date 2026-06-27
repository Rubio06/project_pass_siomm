namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto
{
    public class InfoProgMensualDto
    {

        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string nro_prog { get; set; }

        public string des_contrata { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_contrata { get; set; }
        public string cie_ano { get; set; }
        public string cie_per { get; set; }
        public DateTime? fec_emi { get; set; }
        public string prg_est { get; set; }
        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }
        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }
        public decimal? prg_cutoff { get; set; }
        public string prg_pre_apr { get; set; }
        public string ind_calc_dil { get; set; }
    }
}
