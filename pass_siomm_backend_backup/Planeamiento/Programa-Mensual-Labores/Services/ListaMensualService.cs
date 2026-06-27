using Dapper; // 👈 No olvides este using
using MathNet.Numerics.Interpolation; // xls
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel; // xlsx
using OfficeOpenXml;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;
using System.ComponentModel;
using System.Data;
using System.Diagnostics.Contracts;
using static System.Net.WebRequestMethods;

// ... otros usings

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services
{
    public class ListaMensualService
    {
        private readonly string _connectionString;


        public ListaMensualService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }


        public async Task<List<ListaMensualDTO>> ObtenerListaMensual(string cie_ano, string? cie_per)
        {
            var lista = new List<ListaMensualDTO>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_MENSUAL_LISTA", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = cie_ano;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2).Value = string.IsNullOrEmpty(cie_per) ? DBNull.Value : cie_per;

                    await conn.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var item = new ListaMensualDTO
                            {
                                nro_prog = reader["nro_prog"]?.ToString(),
                                cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                                cod_zona = reader["cod_zona"]?.ToString(),
                                cod_contrata = reader["cod_contrata"]?.ToString(),
                                des_contrata = reader["des_contrata"]?.ToString(),
                                cie_ano = reader["cie_ano"]?.ToString(),
                                cie_per = reader["cie_per"]?.ToString(),
                                fec_emi = reader["fec_emi"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_emi"]),
                                prg_est = reader["prg_est"]?.ToString(),
                                cod_empresa = reader["cod_empresa"]?.ToString(),
                                cod_und_econom = reader["cod_und_econom"]?.ToString(),
                                nom_und_econom = reader["nom_und_econom"]?.ToString(),
                                cod_usuario_creo = reader["cod_usuario_creo"]?.ToString(),
                                fec_usuario_creo = reader["fec_usuario_creo"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_usuario_creo"]),
                                cod_usuario_modi = reader["cod_usuario_modi"]?.ToString(),
                                fec_usuario_modi = reader["fec_usuario_modi"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_usuario_modi"]),
                                cod_usuario_apr = reader["cod_usuario_apr"]?.ToString(),
                                fec_usuario_apr = reader["fec_usuario_apr"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_usuario_apr"]),
                                cod_usuario_anu = reader["cod_usuario_anu"]?.ToString(),
                                fec_usuario_anu = reader["fec_usuario_anu"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_usuario_anu"]),
                                des_zona = reader["des_zona"]?.ToString(),
                                des = reader["des"]?.ToString(),
                                prg_pre_apr = reader["prg_pre_apr"]?.ToString(),
                                prg_apr_geo = reader["prg_apr_geo"]?.ToString(),
                                prg_apr_min = reader["prg_apr_min"]?.ToString(),
                                cod_usuario_apr_geo = reader["cod_usuario_apr_geo"]?.ToString(),
                                fec_usuario_apr_geo = reader["fec_usuario_apr_geo"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_usuario_apr_geo"]),
                                cod_usuario_apr_min = reader["cod_usuario_apr_min"]?.ToString(),
                                fec_usuario_apr_min = reader["fec_usuario_apr_min"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_usuario_apr_min"]),
                                tipo_incidencia = reader["tipo_incidencia"]?.ToString(),
                                ind_calc_dil = reader["ind_calc_dil"]?.ToString()
                            };

                            lista.Add(item);
                        }
                    }
                }
            }

            return lista;
        }


        public async Task<List<ListaIncidenciasDto>> ObtenerListaIncidencia(string nro_prog)
        {
            var lista = new List<ListaIncidenciasDto>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_LISTA_INCIDENCIAS", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;

                    await conn.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var item = new ListaIncidenciasDto
                            {
                                cod_veta = reader["cod_veta"]?.ToString(),
                                cod_nivel = reader["cod_nivel"]?.ToString(),
                                cod_tipo_labor = reader["cod_tipo_labor"]?.ToString(),
                                cod_labor = reader["cod_labor"]?.ToString(),
                                cod_ala = reader["cod_ala"]?.ToString(),
                                descripcion = reader["descripcion"]?.ToString(),
                                nom_veta = reader["nom_veta"]?.ToString(),
                            };

                            lista.Add(item);
                        }
                    }
                }
            }

            return lista;
        }

        public async Task<RespuestaOperacionDto> AnularProgramacion(string nro_prog)
        {
            var respuesta = new RespuestaOperacionDto();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_ANULAR_PROGRAMACION", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;

                    await conn.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            respuesta.estado = Convert.ToInt32(reader["estado"]);
                            respuesta.mensaje = reader["mensaje"].ToString();
                        }
                    }
                }
            }

            return respuesta;
        }


        public async Task<RespuestaOperacionDto> AprobarProgramacion(string nro_prog, string? cod_usuario)
        {
            var respuesta = new RespuestaOperacionDto();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_APROBAR_PROGRAMACION", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;
                    cmd.Parameters.Add("@cod_usuario", SqlDbType.VarChar, 10).Value = cod_usuario;

                    await conn.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            respuesta.estado = Convert.ToInt32(reader["estado"]);
                            respuesta.mensaje = reader["mensaje"].ToString();
                        }
                    }
                }
            }

            return respuesta;
        }

        //exportar datos 
        public async Task<ExportarProgramacionResponse> ExportarProgramacion(
            ExportarProgramacionRequest request)
        {
            using var cn = new SqlConnection(_connectionString + ";Packet Size=32767");

            var parametros = new DynamicParameters();

            parametros.Add("@cie_ano", request.cie_ano);
            parametros.Add("@cie_per", string.IsNullOrWhiteSpace(request.cie_per)
                ? null
                : request.cie_per);

            parametros.Add("@nro_prog", string.IsNullOrWhiteSpace(request.nro_prog)
                ? null
                : request.nro_prog);

            parametros.Add("@estado", dbType: DbType.Int32,
                direction: ParameterDirection.Output);

            parametros.Add("@mensaje", dbType: DbType.String,
                size: 500,
                direction: ParameterDirection.Output);

            var data = await cn.QueryAsync<DetalleProgramaDto>(
                "SP_EXPORTAR_PROGRAMACION_MENSUAL",
                parametros,
                commandType: CommandType.StoredProcedure
            );

            return new ExportarProgramacionResponse
            {
                Estado = parametros.Get<int>("@estado"),
                Mensaje = parametros.Get<string>("@mensaje"),
                Data = data.ToList()
            };
        }


        //importar archivo excel

        public async Task<ResultadoImportacionDto> ImportarExcel(IFormFile file)
        {
            var unidades = new HashSet<string>();
            var zonas = new HashSet<string>();
            var contratas = new HashSet<string>();

            var listaFilas = new List<IRow>();
            var listaLabor = new List<string>();

            try
            {
                using var stream = new MemoryStream();
                await file.CopyToAsync(stream);
                stream.Position = 0;

                IWorkbook workbook = Path.GetExtension(file.FileName).ToLower() == ".xlsx"
                    ? new XSSFWorkbook(stream)
                    : new HSSFWorkbook(stream);

                var sheet = workbook.GetSheetAt(0);

                // =========================
                // 📌 LECTURA DEL EXCEL
                // =========================
                for (int i = 1; i <= sheet.LastRowNum; i++)
                {
                    var fila = sheet.GetRow(i);
                    if (fila == null) continue;

                    var unidad = fila.GetCell(0)?.ToString()?.Trim();
                    var zona = fila.GetCell(1)?.ToString()?.Trim();
                    var labor = fila.GetCell(5)?.ToString()?.Trim();
                    var contrata = fila.GetCell(24)?.ToString()?.Trim();

                    // Normalizar labor
                    if (!string.IsNullOrWhiteSpace(labor))
                    {
                        labor = labor
                            .Trim()
                            .Replace(" ", "")
                            .ToUpper();

                        listaLabor.Add(labor);

                        Console.WriteLine($"Labor limpia: [{labor}]");
                    }

                    unidades.Add(unidad);
                    zonas.Add(zona);
                    contratas.Add(contrata);

                    listaFilas.Add(fila);
                }

                // =========================
                // 📌 VALIDACIONES GENERALES
                // =========================
                if (unidades.Count > 1)
                    return new ResultadoImportacionDto
                    {
                        respuesta = false,
                        mensaje = "Unidad Económica debe ser igual."
                    };

                if (zonas.Count > 1)
                    return new ResultadoImportacionDto
                    {
                        respuesta = false,
                        mensaje = "Zona debe ser igual."
                    };

                if (contratas.Count > 1)
                    return new ResultadoImportacionDto
                    {
                        respuesta = false,
                        mensaje = "Contrata debe ser igual."
                    };

                // =========================
                // 🚨 VALIDAR DUPLICADOS EN EXCEL
                // =========================
                var duplicados = listaLabor
                    .GroupBy(x => x)
                    .Where(g => g.Count() > 1)
                    .Select(g => g.Key)
                    .ToList();

                if (duplicados.Any())
                {
                    return new ResultadoImportacionDto
                    {
                        respuesta = false,
                        mensaje = $"La labor debe ser unica, existen labores duplicados: {string.Join(", ", duplicados)}"
                    };
                }

                // =========================
                // 📌 CONEXIÓN BD
                // =========================
                using SqlConnection conn = new SqlConnection(_connectionString);
                await conn.OpenAsync();

                // =========================
                // 📌 CREAR CABECERA
                // =========================
                string nroProg = await CrearCabecera(listaFilas.First(), conn);

                if (nroProg.StartsWith("ERROR"))
                {
                    return new ResultadoImportacionDto
                    {
                        respuesta = false,
                        mensaje = nroProg
                    };
                }

                // =========================
                // 📌 INSERTAR DETALLE
                // =========================
                foreach (var fila in listaFilas)
                {
                    var res = await InsertarDetalle(fila, nroProg, conn);

                    if (res.StartsWith("ERROR"))
                    {
                        return new ResultadoImportacionDto
                        {
                            respuesta = false,
                            mensaje = res
                        };
                    }
                }

                // =========================
                // ✅ OK
                // =========================
                return new ResultadoImportacionDto
                {
                    respuesta = true,
                    totalFilas = listaFilas.Count,
                    mensaje = $"OK: Programa {nroProg} importado correctamente"
                };
            }
            catch (Exception ex)
            {
                return new ResultadoImportacionDto
                {
                    respuesta = false,
                    mensaje = ex.Message
                };
            }
        }


        private async Task<string> CrearCabecera(IRow fila, SqlConnection conn)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("SP_CREAR_CABECERA", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                string GetCell(int i) => fila.GetCell(i)?.ToString();

                cmd.Parameters.AddWithValue("@cod_empresa", "03");
                cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
                cmd.Parameters.AddWithValue("@cod_und_econom", GetCell(0) ?? "");
                cmd.Parameters.AddWithValue("@cod_zona", GetCell(1) ?? "");
                cmd.Parameters.AddWithValue("@cod_contrata", GetCell(24) ?? "");

                var output = new SqlParameter("@nro_prog", SqlDbType.VarChar, 20)
                {
                    Direction = ParameterDirection.Output
                };

                cmd.Parameters.Add(output);

                await cmd.ExecuteNonQueryAsync();

                return output.Value?.ToString();
            }
            catch (Exception ex)
            {
                return "ERROR: " + ex.Message;
            }
        }

        private async Task<string> InsertarDetalle(IRow fila, string nroProg, SqlConnection conn)
        {

            //  validar el campo labor que sea unico
            try
            {
                using SqlCommand cmd = new SqlCommand("SP_INSERTAR_DETALLE", conn);

                cmd.CommandType = CommandType.StoredProcedure;

                string GetCell(int idx) => fila.GetCell(idx)?.ToString();
                decimal? GetDecimal(int idx) => decimal.TryParse(GetCell(idx), out var d) ? d : null;

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 20).Value = nroProg;
                cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 50).Value = GetCell(0) ?? "";
                cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 50).Value = GetCell(1) ?? "";
                cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 50).Value = GetCell(2) ?? "";
                cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 50).Value = GetCell(3) ?? "";
                cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 50).Value = GetCell(4) ?? "";
                cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 50).Value = GetCell(5) ?? "";
                cmd.Parameters.Add("@cod_ala", SqlDbType.VarChar, 50).Value = GetCell(6) ?? "";
                cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 50).Value = GetCell(7) ?? "";
                cmd.Parameters.Add("@prg_avamts", SqlDbType.Decimal).Value = (object?)GetDecimal(8) ?? DBNull.Value;
                cmd.Parameters.Add("@metexp_cod", SqlDbType.VarChar, 50).Value = GetCell(9) ?? "";
                cmd.Parameters.Add("@prg_secancho", SqlDbType.Decimal).Value = (object?)GetDecimal(10) ?? DBNull.Value;
                cmd.Parameters.Add("@prg_secaltu", SqlDbType.Decimal).Value = (object?)GetDecimal(11) ?? DBNull.Value;
                cmd.Parameters.Add("@prg_tmsdes", SqlDbType.Decimal).Value = (object?)GetDecimal(12) ?? DBNull.Value;
                cmd.Parameters.Add("@prg_tmsmin", SqlDbType.Decimal).Value = (object?)GetDecimal(13) ?? DBNull.Value;
                cmd.Parameters.Add("@prg_blocks", SqlDbType.VarChar, 20).Value = GetCell(14) ?? "";
                cmd.Parameters.Add("@prg_tmsextraid", SqlDbType.Decimal).Value = (object?)GetDecimal(15) ?? DBNull.Value;

                cmd.Parameters.Add("@prg_leyag", SqlDbType.Decimal).Value = (object?)GetDecimal(16) ?? DBNull.Value;
                cmd.Parameters.Add("@prg_leycu", SqlDbType.Decimal).Value = (object?)GetDecimal(17) ?? DBNull.Value;
                cmd.Parameters.Add("@prg_leypb", SqlDbType.Decimal).Value = (object?)GetDecimal(18) ?? DBNull.Value;
                cmd.Parameters.Add("@prg_leyzn", SqlDbType.Decimal).Value = (object?)GetDecimal(19) ?? DBNull.Value;
                cmd.Parameters.Add("@ind_clasificacion_sos", SqlDbType.VarChar, 50).Value = GetCell(20) ?? "";
                cmd.Parameters.Add("@num_factor_x", SqlDbType.Decimal).Value = (object?)GetDecimal(21) ?? DBNull.Value;
                cmd.Parameters.Add("@val_tipo_fac", SqlDbType.VarChar, 50).Value = GetCell(22) ?? "";
                cmd.Parameters.Add("@num_corte", SqlDbType.Decimal).Value = (object?)GetDecimal(23) ?? DBNull.Value;

                await cmd.ExecuteNonQueryAsync();

                return "OK";
            }
            catch (Exception ex)
            {
                return "ERROR: " + ex.Message;
            }
        }








        public async Task<RespuestaPreAprobacionDto> PreAprobacionProgramacion(string nro_prog, string prg_pre_pr)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand("SP_PREAPROBAR_PROGRAMACION", cn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;
                cmd.Parameters.Add("@prg_pre_apr", SqlDbType.VarChar, 3).Value = prg_pre_pr;

                cn.Open();

                using (var dr = await cmd.ExecuteReaderAsync())
                {
                    if (dr.Read())
                    {
                        return new RespuestaPreAprobacionDto
                        {
                            ok = Convert.ToBoolean(dr["ok"]),
                            mensaje = dr["mensaje"]?.ToString(),
                            nuevo_estado = dr["nuevo_estado"]?.ToString()
                        };
                    }
                }
            }

            return null;
        }


        public static decimal? GetDecimalSafe(IDataReader dr, string columnName)
        {
            var value = dr[columnName];
            if (value == DBNull.Value || value == null)
                return null;

            // si viene como decimal, lo devuelve tal cual
            if (value is decimal d)
                return d;

            // si viene como string (por view o join)
            if (value is string s && decimal.TryParse(s, out var result))
                return result;

            // fallback seguro
            return Convert.ToDecimal(value);
        }


        //COPIAR PERIODO

        public async Task<object> CopiarProgramacion(CopiarProgramacionDto request)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_COPIAR_PROGRAMA_MENSUAL", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = request.cod_empresa;
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = request.cod_empresa_unidad;
                    cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = request.nro_prog;
                    cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = request.cie_ano;
                    cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2).Value = request.cie_per;

                    cmd.Parameters.Add("@usuario", SqlDbType.VarChar, 50).Value = request.usuario;

                    await conn.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            return new CopiarResponseDto
                            {
                                mensaje = reader["mensaje"].ToString(),
                                nro_prog_nuevo = reader["nro_prog_nuevo"].ToString()
                            };
                        }
                    }
                }
            }

            return null;
        }


        public (int result, string prgNum, string error) GenerarCorrelativo(string cod_empresa, string cod_unidad_empresa)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlTransaction transaction = conn.BeginTransaction();

                try
                {
                    // 1. Obtener fecha servidor
                    DateTime fechaServidor = DateTime.Now; // o SELECT GETDATE()

                    // 2. Obtener correlativo con bloqueo
                    string ls_nro = "";

                    string querySelect = @"
                    SELECT num_prg 
                    FROM mae_correlativo_doc 
                    WHERE cod_empresa = @cod_empresa 
                    AND cod_empresa_unidad = @cod_unidad_empresa";

                    using (SqlCommand cmd = new SqlCommand(querySelect, conn, transaction))
                    {
                        cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                        cmd.Parameters.AddWithValue("@cod_unidad_empresa", cod_unidad_empresa);

                        var result = cmd.ExecuteScalar();

                        if (result == null)
                            throw new Exception("No se pudo capturar el número correlativo");

                        ls_nro = result.ToString();
                    }

                    // 3. Generar número
                    string anio = fechaServidor.ToString("yyyy");
                    string ls_prg_num = anio + ls_nro.Substring(ls_nro.Length - 6);

                    string ls_new_nro = (Convert.ToDouble(ls_nro) + 1).ToString("0000000000");

                    // 4. Update correlativo
                    string queryUpdate = @"
                    UPDATE mae_correlativo_doc 
                    SET num_prg = @newNro
                    WHERE cod_empresa = @cod_empresa 
                    AND cod_empresa_unidad = @cod_unidad_empresa";

                    using (SqlCommand cmd = new SqlCommand(queryUpdate, conn, transaction))
                    {
                        cmd.Parameters.AddWithValue("@newNro", ls_new_nro);
                        cmd.Parameters.AddWithValue("@cod_empresa", cod_empresa);
                        cmd.Parameters.AddWithValue("@cod_unidad_empresa", cod_unidad_empresa);

                        int rows = cmd.ExecuteNonQuery();

                        if (rows == 0)
                            throw new Exception("No se pudo actualizar el correlativo");
                    }

                    // Commit
                    transaction.Commit();

                    return (1, ls_prg_num, null);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return (-1, null, ex.Message);
                }
            }
        }

    }
}
