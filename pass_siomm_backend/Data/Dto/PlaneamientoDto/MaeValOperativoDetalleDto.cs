namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeValOperativoDetalleDto
    {
        // ===============================
        // VARCHAR
        // ===============================
        public string val_tipo_fac { get; set; }
        public string val_des_tipo_fac { get; set; }
        public string val_ind_principal { get; set; }

        // ===============================
        // DECIMAL
        // ===============================
        public decimal? val_fac_ag { get; set; }
        public decimal? val_fac_cu { get; set; }
        public decimal? val_fac_pb { get; set; }
        public decimal? val_fac_zn { get; set; }
        public decimal? val_fac_au { get; set; }

        public decimal? val_fac_rec_ag { get; set; }
        public decimal? val_fac_rec_cu { get; set; }
        public decimal? val_fac_rec_pb { get; set; }
        public decimal? val_fac_rec_zn { get; set; }
        public decimal? val_fac_rec_au { get; set; }

    }
}
