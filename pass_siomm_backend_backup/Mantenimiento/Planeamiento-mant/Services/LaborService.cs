using Microsoft.Data.SqlClient;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;
using System.Data;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class LaborService
    {

        private readonly string _connectionString;


        public LaborService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<PaginacionLaborDto> ObtenerLabor(FiltroMantDto filtro)
        {
            List<LaborMantDto> lista = new();

            int totalRegistros = 0;

            using SqlConnection cn = new SqlConnection(_connectionString);

            using SqlCommand cmd = new("SP_BUSCAR_LABOR_MANT", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@cod_empresa", filtro.cod_empresa);

            cmd.Parameters.AddWithValue(
                "@cod_empresa_unidad",
                filtro.cod_empresa_unidad
            );

            cmd.Parameters.AddWithValue(
                "@cod_zona",
                (object?)filtro.cod_zona ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@texto_busqueda",
                (object?)filtro.texto_busqueda ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@pagina",
                filtro.pagina
            );

            cmd.Parameters.AddWithValue(
                "@cantidad_reg",
                filtro.cantidad_reg
            );

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            // =========================
            // PRIMER RESULTSET (DATA)
            // =========================

            while (await dr.ReadAsync())
            {
                lista.Add(new LaborMantDto
                {
                    cod_empresa = dr["cod_empresa"]?.ToString(),

                    cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),

                    cod_und_econom = dr["cod_und_econom"]?.ToString(),

                    cod_zona = dr["cod_zona"]?.ToString(),

                    cod_veta = dr["cod_veta"]?.ToString(),

                    cod_nivel = dr["cod_nivel"]?.ToString(),

                    cod_tipo_labor = dr["cod_tipo_labor"]?.ToString(),

                    cod_labor = dr["cod_labor"]?.ToString(),

                    nom_labor = dr["nom_labor"]?.ToString(),

                    des_labor = dr["des_labor"]?.ToString(),

                    lab_blkgeo = dr["lab_blkgeo"]?.ToString(),

                    met_cod = dr["met_cod"]?.ToString(),

                    nro_lab_ag = dr["nro_lab_ag"] != DBNull.Value
                        ? Convert.ToDecimal(dr["nro_lab_ag"])
                        : null,

                    nro_lab_au = dr["nro_lab_au"] != DBNull.Value
                        ? Convert.ToDecimal(dr["nro_lab_au"])
                        : null,

                    nro_lab_cu = dr["nro_lab_cu"] != DBNull.Value
                        ? Convert.ToDecimal(dr["nro_lab_cu"])
                        : null,

                    nro_lab_pb = dr["nro_lab_pb"] != DBNull.Value
                        ? Convert.ToDecimal(dr["nro_lab_pb"])
                        : null,

                    nro_lab_zn = dr["nro_lab_zn"] != DBNull.Value
                        ? Convert.ToDecimal(dr["nro_lab_zn"])
                        : null,

                    ind_tipo_labor = dr["ind_tipo_labor"]?.ToString(),

                    est_labor = dr["est_labor"]?.ToString(),

                    cod_proced_blza = dr["cod_proced_blza"]?.ToString(),

                    cod_usuario_creo = dr["cod_usuario_creo"]?.ToString(),

                    fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value
                        ? Convert.ToDateTime(dr["fec_usuario_creo"])
                        : null,

                    cod_usuario_modi = dr["cod_usuario_modi"]?.ToString(),

                    fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value
                        ? Convert.ToDateTime(dr["fec_usuario_modi"])
                        : null,

                    cod_tipo_labor_ant = dr["cod_tipo_labor_ant"]?.ToString(),

                    cod_labor_ant = dr["cod_labor_ant"]?.ToString(),

                    cod_fase = dr["cod_fase"]?.ToString(),

                    cod_grupo_control = dr["cod_grupo_control"]?.ToString(),


                    nom_und_econom = dr["nom_und_econom"]?.ToString(),

                    des_und_econom = dr["des_und_econom"]?.ToString(),

                    nom_veta = dr["nom_veta"]?.ToString(),
                    nom_nivel = dr["nom_nivel"]?.ToString(),
                    nom_tipo_labor = dr["nom_tipo_labor"]?.ToString(),

                    nom_proced_blza = dr["nom_proced_blza"]?.ToString(),
                    nom_grupo_control = dr["nom_grupo_control"]?.ToString()
                    //cod_grupo_control = dr["cod_grupo_control"]?.ToString(),




                });
            }

            // =========================
            // SEGUNDO RESULTSET (TOTAL)
            // =========================

            if (await dr.NextResultAsync())
            {
                if (await dr.ReadAsync())
                {
                    totalRegistros =
                        Convert.ToInt32(dr["TotalRegistros"]);
                }
            }

            // =========================
            // TOTAL PÁGINAS
            // =========================

            int totalPaginas = (int)Math.Ceiling(
                (double)totalRegistros / filtro.cantidad_reg
            );

            // =========================
            // RESPONSE FINAL
            // =========================

            return new PaginacionLaborDto
            {
                totalRegistros = totalRegistros,

                paginaActual = filtro.pagina,

                cantidadReg = filtro.cantidad_reg,

                totalPaginas = totalPaginas,
                data = lista

            };
        }


        //listar zona 

        public async Task<List<ZonaMantDto>> ObtenerZonas(string? cod_empresa, string? cod_empresa_unidad)
        {
            List<ZonaMantDto> lista = new();

            using SqlConnection cn = new SqlConnection(_connectionString);

            using SqlCommand cmd = new SqlCommand("SP_LISTAR_ZONA", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@cod_empresa",
                (object?)cod_empresa ?? DBNull.Value);

            cmd.Parameters.AddWithValue("@cod_empresa_unidad",
                (object?)cod_empresa_unidad ?? DBNull.Value);

            await cn.OpenAsync();

            using SqlDataReader dr = await cmd.ExecuteReaderAsync();

            while (await dr.ReadAsync())
            {
                lista.Add(new ZonaMantDto
                {
                    cod_zona = dr["cod_zona"]?.ToString(),
                    des_zona = dr["des_zona"]?.ToString()
                });
            }

            return lista;
        }


        public async Task<MaestrosLaborDto> ObtenerMaestrosLabor(string cod_empresa, string cod_empresa_unidad)
        {
            MaestrosLaborDto response = new();

            using SqlConnection cn =
                new SqlConnection(_connectionString);

            using SqlCommand cmd =
                new SqlCommand("SP_CARGAR_MAESTROS_LABOR", cn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@cod_empresa",
                cod_empresa
            );

            cmd.Parameters.AddWithValue(
                "@cod_empresa_unidad",
                cod_empresa_unidad
            );

            await cn.OpenAsync();

            using SqlDataReader dr =
                await cmd.ExecuteReaderAsync();

            // =========================================
            // UNIDAD ECONOMICA
            // =========================================

            while (await dr.ReadAsync())
            {
                response.unidadEconomica.Add(
                    new UnidadEconomicaMantDto
                    {
                        cod_und_econom =
                            dr["cod_und_econom"]?.ToString(),

                        nom_und_econom =
                            dr["nom_und_econom"]?.ToString(),

                        cod_empresa =
                            dr["cod_empresa"]?.ToString(),

                        des_und_econom =
                            dr["des_und_econom"]?.ToString(),

                        nombre =
                            dr["nombre"]?.ToString(),

                        cod_empresa_unidad =
                            dr["cod_empresa_unidad"]?.ToString()
                    });
            }

            // =========================================
            // VETAS
            // =========================================

            await dr.NextResultAsync();

            while (await dr.ReadAsync())
            {
                response.vetas.Add(
                    new VetaMantDto
                    {
                        cod_empresa =
                            dr["cod_empresa"]?.ToString(),

                        cod_empresa_unidad =
                            dr["cod_empresa_unidad"]?.ToString(),

                        cod_und_econom =
                            dr["cod_und_econom"]?.ToString(),

                        cod_zona =
                            dr["cod_zona"]?.ToString(),

                        cod_veta =
                            dr["cod_veta"]?.ToString(),

                        nom_veta =
                            dr["nom_veta"]?.ToString(),

                        des_veta =
                            dr["des_veta"]?.ToString(),

                        nombre =
                            dr["nombre"]?.ToString(),

                        est_veta =
                            dr["est_veta"]?.ToString()
                    });
            }

            // =========================================
            // NIVELES
            // =========================================

            await dr.NextResultAsync();

            while (await dr.ReadAsync())
            {
                response.niveles.Add(
                    new NivelMantDto
                    {
                        cod_empresa =
                            dr["cod_empresa"]?.ToString(),

                        cod_empresa_unidad =
                            dr["cod_empresa_unidad"]?.ToString(),

                        cod_nivel =
                            dr["cod_nivel"]?.ToString(),

                        nom_nivel =
                            dr["nom_nivel"]?.ToString(),

                        des_nivel =
                            dr["des_nivel"]?.ToString(),

                        nro_nivel_cot =
                            dr["nro_nivel_cot"] != DBNull.Value
                                ? Convert.ToDecimal(
                                    dr["nro_nivel_cot"])
                                : null,

                        est_nivel =
                            dr["est_nivel"]?.ToString()
                    });
            }

            // =========================================
            // TIPO LABOR
            // =========================================

            await dr.NextResultAsync();

            while (await dr.ReadAsync())
            {
                response.tipoLabor.Add(
                    new TipoLaborMantDto
                    {
                        cod_tipo_labor =
                            dr["cod_tipo_labor"]?.ToString(),

                        nom_tipo_labor =
                            dr["nom_tipo_labor"]?.ToString(),

                        tipo_labor =
                            dr["tipo_labor"]?.ToString(),

                        est_tipo_labor =
                            dr["est_tipo_labor"]?.ToString()
                    });
            }

            // =========================================
            // PROCEDENCIA BALANZA
            // =========================================

            await dr.NextResultAsync();

            while (await dr.ReadAsync())
            {
                response.procedenciaBalanza.Add(
                    new ProcedenciaBalanzaMantDto
                    {
                        cod_proced_blza =
                            dr["cod_proced_blza"]?.ToString(),

                        nom_proced_blza =
                            dr["nom_proced_blza"]?.ToString(),

                        cod_zona =
                            dr["cod_zona"]?.ToString(),

                        des_zona =
                            dr["des_zona"]?.ToString()
                    });
            }

            // =========================================
            // GRUPO CONTROL
            // =========================================

            await dr.NextResultAsync();

            while (await dr.ReadAsync())
            {
                response.grupoControl.Add(
                    new GrupoControlMantDto
                    {
                        cod_grupo_control =
                            dr["cod_grupo_control"]?.ToString(),

                        nom_grupo_control =
                            dr["nom_grupo_control"]?.ToString(),

                        est_grupo_control =
                            dr["est_grupo_control"]?.ToString()
                    });
            }



            return response;
        }






        public async Task<ResponseLaborMantDto> GuardarLabor(List<LaborMantDto> lista)
        {

            Console.WriteLine("========== INICIO REQUEST EN EL SERVICIO ==========");

            Console.WriteLine($"Cantidad de registros: {lista?.Count}");

            Console.WriteLine(
                System.Text.Json.JsonSerializer.Serialize(
                    lista,
                    new System.Text.Json.JsonSerializerOptions
                    {
                        WriteIndented = true
                    }
                )
            );

            Console.WriteLine("========== FIN REQUEST ==========");

            ResponseLaborMantDto response = new();

            using SqlConnection cn = new(_connectionString);
            await cn.OpenAsync();

            using SqlTransaction transaction = await cn.BeginTransactionAsync() as SqlTransaction;

            try
            {
                foreach (var item in lista)
                {
                    using SqlCommand cmd = new("SP_INSERTAR_LABOR", cn, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;

                    // 🎯 Parametrización tipada y con longitudes estrictas según tu SP modificado
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 2).Value = item.cod_und_econom ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = item.cod_zona ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 10).Value = item.cod_veta ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 10).Value = item.cod_nivel ?? (object)DBNull.Value; 
                    cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 10).Value = item.cod_tipo_labor ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 10).Value = item.cod_labor ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@nom_labor", SqlDbType.VarChar, 60).Value = item.nom_labor ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@des_labor", SqlDbType.VarChar, 80).Value = item.des_labor ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@ind_tipo_labor", SqlDbType.VarChar, 1).Value = item.ind_tipo_labor ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@est_labor", SqlDbType.VarChar, 3).Value = item.est_labor ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_proced_blza", SqlDbType.VarChar, 3).Value = item.cod_proced_blza ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_tipo_labor_ant", SqlDbType.VarChar, 10).Value = item.cod_tipo_labor_ant ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_labor_ant", SqlDbType.VarChar, 10).Value = item.cod_labor_ant ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_grupo_control", SqlDbType.VarChar, 2).Value = item.cod_grupo_control ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 20).Value = item.cod_usuario_creo ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@accion", SqlDbType.Char, 1).Value = item.accion;

                    int estadoControl = 0; // 0 = Error por defecto
                    string mensajeFila = "Sin respuesta del SP";

                    // Control de lectura local del Reader por cada iteración
                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        if (await dr.ReadAsync())
                        {
                            // Captura directa del INT que envía tu SP (1, 0, o -1)
                            estadoControl = dr["estado"] != DBNull.Value ? Convert.ToInt32(dr["estado"]) : 0;
                            mensajeFila = dr["mensaje"]?.ToString() ?? "Error desconocido en SP.";
                        }
                    }

                    // 🛑 Si el SP devuelve algo diferente de 1, es un error controlado (0) o catch del SP (-1)
                    if (estadoControl != 1)
                    {
                        await transaction.RollbackAsync();
                        return new ResponseLaborMantDto
                        {
                            estado = estadoControl, // Mapeo numérico correcto (0 o -1)
                            mensaje = $"Controlado: Error en ítem '{item.cod_labor}': {mensajeFila}"
                        };
                    }
                }

                // ✅ Si toda la lista se procesó sin inconvenientes, confirmamos los cambios
                await transaction.CommitAsync();

                return new ResponseLaborMantDto
                {
                    estado = 1, // Éxito total
                    mensaje = "Datos guardados correctamente."
                };
            }
            catch (SqlException ex)
            {
                // Rompe y revierte si ocurre un error a nivel de motor de BD (truncados, PK duplicadas no controladas, etc.)
                if (transaction.Connection is not null)
                    await transaction.RollbackAsync();

                return new ResponseLaborMantDto
                {
                    estado = -1, // Marcamos como error crítico de base de datos
                    mensaje = $"Error de Base de Datos: {ex.Message} (Código de error: {ex.Number})"
                };
            }
            catch (Exception ex)
            {
                // Rompe y revierte ante cualquier excepción imprevista del código C#
                if (transaction.Connection is not null)
                    await transaction.RollbackAsync();

                return new ResponseLaborMantDto
                {
                    estado = -1, // Marcamos como error crítico de servidor
                    mensaje = $"Error crítico en Backend: {ex.Message}"
                };
            }
        }


        public async Task<ResponseEliminarDto> EliminarLabor(LaborMantDto data)
        {
            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_LABOR", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 20).Value = data.cod_labor;
                    cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 20).Value = data.cod_zona;
                    cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 20).Value = data.cod_veta;
                    cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 20).Value = data.cod_nivel;
                    cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 20).Value = data.cod_tipo_labor;
                    cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 20).Value = data.cod_und_econom;


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
