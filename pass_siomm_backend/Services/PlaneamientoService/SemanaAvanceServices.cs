using Microsoft.Data.SqlClient;
using pass_siomm.Data;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
using System.Data;

namespace pass_siomm_backend.Services.PlaneamientoService
{
    public class SemanaAvanceServices
    {

        private readonly string _connectionString;


        public SemanaAvanceServices(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }



        public async Task<bool> GuardarSemanaAsync(MaeSemanaAvanceDto semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var cmd = new SqlCommand(@"
                INSERT INTO mae_semana_avance (
                    cod_empresa, 
                    cod_empresa_unidad, 
                    cie_ano,
                    cie_per, 
                    num_semana, 
                    fec_ini, 
                    fec_fin, 
                    desc_semana,
                    usu_creo,
                    fec_creo,
                    usu_modi,
                    fec_modi
                )
                VALUES (
                    @cod_empresa,
                    @cod_empresa_unidad, 
                    @cie_ano, 
                    @cie_per, 
                    @num_semana, 
                    @fec_ini, 
                    @fec_fin, 
                    @desc_semana,
                    @usu_creo,
                    @fec_creo,
                    @usu_modi,
                    @fec_modi
                )", connection))
                    {
                        cmd.Parameters.AddWithValue("@cod_empresa", semana.cod_empresa);
                        cmd.Parameters.AddWithValue("@cod_empresa_unidad", semana.cod_empresa_unidad);
                        cmd.Parameters.AddWithValue("@cie_ano", semana.cie_ano);
                        cmd.Parameters.AddWithValue("@cie_per", semana.cie_per);

                        cmd.Parameters.AddWithValue("@num_semana", semana.num_semana);
                        cmd.Parameters.AddWithValue("@fec_ini", semana.fec_ini ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@fec_fin", semana.fec_fin ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@desc_semana", semana.desc_semana);

                        cmd.Parameters.AddWithValue("@usu_creo", semana.usu_creo);
                        cmd.Parameters.AddWithValue("@fec_creo", semana.fec_creo ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@usu_modi", semana.usu_modi ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@fec_modi", semana.fec_modi ?? (object)DBNull.Value);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al guardar la semana: " + ex.Message);
                return false;
            }
        }


        /* LOGICA PARA COPIAR DATOS */
        public async Task InsertarCopiarPeriodoAsync(CopiarPeriodoDto semana)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var cmd = new SqlCommand(SqlQueries.SP_INSERTAR_COPIAR_PERIODO, connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@anioOrigen", SqlDbType.VarChar).Value = semana.anioOrigen;
                    cmd.Parameters.Add("@mesOrigen", SqlDbType.VarChar).Value = semana.mesOrigen;
                    cmd.Parameters.Add("@anioDestino", SqlDbType.VarChar).Value = semana.anioDestino;
                    cmd.Parameters.Add("@mesDestino", SqlDbType.VarChar).Value = semana.mesDestino;
                    cmd.Parameters.Add("@fechaInicioDestino", SqlDbType.DateTime)
                       .Value = DateTime.Parse(semana.fechaInicioDestino);

                    cmd.Parameters.Add("@fechaFinDestino", SqlDbType.DateTime)
                       .Value = DateTime.Parse(semana.fechaFinDestino);
                    cmd.Parameters.Add("@username", SqlDbType.VarChar).Value = semana.username;

                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        /*  */





        public async Task GuardarDatosAsync(DatosCompletosDto datos)
        {
            using var connection = new SqlConnection(_connectionString);
            string anioActual = DateTime.Now.Year.ToString();
            string mesActual = DateTime.Now.Month.ToString("D2");

            await connection.OpenAsync();

            using var transaction = connection.BeginTransaction();

            try
            {

                // 3️⃣ Guardar factor → mae_factor
                foreach (var fac in datos.factor)
                {
                    var cmd = new SqlCommand(@"
                         INSERT INTO mae_factor (
                            cod_empresa,
                            cod_empresa_unidad,
                            cie_ano,
                            cie_per,
                            fac_denmin,
                            fac_denminyac,
                            fac_dendes,
                            fac_dialab,
                            fac_vptmin,
                            fac_tarhor,
                            usu_creo,
                            fec_creo,
                            usu_modi,
                            fec_modi,
                            fac_porcum,
                            fac_porhum,
                            fac_tms_dif
                        )
                        VALUES (
                            @cod_empresa,
                            @cod_empresa_unidad,
                            @cie_ano,
                            @cie_per,
                            @fac_denmin,
                            @fac_denminyac,
                            @fac_dendes,
                            @fac_dialab,
                            @fac_vptmin,
                            @fac_tarhor,
                            @usu_creo,
                            @fec_creo,
                            @usu_modi,
                            @fec_modi,
                            @fac_porcum,
                            @fac_porhum,
                            @fac_tms_dif
                        );", connection, transaction);

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2).Value = mesActual;

                    cmd.Parameters.Add("@fac_denmin", SqlDbType.Decimal).Value =
                        fac.fac_denmin.HasValue ? fac.fac_denmin.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@fac_denminyac", SqlDbType.Decimal).Value =
                        fac.fac_denminyac.HasValue ? fac.fac_denminyac.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@fac_dendes", SqlDbType.Decimal).Value =
                        fac.fac_dendes.HasValue ? fac.fac_dendes.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@fac_dialab", SqlDbType.Decimal).Value =
                        fac.fac_dialab.HasValue ? fac.fac_dialab.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@fac_vptmin", SqlDbType.Decimal).Value =
                        fac.fac_vptmin.HasValue ? fac.fac_vptmin.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@fac_tarhor", SqlDbType.Decimal).Value =
                        fac.fac_tarhor.HasValue ? fac.fac_tarhor.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20).Value =
                        datos.username ?? (object)DBNull.Value;

                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value =
                        fac.fec_creo ?? (object)DBNull.Value;

                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20).Value =
                        fac.usu_modi ?? (object)DBNull.Value;

                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DateTime.Now;

                    cmd.Parameters.Add("@fac_porcum", SqlDbType.Decimal).Value =
                        fac.fac_porcum.HasValue ? fac.fac_porcum.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@fac_porhum", SqlDbType.Decimal).Value =
                        fac.fac_porhum.HasValue ? fac.fac_porhum.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@fac_tms_dif", SqlDbType.Decimal).Value =
                        fac.fac_tms_dif.HasValue ? fac.fac_tms_dif.Value : (object)DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }

                // 4️⃣ Guardar Factor Operativo (Nueva Tabla según imagen)
                foreach (var ope in datos.factorOperativo)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_val_operativo_detalle (
            cod_empresa,
            cod_empresa_unidad,
            val_ano,
            val_per,
            val_tipo_fac,
            val_des_tipo_fac,
            val_ind_principal,
            val_fac_ag,
            val_fac_cu,
            val_fac_pb,
            val_fac_zn,
            val_fac_au,
            usu_creo,
            fec_creo,
            usu_modi,
            fec_modi,
            val_fac_rec_ag,
            val_fac_rec_cu,
            val_fac_rec_pb,
            val_fac_rec_zn,
            val_fac_rec_au
        )
        VALUES (
            @cod_empresa,
            @cod_empresa_unidad,
            @val_ano,
            @val_per,
            @val_tipo_fac,
            @val_des_tipo_fac,
            @val_ind_principal,
            @val_fac_ag,
            @val_fac_cu,
            @val_fac_pb,
            @val_fac_zn,
            @val_fac_au,
            @usu_creo,
            @fec_creo,
            @usu_modi,
            @fec_modi,
            @val_fac_rec_ag,
            @val_fac_rec_cu,
            @val_fac_rec_pb,
            @val_fac_rec_zn,
            @val_fac_rec_au
        );", connection, transaction);

                    // --- Identidad (Basado en imagen: varchar) ---
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@val_ano", SqlDbType.VarChar, 4).Value = anioActual.ToString();
                    cmd.Parameters.Add("@val_per", SqlDbType.VarChar, 2).Value = mesActual.ToString().PadLeft(2, '0');

                    // --- Definiciones (Basado en imagen: varchar con longitudes específicas) ---
                    cmd.Parameters.Add("@val_tipo_fac", SqlDbType.VarChar, 5).Value = (object)ope.val_tipo_fac ?? DBNull.Value;
                    cmd.Parameters.Add("@val_des_tipo_fac", SqlDbType.VarChar, 20).Value = (object)ope.val_des_tipo_fac ?? DBNull.Value;
                    cmd.Parameters.Add("@val_ind_principal", SqlDbType.VarChar, 1).Value = (object)ope.val_ind_principal ?? DBNull.Value;

                    // --- Factores (Basado en imagen: decimal) ---
                    cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal).Value = (object)ope.val_fac_ag ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal).Value = (object)ope.val_fac_cu ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal).Value = (object)ope.val_fac_pb ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal).Value = (object)ope.val_fac_zn ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal).Value = (object)ope.val_fac_au ?? DBNull.Value;

                    // --- Auditoría (Basado en imagen: varchar 20 y datetime) ---
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20).Value = (object)datos.username ?? DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20).Value = (object)datos.username ?? DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DateTime.Now;

                    // --- Recuperaciones (Basado en imagen: decimal) ---
                    cmd.Parameters.Add("@val_fac_rec_ag", SqlDbType.Decimal).Value = (object)ope.val_fac_rec_ag ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_rec_cu", SqlDbType.Decimal).Value = (object)ope.val_fac_rec_cu ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_rec_pb", SqlDbType.Decimal).Value = (object)ope.val_fac_rec_pb ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_rec_zn", SqlDbType.Decimal).Value = (object)ope.val_fac_rec_zn ?? DBNull.Value;
                    cmd.Parameters.Add("@val_fac_rec_au", SqlDbType.Decimal).Value = (object)ope.val_fac_rec_au ?? DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }


                var deleteSem = new SqlCommand(@"
    DELETE FROM mae_semana_periodo 
    WHERE cod_empresa = '03' AND cod_empresa_unidad = '01' 
    AND cie_ano = @ano AND cie_per = @per", connection, transaction);

                deleteSem.Parameters.Add("@ano", SqlDbType.VarChar, 4).Value = anioActual;
                deleteSem.Parameters.Add("@per", SqlDbType.VarChar, 2).Value = mesActual;
                await deleteSem.ExecuteNonQueryAsync();

                // Loop para la lista de factores
                foreach (var lab in datos.exploracion_extandar)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_exp_estandar (
            cod_empresa, cod_empresa_unidad, cie_ano, cie_per, cod_zona, 
            lab_pieper, lab_broca, lab_barcon, lab_barren, lab_facpot, 
            lab_fulmin, lab_conect, lab_punmar, lab_tabla, lab_apr, 
            usu_creo, fec_creo, usu_modi, fec_modi, usu_apr, fec_apr
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, @cod_zona, 
            @lab_pieper, @lab_broca, @lab_barcon, @lab_barren, @lab_facpot, 
            @lab_fulmin, @lab_conect, @lab_punmar, @lab_tabla, @lab_apr, 
            @usu_creo, @fec_creo, @usu_modi, @fec_modi, @usu_apr, @fec_apr
        );", connection, transaction);

                    // Identificadores (Longitudes exactas según imagen)
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = anioActual.ToString();
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2).Value = mesActual.ToString().PadLeft(2, '0');

                    // cod_zona en tu imagen es VARCHAR(10)
                    cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = (object)lab.cod_zona ?? DBNull.Value;

                    // Laboratorios (Decimales según imagen)
                    cmd.Parameters.Add("@lab_pieper", SqlDbType.Decimal).Value = (object)lab.lab_pieper ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_broca", SqlDbType.Decimal).Value = (object)lab.lab_broca ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_barcon", SqlDbType.Decimal).Value = (object)lab.lab_barcon ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_barren", SqlDbType.Decimal).Value = (object)lab.lab_barren ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_facpot", SqlDbType.Decimal).Value = (object)lab.lab_facpot ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_fulmin", SqlDbType.Decimal).Value = (object)lab.lab_fulmin ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_conect", SqlDbType.Decimal).Value = (object)lab.lab_conect ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_punmar", SqlDbType.Decimal).Value = (object)lab.lab_punmar ?? DBNull.Value;
                    cmd.Parameters.Add("@lab_tabla", SqlDbType.Decimal).Value = (object)lab.lab_tabla ?? DBNull.Value;

                    // Campo APR (VARCHAR(1) según imagen)
                    cmd.Parameters.Add("@lab_apr", SqlDbType.VarChar, 1).Value = (object)lab.lab_apr ?? DBNull.Value;

                    // Auditoría (VARCHAR(20) según imagen)
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20).Value = (object)datos.username ?? DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;

                    // Campos NULL con tipo definido (Mejor práctica)
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;
                    cmd.Parameters.Add("@usu_apr", SqlDbType.VarChar, 20).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_apr", SqlDbType.DateTime).Value = DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }


                // semana avance
                foreach (var sem in datos.semana_avance)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_semana_avance (
            cod_empresa, 
            cod_empresa_unidad, 
            cie_ano, 
            cie_per, 
            num_semana, 
            fec_ini, 
            fec_fin, 
            desc_semana, 
            usu_creo, 
            fec_creo, 
            usu_modi, 
            fec_modi
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, @num_semana, 
            @fec_ini, @fec_fin, @desc_semana, @usu_creo, @fec_creo, @usu_modi, @fec_modi
        );", connection, transaction);

                    // Identificadores de cabecera
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = mesActual;

                    // Datos específicos de la semana (desde el DTO)
                    cmd.Parameters.Add("@num_semana", SqlDbType.Int).Value = sem.num_semana ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_ini", SqlDbType.VarChar).Value = sem.fec_ini ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_fin", SqlDbType.VarChar).Value = sem.fec_fin ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@desc_semana", SqlDbType.VarChar).Value = sem.desc_semana ?? (object)DBNull.Value;

                    // Auditoría
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;

                    // Campos de modificación (suelen ir nulos en la creación inicial según tu imagen)
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }

                // 1. LIMPIEZA PREVIA: Borramos las semanas de este periodo para evitar el PK duplicado
                var deleteSem2 = new SqlCommand(@"
    DELETE FROM mae_semana_periodo 
    WHERE cod_empresa = '03' AND cod_empresa_unidad = '01' 
    AND cie_ano = @ano AND cie_per = @per", connection, transaction);

                deleteSem2.Parameters.Add("@ano", SqlDbType.VarChar, 4).Value = anioActual;
                deleteSem2.Parameters.Add("@per", SqlDbType.VarChar, 2).Value = mesActual;
                await deleteSem2.ExecuteNonQueryAsync();

                // SEMANA PERIODO
                foreach (var sem in datos.cierre_periodo)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_semana_periodo (
            cod_empresa, 
            cod_empresa_unidad, 
            cie_ano, 
            cie_per, 
            num_semana, 
            fec_ini, 
            fec_fin, 
            desc_semana, 
            usu_creo, 
            fec_creo, 
            usu_modi, 
            fec_modi
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, @num_semana, 
            @fec_ini, @fec_fin, @desc_semana, @usu_creo, @fec_creo, @usu_modi, @fec_modi
        );", connection, transaction);

                    // Identificadores de Empresa y Periodo
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = mesActual;

                    // Datos de la semana (desde el DTO - todos tratados como string)
                    cmd.Parameters.Add("@num_semana", SqlDbType.Int).Value = sem.num_semana ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_ini", SqlDbType.VarChar).Value = sem.fec_ini ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_fin", SqlDbType.VarChar).Value = sem.fec_fin ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@desc_semana", SqlDbType.VarChar).Value = sem.desc_semana ?? (object)DBNull.Value;

                    // Auditoría de Creación
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;

                    // Auditoría de Modificación (Inicialmente NULL según las imágenes previas)
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }

                //METODO MINADO
                // METODO MINADO
                foreach (var met in datos.metodo_minado)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_per_met_explotacion (
            cod_empresa, 
            cod_empresa_unidad, 
            cie_ano, 
            cie_per, 
            cod_metexp, 
            nom_metexp, 
            fac_metexp, 
            ind_act, 
            usu_creo, 
            fec_creo, 
            usu_modi, 
            fec_modi, 
            ind_calculo_dilucion, 
            ind_calculo_leyes_min
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, @cod_metexp, 
            @nom_metexp, @fac_metexp, @ind_act, @usu_creo, @fec_creo, 
            @usu_modi, @fec_modi, @ind_calculo_dilucion, @ind_calculo_leyes_min
        );", connection, transaction);

                    // Identificadores (Longitudes según imagen)
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = anioActual.ToString();
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2).Value = mesActual.ToString().PadLeft(2, '0');

                    // Datos del método (Longitudes críticas según imagen)
                    cmd.Parameters.Add("@cod_metexp", SqlDbType.VarChar, 3).Value = (object)met.cod_metexp ?? DBNull.Value;
                    cmd.Parameters.Add("@nom_metexp", SqlDbType.VarChar, 30).Value = (object)met.nom_metexp ?? DBNull.Value;

                    // Decimal (Correcto según imagen)
                    cmd.Parameters.Add("@fac_metexp", SqlDbType.Decimal).Value = (object)met.fac_metexp ?? DBNull.Value;

                    // Indicadores (Longitud 1 según imagen)
                    cmd.Parameters.Add("@ind_act", SqlDbType.VarChar, 1).Value = (object)met.ind_act ?? DBNull.Value;
                    cmd.Parameters.Add("@ind_calculo_dilucion", SqlDbType.VarChar, 1).Value = (object)met.ind_calculo_dilucion ?? DBNull.Value;
                    cmd.Parameters.Add("@ind_calculo_leyes_min", SqlDbType.VarChar, 1).Value = (object)met.ind_calculo_leyes_min ?? DBNull.Value;

                    // Auditoría (Longitud 20 según imagen)
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20).Value = (object)datos.username ?? DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;

                    // Modificación
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }

                // LABROATORIO ESTANDAR
                foreach (var met in datos.laboratorio_estandar)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_tip_lab_estandar (
            cod_empresa, cod_empresa_unidad, cie_ano, cie_per, 
            cod_tiplab, nro_lab_ancho, nro_lab_altura, 
            nro_lab_pieper, nro_lab_broca, nro_lab_barcon, nro_lab_barren, 
            nro_lab_facpot, nro_lab_fulmin, nro_lab_conect, nro_lab_punmar, nro_lab_tabla, 
            ind_lab_apr, usu_creo, fec_creo, usu_modi, fec_modi, usu_apr, fec_apr
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, 
            @cod_tiplab, @nro_lab_ancho, @nro_lab_altura, 
            @nro_lab_pieper, @nro_lab_broca, @nro_lab_barcon, @nro_lab_barren, 
            @nro_lab_facpot, @nro_lab_fulmin, @nro_lab_conect, @nro_lab_punmar, @nro_lab_tabla, 
            @ind_lab_apr, @usu_creo, @fec_creo, @usu_modi, @fec_modi, @usu_apr, @fec_apr
        );", connection, transaction);

                    // Identificadores (VarChar)
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = mesActual;
                    cmd.Parameters.Add("@cod_tiplab", SqlDbType.VarChar).Value = met.cod_tiplab ?? (object)DBNull.Value;

                    // Dimensiones y Métricas (Enviados como String según tu requerimiento)

                    cmd.Parameters.Add("@nro_lab_ancho", SqlDbType.Decimal).Value =
