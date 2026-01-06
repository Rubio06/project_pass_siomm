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



        public async Task<bool> InsertarCopiarPeriodoAsync(CopiarPeriodoDto semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var cmd = new SqlCommand(SqlQueries.SP_INSERTAR_COPIAR_PERIODO, connection))
                    {

                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar).Value = semana.anioDestino;
                        cmd.Parameters.Add("@cie_per", SqlDbType.VarChar).Value = semana.mesDestino;
                        cmd.Parameters.Add("@fec_ini", SqlDbType.DateTime).Value = semana.fechaInicioDestino;
                        cmd.Parameters.Add("@fec_fin", SqlDbType.DateTime).Value = semana.fechaFinDestino;
                        cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar).Value = semana.username;

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

                    string sql =  SqlQueries.SP_ELIMINAR_EXP_ESTANDAR;

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
