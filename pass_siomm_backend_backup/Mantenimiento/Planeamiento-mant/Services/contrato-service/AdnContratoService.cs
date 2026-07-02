using Microsoft.Data.SqlClient;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class AdmContratoService
    {

        private readonly string _connectionString;


        public AdmContratoService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<ContrataDto>> ObteneAdmContrata()
        {
            List<ContrataDto> lista = new();

            using SqlConnection cn = new(_connectionString);

            string query = @"
                SELECT 
                    cod_contrata,
                    des_contrata
                FROM PAS_STD.dbo.mae_contrata
                WHERE est_contrata = 'ACT'
                ORDER BY des_contrata";

            using SqlCommand cmd = new(query, cn);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new ContrataDto
                {
                    cod_contrata = dr["cod_contrata"]?.ToString(),
                    des_contrata = dr["des_contrata"]?.ToString()
                });
            }

            return lista;
        }


        public async Task<List<ContrataAdmDto>> ListaAdmContrato(FiltrosAdmContratoDto filtro)
        {

            List<ContrataAdmDto> lista = new();

            using SqlConnection cn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new("SP_LISTAR_ADM_CONTRATO", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");

            cmd.Parameters.AddWithValue("@cod_contrata",
                string.IsNullOrWhiteSpace(filtro.cod_contrata) ? DBNull.Value : filtro.cod_contrata);

            cmd.Parameters.AddWithValue("@cod_contrato",
                string.IsNullOrWhiteSpace(filtro.cod_contrato) ? DBNull.Value : filtro.cod_contrato);

            cmd.Parameters.AddWithValue("@ind_estado",
                string.IsNullOrWhiteSpace(filtro.ind_estado) ? DBNull.Value : filtro.ind_estado);


            cmd.Parameters.Add("@fec_inicio", SqlDbType.Date).Value =
                (object?)filtro.fec_inicio ?? DBNull.Value;

            cmd.Parameters.Add("@fec_termino", SqlDbType.Date).Value =
                (object?)filtro.fec_termino ?? DBNull.Value;

            cmd.Parameters.Add("@dia_ini", SqlDbType.Int).Value =
                (object?)filtro.dia_ini ?? DBNull.Value;

            cmd.Parameters.Add("@dia_fin", SqlDbType.Int).Value =
                (object?)filtro.dia_fin ?? DBNull.Value;

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new ContrataAdmDto
                {
                    cod_empresa =
                        dr["cod_empresa"]?.ToString(),

                    cod_empresa_unidad =
                        dr["cod_empresa_unidad"]?.ToString(),

                    cod_contrato =
                        dr["cod_contrato"]?.ToString(),

                    cod_contrata =
                        dr["cod_contrata"]?.ToString(),

                    fec_registro =
                        dr["fec_registro"] != DBNull.Value
                            ? Convert.ToDateTime(dr["fec_registro"])
                            : null,

                    fec_firma =
                        dr["fec_firma"] != DBNull.Value
                            ? Convert.ToDateTime(dr["fec_firma"])
                            : null,

                    fec_inicio =
                        dr["fec_inicio"] != DBNull.Value
                            ? Convert.ToDateTime(dr["fec_inicio"])
                            : null,

                    fec_termino =
                        dr["fec_termino"] != DBNull.Value
                            ? Convert.ToDateTime(dr["fec_termino"])
                            : null,

                    des_contacto_contrata =
                        dr["des_contacto_contrata"]?.ToString(),

                    imp_tipo_cambio =
                        dr["imp_tipo_cambio"] != DBNull.Value
                            ? Convert.ToDecimal(dr["imp_tipo_cambio"])
                            : null,

                    nro_adendum =
                        dr["nro_adendum"] != DBNull.Value
                            ? Convert.ToInt32(dr["nro_adendum"])
                            : null,

                    des_observacion =
                        dr["des_observacion"]?.ToString(),

                    ind_situacion =
                        dr["ind_situacion"]?.ToString(),

                    ind_estado =
                        dr["ind_estado"]?.ToString(),

                    ind_tipo_contrato =
                        dr["ind_tipo_contrato"]?.ToString(),

                    flg_vigente =
                        dr["flg_vigente"] != DBNull.Value
                            ? Convert.ToInt32(dr["flg_vigente"])
                            : null,

                    cod_usuario_creo =
                        dr["cod_usuario_creo"]?.ToString(),

                    fec_usuario_creo =
                        dr["fec_usuario_creo"] != DBNull.Value
                            ? Convert.ToDateTime(dr["fec_usuario_creo"])
                            : null,

                    c_n_dias_curso =
                        dr["c_n_dias_curso"] != DBNull.Value
                            ? Convert.ToInt32(dr["c_n_dias_curso"])
                            : null,

                    c_n_dias_contrato =
                        dr["c_n_dias_contrato"] != DBNull.Value
                            ? Convert.ToInt32(dr["c_n_dias_contrato"])
                            : null,

                    c_t_ruc =
                        dr["c_t_ruc"]?.ToString(),

                    c_t_contrata =
                        dr["c_t_contrata"]?.ToString(),

                    c_t_equipo_alq =
                        dr["c_t_equipo_alq"]?.ToString()
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




        public async Task<ResponseRutaTransporteMovimientoAdm> GuardarRutaTransporteMovimiento(
            List<RutasTransporteMovimientoDto> lista
        )
        {
            ResponseRutaTransporteMovimientoAdm response = new();

            using SqlConnection cn =
                new SqlConnection(_connectionString);

            await cn.OpenAsync();

            SqlTransaction transaction =
                cn.BeginTransaction();

            try
            {
                foreach (var item in lista)
                {
                    using SqlCommand cmd = new SqlCommand(
                        "SP_INSERTAR_RUTA_TRANSPORTE_MOVIMIENTO",
                        cn,
                        transaction
                    );

                    cmd.CommandType =
                        CommandType.StoredProcedure;

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

                    // =========================================
                    // EJECUTAR
                    // =========================================

                    using SqlDataReader dr =
                        await cmd.ExecuteReaderAsync();

                    if (await dr.ReadAsync())
                    {
                        response.estado =
                            Convert.ToBoolean(
                                dr["estado"]
                            );

                        response.mensaje =
                            dr["mensaje"]
                                ?.ToString();
                    }

                    await dr.CloseAsync();

                    // =========================================
                    // ROLLBACK SI FALLA
                    // =========================================

                    if (!response.estado)
                    {
                        transaction.Rollback();

                        return response;
                    }
                }

                transaction.Commit();

                response.estado = true;

                response.mensaje =
                    "Datos guardados correctamente.";
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                response.estado = false;

                response.mensaje = ex.Message;
            }

            return response;
        }

        public async Task<int> ContarTarifarioAsync(string cod_contrato)
        {
            await using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(@"
                SELECT COALESCE(COUNT(cod_cargo), 0)
                FROM sval_det_tarifario_personal
                WHERE cod_empresa = @cod_empresa
                  AND cod_empresa_unidad = @cod_empresa_unidad
                  AND cod_contrato = @cod_contrato", conn);

            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
            cmd.Parameters.AddWithValue("@cod_contrato", cod_contrato);

            await conn.OpenAsync();
            return (int)await cmd.ExecuteScalarAsync();
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


        public async Task<GenericResponseDTO> EliminarContratoCascada(EliminarContratoDTO dto)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                // Lista secuencial y ordenada para respetar las restricciones de llave foránea (FK)
                // Se eliminan primero los detalles profundos y al final la cabecera principal
                string[] tablasEliminar = new string[]
                {
                    // -- TARIFARIOS --
                    "sval_det_tarifario_equipos_alquiler",
                    "sval_det_tarifario_transporte",
                    "sval_det_tarifario_personal",
                    "sval_det_tarifario_implementos",
                    "sval_det_tarifario_material_herramienta",
                    "sval_det_tarifario_material_voladura",

                    // -- PRECIOS UNITARIOS --
                    "sval_det_partida_costos_pu",
                    "sval_det_subpartidas_pu",
                    "sval_det_parametros_partida_pu",
                    "sval_det_partida_pu",

                    // -- PRE-VALORIZACIÓN SERVICIOS MINA --
                    "sval_det_servgen_transporte_diario",
                    "sval_det_servgen_diario",
                    "sval_det_servgen_semanal",
                    "sval_det_preval_produccion_zona",
                    "sval_cab_pre_valproduccion",
                    "sval_cab_preval_ccosto",
                    "sval_det_pre_valorizacion_sem",
                    "sval_det_pre_valorizacion",
                    "sval_cab_pre_valorizacion",

                    // -- PRE-VALORIZACIÓN DOCUMENTOS --
                    "sval_det_pre_valdoc",
                    "sval_cab_prevaldoc_ccosto",
                    "sval_cab_pre_valdoc",
                    "sval_cab_documentacion",

                    // -- DATOS DEL CONTRATO (Cabeceras finales) --
                    "sval_det_tarifario_equipos_pesados",
                    "sval_det_contrato_medicion",
                    //"sval_det_acuerdo_contrato",
                    "sval_det_contrato_parametro",
                    "sval_CAB_CONTRATO" // La cabecera padre se elimina al último
                };

                // Recorremos el array ejecutando los deletes uno por uno bajo la misma transacción
                foreach (var tabla in tablasEliminar)
                {
                    string query = $@"
                        DELETE FROM {tabla} 
                        WHERE COD_EMPRESA = @cod_empresa 
                          AND COD_EMPRESA_UNIDAD = @cod_empresa_unidad 
                          AND COD_CONTRATO = @cod_contrato";

                    using var cmd = new SqlCommand(query, connection, transaction);
                    cmd.CommandType = CommandType.Text;

                    cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);

                    await cmd.ExecuteNonQueryAsync();
                }

                // Confirmamos todos los DELETE en lote físico si no hubo errores previos
                await transaction.CommitAsync();

                return new GenericResponseDTO
                {
                    estado = 1,
                    mensaje = "Eliminación realizada satisfactoriamente de manera íntegra."
                };
            }
            catch (Exception ex)
            {
                // Si algo falla, limpiamos la cola de ejecución de SQL para que no afecte a las tablas
                if (transaction.Connection != null)
                {
                    await transaction.RollbackAsync();
                }

                return new GenericResponseDTO
                {
                    estado = 0,
                    mensaje = $"Error crítico al purgar las tablas del contrato: {ex.Message}"
                };
            }
        }

        public async Task<GenericResponseDTO> EstadoContrato(EstadoContratoDto dto)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            string query = @"
                UPDATE sval_cab_contrato
                SET ind_estado = @ind_estado,
                    cod_usuario_modi = @cod_usuario_modi,
                    fec_usuario_modi = GETDATE() -- Reemplaza ldt_fecha con la hora exacta del servidor BD
                WHERE cod_empresa = @cod_empresa 
                  AND cod_empresa_unidad = @cod_empresa_unidad 
                  AND cod_contrato = @cod_contrato;";

            try
            {
                using var cmd = new SqlCommand(query, connection);
                cmd.CommandType = CommandType.Text;

                cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);
                cmd.Parameters.AddWithValue("@ind_estado", dto.ind_estado);
                cmd.Parameters.AddWithValue("@cod_usuario_modi", dto.cod_usuario_modi);

                int filasAfectadas = await cmd.ExecuteNonQueryAsync();

                if (filasAfectadas == 0)
                {
                    return new GenericResponseDTO
                    {
                        estado = 0,
                        mensaje = "No se encontró el contrato especificado o no sufrió modificaciones."
                    };
                }

                return new GenericResponseDTO { estado = 1, mensaje = "Aprobado con éxito." };
            }
            catch (Exception ex)
            {
                return new GenericResponseDTO
                {
                    estado = 0,
                    mensaje = $"Error crítico de base de datos: {ex.Message}"
                };
            }
        }
    }
}