met.nro_lab_ancho.HasValue ? met.nro_lab_ancho.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_altura", SqlDbType.Decimal).Value =
met.nro_lab_altura.HasValue ? met.nro_lab_altura.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_pieper", SqlDbType.Decimal).Value =
met.nro_lab_pieper.HasValue ? met.nro_lab_pieper.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_broca", SqlDbType.Decimal).Value =
met.nro_lab_broca.HasValue ? met.nro_lab_broca.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_barcon", SqlDbType.Decimal).Value =
met.nro_lab_barcon.HasValue ? met.nro_lab_barcon.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_barren", SqlDbType.Decimal).Value =
met.nro_lab_barren.HasValue ? met.nro_lab_barren.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_facpot", SqlDbType.Decimal).Value =
met.nro_lab_facpot.HasValue ? met.nro_lab_facpot.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_fulmin", SqlDbType.Decimal).Value =
met.nro_lab_fulmin.HasValue ? met.nro_lab_fulmin.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@nro_lab_conect", SqlDbType.Decimal).Value =
met.nro_lab_conect.HasValue ? met.nro_lab_conect.Value : (object)DBNull.Value;


                    cmd.Parameters.Add("@nro_lab_punmar", SqlDbType.Decimal).Value =
met.nro_lab_punmar.HasValue ? met.nro_lab_punmar.Value : (object)DBNull.Value;



                    cmd.Parameters.Add("@nro_lab_tabla", SqlDbType.Decimal).Value =
