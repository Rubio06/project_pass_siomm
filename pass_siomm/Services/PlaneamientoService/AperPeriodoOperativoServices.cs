using Microsoft.Data.SqlClient;
using pass_siomm.Data;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
using pass_siomm_backend.Models.RutasModels;

namespace pass_siomm_backend.Services.PlaneamientoService
{
    public class AperPeriodoOperativoServices
    {


        private readonly string _connectionString;

        public AperPeriodoOperativoServices(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }


        public async Task<List<string>> ObtenerMeses(string anio)
        {
            var meses = new List<string>();

            string query = @"select distinct cie_ano, cie_per from trb_cierre_periodo where cie_ano = @anio order by cie_per ASC";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);

            // ✅ Aquí agregas el parámetro que falta
            cmd.Parameters.AddWithValue("@anio", anio);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                meses.Add(reader["cie_per"].ToString());
            }

            return meses;
        }


        /* OBTENER AÑO */
        public async Task<List<string>> ObtenerAnio()
        {
            var anio = new List<string>();

            string query = @"select distinct cie_ano from trb_cierre_periodo";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                anio.Add(reader["cie_ano"].ToString());
            }

            return anio;
        }

        public async Task<List<AperPeriodoDto>> ObtenerFecha(string month, string anio)
        {
            var fechas = new List<AperPeriodoDto>();

            string query = @"SELECT 
                        cie_per,
                        fec_ini AS FechaInicio,
                        fec_fin AS FechaFin,
                        cie_ano AS Anio
                     FROM trb_cierre_periodo
                     WHERE cie_ano = @anio AND cie_per = @month
                     ORDER BY CAST(cie_per AS INT);";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@month", month);
            cmd.Parameters.AddWithValue("@anio", anio);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                fechas.Add(new AperPeriodoDto
                {
                    CiePer = reader["cie_per"].ToString(),
                    FechaInicio = Convert.ToDateTime(reader["FechaInicio"]),
                    FechaFin = Convert.ToDateTime(reader["FechaFin"]),
                    Anio = reader["Anio"].ToString()
                });
            }

            return fechas;
        }


    }
}
