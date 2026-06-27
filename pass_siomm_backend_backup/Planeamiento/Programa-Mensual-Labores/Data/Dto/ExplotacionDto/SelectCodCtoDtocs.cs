namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto
{
    public class SelectCodCtoDtocs
    {

        public string cod_centro_costo { get; set; }

        public string des_centro_costo { get; set; }

    }

    public class SelectCodCtaDtocs
    {

        public string cod_cuenta_contable { get; set; }

        public string des_cuenta_contable { get; set; }

    }

    public class SelectAla
    {

        public string cod_ala { get; set; }

        public string nom_ala { get; set; }

    }

    public class CodLaborDto
    {

        public string cod_labor { get; set; }

        public string nom_labor { get; set; }

    }


    public class SelectOperativo
    {

        public string val_tipo_fac { get; set; }

        public string val_des_tipo_fac { get; set; }

    }

    public class UndEconomDto
    {

        public string cod_und_econom { get; set; }

        public string nom_und_econom { get; set; }

    }

    public class ContrataDto
    {

        public string cod_contrata { get; set; }

        public string des_contrata { get; set; }

    }

    public class ZonaDto
    {

        public string cod_zona { get; set; }

        public string des_zona { get; set; }

    }

    public class MaeFaseDto
    {

        public string cod_fase { get; set; }

        public string nom_fase { get; set; }

    }

    public class MaeLaborDto
    {

        public string cod_labor { get; set; }

        public string des_labor { get; set; }

    }


}