met.nro_lab_tabla.HasValue ? met.nro_lab_tabla.Value : (object)DBNull.Value;


                    cmd.Parameters.Add("@ind_lab_apr", SqlDbType.Decimal).Value =
met.ind_lab_apr.HasValue ? met.ind_lab_apr.Value : (object)DBNull.Value;



                    // Auditoría Completa (Basado en los datos visibles de la imagen)
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DateTime.Now;

                    // Aprobación (NULL en la imagen)
                    cmd.Parameters.Add("@usu_apr", SqlDbType.VarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_apr", SqlDbType.DateTime).Value = DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }





                /// MaeValOperativoDetalleDto
                /// 
                // 1. Limpieza previa (como vimos antes) para evitar duplicados de PK
                var deleteCmd = new SqlCommand(@"
    DELETE FROM mae_val_operativo_detalle 
    WHERE cod_empresa = '03' AND cod_empresa_unidad = '01' 
    AND val_ano = @ano AND val_per = @per", connection, transaction);

                deleteCmd.Parameters.Add("@ano", SqlDbType.VarChar, 4).Value = anioActual;
                deleteCmd.Parameters.Add("@per", SqlDbType.VarChar, 2).Value = mesActual;
                await deleteCmd.ExecuteNonQueryAsync();

                // 2. Inserción
                foreach (var fac in datos.operativo_detalle)
                {
                    // CREAR EL COMANDO AQUÍ ADENTRO para que los parámetros sean nuevos en cada vuelta
                    using (var cmd = new SqlCommand(@"
        INSERT INTO mae_val_operativo_detalle (
            cod_empresa, cod_empresa_unidad, val_ano, val_per, 
            val_tipo_fac, val_des_tipo_fac, val_ind_principal, 
            val_fac_ag, val_fac_cu, val_fac_pb, val_fac_zn, val_fac_au, 
            usu_creo, fec_creo, usu_modi, fec_modi, 
            val_fac_rec_ag, val_fac_rec_cu, val_fac_rec_pb, val_fac_rec_zn, val_fac_rec_au
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @val_ano, @val_per, 
            @val_tipo_fac, @val_des_tipo_fac, @val_ind_principal, 
            @val_fac_ag, @val_fac_cu, @val_fac_pb, @val_fac_zn, @val_fac_au, 
            @usu_creo, @fec_creo, @usu_modi, @fec_modi, 
            @val_fac_rec_ag, @val_fac_rec_cu, @val_fac_rec_pb, @val_fac_rec_zn, @val_fac_rec_au
        );", connection, transaction))
                    {
                        // Identificadores (PK)
                        cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                        cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                        cmd.Parameters.Add("@val_ano", SqlDbType.VarChar, 4).Value = anioActual;
                        cmd.Parameters.Add("@val_per", SqlDbType.VarChar, 2).Value = mesActual;
                        cmd.Parameters.Add("@val_tipo_fac", SqlDbType.VarChar, 5).Value = (object)fac.val_tipo_fac ?? DBNull.Value;

                        // Varchars según imagen
                        cmd.Parameters.Add("@val_des_tipo_fac", SqlDbType.VarChar, 20).Value = (object)fac.val_des_tipo_fac ?? DBNull.Value;
                        cmd.Parameters.Add("@val_ind_principal", SqlDbType.VarChar, 1).Value = (object)fac.val_ind_principal ?? DBNull.Value;

                        // Auditoría (Aquí es donde fallaba antes)
                        cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20).Value = (object)datos.username ?? DBNull.Value;
                        cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20).Value = DBNull.Value;
                        cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                        // Decimales
                        cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal).Value = (object)fac.val_fac_ag ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal).Value = (object)fac.val_fac_cu ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal).Value = (object)fac.val_fac_pb ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal).Value = (object)fac.val_fac_zn ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal).Value = (object)fac.val_fac_au ?? DBNull.Value;

                        cmd.Parameters.Add("@val_fac_rec_ag", SqlDbType.Decimal).Value = (object)fac.val_fac_rec_ag ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_rec_cu", SqlDbType.Decimal).Value = (object)fac.val_fac_rec_cu ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_rec_pb", SqlDbType.Decimal).Value = (object)fac.val_fac_rec_pb ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_rec_zn", SqlDbType.Decimal).Value = (object)fac.val_fac_rec_zn ?? DBNull.Value;
                        cmd.Parameters.Add("@val_fac_rec_au", SqlDbType.Decimal).Value = (object)fac.val_fac_rec_au ?? DBNull.Value;

                        await cmd.ExecuteNonQueryAsync();
                    } // Al cerrar el using, el comando y sus parámetros se limpian automáticamente
                }
                //CANCHAS
                foreach (var prod in datos.canchas)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_val_canchas (
            cod_empresa, 
            cod_empresa_unidad, 
            cie_ano, 
            cie_per, 
            val_tms, 
            val_ag, 
            val_cu, 
            val_pb, 
            val_zn, 
            val_vpt, 
            usu_creo, 
            fec_creo, 
            usu_modi, 
            fec_modi
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, @val_tms, 
            @val_ag, @val_cu, @val_pb, @val_zn, @val_vpt, 
            @usu_creo, @fec_creo, @usu_modi, @fec_modi
        );", connection, transaction);

                    // Identificadores base
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = mesActual;

                    cmd.Parameters.Add("@val_tms", SqlDbType.Decimal).Value =
    prod.val_tms.HasValue ? prod.val_tms.Value : (object)DBNull.Value;


                    cmd.Parameters.Add("@val_ag", SqlDbType.Decimal).Value =
    prod.val_ag.HasValue ? prod.val_ag.Value : (object)DBNull.Value;


                    cmd.Parameters.Add("@val_cu", SqlDbType.Decimal).Value =
    prod.val_cu.HasValue ? prod.val_cu.Value : (object)DBNull.Value;


                    cmd.Parameters.Add("@val_pb", SqlDbType.Decimal).Value =
    prod.val_pb.HasValue ? prod.val_pb.Value : (object)DBNull.Value;


                    cmd.Parameters.Add("@val_zn", SqlDbType.Decimal).Value =
    prod.val_zn.HasValue ? prod.val_zn.Value : (object)DBNull.Value;


                    cmd.Parameters.Add("@val_vpt", SqlDbType.Decimal).Value =
    prod.val_vpt.HasValue ? prod.val_vpt.Value : (object)DBNull.Value;


                    // Auditoría
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;

                    // Campos de modificación (NULL inicialmente según estándar de tus imágenes)
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }


                // factorSobredisolucion

                foreach (var fac in datos.factorSobredisolucion)
                {
                    var cmd = new SqlCommand(@"
                        INSERT INTO mae_factor_sobredilucion (
                            cod_empresa, 
                            cod_empresa_unidad, 
                            cie_ano, 
                            cie_per, 
                            val_fac_ag, 
                            val_fac_cu, 
                            val_fac_pb, 
                            val_fac_zn, 
                            usu_creo, 
                            fec_creo, 
                            usu_modi, 
                            fec_modi,
                            val_fac_au
                        ) VALUES (
                            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, @val_fac_ag, 
                            @val_fac_cu, @val_fac_pb, @val_fac_zn, @usu_creo, @fec_creo, 
                            @usu_modi, @fec_modi, @val_fac_au
                        );", connection, transaction);

                    // Identificadores base
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = mesActual;


                    cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal).Value =
    fac.val_fac_ag.HasValue ? fac.val_fac_ag.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal).Value =
    fac.val_fac_cu.HasValue ? fac.val_fac_cu.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal).Value =
    fac.val_fac_pb.HasValue ? fac.val_fac_pb.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal).Value =
    fac.val_fac_zn.HasValue ? fac.val_fac_zn.Value : (object)DBNull.Value;


                    // Auditoría (Ubicada en medio de la tabla según la imagen)
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                    // Factor de Oro (Aparece al final de la consulta)
                    cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal).Value =
