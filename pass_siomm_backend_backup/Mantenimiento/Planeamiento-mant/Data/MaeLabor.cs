namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data
{
    public class LaborMantDto
    {
        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_und_econom { get; set; }

        public string? cod_zona { get; set; }

        public string? cod_veta { get; set; }

        public string? cod_nivel { get; set; }

        public string? cod_tipo_labor { get; set; }

        public string? cod_labor { get; set; }

        public string? nom_labor { get; set; }

        public string? des_labor { get; set; }

        public string? lab_blkgeo { get; set; }

        public string? met_cod { get; set; }

        public decimal? nro_lab_ag { get; set; }

        public decimal? nro_lab_au { get; set; }

        public decimal? nro_lab_cu { get; set; }

        public decimal? nro_lab_pb { get; set; }

        public decimal? nro_lab_zn { get; set; }

        public string? ind_tipo_labor { get; set; }

        public string? est_labor { get; set; }

        public string? cod_proced_blza { get; set; }

        public string? cod_usuario_creo { get; set; }

        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }

        public DateTime? fec_usuario_modi { get; set; }

        public string? cod_tipo_labor_ant { get; set; }

        public string? cod_labor_ant { get; set; }

        public string? cod_fase { get; set; }

        public string? nom_und_econom { get; set; }
        public string? des_und_econom { get; set; }
        public string? nom_veta { get; set; }
        public string? nom_nivel { get; set; }
        public string? nom_tipo_labor { get; set; }

        public string? cod_grupo_control { get; set; }
        public string? nom_proced_blza { get; set; }
        public string? nom_grupo_control { get; set; }
        public string? accion { get; set; }
    }
    //dbo.mae_und_economica.nom_und_econom,
    //            dbo.mae_und_economica.des_und_econom,
    //            dbo.mae_veta.nom_veta,
    //            dbo.mae_nivel.nom_nivel,
    //            dbo.mae_tipo_labor.nom_tipo_labor


    public class FiltroMantDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }

        public string cod_zona { get; set; }

        public string? texto_busqueda { get; set; }

        public int pagina { get; set; } = 1;

        public int cantidad_reg { get; set; } = 20;
    }

    public class PaginacionLaborDto
    {

        public int totalRegistros { get; set; }

        public int paginaActual { get; set; }

        public int cantidadReg { get; set; }

        public int totalPaginas { get; set; }
        public List<LaborMantDto> data { get; set; }
    }

    public class UnidadEconomicaMantDto
    {
        public string? cod_und_econom { get; set; }

        public string? nom_und_econom { get; set; }

        public string? cod_empresa { get; set; }

        public string? des_und_econom { get; set; }

        public string? nombre { get; set; }

        public string? cod_empresa_unidad { get; set; }
    }

    public class VetaMantDto
    {
        public string? nombre { get; set; }

        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_und_econom { get; set; }

        public string? cod_zona { get; set; }

        public string? cod_veta { get; set; }

        public string? nom_veta { get; set; }

        public string? des_veta { get; set; }

        public string? ind_veta { get; set; }

        public string? est_veta { get; set; }

        public string? cod_usuario_creo { get; set; }

        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }

        public DateTime? fec_usuario_modi { get; set; }
    }

    public class NivelMantDto
    {
        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }

        public string? cod_nivel { get; set; }

        public string? nom_nivel { get; set; }

        public string? des_nivel { get; set; }

        public decimal? nro_nivel_cot { get; set; }

        public string? est_nivel { get; set; }
    }

    public class TipoLaborMantDto
    {
        public string? cod_tipo_labor { get; set; }

        public string? est_tipo_labor { get; set; }

        public string? nom_tipo_labor { get; set; }

        public string? ind_orient { get; set; }

        public string? cod_usuario_creo { get; set; }

        public DateTime? fec_usuario_creo { get; set; }

        public string? cod_usuario_modi { get; set; }

        public DateTime? fec_usuario_modi { get; set; }

        public string? tipo_labor { get; set; }

        public string? ind_tipchm { get; set; }

        public string? cod_empresa { get; set; }

        public string? cod_empresa_unidad { get; set; }
    }

    public class ProcedenciaBalanzaMantDto
    {
        public string? cod_proced_blza { get; set; }

        public string? nom_proced_blza { get; set; }

        public string? cod_zona { get; set; }

        public string? ind_tolva_cancha { get; set; }

        public string? des_zona { get; set; }
    }

    public class GrupoControlMantDto
    {
        public string? cod_grupo_control { get; set; }

        public string? nom_grupo_control { get; set; }

        public string? est_grupo_control { get; set; }
    }



    public class MaestrosLaborDto
    {
        public List<UnidadEconomicaMantDto> unidadEconomica { get; set; } = new();

        public List<VetaMantDto> vetas { get; set; } = new();

        public List<NivelMantDto> niveles { get; set; } = new();

        public List<TipoLaborMantDto> tipoLabor { get; set; } = new();

        public List<ProcedenciaBalanzaMantDto> procedenciaBalanza { get; set; } = new();

        public List<GrupoControlMantDto> grupoControl { get; set; } = new();


    }







    public class ZonaMantDto
    {
        public string? cod_zona { get; set; }
        public string? des_zona { get; set; }
    }

    public class ResponseLaborMantDto
    {
        public int estado { get; set; }

        public string mensaje { get; set; }
    }

    //public class ResponseEliminarDto
    //{
    //    public int estado { get; set; }
    //    public string mensaje { get; set; } = string.Empty;
    //}


}
