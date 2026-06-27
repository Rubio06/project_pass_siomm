using System.ComponentModel.DataAnnotations;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto
{
    public class ListaMensualDTO
    {
        public string imagen { get; set; }


        [Required]
        [StringLength(4)]
        public string cie_ano { get; set; }

        [Required]
        [StringLength(2)]
        public string? cie_per { get; set; }

        [Required]
        [StringLength(10)]
        public string nro_prog { get; set; }


        [Required]
        public DateTime? fec_emi { get; set; }

        [Required]
        [StringLength(2)]
        public string cod_und_econom { get; set; }


        [Required]
        [StringLength(10)]
        public string cod_zona { get; set; }

        [Required]
        [StringLength(3)]
        public string cod_contrata { get; set; }

        [Required]
        [StringLength(1)]
        public string prg_est { get; set; }

        [Required]
        public DateTime? fec_usuario_apr { get; set; }

        [Required]
        public DateTime? fec_usuario_apr_geo { get; set; }

        [Required]
        public DateTime? fec_usuario_apr_min { get; set; }


        public string des_contrata { get; set; }
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public decimal? prg_cutoff { get; set; }

        public string cod_usuario_creo { get; set; }
        public DateTime? fec_usuario_creo { get; set; }

        public string cod_usuario_modi { get; set; }
        public DateTime? fec_usuario_modi { get; set; }

        public string cod_usuario_apr { get; set; }

        public string cod_usuario_anu { get; set; }
        public DateTime? fec_usuario_anu { get; set; }

        public string prg_pre_apr { get; set; }
        public string prg_apr_geo { get; set; }
        public string prg_apr_min { get; set; }

        public string cod_usuario_apr_geo { get; set; }

        public string cod_usuario_apr_min { get; set; }

        public string ind_calc_dil { get; set; }

        //TABLA ZONA
        public string des_zona { get; set; }
        public string des { get; set; }

        // TABLA mae_und_economica
        public string nom_und_econom { get; set; }

        public string tipo_incidencia { get; set; }

    }

    public class CopiarProgramacionDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string nro_prog { get; set; }
        public string cie_ano { get; set; }
        public string cie_per { get; set; }
        public string usuario { get; set; }
    }

    public class CopiarResponseDto
    {
        public string mensaje { get; set; }
        public string nro_prog_nuevo { get; set; }
    }

    public class ImportarProgramacionMensualDto
    {
        public string cie_ano { get; set; }
        public string cie_per { get; set; }
        public string nro_prog { get; set; }

        public DateTime? fec_emi { get; set; }

        public string prg_est { get; set; }
        public string tratamiento { get; set; }

        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_contrata { get; set; }
        public string cod_fase { get; set; }
        public string cod_veta { get; set; }
        public string cod_nivel { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string cod_ala { get; set; }

        public string cod_cto { get; set; }
        public string cod_cta { get; set; }

        public string prg_blocks { get; set; }

        public string ind_tip_roca_piso { get; set; }
        public string ind_tip_roca { get; set; }
        public string ind_tip_roca_techo { get; set; }

        public decimal? prg_avamts { get; set; }
        public decimal? prg_secancho { get; set; }
        public decimal? prg_secaltu { get; set; }
        public decimal? prg_tmsdes { get; set; }
        public decimal? prg_tmsmin { get; set; }
        public decimal? tms_total { get; set; }

        public decimal? prg_ancmin { get; set; }
        public decimal? prg_ancvet { get; set; }
        public decimal? prg_ancdil { get; set; }

        public string prg_tramin { get; set; }
        public decimal? prg_num_tramin { get; set; }

        public decimal? prg_loncor { get; set; }
        public decimal? prg_altcor { get; set; }

        public decimal? prg_tmsrotvet { get; set; }
        public decimal? prg_tmsrotdil { get; set; }
        public decimal? prg_tmsextraid { get; set; }

        public DateTime? prg_fecmuestreo { get; set; }

        public decimal? prg_leyag { get; set; }
        public decimal? prg_leycu { get; set; }
        public decimal? prg_leypb { get; set; }
        public decimal? prg_leyzn { get; set; }

        public decimal? prg_vptmin { get; set; }

        public decimal? prg_leyagdil { get; set; }
        public decimal? prg_leycudil { get; set; }
        public decimal? prg_leypbdil { get; set; }
        public decimal? prg_leyzndil { get; set; }

        public decimal? prg_vptdil { get; set; }

        public decimal? dif_cutoff { get; set; }

        public string metexp_cod { get; set; }

        public decimal? prg_homlab { get; set; }

        public string des_proyecto { get; set; }
        public string nom_proyecto { get; set; }
    }

    public class ImportarProgramacionMensualFilaDto
    {
        public int fila { get; set; }
        public int resultado { get; set; }
        public string mensaje { get; set; }
        public string error { get; set; }
    }

    public class ResultadoImportacionDto
    {
        public bool respuesta { get; set; }
        public int totalFilas { get; set; }
        //public List<ImportarProgramacionMensualFilaDto>? resultados { get; set; }
        public string mensaje { get; set; }
    }


    public class CountDto
    {


        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string nro_prog { get; set; }
        public string cod_fase { get; set; }
        public string cod_labor { get; set; }

        public string cod_nivel { get; set; }
    }

    public class RequestCorrelativo
    {
        public string cod_empresa { get; set; }
        public string cod_unidad_empresa { get; set; }
    }



}
