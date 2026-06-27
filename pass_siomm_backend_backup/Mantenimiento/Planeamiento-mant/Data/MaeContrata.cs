namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class ContrataAdmDto
    {
        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_contrato { get; set; }

        public string? cod_contrata { get; set; }

        public DateTime? fec_registro { get; set; }

        public DateTime? fec_firma { get; set; }

        public DateTime? fec_inicio { get; set; }

        public DateTime? fec_termino { get; set; }

        public string? des_contacto_contrata { get; set; }

        public decimal? imp_tipo_cambio { get; set; }

        public int? nro_adendum { get; set; }

        public string? des_observacion { get; set; }

        public string? ind_situacion { get; set; }

        public string? ind_estado { get; set; }

        public string? ind_tipo_contrato { get; set; }

        public int? flg_vigente { get; set; }

        public string? cod_usuario_creo { get; set; }

        public DateTime? fec_usuario_creo { get; set; }

        public int? c_n_dias_curso { get; set; }

        public int? c_n_dias_contrato { get; set; }

        public string? c_t_ruc { get; set; }

        public string? c_t_contrata { get; set; }

        public string? c_t_equipo_alq { get; set; }
    }

    public class FiltrosAdmContratoDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_contrata { get; set; }  // '%' = todos
        public string? cod_contrato { get; set; }  // ''  = todos
        public string? ind_estado { get; set; }  // '%' = todos
        public DateTime? fec_inicio { get; set; }  // null = no filtra
        public DateTime? fec_termino { get; set; }  // null = no filtra
        public int? dia_ini { get; set; }  // null = no filtra
        public int? dia_fin { get; set; }  // null = no filtra
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
