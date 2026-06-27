using Microsoft.Data.SqlClient;
using NPOI.SS.Formula.Functions;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class ZonaService
    {

        private readonly string _connectionString;


        public ZonaService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        //public async Task<List<MaeEmpresaDto>> ObtenerEmpresa()
        //{
        //    var lista = new List<MaeEmpresaDto>();

        //    using (SqlConnection cn = new SqlConnection(_connectionString))
        //    {
        //        await cn.OpenAsync();

        //        string query = "SELECT * FROM PAS_STD.dbo.mae_empresa WHERE est_empresa = 'ACT'";

        //        using (SqlCommand cmd = new SqlCommand(query, cn))
        //        using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
        //        {
        //            while (await dr.ReadAsync())
        //            {
        //                lista.Add(new MaeEmpresaDto
        //                {
        //                    cod_empresa = dr["cod_empresa"]?.ToString(),
        //                    nom_empresa = dr["nom_empresa"]?.ToString()
        //                });
        //            }
        //        }
        //    }

        //    return lista;
        //}

        //public async Task<List<MaeEmpresaUnidadDto>> ObtenerEmpresaUnidad()
        //{
        //    var lista = new List<MaeEmpresaUnidadDto>();

        //    using (SqlConnection cn = new SqlConnection(_connectionString))
        //    {
        //        await cn.OpenAsync();

        //        string query = "SELECT * FROM PAS_STD.dbo.mae_empresa_unidad WHERE est_empresa_unidad = 'ACT'";

        //        using (SqlCommand cmd = new SqlCommand(query, cn))
        //        using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
        //        {
        //            while (await dr.ReadAsync())
        //            {
        //                lista.Add(new MaeEmpresaUnidadDto
        //                {
        //                    cod_empresa = dr["cod_empresa"]?.ToString(),
        //                    cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
        //                    nom_empresa_unidad = dr["nom_empresa_unidad"]?.ToString()
        //                });
        //            }
        //        }
        //    }

        //    return lista;
        //}

        public async Task<List<MaeZonaDto>> ObtenerZona(string cod_empresa, string cod_empresa_unidad, string texto_busqueda)
        {
            var lista = new List<MaeZonaDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_OBTENER_ZONA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@texto_busqueda", texto_busqueda);

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            lista.Add(new MaeZonaDto
                            {
                                cod_empresa = dr["cod_empresa"]?.ToString(),
                                cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                                cod_zona = dr["cod_zona"]?.ToString(),
                                des_zona = dr["des_zona"]?.ToString(),
                                obs_zona = dr["obs_zona"]?.ToString(),

                                // Mapeo seguro para campos Decimales
                                nro_den = dr["nro_den"] != DBNull.Value ? Math.Round(Convert.ToDecimal(dr["nro_den"]), 2) : 0,
                                val_vpt = dr["val_vpt"] != DBNull.Value ? Math.Round(Convert.ToDecimal(dr["val_vpt"]), 2) : 0,
                                cod_costo_equivalente = dr["cod_costo_equivalente"]?.ToString(),
                                est_zona = dr["est_zona"]?.ToString(),
                                cod_usuario_creo = dr["cod_usuario_creo"]?.ToString(),
                                cod_usuario_modi = dr["cod_usuario_modi"]?.ToString(),
                                cod_zona_dhlogger = dr["cod_zona_dhlogger"]?.ToString(),
                                cod_usuario_responsable = dr["cod_usuario_responsable"]?.ToString(),
                                ind_dens_estructura = dr["ind_dens_estructura"]?.ToString()

                            });
                        }
                    }
                }
            }

            return lista;
        }


        public async Task<List<UsuarioDto>> ListarUsuario()
        {
            var lista = new List<UsuarioDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_LISTA_USUARIO", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", "03");
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            lista.Add(new UsuarioDto
                            {
                                cod_empresa = dr["cod_empresa"]?.ToString(),
                                cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                                cod_usuario = dr["cod_usuario"]?.ToString(),
                                nom_usuario = dr["nom_usuario"]?.ToString(),


                            });
                        }
                    }
                }
            }

            return lista;
        }

        public async Task<List<MaeZonaDto>> ObtenerZonaCodigo(string cod_empresa, string cod_unidad_empresa, string cod_zona)
        {
            var lista = new List<MaeZonaDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_OBTENER_ZONA_CODIGO", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", cod_unidad_empresa);
                    cmd.Parameters.AddWithValue("@cod_zona", cod_zona);

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            lista.Add(new MaeZonaDto
                            {
                                cod_empresa = dr["cod_empresa"]?.ToString(),
                                cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                                cod_zona = dr["cod_zona"]?.ToString(),
                                des_zona = dr["des_zona"]?.ToString(),
                                obs_zona = dr["obs_zona"]?.ToString(),

                                nro_den = dr["nro_den"] != DBNull.Value
                                    ? Convert.ToDecimal(dr["nro_den"])
                                    : null,

                                cod_costo_equivalente = dr["cod_costo_equivalente"]?.ToString(),
                                cod_partida_equivalente = dr["cod_partida_equivalente"]?.ToString(),

                                est_zona = dr["est_zona"]?.ToString(),

                                cod_usuario_creo = dr["cod_usuario_creo"]?.ToString(),

                                fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value
                                    ? Convert.ToDateTime(dr["fec_usuario_creo"])
                                    : null,

                                cod_usuario_modi = dr["cod_usuario_modi"]?.ToString(),

                                fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value
                                    ? Convert.ToDateTime(dr["fec_usuario_modi"])
                                    : null,

                                val_vpt = dr["val_vpt"] != DBNull.Value
                                    ? Convert.ToDecimal(dr["val_vpt"])
                                    : null,

                                des_empresa_zona = dr["des_empresa_zona"]?.ToString(),
                                cod_zona_dhlogger = dr["cod_zona_dhlogger"]?.ToString(),
                                cod_usuario_responsable = dr["cod_usuario_responsable"]?.ToString(),
                                ind_dens_estructura = dr["ind_dens_estructura"]?.ToString(),
                                cod_cancha_dhlogger = dr["cod_cancha_dhlogger"]?.ToString(),

                                num_espon_min = dr["num_espon_min"] != DBNull.Value
                                    ? Convert.ToDecimal(dr["num_espon_min"])
                                    : null,

                                num_espon_des = dr["num_espon_des"] != DBNull.Value
                                    ? Convert.ToDecimal(dr["num_espon_des"])
                                    : null
                            });
                        }
                    }
                }
            }

            return lista;
        }



        public List<UsuarioJefeTurnoDTO> ObtenerUsuariosJefeTurno()
        {
            List<UsuarioJefeTurnoDTO> lista = new List<UsuarioJefeTurnoDTO>();

            // Usamos string interpolation o una constante para la query
            string query = @"
                    SELECT mae_usuario.cod_empresa, 
                           mae_usuario.cod_empresa_unidad, 
                           mae_usuario.cod_usuario, 
                           usuario.nom_usuario 
                    FROM mae_usuario
                    INNER JOIN PAS_STD.dbo.mae_usuario usuario ON mae_usuario.cod_usuario = usuario.cod_usuario
                    WHERE usuario.est_usuario = 'ACT' 
                      AND mae_usuario.ind_usu_jefe_turno = 'S'";

            try
            {
                using (var connection = new SqlConnection(_connectionString)) // _connectionString viene de tu config
                {
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.CommandType = CommandType.Text;
                        connection.Open();

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                lista.Add(new UsuarioJefeTurnoDTO
                                {
                                    cod_empresa = reader["cod_empresa"].ToString(),
                                    cod_empresa_unidad = reader["cod_empresa_unidad"].ToString(),
                                    cod_usuario = reader["cod_usuario"].ToString(),
                                    nom_usuario = reader["nom_usuario"].ToString()
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Loguear error según tu arquitectura
                throw new Exception("Error al obtener jefes de turno: " + ex.Message);
            }

            return lista;
        }

        public ResponseDTO InsertarZona(ZonaDTO zona)
        {
            var respuesta = new ResponseDTO();

            try
            {
                using (SqlConnection cn = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("SP_INSERTAR_ZONA", cn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros obligatorios
                        cmd.Parameters.AddWithValue("@accion", zona.accion);
                        cmd.Parameters.AddWithValue("@cod_empresa", zona.cod_empresa);
                        cmd.Parameters.AddWithValue("@cod_empresa_unidad", zona.cod_empresa_unidad);
                        cmd.Parameters.AddWithValue("@cod_zona", zona.cod_zona);
                        cmd.Parameters.AddWithValue("@des_zona", zona.des_zona);
                        cmd.Parameters.AddWithValue("@cod_usuario_creo", zona.cod_usuario_creo);

                        // Parámetros opcionales con manejo de NULL
                        cmd.Parameters.AddWithValue("@obs_zona", (object)zona.obs_zona ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@nro_den", zona.nro_den);
                        cmd.Parameters.AddWithValue("@cod_costo_equivalente", (object)zona.cod_costo_equivalente ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@est_zona", zona.est_zona ?? "ACT");
                        cmd.Parameters.AddWithValue("@cod_usuario_modi", (object)zona.cod_usuario_modi ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@val_vpt", zona.val_vpt);
                        cmd.Parameters.AddWithValue("@cod_zona_dhlogger", (object)zona.cod_zona_dhlogger ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@cod_usuario_responsable", (object)zona.cod_usuario_responsable ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@ind_dens_estructura", zona.ind_dens_estructura ?? "N");

                        cn.Open();

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                respuesta.estado = Convert.ToInt32(dr["Estado"]);
                                respuesta.mensaje = dr["Mensaje"].ToString();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                respuesta.estado = -1;
                respuesta.mensaje = "Error en Repository: " + ex.Message;
            }

            return respuesta;
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

        public async Task<(bool ok, string mensaje)> EliminarZona(string cod_zona)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_ZONA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@cod_empresa", "03");
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
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

        //public async Task<RespuestaDto> InsertarUnidadEconomica(List<InsertarUndEconomDto> dto)
        //{
        //    var response = new RespuestaDto();

        //    try
        //    {
        //        foreach (var item in dto)
        //        {
        //            using (SqlConnection cn = new SqlConnection(_connectionString))
        //            {
        //                await cn.OpenAsync();

        //                using (SqlCommand cmd = new SqlCommand("SP_INSERTAR_UND_ECONOM", cn))
        //                {
        //                    cmd.CommandType = CommandType.StoredProcedure;

        //                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = item.cod_empresa;
        //                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = item.cod_empresa_unidad;
        //                    cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 10).Value = item.cod_und_econom;
        //                    cmd.Parameters.Add("@nom_und_econom", SqlDbType.VarChar, 50).Value = item.nom_und_econom;
        //                    cmd.Parameters.Add("@des_und_econom", SqlDbType.VarChar, 100).Value = item.des_und_econom;
        //                    cmd.Parameters.Add("@ind_act", SqlDbType.Char, 1).Value = item.ind_act;
        //                    cmd.Parameters.Add("@usu_creo", SqlDbType.VarChar, 50).Value = item.usu_creo;
        //                    cmd.Parameters.Add("@cod_und_econom_dhlogger", SqlDbType.VarChar, 50).Value = item.cod_und_econom_dhlogger;

        //                    using (var reader = await cmd.ExecuteReaderAsync())
        //                    {
        //                        if (await reader.ReadAsync())
        //                        {
        //                            response.estado = reader["estado"] != DBNull.Value
        //                                ? Convert.ToInt32(reader["estado"])
        //                                : 0;

        //                            response.mensaje = reader["mensaje"]?.ToString() ?? "";
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.estado = 0;
        //        response.mensaje = $"Error: {ex.Message}";
        //    }

        //    return response;
        //}

        //public async Task<string> ObtenerSiguienteCodigoUnidadEconomica()
        //{
        //    string siguienteCodigo = "01";

        //    try
        //    {
        //        using (SqlConnection cn = new SqlConnection(_connectionString))
        //        {
        //            await cn.OpenAsync();

        //            string sql = @"
        //                    SELECT RIGHT('00' + CAST(
        //                        ISNULL(MAX(CAST(cod_und_econom AS INT)), 0) + 1
        //                    AS VARCHAR), 2) AS siguiente
        //                    FROM mae_und_economica
        //                    WHERE cod_empresa = '03'
        //                       AND cod_empresa_unidad = '01'
        //                ";

        //            using (SqlCommand cmd = new SqlCommand(sql, cn))
        //            {

        //                var result = await cmd.ExecuteScalarAsync();

        //                if (result != null && result != DBNull.Value)
        //                {
        //                    siguienteCodigo = result.ToString();
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception("Error al obtener código: " + ex.Message);
        //    }

        //    return siguienteCodigo;
        //}

        public async Task<ResponseDTO> GuardarZona(List<ZonaDTO> veta)
        {
            ResponseDTO response = new();

            using SqlConnection cn = new SqlConnection(_connectionString);
            await cn.OpenAsync();
            SqlTransaction transaction = cn.BeginTransaction();

            try
            {
                foreach (var item in veta)
                {
                    using SqlCommand cmd = new SqlCommand("SP_INSERTAR_ZONA", cn, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros obligatorios
                    cmd.Parameters.AddWithValue("@accion", item.accion);
                    cmd.Parameters.AddWithValue("@cod_empresa", item.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", item.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_zona", item.cod_zona);
                    cmd.Parameters.AddWithValue("@des_zona", item.des_zona);
                    cmd.Parameters.AddWithValue("@cod_usuario_creo", item.cod_usuario_creo);

                    // Parámetros opcionales con manejo de NULL
                    cmd.Parameters.AddWithValue("@obs_zona", item.obs_zona);
                    cmd.Parameters.AddWithValue("@nro_den", item.nro_den);
                    cmd.Parameters.AddWithValue("@cod_costo_equivalente", (object)item.cod_costo_equivalente ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@est_zona", item.est_zona ?? "ACT");
                    cmd.Parameters.AddWithValue("@cod_usuario_modi", (object)item.cod_usuario_modi ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@val_vpt", item.val_vpt);
                    cmd.Parameters.AddWithValue("@cod_zona_dhlogger", (object)item.cod_zona_dhlogger ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@cod_usuario_responsable", (object)item.cod_usuario_responsable ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@ind_dens_estructura", item.ind_dens_estructura ?? "N");

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









    }
}
