using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto
{
    public class ProgramaExplotacionDto
    {

        // ===== det_prg (NOT NULL)
        public string cod_empresa_unidad { get; set; }

        public string nro_prog { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_veta { get; set; }
        public string cod_nivel { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string des_labor { get; set; }
        public string cod_ala { get; set; }
        public string cod_fase { get; set; }
        public string nom_veta { get; set; }
        //public string cod_empresa { get; set; }


        // ===== VARCHAR NULL
        public string? cod_cto { get; set; }
        public string? cod_cta { get; set; }
        public string? ind_tip_roca { get; set; }
        public string? prg_tipace { get; set; }
        public string? metexp_cod { get; set; }
        public string? prg_blocks { get; set; }
        public string? prg_progra { get; set; }
        public string? cod_tipo_labor_ant { get; set; }
        public string? cod_labor_ant { get; set; }
        public string? cod_ala_ant { get; set; }
        public string? ind_tip_roca_piso { get; set; }
        public string? ind_tip_roca_techo { get; set; }
        public string? prg_tramin { get; set; }
        public string? des_proyecto { get; set; }
        public string? nom_proyecto { get; set; }
        public string? ind_clasificacion_sos { get; set; }
        public string? prg_tramin_prog { get; set; }
        public string? ind_taladro_largo { get; set; }
        public string? ind_verificacion { get; set; }
        public string? val_tipo_fac { get; set; }

        // ===== NUMERIC / DECIMAL (NULLABLE)


        public string? prg_avamts { get; set; }
        public string? prg_secancho { get; set; }
        public string? prg_secaltu { get; set; }
        public string? prg_tmsdes { get; set; }
        public string? prg_tmsmin { get; set; }
        public string? prg_ancmin { get; set; }
        public string? prg_ancvet { get; set; }
        public string? prg_loncor { get; set; }
        public string? prg_altcor { get; set; }
        public string? prg_tmsrotvet { get; set; }
        public string? prg_tmsrotdil { get; set; }
        public string? prg_tmsextraid { get; set; }
        public string? prg_leyag { get; set; }
        public string? prg_leycu { get; set; }
        public string? prg_leypb { get; set; }
        public string? prg_leyzn { get; set; }
        public string? prg_leyagdil { get; set; }
        public string? prg_leycudil { get; set; }
        public string? prg_leypbdil { get; set; }
        public string? prg_leyzndil { get; set; }
        public string? prg_vptdil { get; set; }
        public string? prg_homlab { get; set; }
        public string? prg_tareas { get; set; }
        public string? prg_nroper { get; set; }
        public string? prg_nrowinche { get; set; }
        public string? prg_nropala { get; set; }
        public string? prg_pieper { get; set; }
        public string? prg_brocas { get; set; }
        public string? prg_barcon { get; set; }
        public string? prg_barren { get; set; }
        public string? prg_dinami { get; set; }
        public string? prg_fulmin { get; set; }
        public string? prg_conect { get; set; }
        public string? prg_punmar { get; set; }
        public string? prg_tablas { get; set; }
        public string? prg_pernos { get; set; }
        public string? prg_mallas { get; set; }
        public string? prg_cimbras { get; set; }
        //public decimal? prg_tramin { get; set; }
        public string? prg_vptmin { get; set; }
        public string? dist_desde { get; set; }
        public string? dist_hasta { get; set; }
        public string? num_buzamiento { get; set; }
        public string? por_dilucion { get; set; }
        public string? prg_leyau { get; set; }
        public string? prg_leyaudil { get; set; }
        public string? prg_num_tramin_prog { get; set; }
        public string? prg_ancmin_leyes { get; set; }
        public string? num_factor_x { get; set; }
        public string? num_corte { get; set; }
        public string? num_dis_limpieza { get; set; }
        public string? prg_num_tramin { get; set; }
            

        // ===== DATETIME
        public DateTime? prg_fecmuestreo { get; set; }

        // ===== cab_prg
        public string? prg_est { get; set; }
        public string? prg_cutoff { get; set; }
        public string? ind_calc_dil { get; set; }

        // ===== mae_factor
        public string? fac_vptmin { get; set; }

        // ===== mae_zona
        public string? val_vpt { get; set; }

        // ===== CAMPOS FIJOS DEL SELECT
        public string ind_calc_tipo_dil { get; set; }   // 'M'
        public string ind_tipo_ley { get; set; }        // 'G'
        public string p_block { get; set; }             // tres_puntos.jpg
        public string as_add { get; set; }              // Planos
        public string p_bloques { get; set; }           // Agregar.bmp
    }

    public class RespuestaDto
    {
        public int estado { get; set; }
        public string mensaje { get; set; }
    }


    public class CabProgramaDto
    {
        public string cod_empresa { get; set; } = string.Empty;

        public string cod_empresa_unidad { get; set; } = string.Empty;

        public string nro_prog { get; set; } = string.Empty;
        public string cod_und_econom { get; set; } = string.Empty;

        public string prg_est   { get; set; } = string.Empty;
        public string cod_zona { get; set; } = string.Empty;

        public string cod_contrata { get; set; } = string.Empty;

        public string cie_ano { get; set; } = string.Empty;

        public string cie_per { get; set; } = string.Empty;

        public DateTime fec_emi { get; set; }

        public string cod_usuario_creo { get; set; } = string.Empty;

    

        public decimal? prg_cutoff { get; set; }

        public string prg_pre_apr { get; set; } = string.Empty;

        public string ind_calc_dil { get; set; } = string.Empty;
    }

    public class InsertarCabDetalleDto
    {
        public CabProgramaDto cabecera { get; set; }
        public List<ProgramaDetalleDTO> detalle { get; set; }
    }

    public class ProgramaDetalleDTO
    {
        // 🔹 FASE
        public string cod_fase { get; set; }

        // 🔹 IDENTIFICACIÓN
        public string cod_veta { get; set; }
        public string cod_nivel { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string cod_ala { get; set; }
        public string cod_cto { get; set; }
        public string cod_cta { get; set; }

        // 🔹 ROCA
        public decimal ind_tip_roca { get; set; }
        public decimal ind_tip_roca_piso { get; set; }
        public decimal ind_tip_roca_techo { get; set; }
        public char ind_taladro_largo { get; set; }

        // 🔹 AVANCE
        public decimal? prg_blocks { get; set; }
        public decimal? prg_avamts { get; set; }
        public decimal? prg_secancho { get; set; }
        public decimal prg_secaltu { get; set; }

        // 🔹 TONELAJE
        public decimal? prg_tmsdes { get; set; }
        public decimal? prg_tmsmin { get; set; }
        public decimal? prg_tmsextraid { get; set; }
        public decimal? prg_tmsrotvet { get; set; }
        public decimal? prg_tmsrotdil { get; set; }

        // 🔹 GEOMETRÍA
        public decimal? prg_ancmin { get; set; }
        public decimal? prg_ancvet { get; set; }
        public decimal? prg_loncor { get; set; }
        public decimal? prg_altcor { get; set; }

        // 🔹 CONTROL
        public string prg_progra { get; set; }
        public DateTime? prg_fecmuestreo { get; set; }

        // 🔹 LEYES
        public decimal? prg_leyag { get; set; }
        public decimal? prg_leycu { get; set; }
        public decimal? prg_leypb { get; set; }
        public decimal? prg_leyzn { get; set; }
        public decimal? prg_leyau { get; set; }

        public decimal? prg_leyagdil { get; set; }
        public decimal? prg_leycudil { get; set; }
        public decimal? prg_leypbdil { get; set; }
        public decimal? prg_leyzndil { get; set; }
        public decimal? prg_leyaudil { get; set; }

        // 🔹 VPT
        public decimal? prg_vptmin { get; set; }
        public decimal? prg_vptdil { get; set; }

        // 🔹 FACTORES
        public string cod_metexp { get; set; }
        public decimal? num_factor_x { get; set; }
        public decimal? num_buzamiento { get; set; }

        // 🔹 OTROS
        public decimal? prg_homlab { get; set; }
        public string ind_clasificacion_sos { get; set; }
        public string ind_verificacion { get; set; }
        public string val_tipo_fac { get; set; }
    }


    public class CopiarDetalleDto
    {
        public string? nro_prog { get; set; }
        public string? cod_veta { get; set; }
        public string? cod_nivel { get; set; }
        public string? cod_tipo_labor { get; set; }
        public string? cod_labor { get; set; }
        public string? cod_fase { get; set; }
        public string? cod_ala { get; set; }
    }

    public class ReporteFiltroDto
    {
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string nro_prog { get; set; }
        public string cod_fase { get; set; }
    }

    public class RespuestaArchivoDto
    {
        public int Estado { get; set; }
        public string Mensaje { get; set; }
        public byte[]? Archivo { get; set; }
        public string? NombreArchivo { get; set; }
        public string? ContentType { get; set; }
    }


}
