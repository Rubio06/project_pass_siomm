namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto
{
    public class IndiceRendimientoDto
    {
        // ================= STRING =================
        public string cod_empresa { get; set; }
        public string cod_empresa_unidad { get; set; }
        public string nro_prog { get; set; }
        public string cod_und_econom { get; set; }
        public string cod_zona { get; set; }
        public string cod_veta { get; set; }
        public string cod_nivel { get; set; }
        public string cod_tipo_labor { get; set; }
        public string cod_labor { get; set; }
        public string cod_ala { get; set; }
        public string cod_fase { get; set; }
        public string cod_cto { get; set; }
        public string cod_cta { get; set; }
        public string ind_tip_roca { get; set; }
        public string prg_tipace { get; set; }
        public string prg_blocks { get; set; }
        public string prg_progra { get; set; }
        public string cod_tipo_labor_ant { get; set; }
        public string cod_labor_ant { get; set; }
        public string cod_ala_ant { get; set; }
        public string ind_tip_roca_piso { get; set; }
        public string ind_tip_roca_techo { get; set; }
        public string prg_tramin { get; set; }
        public string prg_tramin_prog { get; set; }
        public string val_tipo_fac { get; set; }
        public string ind_calc_dil { get; set; }
        public string ind_clasificacion_sos { get; set; }
        public string ind_taladro_largo { get; set; }
        public string ind_verificacion { get; set; }
        public string prg_est { get; set; }
        public string des_proyecto { get; set; }
        public string nom_proyecto { get; set; }

        // ================= NUMERIC =================
        public decimal? prg_avamts { get; set; }
        public decimal? prg_secancho { get; set; }
        public decimal? prg_secaltu { get; set; }
        public decimal? prg_tmsdes { get; set; }
        public decimal? prg_tmsmin { get; set; }
        public decimal? prg_ancmin { get; set; }
        public decimal? prg_ancvet { get; set; }
        public decimal? prg_num_tramin { get; set; }
        public decimal? prg_loncor { get; set; }
        public decimal? prg_altcor { get; set; }
        public decimal? prg_tmsrotvet { get; set; }
        public decimal? prg_tmsrotdil { get; set; }
        public decimal? prg_tmsextraid { get; set; }
        public decimal? prg_leyag { get; set; }
        public decimal? prg_leycu { get; set; }
        public decimal? prg_leypb { get; set; }
        public decimal? prg_leyzn { get; set; }
        public decimal? prg_leyagdil { get; set; }
        public decimal? prg_leycudil { get; set; }
        public decimal? prg_leypbdil { get; set; }
        public decimal? prg_leyzndil { get; set; }
        public decimal? prg_vptdil { get; set; }
        public decimal? prg_homlab { get; set; }
        public decimal? prg_tareas { get; set; }
        public decimal? prg_nroper { get; set; }
        public decimal? prg_nrowinche { get; set; }
        public decimal? prg_nropala { get; set; }
        public decimal? prg_pieper { get; set; }
        public decimal? prg_brocas { get; set; }
        public decimal? prg_barcon { get; set; }
        public decimal? prg_barren { get; set; }
        public decimal? prg_dinami { get; set; }
        public decimal? prg_fulmin { get; set; }
        public decimal? prg_conect { get; set; }
        public decimal? prg_punmar { get; set; }
        public decimal? prg_tablas { get; set; }
        public decimal? prg_pernos { get; set; }
        public decimal? prg_mallas { get; set; }
        public decimal? prg_cimbras { get; set; }
        public decimal? prg_vptmin { get; set; }
        public decimal? dist_desde { get; set; }
        public decimal? dist_hasta { get; set; }
        public decimal? num_buzamiento { get; set; }
        public decimal? por_dilucion { get; set; }
        public decimal? prg_leyau { get; set; }
        public decimal? prg_leyaudil { get; set; }
        public decimal? prg_num_tramin_prog { get; set; }
        public decimal? prg_ancmin_leyes { get; set; }
        public decimal? num_factor_x { get; set; }
        public decimal? num_corte { get; set; }
        public decimal? num_dis_limpieza { get; set; }
        public decimal? val_vpt { get; set; }
        public decimal? fac_vptmin { get; set; }

        // ================= DATETIME =================
        public DateTime? prg_fecmuestreo { get; set; }
    }
}
