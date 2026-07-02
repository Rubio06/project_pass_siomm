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
    public class ServicioTransporteService
    {

        private readonly string _connectionString;


        public ServicioTransporteService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }



        public async Task<ContratoDetalleResponseDto?> ObtenerServicioTransporte([FromQuery] ServicioTranporteRequestDto request)
        {
            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SP_LISTAR_SERVICIO_TRANSPORTE", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@cod_empresa", request.cod_empresa);
            command.Parameters.AddWithValue("@cod_empresa_unidad", request.cod_empresa_unidad);
            command.Parameters.AddWithValue("@cod_contrato", request.cod_contrato);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            ContratoDetalleResponseDto? resultado = null;

            // ✅ RESULT SET 1 - Cabecera
            if (await reader.ReadAsync())
            {
                resultado = new ContratoDetalleResponseDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    cod_contrato = reader["cod_contrato"]?.ToString(),
                    cod_contrata = reader["cod_contrata"]?.ToString(),
                    fec_registro = reader["fec_registro"] as DateTime?,
                    fec_inicio = reader["fec_inicio"] as DateTime?,
                    fec_termino = reader["fec_termino"] as DateTime?,
                    des_contacto_contrata = reader["des_contacto_contrata"]?.ToString(),
                    imp_tipo_cambio = reader["imp_tipo_cambio"] as decimal?,
                    nro_adendum = reader["nro_adendum"]?.ToString(),
                    des_observacion = reader["des_observacion"]?.ToString(),
                    ind_situacion = reader["ind_situacion"]?.ToString(),
                    ind_estado = reader["ind_estado"]?.ToString(),
                    flg_vigente = reader["flg_vigente"] as int?,
                    fec_firma = reader["fec_firma"] as DateTime?,
                    ind_tipo_contrato = reader["ind_tipo_contrato"]?.ToString(),
                    cod_usuario_creo = reader["cod_usuario_creo"]?.ToString(),
                    fec_usuario_creo = reader["fec_usuario_creo"] as DateTime?,
                    cod_usuario_modi = reader["cod_usuario_modi"]?.ToString(),
                    fec_usuario_modi = reader["fec_usuario_modi"] as DateTime?,
                    ind_moneda = reader["ind_moneda"]?.ToString(),
                    ind_tipocambio = reader["ind_tipocambio"]?.ToString(),
                    ind_valorizacion = reader["ind_valorizacion"]?.ToString(),
                    c_t_ruc = reader["c_t_ruc"]?.ToString(),
                    c_t_representante = reader["c_t_representante"]?.ToString(),
                };
            }

            if (resultado == null) return null;

            // ✅ RESULT SET 2 - Parámetros
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                resultado.parametros.Add(new ContratoParametroDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    cod_contrato = reader["cod_contrato"]?.ToString(),
                    cod_parametro_contrato = reader["cod_parametro_contrato"]?.ToString(),
                    cod_moneda = reader["cod_moneda"]?.ToString(),
                    imp_porcentaje = reader["imp_porcentaje"] as decimal?,
                    imp_monto = reader["imp_monto"] as decimal?,
                    des_observacion = reader["des_observacion"]?.ToString(),
                    flg_vigente = reader["flg_vigente"]?.ToString(),
                    cod_usuario_creo = reader["cod_usuario_creo"]?.ToString(),
                    fec_usuario_creo = reader["fec_usuario_creo"] as DateTime?,
                    cod_usuario_modi = reader["cod_usuario_modi"]?.ToString(),
                    fec_usuario_modi = reader["fec_usuario_modi"] as DateTime?,
                    c_t_anexo = reader["c_t_anexo"]?.ToString(),
                    cod_valor = reader["cod_valor"]?.ToString(),
                    cod_tabla_anexo = reader["cod_tabla_anexo"]?.ToString(),
                    cod_item_anexo = reader["cod_item_anexo"]?.ToString(),
                });
            }

            // ✅ RESULT SET 3 - Mediciones
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                resultado.mediciones.Add(new ContratoMedicionDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    cod_contrato = reader["cod_contrato"]?.ToString(),
                    cod_parametro_medicion = reader["cod_parametro_medicion"]?.ToString(),
                    cod_tabla_um_pv = reader["cod_tabla_um_pv"]?.ToString(),
                    cod_item_um_pv = reader["cod_item_um_pv"]?.ToString(),
                    cod_tabla_um_ap = reader["cod_tabla_um_ap"]?.ToString(),
                    cod_item_um_ap = reader["cod_item_um_ap"]?.ToString(),
                    nro_potencia_veta_1 = reader["nro_potencia_veta_1"] as decimal?,
                    nro_potencia_veta_2 = reader["nro_potencia_veta_2"] as decimal?,
                    nro_ancho_pago_1 = reader["nro_ancho_pago_1"] as decimal?,
                    cod_valor_ap = reader["cod_valor_ap"]?.ToString(),
                    cod_valor_pv = reader["cod_valor_pv"]?.ToString(),
                    cod_usuario_creo = reader["cod_usuario_creo"]?.ToString(),
                    fec_usuario_creo = reader["fec_usuario_creo"] as DateTime?,
                    cod_usuario_modi = reader["cod_usuario_modi"]?.ToString(),
                    fec_usuario_modi = reader["fec_usuario_modi"] as DateTime?,
                    c_t_pv = reader["c_t_pv"]?.ToString(),
                    c_t_ap = reader["c_t_ap"]?.ToString(),
                });
            }

            if (await reader.NextResultAsync())
            {
                while (await reader.ReadAsync())
                {
                    resultado.equipos.Add(new ContratoEquipoPesadoDto
                    {
                        cod_empresa = reader["cod_empresa"] != DBNull.Value ? reader["cod_empresa"].ToString() : null,
                        cod_empresa_unidad = reader["cod_empresa_unidad"] != DBNull.Value ? reader["cod_empresa_unidad"].ToString() : null,
                        cod_contrato = reader["cod_contrato"] != DBNull.Value ? reader["cod_contrato"].ToString() : null,
                        cod_equipo_pesado = reader["cod_equipo_pesado"] != DBNull.Value ? reader["cod_equipo_pesado"].ToString() : null,
                        ind_moneda = reader["ind_moneda"] != DBNull.Value ? reader["ind_moneda"].ToString() : null,
                        ind_tarifa = reader["ind_tarifa"] != DBNull.Value ? reader["ind_tarifa"].ToString() : null,
                        imp_alquiler_equipo = reader["imp_alquiler_equipo"] != DBNull.Value ? Convert.ToDecimal(reader["imp_alquiler_equipo"]) : null,
                        flg_vigencia = reader["flg_vigencia"] != DBNull.Value ? reader["flg_vigencia"].ToString() : null,
                        cod_usuario_creo = reader["cod_usuario_creo"] != DBNull.Value ? reader["cod_usuario_creo"].ToString() : null,
                        fec_usuario_creo = reader["fec_usuario_creo"] != DBNull.Value ? Convert.ToDateTime(reader["fec_usuario_creo"]) : null,
                        cod_usuario_modi = reader["cod_usuario_modi"] != DBNull.Value ? reader["cod_usuario_modi"].ToString() : null,
                        fec_usuario_modi = reader["fec_usuario_modi"] != DBNull.Value ? Convert.ToDateTime(reader["fec_usuario_modi"]) : null
                    });
                }
            }

            return resultado;
        }

        // 1. Cambiar a "async Task<List<...>>"
        public async Task<List<MaeContrataAdmDto>> ListarContratasActivas()
        {
            var listaContratas = new List<MaeContrataAdmDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_LISTAR_CONTRATA_ADM", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // 2. Usar OpenAsync con await
                    await cn.OpenAsync();

                    // 3. Usar ExecuteReaderAsync con await
                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        // 4. Usar ReadAsync con await
                        while (await dr.ReadAsync())
                        {
                            var contrata = new MaeContrataAdmDto
                            {
                                cod_empresa = dr["cod_empresa"].ToString(),
                                cod_contrata = dr["cod_contrata"].ToString(),
                                des_contrata = dr["des_contrata"].ToString(),
                                ruc_contrata = dr["ruc_contrata"].ToString(),
                                nro_telefono = dr["nro_telefono"] != DBNull.Value ? dr["nro_telefono"].ToString() : null,
                                nro_fax = dr["nro_fax"] != DBNull.Value ? dr["nro_fax"].ToString() : null,
                                rep_nombre = dr["rep_nombre"] != DBNull.Value ? dr["rep_nombre"].ToString() : null,

                                // Controlamos nulos para las fechas de manera segura
                                fec_ingreso = dr["fec_ingreso"] != DBNull.Value ? Convert.ToDateTime(dr["fec_ingreso"]) : null,
                                fec_cese = dr["fec_cese"] != DBNull.Value ? Convert.ToDateTime(dr["fec_cese"]) : null,

                                eml_correo = dr["eml_correo"] != DBNull.Value ? dr["eml_correo"].ToString() : null,
                                ind_tipo_contrata = dr["ind_tipo_contrata"] != DBNull.Value ? dr["ind_tipo_contrata"].ToString() : null,
                                est_contrata = dr["est_contrata"].ToString()
                            };
                            listaContratas.Add(contrata);
                        }
                    }
                }
            }
            return listaContratas;
        }

        public async Task<List<EquipoContrataDto>> GetEquiposContrataAsync(EquiposContrataRequestDto request)
        {
            var lista = new List<EquipoContrataDto>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SP_LISTAR_EQUIPOS_CONTRATA", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@cod_empresa", request.cod_empresa);
            command.Parameters.AddWithValue("@cod_empresa_unidad", request.cod_empresa_unidad);
            command.Parameters.AddWithValue("@cod_contrata", request.cod_contrata);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(new EquipoContrataDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_contrata = reader["cod_contrata"]?.ToString(),
                    cod_equipo = reader["cod_equipo"]?.ToString(),
                    cod_equipo_tabla = reader["cod_equipo_tabla"]?.ToString(),
                    des_equipo_contrata = reader["des_equipo_contrata"]?.ToString(),
                    des_marca = reader["des_marca"]?.ToString(),
                    cod_tabla_marca = reader["cod_tabla_marca"]?.ToString(),
                    cod_item_marca = reader["cod_item_marca"]?.ToString(),
                    des_placa = reader["des_placa"]?.ToString(),
                    des_cod_equipo = reader["des_cod_equipo"]?.ToString(),
                    nro_capacidad_tm = reader["nro_capacidad_tm"] as decimal?,
                    nro_tara_tm = reader["nro_tara_tm"] as decimal?,
                    des_ano_fabrica = reader["des_ano_fabrica"]?.ToString(),
                    flg_vigente = reader["flg_vigente"]?.ToString(),
                });
            }

            return lista;
        }


        /// LISTAS PARAMETROS
        public async Task<List<ParametroContratoDto>> ObtenerParametrosContrato()
        {
            var lista = new List<ParametroContratoDto>();

            using SqlConnection cn = new SqlConnection(_connectionString);

            string sql = @"
                SELECT
                    cod_parametro_contrato,
                    des_parametro_contrato,
                    nro_orden,
                    cod_operador,
                    cod_valor,
                    des_observacion,
                    flg_vigente,
                    cod_anexo,
                    ind_obligatorio
                FROM sval_mae_parametros_contrato
                WHERE cod_empresa = '03'
                  AND cod_empresa_unidad = '01'";

            using SqlCommand cmd = new SqlCommand(sql, cn);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new ParametroContratoDto
                {
                    cod_parametro_contrato = dr["cod_parametro_contrato"].ToString() ?? "",
                    des_parametro_contrato = dr["des_parametro_contrato"].ToString() ?? "",
                    nro_orden = dr["nro_orden"] == DBNull.Value
                        ? null
                        : Convert.ToInt32(dr["nro_orden"]),
                    cod_operador = dr["cod_operador"]?.ToString(),
                    cod_valor = dr["cod_valor"]?.ToString(),
                    des_observacion = dr["des_observacion"]?.ToString(),
                    flg_vigente = dr["flg_vigente"]?.ToString(),
                    cod_anexo = dr["cod_anexo"]?.ToString(),
                    ind_obligatorio = dr["ind_obligatorio"]?.ToString()
                });
            }

            return lista;
        }

        public async Task<List<TablaDetalleDto>> ObtenerTablaDetalle(string cod_tabla)
        {
            var lista = new List<TablaDetalleDto>();

            using SqlConnection cn = new SqlConnection(_connectionString);

            string sql = @"
                SELECT
                    cod_tabla,
                    cod_item,
                    des_tabladet,
                    flg_vigencia,
                    des_tabladet_abrev
                FROM sval_mae_tabla_detalle
                WHERE cod_empresa = @cod_empresa
                  AND cod_empresa_unidad = @cod_empresa_unidad
                  AND cod_tabla = @cod_tabla";

            using SqlCommand cmd = new SqlCommand(sql, cn);

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@cod_tabla", SqlDbType.VarChar, 20).Value = cod_tabla;

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new TablaDetalleDto
                {
                    cod_tabla = dr["cod_tabla"].ToString() ?? "",
                    cod_item = dr["cod_item"].ToString() ?? "",
                    des_tabladet = dr["des_tabladet"].ToString() ?? "",
                    flg_vigencia = dr["flg_vigencia"]?.ToString(),
                    des_tabladet_abrev = dr["des_tabladet_abrev"]?.ToString()
                });
            }

            return lista;
        }

        public async Task<List<ParametroMedicionDto>> ObtenerParametroMedicion()
        {
            var lista = new List<ParametroMedicionDto>();

            using SqlConnection cn = new SqlConnection(_connectionString);

            string sql = @"

                SELECT cod_parametro_medicion,
                       des_potencia_veta,
                      des_ancho_pago,
                   cod_valor_pv,
                     cod_valor_ap,
                    flg_vigente,
                    ind_obligatorio
                FROM sval_mae_parametro_mediciones
                WHERE cod_empresa = @cod_empresa
                AND cod_empresa_unidad = @cod_empresa_unidad
              AND flg_vigente = '1'; ";

            using SqlCommand cmd = new SqlCommand(sql, cn);

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new ParametroMedicionDto
                {
                    cod_parametro_medicion = dr["cod_parametro_medicion"].ToString() ?? "",
                    des_potencia_veta = dr["des_potencia_veta"].ToString() ?? "",
                    des_ancho_pago = dr["des_ancho_pago"].ToString() ?? "",
                    cod_valor_pv = dr["cod_valor_pv"]?.ToString(),
                    cod_valor_ap = dr["cod_valor_ap"]?.ToString(),
                    flg_vigente = dr["flg_vigente"]?.ToString(),
                    ind_obligatorio = dr["ind_obligatorio"]?.ToString(),
                });
            }

            return lista;
        }

        public async Task<List<GastosGeneralesDTO>> ObtenerGastosGenerales(string cod_empresa, string cod_empresa_unidad, string cod_contrato)
        {
            var lista = new List<GastosGeneralesDTO>();

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("SP_OBTENER_GASTOS_GENERALES", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Mapeo de parámetros del SP
                    command.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                    command.Parameters.AddWithValue("@cod_empresa_unidad", cod_empresa_unidad);
                    command.Parameters.AddWithValue("@cod_contrato", cod_contrato);

                    // CAMBIO: Conexión asíncrona
                    await connection.OpenAsync();

                    // CAMBIO: Ejecución asíncrona del Store Procedure
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        // CAMBIO: Lectura asíncrona fila por fila
                        while (await reader.ReadAsync())
                        {
                            var dto = new GastosGeneralesDTO
                            {
                                cod_empresa = reader["cod_empresa"]?.ToString() ?? "",
                                cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString() ?? "",
                                cod_contrato = reader["cod_contrato"]?.ToString() ?? "",
                                cod_costo_fijo = reader["cod_costo_fijo"]?.ToString() ?? "",
                                cod_item_det = reader["cod_item_det"]?.ToString() ?? "",
                                imp_costo_fijo = reader["imp_costo_fijo"] != DBNull.Value ? Convert.ToDecimal(reader["imp_costo_fijo"]) : 0,
                                flg_vigente = reader["flg_vigente"]?.ToString() ?? "",
                                cnt_prog_mes = reader["cnt_prog_mes"] != DBNull.Value ? Convert.ToDecimal(reader["cnt_prog_mes"]) : 0,
                                imp_prog_mes = reader["imp_prog_mes"] != DBNull.Value ? Convert.ToDecimal(reader["imp_prog_mes"]) : 0,
                                cod_usuario_creo = reader["cod_usuario_creo"]?.ToString() ?? "",
                                fec_usuario_creo = reader["fec_usuario_creo"] == DBNull.Value ? null : Convert.ToDateTime(reader["fec_usuario_creo"]),
                                cod_usuario_modi = reader["cod_usuario_modi"]?.ToString() ?? "",
                                fec_usuario_modi = reader["fec_usuario_modi"] == DBNull.Value ? null : Convert.ToDateTime(reader["fec_usuario_modi"]),
                                ind_moneda = reader["ind_moneda"]?.ToString() ?? "",
                                c_t_gastos = reader["c_t_gastos"]?.ToString() ?? "",
                                c_t_gastos_det = reader["c_t_gastos_det"]?.ToString() ?? ""
                            };

                            lista.Add(dto);
                        }
                    }
                }
            }

            return lista;
        }

        // 2. Tu método base estaba perfecto, solo le agregamos el sufijo Async al nombre por estándar de C#
        public async Task<List<CostosFijosMaeDto>> ObtenerCostosFijos()
        {
            var lista = new List<CostosFijosMaeDto>();

            using SqlConnection cn = new SqlConnection(_connectionString);

            string sql = @"select * from sval_mae_costos_fijos where flg_vigente = 1";

            using SqlCommand cmd = new SqlCommand(sql, cn);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new CostosFijosMaeDto
                {
                    // --- CAMPOS MAESTROS ---
                    cod_empresa = dr["cod_empresa"]?.ToString() ?? "",
                    cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString() ?? "",
                    cod_costo_fijo = dr["cod_costo_fijo"]?.ToString() ?? "",
                    des_costo_fijo = dr["des_costo_fijo"]?.ToString() ?? "",
                    ind_calculo = dr["ind_calculo"]?.ToString() ?? "",
                    des_tabla = dr["des_tabla"]?.ToString() ?? "",
                    flg_vigente = dr["flg_vigente"]?.ToString() ?? "",

                    // --- CAMPOS DE AUDITORÍA ---
                    cod_usuario_creo = dr["cod_usuario_creo"]?.ToString() ?? "",
                    fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_creo"]) : null,
                    cod_usuario_modi = dr["cod_usuario_modi"]?.ToString() ?? "",
                    fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_modi"]) : null
                });
            }

            return lista;
        }


        public async Task<List<CostosFijosDetalleDto>> ObtenerCostosFijosDetalle(string cod_empresa, string cod_empresa_unidad, string cod_costo_fijo)
        {
            var lista = new List<CostosFijosDetalleDto>();

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("SP_OBTENER_COSTOS_FIJOS", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // 1. Mapeo e Inyección Segura de Parámetros
                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = cod_empresa ?? (object)DBNull.Value;
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = cod_empresa_unidad ?? (object)DBNull.Value;
                    command.Parameters.Add("@cod_costo_fijo", SqlDbType.VarChar, 3).Value = cod_costo_fijo ?? (object)DBNull.Value;

                    // 2. Apertura Asíncrona de la Conexión
                    await connection.OpenAsync();

                    // 3. Ejecución y Lectura Eficiente con SqlDataReader
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var dto = new CostosFijosDetalleDto
                            {
                                // Campos nativos de la tabla de detalles
                                cod_empresa = reader["cod_empresa"]?.ToString() ?? "",
                                cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString() ?? "",
                                cod_costo_fijo = reader["cod_costo_fijo"]?.ToString() ?? "",
                                cod_item_det = reader["cod_item_det"]?.ToString() ?? "",
                                des_detalle_costo = reader["des_detalle_costo"]?.ToString() ?? "",
                                cod_cargo = reader["cod_cargo"]?.ToString() ?? "",
                                flg_vigente = reader["flg_vigente"]?.ToString() ?? "",

                                // Campos calculados / traídos por los JOINs del SP
                                c_t_gastos = reader["c_t_gastos"]?.ToString() ?? "",
                                c_t_gastos_det = reader["c_t_gastos_det"]?.ToString() ?? "",
                                c_fl = reader["c_fl"]?.ToString() ?? "N"
                            };

                            lista.Add(dto);
                        }
                    }
                }
            }

            return lista;
        }

        //public async Task<GastosGeneralesRequestDTO> InsertarGastosGenerales(List<GastosGeneralesDTO> filas)
        //{
        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();
        //    using var transaction = connection.BeginTransaction();

        //    try
        //    {
        //        // Eliminar registros existentes del contrato
        //        if (filas.Any())
        //        {
        //            var primeraFila = filas.First();

        //            using var cmdDelete = new SqlCommand(@"
        //                DELETE FROM sval_cab_gastos_generales
        //                WHERE cod_empresa = @cod_empresa
        //                  AND cod_empresa_unidad = @cod_empresa_unidad
        //                  AND cod_contrato = @cod_contrato",
        //                connection,
        //                transaction);

        //            cmdDelete.Parameters.AddWithValue("@cod_empresa", primeraFila.cod_empresa);
        //            cmdDelete.Parameters.AddWithValue("@cod_empresa_unidad", primeraFila.cod_empresa_unidad);
        //            cmdDelete.Parameters.AddWithValue("@cod_contrato", primeraFila.cod_contrato);

        //            await cmdDelete.ExecuteNonQueryAsync();
        //        }

        //        // Insertar todas las filas nuevas
        //        foreach (var fila in filas)
        //        {
        //            using var cmd = new SqlCommand("SP_INSERTAR_GASTOS_GENERALES", connection, transaction);
        //            cmd.CommandType = CommandType.StoredProcedure;

        //            cmd.Parameters.AddWithValue("@cod_empresa", fila.cod_empresa);
        //            cmd.Parameters.AddWithValue("@cod_empresa_unidad", fila.cod_empresa_unidad);
        //            cmd.Parameters.AddWithValue("@cod_contrato", fila.cod_contrato);
        //            cmd.Parameters.AddWithValue("@cod_costo_fijo", fila.cod_costo_fijo);
        //            cmd.Parameters.AddWithValue("@cod_item_det", fila.cod_item_det);
        //            cmd.Parameters.AddWithValue("@ind_moneda", fila.ind_moneda);
        //            cmd.Parameters.AddWithValue("@imp_costo_fijo", fila.imp_costo_fijo);
        //            cmd.Parameters.AddWithValue("@cnt_prog_mes", fila.cnt_prog_mes);
        //            cmd.Parameters.AddWithValue("@imp_prog_mes", fila.imp_prog_mes);
        //            cmd.Parameters.AddWithValue("@flg_vigente", fila.flg_vigente);
        //            cmd.Parameters.AddWithValue("@cod_usuario_creo", fila.cod_usuario_creo);

        //            var pEstado = cmd.Parameters.Add("@estado", SqlDbType.Int);
        //            pEstado.Direction = ParameterDirection.Output;

        //            var pMensaje = cmd.Parameters.Add("@mensaje", SqlDbType.NVarChar, 200);
        //            pMensaje.Direction = ParameterDirection.Output;

        //            await cmd.ExecuteNonQueryAsync();

        //            if ((int)pEstado.Value == 0)
        //            {
        //                await transaction.RollbackAsync();

        //                return new GastosGeneralesRequestDTO
        //                {
        //                    estado = 0,
        //                    mensaje = pMensaje.Value.ToString()!
        //                };
        //            }
        //        }

        //        await transaction.CommitAsync();

        //        return new GastosGeneralesRequestDTO
        //        {
        //            estado = 1,
        //            mensaje = "Registros guardados correctamente."
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        await transaction.RollbackAsync();

        //        return new GastosGeneralesRequestDTO
        //        {
        //            estado = 0,
        //            mensaje = $"Error inesperado: {ex.Message}"
        //        };
        //    }
        //}

        public async Task<GastosGeneralesRequestDTO> InsertarGastosGenerales(List<GastosGeneralesDTO> filas)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                foreach (var fila in filas)
                {
                    using var cmd = new SqlCommand("SP_INSERTAR_GASTOS_GENERALES", connection, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // 1. Parámetros de entrada comunes
                    cmd.Parameters.AddWithValue("@cod_empresa", fila.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", fila.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_contrato", fila.cod_contrato);
                    cmd.Parameters.AddWithValue("@cod_costo_fijo", fila.cod_costo_fijo);
                    cmd.Parameters.AddWithValue("@cod_item_det", fila.cod_item_det ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@ind_moneda", fila.ind_moneda);
                    cmd.Parameters.AddWithValue("@imp_costo_fijo", fila.imp_costo_fijo);
                    cmd.Parameters.AddWithValue("@cnt_prog_mes", fila.cnt_prog_mes);
                    cmd.Parameters.AddWithValue("@imp_prog_mes", fila.imp_prog_mes);
                    cmd.Parameters.AddWithValue("@flg_vigente", fila.flg_vigente);

                    // Enviamos el usuario al parámetro genérico @cod_usuario
                    cmd.Parameters.AddWithValue("@cod_usuario", fila.cod_usuario_creo);

                    // 2. PARÁMETRO COMODÍN CLAVE: Controla si el SP hace INSERT, UPDATE o DELETE
                    cmd.Parameters.AddWithValue("@accion", fila.accion); // 'I', 'U', o 'D'

                    // 3. Parámetros OUTPUT del SP
                    var pEstado = cmd.Parameters.Add("@estado", SqlDbType.Int);
                    pEstado.Direction = ParameterDirection.Output;

                    var pMensaje = cmd.Parameters.Add("@mensaje", SqlDbType.NVarChar, 200);
                    pMensaje.Direction = ParameterDirection.Output;

                    // Ejecutamos la fila actual
                    await cmd.ExecuteNonQueryAsync();

                    // 4. Validación del estado devuelto por el SP
                    if (pEstado.Value == DBNull.Value || (int)pEstado.Value == 0)
                    {
                        // Si falla una sola fila, hacemos Rollback completo para no dejar la data inconsistente
                        await transaction.RollbackAsync();

                        return new GastosGeneralesRequestDTO
                        {
                            estado = 0,
                            mensaje = pMensaje.Value?.ToString() ?? "Error desconocido en el procedimiento."
                        };
                    }
                }

                // Si todas las filas se procesaron con éxito en el SP, confirmamos los cambios
                await transaction.CommitAsync();

                return new GastosGeneralesRequestDTO
                {
                    estado = 1,
                    mensaje = "Todos los cambios fueron guardados y auditados correctamente."
                };
            }
            catch (Exception ex)
            {
                // Ante cualquier error de conexión o de red, revertimos
                await transaction.RollbackAsync();

                return new GastosGeneralesRequestDTO
                {
                    estado = 0,
                    mensaje = $"Error crítico en el repositorio: {ex.Message}"
                };
            }
        }

        public RespuestCostoFijoDto EliminarCostoFijoDetalle([FromQuery] EntradaCostoFijoDto request)
        {
            string query = @"DELETE FROM sval_cab_gastos_generales 
                     WHERE cod_empresa = @cod_empresa 
                       AND cod_empresa_unidad = @cod_empresa_unidad 
                       AND cod_contrato = @cod_contrato 
                       AND cod_costo_fijo = @cod_costo_fijo 
                       AND cod_item_det = @cod_item_det;";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = request.cod_empresa;
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = request.cod_empresa_unidad;
                    command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = request.cod_contrato;
                    command.Parameters.Add("@cod_costo_fijo", SqlDbType.VarChar, 3).Value = request.cod_costo_fijo;
                    command.Parameters.Add("@cod_item_det", SqlDbType.VarChar, 3).Value = request.cod_item_det;

                    try
                    {
                        connection.Open();
                        int filasAfectadas = command.ExecuteNonQuery();

                        if (filasAfectadas == 1)
                        {
                            return new RespuestCostoFijoDto
                            {
                                estado = 1,
                                mensaje = "El registro del costo fijo se eliminó correctamente."
                            };
                        }
                        else
                        {
                            // No se borró nada porque los códigos no coincidieron o ya no existía
                            return new RespuestCostoFijoDto
                            {
                                estado = 0,
                                mensaje = "No se encontró el registro específico para eliminar. Verifique los datos."
                            };
                        }
                    }
                    catch (SqlException ex)
                    {
                        // Error a nivel de base de datos (llaves foráneas, pérdida de conexión, etc.)
                        return new RespuestCostoFijoDto
                        {
                            estado = -1,
                            mensaje = $"Error interno en la base de datos: {ex.Message}"
                        };
                    }
                }
            }
        }

        public async Task<RespuestaDto> EliminarTarifarioEquipoPesadoAsync(EntradaTarifarioDto entrada)
        {
            await using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_ELIMINAR_DET_TARIFARIO_EQUIPOS_PESADOS", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@cod_empresa", entrada.cod_empresa);
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", entrada.cod_empresa_unidad);
            cmd.Parameters.AddWithValue("@cod_contrato", entrada.cod_contrato);
            cmd.Parameters.AddWithValue("@cod_equipo_pesado", entrada.cod_equipo_pesado);

            await conn.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new RespuestaDto
                {
                    estado = reader.GetInt32(reader.GetOrdinal("estado")),
                    mensaje = reader.GetString(reader.GetOrdinal("mensaje"))
                };
            }

            return new RespuestaDto { estado = 0, mensaje = "Sin respuesta del servidor." };
        }


        public async Task<RespuestaDto> EliminarParametroContratoAsync(EliminarParametroContratoDto dto)
        {
            await using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_ELIMINAR_PARAMETRO_CONTRATO", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
            cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);

            cmd.Parameters.AddWithValue("@cod_parametro_contrato", dto.cod_parametro_contrato);

            await conn.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new RespuestaDto
                {
                    estado = reader.GetInt32(reader.GetOrdinal("estado")),
                    mensaje = reader.GetString(reader.GetOrdinal("mensaje"))
                };
            }

            return new RespuestaDto { estado = 0, mensaje = "Sin respuesta del servidor." };
        }

        public async Task<RespuestaDto> EliminarDetContratoMedicionAsync(EliminarDetContratoMedicionDto dto)
        {
            await using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_ELIMINAR_DET_CONTRATO_MEDICION", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
            cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);
            cmd.Parameters.AddWithValue("@cod_parametro_medicion", dto.cod_parametro_medicion);

            await conn.OpenAsync();
            await using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new RespuestaDto
                {
                    estado = reader.GetInt32(reader.GetOrdinal("estado")),
                    mensaje = reader.GetString(reader.GetOrdinal("mensaje"))
                };
            }

            return new RespuestaDto { estado = 0, mensaje = "Sin respuesta del servidor." };
        }



        public async Task<bool> GuardarContratoCompletoAsync(ContratoDTO dto)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlTransaction tx = cn.BeginTransaction())
                {
                    try
                    {

                        using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_CONTRATO_CABECERA", cn, tx))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add("@accion", SqlDbType.VarChar, 1).Value =
                                (object?)dto.accion ?? DBNull.Value;
                            cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@cod_contrata", dto.cod_contrata ?? (object)DBNull.Value);

                            cmd.Parameters.AddWithValue("@cod_usuario_creo", dto.cod_usuario_creo ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@cod_usuario_modi", dto.cod_usuario_modi ?? (object)DBNull.Value);

                            cmd.Parameters.AddWithValue("@des_contacto_contrata", dto.des_contacto_contrata ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@des_observacion", dto.des_observacion ?? (object)DBNull.Value);

                            cmd.Parameters.Add("@fec_firma", SqlDbType.DateTime).Value =
                                string.IsNullOrEmpty(dto.fec_firma) ? (object)DBNull.Value : Convert.ToDateTime(dto.fec_firma);

                            cmd.Parameters.Add("@fec_inicio", SqlDbType.DateTime).Value =
                                string.IsNullOrEmpty(dto.fec_inicio) ? (object)DBNull.Value : Convert.ToDateTime(dto.fec_inicio);

                            cmd.Parameters.Add("@fec_registro", SqlDbType.DateTime).Value =
                                string.IsNullOrEmpty(dto.fec_registro) ? (object)DBNull.Value : Convert.ToDateTime(dto.fec_registro);

                            cmd.Parameters.Add("@fec_termino", SqlDbType.DateTime).Value =
                                string.IsNullOrEmpty(dto.fec_termino) ? (object)DBNull.Value : Convert.ToDateTime(dto.fec_termino);


                            cmd.Parameters.AddWithValue("@flg_vigente", dto.flg_vigente ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@ind_estado", dto.ind_estado ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@ind_moneda", dto.ind_moneda ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@ind_situacion", dto.ind_situacion ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@ind_tipo_contrato", dto.ind_tipo_contrato ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@ind_tipocambio", dto.ind_tipocambio ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@ind_valorizacion", dto.ind_valorizacion ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@nro_adendum", dto.nro_adendum ?? (object)DBNull.Value);

                            cmd.Parameters.Add("@imp_tipo_cambio", SqlDbType.Decimal).Value =
                                string.IsNullOrEmpty(dto.imp_tipo_cambio) ? (object)DBNull.Value : Convert.ToDecimal(dto.imp_tipo_cambio);

                            // Ejecución Asíncrona
                            await cmd.ExecuteNonQueryAsync();
                        }


                        if (dto.parametros != null)
                        {
                            foreach (var param in dto.parametros)
                            {
                                using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_CONTRATO_PARAMETRO", cn, tx))
                                {
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.Add("@accion", SqlDbType.VarChar, 1).Value =
                                        (object?)param.accion ?? DBNull.Value;

                                    // VARCHAR(2)
                                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value =
                                        (object?)dto.cod_empresa ?? DBNull.Value;

                                    // VARCHAR(2)
                                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value =
                                        (object?)dto.cod_empresa_unidad ?? DBNull.Value;

                                    // VARCHAR(8)
                                    cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 8).Value =
                                        (object?)dto.cod_contrato ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_parametro_contrato", SqlDbType.VarChar, 3).Value =
                                        (object?)param.cod_parametro_contrato ?? DBNull.Value;

                                    // VARCHAR(1)
                                    cmd.Parameters.Add("@cod_moneda", SqlDbType.VarChar, 1).Value =
                                        (object?)param.cod_moneda ?? DBNull.Value;

                                    // DECIMAL
                                    var pPorcentaje = cmd.Parameters.Add("@imp_porcentaje", SqlDbType.Decimal);
                                    pPorcentaje.Precision = 18;
                                    pPorcentaje.Scale = 2;
                                    pPorcentaje.Value = (object?)param.imp_porcentaje ?? DBNull.Value;

                                    // DECIMAL
                                    var pMonto = cmd.Parameters.Add("@imp_monto", SqlDbType.Decimal);
                                    pMonto.Precision = 18;
                                    pMonto.Scale = 2;
                                    pMonto.Value = (object?)param.imp_monto ?? DBNull.Value;

                                    // VARCHAR(255)
                                    cmd.Parameters.Add("@des_observacion", SqlDbType.VarChar, 255).Value =
                                        (object?)param.des_observacion ?? DBNull.Value;

                                    // VARCHAR(1)
                                    cmd.Parameters.Add("@flg_vigente", SqlDbType.VarChar, 1).Value =
                                        (object?)param.flg_vigente ?? DBNull.Value;

                                    // Si c_t_anexo existe en el SP, coloca el tamaño correcto.
                                    // Aquí asumí VARCHAR(255), cámbialo si en el SP es diferente.
                                    cmd.Parameters.Add("@c_t_anexo", SqlDbType.VarChar, 255).Value =
                                        (object?)param.c_t_anexo ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_tabla_anexo", SqlDbType.VarChar, 3).Value =
                                        (object?)param.cod_tabla_anexo ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_item_anexo", SqlDbType.VarChar, 3).Value =
                                        (object?)param.cod_item_anexo ?? DBNull.Value;

                                    cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 30).Value =
                                        (object?)param.cod_usuario_creo ?? DBNull.Value;

                                    cmd.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 30).Value =
                                        (object?)param.cod_usuario_modi ?? DBNull.Value;

                                    // Ejecución Asíncrona
                                    await cmd.ExecuteNonQueryAsync();
                                }
                            }
                        }


                        if (dto.mediciones != null)
                        {
                            foreach (var med in dto.mediciones)
                            {
                                using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_CONTRATO_MEDICION", cn, tx))
                                {
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    // Si el SP tiene @accion, usa el tamaño que corresponda (aquí asumo VARCHAR(1))
                                    cmd.Parameters.Add("@accion", SqlDbType.VarChar, 1).Value =
                                        (object?)med.accion ?? DBNull.Value;

                                    // VARCHAR(2)
                                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value =
                                        (object?)dto.cod_empresa ?? DBNull.Value;

                                    // VARCHAR(2)
                                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value =
                                        (object?)dto.cod_empresa_unidad ?? DBNull.Value;

                                    // VARCHAR(8)
                                    cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 8).Value =
                                        (object?)dto.cod_contrato ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_parametro_medicion", SqlDbType.VarChar, 3).Value =
                                        (object?)med.cod_parametro_medicion ?? DBNull.Value;

                                    // DECIMAL
                                    var pPotenciaVeta1 = cmd.Parameters.Add("@nro_potencia_veta_1", SqlDbType.Decimal);
                                    pPotenciaVeta1.Precision = 18;
                                    pPotenciaVeta1.Scale = 2;
                                    pPotenciaVeta1.Value = (object?)med.nro_potencia_veta_1 ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_item_um_pv", SqlDbType.VarChar, 3).Value =
                                        (object?)med.cod_item_um_pv ?? DBNull.Value;

                                    // DECIMAL
                                    var pPotenciaVeta2 = cmd.Parameters.Add("@nro_potencia_veta_2", SqlDbType.Decimal);
                                    pPotenciaVeta2.Precision = 18;
                                    pPotenciaVeta2.Scale = 2;
                                    pPotenciaVeta2.Value = (object?)med.nro_potencia_veta_2 ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_item_um_ap", SqlDbType.VarChar, 3).Value =
                                        (object?)med.cod_item_um_ap ?? DBNull.Value;

                                    // DECIMAL
                                    var pAnchoPago1 = cmd.Parameters.Add("@nro_ancho_pago_1", SqlDbType.Decimal);
                                    pAnchoPago1.Precision = 18;
                                    pAnchoPago1.Scale = 2;
                                    pAnchoPago1.Value = (object?)med.nro_ancho_pago_1 ?? DBNull.Value;

                                    // VARCHAR(1)
                                    cmd.Parameters.Add("@cod_valor_ap", SqlDbType.VarChar, 1).Value =
                                        (object?)med.cod_valor_ap ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_tabla_um_pv", SqlDbType.VarChar, 3).Value =
                                        (object?)med.cod_tabla_um_pv ?? DBNull.Value;

                                    // VARCHAR(3)
                                    cmd.Parameters.Add("@cod_tabla_um_ap", SqlDbType.VarChar, 3).Value =
                                        (object?)med.cod_tabla_um_ap ?? DBNull.Value;

                                    // VARCHAR(1)
                                    cmd.Parameters.Add("@cod_valor_pv", SqlDbType.VarChar, 1).Value =
                                        (object?)med.cod_valor_pv ?? DBNull.Value;

                                    cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 30).Value =
                                        (object?)med.cod_usuario_creo ?? DBNull.Value;

                                    cmd.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 30).Value =
                                        (object?)med.cod_usuario_modi ?? DBNull.Value;

                                    // Ejecución Asíncrona
                                    await cmd.ExecuteNonQueryAsync();
                                }
                            }
                        }

                        if (dto.equipos != null)
                        {
                            foreach (var eq in dto.equipos)
                            {
                                using (SqlCommand cmd = new SqlCommand("SP_GUARDAR_CONTRATO_EQUIPO", cn, tx))
                                {
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@accion", eq.accion);
                                    cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                                    cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);

                                    cmd.Parameters.AddWithValue("@cod_equipo_pesado", eq.cod_equipo_pesado ?? "");
                                    //cmd.Parameters.AddWithValue("@cod_equipo_pesado_1", eq.cod_equipo_pesado_1 ?? "");
                                    cmd.Parameters.AddWithValue("@ind_tarifa", eq.ind_tarifa ?? "");
                                    cmd.Parameters.AddWithValue("@ind_moneda", eq.ind_moneda ?? "");
                                    cmd.Parameters.AddWithValue("@imp_alquiler_equipo", string.IsNullOrEmpty(eq.imp_alquiler_equipo) ? 0 : Convert.ToDecimal(eq.imp_alquiler_equipo));
                                    cmd.Parameters.AddWithValue("@flg_vigencia", eq.flg_vigencia ?? "");
                                    cmd.Parameters.AddWithValue("@cod_usuario_creo", eq.cod_usuario_creo ?? "");
                                    cmd.Parameters.AddWithValue("@cod_usuario_modi", eq.cod_usuario_modi ?? "");


                                    // Ejecución Asíncrona
                                    await cmd.ExecuteNonQueryAsync();
                                }
                            }
                        }

                        await tx.CommitAsync();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        // Deshacer de manera asíncrona
                        await tx.RollbackAsync();

                        throw new Exception("Error al guardar la transacción del contrato corporativo: " + ex.Message, ex);
                    }
                }
            }

        }

        /// GENERAR CODIGO POR ANIO
        /// 

      

        public async Task<string> ObtenerNuevoCodigoContratoAsync(string cod_contrato_anio)
        {
            string nuevoCodigo = string.Empty;

            using (SqlConnection conexion = new SqlConnection(_connectionString))
            {
                using (SqlCommand comando = new SqlCommand("SP_GENERAR_NUEVO_CONTRATO", conexion))
                {
                    comando.CommandType = CommandType.StoredProcedure;

                    comando.Parameters.Add(new SqlParameter("@cod_contrato_anio", SqlDbType.VarChar, 4)
                    {
                        Value = cod_contrato_anio
                    });

                    try
                    {
                        // 🚀 Conexión asíncrona
                        await conexion.OpenAsync();

                        // 🚀 Ejecución asíncrona optimizada para un solo valor scalar
                        object resultado = await comando.ExecuteScalarAsync();

                        if (resultado != null && resultado != DBNull.Value)
                        {
                            nuevoCodigo = resultado.ToString();
                        }
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception("Error asíncrono al generar el correlativo en la BD.", ex);
                    }
                }
            }

            return nuevoCodigo;
        }

    }
}





