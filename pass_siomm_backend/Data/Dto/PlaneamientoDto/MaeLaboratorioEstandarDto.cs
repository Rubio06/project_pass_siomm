namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeLaboratorioEstandarDto
    {
        public string cod_tiplab { get; set; }
        public string? nro_lab_ancho { get; set; }
        public string? nro_lab_altura { get; set; }

        public string? nro_lab_pieper { get; set; }
        public string? nro_lab_broca { get; set; }
        public string? nro_lab_barcon { get; set; }

        public string? nro_lab_barren { get; set; }

        public string? nro_lab_facpot { get; set; }
        public string? nro_lab_fulmin { get; set; }
        public string? nro_lab_conect { get; set; }
        public string? nro_lab_punmar { get; set; }
        public string? nro_lab_tabla { get; set; }
    }


    public class MaeLaboratorioEstandarEliminarDto
    {
        public string cod_tiplab { get; set; }
        public string mes { get; set; }
        public string anio { get; set; }

    }





}
