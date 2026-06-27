using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using pass_siomm.Data;
using pass_siomm.Models;
using System.Data;
using System.Data.Common;

namespace pass_siomm.Services
{
    public class UserService
    {

        private readonly string _connectionString;

        public UserService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<bool> UserExistsAsync(string username)
        {
            try
            {
                await using var conn = new SqlConnection(_connectionString);
                await using var cmd = new SqlCommand(SqlQueries.SP_GET_HOME_SESSION, conn);

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
        }



    }
}


