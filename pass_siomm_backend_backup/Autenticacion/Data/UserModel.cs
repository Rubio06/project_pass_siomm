namespace pass_siomm_backend.Autenticacion.Data
{
    public class UserModel
    {
        public string username { get; set; }
        public string password { get; set; }
    }
<<<<<<< HEAD

    public class MaeUsuarioDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_usuario { get; set; }

        public string? ind_usu_min { get; set; }
        public string? ind_usu_plt { get; set; }
        public string? ind_usu_pln { get; set; }
        public string? ind_usu_geo { get; set; }
        public string? ind_usu_lab { get; set; }
        public string? ind_usu_jefe_turno { get; set; }
        public string? ind_usu_jefe_zona_mina { get; set; }
        public string? ind_usu_sup_mina { get; set; }
        public string? ind_usu_sup { get; set; }
        public string? ind_usu_ing { get; set; }
        public string? ind_usu_sis { get; set; }
    }

    public class ResponseDto
    {
        public bool ? success { get; set; }
        public string message { get; set; }
        public string token { get; set; }
        public MaeUsuarioDto data { get; set; }

    }
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
}
