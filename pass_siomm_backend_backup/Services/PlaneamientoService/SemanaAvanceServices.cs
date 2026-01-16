using Microsoft.Data.SqlClient;
using pass_siomm.Data;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
using System.Data;
using System.Globalization;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

            var jsonError = JsonSerializer.Serialize(semana, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            Console.WriteLine(jsonError);


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

        public async Task GuardarDatosAsync(DatosCompletosGuardarDto datos)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var transaction = connection.BeginTransaction();

            try
            {
                var periodo = datos.cierre_periodo.First();

                string anio = periodo.cie_ano;
                string mes = ConvertirPeriodo(periodo.cie_per);

                // DATOS DEL FORMULARIO
                await GuardarCierrePeriodoAsync(connection, transaction, datos.cierre_periodo, datos.username, datos.modo);
                await GuardarFactorAsync(connection, transaction, datos.factor, datos.username, anio, mes, datos.modo);
                //await GuardarFactorOperativoAsync(connection, transaction, datos.factorOperativo, datos.username, anio, mes, datos.modo);
                await GuardarOperativoDetalleAsync(connection, transaction, datos.operativo_detalle, datos.username, anio, mes, datos.modo);
                await GuardarCanchasAsync(connection, transaction, datos.canchas, datos.username, anio, mes, datos.modo);
                await GuardarFactorSobredisolucionAsync(connection, transaction, datos.factorSobredisolucion, datos.username, mes, anio, datos.modo);
                await GuardarRecuperacionAsync(connection, transaction, datos.recuperacionBudget, datos.username, mes, anio, datos.modo);





                ///DATOS DE LAS TABLAS



                await GuardarSemanaAvanceAsync(connection, transaction, datos.semana_avance, datos.username, mes, anio, datos.modo);


                //await GuardarLaboratorioAsync(connection, transaction, datos.laboratorio_estandar, datos.username, datos.anioActual, datos.mesActual);
                //await GuardarMetodoMinadoAsync(connection, transaction, datos.metodo_minado, datos.username, datos.anioActual, datos.mesActual);




                //await GuardarExploracionAsync(connection, transaction, datos.exploracion_extandar, datos.username, datos.anioActual, datos.mesActual);
                //await GuardarSemanaCicloAsync(connection, transaction, datos.semana_ciclo, datos.username, datos.anioActual, datos.mesActual);



                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        private string ConvertirPeriodo(string valor)
        {
            return valor switch
            {
                "Enero" => "01",
                "Febrero" => "02",
                "Marzo" => "03",
                "Abril" => "04",
                "Mayo" => "05",
                "Junio" => "06",
                "Julio" => "07",
                "Agosto" => "08",
                "Septiembre" => "09",
                "Octubre" => "10",
                "Noviembre" => "11",
                "Diciembre" => "12",
                _ => throw new ArgumentException("Periodo inválido")
            };
        }



        private async Task GuardarCierrePeriodoAsync(
                SqlConnection conn,
                SqlTransaction trx,
                List<AperPeriodoCierreGuardarDto> periodos,
                string? username, string modo)
        {
            Console.WriteLine("mis datos de llegada son: " + JsonSerializer.Serialize(periodos, new JsonSerializerOptions { WriteIndented = true }));

            //return Ok("Esa bien");

            if (periodos == null || periodos.Count == 0)
                return;

            foreach (var periodo in periodos)
            {
                var periodoConvertido = ConvertirPeriodo(periodo.cie_per);

                using var cmd = new SqlCommand("SP_GUARDAR_CIERRE_PERIODO", conn, trx);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = periodo.cie_ano;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 10)
                              .Value = periodoConvertido;

                cmd.Parameters.Add("@fec_ini", SqlDbType.DateTime)
                    .Value = periodo.fec_ini ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_fin", SqlDbType.DateTime)
                    .Value = periodo.fec_fin ?? (object)DBNull.Value;


                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = username ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = DateTime.Now;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;

                //await cmd.ExecuteNonQueryAsync();
            }

            Console.WriteLine("mis datos de llegada son: " + JsonSerializer.Serialize(periodos, new JsonSerializerOptions { WriteIndented = true }));

        }




        private async Task GuardarFactorAsync(
            SqlConnection conn,
            SqlTransaction trx,
            List<MaeFactorGuardarDto> factores,
            string? username, string anio, string mes, string modo)
        {
            if (factores == null || factores.Count == 0) return;

            foreach (var fac in factores)
            {
                using var cmd = new SqlCommand("SP_GUARDAR_MAE_FACTOR", conn, trx);
                cmd.CommandType = CommandType.StoredProcedure;


                // 🔹 Identificadores

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = anio;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = mes;

                // 🔹 Factores (DECIMAL / NUMERIC → decimal?)
                cmd.Parameters.Add("@fac_denmin", SqlDbType.Decimal)
                    .Value = fac.fac_denmin ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_denminyac", SqlDbType.Decimal)
                    .Value = fac.fac_denminyac ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_dendes", SqlDbType.Decimal)
                    .Value = fac.fac_dendes ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_dialab", SqlDbType.Decimal)
                    .Value = fac.fac_dialab ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_vptmin", SqlDbType.Decimal)
                    .Value = fac.fac_vptmin ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_tarhor", SqlDbType.Decimal)
                    .Value = fac.fac_tarhor ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_porcum", SqlDbType.Decimal)
                    .Value = fac.fac_porcum ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_porhum", SqlDbType.Decimal)
                    .Value = fac.fac_porhum ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fac_tms_dif", SqlDbType.Decimal)
                    .Value = fac.fac_tms_dif ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = username ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;

                await cmd.ExecuteNonQueryAsync();
            }
        }



        ///DESCONOSCO POR QUE SE GUARDA
        //private async Task GuardarFactorOperativoAsync(
        //        SqlConnection conn,
        //        SqlTransaction trx,
        //        List<MaeFactorOperativoGuardarDto> factoresOperativos, string? username, string anio, string mes, string modo)
        //{
        //    if (factoresOperativos == null || factoresOperativos.Count == 0)
        //        return;

        //    foreach (var fac in factoresOperativos)
        //    {
        //        using var cmd = new SqlCommand("SP_GUARDAR_MAE_VAL_OPERATIVO", conn, trx);
        //        cmd.CommandType = CommandType.StoredProcedure;

        //        // 🔹 Claves

        //        cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
        //            .Value = "03";

        //        cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
        //            .Value = "01";


        //        cmd.Parameters.Add("@val_ano", SqlDbType.VarChar, 4).Value = anio;
        //        cmd.Parameters.Add("@val_per", SqlDbType.VarChar, 2).Value = mes;
        //        cmd.Parameters.Add("@val_vig", SqlDbType.VarChar).Value = fac.val_vig ?? (object)DBNull.Value;

        //        // 🔹 Valores AG
        //        cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal).Value = fac.val_fac_ag ?? (object)DBNull.Value;
        //        cmd.Parameters.Add("@val_pre_ag", SqlDbType.Decimal).Value = fac.val_pre_ag ?? (object)DBNull.Value;

        //        // 🔹 Valores CU
        //        cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal).Value = fac.val_fac_cu ?? (object)DBNull.Value;
        //        cmd.Parameters.Add("@val_pre_cu", SqlDbType.Decimal).Value = fac.val_pre_cu ?? (object)DBNull.Value;

        //        // 🔹 Valores PB
        //        cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal).Value = fac.val_fac_pb ?? (object)DBNull.Value;
        //        cmd.Parameters.Add("@val_pre_pb", SqlDbType.Decimal).Value = fac.val_pre_pb ?? (object)DBNull.Value;

        //        // 🔹 Valores ZN
        //        cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal).Value = fac.val_fac_zn ?? (object)DBNull.Value;
        //        cmd.Parameters.Add("@val_pre_zn", SqlDbType.Decimal).Value = fac.val_pre_zn ?? (object)DBNull.Value;

        //        // 🔹 Valores AU
        //        cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal).Value = fac.val_fac_au ?? (object)DBNull.Value;
        //        cmd.Parameters.Add("@val_pre_au", SqlDbType.Decimal).Value = fac.val_pre_au ?? (object)DBNull.Value;

        //        // 🔹 Auditoría
        //        cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20).Value = username ?? (object)DBNull.Value;

        //        cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
        //            .Value = modo;

        //        await cmd.ExecuteNonQueryAsync();

        //    }
        //}



        private async Task GuardarOperativoDetalleAsync(
                    SqlConnection conn,
                    SqlTransaction trx,
                    List<MaeValOperativoDetalleGuardarDto> detalles, string? username, string anio, string mes, string modo)
        {
            // 1️⃣ Validación básica
            if (detalles == null || detalles.Count == 0)
                return;

            // 2️⃣ Recorrer la lista
            foreach (var d in detalles)
            {
                using var cmd = new SqlCommand(
                    "SP_GUARDAR_MAE_VAL_OPERATIVO_DETALLE",
                    conn,
                    trx
                );

                cmd.CommandType = CommandType.StoredProcedure;

                // 🔹 Claves

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@val_ano", SqlDbType.VarChar, 4)
                    .Value = anio ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_per", SqlDbType.VarChar, 2)
                    .Value = mes ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_tipo_fac", SqlDbType.VarChar, 5)
                    .Value = d.val_tipo_fac ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_des_tipo_fac", SqlDbType.VarChar, 20)
                    .Value = d.val_des_tipo_fac ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_ind_principal", SqlDbType.VarChar, 1)
                    .Value = d.val_ind_principal ?? (object)DBNull.Value;

                // 🔹 Factores
                cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal)
                    .Value = d.val_fac_ag ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal)
                    .Value = d.val_fac_cu ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal)
                    .Value = d.val_fac_pb ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal)
                    .Value = d.val_fac_zn ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal)
                    .Value = d.val_fac_au ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_rec_ag", SqlDbType.Decimal)
                    .Value = d.val_fac_rec_ag ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_rec_cu", SqlDbType.Decimal)
                    .Value = d.val_fac_rec_cu ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_rec_pb", SqlDbType.Decimal)
                    .Value = d.val_fac_rec_pb ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_rec_zn", SqlDbType.Decimal)
                    .Value = d.val_fac_rec_zn ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_rec_au", SqlDbType.Decimal)
                    .Value = d.val_fac_rec_au ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = username ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = d.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = d.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = d.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;

                // 🔹 Ejecutar SP
                await cmd.ExecuteNonQueryAsync();
            }
        }


        private async Task GuardarCanchasAsync(
                SqlConnection conn,
                SqlTransaction trx,
                List<MaeValCanchasGuardarDto> canchas, string? username, string mes, string anio, string modo)
        {
            // 1️⃣ Validación
            if (canchas == null || canchas.Count == 0)
                return;

            foreach (var v in canchas)
            {
                using var cmd = new SqlCommand("SP_GUARDAR_MAE_VAL_CANCHAS", conn, trx);
                cmd.CommandType = CommandType.StoredProcedure;

                // 🔹 Claves

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = mes ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = anio ?? (object)DBNull.Value;

                // 🔹 Valores decimales
                cmd.Parameters.Add("@val_tms", SqlDbType.Decimal)
                    .Value = v.val_tms ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_ag", SqlDbType.Decimal)
                    .Value = v.val_ag ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_cu", SqlDbType.Decimal)
                    .Value = v.val_cu ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_pb", SqlDbType.Decimal)
                    .Value = v.val_pb ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_zn", SqlDbType.Decimal)
                    .Value = v.val_zn ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_vpt", SqlDbType.Decimal)
                    .Value = v.val_vpt ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = username ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = v.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = v.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = v.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;

                // 🔹 Ejecutar SP
                await cmd.ExecuteNonQueryAsync();
            }
        }

        private async Task GuardarFactorSobredisolucionAsync(
                SqlConnection conn,
                SqlTransaction trx,
                List<MaeFactorSobredisolucionGuardarDto> factores, string? username, string mes, string anio, string modo)
        {
            // 1️⃣ Validación
            if (factores == null || factores.Count == 0)
                return;

            // 2️⃣ Recorrer lista
            foreach (var f in factores)
            {
                using var cmd = new SqlCommand(
                    "SP_GUARDAR_MAE_FACTOR_SOBREDISOLUCION",
                    conn,
                    trx
                );

                cmd.CommandType = CommandType.StoredProcedure;

                // 🔹 Claves

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = anio ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = mes ?? (object)DBNull.Value;

                // 🔹 Factores decimales
                cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal)
                    .Value = f.val_fac_ag ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal)
                    .Value = f.val_fac_cu ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal)
                    .Value = f.val_fac_pb ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal)
                    .Value = f.val_fac_zn ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal)
                    .Value = f.val_fac_au ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = username ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = f.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = f.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = f.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;

                // 4️⃣ Ejecutar
                await cmd.ExecuteNonQueryAsync();
            }
        }




        private async Task GuardarRecuperacionAsync(
                SqlConnection conn,
                SqlTransaction trx,
                List<MaeFactorRecuperacionGuardarDto> recuperaciones, string? username, string mes, string anio, string modo)
        {
            // 1️⃣ Validación

            if (recuperaciones == null || recuperaciones.Count == 0)
                return;

            foreach (var f in recuperaciones)
            {
                using var cmd = new SqlCommand("SP_GUARDAR_MAE_FACTOR_RECUPERACION", conn, trx);
                cmd.CommandType = CommandType.StoredProcedure;

                // 🔹 Claves

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = anio ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = mes ?? (object)DBNull.Value;

                // 🔹 Factores decimales
                cmd.Parameters.Add("@val_fac_ag", SqlDbType.Decimal)
                    .Value = f.val_fac_ag ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_cu", SqlDbType.Decimal)
                    .Value = f.val_fac_cu ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_pb", SqlDbType.Decimal)
                    .Value = f.val_fac_pb ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_zn", SqlDbType.Decimal)
                    .Value = f.val_fac_zn ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_au", SqlDbType.Decimal)
                    .Value = f.val_fac_au ?? (object)DBNull.Value;

                // 🔹 Factores presupuestados
                cmd.Parameters.Add("@val_fac_bud_ag", SqlDbType.Decimal)
                    .Value = f.val_fac_bud_ag ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_bud_cu", SqlDbType.Decimal)
                    .Value = f.val_fac_bud_cu ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_bud_pb", SqlDbType.Decimal)
                    .Value = f.val_fac_bud_pb ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_bud_zn", SqlDbType.Decimal)
                    .Value = f.val_fac_bud_zn ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_fac_bud_au", SqlDbType.Decimal)
                    .Value = f.val_fac_bud_au ?? (object)DBNull.Value;

                // 🔹 Consumos
                cmd.Parameters.Add("@val_con_ag", SqlDbType.Decimal)
                    .Value = f.val_con_ag ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_con_cu", SqlDbType.Decimal)
                    .Value = f.val_con_cu ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_con_pb", SqlDbType.Decimal)
                    .Value = f.val_con_pb ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_con_zn", SqlDbType.Decimal)
                    .Value = f.val_con_zn ?? (object)DBNull.Value;

                cmd.Parameters.Add("@val_con_au", SqlDbType.Decimal)
                    .Value = f.val_con_au ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = username ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = f.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = f.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = f.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;

                await cmd.ExecuteNonQueryAsync();
            }
        }




        private async Task GuardarLaboratorioAsync(
            SqlConnection conn,
            SqlTransaction trx,
            List<MaeLaboratorioEstandarGuardarDto> laboratorios, string? username, string mes, string anio, string modo)
        {
            // 1️⃣ Validación
            if (laboratorios == null || laboratorios.Count == 0)
                return;

            // 2️⃣ Recorrer lista
            foreach (var l in laboratorios)
            {
                using var cmd = new SqlCommand(
                    "SP_GUARDAR_MAE_LABORATORIO_ESTANDAR",
                    conn,
                    trx
                );

                cmd.CommandType = CommandType.StoredProcedure;

                // 🔹 Claves

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = anio ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = mes ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cod_tiplab", SqlDbType.VarChar, 10)
                    .Value = l.cod_tiplab ?? (object)DBNull.Value;

                // 🔹 Valores decimales
                cmd.Parameters.Add("@nro_lab_ancho", SqlDbType.Decimal)
                    .Value = l.nro_lab_ancho ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_altura", SqlDbType.Decimal)
                    .Value = l.nro_lab_altura ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_pieper", SqlDbType.Decimal)
                    .Value = l.nro_lab_pieper ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_broca", SqlDbType.Decimal)
                    .Value = l.nro_lab_broca ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_barcon", SqlDbType.Decimal)
                    .Value = l.nro_lab_barcon ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_barren", SqlDbType.Decimal)
                    .Value = l.nro_lab_barren ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_facpot", SqlDbType.Decimal)
                    .Value = l.nro_lab_facpot ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_fulmin", SqlDbType.Decimal)
                    .Value = l.nro_lab_fulmin ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_conect", SqlDbType.Decimal)
                    .Value = l.nro_lab_conect ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_punmar", SqlDbType.Decimal)
                    .Value = l.nro_lab_punmar ?? (object)DBNull.Value;

                cmd.Parameters.Add("@nro_lab_tabla", SqlDbType.Decimal)
                    .Value = l.nro_lab_tabla ?? (object)DBNull.Value;

                // 🔹 Indicador
                cmd.Parameters.Add("@ind_lab_apr", SqlDbType.VarChar, 1)
                    .Value = l.ind_lab_apr ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = l.usu_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = l.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = l.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = l.fec_modi ?? (object)DBNull.Value;

                // 🔹 Aprobación
                cmd.Parameters.Add("@usu_apr", SqlDbType.VarChar, 20)
                    .Value = l.usu_apr ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_apr", SqlDbType.DateTime)
                    .Value = l.fec_apr ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;

                // 🔹 Ejecutar SP
                await cmd.ExecuteNonQueryAsync();

            }
        }


        private async Task GuardarMetodoMinadoAsync(
            SqlConnection conn,
            SqlTransaction trx,
            List<MaePerMetExplotacionGuardarDto> metodos, string? username, string mes, string anio, string modo)
        {
            if (metodos == null || metodos.Count == 0)
                return;

            foreach (var m in metodos)
            {
                using var cmd = new SqlCommand("SP_GUARDAR_MAE_METODO_MINADO", conn, trx);
                cmd.CommandType = CommandType.StoredProcedure;

                // 🔹 Claves

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = anio ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = mes ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cod_metexp", SqlDbType.VarChar, 3)
                    .Value = m.cod_metexp ?? (object)DBNull.Value;

                // 🔹 Datos adicionales
                cmd.Parameters.Add("@nom_metexp", SqlDbType.VarChar, 30)
                    .Value = m.nom_metexp ?? (object)DBNull.Value;

                // 🔹 Factor decimal
                cmd.Parameters.Add("@fac_metexp", SqlDbType.Decimal)
                    .Value = m.fac_metexp ?? (object)DBNull.Value;

                // 🔹 Indicadores
                cmd.Parameters.Add("@ind_act", SqlDbType.VarChar, 1)
                    .Value = m.ind_act ?? (object)DBNull.Value;

                cmd.Parameters.Add("@ind_calculo_dilucion", SqlDbType.VarChar, 1)
                    .Value = m.ind_calculo_dilucion ?? (object)DBNull.Value;

                cmd.Parameters.Add("@ind_calculo_leyes_min", SqlDbType.VarChar, 1)
                    .Value = m.ind_calculo_leyes_min ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = m.usu_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = m.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = m.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = m.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;




                // 🔹 Ejecutar SP
                await cmd.ExecuteNonQueryAsync();
            }
        }


        ///LO DEJO PARA EL ULTIMO
        private async Task GuardarSemanaCicloAsync(
            SqlConnection conn,
            SqlTransaction trx,
            List<MaeSemanaCicloGuardarDto> semanas, string? username, string mes, string anio, string modo)
        {
            // 1️⃣ Validación
            if (semanas == null || semanas.Count == 0)
                return;

            // 2️⃣ Recorrer lista
            foreach (var s in semanas)
            {
                using var cmd = new SqlCommand(
                    "SP_GUARDAR_MAE_SEMANA_CICLO",
                    conn,
                    trx
                );

                cmd.CommandType = CommandType.StoredProcedure;


                // 🔹 Claves

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = anio ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = mes ?? (object)DBNull.Value;

                cmd.Parameters.Add("@num_semana", SqlDbType.Int)
                    .Value = s.num_semana;

                // 🔹 Fechas
                cmd.Parameters.Add("@fec_ini", SqlDbType.DateTime)
                    .Value = s.fec_ini ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_fin", SqlDbType.DateTime)
                    .Value = s.fec_fin ?? (object)DBNull.Value;

                // 🔹 Descripción
                cmd.Parameters.Add("@desc_semana", SqlDbType.VarChar, 50)
                    .Value = s.desc_semana ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = s.usu_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = s.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = s.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = s.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;


                // 🔹 Ejecutar SP
                await cmd.ExecuteNonQueryAsync();
            }
        }


        private async Task GuardarSemanaAvanceAsync(
            SqlConnection conn,
            SqlTransaction trx,
            List<MaeSemanaAvanceGuardarDto> semanas, string? username, string anio, string mes, string modo)
        {
            Console.WriteLine(JsonSerializer.Serialize(semanas, new JsonSerializerOptions { WriteIndented = true }));


            // 1️⃣ Validación
            if (semanas == null || semanas.Count == 0)
                return;

            // 2️⃣ Recorrer lista
            foreach (var p in semanas)
            {
                using var cmd = new SqlCommand(
                    "SP_GUARDAR_MAE_SEMANA_AVANCE",
                    conn,
                    trx
                );

                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = p.cie_ano ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = p.cie_per ?? (object)DBNull.Value;

                cmd.Parameters.Add("@num_semana", SqlDbType.Int)
                    .Value = p.num_semana;

                // 🔹 Fechas
                cmd.Parameters.Add("@fec_ini", SqlDbType.DateTime)
                    .Value = p.fec_ini ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_fin", SqlDbType.DateTime)
                    .Value = p.fec_fin ?? (object)DBNull.Value;

                // 🔹 Descripción de la semana
                cmd.Parameters.Add("@desc_semana", SqlDbType.VarChar, 50)
                    .Value = p.desc_semana ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = p.usu_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = p.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = username ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = p.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;


                // 🔹 Ejecutar SP
                // 4️⃣ Ejecutar
                await cmd.ExecuteNonQueryAsync();
            }
        }

        private async Task GuardarExploracionAsync(
                SqlConnection conn,
                SqlTransaction trx,
                List<MaeExploEstandarGuardarDto> exploraciones, string? username, string anio, string mes, string modo)
        {
            // 1️⃣ Validación
            if (exploraciones == null || exploraciones.Count == 0)
                return;

            // 2️⃣ Recorrer lista
            foreach (var lab in exploraciones)
            {
                using var cmd = new SqlCommand(
                    "SP_GUARDAR_MAE_EXPLORACION_ESTANDAR",
                    conn,
                    trx
                );


                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2)
                    .Value = "03";

                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2)
                    .Value = "01";

                cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4)
                    .Value = anio ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2)
                    .Value = mes ?? (object)DBNull.Value;

                cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10)
                    .Value = lab.cod_zona ?? (object)DBNull.Value;

                // 🔹 Valores decimales (nullable)
                cmd.Parameters.Add("@lab_pieper", SqlDbType.Decimal)
                    .Value = lab.lab_pieper ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_broca", SqlDbType.Decimal)
                    .Value = lab.lab_broca ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_barcon", SqlDbType.Decimal)
                    .Value = lab.lab_barcon ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_barren", SqlDbType.Decimal)
                    .Value = lab.lab_barren ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_facpot", SqlDbType.Decimal)
                    .Value = lab.lab_facpot ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_fulmin", SqlDbType.Decimal)
                    .Value = lab.lab_fulmin ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_conect", SqlDbType.Decimal)
                    .Value = lab.lab_conect ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_punmar", SqlDbType.Decimal)
                    .Value = lab.lab_punmar ?? (object)DBNull.Value;

                cmd.Parameters.Add("@lab_tabla", SqlDbType.Decimal)
                    .Value = lab.lab_tabla ?? (object)DBNull.Value;

                // 🔹 Indicadores
                cmd.Parameters.Add("@lab_apr", SqlDbType.VarChar, 1)
                    .Value = lab.lab_apr ?? (object)DBNull.Value;

                // 🔹 Auditoría
                cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 20)
                    .Value = lab.usu_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_creo", SqlDbType.DateTime)
                    .Value = lab.fec_creo ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_modi", SqlDbType.VarChar, 20)
                    .Value = lab.usu_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_modi", SqlDbType.DateTime)
                    .Value = lab.fec_modi ?? (object)DBNull.Value;

                cmd.Parameters.Add("@usu_apr", SqlDbType.VarChar, 20)
                    .Value = lab.usu_apr ?? (object)DBNull.Value;

                cmd.Parameters.Add("@fec_apr", SqlDbType.DateTime)
                    .Value = lab.fec_apr ?? (object)DBNull.Value;

                cmd.Parameters.Add("@modo", SqlDbType.Char, 1)
                    .Value = modo;


                // 🔹 Ejecutar SP
                await cmd.ExecuteNonQueryAsync();
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
