using Microsoft.Data.SqlClient;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class RutasTransporteMovimientoService
    {

        private readonly string _connectionString;


        public RutasTransporteMovimientoService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<RutasTransporteMovimientoDto>> ObtenerRutasTransporteMovimiento(
            string? cod_empresa,
            string? cod_empresa_unidad,

            string? texto_busqueda)
        {
            List<RutasTransporteMovimientoDto> lista = new();

            using SqlConnection cn = new SqlConnection(_connectionString);

            using SqlCommand cmd = new("SP_BUSCAR_RUTA_TRANSPORTE_MOVIMIENTO", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@cod_empresa", (object?)cod_empresa ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", (object?)cod_empresa_unidad ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@texto_busqueda", (object?)texto_busqueda ?? DBNull.Value);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new RutasTransporteMovimientoDto
                {
                    cod_empresa =
                        dr["cod_empresa"]?.ToString(),

                    cod_empresa_unidad =
                        dr["cod_empresa_unidad"]?.ToString(),

                    cod_ruta_transporte =
                        dr["cod_ruta_transporte"]?.ToString(),

                    cod_ruta_origen =
                        dr["cod_ruta_origen"]?.ToString(),

                    cod_ruta_destino =
                        dr["cod_ruta_destino"]?.ToString(),

                    des_ruta_origen =
                        dr["des_ruta_origen"]?.ToString(),


                    des_ruta_destino =
                        dr["des_ruta_destino"]?.ToString(),


                    est_ruta_transporte =
                        dr["est_ruta_transporte"]?.ToString(),

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


        public async Task<List<MaeRutaTransporteList>> ListarRutasTransporte()
        {
            var listaRutas = new List<MaeRutaTransporteList>();

            string query = @"
                    SELECT
                        cod_ruta,
                        des_ruta
                    FROM mae_ruta_transporte
                    ORDER BY des_ruta
                ";

            try
            {
                using SqlConnection connection =
                    new SqlConnection(_connectionString);

                using SqlCommand command =
                    new SqlCommand(query, connection);

                command.CommandType = CommandType.Text;

                await connection.OpenAsync();

                using SqlDataReader reader =
                    await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    var ruta = new MaeRutaTransporteList
                    {
                        cod_ruta = reader["cod_ruta"] != DBNull.Value
                            ? reader["cod_ruta"].ToString()
                            : string.Empty,

                        des_ruta = reader["des_ruta"] != DBNull.Value
                            ? reader["des_ruta"].ToString()
                            : string.Empty
                    };

                    listaRutas.Add(ruta);
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    "Error al consultar rutas transporte: "
                    + ex.Message
                );
            }

            return listaRutas;
        }

        public async Task<string> ObtenerSiguienteCodigoRutaMovimientoAsync()
        {
            using SqlConnection cn = new(_connectionString);

            string query = @"
                SELECT RIGHT(
                    '0000' +
                    CAST(
                        ISNULL(MAX(CAST(cod_ruta_transporte AS INT)), 0) + 1
                    AS VARCHAR),
                3)
                FROM DET_RUTA_TRANSPORTE";

            using SqlCommand cmd = new(query, cn);

            await cn.OpenAsync();

            object? result = await cmd.ExecuteScalarAsync();

            return result?.ToString() ?? "0001";
        }






        public async Task<ResponseNivelDto> GuardarRutaTransporteMovimiento(List<RutasTransporteMovimientoDto> lista)
        {
            ResponseNivelDto response = new();

            using SqlConnection cn = new SqlConnection(_connectionString);
            await cn.OpenAsync();
            SqlTransaction transaction = cn.BeginTransaction();

            try
            {
                foreach (var item in lista)
                {
                    using SqlCommand cmd = new SqlCommand("SP_INSERTAR_RUTA_TRANSPORTE_MOVIMIENTO", cn, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;


                    // =========================================
                    // PARAMETROS
                    // =========================================

                    cmd.Parameters.AddWithValue(
                        "@cod_empresa",
                        "03"
                    );

                    cmd.Parameters.AddWithValue(
                        "@cod_empresa_unidad",
                        "01"
                    );

                    cmd.Parameters.AddWithValue(
                        "@cod_ruta_transporte",
                        string.IsNullOrWhiteSpace(
                            item.cod_ruta_transporte
                        )
                            ? DBNull.Value
                            : item.cod_ruta_transporte
                    );

                    cmd.Parameters.AddWithValue(
                        "@cod_ruta_origen",
                        string.IsNullOrWhiteSpace(
                            item.cod_ruta_origen
                        )
                            ? DBNull.Value
                            : item.cod_ruta_origen
                    );

                    cmd.Parameters.AddWithValue(
                        "@cod_ruta_destino",
                        string.IsNullOrWhiteSpace(
                            item.cod_ruta_destino
                        )
                            ? DBNull.Value
                            : item.cod_ruta_destino
                    );

                    cmd.Parameters.AddWithValue(
                        "@est_ruta_transporte",
                        string.IsNullOrWhiteSpace(
                            item.est_ruta_transporte
                        )
                            ? DBNull.Value
                            : item.est_ruta_transporte
                    );

                    cmd.Parameters.AddWithValue(
                        "@cod_usuario_creo",
                        string.IsNullOrWhiteSpace(
                            item.cod_usuario_creo
                        )
                            ? DBNull.Value
                            : item.cod_usuario_creo
                    );

                    cmd.Parameters.AddWithValue(
                        "@cod_usuario_modi",
                        string.IsNullOrWhiteSpace(
                            item.cod_usuario_modi
                        )
                            ? DBNull.Value
                            : item.cod_usuario_modi
                    );

                    cmd.Parameters.AddWithValue(
                        "@accion",
                        item.accion
                    );
                    using SqlDataReader dr = await cmd.ExecuteReaderAsync();

                    int estadoSql = 0;
                    string mensajeSql = "";

                    if (await dr.ReadAsync())
                    {
                        // 🎯 Capturamos como INT para soportar el -1 del CATCH de SQL
                        estadoSql = Convert.ToInt32(dr["estado"]);
                        mensajeSql = dr["mensaje"].ToString();
                    }
                    await dr.CloseAsync();

                    // 🛑 Evaluar los estados del procedimiento (0 = Validación de Negocio, -1 = Error de Servidor)
                    if (estadoSql == 0)
                    {
                        transaction.Rollback();
                        response.estado = 0; // El frontend espera un bool falso para pintar error
                        response.mensaje = mensajeSql; // Viaja el mensaje exacto de la base de datos
                        return response;
                    }
                }

                // Si todo el bucle foreach termina bien
                transaction.Commit();
                response.estado = 1;
                response.mensaje = "Datos guardados correctamente.";
            }
            catch (Exception ex)
            {
                // Esto atrapa caídas críticas del servidor de base de datos o de red
                if (transaction.Connection != null)
                {
                    transaction.Rollback();
                }
                response.estado = -1;
                response.mensaje = $"Error en Servidor API/DB: {ex.Message}";
            }

            return response;
        }




        public async Task<ResponseEliminarDto> EliminarRutaTransporteMovimiento(string cod_ruta_transporte)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_RUTA_TRANSPORTE_MOVIMIENTO", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cod_ruta_transporte", SqlDbType.VarChar, 20).Value = cod_ruta_transporte;

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
