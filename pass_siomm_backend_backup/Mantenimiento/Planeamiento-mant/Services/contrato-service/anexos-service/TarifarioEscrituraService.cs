using DocumentFormat.OpenXml.EMMA;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using NPOI.SS.Formula.Functions;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;
using System.Diagnostics.Contracts;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class TarifarioEscrituraService
    {

        private readonly string _connectionString;


        public TarifarioEscrituraService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }


        public async Task<RespuestaTarifarioDto> EliminarTarifarioDetalleAsync(EliminarTarifarioTransporteDto request)
        {
            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand("SP_ELIMINAR_TARIFARIO_DETALLE_TRANSPORTE", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = request.cod_empresa;
                command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = request.cod_empresa_unidad;
                command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = request.cod_contrato;
                command.Parameters.Add("@cod_item_ruta", SqlDbType.VarChar, 10).Value = request.cod_item_ruta;
                command.Parameters.Add("@ind_material", SqlDbType.VarChar, 5).Value = request.ind_material;

                await connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new RespuestaTarifarioDto
                        {
                            estado = Convert.ToInt32(reader["estado"]),
                            mensaje = reader["mensaje"].ToString()
                        };
                    }
                }
            }

            return new RespuestaTarifarioDto
            {
                estado = -1,
                mensaje = "No se obtuvo respuesta del procedimiento."
            };
        }

        public async Task<RespuestaTarifarioDto> EliminarTarifarioMaterialAsync(EliminarTarifarioTransporteMaterialDto request)
        {
            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand("SP_ELIMINAR_TARIFARIO_TRANSPORTE_MATERIAL", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = request.cod_empresa;
                command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = request.cod_empresa_unidad;
                command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = request.cod_contrato;
                command.Parameters.Add("@cod_item_ruta", SqlDbType.VarChar, 10).Value = request.cod_item_ruta;
                command.Parameters.Add("@cod_tabla", SqlDbType.VarChar, 10).Value = request.cod_tabla;
                command.Parameters.Add("@cod_item", SqlDbType.VarChar, 10).Value = request.cod_item;
                command.Parameters.Add("@ind_balanza_desmonte", SqlDbType.VarChar, 10).Value = request.ind_balanza_desmonte;

                await connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new RespuestaTarifarioDto
                        {
                            estado = Convert.ToInt32(reader["estado"]),
                            mensaje = reader["mensaje"].ToString()
                        };
                    }
                }
            }

            return new RespuestaTarifarioDto
            {
                estado = -1,
                mensaje = "No se obtuvo respuesta del procedimiento."
            };
        }

        public async Task<RespuestaTarifarioDto> EliminarTarifarioEquiposAlquilerAsync(EliminarTarifarioEquiposAlquilerDto request)
        {
            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand("SP_ELIMINAR_TARIFARIO_EQUIPOS_ALQUILER", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = request.cod_empresa;
                command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = request.cod_empresa_unidad;
                command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = request.cod_contrato;
                command.Parameters.Add("@cod_equipo", SqlDbType.VarChar, 10).Value = request.cod_equipo;
                command.Parameters.Add("@cod_tabla_unimed", SqlDbType.VarChar, 10).Value = request.cod_tabla_unimed;
                command.Parameters.Add("@cod_item_unimed", SqlDbType.VarChar, 10).Value = request.cod_item_unimed;
                command.Parameters.Add("@ind_turno_trabajo", SqlDbType.VarChar, 10).Value = request.ind_turno_trabajo;

                await connection.OpenAsync();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new RespuestaTarifarioDto
                        {
                            estado = Convert.ToInt32(reader["estado"]),
                            mensaje = reader["mensaje"].ToString()
                        };
                    }
                }
            }

            return new RespuestaTarifarioDto
            {
                estado = -1,
                mensaje = "No se obtuvo respuesta del procedimiento."
            };
        }



        //INSERTAR DATOS

        public RespuestaTarifarioDto GuardarTarifarioDetalle(List<TarifarioDetalleDto> listaFilas)
        {
            // Creamos un objeto de respuesta inicial
            var resultadoFinal = new RespuestaTarifarioDto { estado = 1, mensaje = "Todos los registros procesados con éxito." };

            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                conexion.Open();

                // Iniciamos una transacción en el backend para asegurar que si una fila falla, todo falle
                using (SqlTransaction transaccion = conexion.BeginTransaction())
                {
                    try
                    {
                        foreach (var fila in listaFilas)
                        {
                            using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_TARIFARIO_DETALLE", conexion, transaccion))
                            {
                                cmd.CommandType = CommandType.StoredProcedure;

                                // 1. Mapeo de Parámetros de Entrada (Inputs)
                                // Determinamos el comodín según lo que enviaste desde Angular

                                cmd.Parameters.AddWithValue("@accion", (object)fila.accion ?? DBNull.Value);

                                cmd.Parameters.AddWithValue("@cod_empresa", (object)fila.cod_empresa ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_empresa_unidad", (object)fila.cod_empresa_unidad ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_contrato", (object)fila.cod_contrato ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_item_ruta", (object)fila.cod_item_ruta ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_ruta_origen", (object)fila.cod_ruta_origen ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_ruta_intermedia", (object)fila.cod_ruta_intermedia ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_ruta_destino", (object)fila.cod_ruta_destino ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_zona", (object)fila.cod_zona ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@nro_distancia_km", fila.nro_distancia_km);
                                cmd.Parameters.AddWithValue("@imp_tmh_km_soles", fila.imp_tmh_km_soles);
                                cmd.Parameters.AddWithValue("@imp_ruta_pu", fila.imp_ruta_pu);
                                cmd.Parameters.AddWithValue("@cto_cod", (object)fila.cto_cod ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cta_cod", (object)fila.cta_cod ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@flg_vigencia", (object)fila.flg_vigencia ?? "1");
                                cmd.Parameters.AddWithValue("@ind_mov_sap", (object)fila.ind_mov_sap ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@ind_material", (object)fila.ind_material ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_usuario_creo", (object)fila.cod_usuario_creo ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@cod_usuario_modi", (object)fila.cod_usuario_modi ?? DBNull.Value);
                                SqlCommand cmdTmp = new SqlCommand("CREATE TABLE #TmpRutas (idx INT IDENTITY(1,1), cod_item_ruta VARCHAR(20), cod_tabla VARCHAR(20), cod_item VARCHAR(20))", conexion, transaccion);
                                // 2. Definición de Parámetros de Salida (Outputs)
                                SqlParameter paramEstado = new SqlParameter("@estado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                                SqlParameter paramMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500) { Direction = ParameterDirection.Output };

                                cmd.Parameters.Add(paramEstado);
                                cmd.Parameters.Add(paramMensaje);

                                // 3. Ejecutar el procedimiento
                                cmd.ExecuteNonQuery();

                                // 4. Evaluar la respuesta del SP para esta fila específica
                                int idEstadoFila = Convert.ToInt32(paramEstado.Value);
                                string mensajeFila = paramMensaje.Value.ToString();

                                if (idEstadoFila == 0)
                                {
                                    // Si el SP controló un error interno (ej. no encontró ID para actualizar)
                                    transaccion.Rollback();
                                    resultadoFinal.estado = 0;
                                    resultadoFinal.mensaje = $"Error en registro {fila.cod_item_ruta}: {mensajeFila}";
                                    return resultadoFinal;
                                }
                            }
                        }

                        // Si todas las filas se ejecutaron bien, confirmamos los cambios en SQL Server 2008
                        transaccion.Commit();
                    }
                    catch (SqlException ex)
                    {
                        // Si ocurre un error físico o de sintaxis en la BD (Excepción de red, FK vacía, etc.)
                        transaccion.Rollback();
                        resultadoFinal.estado = 0;
                        resultadoFinal.mensaje = "Error crítico en Base de Datos: " + ex.Message;
                    }
                    catch (Exception ex)
                    {
                        // Cualquier otro error de código en el servidor
                        transaccion.Rollback();
                        resultadoFinal.estado = 0;
                        resultadoFinal.mensaje = "Error inesperado en Servidor: " + ex.Message;
                    }
                }
            }

            return resultadoFinal;
        }


        //public ProcesarResult GuardarRutasFijasBalanza(RutasFijasBalanzaModel model)
        //{
        //    var resultado = new ProcesarResult();

        //    using (SqlConnection connection = new SqlConnection(_connectionString))
        //    {
        //        using (SqlCommand command = new SqlCommand("SP_GUARDAR_RUTAS_FIJAS_BALANZA", connection))
        //        {
        //            command.CommandType = CommandType.StoredProcedure;

        //            // ----------------------------------------------------
        //            // PARAMETROS DE ENTRADA (INPUT) - MAPEO IDÉNTICO A LA BD
        //            // ----------------------------------------------------
        //            command.Parameters.Add("@accion", SqlDbType.Char, 1).Value = model.accion;
        //            command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = model.cod_empresa;
        //            command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = model.cod_empresa_unidad;
        //            command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = model.cod_contrato;
        //            command.Parameters.Add("@cod_item_ruta", SqlDbType.VarChar, 20).Value = model.cod_item_ruta;
        //            command.Parameters.Add("@cod_tabla", SqlDbType.VarChar, 20).Value = model.cod_tabla;
        //            command.Parameters.Add("@cod_item", SqlDbType.VarChar, 20).Value = model.cod_item;
        //            command.Parameters.Add("@ind_balanza_desmonte", SqlDbType.Char, 1).Value = model.ind_balanza_desmonte;
        //            command.Parameters.Add("@flg_vigente", SqlDbType.Char, 1).Value = model.flg_vigente;

        //            // Mapeo seguro contra valores NULL (Para evitar errores en transacciones)
        //            command.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 50).Value =
        //                string.IsNullOrEmpty(model.cod_usuario_creo) ? (object)DBNull.Value : model.cod_usuario_creo;

        //            command.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 50).Value =
        //                string.IsNullOrEmpty(model.cod_usuario_modi) ? (object)DBNull.Value : model.cod_usuario_modi;

        //            // ----------------------------------------------------
        //            // PARAMETROS DE SALIDA (OUTPUT)
        //            // ----------------------------------------------------
        //            SqlParameter paramEstado = new SqlParameter("@estado", SqlDbType.Int)
        //            {
        //                Direction = ParameterDirection.Output
        //            };
        //            command.Parameters.Add(paramEstado);

        //            SqlParameter paramMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500)
        //            {
        //                Direction = ParameterDirection.Output
        //            };
        //            command.Parameters.Add(paramMensaje);

        //            // ----------------------------------------------------
        //            // EJECUCIÓN SEGURA DE LA TRANSACCIÓN
        //            // ----------------------------------------------------
        //            try
        //            {
        //                connection.Open();
        //                command.ExecuteNonQuery();

        //                // Lectura de los outputs devueltos por el SP
        //                resultado.estado = Convert.ToInt32(paramEstado.Value);
        //                resultado.mensaje = paramMensaje.Value.ToString();
        //            }
        //            catch (Exception ex)
        //            {
        //                resultado.estado = -1;
        //                resultado.mensaje = "Error en Capa de Datos / Infraestructura: " + ex.Message;
        //            }
        //        }
        //    }

        //    return resultado;
        //}

        //public ProcesarResult GuardarRutasFijasBalanza(List<RutasFijasBalanzaModel> listaFilas)
        //{
        //    // Creamos un objeto de respuesta inicial
        //    var resultadoFinal = new ProcesarResult { estado = 1, mensaje = "Todos los registros procesados con éxito." };

        //    using (SqlConnection conexion = new SqlConnection(_connectionString))
        //    {
        //        conexion.Open();

        //        // Iniciamos una transacción en el backend para asegurar que si una fila falla, todo falle
        //        using (SqlTransaction transaccion = conexion.BeginTransaction())
        //        {
        //            try
        //            {
        //                // --------------------------------------------------------------------------
        //                // 🚀 PASO 1: CREAR LA TABLA TEMPORAL UNA SOLA VEZ (AFUERA DEL FOREACH)
        //                // --------------------------------------------------------------------------
        //                string queryTmp = @"CREATE TABLE #TmpRutas (
        //                                idx INT IDENTITY(1,1), 
        //                                cod_item_ruta VARCHAR(20), 
        //                                cod_tabla VARCHAR(20), 
        //                                cod_item VARCHAR(20)
        //                            );";

        //                using (SqlCommand cmdTmp = new SqlCommand(queryTmp, conexion, transaccion))
        //                {
        //                    cmdTmp.ExecuteNonQuery();
        //                }

        //                // --------------------------------------------------------------------------
        //                // 🚀 PASO 2: CAPTURAR LA FOTOGRAFÍA ORIGINAL DE LOS DATOS EN LA BD
        //                // --------------------------------------------------------------------------
        //                var primerFila = listaFilas.FirstOrDefault();
        //                if (primerFila != null)
        //                {
        //                    string queryInsertTmp = @"INSERT INTO #TmpRutas (cod_item_ruta, cod_tabla, cod_item)
        //                                     SELECT cod_item_ruta, cod_tabla, cod_item 
        //                                     FROM sval_det_tarifario_transporte_material
        //                                     WHERE cod_empresa = @cod_empresa 
        //                                       AND cod_empresa_unidad = @cod_empresa_unidad 
        //                                       AND cod_contrato = @cod_contrato
        //                                     ORDER BY fec_usuario_creo ASC;"; // El mismo orden de tu grilla

        //                    using (SqlCommand cmdLlenar = new SqlCommand(queryInsertTmp, conexion, transaccion))
        //                    {
        //                        cmdLlenar.Parameters.AddWithValue("@cod_empresa", primerFila.cod_empresa ?? (object)DBNull.Value);
        //                        cmdLlenar.Parameters.AddWithValue("@cod_empresa_unidad", primerFila.cod_empresa_unidad ?? (object)DBNull.Value);
        //                        cmdLlenar.Parameters.AddWithValue("@cod_contrato", primerFila.cod_contrato ?? (object)DBNull.Value);
        //                        cmdLlenar.ExecuteNonQuery();
        //                    }
        //                }

        //                // --------------------------------------------------------------------------
        //                // 🚀 PASO 3: RECORRER LA GRILLA ENVIADA DESDE ANGULAR CON UN CONTADOR
        //                // --------------------------------------------------------------------------
        //                int indiceFilaActual = 1; // Lleva el control posicional (1, 2, 3...)

        //                foreach (var fila in listaFilas)
        //                {
        //                    using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_RUTAS_FIJAS_BALANZA", conexion, transaccion))
        //                    {
        //                        cmd.CommandType = CommandType.StoredProcedure;

        //                        // Mapeo de Parámetros de Entrada (Inputs)
        //                        cmd.Parameters.Add("@accion", SqlDbType.Char, 1).Value = fila.accion;
        //                        cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = fila.cod_empresa;
        //                        cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = fila.cod_empresa_unidad;
        //                        cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = fila.cod_contrato;
        //                        cmd.Parameters.Add("@cod_item_ruta", SqlDbType.VarChar, 20).Value = fila.cod_item_ruta;
        //                        cmd.Parameters.Add("@cod_tabla", SqlDbType.VarChar, 20).Value = fila.cod_tabla;
        //                        cmd.Parameters.Add("@cod_item", SqlDbType.VarChar, 20).Value = fila.cod_item;
        //                        cmd.Parameters.Add("@ind_balanza_desmonte", SqlDbType.Char, 1).Value = fila.ind_balanza_desmonte;
        //                        cmd.Parameters.Add("@flg_vigente", SqlDbType.Char, 1).Value = fila.flg_vigente;

        //                        // Mapeo seguro contra valores NULL
        //                        cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 50).Value =
        //                            string.IsNullOrEmpty(fila.cod_usuario_creo) ? (object)DBNull.Value : fila.cod_usuario_creo;

        //                        cmd.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 50).Value =
        //                            string.IsNullOrEmpty(fila.cod_usuario_modi) ? (object)DBNull.Value : fila.cod_usuario_modi;

        //                        // 🚨 PASO 4: LE PASAMOS EL ÍNDICE CORRESPONDIENTE AL SP
        //                        cmd.Parameters.Add("@indice_fila", SqlDbType.Int).Value = indiceFilaActual;

        //                        // Definición de Parámetros de Salida (Outputs)
        //                        SqlParameter paramEstado = new SqlParameter("@estado", SqlDbType.Int) { Direction = ParameterDirection.Output };
        //                        SqlParameter paramMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500) { Direction = ParameterDirection.Output };

        //                        cmd.Parameters.Add(paramEstado);
        //                        cmd.Parameters.Add(paramMensaje);

        //                        // Ejecutar el procedimiento para la fila actual
        //                        cmd.ExecuteNonQuery();

        //                        // Evaluar la respuesta del SP para esta fila específica
        //                        int idEstadoFila = Convert.ToInt32(paramEstado.Value);
        //                        string mensajeFila = paramMensaje.Value?.ToString() ?? "";

        //                        if (idEstadoFila == 0)
        //                        {
        //                            // Si el SP controló un error interno (ej. validación), deshacemos todo el lote
        //                            transaccion.Rollback();
        //                            resultadoFinal.estado = 0;
        //                            resultadoFinal.mensaje = $"Error en registro de fila {indiceFilaActual} [Ruta: {fila.cod_item_ruta}]: {mensajeFila}";
        //                            return resultadoFinal;
        //                        }
        //                    }

        //                    // Incrementamos el contador para emparejar la siguiente fila
        //                    indiceFilaActual++;
        //                }

        //                // Si todo el bucle fue exitoso, consolidamos los cambios físicos en la base de datos
        //                transaccion.Commit();
        //            }
        //            catch (SqlException ex)
        //            {
        //                transaccion.Rollback();
        //                resultadoFinal.estado = -1;
        //                resultadoFinal.mensaje = "Error crítico en Base de Datos: " + ex.Message;
        //            }
        //            catch (Exception ex)
        //            {
        //                transaccion.Rollback();
        //                resultadoFinal.estado = -1;
        //                resultadoFinal.mensaje = "Error inesperado en Servidor: " + ex.Message;
        //            }
        //        }
        //    }

        //    return resultadoFinal;
        //}

        public ProcesarResult GuardarRutasFijasBalanza(List<RutasFijasBalanzaModel> listaFilas)
        {
            // Creamos un objeto de respuesta inicial
            var resultadoFinal = new ProcesarResult { estado = 1, mensaje = "Todos los registros procesados con éxito." };

            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                conexion.Open();

                // Iniciamos una transacción en el backend para asegurar que si una fila falla, todo falle
                using (SqlTransaction transaccion = conexion.BeginTransaction())
                {
                    // 🚨 GENERAMOS UN NOMBRE ÚNICO PARA LA TABLA GLOBAL
                    // Esto evita choques en la memoria si dos usuarios guardan al mismo tiempo
                    string nombreTablaGlobal = "##TmpRutas_" + conexion.ClientConnectionId.ToString().Replace("-", "");

                    try
                    {
                        // --------------------------------------------------------------------------
                        // 🚀 PASO 1: CREAR LA TABLA TEMPORAL GLOBAL ÚNICA (AFUERA DEL FOR)
                        // --------------------------------------------------------------------------
                        string queryTmp = $@"CREATE TABLE {nombreTablaGlobal} (
                                        guid_vinculo VARCHAR(50), 
                                        cod_item_ruta VARCHAR(20), 
                                        cod_tabla VARCHAR(20), 
                                        cod_item VARCHAR(20)
                                    );";

                        using (SqlCommand cmdTmp = new SqlCommand(queryTmp, conexion, transaccion))
                        {
                            cmdTmp.ExecuteNonQuery();
                        }

                        // --------------------------------------------------------------------------
                        // 🚀 PASO 2: LEER LOS DATOS ORIGINALES A UNA LISTA EN MEMORIA (Para liberar el Reader)
                        // --------------------------------------------------------------------------
                        var primerFila = listaFilas.FirstOrDefault();
                        List<RutasFijasBalanzaModel> temporalesBD = new List<RutasFijasBalanzaModel>();

                        if (primerFila != null)
                        {
                            string queryOriginales = @"SELECT cod_item_ruta, cod_tabla, cod_item 
                                               FROM sval_det_tarifario_transporte_material
                                               WHERE cod_empresa = @cod_empresa 
                                                 AND cod_empresa_unidad = @cod_empresa_unidad 
                                                 AND cod_contrato = @cod_contrato
                                               ORDER BY fec_usuario_creo ASC;"; // 💡 El mismo ORDER BY exacto que usa el SP

                            using (SqlCommand cmdGet = new SqlCommand(queryOriginales, conexion, transaccion))
                            {
                                cmdGet.Parameters.AddWithValue("@cod_empresa", primerFila.cod_empresa ?? (object)DBNull.Value);
                                cmdGet.Parameters.AddWithValue("@cod_empresa_unidad", primerFila.cod_empresa_unidad ?? (object)DBNull.Value);
                                cmdGet.Parameters.AddWithValue("@cod_contrato", primerFila.cod_contrato ?? (object)DBNull.Value);

                                using (SqlDataReader reader = cmdGet.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        temporalesBD.Add(new RutasFijasBalanzaModel
                                        {
                                            cod_item_ruta = reader["cod_item_ruta"].ToString(),
                                            cod_tabla = reader["cod_tabla"].ToString(),
                                            cod_item = reader["cod_item"].ToString()
                                        });
                                    }
                                } // 👈 Aquí se cierra el Reader por completo, blindando SQL Server 2008 de bloqueos
                            }

                            // --------------------------------------------------------------------------
                            // 🚀 PASO 3: POBLAR LA TABLA GLOBAL ASOCIANDO LA POSICIÓN RELATIVA DE ACTUALIZACIÓN
                            // --------------------------------------------------------------------------
                            int indexUpdate = 0;
                            for (int i = 0; i < listaFilas.Count; i++)
                            {
                                // Registramos en la tabla temporal únicamente la fotografía anterior de los registros que se van a actualizar
                                if (listaFilas[i].accion == "U" && indexUpdate < temporalesBD.Count)
                                {
                                    string queryInsertTmp = $@"INSERT INTO {nombreTablaGlobal} (guid_vinculo, cod_item_ruta, cod_tabla, cod_item) 
                                                     VALUES (@guid, @cod_item_ruta, @cod_tabla, @cod_item);";

                                    using (SqlCommand cmdLlenar = new SqlCommand(queryInsertTmp, conexion, transaccion))
                                    {
                                        cmdLlenar.Parameters.AddWithValue("@guid", "Fila_" + i); // El índice posicional exacto de la grilla
                                        cmdLlenar.Parameters.AddWithValue("@cod_item_ruta", temporalesBD[indexUpdate].cod_item_ruta);
                                        cmdLlenar.Parameters.AddWithValue("@cod_tabla", temporalesBD[indexUpdate].cod_tabla);
                                        cmdLlenar.Parameters.AddWithValue("@cod_item", temporalesBD[indexUpdate].cod_item);
                                        cmdLlenar.ExecuteNonQuery();
                                    }
                                    indexUpdate++;
                                }
                            }
                        }

                        // --------------------------------------------------------------------------
                        // 🚀 PASO 4: RECORRER LA GRILLA ENVIADA DESDE ANGULAR USANDO UN BUCLE 'FOR'
                        // --------------------------------------------------------------------------
                        for (int i = 0; i < listaFilas.Count; i++)
                        {
                            var fila = listaFilas[i];

                            using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_RUTAS_FIJAS_BALANZA", conexion, transaccion))
                            {
                                cmd.CommandType = CommandType.StoredProcedure;

                                // Mapeo de Parámetros de Entrada (Inputs)
                                cmd.Parameters.Add("@accion", SqlDbType.Char, 1).Value = fila.accion;
                                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = fila.cod_empresa;
                                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = fila.cod_empresa_unidad;
                                cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = fila.cod_contrato;
                                cmd.Parameters.Add("@cod_item_ruta", SqlDbType.VarChar, 20).Value = fila.cod_item_ruta;
                                cmd.Parameters.Add("@cod_tabla", SqlDbType.VarChar, 20).Value = fila.cod_tabla;
                                cmd.Parameters.Add("@cod_item", SqlDbType.VarChar, 20).Value = fila.cod_item;
                                cmd.Parameters.Add("@ind_balanza_desmonte", SqlDbType.Char, 1).Value = fila.ind_balanza_desmonte;
                                cmd.Parameters.Add("@flg_vigente", SqlDbType.Char, 1).Value = fila.flg_vigente;

                                // Mapeo seguro contra valores NULL
                                cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 50).Value =
                                    string.IsNullOrEmpty(fila.cod_usuario_creo) ? (object)DBNull.Value : fila.cod_usuario_creo;

                                cmd.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 50).Value =
                                    string.IsNullOrEmpty(fila.cod_usuario_modi) ? (object)DBNull.Value : fila.cod_usuario_modi;

                                // 🚨 PASO NUEVO: LE PASAMOS EL IDENTIFICADOR DE VÍNCULO Y EL NOMBRE DE LA TABLA GLOBAL AL SP
                                cmd.Parameters.Add("@guid_vinculo", SqlDbType.VarChar, 50).Value = "Fila_" + i;
                                cmd.Parameters.Add("@nombre_tabla_tmp", SqlDbType.VarChar, 128).Value = nombreTablaGlobal;

                                // Definición de Parámetros de Salida (Outputs)
                                SqlParameter paramEstado = new SqlParameter("@estado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                                SqlParameter paramMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500) { Direction = ParameterDirection.Output };

                                cmd.Parameters.Add(paramEstado);
                                cmd.Parameters.Add(paramMensaje);

                                // Ejecutar el procedimiento para la fila actual
                                cmd.ExecuteNonQuery();

                                // Evaluar la respuesta del SP para esta fila específica
                                int idEstadoFila = Convert.ToInt32(paramEstado.Value);
                                string mensajeFila = paramMensaje.Value?.ToString() ?? "";

                                if (idEstadoFila == 0)
                                {
                                    // Si falla una sola fila, abortamos y deshacemos todo el lote
                                    transaccion.Rollback();
                                    EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                                    resultadoFinal.estado = 0;
                                    resultadoFinal.mensaje = $"Error en registro de fila {i + 1} [Ruta: {fila.cod_item_ruta}]: {mensajeFila}";
                                    return resultadoFinal;
                                }
                            }
                        }

                        // Si todas las filas se procesaron con éxito, confirmamos los cambios físicos en la base de datos
                        transaccion.Commit();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                    }
                    catch (SqlException ex)
                    {
                        transaccion.Rollback();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                        resultadoFinal.estado = -1;
                        resultadoFinal.mensaje = "Error crítico en Base de Datos: " + ex.Message;
                    }
                    catch (Exception ex)
                    {
                        transaccion.Rollback();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                        resultadoFinal.estado = -1;
                        resultadoFinal.mensaje = "Error inesperado en Servidor: " + ex.Message;
                    }
                }
            }

            return resultadoFinal;
        }



        public ProcesarResult GuardarAlquilerEquipo(List<RutasFijasBalanzaModel> listaFilas)
        {
            // Creamos un objeto de respuesta inicial
            var resultadoFinal = new ProcesarResult { estado = 1, mensaje = "Todos los registros procesados con éxito." };

            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                conexion.Open();

                // Iniciamos una transacción en el backend para asegurar que si una fila falla, todo falle
                using (SqlTransaction transaccion = conexion.BeginTransaction())
                {
                    // 🚨 GENERAMOS UN NOMBRE ÚNICO PARA LA TABLA GLOBAL
                    // Esto evita choques en la memoria si dos usuarios guardan al mismo tiempo
                    string nombreTablaGlobal = "##TmpRutas_" + conexion.ClientConnectionId.ToString().Replace("-", "");

                    try
                    {
                        // --------------------------------------------------------------------------
                        // 🚀 PASO 1: CREAR LA TABLA TEMPORAL GLOBAL ÚNICA (AFUERA DEL FOR)
                        // --------------------------------------------------------------------------
                        string queryTmp = $@"CREATE TABLE {nombreTablaGlobal} (
                                        guid_vinculo VARCHAR(50), 
                                        cod_item_ruta VARCHAR(20), 
                                        cod_tabla VARCHAR(20), 
                                        cod_item VARCHAR(20)
                                    );";

                        using (SqlCommand cmdTmp = new SqlCommand(queryTmp, conexion, transaccion))
                        {
                            cmdTmp.ExecuteNonQuery();
                        }

                        // --------------------------------------------------------------------------
                        // 🚀 PASO 2: LEER LOS DATOS ORIGINALES A UNA LISTA EN MEMORIA (Para liberar el Reader)
                        // --------------------------------------------------------------------------
                        var primerFila = listaFilas.FirstOrDefault();
                        List<RutasFijasBalanzaModel> temporalesBD = new List<RutasFijasBalanzaModel>();

                        if (primerFila != null)
                        {
                            string queryOriginales = @"SELECT cod_item_ruta, cod_tabla, cod_item 
                                               FROM sval_det_tarifario_transporte_material
                                               WHERE cod_empresa = @cod_empresa 
                                                 AND cod_empresa_unidad = @cod_empresa_unidad 
                                                 AND cod_contrato = @cod_contrato
                                               ORDER BY fec_usuario_creo ASC;"; // 💡 El mismo ORDER BY exacto que usa el SP

                            using (SqlCommand cmdGet = new SqlCommand(queryOriginales, conexion, transaccion))
                            {
                                cmdGet.Parameters.AddWithValue("@cod_empresa", primerFila.cod_empresa ?? (object)DBNull.Value);
                                cmdGet.Parameters.AddWithValue("@cod_empresa_unidad", primerFila.cod_empresa_unidad ?? (object)DBNull.Value);
                                cmdGet.Parameters.AddWithValue("@cod_contrato", primerFila.cod_contrato ?? (object)DBNull.Value);

                                using (SqlDataReader reader = cmdGet.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        temporalesBD.Add(new RutasFijasBalanzaModel
                                        {
                                            cod_item_ruta = reader["cod_item_ruta"].ToString(),
                                            cod_tabla = reader["cod_tabla"].ToString(),
                                            cod_item = reader["cod_item"].ToString()
                                        });
                                    }
                                } // 👈 Aquí se cierra el Reader por completo, blindando SQL Server 2008 de bloqueos
                            }

                            // --------------------------------------------------------------------------
                            // 🚀 PASO 3: POBLAR LA TABLA GLOBAL ASOCIANDO LA POSICIÓN RELATIVA DE ACTUALIZACIÓN
                            // --------------------------------------------------------------------------
                            int indexUpdate = 0;
                            for (int i = 0; i < listaFilas.Count; i++)
                            {
                                // Registramos en la tabla temporal únicamente la fotografía anterior de los registros que se van a actualizar
                                if (listaFilas[i].accion == "U" && indexUpdate < temporalesBD.Count)
                                {
                                    string queryInsertTmp = $@"INSERT INTO {nombreTablaGlobal} (guid_vinculo, cod_item_ruta, cod_tabla, cod_item) 
                                                     VALUES (@guid, @cod_item_ruta, @cod_tabla, @cod_item);";

                                    using (SqlCommand cmdLlenar = new SqlCommand(queryInsertTmp, conexion, transaccion))
                                    {
                                        cmdLlenar.Parameters.AddWithValue("@guid", "Fila_" + i); // El índice posicional exacto de la grilla
                                        cmdLlenar.Parameters.AddWithValue("@cod_item_ruta", temporalesBD[indexUpdate].cod_item_ruta);
                                        cmdLlenar.Parameters.AddWithValue("@cod_tabla", temporalesBD[indexUpdate].cod_tabla);
                                        cmdLlenar.Parameters.AddWithValue("@cod_item", temporalesBD[indexUpdate].cod_item);
                                        cmdLlenar.ExecuteNonQuery();
                                    }
                                    indexUpdate++;
                                }
                            }
                        }

                        // --------------------------------------------------------------------------
                        // 🚀 PASO 4: RECORRER LA GRILLA ENVIADA DESDE ANGULAR USANDO UN BUCLE 'FOR'
                        // --------------------------------------------------------------------------
                        for (int i = 0; i < listaFilas.Count; i++)
                        {
                            var fila = listaFilas[i];

                            using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_RUTAS_FIJAS_BALANZA", conexion, transaccion))
                            {
                                cmd.CommandType = CommandType.StoredProcedure;

                                // Mapeo de Parámetros de Entrada (Inputs)
                                cmd.Parameters.Add("@accion", SqlDbType.Char, 1).Value = fila.accion;
                                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = fila.cod_empresa;
                                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = fila.cod_empresa_unidad;
                                cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = fila.cod_contrato;
                                cmd.Parameters.Add("@cod_item_ruta", SqlDbType.VarChar, 20).Value = fila.cod_item_ruta;
                                cmd.Parameters.Add("@cod_tabla", SqlDbType.VarChar, 20).Value = fila.cod_tabla;
                                cmd.Parameters.Add("@cod_item", SqlDbType.VarChar, 20).Value = fila.cod_item;
                                cmd.Parameters.Add("@ind_balanza_desmonte", SqlDbType.Char, 1).Value = fila.ind_balanza_desmonte;
                                cmd.Parameters.Add("@flg_vigente", SqlDbType.Char, 1).Value = fila.flg_vigente;

                                // Mapeo seguro contra valores NULL
                                cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 50).Value =
                                    string.IsNullOrEmpty(fila.cod_usuario_creo) ? (object)DBNull.Value : fila.cod_usuario_creo;

                                cmd.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 50).Value =
                                    string.IsNullOrEmpty(fila.cod_usuario_modi) ? (object)DBNull.Value : fila.cod_usuario_modi;

                                // 🚨 PASO NUEVO: LE PASAMOS EL IDENTIFICADOR DE VÍNCULO Y EL NOMBRE DE LA TABLA GLOBAL AL SP
                                cmd.Parameters.Add("@guid_vinculo", SqlDbType.VarChar, 50).Value = "Fila_" + i;
                                cmd.Parameters.Add("@nombre_tabla_tmp", SqlDbType.VarChar, 128).Value = nombreTablaGlobal;

                                // Definición de Parámetros de Salida (Outputs)
                                SqlParameter paramEstado = new SqlParameter("@estado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                                SqlParameter paramMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500) { Direction = ParameterDirection.Output };

                                cmd.Parameters.Add(paramEstado);
                                cmd.Parameters.Add(paramMensaje);

                                // Ejecutar el procedimiento para la fila actual
                                cmd.ExecuteNonQuery();

                                // Evaluar la respuesta del SP para esta fila específica
                                int idEstadoFila = Convert.ToInt32(paramEstado.Value);
                                string mensajeFila = paramMensaje.Value?.ToString() ?? "";

                                if (idEstadoFila == 0)
                                {
                                    // Si falla una sola fila, abortamos y deshacemos todo el lote
                                    transaccion.Rollback();
                                    EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                                    resultadoFinal.estado = 0;
                                    resultadoFinal.mensaje = $"Error en registro de fila {i + 1} [Ruta: {fila.cod_item_ruta}]: {mensajeFila}";
                                    return resultadoFinal;
                                }
                            }
                        }

                        // Si todas las filas se procesaron con éxito, confirmamos los cambios físicos en la base de datos
                        transaccion.Commit();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                    }
                    catch (SqlException ex)
                    {
                        transaccion.Rollback();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                        resultadoFinal.estado = -1;
                        resultadoFinal.mensaje = "Error crítico en Base de Datos: " + ex.Message;
                    }
                    catch (Exception ex)
                    {
                        transaccion.Rollback();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                        resultadoFinal.estado = -1;
                        resultadoFinal.mensaje = "Error inesperado en Servidor: " + ex.Message;
                    }
                }
            }

            return resultadoFinal;
        }

        public ProcesarResult GuardarTarifarioAlquilerEquipos(List<TarifarioAlquilerEquiposModel> listaFilas)
        {
            // Objeto de respuesta estándar para el controlador
            var resultadoFinal = new ProcesarResult { estado = 1, mensaje = "Todos los registros de equipos procesados con éxito." };

            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                conexion.Open();

                using (SqlTransaction transaccion = conexion.BeginTransaction())
                {
                    // 🚨 Identificador único para la tabla temporal global para evitar colisiones entre usuarios
                    string nombreTablaGlobal = "##TmpEquipos_" + conexion.ClientConnectionId.ToString().Replace("-", "");

                    try
                    {
                        // --------------------------------------------------------------------------
                        // 🚀 PASO 1: CREAR LA TABLA TEMPORAL GLOBAL ÚNICA (Específica para Equipos)
                        // --------------------------------------------------------------------------
                        string queryTmp = $@"CREATE TABLE {nombreTablaGlobal} (
                                        guid_vinculo VARCHAR(50), 
                                        cod_equipo VARCHAR(20), 
                                        ind_turno_trabajo CHAR(1)
                                    );";

                        using (SqlCommand cmdTmp = new SqlCommand(queryTmp, conexion, transaccion))
                        {
                            cmdTmp.ExecuteNonQuery();
                        }

                        // --------------------------------------------------------------------------
                        // 🚀 PASO 2: FOTOGRAFÍA ORIGINAL DE LA BD EN UNA LISTA EN MEMORIA
                        // --------------------------------------------------------------------------
                        var primerFila = listaFilas.FirstOrDefault();
                        List<TarifarioAlquilerEquiposModel> temporalesBD = new List<TarifarioAlquilerEquiposModel>();

                        if (primerFila != null)
                        {
                            string queryOriginales = @"SELECT cod_equipo, ind_turno_trabajo 
                                               FROM sval_det_tarifario_equipos_alquiler
                                               WHERE cod_empresa = @cod_empresa 
                                                 AND cod_empresa_unidad = @cod_empresa_unidad 
                                                 AND cod_contrato = @cod_contrato
                                               ORDER BY fec_usuario_creo ASC;"; // 💡 Mismo orden que requiere la CTE del SP

                            using (SqlCommand cmdGet = new SqlCommand(queryOriginales, conexion, transaccion))
                            {
                                cmdGet.Parameters.AddWithValue("@cod_empresa", primerFila.cod_empresa ?? (object)DBNull.Value);
                                cmdGet.Parameters.AddWithValue("@cod_empresa_unidad", primerFila.cod_empresa_unidad ?? (object)DBNull.Value);
                                cmdGet.Parameters.AddWithValue("@cod_contrato", primerFila.cod_contrato ?? (object)DBNull.Value);

                                using (SqlDataReader reader = cmdGet.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        temporalesBD.Add(new TarifarioAlquilerEquiposModel
                                        {
                                            cod_equipo = reader["cod_equipo"].ToString(),
                                            ind_turno_trabajo = reader["ind_turno_trabajo"].ToString()
                                        });
                                    }
                                } // 👈 Importante: El Reader se destruye aquí liberando la conexión inmediatamente
                            }

                            // --------------------------------------------------------------------------
                            // 🚀 PASO 3: POBLAR LA TABLA GLOBAL ASOCIANDO CADA FILA DE ACTUALIZACIÓN ('U')
                            // --------------------------------------------------------------------------
                            int indexUpdate = 0;
                            for (int i = 0; i < listaFilas.Count; i++)
                            {
                                // Guardamos el estado anterior únicamente para los renglones que van a ejecutarse como Update
                                if (listaFilas[i].accion == "U" && indexUpdate < temporalesBD.Count)
                                {
                                    string queryInsertTmp = $@"INSERT INTO {nombreTablaGlobal} (guid_vinculo, cod_equipo, ind_turno_trabajo) 
                                                     VALUES (@guid, @cod_equipo, @ind_turno);";

                                    using (SqlCommand cmdLlenar = new SqlCommand(queryInsertTmp, conexion, transaccion))
                                    {
                                        cmdLlenar.Parameters.AddWithValue("@guid", "Fila_" + i); // Mapeo estricto del índice visual de Angular
                                        cmdLlenar.Parameters.AddWithValue("@cod_equipo", temporalesBD[indexUpdate].cod_equipo);
                                        cmdLlenar.Parameters.AddWithValue("@ind_turno", temporalesBD[indexUpdate].ind_turno_trabajo);
                                        cmdLlenar.ExecuteNonQuery();
                                    }
                                    indexUpdate++;
                                }
                            }
                        }

                        // --------------------------------------------------------------------------
                        // 🚀 PASO 4: EJECUTAR EL BUCLE PRINCIPAL LLAMANDO AL SP FILA POR FILA
                        // --------------------------------------------------------------------------
                        for (int i = 0; i < listaFilas.Count; i++)
                        {
                            var fila = listaFilas[i];

                            using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_TARIFARIO_ALQUILER_EQUIPOS", conexion, transaccion))
                            {
                                cmd.CommandType = CommandType.StoredProcedure;

                                // Parámetros de Entrada (Inputs del SP)
                                cmd.Parameters.Add("@accion", SqlDbType.Char, 1).Value = fila.accion;
                                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = fila.cod_empresa;
                                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = fila.cod_empresa_unidad;
                                cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = fila.cod_contrato;
                                cmd.Parameters.Add("@cod_equipo", SqlDbType.VarChar, 20).Value = fila.cod_equipo;
                                cmd.Parameters.Add("@cod_tabla_unimed", SqlDbType.VarChar, 20).Value = fila.cod_tabla_unimed;
                                cmd.Parameters.Add("@cod_item_unimed", SqlDbType.VarChar, 20).Value = fila.cod_item_unimed;
                                cmd.Parameters.Add("@imp_alquiler_hora", SqlDbType.Decimal).Value = fila.imp_alquiler_hora;
                                cmd.Parameters.Add("@ind_turno_trabajo", SqlDbType.Char, 1).Value = fila.ind_turno_trabajo;
                                cmd.Parameters.Add("@flg_vigencia", SqlDbType.Char, 1).Value = fila.flg_vigencia;
                                cmd.Parameters.Add("@imp_alquiler_hora_dolar", SqlDbType.Decimal).Value = fila.imp_alquiler_hora_dolar;

                                // Validaciones nulas para auditorías de usuario
                                cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 50).Value =
                                    string.IsNullOrEmpty(fila.cod_usuario_creo) ? (object)DBNull.Value : fila.cod_usuario_creo;

                                cmd.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 50).Value =
                                    string.IsNullOrEmpty(fila.cod_usuario_modi) ? (object)DBNull.Value : fila.cod_usuario_modi;

                                // 🚨 PARÁMETROS CLAVE: Vinculamos la posición exacta y el nombre de la tabla dinámica
                                cmd.Parameters.Add("@guid_vinculo", SqlDbType.VarChar, 50).Value = "Fila_" + i;
                                cmd.Parameters.Add("@nombre_tabla_tmp", SqlDbType.VarChar, 128).Value = nombreTablaGlobal;

                                // Definición de Parámetros de Salida (Outputs del SP)
                                SqlParameter paramEstado = new SqlParameter("@estado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                                SqlParameter paramMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500) { Direction = ParameterDirection.Output };
                                cmd.Parameters.Add(paramEstado);
                                cmd.Parameters.Add(paramMensaje);

                                // Ejecutamos para la fila actual de la iteración
                                cmd.ExecuteNonQuery();

                                int idEstadoFila = Convert.ToInt32(paramEstado.Value);
                                string mensajeFila = paramMensaje.Value?.ToString() ?? "";

                                if (idEstadoFila == 0)
                                {
                                    // Si una sola fila devuelve error, hacemos Rollback de todo el lote por seguridad transaccional
                                    transaccion.Rollback();
                                    EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                                    resultadoFinal.estado = 0;
                                    resultadoFinal.mensaje = $"Error en registro de fila {i + 1} [Equipo: {fila.cod_equipo}]: {mensajeFila}";
                                    return resultadoFinal;
                                }
                            }
                        }

                        // Consolidamos definitivamente en la base de datos física si todo salió bien
                        transaccion.Commit();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                    }
                    catch (SqlException ex)
                    {
                        transaccion.Rollback();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                        resultadoFinal.estado = -1;
                        resultadoFinal.mensaje = "Error crítico en Base de Datos: " + ex.Message;
                    }
                    catch (Exception ex)
                    {
                        transaccion.Rollback();
                        EliminarTablaGlobalSeguro(nombreTablaGlobal, _connectionString);
                        resultadoFinal.estado = -1;
                        resultadoFinal.mensaje = "Error inesperado en Servidor: " + ex.Message;
                    }
                }
            }

            return resultadoFinal;
        }

        // 🛠️ FUNCIÓN AUXILIAR: Garantiza la limpieza absoluta de la tabla global en la tempdb de SQL
        private void EliminarTablaGlobalSeguro(string nombreTabla, string connectionString)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    string dropQuery = $"IF OBJECT_ID('tempdb..{nombreTabla}') IS NOT NULL DROP TABLE {nombreTabla};";
                    using (SqlCommand cmdDrop = new SqlCommand(dropQuery, conn))
                    {
                        cmdDrop.ExecuteNonQuery();
                    }
                }
            }
            catch { /* Silenciar para no bloquear el flujo de retorno principal */ }
        }


    }

}





