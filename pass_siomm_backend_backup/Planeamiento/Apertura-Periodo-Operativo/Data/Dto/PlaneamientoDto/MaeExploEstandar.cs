namespace pass_siomm_backend.Planeamiento.Data.Dto.PlaneamientoDto
{
    public class MaeExploEstandar
    {



        public string cie_ano { get; set; }
        public string cie_per { get; set; }
        public string cod_zona { get; set; }
        public string lab_pieper { get; set; }
        public string lab_broca { get; set; }
        public string lab_barcon { get; set; }
        public string lab_barren { get; set; }
        public string lab_facpot { get; set; }
        public string lab_fulmin { get; set; }
        public string lab_conect { get; set; }
        public string lab_punmar { get; set; }
        public string lab_tabla { get; set; }
        public string lab_apr { get; set; }
    }


    public class MaeExploEstandarEliminar
    {
        public string cod_zona { get; set; }
        public string cie_ano { get; set; }
        public string cie_per { get; set; }
    }
}
