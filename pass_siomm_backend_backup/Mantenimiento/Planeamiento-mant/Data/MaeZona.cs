namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    //public class MaeEmpresaDto
    //{
    //    public string cod_empresa { get; set; }

    //    public string nom_empresa { get; set; }
    //}

    //public class MaeEmpresaUnidadDto
    //{
    //    public string cod_empresa { get; set; }
    //    public string cod_empresa_unidad { get; set; }
    //    public string nom_empresa_unidad { get; set; }
    //}

    //public class MaeUndEconomicaDto
    //{
    //    public string cod_empresa { get; set; }
    //    public string cod_empresa_unidad { get; set; }
    //    public string cod_und_econom { get; set; }
    //    public string nom_und_econom { get; set; }
    //    public string des_und_econom { get; set; }
    //    public string ind_act { get; set; }
    //}

    //public class RespuestaEliminarDto
    //{
    //    public int estado { get; set; }

    //    public string mensaje { get; set; }
    //}

    public class MaeZonaDto
    {

        public  string? accion { get; set; }
        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_zona { get; set; }

        public string? des_zona { get; set; }

        public string? obs_zona { get; set; }

        public decimal? nro_den { get; set; }

        public string? cod_costo_equivalente { get; set; }

        public string? cod_partida_equivalente { get; set; }

        public string? est_zona { get; set; }

        public string? cod_usuario_creo { get; set; }

        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }

        public DateTime? fec_usuario_modi { get; set; }

        public decimal? val_vpt { get; set; }

        public string? des_empresa_zona { get; set; }

        public string? cod_zona_dhlogger { get; set; }

        public string? cod_usuario_responsable { get; set; }

        public string? ind_dens_estructura { get; set; }

        public string? cod_cancha_dhlogger { get; set; }

        public decimal? num_espon_min { get; set; }

        public decimal? num_espon_des { get; set; }
    }

    public class UsuarioJefeTurnoDTO
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_usuario { get; set; }
        public string? nom_usuario { get; set; }
    }

    public class ZonaDTO
    {   

        public string? accion { get; set; }
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_zona { get; set; }
        public string? des_zona { get; set; }
        public string? obs_zona { get; set; }
        public decimal nro_den { get; set; }
        public string? cod_costo_equivalente { get; set; }
        public string? est_zona { get; set; }
        public string? cod_usuario_creo { get; set; }
        public string? cod_usuario_modi { get; set; }
        public decimal val_vpt { get; set; }
        public string? cod_zona_dhlogger { get; set; }
        public string? cod_usuario_responsable { get; set; }
        public string? ind_dens_estructura { get; set; }
    }

    public class ResponseDTO
    {
        public int estado { get; set; } // 1: Éxito, -1: Error
        public string? mensaje { get; set; }                       
    }

    public class UsuarioDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_usuario { get; set; }
        public string? nom_usuario { get; set; }

    }



}
