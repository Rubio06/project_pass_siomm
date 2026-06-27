namespace pass_siomm_backend.Rutas.Data
{
    public class SqlQueries
    {
        public const string SP_GET_HOME_SESSION = "sp_IR_get_home_session";

        public const string SP_GET_OBTENER_RUTAS = "sp_IR_obtener_rutas";

        public const string SP_CARGAR_DATOS = "sp_IR_cargar_datos";

        public const string SP_OBTENER_MESES = "sp_IR_obtener_meses";

        public const string SP_OBTENER_ANIO = "sp_IR_obtener_anio";

        public const string SP_LISTA_EXPLOTACION = "sp_IR_obtener_met_explotacion";

        public const string SP_LISTA_ZONA = "sp_IR_obtener_met_zona";


        public const string SP_LISTA_TIPO_LABOR = "sp_IR_obtener_tipo_labor";

        //DELETE DE TABLAS

        public const string SP_ELIMINAR_SEMANA_AVANCE = "sp_IR_delete_semana_avance";

        public const string SP_ELIMINAR_SEMANA_PERIODO = "sp_IR_delete_semana_periodo";

        public const string SP_ELIMINAR_MET_EXPLORACION = "sp_IR_delete_per_met_exploracion";

        public const string SP_ELIMINAR_EXP_ESTANDAR = "sp_IR_delete_exp_estandar";

        public const string SP_ELIMINAR_TIP_LAB_ESTANDAR = "sp_IR_delete_tip_lab_estandar";

        //INSERTAR PERIODO
        public const string SP_INSERTAR_COPIAR_PERIODO = "sp_IR_copiar_datos_periodo";


        /// BLOQUEO DE SELECTS EN NUEVO


        public const string SP_LISTA_BLOQUEO = "SP_LISTA_BLOQUEO";

        public const string SP_LISTA_NUM_ENTEROS = "SP_LISTA_NUM_ENTEROS";







    }
}
    