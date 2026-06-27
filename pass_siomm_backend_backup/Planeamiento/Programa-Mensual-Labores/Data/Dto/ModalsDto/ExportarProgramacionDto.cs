using Org.BouncyCastle.Bcpg.OpenPgp;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto
{
    public class DetalleProgramaDto
    {
        public string? cod_empresa { get; set; }
        public string? cod_zona { get; set; }
        public string? ind_taladro_largo { get; set; }

        public string? val_tipo_fac  { get; set; }
        public string? ind_clasificacion_sos { get; set; }

        public string? metexp_cod { get; set; }
        public string? cod_metexp { get; set; }
        public string? num_factor_x { get; set; }

        public string num_buzamiento { get; set; }
        public string? ind_verificacion { get; set; }
        public string? prg_progra { get; set; }
        public string? cod_veta { get; set; }
        public string? cie_ano { get; set; }
        public string? cie_per { get; set; }
        public string? nro_prog { get; set; }
        public string? fec_emi { get; set; }
        public string? prg_est { get; set; }
        public string? tratamiento { get; set; }
        public string? nom_und_econom { get; set; }
        public string? des_zona { get; set; }
        public string? des_contrata { get; set; }
        public string? nom_fase { get; set; }
        public string? des_veta { get; set; }
        public string? cod_nivel { get; set; }
        public string? cod_labor { get; set; }
        public string? cod_tipo_labor { get; set; }
        public string? cod_ala { get; set; }
        public string? cod_cto { get; set; }
        public string? cod_cta { get; set; }
        public string? prg_blocks { get; set; }
        public string? ind_tip_roca_piso { get; set; }
        public string? ind_tip_roca { get; set; }
        public string? ind_tip_roca_techo { get; set; }
        public string? prg_avamts { get; set; }
        public string? prg_secancho { get; set; }
        public string? prg_secaltu { get; set; }
        public string? prg_tmsdes { get; set; }
        public string? prg_tmsmin { get; set; }
        // Este campo lo calculamos en el SP o en el DTO
        public string? prg_tms_total { get; set; }
        public string? prg_ancmin { get; set; }
        public string? prg_ancvet { get; set; }
        public string? prg_num_tramin { get; set; }
        public string? prg_loncor { get; set; }
        public string? prg_altcor { get; set; }
        public string? prg_tmsrotvet { get; set; }
        public string? prg_tmsrotdil { get; set; }
        public string? prg_tmsextraid { get; set; }
        public string? prg_fecmuestreo { get; set; }
        public string? prg_leyag { get; set; }
        public string? prg_leycu { get; set; }
        public string? prg_leypb { get; set; }
        public string? prg_leyzn { get; set; }
        public string? val_vpt { get; set; }
        public string? prg_leyagdil { get; set; }
        public string? prg_leycudil { get; set; }
        public string? prg_leypbdil { get; set; }
        public string? prg_leyzndil { get; set; }
        public string? prg_vptmin { get; set; }
        public string? prg_leyau { get; set; }
        public string? nom_metexp { get; set; }
        public string? prg_homlab { get; set; }
        public string? cod_fase { get; set; }
        public string? des_proyecto { get; set; }
        public string? nom_proyecto { get; set; }
    }

    public class ExportarProgramacionRequest
    {
        public string? cie_ano { get; set; }
        public string? cie_per { get; set; }
        public string? nro_prog { get; set; }
    }

    
}