fac.val_fac_au.HasValue ? fac.val_fac_au.Value : (object)DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }


                // mae_factor_recuperacion

                foreach (var rec in datos.recuperacionBudget)
                {
                    var cmd = new SqlCommand(@"
                        INSERT INTO mae_factor_recuperacion (
                            cod_empresa, cod_empresa_unidad, cie_ano, cie_per, 
                            val_fac_ag, val_fac_cu, val_fac_pb, val_fac_zn, 
                            val_fac_bud_ag, val_fac_bud_cu, val_fac_bud_pb, val_fac_bud_zn, 
                            val_con_ag, val_con_cu, val_con_pb, val_con_zn, 
                            usu_creo, fec_creo, usu_modi, fec_modi, 
                            val_fac_au, val_fac_bud_au, val_con_au
                        ) VALUES (
                            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, 
                            @val_fac_ag, @val_fac_cu, @val_fac_pb, @val_fac_zn, 
                            @val_fac_bud_ag, @val_fac_bud_cu, @val_fac_bud_pb, @val_fac_bud_zn, 
                            @val_con_ag, @val_con_cu, @val_con_pb, @val_con_zn, 
                            @usu_creo, @fec_creo, @usu_modi, @fec_modi, 
                            @val_fac_au, @val_fac_bud_au, @val_con_au
                        );", connection, transaction);

                    // 1. Identificadores base
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = mesActual;

                    // 2. Factores de Recuperación (Ag, Cu, Pb, Zn)

                    cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal).Value =
    rec.val_fac_ag.HasValue ? rec.val_fac_ag.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal).Value =
    rec.val_fac_cu.HasValue ? rec.val_fac_cu.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal).Value =
    rec.val_fac_pb.HasValue ? rec.val_fac_pb.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal).Value =
    rec.val_fac_zn.HasValue ? rec.val_fac_zn.Value : (object)DBNull.Value;

                    // 3. Factores Presupuestados (Bud)

                    cmd.Parameters.Add("@val_fac_bud_ag", SqlDbType.Decimal).Value =
