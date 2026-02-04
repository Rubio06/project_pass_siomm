namespace pass_siomm_backend.Planeamiento.Data.Dto.PlaneamientoDto
{
    public class MaeValOperativoDto
    {
        //public string val_fac_ag { get; set; }
        //public string val_fac_cu { get; set; }
        //public string val_fac_pb { get; set; }
        //public string val_fac_zn { get; set; }
        //public string val_fac_au { get; set; }


        public string val_pre_ag { get; set; }

        public string val_pre_cu { get; set; }
        public string val_pre_pb { get; set; }
        public string val_pre_au { get; set; }
        public string val_pre_zn { get; set; }


        //public string val_fac_rec_ag { get; set; }
        //public string val_fac_rec_cu { get; set; }
        //public string val_fac_rec_pb { get; set; }
        //public string val_fac_rec_zn { get; set; }
        //public string val_fac_rec_au { get; set; }       
        //public string val_des_tipo_fac { get; set; }


        public string cod_empresa { get; set; }
        public string val_ano { get; set; }
        public string val_per { get; set; }
        public string val_vig { get; set; }
        public string usu_creo { get; set; }
        public DateTime? fec_creo { get; set; }
        public string usu_modi { get; set; }
        public DateTime? fec_modi { get; set; }
        public string cod_empresa_unidad { get; set; }
    }
}
