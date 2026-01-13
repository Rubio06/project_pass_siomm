namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeExploEstandar
    {
        public string cod_zona { get; set; }          // varchar(10)

        public decimal? lab_pieper { get; set; }      // decimal NULL
        public decimal? lab_broca { get; set; }       // decimal NULL
        public decimal? lab_barcon { get; set; }      // decimal NULL
        public decimal? lab_barren { get; set; }      // decimal NULL
        public decimal? lab_facpot { get; set; }      // decimal NULL
        public decimal? lab_fulmin { get; set; }      // decimal NULL
        public decimal? lab_conect { get; set; }      // decimal NULL
        public decimal? lab_punmar { get; set; }      // decimal NULL
        public decimal? lab_tabla { get; set; }       // decimal NULL

        public string? lab_apr { get; set; }          // varchar(1)
    }



    public class MaeExploEstandarEliminar
    {
        public string cod_zona { get; set; }
        public string anio { get; set; }
        public string mes { get; set; }
    }
}
