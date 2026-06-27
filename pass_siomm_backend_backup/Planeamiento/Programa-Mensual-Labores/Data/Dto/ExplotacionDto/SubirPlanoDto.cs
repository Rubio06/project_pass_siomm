using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto
{
    public class SubirPlanoDto
    {
        public IFormFile file { get; set; }
        public string titulo { get; set; }
        public string nro_prog { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_veta { get; set; }
        public string cod_nivel { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string? cod_ala { get; set; }
        public string cod_fase { get; set; }
    }

    public class DetPrgArchivosDto
    {
        public string cod_empresa { get; set; } = string.Empty;

        public string cod_empresa_unidad { get; set; } = string.Empty;

        public string nro_prog { get; set; } = string.Empty;

        public string cod_und_econom { get; set; } = string.Empty;

        public string cod_zona { get; set; } = string.Empty;

        public string cod_veta { get; set; } = string.Empty;

        public string cod_nivel { get; set; } = string.Empty;

        public string cod_tipo_labor { get; set; } = string.Empty;

        public string cod_labor { get; set; } = string.Empty;

        public string cod_ala { get; set; } = string.Empty;

        public string cod_fase { get; set; } = string.Empty;

        public string tipo_archivo { get; set; } = string.Empty;

        public int secuencia { get; set; }

        public string? ruta_archivo { get; set; }

        public string? nombre_archivo { get; set; }

        public string? descripcion { get; set; }
    }

    public class ResultadoDto
    {
        public int resultado { get; set; }
        public string mensaje { get; set; } = "";
    }

    public class EliminarPlanoDto
    {

        public string nro_prog { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_veta { get; set; }
        public string cod_nivel { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string cod_ala { get; set; }
        public string cod_fase { get; set; }
        public int secuencia { get; set; }
    }

    public class ProgramaResponse
    {
        public List<BlockReservasDto> blocks { get; set; }
        public List<DetPrgArchivosDto> archivos { get; set; }
    }

}
