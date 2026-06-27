using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using NPOI.SS.Formula.Functions;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;
using System.Diagnostics.Contracts;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class TarifarioService
    {

        private readonly string _connectionString;


        public TarifarioService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        // Cambiamos la firma para que devuelva un Task<List<...>> y termine en Async
        public async Task<PaginacionTarifarioDetalleDto> ObtenerTarifarioDetalleAsync(
            EntradaTarifarioDetalleDto request)
        {
            List<TarifarioTransporteDetalleDto> listaDetalle = new();

            int totalRegistros = 0;

            using SqlConnection connection = new SqlConnection(_connectionString);

            using SqlCommand command = new SqlCommand(
                "SP_OBTENER_TARIFARIO_DETALLE",
                connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.AddWithValue("@cod_empresa", request.cod_empresa);
            command.Parameters.AddWithValue("@cod_empresa_unidad", request.cod_empresa_unidad);
            command.Parameters.AddWithValue("@cod_contrato", request.cod_contrato);
            command.Parameters.AddWithValue("@ind_material", request.ind_material);

            command.Parameters.AddWithValue("@pagina", request.pagina);
            command.Parameters.AddWithValue("@cantidad_reg", request.cantidad_reg);

            await connection.OpenAsync();

            using SqlDataReader reader = await command.ExecuteReaderAsync();

            // ====================================
            // PRIMER RESULTSET (DATA)
            // ====================================

            while (await reader.ReadAsync())
            {
                listaDetalle.Add(new TarifarioTransporteDetalleDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    cod_contrato = reader["cod_contrato"]?.ToString(),
                    cod_item_ruta = reader["cod_item_ruta"]?.ToString(),
                    cod_ruta_origen = reader["cod_ruta_origen"]?.ToString(),
                    cod_ruta_destino = reader["cod_ruta_destino"]?.ToString(),
                    cod_zona = reader["cod_zona"]?.ToString(),

                    nro_factor_viajepeso = reader["nro_factor_viajepeso"] != DBNull.Value
                        ? Convert.ToDecimal(reader["nro_factor_viajepeso"])
                        : null,

                    nro_distancia_km = reader["nro_distancia_km"] != DBNull.Value
                        ? Convert.ToDecimal(reader["nro_distancia_km"])
                        : null,

                    imp_tmh_km_soles = reader["imp_tmh_km_soles"] != DBNull.Value
                        ? Convert.ToDecimal(reader["imp_tmh_km_soles"])
                        : null,

                    imp_ruta_pu = reader["imp_ruta_pu"] != DBNull.Value
                        ? Convert.ToDecimal(reader["imp_ruta_pu"])
                        : null,

                    flg_vigencia = reader["flg_vigencia"]?.ToString(),
                    ind_material = reader["ind_material"]?.ToString(),
                    cto_cod = reader["cto_cod"]?.ToString(),
                    cta_cod = reader["cta_cod"]?.ToString(),
                    cod_usuario_creo = reader["cod_usuario_creo"]?.ToString(),

                    fec_usuario_creo = reader["fec_usuario_creo"] != DBNull.Value
                        ? Convert.ToDateTime(reader["fec_usuario_creo"])
                        : null,

                    cod_usuario_modi = reader["cod_usuario_modi"]?.ToString(),

                    fec_usuario_modi = reader["fec_usuario_modi"] != DBNull.Value
                        ? Convert.ToDateTime(reader["fec_usuario_modi"])
                        : null,

                    cod_ruta_intermedia = reader["cod_ruta_intermedia"]?.ToString(),
                    ind_balanza_desmonte = reader["ind_balanza_desmonte"]?.ToString(),
                    ind_mov_sap = reader["ind_mov_sap"]?.ToString(),

                    c_t_zona = reader["c_t_zona"]?.ToString(),
                    c_t_origen = reader["c_t_origen"]?.ToString(),
                    c_t_destino = reader["c_t_destino"]?.ToString()
                });
            }

            // ====================================
            // SEGUNDO RESULTSET (TOTAL REGISTROS)
            // ====================================

            if (await reader.NextResultAsync())
            {
                if (await reader.ReadAsync())
                {
                    totalRegistros = Convert.ToInt32(
                        reader["TotalRegistros"]);
                }
            }

            // ====================================
            // TOTAL PÁGINAS
            // ====================================

            int totalPaginas = (int)Math.Ceiling(
                (double)totalRegistros / request.cantidad_reg);

            // ====================================
            // RESPONSE
            // ====================================

            return new PaginacionTarifarioDetalleDto
            {
                totalRegistros = totalRegistros,
                paginaActual = request.pagina,
                cantidadReg = request.cantidad_reg,
                totalPaginas = totalPaginas,
                data = listaDetalle
            };
        }

        // 1. LISTAR RUTAS
        public async Task<List<RutaTransporteDto>> ListarRutasAsync()
        {
            var lista = new List<RutaTransporteDto>();
            string query = @"
                SELECT r.cod_empresa, r.cod_empresa_unidad, r.cod_ruta, r.des_ruta, 
                       r.des_ruta_abrev, r.cod_zona, r.flg_vigente, c_t_zona = mz.des_zona
                FROM mae_ruta_transporte r   
                LEFT JOIN mae_zona mz 
                    ON r.cod_empresa = mz.cod_empresa COLLATE DATABASE_DEFAULT
                   AND r.cod_empresa_unidad = mz.cod_empresa_unidad COLLATE DATABASE_DEFAULT
                   AND r.cod_zona = mz.cod_zona COLLATE DATABASE_DEFAULT
                WHERE r.flg_vigente = '1';";

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand(query, conn))
            {
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new RutaTransporteDto
                        {
                            cod_empresa = !reader.IsDBNull(reader.GetOrdinal("cod_empresa")) ? reader["cod_empresa"].ToString() : string.Empty,
                            cod_empresa_unidad = !reader.IsDBNull(reader.GetOrdinal("cod_empresa_unidad")) ? reader["cod_empresa_unidad"].ToString() : string.Empty,
                            cod_ruta = !reader.IsDBNull(reader.GetOrdinal("cod_ruta")) ? reader["cod_ruta"].ToString() : string.Empty,
                            des_ruta = !reader.IsDBNull(reader.GetOrdinal("des_ruta")) ? reader["des_ruta"].ToString() : string.Empty,
                            des_ruta_abrev = !reader.IsDBNull(reader.GetOrdinal("des_ruta_abrev")) ? reader["des_ruta_abrev"].ToString() : string.Empty,
                            cod_zona = !reader.IsDBNull(reader.GetOrdinal("cod_zona")) ? reader["cod_zona"].ToString() : string.Empty,
                            flg_vigente = !reader.IsDBNull(reader.GetOrdinal("flg_vigente")) ? reader["flg_vigente"].ToString() : string.Empty,
                            c_t_zona = !reader.IsDBNull(reader.GetOrdinal("c_t_zona")) ? reader["c_t_zona"].ToString() : string.Empty
                        });
                    }
                }
            }
            return lista;
        }

        // 2. LISTAR CENTROS DE COSTO
        public async Task<List<CentroCostoDto>> ListarCto()
        {
            var lista = new List<CentroCostoDto>();
            string query = @"
                SELECT c.cto_cod, c.cto_des, c.cto_vig, c.cto_eqp, c.cto_tra, c.cto_tip, c.exp_flg
                FROM mae_cto c   
                WHERE LEN(c.cto_cod) = 8   
                  AND (LEFT(c.cto_cod, 1) + RIGHT(c.cto_cod, 1)) <> 'A0';";

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand(query, conn))
            {
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new CentroCostoDto
                        {
                            cto_cod = !reader.IsDBNull(reader.GetOrdinal("cto_cod")) ? reader["cto_cod"].ToString() : string.Empty,
                            cto_des = !reader.IsDBNull(reader.GetOrdinal("cto_des")) ? reader["cto_des"].ToString() : string.Empty,
                            cto_vig = !reader.IsDBNull(reader.GetOrdinal("cto_vig")) ? reader["cto_vig"].ToString() : string.Empty,
                            cto_eqp = !reader.IsDBNull(reader.GetOrdinal("cto_eqp")) ? reader["cto_eqp"].ToString() : string.Empty,
                            cto_tra = !reader.IsDBNull(reader.GetOrdinal("cto_tra")) ? reader["cto_tra"].ToString() : string.Empty,
                            cto_tip = !reader.IsDBNull(reader.GetOrdinal("cto_tip")) ? reader["cto_tip"].ToString() : string.Empty,
                            exp_flg = !reader.IsDBNull(reader.GetOrdinal("exp_flg")) ? reader["exp_flg"].ToString() : string.Empty
                        });
                    }
                }
            }
            return lista;
        }

        // 3. LISTAR CUENTAS CONTABLES
        public async Task<List<CuentaContableDto>> ListarCta()
        {
            var lista = new List<CuentaContableDto>();
            string query = "SELECT cta_cod, cta_des, cta_vig FROM mae_cta WHERE cta_vig = 'S';"; // Filtro de vigencia opcional asumido

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand(query, conn))
            {
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new CuentaContableDto
                        {
                            cta_cod = !reader.IsDBNull(reader.GetOrdinal("cta_cod")) ? reader["cta_cod"].ToString() : string.Empty,
                            cta_des = !reader.IsDBNull(reader.GetOrdinal("cta_des")) ? reader["cta_des"].ToString() : string.Empty,
                            cta_vig = !reader.IsDBNull(reader.GetOrdinal("cta_vig")) ? reader["cta_vig"].ToString() : string.Empty
                        });
                    }
                }
            }
            return lista;
        }



        /// <summary>
        /// /
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>

        // MATEIRAL TRANSPORTE MATERIAL

        public async Task<List<TarifarioTransporteMaterialDto>> ObtenerTarifarioTransporteMaterial(EntradaTarifarioMaterialDto request)
        {
            var listaDetalle = new List<TarifarioTransporteMaterialDto>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_OBTENER_TARIFARIO_TRANSPORTE_MATERIAL", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = request.cod_empresa;
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = request.cod_empresa_unidad;
                    command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = request.cod_contrato;

                    try
                    {
                        // 1. Apertura asíncrona de la conexión
                        await connection.OpenAsync();

                        // 2. Ejecución asíncrona del comando
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            // 3. Lectura asíncrona fila por fila
                            while (await reader.ReadAsync())
                            {
                                var item = new TarifarioTransporteMaterialDto
                                {
                                    cod_empresa = reader["cod_empresa"].ToString(),
                                    cod_empresa_unidad = reader["cod_empresa_unidad"].ToString(),
                                    cod_contrato = reader["cod_contrato"].ToString(),
                                    cod_item_ruta = reader["cod_item_ruta"].ToString(),
                                    cod_tabla = reader["cod_tabla"].ToString(),
                                    cod_item = reader["cod_item"].ToString(),
                                    ind_balanza_desmonte = reader["ind_balanza_desmonte"].ToString(),
                                    flg_vigente = reader["flg_vigente"].ToString(),
                                    cod_usuario_creo = reader["cod_usuario_creo"].ToString(),

                                    fec_usuario_creo = reader["fec_usuario_creo"] != DBNull.Value ?
                                    Convert.ToDateTime(reader["fec_usuario_creo"]) : null,

                                    cod_usuario_modi = reader["cod_usuario_modi"].ToString(),

                                    fec_usuario_modi = reader["fec_usuario_modi"] != DBNull.Value ?
                                    Convert.ToDateTime(reader["fec_usuario_modi"]) : null,

                                    // Mapeo directo de las descripciones calculadas
                                    c_t_zona = reader["c_t_zona"].ToString(),
                                    c_t_origen = reader["c_t_origen"].ToString(),
                                    c_t_destino = reader["c_t_destino"].ToString()
                                };

                                listaDetalle.Add(item);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Error al recuperar el tarifario de transporte: {ex.Message}", ex);
                    }
                }
            }

            return listaDetalle;
        }


        public async Task<List<ListarTarifarioDto>> ObtenerTarifarioLista()
        {
            var listaTarifario = new List<ListarTarifarioDto>();

            // Definimos la consulta limpia con los LEFT JOINs optimizados
            string query = @"
                SELECT 
                    t.cod_empresa,   
                    t.cod_empresa_unidad,   
                    t.cod_contrato,   
                    t.cod_item_ruta,   
                    t.cod_ruta_origen,   
                    t.cod_ruta_destino,   
                    t.cod_ruta_intermedia,   
                    t.imp_ruta_pu,   
                    t.ind_material,   
                    t.imp_tmh_km_soles,   
                    t.nro_distancia_km,   
                    t.nro_factor_viajepeso,   
                    t.flg_vigencia,   
                    z.cod_zona,   
                    t.cta_cod,   
                    t.cto_cod,
                    z.des_zona AS c_t_zona,
                    o.des_ruta AS c_t_origen,
                    d.des_ruta AS c_t_destino
                FROM sval_det_tarifario_transporte t   
                LEFT JOIN sval_mae_ruta_transporte r_zona 
                    ON r_zona.cod_empresa = t.cod_empresa 
                    AND r_zona.cod_empresa_unidad = t.cod_empresa_unidad 
                    AND r_zona.cod_ruta = t.cod_ruta_origen
                LEFT JOIN mae_zona z 
                    ON z.cod_empresa = r_zona.cod_empresa   
                    AND z.cod_empresa_unidad = r_zona.cod_empresa_unidad  
                    AND z.cod_zona = r_zona.cod_zona   
                LEFT JOIN sval_mae_ruta_transporte o 
                    ON o.cod_empresa = t.cod_empresa 
                    AND o.cod_empresa_unidad = t.cod_empresa_unidad 
                    AND o.cod_ruta = t.cod_ruta_origen
                LEFT JOIN sval_mae_ruta_transporte d 
                    ON d.cod_empresa = t.cod_empresa 
                    AND d.cod_empresa_unidad = t.cod_empresa_unidad 
                    AND d.cod_ruta = t.cod_ruta_destino
                WHERE t.cod_empresa = '03' 
                  AND t.cod_empresa_unidad = '01' 
                  AND t.flg_vigencia = '1';";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    // Especificamos explícitamente que es una consulta de texto libre
                    command.CommandType = CommandType.Text;

                    // Declaramos los parámetros con su tipo de dato exacto de SQL Server

                    try
                    {
                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new ListarTarifarioDto
                                {
                                    cod_empresa = reader["cod_empresa"].ToString(),
                                    cod_empresa_unidad = reader["cod_empresa_unidad"].ToString(),
                                    cod_contrato = reader["cod_contrato"].ToString(),
                                    cod_item_ruta = reader["cod_item_ruta"].ToString(),
                                    cod_ruta_origen = reader["cod_ruta_origen"].ToString(),
                                    cod_ruta_destino = reader["cod_ruta_destino"].ToString(),
                                    cod_ruta_intermedia = reader["cod_ruta_intermedia"].ToString(),

                                    imp_ruta_pu = reader["imp_ruta_pu"] != DBNull.Value ? Convert.ToDecimal(reader["imp_ruta_pu"]) : 0,
                                    ind_material = reader["ind_material"].ToString(),
                                    imp_tmh_km_soles = reader["imp_tmh_km_soles"] != DBNull.Value ? Convert.ToDecimal(reader["imp_tmh_km_soles"]) : 0,
                                    nro_distancia_km = reader["nro_distancia_km"] != DBNull.Value ? Convert.ToDecimal(reader["nro_distancia_km"]) : 0,
                                    nro_factor_viajepeso = reader["nro_factor_viajepeso"] != DBNull.Value ? Convert.ToDecimal(reader["nro_factor_viajepeso"]) : 0,

                                    flg_vigencia = reader["flg_vigencia"].ToString(),
                                    cod_zona = reader["cod_zona"].ToString(),
                                    cta_cod = reader["cta_cod"].ToString(),
                                    cto_cod = reader["cto_cod"].ToString(),

                                    // Mapeo de las columnas calculadas con alias AS
                                    c_t_zona = reader["c_t_zona"].ToString(),
                                    c_t_origen = reader["c_t_origen"].ToString(),
                                    c_t_destino = reader["c_t_destino"].ToString()
                                };

                                listaTarifario.Add(item);
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        // Control de excepciones a nivel de base de datos
                        throw new Exception("Error al ejecutar la consulta del tarifario de transporte activo.", ex);
                    }
                }
            }

            return listaTarifario;
        }

        public async Task<List<SvalMaeTablaDetalleDto>> ObtenerListaTabla(EntradaTablaDto request)
        {
            var listaDetalles = new List<SvalMaeTablaDetalleDto>();

            string query = @"
                SELECT 
                    d.cod_tabla,   
                    d.cod_item,   
                    d.des_tabladet,   
                    d.flg_vigencia,   
                    d.des_tabladet_abrev   
                FROM sval_mae_tabla_detalle d   
                WHERE d.cod_empresa        = @cod_empresa 
                  AND d.cod_empresa_unidad = @cod_empresa_unidad 
                  AND d.cod_tabla          = @cod_tabla;";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;

                    // Configuración estricta de parámetros
                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = request.cod_empresa;
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = request.cod_empresa_unidad;
                    command.Parameters.Add("@cod_tabla", SqlDbType.VarChar, 10).Value = request.cod_tabla;

                    try
                    {
                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new SvalMaeTablaDetalleDto
                                {
                                    cod_tabla = reader["cod_tabla"].ToString(),
                                    cod_item = reader["cod_item"].ToString(),
                                    des_tabladet = reader["des_tabladet"].ToString(),
                                    flg_vigencia = reader["flg_vigencia"].ToString(),
                                    des_tabladet_abrev = reader["des_tabladet_abrev"].ToString()
                                };

                                listaDetalles.Add(item);
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        // Manejo de excepciones de conectividad o sintaxis
                        throw new Exception($"Error al consultar el catálogo de la tabla {request.cod_tabla} en la base de datos.", ex);
                    }
                }
            }

            return listaDetalles;
        }

        //MODAL AQLUILER TRANSPORTE

        public async Task<List<SvalDetTarifarioEquiposAlquilerDto>> ObtenerTarifarioEquipos(EntradaTarifarioMaterialDto request)
        {
            var listaEquipos = new List<SvalDetTarifarioEquiposAlquilerDto>();

            string query = @"
                SELECT 
                    t.cod_empresa,   
                    t.cod_empresa_unidad,   
                    t.cod_contrato,   
                    t.cod_equipo,   
                    t.imp_alquiler_hora,   
                    t.ind_turno_trabajo,   
                    t.flg_vigencia,  
                    t.cod_tabla_unimed,  
                    t.cod_item_unimed,  
                    e.des_equipo AS c_t_equipo,
                    t.cod_usuario_creo,   
                    t.fec_usuario_creo,   
                    t.cod_usuario_modi,   
                    t.fec_usuario_modi  
                FROM sval_det_tarifario_equipos_alquiler t  
                LEFT JOIN sval_mae_equipo e
                    ON  e.cod_empresa        = t.cod_empresa
                    AND e.cod_empresa_unidad = t.cod_empresa_unidad
                    AND e.cod_equipo         = t.cod_equipo
                WHERE t.cod_empresa        = @cod_empresa 
                  AND t.cod_empresa_unidad = @cod_empresa_unidad 
                  AND t.cod_contrato       = @cod_contrato;";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;

                    // Asignación explícita de tipos para evitar conversiones implícitas costosas
                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = request.cod_empresa;
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = request.cod_empresa_unidad;
                    command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = request.cod_contrato;

                    try
                    {
                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new SvalDetTarifarioEquiposAlquilerDto
                                {
                                    cod_empresa = reader["cod_empresa"].ToString(),
                                    cod_empresa_unidad = reader["cod_empresa_unidad"].ToString(),
                                    cod_contrato = reader["cod_contrato"].ToString(),
                                    cod_equipo = reader["cod_equipo"].ToString(),

                                    // Mapeo numérico seguro
                                    imp_alquiler_hora = reader["imp_alquiler_hora"] != DBNull.Value ? Convert.ToDecimal(reader["imp_alquiler_hora"]) : 0,

                                    ind_turno_trabajo = reader["ind_turno_trabajo"].ToString(),
                                    flg_vigencia = reader["flg_vigencia"].ToString(),
                                    cod_tabla_unimed = reader["cod_tabla_unimed"].ToString(),
                                    cod_item_unimed = reader["cod_item_unimed"].ToString(),
                                    c_t_equipo = reader["c_t_equipo"].ToString(),

                                    cod_usuario_creo = reader["cod_usuario_creo"].ToString(),
                                    fec_usuario_creo = reader["fec_usuario_creo"] != DBNull.Value ? Convert.ToDateTime(reader["fec_usuario_creo"]) : null,

                                    cod_usuario_modi = reader["cod_usuario_modi"].ToString(),
                                    fec_usuario_modi = reader["fec_usuario_modi"] != DBNull.Value ? Convert.ToDateTime(reader["fec_usuario_modi"]) : null
                                };

                                listaEquipos.Add(item);
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("Error al procesar la lectura del tarifario de equipos en alquiler mediante ADO.NET.", ex);
                    }
                }
            }

            return listaEquipos;
        }

        public async Task<List<SvalMaeEquipoDto>> GetEquiposVigentesAsync()
        {
            var listaEquipos = new List<SvalMaeEquipoDto>();

            string query = @"
                SELECT 
                    e.cod_equipo,   
                    e.des_equipo,   
                    e.des_equipo_abrev,   
                    e.flg_vigente   
                FROM sval_mae_equipo e   
                WHERE e.cod_empresa        = @cod_empresa 
                  AND e.cod_empresa_unidad = @cod_empresa_unidad 
                  AND e.flg_vigente        = '1';";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;

                    // Mapeo estricto de parámetros varchar
                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = "03";
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = "01";

                    try
                    {
                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new SvalMaeEquipoDto
                                {
                                    cod_equipo = reader["cod_equipo"].ToString(),
                                    des_equipo = reader["des_equipo"].ToString(),
                                    des_equipo_abrev = reader["des_equipo_abrev"].ToString(),
                                    flg_vigente = reader["flg_vigente"].ToString()
                                };

                                listaEquipos.Add(item);
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("Error al consultar el maestro de equipos vigentes en la base de datos.", ex);
                    }
                }
            }

            return listaEquipos;
        }

        public async Task<List<SvalTablaDetalleDto>> ListaTablaDetalle()
        {
            var listaEquipos = new List<SvalTablaDetalleDto>();

            string query = @"
            SELECT 
                d.cod_tabla,   
                d.cod_item,   
                d.des_tabladet,   
                d.flg_vigencia,   
                d.des_tabladet_abrev   
            FROM sval_mae_tabla_detalle d
            WHERE d.des_tabladet_abrev IS NOT NULL 
              AND d.des_tabladet_abrev <> '';";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;


                    try
                    {
                        await connection.OpenAsync();

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var item = new SvalTablaDetalleDto
                                {
                                    cod_tabla = reader["cod_tabla"].ToString(),
                                    cod_item = reader["cod_item"].ToString(),
                                    des_tabladet = reader["des_tabladet"].ToString(),
                                    flg_vigencia = reader["flg_vigencia"].ToString(),
                                    des_tabladet_abrev = reader["des_tabladet_abrev"].ToString()

                                };

                                listaEquipos.Add(item);
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("Error al consultar el maestro de equipos vigentes en la base de datos.", ex);
                    }
                }
            }

            return listaEquipos;
        }


        public int ObtenerSiguienteItemRuta(string cod_empresa, string cod_empresa_unidad, string cod_contrato)
        {
            // Por defecto, si no hay registros, el primer correlativo será 1
            int siguienteId = 1;

            string query = @"
                SELECT ISNULL(MAX(CAST(t.cod_item_ruta AS INT)), 0) + 1
                FROM sval_det_tarifario_transporte t
                WHERE t.cod_empresa        = @cod_empresa
                  AND t.cod_empresa_unidad = @cod_empresa_unidad
                  AND t.cod_contrato       = @cod_contrato;";

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, cn))
                {
                    // Definición estricta de parámetros para respetar los tipos de SQL Server
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = cod_empresa;
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = cod_empresa_unidad;
                    cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = cod_contrato;

                    try
                    {
                        cn.Open();
                        // ExecuteScalar es ideal aquí porque la consulta devuelve una única fila y columna
                        object resultado = cmd.ExecuteScalar();

                        if (resultado != DBNull.Value && resultado != null)
                        {
                            siguienteId = Convert.ToInt32(resultado);
                        }
                    }
                    catch (Exception ex)
                    {
                        // Registra el error según el estándar de tu proyecto
                        throw new Exception("Error al calcular el correlativo cod_item_ruta", ex);
                    }
                }
            }

            return siguienteId;
        }

        // IMPRIMIR PDFS
        public async Task<List<TarifarioTransporteDetalleDto>> ImprimirTransporteMineral(EntradaTarifarioDetalleImprimrDto request)
        {
            List<TarifarioTransporteDetalleDto> listaDetalle = new();

            // 🎯 Definimos el query de manera directa para inyectarlo en el comando
            string queryText = @"
                SELECT  
                    t.cod_empresa,  
                    t.cod_empresa_unidad,  
                    t.cod_contrato,  
                    t.cod_item_ruta,  
                    t.cod_ruta_origen,  
                    t.cod_ruta_destino,  
                    t.cod_zona,  
                    t.nro_factor_viajepeso,  
                    t.nro_distancia_km,  
                    t.imp_tmh_km_soles,  
                    t.imp_ruta_pu,  
                    t.flg_vigencia,  
                    t.ind_material,  
                    t.cto_cod,  
                    t.cta_cod,  
                    t.cod_usuario_creo,  
                    t.fec_usuario_creo,  
                    t.cod_usuario_modi,  
                    t.fec_usuario_modi,  
                    t.cod_ruta_intermedia,  
                    t.ind_balanza_desmonte,  
                    t.ind_mov_sap,

                    c_t_zona = mz.des_zona,  
                    c_t_origen = r_origen.des_ruta,  
                    c_t_destino = r_destino.des_ruta,  
                    c_t_intermedio = r_intermedia.des_ruta  

                FROM sval_det_tarifario_transporte t  

                LEFT JOIN sval_mae_ruta_transporte r_origen  
                    ON t.cod_empresa = r_origen.cod_empresa  
                   AND t.cod_empresa_unidad = r_origen.cod_empresa_unidad  
                   AND t.cod_ruta_origen = r_origen.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_destino  
                    ON t.cod_empresa = r_destino.cod_empresa  
                   AND t.cod_empresa_unidad = r_destino.cod_empresa_unidad  
                   AND t.cod_ruta_destino = r_destino.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_intermedia  
                    ON t.cod_empresa = r_intermedia.cod_empresa  
                   AND t.cod_empresa_unidad = r_intermedia.cod_empresa_unidad  
                   AND t.cod_ruta_intermedia = r_intermedia.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_zona  
                    ON t.cod_empresa = r_zona.cod_empresa  
                   AND t.cod_empresa_unidad = r_zona.cod_empresa_unidad  
                   AND t.cod_ruta_origen = r_zona.cod_ruta  

                LEFT JOIN mae_zona mz  
                    ON r_zona.cod_empresa = mz.cod_empresa  
                   AND r_zona.cod_empresa_unidad = mz.cod_empresa_unidad  
                   AND r_zona.cod_zona = mz.cod_zona  

                WHERE t.cod_empresa = @cod_empresa  
                  AND t.cod_empresa_unidad = @cod_empresa_unidad  
                  AND t.cod_contrato = @cod_contrato  
                  AND t.ind_material = @ind_material;";

            using SqlConnection connection = new SqlConnection(_connectionString);
            using SqlCommand command = new SqlCommand(queryText, connection);

            command.CommandType = CommandType.Text;

            // Mapeo seguro de parámetros para evitar SQL Injection
            command.Parameters.AddWithValue("@cod_empresa", request.cod_empresa ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cod_empresa_unidad", request.cod_empresa_unidad ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cod_contrato", request.cod_contrato ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@ind_material", request.ind_material ?? (object)DBNull.Value);

            await connection.OpenAsync();

            using SqlDataReader reader = await command.ExecuteReaderAsync();

            // 🎯 Gracias a que centralizaste el mapeo, el ciclo queda reducido a una sola línea limpia
            while (await reader.ReadAsync())
            {
                listaDetalle.Add(MapearFila(reader));
            }

            return listaDetalle;
        }


        public async Task<ReporteTransporteOtrosResponse> ObtenerTransporteOtrosReporte(EntradaTarifarioDetalleImprimrDto request)
        {
            var response = new ReporteTransporteOtrosResponse();

            // Enviamos ambas consultas en un solo bloque de texto separadas por punto y coma
            string query = @"
                
                    SELECT  
                    t.cod_empresa,  
                    t.cod_empresa_unidad,  
                    t.cod_contrato,  
                    t.cod_item_ruta,  
                    t.cod_ruta_origen,  
                    t.cod_ruta_destino,  
                    t.cod_zona,  
                    t.nro_factor_viajepeso,  
                    t.nro_distancia_km,  
                    t.imp_tmh_km_soles,  
                    t.imp_ruta_pu,  
                    t.flg_vigencia,  
                    t.ind_material,  
                    t.cto_cod,  
                    t.cta_cod,  
                    t.cod_usuario_creo,  
                    t.fec_usuario_creo,  
                    t.cod_usuario_modi,  
                    t.fec_usuario_modi,  
                    t.cod_ruta_intermedia,  
                    t.ind_balanza_desmonte,  
                    t.ind_mov_sap,

                    c_t_zona = mz.des_zona,  
                    c_t_origen = r_origen.des_ruta,  
                    c_t_destino = r_destino.des_ruta,  
                    c_t_intermedio = r_intermedia.des_ruta  

                FROM sval_det_tarifario_transporte t  

                LEFT JOIN sval_mae_ruta_transporte r_origen  
                    ON t.cod_empresa = r_origen.cod_empresa  
                   AND t.cod_empresa_unidad = r_origen.cod_empresa_unidad  
                   AND t.cod_ruta_origen = r_origen.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_destino  
                    ON t.cod_empresa = r_destino.cod_empresa  
                   AND t.cod_empresa_unidad = r_destino.cod_empresa_unidad  
                   AND t.cod_ruta_destino = r_destino.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_intermedia  
                    ON t.cod_empresa = r_intermedia.cod_empresa  
                   AND t.cod_empresa_unidad = r_intermedia.cod_empresa_unidad  
                   AND t.cod_ruta_intermedia = r_intermedia.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_zona  
                    ON t.cod_empresa = r_zona.cod_empresa  
                   AND t.cod_empresa_unidad = r_zona.cod_empresa_unidad  
                   AND t.cod_ruta_origen = r_zona.cod_ruta  

                LEFT JOIN mae_zona mz  
                    ON r_zona.cod_empresa = mz.cod_empresa  
                   AND r_zona.cod_empresa_unidad = mz.cod_empresa_unidad  
                   AND r_zona.cod_zona = mz.cod_zona  

                WHERE t.ind_material =  @ind_material AND flg_vigencia = 1 
                      AND t.cod_contrato = @cod_contrato 
                      AND t.cod_empresa = @cod_empresa
                      AND t.cod_empresa_unidad = @cod_empresa_unidad;

                  SELECT  
                    t.cod_empresa,  
                    t.cod_empresa_unidad,  
                    t.cod_contrato,  
                    t.cod_item_ruta,  
                    t.cod_ruta_origen,  
                    t.cod_ruta_destino,  
                    t.cod_zona,  
                    t.nro_factor_viajepeso,  
                    t.nro_distancia_km,  
                    t.imp_tmh_km_soles,  
                    t.imp_ruta_pu,  
                    t.flg_vigencia,  
                    t.ind_material,  
                    t.cto_cod,  
                    t.cta_cod,  
                    t.cod_usuario_creo,  
                    t.fec_usuario_creo,  
                    t.cod_usuario_modi,  
                    t.fec_usuario_modi,  
                    t.cod_ruta_intermedia,  
                    t.ind_balanza_desmonte,  
                    t.ind_mov_sap,

                    c_t_zona = mz.des_zona,  
                    c_t_origen = r_origen.des_ruta,  
                    c_t_destino = r_destino.des_ruta,  
                    c_t_intermedio = r_intermedia.des_ruta  

                FROM sval_det_tarifario_transporte t  

                LEFT JOIN sval_mae_ruta_transporte r_origen  
                    ON t.cod_empresa = r_origen.cod_empresa  
                   AND t.cod_empresa_unidad = r_origen.cod_empresa_unidad  
                   AND t.cod_ruta_origen = r_origen.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_destino  
                    ON t.cod_empresa = r_destino.cod_empresa  
                   AND t.cod_empresa_unidad = r_destino.cod_empresa_unidad  
                   AND t.cod_ruta_destino = r_destino.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_intermedia  
                    ON t.cod_empresa = r_intermedia.cod_empresa  
                   AND t.cod_empresa_unidad = r_intermedia.cod_empresa_unidad  
                   AND t.cod_ruta_intermedia = r_intermedia.cod_ruta  

                LEFT JOIN sval_mae_ruta_transporte r_zona  
                    ON t.cod_empresa = r_zona.cod_empresa  
                   AND t.cod_empresa_unidad = r_zona.cod_empresa_unidad  
                   AND t.cod_ruta_origen = r_zona.cod_ruta  

                LEFT JOIN mae_zona mz  
                    ON r_zona.cod_empresa = mz.cod_empresa  
                   AND r_zona.cod_empresa_unidad = mz.cod_empresa_unidad  
                   AND r_zona.cod_zona = mz.cod_zona  
                WHERE t.ind_material =  @ind_material AND flg_vigencia = 0 
                      AND t.cod_contrato = @cod_contrato 
                      AND t.cod_empresa = @cod_empresa
                      AND t.cod_empresa_unidad = @cod_empresa_unidad;";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@cod_empresa", request.cod_empresa ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", request.cod_empresa_unidad ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@cod_contrato", request.cod_contrato ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@ind_material", request.ind_material ?? (object)DBNull.Value);

                    // 🎯 Apertura asíncrona de la conexión
                    await conn.OpenAsync();

                    // 🎯 Ejecución asíncrona del comando para obtener el reader
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        // 1. LEER EL PRIMER RESULTADO: flg_vigencia = 1 (Rutas Activas)
                        // 🎯 Cambio a ReadAsync()
                        while (await reader.ReadAsync())
                        {
                            response.rutasActivas.Add(MapearFila(reader));
                        }

                        // 2. SALTAR AL SEGUNDO RESULTADO: flg_vigencia = 0 (Rutas Inactivas)
                        // 🎯 Cambio a NextResultAsync() y ReadAsync()
                        if (await reader.NextResultAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                response.rutasInactivas.Add(MapearFila(reader));
                            }
                        }
                    }
                }
            }

            return response;
        }

        // Método auxiliar de mapeo para no duplicar código
        private TarifarioTransporteDetalleDto MapearFila(SqlDataReader reader)
        {
            return new TarifarioTransporteDetalleDto
            {
                // Reemplaza los nombres de columnas por los reales de tu base de datos
                cod_empresa = reader["cod_empresa"]?.ToString(),
                cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                cod_contrato = reader["cod_contrato"]?.ToString(),
                cod_item_ruta = reader["cod_item_ruta"]?.ToString(),
                cod_ruta_origen = reader["cod_ruta_origen"]?.ToString(),
                cod_ruta_destino = reader["cod_ruta_destino"]?.ToString(),
                cod_zona = reader["cod_zona"]?.ToString(),

                nro_factor_viajepeso = reader["nro_factor_viajepeso"] != DBNull.Value
                        ? Convert.ToDecimal(reader["nro_factor_viajepeso"])
                        : null,

                nro_distancia_km = reader["nro_distancia_km"] != DBNull.Value
                        ? Convert.ToDecimal(reader["nro_distancia_km"])
                        : null,

                imp_tmh_km_soles = reader["imp_tmh_km_soles"] != DBNull.Value
                        ? Convert.ToDecimal(reader["imp_tmh_km_soles"])
                        : null,

                imp_ruta_pu = reader["imp_ruta_pu"] != DBNull.Value
                        ? Convert.ToDecimal(reader["imp_ruta_pu"])
                        : null,

                flg_vigencia = reader["flg_vigencia"]?.ToString(),
                ind_material = reader["ind_material"]?.ToString(),
                cto_cod = reader["cto_cod"]?.ToString(),
                cta_cod = reader["cta_cod"]?.ToString(),
                cod_usuario_creo = reader["cod_usuario_creo"]?.ToString(),

                fec_usuario_creo = reader["fec_usuario_creo"] != DBNull.Value
                        ? Convert.ToDateTime(reader["fec_usuario_creo"])
                        : null,

                cod_usuario_modi = reader["cod_usuario_modi"]?.ToString(),

                fec_usuario_modi = reader["fec_usuario_modi"] != DBNull.Value
                        ? Convert.ToDateTime(reader["fec_usuario_modi"])
                        : null,

                cod_ruta_intermedia = reader["cod_ruta_intermedia"]?.ToString(),
                ind_balanza_desmonte = reader["ind_balanza_desmonte"]?.ToString(),
                ind_mov_sap = reader["ind_mov_sap"]?.ToString(),

                // Mapeos descriptivos listos para enviar al jsPDF de Angular
                c_t_zona = reader["c_t_zona"]?.ToString(),
                c_t_origen = reader["c_t_origen"]?.ToString(),
                c_t_destino = reader["c_t_destino"]?.ToString(),
                c_t_intermedio = reader["c_t_intermedio"]?.ToString()
            };
        }
    }

}








