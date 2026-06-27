namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto
{
    public class BlockReservasDto
    {
        public string cod_empresa { get; set; }          // varchar(2)
        public string cod_empresa_unidad { get; set; }   // varchar(2)
        public string nro_prog { get; set; }             // varchar(10)
        public string cod_und_econom { get; set; }       // varchar(2)
        public string cod_zona { get; set; }             // varchar(10)
        public string cod_veta { get; set; }             // varchar(10)
        public string cod_nivel { get; set; }            // varchar(10)
        public string cod_tipo_labor { get; set; }       // varchar(10)
        public string cod_labor { get; set; }            // varchar(10)
        public string cod_ala { get; set; }              // varchar(4)
        public string cod_fase { get; set; }             // varchar(4)
        public string prg_blocks { get; set; }           // varchar(20)

        public decimal? num_tms { get; set; }            // numeric
        public decimal? num_ag_veta { get; set; }        // numeric
        public decimal? num_au_veta { get; set; }        // numeric
        public decimal? num_cu_veta { get; set; }        // numeric
        public decimal? num_pb_veta { get; set; }        // numeric
        public decimal? num_zn_veta { get; set; }        // numeric
        public decimal? num_anc_veta { get; set; }       // numeric
        public decimal? num_anc_min { get; set; }        // numeric

    }
}
