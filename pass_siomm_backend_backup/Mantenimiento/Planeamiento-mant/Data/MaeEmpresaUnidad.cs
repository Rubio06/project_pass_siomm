namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class MaeEmpresaDto
    {
        public string cod_empresa { get; set; }

        public string nom_empresa { get; set; }
    }

    public class MaeEmpresaUnidadDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string nom_empresa_unidad { get; set; }
    }

    public class MaeUndEconomicaDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string cod_und_econom { get; set; }
        public string nom_und_econom { get; set; }
        public string des_und_econom { get; set; }
        public string ind_act { get; set; }
    }

    public class RespuestaEliminarDto
    {
        public int estado { get; set; }

        public string mensaje { get; set; }
    }

    public class InsertarUndEconomDto
    {

        public char accion { get; set; }
        public string cod_empresa { get; set; } = "";
        public string cod_empresa_unidad { get; set; } = "";
        public string cod_und_econom { get; set; } = "";
        public string nom_und_econom { get; set; } = "";
        public string des_und_econom { get; set; } = "";
        public string ind_act { get; set; } = "";
        public string usu_creo { get; set; } = "";
        public string? cod_und_econom_dhlogger { get; set; }
    }
}
