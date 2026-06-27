using Microsoft.Data.SqlClient;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class NivelService
    {

        private readonly string _connectionString;


        public NivelService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<NivelDto>> ObtenerNivel(string? cod_empresa, string? cod_empresa_unidad, string? texto_busqueda)
        {
            List<NivelDto> lista = new();

            using SqlConnection cn = new SqlConnection(_connectionString);

            using SqlCommand cmd = new("SP_BUSCAR_NIVEL", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@cod_empresa", (object?)cod_empresa ?? DBNull.Value);

            cmd.Parameters.AddWithValue("@cod_empresa_unidad", (object?)cod_empresa_unidad ?? DBNull.Value);

            cmd.Parameters.AddWithValue("@texto_busqueda", (object?)texto_busqueda ?? DBNull.Value);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new NivelDto
                {
                    cod_empresa = dr["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                    cod_nivel = dr["cod_nivel"]?.ToString(),
                    nom_nivel = dr["nom_nivel"]?.ToString(),
                    des_nivel = dr["des_nivel"]?.ToString(),

                    nro_nivel_cot = dr["nro_nivel_cot"] != DBNull.Value
                        ? Convert.ToDecimal(dr["nro_nivel_cot"])
                        : null,

                    est_nivel = dr["est_nivel"]?.ToString(),

                    cod_usuario_creo = dr["cod_usuario_creo"]?.ToString(),

                    fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value
                        ? Convert.ToDateTime(dr["fec_usuario_creo"])
                        : null,

                    cod_usuario_modi = dr["cod_usuario_modi"]?.ToString(),

                    fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value
                        ? Convert.ToDateTime(dr["fec_usuario_modi"])
                        : null,

                    cod_nivel_dhlogger = dr["cod_nivel_dhlogger"]?.ToString()
                });
            }

            return lista;
        }

        public async Task<ResponseNivelDto> GuardarNivel(List<NivelDto> lista)
        {
            ResponseNivelDto response = new();

            using SqlConnection cn = new SqlConnection(_connectionString);
            await cn.OpenAsync();
            SqlTransaction transaction = cn.BeginTransaction();

            try
            {
                foreach (var item in lista)
                {
                    using SqlCommand cmd = new SqlCommand("SP_INSERTAR_NIVEL", cn, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", "03");
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
                    cmd.Parameters.AddWithValue("@cod_nivel", item.cod_nivel);
                    cmd.Parameters.AddWithValue("@nom_nivel", item.nom_nivel);
                    cmd.Parameters.AddWithValue("@des_nivel", item.des_nivel ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@nro_nivel_cot", item.nro_nivel_cot);
                    cmd.Parameters.AddWithValue("@est_nivel", item.est_nivel);
                    cmd.Parameters.AddWithValue("@cod_nivel_dhlogger", item.cod_nivel_dhlogger ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@cod_usuario_creo", item.cod_usuario_creo);
                    cmd.Parameters.AddWithValue("@accion", item.accion);

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

        public async Task<ResponseEliminarDto> EliminarNivel(string cod_nivel)
        {
            ResponseEliminarDto response = new();

            using SqlConnection cn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SP_ELIMINAR_NIVEL", cn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 20).Value = cod_nivel;

            SqlParameter pEstado = new SqlParameter("@estado", SqlDbType.Int) { Direction = ParameterDirection.Output };
            SqlParameter pMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500) { Direction = ParameterDirection.Output };
            cmd.Parameters.Add(pEstado);
            cmd.Parameters.Add(pMensaje);

            try
            {
                await cn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                int estadoSql = pEstado.Value != DBNull.Value ? (int)pEstado.Value : -1;
                string mensajeSql = pMensaje.Value?.ToString() ?? "Sin respuesta del servidor.";

                // 🛠️ EVALUACIÓN DE CADA ESTADO INDIVIDUAL

                switch (estadoSql)
                {
                    case 1:
                        // CASO 1: Éxito rotundo
                        response.estado = 1;
                        response.mensaje = mensajeSql;
                        break;

                    case 0:
                        // CASO 0: Advertencia de negocio (Ej: No existe el ID para eliminar)
                        response.estado = 0;
                        response.mensaje = $"{mensajeSql}";
                        break;

                    case -1:
                        // CASO -1: Error controlado en el CATCH de SQL
                        response.estado = -1;
                        response.mensaje = $"No se pudo completar la eliminación debido a restricciones en la base de datos: {mensajeSql}";
                        break;

                    default:
                        response.estado = -1;
                        response.mensaje = "Estado de respuesta desconocido.";
                        break;
                }
            }
            catch (SqlException ex)
            {
                // Errores que rompen el canal antes de que el SP asigne el OUTPUT (Ej: Conexión perdida)
                response.estado = -1;
                response.mensaje = $"Error físico fatal en SQL Server ({ex.Number}): {ex.Message}";
            }

            return response;
        }
    }
}