rec.val_fac_bud_ag.HasValue ? rec.val_fac_bud_ag.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_bud_cu", SqlDbType.Decimal).Value =
rec.val_fac_bud_cu.HasValue ? rec.val_fac_bud_cu.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_bud_pb", SqlDbType.Decimal).Value =
rec.val_fac_bud_pb.HasValue ? rec.val_fac_bud_pb.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_bud_zn", SqlDbType.Decimal).Value =
rec.val_fac_bud_zn.HasValue ? rec.val_fac_bud_zn.Value : (object)DBNull.Value;

                    // 4. Factores Concentrado (Con)


                    cmd.Parameters.Add("@val_con_ag", SqlDbType.Decimal).Value =
rec.val_con_ag.HasValue ? rec.val_con_ag.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_con_cu", SqlDbType.Decimal).Value =
rec.val_con_cu.HasValue ? rec.val_con_cu.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_con_pb", SqlDbType.Decimal).Value =
rec.val_con_pb.HasValue ? rec.val_con_pb.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_con_zn", SqlDbType.Decimal).Value =
rec.val_con_zn.HasValue ? rec.val_con_zn.Value : (object)DBNull.Value;

                    // 5. Auditoría (Intercalada antes del Oro)
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                    // 6. Factores de Oro (Au) - Al final de la fila

                    cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal).Value =
