using Microsoft.Data.SqlClient;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class RutasTransporteService
    {

        private readonly string _connectionString;


        public RutasTransporteService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<RutasTransporteDto>> ObtenerRutasTransporte(
            string? cod_empresa,
            string? cod_empresa_unidad,

            string? texto_busqueda)
        {
            List<RutasTransporteDto> lista = new();

            using SqlConnection cn = new SqlConnection(_connectionString);

            using SqlCommand cmd = new("SP_BUSCAR_RUTA_TRANSPORTE", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@cod_empresa", (object?)cod_empresa ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", (object?)cod_empresa_unidad ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@texto_busqueda", (object?)texto_busqueda ?? DBNull.Value);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new RutasTransporteDto
                {
                    cod_empresa = dr["cod_empresa"]?.ToString(),

                    cod_empresa_unidad =
                        dr["cod_empresa_unidad"]?.ToString(),

                    cod_ruta = dr["cod_ruta"]?.ToString(),

                    des_ruta = dr["des_ruta"]?.ToString(),

                    des_ruta_abrev =
                        dr["des_ruta_abrev"]?.ToString(),

                    cod_zona = dr["cod_zona"]?.ToString(),
                    des_zona = dr["des_zona"]?.ToString(),
                    ind_tipo_tolcanc =
                        dr["ind_tipo_tolcanc"]?.ToString(),

                    flg_vigente = dr["flg_vigente"] != DBNull.Value
                        ? Convert.ToInt32(dr["flg_vigente"])
                        : null,

                    cod_usuario_creo =
                        dr["cod_usuario_creo"]?.ToString(),

                    fec_usuario_creo =
                        dr["fec_usuario_creo"] != DBNull.Value
                            ? Convert.ToDateTime(
                                dr["fec_usuario_creo"]
                              )
                            : null,

                    cod_usuario_modi =
                        dr["cod_usuario_modi"]?.ToString(),

                    fec_usuario_modi =
                        dr["fec_usuario_modi"] != DBNull.Value
                            ? Convert.ToDateTime(
                                dr["fec_usuario_modi"]
                              )
                            : null
                });
            }

            return lista;
        }

        public async Task<string> ObtenerSiguienteCodigoRutaAsync()
        {
            using SqlConnection cn = new(_connectionString);

            string query = @"
                SELECT RIGHT(
                    '0000' +
                    CAST(
                        ISNULL(MAX(CAST(cod_ruta AS INT)), 0) + 1
                    AS VARCHAR),
                3)
                FROM MAE_RUTA_TRANSPORTE";

            using SqlCommand cmd = new(query, cn);

            await cn.OpenAsync();

            object? result = await cmd.ExecuteScalarAsync();

            return result?.ToString() ?? "0001";
        }




        public async Task<ResponseRutaTransporte> GuardarRutaTransporte(List<RutasTransporteDto> lista)
        {
            ResponseRutaTransporte response = new();

            using SqlConnection cn = new SqlConnection(_connectionString);

            await cn.OpenAsync();

            SqlTransaction transaction = cn.BeginTransaction();

            try
            {
                foreach (var item in lista)
                {
                    using SqlCommand cmd = new SqlCommand(
                        "SP_INSERTAR_RUTA_TRANSPORTE",
                        cn,
                        transaction
                    );

                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", "03");
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
                    cmd.Parameters.AddWithValue("@cod_ruta",
                        string.IsNullOrWhiteSpace(item.cod_ruta) ? DBNull.Value : item.cod_ruta);
                    cmd.Parameters.AddWithValue("@des_ruta", item.des_ruta);
                    cmd.Parameters.AddWithValue("@des_ruta_abrev",
                        string.IsNullOrWhiteSpace(item.des_ruta_abrev) ? DBNull.Value : item.des_ruta_abrev);
                    cmd.Parameters.AddWithValue("@cod_zona",
                        string.IsNullOrWhiteSpace(item.cod_zona) ? DBNull.Value : item.cod_zona);
                    cmd.Parameters.AddWithValue("@ind_tipo_tolcanc",
                        string.IsNullOrWhiteSpace(item.ind_tipo_tolcanc) ? DBNull.Value : item.ind_tipo_tolcanc);
                    cmd.Parameters.AddWithValue("@flg_vigente", item.flg_vigente);
                    cmd.Parameters.AddWithValue("@cod_usuario_creo",
                        string.IsNullOrWhiteSpace(item.cod_usuario_creo) ? DBNull.Value : item.cod_usuario_creo);
                    cmd.Parameters.AddWithValue("@cod_usuario_modi",
                        string.IsNullOrWhiteSpace(item.cod_usuario_modi) ? DBNull.Value : item.cod_usuario_modi);
                    cmd.Parameters.AddWithValue("@accion", item.accion);

                    using SqlDataReader dr = await cmd.ExecuteReaderAsync();

                    if (await dr.ReadAsync())
                    {
                        response.estado = dr["estado"] != DBNull.Value
                            ? Convert.ToInt32(dr["estado"])
                            : 0;

                        response.mensaje = dr["mensaje"] != DBNull.Value
                            ? dr["mensaje"].ToString()
                            : string.Empty;
                    }

                    await dr.CloseAsync();

                    if (response.estado != 1)
                    {
                        transaction.Rollback();
                        return response;
                    }
                }

                transaction.Commit();

                response.estado = 1;
                response.mensaje = "Datos guardados correctamente.";
            }
            catch (Exception ex)
            {
                if (transaction.Connection != null)
                {
                    transaction.Rollback();
                }

                response.estado = -1;
                response.mensaje = ex.Message;
            }

            return response;
        }



        public async Task<ResponseEliminarDto> EliminarRutaTramsporte(string cod_ruta)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_RUTA_TRANSPORTE", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cod_ruta", SqlDbType.VarChar, 20).Value = cod_ruta;

                    SqlParameter pEstado = new SqlParameter("@estado", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    SqlParameter pMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500)
                    {
                        Direction = ParameterDirection.Output
                    };

                    cmd.Parameters.Add(pEstado);
                    cmd.Parameters.Add(pMensaje);

                    await cn.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();

                    return new ResponseEliminarDto
                    {
                        estado = pEstado.Value != DBNull.Value ? (int)pEstado.Value : 0,
                        mensaje = pMensaje.Value?.ToString() ?? string.Empty
                    };
                }
            }
        }
    }
}
