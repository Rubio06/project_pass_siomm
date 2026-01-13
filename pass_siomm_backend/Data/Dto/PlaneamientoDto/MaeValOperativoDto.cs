namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class MaeValOperativoDto
    {

        // Las primeras columnas según la imagen (Varchar con longitud específica)
        public string cod_empresa_unidad { get; set; } // varchar(2)
        public string val_ano { get; set; }           // varchar(4)
        public string val_per { get; set; }           // varchar(2)
        public string val_tipo_fac { get; set; }      // varchar(5)
        public string val_des_tipo_fac { get; set; }  // varchar(20)
        public string val_ind_principal { get; set; } // varchar(1)

        // Factores (Decimales que permiten NULL)
        public decimal? val_fac_ag { get; set; }      // decimal, PermiteNull: YES
        public decimal? val_fac_cu { get; set; }      // decimal, PermiteNull: YES
        public decimal? val_fac_pb { get; set; }      // decimal, PermiteNull: YES
        public decimal? val_fac_zn { get; set; }      // decimal, PermiteNull: YES
        public decimal? val_fac_au { get; set; }      // decimal, PermiteNull: YES

        // Auditoría y Metadatos
        public string? usu_creo { get; set; }         // varchar(20), PermiteNull: YES
        public DateTime? fec_creo { get; set; }       // datetime, PermiteNull: YES
        public string? usu_modi { get; set; }         // varchar(20), PermiteNull: YES
        public DateTime? fec_modi { get; set; }       // datetime, PermiteNull: YES

        // Factores de Recuperación (Decimales que permiten NULL)
        public decimal? val_fac_rec_ag { get; set; }  // decimal, PermiteNull: YES
        public decimal? val_fac_rec_cu { get; set; }  // decimal, PermiteNull: YES
        public decimal? val_fac_rec_pb { get; set; }  // decimal, PermiteNull: YES
        public decimal? val_fac_rec_zn { get; set; }  // decimal, PermiteNull: YES
        public decimal? val_fac_rec_au { get; set; }  // decimal, PermiteNull: YES


        public decimal? val_pre_ag { get; set; }
        public decimal? val_pre_cu { get; set; }
        public decimal? val_pre_pb { get; set; }
        public decimal? val_pre_zn { get; set; }
        public decimal? val_pre_au { get; set; }



    }
}