rec.val_fac_au.HasValue ? rec.val_fac_au.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_fac_bud_au", SqlDbType.Decimal).Value =
rec.val_fac_bud_au.HasValue ? rec.val_fac_bud_au.Value : (object)DBNull.Value;

                    cmd.Parameters.Add("@val_con_au", SqlDbType.Decimal).Value =
rec.val_con_au.HasValue ? rec.val_con_au.Value : (object)DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }
                // SEMANA CICLO
                foreach (var rec in datos.semana_ciclo)
                {
                    var cmd = new SqlCommand(@"
        INSERT INTO mae_semana_periodo (
            cod_empresa, cod_empresa_unidad, cie_ano, cie_per, 
            num_semana, fec_ini, fec_fin, desc_semana, usu_creo, fec_creo, usu_modi, fec_modi
            
    
        ) VALUES (
            @cod_empresa, @cod_empresa_unidad, @cie_ano, @cie_per, 
            @num_semana, @fec_ini, @fec_fin, @desc_semana, @usu_creo, @fec_creo, @usu_modi, @fec_modi 
        );", connection, transaction);

                    // Identificadores base
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = anioActual;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = mesActual;
                    // Datos de la semana (Desde el DTO como String)
                    cmd.Parameters.Add("@num_semana", SqlDbType.Int).Value = rec.num_semana ?? (object)DBNull.Value;


                    cmd.Parameters.Add("@fec_ini", SqlDbType.DateTime).Value = rec.fec_ini;
                    cmd.Parameters.Add("@fec_fin", SqlDbType.DateTime).Value = rec.fec_fin;
                    cmd.Parameters.Add("@desc_semana", SqlDbType.VarChar).Value = rec.desc_semana ?? (object)DBNull.Value;
                    // Auditoría
                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = datos.username ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime).Value = DateTime.Now;
                    // Campos de modificación (NULL inicialmente según estándar de tus imágenes)
                    cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime).Value = DBNull.Value;

                    await cmd.ExecuteNonQueryAsync();
                }


                await transaction.CommitAsync();
            }


            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }


        public async Task<bool> EliminarSemanaAvance(MaeSemanaAvanceEliminarDto semana)
        {

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new SqlCommand(SqlQueries.SP_ELIMINAR_SEMANA_AVANCE, connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@num_semana", SqlDbType.Int).Value = semana.num_semana;
                        cmd.Parameters.Add("@fec_ini", SqlDbType.Date).Value = semana.fec_ini?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@fec_fin", SqlDbType.Date).Value = semana.fec_fin?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@desc_semana", SqlDbType.VarChar).Value = semana.desc_semana;

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;

            }
        }


        public async Task<bool> EliminarSemanaCiclo(MaeSemanaAvanceEliminarDto semana)
        {

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new SqlCommand(SqlQueries.SP_ELIMINAR_SEMANA_PERIODO, connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@num_semana", SqlDbType.Int).Value = semana.num_semana;
                        cmd.Parameters.Add("@fec_ini", SqlDbType.Date).Value = semana.fec_ini?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@fec_fin", SqlDbType.Date).Value = semana.fec_fin?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@desc_semana", SqlDbType.VarChar).Value = semana.desc_semana;

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;

            }
        }



        public async Task<bool> EliminarMetodoMinado(MaePerMetExplotacionEliminarDto semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string sql = SqlQueries.SP_ELIMINAR_MET_EXPLORACION;

                    using (var cmd = new SqlCommand(sql, connection))
                    {

                        cmd.CommandType = CommandType.StoredProcedure;


                        cmd.Parameters.Add("@cie_anio", SqlDbType.VarChar).Value = semana.anio;
                        cmd.Parameters.AddWithValue("@cie_per", SqlDbType.VarChar).Value = semana.mes;
                        cmd.Parameters.AddWithValue("@cod_metexp", SqlDbType.VarChar).Value = semana.cod_metexp;

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;
            }
        }

        public async Task<bool> EliminarEstandarExploracion(MaeExploEstandarEliminar semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string sql = SqlQueries.SP_ELIMINAR_EXP_ESTANDAR;

                    using (var cmd = new SqlCommand(sql, connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@cie_anio", SqlDbType.VarChar).Value = semana.anio;
                        cmd.Parameters.AddWithValue("@cie_per", SqlDbType.VarChar).Value = semana.mes;
                        cmd.Parameters.AddWithValue("@cod_zona", SqlDbType.VarChar).Value = semana.cod_zona;

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;
            }
        }


        public async Task<bool> EliminarEstandarAvance(MaeLaboratorioEstandarEliminarDto semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string sql = SqlQueries.SP_ELIMINAR_TIP_LAB_ESTANDAR;

                    using (var cmd = new SqlCommand(sql, connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@cie_anio", SqlDbType.VarChar).Value = semana.anio;
                        cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = semana.mes;
                        cmd.Parameters.Add("@cod_tiplab", SqlDbType.VarChar).Value = semana.cod_tiplab;

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;
            }
        }



    }



}
