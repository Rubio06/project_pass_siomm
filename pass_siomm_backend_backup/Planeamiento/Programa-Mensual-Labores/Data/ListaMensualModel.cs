using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data
{
    public class ListaMensualModel
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string nro_prog { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_contrata { get; set; }
        public string cie_ano { get; set; }
        public string? cie_per { get; set; }

        public DateTime? fec_emi { get; set; }

        public string prg_est { get; set; }

        public decimal? prg_cutoff { get; set; }

        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }

        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        public string cod_usuario_apr { get; set; }
        public DateTime? fec_usuario_apr { get; set; }

        public string cod_usuario_anu { get; set; }
        public DateTime? fec_usuario_anu { get; set; }

        public string prg_pre_apr { get; set; }
        public string prg_apr_geo { get; set; }
        public string prg_apr_min { get; set; }

        public string cod_usuario_apr_geo { get; set; }
        public DateTime? fec_usuario_apr_geo { get; set; }

        public string cod_usuario_apr_min { get; set; }
        public DateTime? fec_usuario_apr_min { get; set; }

        public string ind_calc_dil { get; set; }

        //TABLA ZONA
        public string des_zona { get; set; }
        public string des { get; set; }

        // TABLA mae_und_economica
        public string nom_und_econom { get; set; }

        public string tipo_incidencia { get; set; }

        public string imagen { get; set; }

    }

    public class RespuestaOperacionDto
    {
        public int estado { get; set; }
        public string mensaje { get; set; }
    }

    public class RespuestaPreAprobacionDto
    {
        public Boolean ok { get; set; }
        public string mensaje { get; set; }
        public string nuevo_estado { get; set; }
    }

    public class ExportarProgramacionResponse
    {
        public int Estado { get; set; }
        public string Mensaje { get; set; }
        public List<DetalleProgramaDto> Data { get; set; }
    }
}
