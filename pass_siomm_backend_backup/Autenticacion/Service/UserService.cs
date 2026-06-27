using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
<<<<<<< HEAD
using pass_siomm_backend.Autenticacion.Data;
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
using pass_siomm_backend.Planeamiento.Data;
using System.Data;
using System.Data.Common;

namespace pass_siomm_backend.Autenticacion.Service
{
    public class UserService
    {

        private readonly string _connectionString;

        public UserService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

<<<<<<< HEAD
        //public async Task<bool> UserExistsAsync(string username)
        //{
        //    try
        //    {
        //        await using var conn = new SqlConnection(_connectionString);
        //        await using var cmd = new SqlCommand(SqlQueriesLogin.SP_GET_HOME_SESSION, conn);

        //        cmd.CommandType = CommandType.StoredProcedure;
        //        cmd.Parameters.Add("@cod_usuario", SqlDbType.VarChar, 50).Value = username;
        //        await conn.OpenAsync();

        //        var result = await cmd.ExecuteScalarAsync();
        //        return result != null && result != DBNull.Value;
        //    }

        //    catch (SqlException ex)
        //    {
        //        Console.WriteLine(ex);
        //        throw new Exception("Error de base de datos al validar el usuario.", ex);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        throw;
        //    }
        //}

        public async Task<MaeUsuarioDto?> UserExistsAsync(string username)
        {
            await using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueriesLogin.SP_GET_HOME_SESSION, conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@cod_usuario", SqlDbType.VarChar, 50).Value = username;

            await conn.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();

            if (!reader.Read())
                return null;

            var user = new MaeUsuarioDto
            {
                cod_empresa = reader["cod_empresa"]?.ToString(),
                cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                cod_usuario = reader["cod_usuario"]?.ToString(),

                ind_usu_min = reader["ind_usu_min"]?.ToString(),
                ind_usu_plt = reader["ind_usu_plt"]?.ToString(),
                ind_usu_pln = reader["ind_usu_pln"]?.ToString(),
                ind_usu_geo = reader["ind_usu_geo"]?.ToString(),
                ind_usu_lab = reader["ind_usu_lab"]?.ToString(),
                ind_usu_jefe_turno = reader["ind_usu_jefe_turno"]?.ToString(),
                ind_usu_jefe_zona_mina = reader["ind_usu_jefe_zona_mina"]?.ToString(),
                ind_usu_sup_mina = reader["ind_usu_sup_mina"]?.ToString(),
                ind_usu_sup = reader["ind_usu_sup"]?.ToString(),
                ind_usu_ing = reader["ind_usu_ing"]?.ToString(),
                ind_usu_sis = reader["ind_usu_sis"]?.ToString()
            };

            return user;
=======
        public async Task<bool> UserExistsAsync(string username)
        {
            try
            {
                await using var conn = new SqlConnection(_connectionString);
                await using var cmd = new SqlCommand(SqlQueriesLogin.SP_GET_HOME_SESSION, conn);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@cod_usuario", SqlDbType.VarChar, 50).Value = username;
                await conn.OpenAsync();

                var result = await cmd.ExecuteScalarAsync();
                return result != null && result != DBNull.Value;
            }

            catch (SqlException ex)
            {
                Console.WriteLine(ex);
                throw new Exception("Error de base de datos al validar el usuario.", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190
        }



    }
}


