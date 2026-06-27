namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class TipoLaborDto
    {
        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_tipo_labor { get; set; }

        public string? nom_tipo_labor { get; set; }

        public string? ind_orient { get; set; }

        public string? ind_tipchm { get; set; }

        public string? est_tipo_labor { get; set; }

        public string? cod_usuario_creo { get; set; }

        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }

        public DateTime? fec_usuario_modi { get; set; }

        public string? cod_tipo_labor_dhlogger { get; set; }

        public string? ind_cota { get; set; }

        public string? texto_busqueda { get; set; }


        public string? accion { get; set; }
    }

    public class ResponseTipoLaborDto
    {
        public bool estado { get; set; }

        public string? mensaje { get; set; }
    }

    //public class ResponseEliminarDto
    //{
    //    public int estado { get; set; }
    //    public string mensaje { get; set; } = string.Empty;
    //}


}
