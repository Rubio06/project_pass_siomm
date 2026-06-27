namespace pass_siomm_backend.Planeamiento.Data.Dto.PlaneamientoDto
{
    public class MaeSemanaCicloDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cie_ano { get; set; }
        public string cie_per { get; set; }

        public int? num_semana { get; set; }
        public DateTime? fec_ini { get; set; }
        public DateTime? fec_fin { get; set; }
        public string desc_semana { get; set; }

        public string usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }

    }
}
