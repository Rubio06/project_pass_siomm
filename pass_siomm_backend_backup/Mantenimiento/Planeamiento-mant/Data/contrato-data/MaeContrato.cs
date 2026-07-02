namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class ContrataMantDto
    {

        public string? text_contrata { get; set; }
        public string? cod_empresa { get; set; }

        public string? cod_contrata { get; set; }

        public string? des_contrata { get; set; }

        public string? ruc_contrata { get; set; }

        public string? nro_telefono { get; set; }

        public string? nro_fax { get; set; }

        public string? rep_nombre { get; set; }

        public DateTime? fec_ingreso { get; set; }
        public DateTime? fec_cese { get; set; }
        public string? eml_correo { get; set; }

        public string? ind_tipo_contrata { get; set; }

        public string? est_contrata { get; set; }

        public string? idvendor { get; set; }

        public string? vendor { get; set; }

        public string? id_vendor { get; set; }

        public string? accion { get; set; }
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

    public class EliminarContratoDTO
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
    }

    public class GenericResponseDTO
    {
        public int estado { get; set; } // 1 = Éxito, 0 = Error
        public string mensaje { get; set; } = string.Empty;
    }

    public class EstadoContratoDto
    {
        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string cod_contrato { get; set; } = string.Empty;
        public string ind_estado { get; set; }
        public string cod_usuario_modi { get; set; } = string.Empty;
    }


}
