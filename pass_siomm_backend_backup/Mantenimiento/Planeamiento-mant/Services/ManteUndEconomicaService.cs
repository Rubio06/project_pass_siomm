using Microsoft.Data.SqlClient;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class ManteUndEconomicaService
    {

        private readonly string _connectionString;


        public ManteUndEconomicaService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<MaeEmpresaDto>> ObtenerEmpresa()
        {
            var lista = new List<MaeEmpresaDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                string query = "SELECT * FROM PAS_STD.dbo.mae_empresa WHERE est_empresa = 'ACT'";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        lista.Add(new MaeEmpresaDto
                        {
                            cod_empresa = dr["cod_empresa"]?.ToString(),
                            nom_empresa = dr["nom_empresa"]?.ToString()
                        });
                    }
                }
            }

            return lista;
        }

        public async Task<List<MaeEmpresaUnidadDto>> ObtenerEmpresaUnidad()
        {
            var lista = new List<MaeEmpresaUnidadDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                string query = "SELECT * FROM PAS_STD.dbo.mae_empresa_unidad WHERE est_empresa_unidad = 'ACT'";

                using (SqlCommand cmd = new SqlCommand(query, cn))
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        lista.Add(new MaeEmpresaUnidadDto
                        {
                            cod_empresa = dr["cod_empresa"]?.ToString(),
                            cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                            nom_empresa_unidad = dr["nom_empresa_unidad"]?.ToString()
                        });
                    }
                }
            }

            return lista;
        }

        public async Task<List<MaeUndEconomicaDto>> ObtenerUndEconomica(string cod_empresa, string cod_empresa_unindad, string? texto_busqueda)
        {
            var lista = new List<MaeUndEconomicaDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_OBTENER_UND_ECONOMICA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", cod_empresa_unindad);
                    cmd.Parameters.AddWithValue("@texto_busqueda", texto_busqueda);

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            lista.Add(new MaeUndEconomicaDto
                            {
                                cod_empresa = dr["cod_empresa"]?.ToString(),
                                cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                                cod_und_econom = dr["cod_und_econom"]?.ToString(),
                                nom_und_econom = dr["nom_und_econom"]?.ToString(),
                                des_und_econom = dr["des_und_econom"]?.ToString(),
                                ind_act = dr["ind_act"]?.ToString()
                            });
                        }
                    }
                }
            }

            return lista;
        }

        public async Task<(bool ok, string mensaje)> EliminarUndEconomica(string cod_empresa, string cod_empresa_unidad, string cod_und_econom)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_UND_ECONOMICA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_und_econom", cod_und_econom);

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        if (await dr.ReadAsync())
                        {
                            bool estado = Convert.ToInt32(dr["estado"]) == 1;
                            string mensaje = dr["mensaje"].ToString();

                            return (estado, mensaje);
                        }
                    }
                }
            }

            return (false, "No se obtuvo respuesta del servidor");
        }

        public async Task<RespuestaDto> InsertarUnidadEconomica(List<InsertarUndEconomDto> dto)
        {
            var response = new RespuestaDto();

            try
            {
                foreach (var item in dto)
                {
                    using (SqlConnection cn = new SqlConnection(_connectionString))
                    {
                        await cn.OpenAsync();

                        using (SqlCommand cmd = new SqlCommand("SP_INSERTAR_UND_ECONOMICA", cn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.Add("@accion", SqlDbType.Char, 1).Value = item.accion;

                            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = item.cod_empresa;
                            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = item.cod_empresa_unidad;
                            cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 10).Value = item.cod_und_econom;
                            cmd.Parameters.Add("@nom_und_econom", SqlDbType.VarChar, 50).Value = item.nom_und_econom;
                            cmd.Parameters.Add("@des_und_econom", SqlDbType.VarChar, 100).Value = item.des_und_econom;
                            cmd.Parameters.Add("@ind_act", SqlDbType.Char, 1).Value = item.ind_act;
                            cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 50).Value = item.usu_creo;
                            cmd.Parameters.Add("@cod_und_econom_dhlogger", SqlDbType.VarChar, 50).Value = item.cod_und_econom_dhlogger;

                            using (var reader = await cmd.ExecuteReaderAsync())
                            {
                                if (await reader.ReadAsync())
                                {
                                    response.estado = reader["estado"] != DBNull.Value
                                        ? Convert.ToInt32(reader["estado"])
                                        : 0;

                                    response.mensaje = reader["mensaje"]?.ToString() ?? "";
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.estado = 0;
                response.mensaje = $"Error: {ex.Message}";
            }

            return response;
        }
        //public class RespuestaDto
        //{
        //    public int estado { get; set; }
        //    public string mensaje { get; set; }
        //}


        public async Task<string> ObtenerSiguienteCodigoUnidadEconomica()
        {
            string siguienteCodigo = "01";

            try
            {
                using (SqlConnection cn = new SqlConnection(_connectionString))
                {
                    await cn.OpenAsync();

                    string sql = @"
                            SELECT RIGHT('00' + CAST(
                                ISNULL(MAX(CAST(cod_und_econom AS INT)), 0) + 1
                            AS VARCHAR), 2) AS siguiente
                            FROM mae_und_economica
                            WHERE cod_empresa = '03'
                               AND cod_empresa_unidad = '01'
                        ";

                    using (SqlCommand cmd = new SqlCommand(sql, cn))
                    {

                        var result = await cmd.ExecuteScalarAsync();

                        if (result != null && result != DBNull.Value)
                        {
                            siguienteCodigo = result.ToString();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener código: " + ex.Message);
            }

            return siguienteCodigo;
        }








    }
}
