using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;

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


    public class VetaDto
    {
        // Claves Primarias y Códigos

        public string? accion { get; set; }
        public string? cod_empresa { get; set; }
        public string? cod_empresa_unidad { get; set; }
        public string? cod_und_econom { get; set; }
        public string? cod_zona { get; set; }
        public string? cod_veta { get; set; }

        public string? des_zona { get; set; }
        public string? nom_und_econom { get; set; }

        // Descripciones e Indicadores

        public string? nom_veta { get; set; }
        public string? des_veta { get; set; }
        public string? ind_veta { get; set; }
        public string? est_veta { get; set; }

        // Auditoría

        public string? cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        // Integración y Otros

        public string? cod_veta_old { get; set; }
        public string? cod_veta_dhlogger { get; set; }

        public decimal? nro_den { get; set; }
    }

    public class UndEconomicaSelectDto
    {
        public string? cod_und_econom { get; set; }
        public string? des_und_econom { get; set; }
    }

    public class ZonaSelectDto
    {
        public string? cod_zona { get; set; }
        public string? des_zona { get; set; }
    }

    public class VetaSelectDto
    {
        public string? cod_veta { get; set; }
        public string? nom_veta { get; set; }
    }

    public class ListasSelectDto
    {
        public List<ZonaSelectDto> Zonas { get; set; } = new();
        public List<UndEconomicaSelectDto> UnidadesEconomicas { get; set; } = new();
        public List<VetaSelectDto> Veta { get; set; } = new();
    }

    public class EliminarVetaDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_veta { get; set; }
        public string cod_zona { get; set; }
        public string cod_und_econom { get; set; }
    }


    //public class UsuarioJefeTurnoDTO
    //{
    //    public string cod_empresa { get; set; }
    //    public string cod_empresa_unidad { get; set; }
    //    public string cod_usuario { get; set; }
    //    public string nom_usuario { get; set; }
    //}

    //public class ZonaDTO
    //{   

    //    public string accion { get; set; }
    //    public string cod_empresa { get; set; }
    //    public string cod_empresa_unidad { get; set; }
    //    public string cod_zona { get; set; }
    //    public string des_zona { get; set; }
    //    public string obs_zona { get; set; }
    //    public decimal nro_den { get; set; }
    //    public string cod_costo_equivalente { get; set; }
    //    public string est_zona { get; set; }
    //    public string cod_usuario_creo { get; set; }
    //    public string cod_usuario_modi { get; set; }
    //    public decimal val_vpt { get; set; }
    //    public string cod_zona_dhlogger { get; set; }
    //    public string cod_usuario_responsable { get; set; }
    //    public string ind_dens_estructura { get; set; }
    //}

    //public class ResponseDTO
    //{
    //    public int Estado { get; set; } // 1: Éxito, -1: Error
    //    public string Mensaje { get; set; }
    //}



}
