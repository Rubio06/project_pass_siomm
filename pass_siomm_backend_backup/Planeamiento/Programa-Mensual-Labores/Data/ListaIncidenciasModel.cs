using System.ComponentModel.DataAnnotations;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data
{
    public class ListaIncidenciasModel
    {

        [Required]
        [StringLength(10)]
        public string cod_veta { get; set; }

        [Required]
        [StringLength(10)]
        public string cod_nivel { get; set; }

        [Required]
        [StringLength(10)]
        public string cod_tipo_labor { get; set; }

        [Required]
        [StringLength(10)]
        public string cod_labor { get; set; }

        [Required]
        [StringLength(4)]
        public string cod_ala { get; set; }

        [Required]
        [StringLength(1000)]
        public string descripcion { get; set; }

        [Required]
        [StringLength(60)]
        public string nom_veta { get; set; }

    }
}
