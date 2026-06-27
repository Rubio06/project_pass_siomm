using Microsoft.Data.SqlClient;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class ContrataService
    {

        private readonly string _connectionString;


        public ContrataService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<ContrataMantDto>> ObtenerContrata(
            string? cod_empresa,
 
            string? texto_busqueda)
        {
            List<ContrataMantDto> lista = new();

            using SqlConnection cn = new SqlConnection(_connectionString);

            using SqlCommand cmd = new("SP_BUSCAR_CONTRATA", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@cod_empresa", (object?)cod_empresa ?? DBNull.Value);

            cmd.Parameters.AddWithValue("@texto_busqueda", (object?)texto_busqueda ?? DBNull.Value);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new ContrataMantDto
                {
                    cod_empresa = dr["cod_empresa"]?.ToString(),
                    cod_contrata = dr["cod_contrata"]?.ToString(),
                    des_contrata = dr["des_contrata"]?.ToString(),

                    ruc_contrata = dr["ruc_contrata"]?.ToString(),

                    nro_telefono = dr["nro_telefono"]?.ToString(),

                    rep_nombre = dr["rep_nombre"]?.ToString(),

                    eml_correo = dr["eml_correo"]?.ToString(),

                    //ind_tipo_contrata = dr["ind_tipo_contrata"]?.ToString(),

                    est_contrata = dr["est_contrata"]?.ToString(),

                });
            }

            return lista;
        }







        public async Task<ResponseNivelDto> GuardarContrata(List<ContrataMantDto> lista)
        {
            ResponseNivelDto response = new();

            using SqlConnection cn = new SqlConnection(_connectionString);
            await cn.OpenAsync();
            SqlTransaction transaction = cn.BeginTransaction();

            try
            {
                foreach (var item in lista)
                {
                    using SqlCommand cmd = new SqlCommand("SP_INSERTAR_CONTRATA", cn, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("@cod_empresa", "03");
                    cmd.Parameters.AddWithValue("@cod_contrata", item.cod_contrata);
                    cmd.Parameters.AddWithValue("@des_contrata", item.des_contrata);
                    cmd.Parameters.AddWithValue("@ruc_contrata", item.ruc_contrata);

                    cmd.Parameters.AddWithValue(
                        "@nro_telefono",
                        string.IsNullOrWhiteSpace(item.nro_telefono)
                            ? DBNull.Value
                            : item.nro_telefono
                    );

                    cmd.Parameters.AddWithValue(
                        "@rep_nombre",
                        string.IsNullOrWhiteSpace(item.rep_nombre)
                            ? DBNull.Value
                            : item.rep_nombre
                    );

                    cmd.Parameters.AddWithValue(
                        "@fec_ingreso",
                        item.fec_ingreso == null
                            ? (object)DBNull.Value
                            : item.fec_ingreso
                    );

                    cmd.Parameters.AddWithValue(
                        "@fec_cese",
                        item.fec_cese == null
                            ? (object)DBNull.Value
                            : item.fec_cese
                    );

                    cmd.Parameters.AddWithValue(
                        "@eml_correo",
                        string.IsNullOrWhiteSpace(item.eml_correo)
                            ? DBNull.Value
                            : item.eml_correo
                    );

                    cmd.Parameters.AddWithValue("@ind_tipo_contrata", item.ind_tipo_contrata);

                    cmd.Parameters.AddWithValue("@est_contrata", item.est_contrata);



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

        public async Task<string> ObtenerSiguienteCodigoContratasync()
        {
            using SqlConnection cn = new(_connectionString);

            string query = @"
                 SELECT RIGHT(
                    '0000' +
                    CAST(
                        ISNULL(MAX(CAST(cod_contrata AS INT)), 0) + 1
                    AS VARCHAR),
                3)
                FROM  PAS_STD.dbo.mae_contrata; ";

            using SqlCommand cmd = new(query, cn);

            await cn.OpenAsync();

            object? result = await cmd.ExecuteScalarAsync();

            return result?.ToString() ?? "0001";
        }




        public async Task<ResponseEliminarDto> EliminarContrata(string cod_contrata)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_CONTRATA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_contrata", SqlDbType.VarChar, 20).Value = cod_contrata;

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
