using Microsoft.Data.SqlClient;
using pass_siomm_backend.Rutas.Data;
using System.Data;

namespace pass_siomm_backend.Utilitarios.Fechas_Filtros.Servicio
{
    public class FiltrosFechasService
    {

        private readonly string _connectionString;


        public FiltrosFechasService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<string>> ObtenerMeses(string anio)
        {
            var meses = new List<string>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_OBTENER_MESES, conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@anio", SqlDbType.VarChar, 4).Value = anio;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                meses.Add(reader["cie_per"].ToString());

            }

            return meses;
        }

        public async Task<List<string>> ObtenerAnio()
        {
            var anio = new List<string>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_OBTENER_ANIO, conn);

            cmd.CommandType = CommandType.StoredProcedure;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                anio.Add(reader["cie_ano"].ToString());
            }

            return anio;
        }
    }
}
