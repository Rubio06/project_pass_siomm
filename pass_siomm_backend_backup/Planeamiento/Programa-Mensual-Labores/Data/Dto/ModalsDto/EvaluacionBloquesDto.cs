namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto
{
    public class EvaluacionBloquesDto
    {
        public string des_labor { get; set; }
        public string cod_seccion { get; set; }
        public string cod_eje { get; set; }

        public decimal? prg_tmsextraid { get; set; }
        public decimal? prg_leycu { get; set; }
        public decimal? prg_leyau { get; set; }
        public decimal? prg_leyag { get; set; }
        public decimal? prg_leycueq { get; set; }
        public decimal? prg_leynsr { get; set; }

        public decimal? prg_perf { get; set; }

        public string ind_version { get; set; }
        public string cie_per { get; set; }
        public string cie_ano { get; set; }

        public string nro_prog { get; set; }
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
    }
}
