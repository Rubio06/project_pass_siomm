namespace pass_siomm_backend.Planeamiento.Data.Dto.PlaneamientoDto
{
    public class SelectExploracionDto
    {
        public string cod_metexp { get; set; }

        public string nom_metexp { get; set; }

    }


    public class DatosSemanasDto
    {
        public int num_semana { get; set; }
        public DateTime fec_fin { get; set; }
    }



}
