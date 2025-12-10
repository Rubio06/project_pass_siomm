using System.ComponentModel.DataAnnotations;

namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaePerMetExplotacionDto
    {

        public string cod_metexp { get; set; }
        public string nom_metexp { get; set; }
        public string ind_calculo_dilucion { get; set; }
        public string ind_calculo_leyes_min { get; set; }
        public string ind_act { get; set; }
    }
}
