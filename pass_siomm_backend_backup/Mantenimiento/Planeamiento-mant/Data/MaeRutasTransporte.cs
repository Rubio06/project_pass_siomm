namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class RutasTransporteDto
    {
        public string accion { get; set; }
        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_ruta { get; set; }

        public string? des_ruta { get; set; }

        public string? des_ruta_abrev { get; set; }

        public string? cod_zona { get; set; }

        public string? ind_tipo_tolcanc { get; set; }

        public int? flg_vigente { get; set; }

        public string? cod_usuario_creo { get; set; }

        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }

        public DateTime? fec_usuario_modi { get; set; }
        public string? des_zona { get; set; }


    }

    public class ResponseRutaTransporte
    {
        public int estado { get; set; }

        public string mensaje { get; set; }
    }

    //public class FiltroContrataDto
    //{
    //    public string? cod_empresa { get; set; }

    //    public string? cod_contrata { get; set; }

    //    public string? des_contrata { get; set; }
    //}

    //public class ResponseTipoLaborDto
    //{
    //    public bool estado { get; set; }

    //    public string mensaje { get; set; }
    //}

    //public class ResponseEliminarDto
    //{
    //    public int estado { get; set; }
    //    public string mensaje { get; set; } = string.Empty;
    //}


}
