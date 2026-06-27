using MathNet.Numerics.Distributions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class VetaService
    {

        private readonly string _connectionString;


        public VetaService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }


        public async Task<List<VetaDto>> ObtenerVeta(string cod_empresa, string cod_empresa_unidad, string? texto_busqueda)
        {
            var lista = new List<VetaDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_BUSCAR_VETA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@texto_busqueda", texto_busqueda);

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            lista.Add(new VetaDto
                            {
                                cod_empresa = dr["cod_empresa"]?.ToString(),
                                cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                                cod_und_econom = dr["cod_und_econom"]?.ToString(),
                                cod_zona = dr["cod_zona"]?.ToString(),
                                cod_veta = dr["cod_veta"]?.ToString(),
                                des_zona = dr["des_zona"]?.ToString(),
                                nom_und_econom = dr["nom_und_econom"]?.ToString(),
                                cod_veta_dhlogger = dr["cod_veta_dhlogger"]?.ToString(),

                                nom_veta = dr["nom_veta"]?.ToString(),
                                ind_veta = dr["ind_veta"]?.ToString(),
                                des_veta = dr["des_veta"]?.ToString(),
                                est_veta = dr["est_veta"]?.ToString(),
                            });
                        }
                    }
                }
            }

            return lista;
        }

        public async Task<ListasSelectDto> ObtenerListasSelect(
            string codEmpresa,
            string codEmpresaUnidad)
        {
            var response = new ListasSelectDto();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_LISTAS_SELECT", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", codEmpresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", codEmpresaUnidad);

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        // ====================================
                        // PRIMER SELECT -> ZONAS
                        // ====================================
                        while (await dr.ReadAsync())
                        {
                            response.Zonas.Add(new ZonaSelectDto
                            {
                                cod_zona = dr["cod_zona"]?.ToString(),
                                des_zona = dr["des_zona"]?.ToString()
                            });
                        }

                        // ====================================
                        // SEGUNDO SELECT -> UND ECONOMICA
                        // ====================================
                        await dr.NextResultAsync();

                        while (await dr.ReadAsync())
                        {
                            response.UnidadesEconomicas.Add(new UndEconomicaSelectDto
                            {
                                cod_und_econom = dr["cod_und_econom"]?.ToString(),
                                des_und_econom = dr["des_und_econom"]?.ToString()
                            });
                        }

                        await dr.NextResultAsync();

                        while (await dr.ReadAsync())
                        {
                            response.Veta.Add(new VetaSelectDto
                            {
                                cod_veta = dr["cod_veta"]?.ToString(),
                                nom_veta = dr["nom_veta"]?.ToString()
                            });
                        }
                    }
                }
            }

            return response;
        }


        public async Task<List<VetaDto>> ObtenerVetaCodigo(string cod_empresa, string cod_unidad_empresa, string cod_veta, string cod_zona, string cod_und_econom)
        {
            var lista = new List<VetaDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_OBTENER_VETA_CODIGO", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", cod_unidad_empresa);
                    cmd.Parameters.AddWithValue("@cod_veta", cod_veta);
                    cmd.Parameters.AddWithValue("@cod_zona", cod_zona);
                    cmd.Parameters.AddWithValue("@cod_und_econom", cod_und_econom);

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            lista.Add(new VetaDto
                            {
                                // Claves
                                cod_empresa = dr["cod_empresa"]?.ToString(),
                                cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                                cod_und_econom = dr["cod_und_econom"]?.ToString(),
                                cod_zona = dr["cod_zona"]?.ToString(),
                                cod_veta = dr["cod_veta"]?.ToString(),

                                // Descripciones
                                des_zona = dr["des_zona"]?.ToString(),
                                nom_und_econom = dr["nom_und_econom"]?.ToString(),

                                nom_veta = dr["nom_veta"]?.ToString(),
                                des_veta = dr["des_veta"]?.ToString(),

                                // Indicadores
                                ind_veta = dr["ind_veta"]?.ToString(),
                                est_veta = dr["est_veta"]?.ToString(),

                                // Auditoría
                                cod_usuario_creo = dr["cod_usuario_creo"]?.ToString(),

                                fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value
                                    ? Convert.ToDateTime(dr["fec_usuario_creo"])
                                    : null,

                                cod_usuario_modi = dr["cod_usuario_modi"]?.ToString(),

                                fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value
                                    ? Convert.ToDateTime(dr["fec_usuario_modi"])
                                    : null,

                                // Integración
                                //cod_veta_old = dr["cod_veta_old"]?.ToString(),
                                cod_veta_dhlogger = dr["cod_veta_dhlogger"]?.ToString(),
                                nro_den = dr["nro_den"] != DBNull.Value
                                    ? Convert.ToDecimal(dr["nro_den"])
                                    : null,

                                // Numéricos
                            });
                        }
                    }
                }
            }

            return lista;
        }


        //public async Task<RespuestaDto> EliminarVetaAsync(string veta)
        //{
        //    RespuestaDto respuesta = new();

        //    try
        //    {
        //        using SqlConnection cn = new(_connectionString);
        //        using SqlCommand cmd = new("SP_ELIMINAR_MAE_VETA", cn);

        //        cmd.CommandType = CommandType.StoredProcedure;

        //        cmd.Parameters.AddWithValue("@cod_empresa", veta.cod_empresa);
        //        cmd.Parameters.AddWithValue("@cod_empresa_unidad", veta.cod_empresa_unidad);
        //        cmd.Parameters.AddWithValue("@cod_veta", veta.cod_veta);

        //        await cn.OpenAsync();

        //        using SqlDataReader dr = await cmd.ExecuteReaderAsync();

        //        if (await dr.ReadAsync())
        //        {
        //            respuesta.estado = Convert.ToInt32(dr["estado"]);
        //            respuesta.mensaje = dr["mensaje"]?.ToString() ?? "";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta.estado = -1;
        //        respuesta.mensaje = ex.Message;
        //    }

        //    return respuesta;
        //}

        public async Task<ResponseEliminarDto> EliminarVeta([FromQuery]  string cod_veta, [FromQuery] string cod_zona, [FromQuery] string cod_und_econom)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_VETA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 20).Value = cod_veta;
                    cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 20).Value = cod_zona;
                    cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 20).Value = cod_und_econom;
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


        //public ResponseDTO GuardaVeta(VetaDto veta)
        //{
        //    var respuesta = new ResponseDTO();

        //    try
        //    {
        //        using (SqlConnection cn = new SqlConnection(_connectionString))
        //        {
        //            using (SqlCommand cmd = new SqlCommand("SP_INSERTAR_VETA", cn))
        //            {
        //                cmd.CommandType = CommandType.StoredProcedure;

        //                // Parámetros obligatorios
        //                cmd.Parameters.AddWithValue("@accion", veta.accion);

        //                cmd.Parameters.AddWithValue("@cod_empresa", veta.cod_empresa);
        //                cmd.Parameters.AddWithValue("@cod_empresa_unidad", veta.cod_empresa_unidad);
        //                cmd.Parameters.AddWithValue("@cod_und_econom", veta.cod_und_econom);
        //                cmd.Parameters.AddWithValue("@cod_zona", veta.cod_zona);
        //                cmd.Parameters.AddWithValue("@cod_veta", veta.cod_veta);

        //                // Campos texto
        //                cmd.Parameters.AddWithValue("@nom_veta", (object)veta.nom_veta ?? DBNull.Value);
        //                cmd.Parameters.AddWithValue("@des_veta", (object)veta.des_veta ?? DBNull.Value);

        //                // Indicadores / estados
        //                cmd.Parameters.AddWithValue("@ind_veta", veta.ind_veta ?? "B");
        //                cmd.Parameters.AddWithValue("@est_veta", veta.est_veta ?? "ACT");

        //                // Usuarios
        //                cmd.Parameters.AddWithValue("@cod_usuario_creo", veta.cod_usuario_creo);

        //                cmd.Parameters.AddWithValue(
        //                    "@fec_usuario_creo",
        //                    (object)veta.fec_usuario_creo ?? DBNull.Value
        //                );

        //                cmd.Parameters.AddWithValue(
        //                    "@cod_usuario_modi",
        //                    (object)veta.cod_usuario_modi ?? DBNull.Value
        //                );

        //                cmd.Parameters.AddWithValue(
        //                    "@fec_usuario_modi",
        //                    (object)veta.fec_usuario_modi ?? DBNull.Value
        //                );

        //                // Campos opcionales
        //                //cmd.Parameters.AddWithValue(
        //                //    "@cod_veta_old",
        //                //    (object)veta.cod_veta_old ?? DBNull.Value
        //                //);

        //                cmd.Parameters.AddWithValue(
        //                    "@cod_veta_dhlogger",
        //                    (object)veta.cod_veta_dhlogger ?? DBNull.Value
        //                );

        //                cmd.Parameters.AddWithValue(
        //                    "@nro_den",
        //                    (object)veta.nro_den ?? DBNull.Value
        //                );

        //                cn.Open();

        //                using (SqlDataReader dr = cmd.ExecuteReader())
        //                {
        //                    if (dr.Read())
        //                    {
        //                        respuesta.Estado = Convert.ToInt32(dr["Estado"]);
        //                        respuesta.Mensaje = dr["Mensaje"].ToString();
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta.Estado = -1;
        //        respuesta.Mensaje = "Error en Repository: " + ex.Message;
        //    }

        //    return respuesta;
        //}

        public async Task<ResponseDTO> GuardarVeta(List<VetaDto> veta)
        {
            ResponseDTO response = new();

            using SqlConnection cn = new SqlConnection(_connectionString);
            await cn.OpenAsync();
            SqlTransaction transaction = cn.BeginTransaction();

            try
            {
                foreach (var item in veta)
                {
                    using SqlCommand cmd = new SqlCommand("SP_INSERTAR_VETA", cn, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros obligatorios
                    cmd.Parameters.AddWithValue("@accion", item.accion);

                    cmd.Parameters.AddWithValue("@cod_empresa", "03");
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
                    cmd.Parameters.AddWithValue("@cod_und_econom", item.cod_und_econom);
                    cmd.Parameters.AddWithValue("@cod_zona", item.cod_zona);
                    cmd.Parameters.AddWithValue("@cod_veta", item.cod_veta);

                    // Campos texto
                    cmd.Parameters.AddWithValue("@nom_veta", (object)item.nom_veta ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@des_veta", (object)item.des_veta ?? DBNull.Value);

                    // Indicadores / estados
                    cmd.Parameters.AddWithValue("@ind_veta", item.ind_veta ?? "B");
                    cmd.Parameters.AddWithValue("@est_veta", item.est_veta ?? "ACT");

                    // Usuarios
                    cmd.Parameters.AddWithValue("@cod_usuario_creo", item.cod_usuario_creo);

                    cmd.Parameters.AddWithValue(
                        "@fec_usuario_creo",
                        (object)item.fec_usuario_creo ?? DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "@cod_usuario_modi",
                        (object)item.cod_usuario_modi ?? DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "@fec_usuario_modi",
                        (object)item.fec_usuario_modi ?? DBNull.Value
                    );

                    // Campos opcionales
                    //cmd.Parameters.AddWithValue(
                    //    "@cod_veta_old",
                    //    (object)veta.cod_veta_old ?? DBNull.Value
                    //);

                    cmd.Parameters.AddWithValue(
                        "@cod_veta_dhlogger",
                        (object)item.cod_veta_dhlogger ?? DBNull.Value
                    );

                    cmd.Parameters.AddWithValue(
                        "@nro_den",
                        (object)item.nro_den ?? DBNull.Value
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

        public string ObtenerSiguienteCodigo()
        {
            string nuevoCodigo = "01";
            string sql = @"SELECT 
                            RIGHT('00' + CAST(ISNULL(MAX(CAST(cod_zona AS INT)), 0) + 1 AS VARCHAR), 2) AS SiguienteCodigo
                        FROM mae_zona
                        WHERE cod_empresa = '03' 
                          AND cod_empresa_unidad = '01';";

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand(sql, cn);


                cn.Open();
                var result = cmd.ExecuteScalar();
                if (result != null && result != DBNull.Value)
                {
                    nuevoCodigo = result.ToString();
                }
            }
            return nuevoCodigo;
        }

        public async Task<(bool ok, string mensaje)> EliminarZona(string cod_empresa, string cod_empresa_unidad, string cod_zona)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_ZONA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_zona", cod_zona);

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









    }
}
