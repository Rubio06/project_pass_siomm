namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeValOperativoDetalleDto
    {

        //cie_ano = reader["cie_ano"].ToString(),
        //            cie_per = reader["cie_per"].ToString(),

        public string cod_empresa { get; set; } = string.Empty;
        public string cod_empresa_unidad { get; set; } = string.Empty;
        public string val_ano { get; set; } = string.Empty;
        public string val_per { get; set; } = string.Empty;
        public string val_tipo_fac { get; set; } = string.Empty;
        public string val_des_tipo_fac { get; set; } = string.Empty;
        public string val_ind_principal { get; set; } = string.Empty;
        public string val_fac_ag { get; set; } = string.Empty;
        public string val_fac_cu { get; set; } = string.Empty;
        public string val_fac_pb { get; set; } = string.Empty;
        public string val_fac_zn { get; set; } = string.Empty;
        public string val_fac_au { get; set; } = string.Empty;
        public string usu_creo { get; set; } = string.Empty;
        public string fec_creo { get; set; } = string.Empty;
        public string usu_modi { get; set; } = string.Empty;
        public string fec_modi { get; set; } = string.Empty;
        public string val_fac_rec_ag { get; set; } = string.Empty;
        public string val_fac_rec_cu { get; set; } = string.Empty;
        public string val_fac_rec_pb { get; set; } = string.Empty;
        public string val_fac_rec_zn { get; set; } = string.Empty;
        public string val_fac_rec_au { get; set; } = string.Empty;
    }

    //public string? val_des_tipo_fac { get; set; }
}

