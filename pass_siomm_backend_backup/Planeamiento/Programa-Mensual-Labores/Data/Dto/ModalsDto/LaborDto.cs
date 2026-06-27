namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto
{
    public class LaborDto
    {
        public string cod_empresa { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_veta { get; set; }
        public string cod_nom_veta { get; set; } // alias del SELECT

        public string cod_nivel { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string nom_labor { get; set; }
        public string des_labor { get; set; } // alias concatenado

        public string est_labor { get; set; }

        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }

        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        public string cod_empresa_unidad { get; set; }

        public string cod_tipo_labor_ant { get; set; }
        public string cod_labor_ant { get; set; }
    }

    public class LaboresAvanceDto
    {
        public int total { get; set; }
        public int page { get; set; }
        public int pageSize { get; set; }
        public List<LaborDto> data { get; set; } = new List<LaborDto>();
    }
}
