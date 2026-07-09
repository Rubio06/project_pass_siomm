using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using NPOI.SS.Formula.Functions;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Planeamiento.Balanza_Detalle.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using System.Data;
using System.Diagnostics.Contracts;
using System.Globalization;
using System.Globalization;
using System.Security;
using System.Text;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services
{
    public class PreciosUnitariosService 
    {

        private readonly string _connectionString;


        public PreciosUnitariosService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }


        public async Task<List<ActividadTareaMantDto>> ListarActividadesVigentesAsync()
        {
            var listaActividades = new List<ActividadTareaMantDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_LISTAR_ACTIVIDAD", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = "01";

                    // Apertura asíncrona de la conexión
                    await cn.OpenAsync();

                    // Ejecución asíncrona del Reader
                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        // Lectura asíncrona fila por fila
                        while (await dr.ReadAsync())
                        {
                            var actividad = new ActividadTareaMantDto
                            {
                                cod_actividad = dr["cod_actividad"] != DBNull.Value ? dr["cod_actividad"].ToString().Trim() : string.Empty,
                                des_actividad = dr["des_actividad"] != DBNull.Value ? dr["des_actividad"].ToString().Trim() : string.Empty,
                                des_actividad_abrev = dr["des_actividad_abrev"] != DBNull.Value ? dr["des_actividad_abrev"].ToString().Trim() : string.Empty,
                                flg_vigente = dr["flg_vigente"] != DBNull.Value ? dr["flg_vigente"].ToString().Trim() : string.Empty,
                                cod_usuario_creo = dr["cod_usuario_creo"] != DBNull.Value ? dr["cod_usuario_creo"].ToString().Trim() : string.Empty,
                                fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_creo"]) : (DateTime?)null,
                                cod_usuario_modi = dr["cod_usuario_modi"] != DBNull.Value ? dr["cod_usuario_modi"].ToString().Trim() : string.Empty,
                                fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_modi"]) : (DateTime?)null,
                                cod_empresa = dr["cod_empresa"] != DBNull.Value ? dr["cod_empresa"].ToString().Trim() : string.Empty,
                                cod_empresa_unidad = dr["cod_empresa_unidad"] != DBNull.Value ? dr["cod_empresa_unidad"].ToString().Trim() : string.Empty
                            };

                            listaActividades.Add(actividad);
                        }
                    }
                }
            }

            return listaActividades;
        }

        public async Task<List<CatalogoTareaDto>> BuscarCatalogoTareaAsync(EntradaActividadTareaMantDto entrada)
        {
            var lista = new List<CatalogoTareaDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_BUSCAR_CATALOGO_TAREA", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros Obligatorios
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;

                    // Parámetros Opcionales de Búsqueda (Control de Nulos)
                    cmd.Parameters.Add("@cod_actividad", SqlDbType.VarChar, 10).Value =
                        string.IsNullOrWhiteSpace(entrada.cod_actividad) ? DBNull.Value : entrada.cod_actividad;

                    cmd.Parameters.Add("@des_catalogo_tarea", SqlDbType.VarChar, 200).Value =
                        string.IsNullOrWhiteSpace(entrada.des_catalogo_tarea) ? DBNull.Value : entrada.des_catalogo_tarea;

                    await cn.OpenAsync();

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            var item = new CatalogoTareaDto
                            {
                                cod_empresa = dr["cod_empresa"] != DBNull.Value ? dr["cod_empresa"].ToString().Trim() : string.Empty,
                                cod_empresa_unidad = dr["cod_empresa_unidad"] != DBNull.Value ? dr["cod_empresa_unidad"].ToString().Trim() : string.Empty,
                                cod_catalogo_tarea = dr["cod_catalogo_tarea"] != DBNull.Value ? dr["cod_catalogo_tarea"].ToString().Trim() : string.Empty,
                                cod_actividad = dr["cod_actividad"] != DBNull.Value ? dr["cod_actividad"].ToString().Trim() : string.Empty,
                                des_catalogo_tarea = dr["des_catalogo_tarea"] != DBNull.Value ? dr["des_catalogo_tarea"].ToString().Trim() : string.Empty,
                                des_catalogotarea_abrev = dr["des_catalogotarea_abrev"] != DBNull.Value ? dr["des_catalogotarea_abrev"].ToString().Trim() : string.Empty,
                                ind_tipo_tarea = dr["ind_tipo_tarea"] != DBNull.Value ? dr["ind_tipo_tarea"].ToString().Trim() : string.Empty,
                                cod_item_unimed = dr["cod_item_unimed"] != DBNull.Value ? dr["cod_item_unimed"].ToString().Trim() : string.Empty,
                                cod_tabla_unimed = dr["cod_tabla_unimed"] != DBNull.Value ? dr["cod_tabla_unimed"].ToString().Trim() : string.Empty,
                                flg_vigente = dr["flg_vigente"] != DBNull.Value ? dr["flg_vigente"].ToString().Trim() : string.Empty,
                                cod_usuario_creo = dr["cod_usuario_creo"] != DBNull.Value ? dr["cod_usuario_creo"].ToString().Trim() : string.Empty,

                                fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_creo"]) : (DateTime?)null,

                                c_fl = dr["c_fl"] != DBNull.Value ? dr["c_fl"].ToString().Trim() : "N",
                                cod_catalogo = dr["cod_catalogo"] != DBNull.Value ? dr["cod_catalogo"].ToString().Trim() : string.Empty,
                                c_t_actividad = dr["c_t_actividad"] != DBNull.Value ? dr["c_t_actividad"].ToString().Trim() : string.Empty,
                                cod_metexp = dr["cod_metexp"] != DBNull.Value ? dr["cod_metexp"].ToString().Trim() : string.Empty,

                                // Mapeo seguro de decimales para anchos de pago
                                nro_anchopago_1 = dr["nro_anchopago_1"] != DBNull.Value ? Convert.ToDecimal(dr["nro_anchopago_1"]) : (decimal?)null,
                                nro_anchopago_2 = dr["nro_anchopago_2"] != DBNull.Value ? Convert.ToDecimal(dr["nro_anchopago_2"]) : (decimal?)null,

                                cod_seccion_labor = dr["cod_seccion_labor"] != DBNull.Value ? dr["cod_seccion_labor"].ToString().Trim() : string.Empty,
                                cod_avance_chimenea = dr["cod_avance_chimenea"] != DBNull.Value ? dr["cod_avance_chimenea"].ToString().Trim() : string.Empty,
                                cod_desquinche_perforacion = dr["cod_desquinche_perforacion"] != DBNull.Value ? dr["cod_desquinche_perforacion"].ToString().Trim() : string.Empty
                            };

                            lista.Add(item);
                        }
                    }
                }
            }

            return lista;
        }


        //public async Task<List<PartidaPuDto>> ListarPartidasPuAsync(EntradaPartidasPuDto entrada)
        //{
        //    var listaPartidas = new List<PartidaPuDto>();

        //    using (SqlConnection cn = new SqlConnection(_connectionString))
        //    {
        //        using (SqlCommand cmd = new SqlCommand("SP_LISTAR_PARTIDAS_PU", cn))
        //        {
        //            cmd.CommandType = CommandType.StoredProcedure;

        //            // Parámetros de entrada obligatorios del SP
        //            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empresa;
        //            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empresa_unidad;
        //            cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = entrada.cod_contrato;

        //            await cn.OpenAsync();

        //            using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
        //            {
        //                while (await dr.ReadAsync())
        //                {
        //                    var partida = new PartidaPuDto
        //                    {
        //                        cod_empresa = dr["cod_empresa"] != DBNull.Value ? dr["cod_empresa"].ToString().Trim() : string.Empty,
        //                        cod_empresa_unidad = dr["cod_empresa_unidad"] != DBNull.Value ? dr["cod_empresa_unidad"].ToString().Trim() : string.Empty,
        //                        cod_contrato = dr["cod_contrato"] != DBNull.Value ? dr["cod_contrato"].ToString().Trim() : string.Empty,
        //                        cod_catalogo_tarea = dr["cod_catalogo_tarea"] != DBNull.Value ? dr["cod_catalogo_tarea"].ToString().Trim() : string.Empty,
        //                        cod_actividad = dr["cod_actividad"] != DBNull.Value ? dr["cod_actividad"].ToString().Trim() : string.Empty,
        //                        nro_partida = dr["nro_partida"] != DBNull.Value ? dr["nro_partida"].ToString().Trim() : string.Empty,
        //                        des_catalogo_tarea = dr["des_catalogo_tarea"] != DBNull.Value ? dr["des_catalogo_tarea"].ToString().Trim() : string.Empty,

        //                        // Mapeo seguro de montos e importes decimales
        //                        imp_costo_directo = dr["imp_costo_directo"] != DBNull.Value ? Convert.ToDecimal(dr["imp_costo_directo"]) : (decimal?)null,
        //                        imp_gastos_parametros = dr["imp_gastos_parametros"] != DBNull.Value ? Convert.ToDecimal(dr["imp_gastos_parametros"]) : (decimal?)null,
        //                        imp_costo_partida = dr["imp_costo_partida"] != DBNull.Value ? Convert.ToDecimal(dr["imp_costo_partida"]) : (decimal?)null,
        //                        imp_costo_partida_dolar = dr["imp_costo_partida_dolar"] != DBNull.Value ? Convert.ToDecimal(dr["imp_costo_partida_dolar"]) : (decimal?)null,

        //                        flg_vigente = dr["flg_vigente"] != DBNull.Value ? dr["flg_vigente"].ToString().Trim() : string.Empty,
        //                        cod_tabla_unimed = dr["cod_tabla_unimed"] != DBNull.Value ? dr["cod_tabla_unimed"].ToString().Trim() : string.Empty,
        //                        imp_valor_calculo = dr["imp_valor_calculo"] != DBNull.Value ? Convert.ToDecimal(dr["imp_valor_calculo"]) : (decimal?)null,
        //                        cod_item_unimed = dr["cod_item_unimed"] != DBNull.Value ? dr["cod_item_unimed"].ToString().Trim() : string.Empty,
        //                        cod_usuario_modi = dr["cod_usuario_modi"] != DBNull.Value ? dr["cod_usuario_modi"].ToString().Trim() : string.Empty,

        //                        fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_creo"]) : (DateTime?)null,
        //                        fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_modi"]) : (DateTime?)null,
        //                        cod_usuario_creo = dr["cod_usuario_creo"] != DBNull.Value ? dr["cod_usuario_creo"].ToString().Trim() : string.Empty,

        //                        // Mapeo de Campos Calculados del sub-proceso / pivote
        //                        tipo_cambio = dr["tipo_cambio"] != DBNull.Value ? Convert.ToDecimal(dr["tipo_cambio"]) : (decimal?)null,
        //                        altura_labor = dr["altura_labor"] != DBNull.Value ? Convert.ToDecimal(dr["altura_labor"]) : (decimal?)null,
        //                        ancho_labor = dr["ancho_labor"] != DBNull.Value ? Convert.ToDecimal(dr["ancho_labor"]) : (decimal?)null,
        //                        equipo = dr["equipo"] != DBNull.Value ? dr["equipo"].ToString().Trim() : string.Empty,
        //                        ind_tipo_tarea = dr["ind_tipo_tarea"] != DBNull.Value ? dr["ind_tipo_tarea"].ToString().Trim() : string.Empty,
        //                        codigo_precio = dr["codigo_precio"] != DBNull.Value ? dr["codigo_precio"].ToString().Trim() : string.Empty,
        //                        um_pago = dr["um_pago"] != DBNull.Value ? dr["um_pago"].ToString().Trim() : string.Empty,

        //                        // Variables geomecánicas / operacionales finales
        //                        ind_estado = dr["ind_estado"] != DBNull.Value ? dr["ind_estado"].ToString().Trim() : string.Empty,
        //                        ind_situacion = dr["ind_situacion"] != DBNull.Value ? dr["ind_situacion"].ToString().Trim() : string.Empty,
        //                        ind_zona = dr["ind_zona"] != DBNull.Value ? dr["ind_zona"].ToString().Trim() : string.Empty,
        //                        cod_metexp = dr["cod_metexp"] != DBNull.Value ? dr["cod_metexp"].ToString().Trim() : string.Empty,
        //                        nro_anchopago_1 = dr["nro_anchopago_1"] != DBNull.Value ? Convert.ToDecimal(dr["nro_anchopago_1"]) : (decimal?)null,
        //                        nro_anchopago_2 = dr["nro_anchopago_2"] != DBNull.Value ? Convert.ToDecimal(dr["nro_anchopago_2"]) : (decimal?)null,
        //                        cod_seccion_labor = dr["cod_seccion_labor"] != DBNull.Value ? dr["cod_seccion_labor"].ToString().Trim() : string.Empty,
        //                        cod_avance_chimenea = dr["cod_avance_chimenea"] != DBNull.Value ? dr["cod_avance_chimenea"].ToString().Trim() : string.Empty,
        //                        cod_desquinche_perforacion = dr["cod_desquinche_perforacion"] != DBNull.Value ? dr["cod_desquinche_perforacion"].ToString().Trim() : string.Empty
        //                    };

        //                    listaPartidas.Add(partida);
        //                }
        //            }
        //        }
        //    }

        //    return listaPartidas;
        //}
        public async Task<List<PartidaPuListarDto>> ListarPartidasPuAsync(EntradaPartidasPuDto request)
        {
            var lista = new List<PartidaPuListarDto>();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_LISTAR_PARTIDAS_PU", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros de entrada obligatorios
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = request.cod_empresa;
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = request.cod_empresa_unidad;
                    cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 8).Value = request.cod_contrato;

                    await cn.OpenAsync();

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            var dto = new PartidaPuListarDto
                            {
                                cod_empresa = dr["cod_empresa"].ToString()!,
                                cod_empresa_unidad = dr["cod_empresa_unidad"].ToString()!,
                                cod_contrato = dr["cod_contrato"].ToString()!,
                                cod_catalogo_tarea = dr["cod_catalogo_tarea"].ToString()!,
                                cod_actividad = dr["cod_actividad"].ToString()!,
                                nro_partida = dr["nro_partida"].ToString()!,
                                des_catalogo_tarea = dr["des_catalogo_tarea"].ToString()!,
                                des_tabladet_abrev = dr["des_tabladet_abrev"].ToString()!,

                                imp_costo_directo = dr["imp_costo_directo"] != DBNull.Value ? Convert.ToDecimal(dr["imp_costo_directo"]) : null,
                                imp_gastos_parametros = dr["imp_gastos_parametros"] != DBNull.Value ? Convert.ToDecimal(dr["imp_gastos_parametros"]) : null,
                                imp_costo_partida = dr["imp_costo_partida"] != DBNull.Value ? Convert.ToDecimal(dr["imp_costo_partida"]) : null,
                                imp_costo_partida_dolar = dr["imp_costo_partida_dolar"] != DBNull.Value ? Convert.ToDecimal(dr["imp_costo_partida_dolar"]) : null,

                                flg_vigente = dr["flg_vigente"].ToString()!,
                                cod_tabla_unimed = dr["cod_tabla_unimed"] != DBNull.Value ? dr["cod_tabla_unimed"].ToString() : null,
                                imp_valor_calculo = dr["imp_valor_calculo"] != DBNull.Value ? Convert.ToDecimal(dr["imp_valor_calculo"]) : null,
                                cod_item_unimed = dr["cod_item_unimed"] != DBNull.Value ? dr["cod_item_unimed"].ToString() : null,

                                cod_usuario_modi = dr["cod_usuario_modi"] != DBNull.Value ? dr["cod_usuario_modi"].ToString() : null,
                                fec_usuario_creo = dr["fec_usuario_creo"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_creo"]) : null,
                                fec_usuario_modi = dr["fec_usuario_modi"] != DBNull.Value ? Convert.ToDateTime(dr["fec_usuario_modi"]) : null,
                                cod_usuario_creo = dr["cod_usuario_creo"] != DBNull.Value ? dr["cod_usuario_creo"].ToString() : null,

                                // Campos cruzados por JOINS
                                tipo_cambio = dr["tipo_cambio"] != DBNull.Value ? Convert.ToDecimal(dr["tipo_cambio"]) : null,
                                altura_labor = dr["altura_labor"] != DBNull.Value ? Convert.ToDecimal(dr["altura_labor"]) : null,
                                ancho_labor = dr["ancho_labor"] != DBNull.Value ? Convert.ToDecimal(dr["ancho_labor"]) : null,
                                equipo = dr["equipo"] != DBNull.Value ? dr["equipo"].ToString() : null,

                                ind_tipo_tarea = dr["ind_tipo_tarea"] != DBNull.Value ? dr["ind_tipo_tarea"].ToString() : null,
                                codigo_precio = dr["codigo_precio"].ToString()!,
                                um_pago = dr["um_pago"] != DBNull.Value ? dr["um_pago"].ToString() : null,

                                ind_estado = dr["ind_estado"].ToString()!,
                                ind_situacion = dr["ind_situacion"].ToString()!,
                                ind_zona = dr["ind_zona"].ToString()!,
                                cod_metexp = dr["cod_metexp"] != DBNull.Value ? dr["cod_metexp"].ToString() : null,

                                nro_anchopago_1 = dr["nro_anchopago_1"] != DBNull.Value ? Convert.ToDecimal(dr["nro_anchopago_1"]) : null,
                                nro_anchopago_2 = dr["nro_anchopago_2"] != DBNull.Value ? Convert.ToDecimal(dr["nro_anchopago_2"]) : null,

                                cod_seccion_labor = dr["cod_seccion_labor"] != DBNull.Value ? dr["cod_seccion_labor"].ToString() : null,
                                cod_avance_chimenea = dr["cod_avance_chimenea"] != DBNull.Value ? dr["cod_avance_chimenea"].ToString() : null,
                                cod_desquinche_perforacion = dr["cod_desquinche_perforacion"] != DBNull.Value ? dr["cod_desquinche_perforacion"].ToString() : null
                            };

                            lista.Add(dto);
                        }
                    }
                }
            }

            return lista;
        }

        // 🌟 Modificadores 'async' y retorno envuelto en un 'Task'
        public async Task<List<MaeTablaDetalleDto>> ListarTablaDetalleAsync(string cod_empresa, string cod_empresa_unidad)
        {
            var lista = new List<MaeTablaDetalleDto>();

            string query = @"
            SELECT 
                    cod_tabla, 
                    cod_item, 
                    des_tabladet, 
                    flg_vigencia, 
                    des_tabladet_abrev 
                FROM sval_mae_tabla_detalle WITH (NOLOCK)
                WHERE cod_empresa = @cod_empresa 
                  AND cod_empresa_unidad = @cod_empresa_unidad
                  AND des_tabladet IS NOT NULL          
                  AND des_tabladet_abrev IS NOT NULL;";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;

                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = cod_empresa?.Trim();
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = cod_empresa_unidad?.Trim();

                    try
                    {
                        // 🌟 Apertura de conexión asíncrona
                        await connection.OpenAsync();

                        // 🌟 Ejecución del lector de datos asíncrono
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            // 🌟 Recorrido asíncrono de las filas devueltas
                            while (await reader.ReadAsync())
                            {
                                var item = new MaeTablaDetalleDto
                                {
                                    cod_tabla = reader["cod_tabla"].ToString()?.Trim() ?? string.Empty,
                                    cod_item = reader["cod_item"].ToString()?.Trim() ?? string.Empty,
                                    des_tabladet = reader["des_tabladet"].ToString()?.Trim() ?? string.Empty,
                                    flg_vigencia = reader["flg_vigencia"].ToString()?.Trim() ?? string.Empty,
                                    des_tabladet_abrev = reader["des_tabladet_abrev"].ToString()?.Trim() ?? string.Empty
                                };

                                lista.Add(item);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Error al consultar el maestro de tabla detalle de forma asíncrona: " + ex.Message, ex);
                    }
                }
            }

            return lista;
        }

        public async Task<List<RespuestaSpDto>> EjecutarInsercionPartidasMasivaAsync(List<PartidaPuInsertDto> listaDto)
        {
            var respuestas = new List<RespuestaSpDto>();
            if (listaDto == null || listaDto.Count == 0) return respuestas;

            // Tomamos la primera fila como referencia para calcular el punto de partida del correlativo
            var primero = listaDto[0];

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                // 1. Obtenemos el último nro_partida guardado en frío en la BD
                int ultimoCorrelativo = 0;
                string queryMax = @"SELECT ISNULL(MAX(CAST(TRY_CAST(nro_partida AS INT) AS INT)), 0) 
                            FROM [dbo].[sval_det_partida_pu] WITH (NOLOCK)";

                using (SqlCommand cmdMax = new SqlCommand(queryMax, cn))
                {
                    ultimoCorrelativo = Convert.ToInt32(await cmdMax.ExecuteScalarAsync());
                }

                // 2. Iniciamos la transacción masiva desde C#
                using (SqlTransaction transaccion = cn.BeginTransaction())
                {
                    try
                    {
                        // Reutilizamos la instancia del comando para optimizar memoria del servidor
                        using (SqlCommand cmd = new SqlCommand("SP_INSERTAR_PARTIDA_PU", cn, transaccion))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            foreach (var dto in listaDto)
                            {
                                // Limpiamos parámetros de la iteración anterior para evitar duplicación de propiedades
                                cmd.Parameters.Clear();

                                // Incrementar el contador local en memoria viva (1, 2, 3...)
                                ultimoCorrelativo++;

                                // Pasamos el correlativo controlado que muta limpiamente en C#
                                cmd.Parameters.Add("@nro_partida", SqlDbType.VarChar, 10).Value = ultimoCorrelativo.ToString();

                                // Mapeo de Parámetros Estructurales y de Negocio
                                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = dto.cod_empresa;
                                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = dto.cod_empresa_unidad;
                                cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 8).Value = dto.cod_contrato;
                                cmd.Parameters.Add("@cod_catalogo_tarea", SqlDbType.VarChar, 3).Value = dto.cod_catalogo_tarea;
                                cmd.Parameters.Add("@cod_actividad", SqlDbType.VarChar, 3).Value = dto.cod_actividad;

                                cmd.Parameters.Add("@cod_tabla_unimed", SqlDbType.VarChar, 3).Value = string.IsNullOrEmpty(dto.cod_tabla_unimed) ? DBNull.Value : dto.cod_tabla_unimed;
                                cmd.Parameters.Add("@cod_item_unimed", SqlDbType.VarChar, 3).Value = string.IsNullOrEmpty(dto.cod_item_unimed) ? DBNull.Value : dto.cod_item_unimed;
                                cmd.Parameters.Add("@cod_desquinche_perforacion", SqlDbType.VarChar, 3).Value = string.IsNullOrEmpty(dto.cod_desquinche_perforacion) ? DBNull.Value : dto.cod_desquinche_perforacion;
                                cmd.Parameters.Add("@des_catalogo_tarea", SqlDbType.VarChar, 160).Value = dto.des_catalogo_tarea;

                                // Mapeo seguro de Importes Monetarios y Medidas Decimales
                                cmd.Parameters.Add("@imp_valor_calculo", SqlDbType.Decimal).Value = dto.imp_valor_calculo ?? (object)DBNull.Value;
                                cmd.Parameters.Add("@imp_costo_directo", SqlDbType.Decimal).Value = dto.imp_costo_directo ?? (object)DBNull.Value;
                                cmd.Parameters.Add("@imp_gastos_parametros", SqlDbType.Decimal).Value = dto.imp_gastos_parametros ?? (object)DBNull.Value;
                                cmd.Parameters.Add("@imp_costo_partida", SqlDbType.Decimal).Value = dto.imp_costo_partida ?? (object)DBNull.Value;
                                cmd.Parameters.Add("@imp_costo_partida_dolar", SqlDbType.Decimal).Value = dto.imp_costo_partida_dolar ?? (object)DBNull.Value;

                                // Atributos de Geomecánica y Operaciones
                                cmd.Parameters.Add("@ind_tipo_tarea", SqlDbType.VarChar, 1).Value = string.IsNullOrEmpty(dto.ind_tipo_tarea) ? DBNull.Value : dto.ind_tipo_tarea;
                                cmd.Parameters.Add("@des_observacion", SqlDbType.VarChar, 250).Value = string.IsNullOrEmpty(dto.des_observacion) ? DBNull.Value : dto.des_observacion;
                                cmd.Parameters.Add("@cod_metexp", SqlDbType.VarChar, 3).Value = string.IsNullOrEmpty(dto.cod_metexp) ? DBNull.Value : dto.cod_metexp;
                                cmd.Parameters.Add("@nro_anchopago_1", SqlDbType.Decimal).Value = dto.nro_anchopago_1 ?? (object)DBNull.Value;
                                cmd.Parameters.Add("@nro_anchopago_2", SqlDbType.Decimal).Value = dto.nro_anchopago_2 ?? (object)DBNull.Value;
                                cmd.Parameters.Add("@cod_seccion_labor", SqlDbType.VarChar, 3).Value = string.IsNullOrEmpty(dto.cod_seccion_labor) ? DBNull.Value : dto.cod_seccion_labor;
                                cmd.Parameters.Add("@cod_avance_chimenea", SqlDbType.VarChar, 3).Value = string.IsNullOrEmpty(dto.cod_avance_chimenea) ? DBNull.Value : dto.cod_avance_chimenea;

                                // Flags de Control de Estado de Fila
                                cmd.Parameters.Add("@ind_estado", SqlDbType.VarChar, 1).Value = dto.ind_estado;
                                cmd.Parameters.Add("@ind_situacion", SqlDbType.VarChar, 1).Value = dto.ind_situacion;
                                cmd.Parameters.Add("@ind_zona", SqlDbType.VarChar, 1).Value = dto.ind_zona;
                                cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = string.IsNullOrEmpty(dto.cod_zona) ? DBNull.Value : dto.cod_zona;
                                cmd.Parameters.Add("@flg_vigente", SqlDbType.VarChar, 1).Value = dto.flg_vigente;

                                // Auditoría de Tiempos y Cuentas de Usuario
                                cmd.Parameters.Add("@cod_usuario_creo", SqlDbType.VarChar, 20).Value = string.IsNullOrEmpty(dto.cod_usuario_creo) ? DBNull.Value : dto.cod_usuario_creo;
                                cmd.Parameters.Add("@fec_usuario_creo", SqlDbType.DateTime).Value = dto.fec_usuario_creo ?? (object)DBNull.Value;
                                cmd.Parameters.Add("@cod_usuario_modi", SqlDbType.VarChar, 20).Value = string.IsNullOrEmpty(dto.cod_usuario_modi) ? DBNull.Value : dto.cod_usuario_modi;
                                cmd.Parameters.Add("@fec_usuario_modi", SqlDbType.DateTime).Value = dto.fec_usuario_modi ?? (object)DBNull.Value;

                                // Ejecutamos y leemos la respuesta del SP usando una variable local limpia
                                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                                {
                                    if (await dr.ReadAsync())
                                    {
                                        var respuesta = new RespuestaSpDto
                                        {
                                            cod_error = Convert.ToInt32(dr["cod_error"]),
                                            des_mensaje = dr["des_mensaje"].ToString() ?? string.Empty,
                                            id_generado = dr["id_generado"] != DBNull.Value ? dr["id_generado"].ToString() : null
                                        };

                                        respuestas.Add(respuesta);

                                        // Si el SP falla en alguna validación de negocio (ej: RAISERROR interno), deshacemos todo de golpe
                                        if (respuesta.cod_error != 0)
                                        {
                                            transaccion.Rollback();
                                            return respuestas;
                                        }
                                    }
                                }
                            }
                        }

                        // Confirmamos permanentemente los cambios si todas las vueltas del foreach fueron exitosas (cod_error == 0)
                        transaccion.Commit();
                    }
                    catch (Exception)
                    {
                        transaccion.Rollback();
                        throw;
                    }
                }
            }
            return respuestas;
        }

        public async Task<EliminarRespuestaDto> EliminarPartidaPuAsync(EntradaEliminarPrecioUnitario entrada)
        {
            var respuesta = new EliminarRespuestaDto();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_ELIMINAR_PARTIDA_PU", connection))
                {
                    // Especificamos que es un Procedimiento Almacenado
                    command.CommandType = CommandType.StoredProcedure;

                    // 1. Parámetros de Entrada (Input)
                    //command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = entrada.cod_empreesa?.Trim();
                    //command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = entrada.cod_empreesa_unidad?.Trim();
                    //command.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = entrada.cod_contrato?.Trim();
                    //command.Parameters.Add("@cod_catalogo_tarea", SqlDbType.VarChar, 10).Value = entrada.cod_catalogo_tarea?.Trim();
                    //command.Parameters.Add("@cod_actividad", SqlDbType.VarChar, 10).Value = entrada.cod_actividad?.Trim();
                    command.Parameters.Add("@nro_partida", SqlDbType.VarChar, 10).Value = entrada.nro_partida;

                    // 2. Parámetros de Salida (Output)
                    SqlParameter paramStatus = new SqlParameter("@estado", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    SqlParameter paramMessage = new SqlParameter("@mensaje", SqlDbType.VarChar, 250)
                    {
                        Direction = ParameterDirection.Output
                    };

                    command.Parameters.Add(paramStatus);
                    command.Parameters.Add(paramMessage);

                    try
                    {
                        await connection.OpenAsync();

                        // Ejecutamos el SP de forma asíncrona
                        await command.ExecuteNonQueryAsync();

                        // 3. Recuperamos los valores de salida después de la ejecución
                        respuesta.estado = paramStatus.Value != DBNull.Value ? Convert.ToInt32(paramStatus.Value) : 0;
                        respuesta.mensaje = paramMessage.Value != DBNull.Value ? paramMessage.Value.ToString()! : string.Empty;
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Error crítico al ejecutar el SP de eliminación: " + ex.Message, ex);
                    }
                }
            }

            return respuesta;
        }





        public async Task<DetallePuResultado> ObtenerDetalleAsync(EntradaPartidaPuDto entrada) // Cambiado a int para mantener la consistencia con la base de datos
        {
            var resultado = new DetallePuResultado
            {
                costoPartida = new List<DetPartidaCostosPuDto>(),
                parametrosPrincipales = new List<DetParametrosPartidaPuDto>(),
                subParametros = new List<DetSubpartidasPuDto>()
            };

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("SP_DETALLE_PRECIO_UNITARIO_CAB_TAB", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = 60;

                // Parámetros con tipos de datos correctos y limpios
                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = entrada.cod_empresa?.Trim();
                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = entrada.cod_empresa_unidad?.Trim();
                cmd.Parameters.Add("@cod_contrato", SqlDbType.VarChar, 20).Value = entrada.cod_contrato?.Trim();
                cmd.Parameters.Add("@cod_actividad", SqlDbType.VarChar, 10).Value = entrada.cod_actividad?.Trim();
                cmd.Parameters.Add("@cod_catalogo_tarea", SqlDbType.VarChar, 10).Value = entrada.cod_catologo_tarea?.Trim();
                cmd.Parameters.Add("@nro_partida", SqlDbType.VarChar, 10).Value = entrada.nro_partida;

                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    // ─── RS1: CABECERA ───────────────────────────────────
                    if (await reader.ReadAsync())
                    {
                        resultado.cabecera = MapearCabecera(reader);
                    }

                    // ─── RS2: COSTO PARTIDA ──────────────────────────────
                    if (await reader.NextResultAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            resultado.costoPartida.Add(MapearCostoPartida(reader));
                        }
                    }

                    // ─── RS3: PARAMETROS PRINCIPALES ────────────────────
                    if (await reader.NextResultAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            resultado.parametrosPrincipales.Add(MapearParametrosPrincipales(reader));
                        }
                    }

                    // ─── RS4: SUB PARAMETROS ─────────────────────────────
                    if (await reader.NextResultAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            resultado.subParametros.Add(MapearSubParametros(reader));
                        }
                    }
                }
            }

            return resultado;
        }

        public async Task<List<ZonaPuDto>> ObtenerZonasAsync()
        {
            var listaZonas = new List<ZonaPuDto>();

            const string query = @"
            SELECT cod_empresa,   
                   cod_empresa_unidad,   
                   cod_zona,   
                   des_zona,   
                   obs_zona,   
                   nro_den  
              FROM mae_zona  
             WHERE cod_empresa = @cod_empresa 
               AND cod_empresa_unidad = @cod_empresa_unidad";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;

                    // Definición explícita de parámetros para seguridad y rendimiento
                    command.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 10).Value = "03" ?? (object)DBNull.Value;
                    command.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 10).Value = "01" ?? (object)DBNull.Value;

                    try
                    {
                        // Apertura asíncrona de la conexión
                        await connection.OpenAsync();

                        // Ejecución asíncrona del Reader
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            // Recorrido asíncrono fila por fila
                            while (await reader.ReadAsync())
                            {
                                var zona = new ZonaPuDto
                                {
                                    cod_empresa = reader["cod_empresa"].ToString() ?? string.Empty,
                                    cod_empresa_unidad = reader["cod_empresa_unidad"].ToString() ?? string.Empty,
                                    cod_zona = reader["cod_zona"].ToString() ?? string.Empty,
                                    des_zona = reader["des_zona"].ToString() ?? string.Empty,

                                    // Control seguro de nulos
                                    obs_zona = reader["obs_zona"] != DBNull.Value ? reader["obs_zona"].ToString() : null,
                                    nro_den = reader["nro_den"] != DBNull.Value ? Convert.ToDecimal(reader["nro_den"]) : null
                                };

                                listaZonas.Add(zona);
                            }
                        }
                    }
                    catch (SqlException ex)
                    {
                        // Manejo o burbujeo del error de base de datos
                        Console.WriteLine($"Error asíncrono en BD: {ex.Message}");
                        throw;
                    }
                }
            }

            return listaZonas;
        }

        public List<ParametrosContratoDto> ListarParametrosPorAnexo()
        {
            var lista = new List<ParametrosContratoDto>();

            string query = @"
            SELECT cod_parametro_contrato,   
                   des_parametro_contrato,   
                   nro_orden,   
                   cod_operador,   
                   cod_valor,   
                   cod_anexo,   
                   des_observacion,   
                   ind_obligatorio,   
                   flg_vigente,
                   'N' AS c_fl
              FROM sval_mae_parametros_contrato   
             WHERE cod_empresa = @cod_empresa 
               AND cod_empresa_unidad = @cod_unidad 
               AND cod_anexo = '002'";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.CommandType = CommandType.Text;
                    command.Parameters.AddWithValue("@cod_empresa", "03" ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@cod_unidad", "01" ?? (object)DBNull.Value);

                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lista.Add(new ParametrosContratoDto
                            {
                                cod_parametro_contrato = reader["cod_parametro_contrato"]?.ToString() ?? string.Empty,
                                des_parametro_contrato = reader["des_parametro_contrato"]?.ToString() ?? string.Empty,
                                nro_orden = reader["nro_orden"] != DBNull.Value ? Convert.ToInt32(reader["nro_orden"]) : 0,
                                cod_operador = reader["cod_operador"]?.ToString() ?? string.Empty,
                                cod_valor = reader["cod_valor"]?.ToString() ?? string.Empty,
                                cod_anexo = reader["cod_anexo"]?.ToString() ?? string.Empty,
                                des_observacion = reader["des_observacion"]?.ToString() ?? string.Empty,
                                ind_obligatorio = reader["ind_obligatorio"]?.ToString() ?? string.Empty,
                                flg_vigente = reader["flg_vigente"]?.ToString() ?? string.Empty,
                                c_fl = reader["c_fl"]?.ToString() ?? "N"
                            });
                        }
                    }
                }
            }

            return lista;
        }

        public async Task<RespuestaApiDto> EliminarDetallePartidaAsync(EliminarPartidaDto entrada)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("SP_ELIMINAR_DET_PARTIDA_COSTO_PU", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Parámetros de entrada
                    command.Parameters.AddWithValue("@cod_empresa", entrada.cod_empresa);
                    command.Parameters.AddWithValue("@cod_empresa_unidad", entrada.cod_empresa_unidad);
                    command.Parameters.AddWithValue("@cod_contrato", entrada.cod_contrato);
                    command.Parameters.AddWithValue("@cod_catalogo_tarea", entrada.cod_catalogo_tarea);
                    command.Parameters.AddWithValue("@cod_actividad", entrada.cod_actividad);
                    command.Parameters.AddWithValue("@nro_partida", entrada.nro_partida);
                    command.Parameters.AddWithValue("@cod_parametro_contrato", entrada.cod_parametro_contrato);

                    // Parámetros de salida
                    var paramEstado = new SqlParameter("@estado", SqlDbType.Int) { Direction = ParameterDirection.Output };
                    var paramMensaje = new SqlParameter("@mensaje", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };

                    command.Parameters.Add(paramEstado);
                    command.Parameters.Add(paramMensaje);

                    await connection.OpenAsync();
                    await command.ExecuteNonQueryAsync();

                    // Mapeo del resultado a tu DTO de salida
                    return new RespuestaApiDto
                    {
                        estado = (int)paramEstado.Value,
                        mensaje = paramMensaje.Value?.ToString() ?? string.Empty
                    };
                }
            }
        }

        /// <summary>
        ///  GUADRDANDO DATOS
        /// </summary>
        /// <param name="PartidaPUDto"></param>
        /// <returns></returns>
        public async Task<ResultadoDatosDto> GuardarPartidaAsync(PartidaPUDto dto)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction(); // 👈 todo o nada

            try
            {
                // 1. Tabla principal
                using (var cmd = new SqlCommand("SP_GUARDAR_PARTIDA_DETALLE_PU", connection, transaction))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);
                    cmd.Parameters.AddWithValue("@nro_partida", dto.nro_partida);
                    cmd.Parameters.AddWithValue("@cod_catalogo_tarea", dto.cod_catalogo_tarea);
                    cmd.Parameters.AddWithValue("@cod_actividad", dto.cod_actividad);
                    cmd.Parameters.AddWithValue("@des_catalogo_tarea", dto.des_catalogo_tarea);
                    cmd.Parameters.AddWithValue("@imp_costo_directo", dto.imp_costo_directo);
                    cmd.Parameters.AddWithValue("@imp_costo_partida", dto.imp_costo_partida);
                    cmd.Parameters.AddWithValue("@imp_costo_partida_dolar", dto.imp_costo_partida_dolar);
                    cmd.Parameters.AddWithValue("@des_observacion", dto.des_observacion ?? "");
                    cmd.Parameters.AddWithValue("@ind_situacion", dto.ind_situacion);
                    cmd.Parameters.AddWithValue("@ind_zona", dto.ind_zona);
                    cmd.Parameters.AddWithValue("@ind_estado", dto.ind_estado);
                    cmd.Parameters.AddWithValue("@cod_zona", dto.cod_zona ?? "");
                    cmd.Parameters.AddWithValue("@cod_usuario", dto.cod_usuario);
                    await cmd.ExecuteNonQueryAsync();
                }

                // 2. Costos partida
                foreach (var costo in dto.costoPartida ?? [])
                {
                    using var cmd = new SqlCommand("SP_GUARDAR_COSTO_PARTIDA_PU", connection, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@accion", costo.accion);
                    cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);
                    cmd.Parameters.AddWithValue("@cod_catalogo_tarea", dto.cod_catalogo_tarea);
                    cmd.Parameters.AddWithValue("@cod_actividad", dto.cod_actividad);
                    cmd.Parameters.AddWithValue("@nro_partida", dto.nro_partida);
                    cmd.Parameters.AddWithValue("@cod_parametro_contrato", costo.cod_parametro_contrato);
                    cmd.Parameters.AddWithValue("@nro_trabajador", (object?)costo.nro_trabajador ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@nro_hotras_labor", (object?)costo.nro_hotras_labor ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@imp_tipo_cambio", (object?)costo.imp_tipo_cambio ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@imp_precio_soles", (object?)costo.imp_precio_soles ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@imp_precio_dolar", (object?)costo.imp_precio_soles ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@cod_usuario", dto.cod_usuario);
                    await cmd.ExecuteNonQueryAsync();
                }

                // 3. Parametros principales
                foreach (var param in dto.parametroPrincipal ?? [])
                {
                    using var cmd = new SqlCommand("SP_GUARDAR_PARAMETRO_PU", connection, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@accion", param.accion);
                    cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);
                    cmd.Parameters.AddWithValue("@cod_catalogo_tarea", dto.cod_catalogo_tarea);
                    cmd.Parameters.AddWithValue("@cod_actividad", dto.cod_actividad);
                    cmd.Parameters.AddWithValue("@nro_partida", dto.nro_partida);
                    cmd.Parameters.AddWithValue("@cod_parametro_tarea", param.cod_parametro_tarea);
                    cmd.Parameters.AddWithValue("@cod_item_unimed", param.cod_item_unimed);
                    cmd.Parameters.AddWithValue("@cod_item_um_calculo", param.cod_item_um_calculo);
                    cmd.Parameters.AddWithValue("@des_valor_1", param.des_valor_1 ?? "");
                    cmd.Parameters.AddWithValue("@des_valor_2", param.des_valor_2 ?? "");
                    cmd.Parameters.AddWithValue("@des_valor_3", param.des_valor_3 ?? "");
                    cmd.Parameters.AddWithValue("@nro_valor_1", (object?)param.nro_valor_1 ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@nro_valor_calculo", (object?)param.nro_valor_calculo ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@cod_usuario", dto.cod_usuario);
                    await cmd.ExecuteNonQueryAsync();
                }

                // 4. Subpartidas
                foreach (var sub in dto.subParametros ?? [])
                {
                    using var cmd = new SqlCommand("SP_GUARDAR_SUBPARTIDA_PU", connection, transaction);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@accion", sub.accion);
                    cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@cod_contrato", dto.cod_contrato);
                    cmd.Parameters.AddWithValue("@cod_catalogo_tarea", dto.cod_catalogo_tarea);
                    cmd.Parameters.AddWithValue("@cod_actividad", dto.cod_actividad);
                    cmd.Parameters.AddWithValue("@nro_partida", dto.nro_partida);
                    cmd.Parameters.AddWithValue("@cod_subpartida", sub.cod_subpartida);
                    cmd.Parameters.AddWithValue("@cod_concepto", sub.cod_concepto);
                    cmd.Parameters.AddWithValue("@cod_item_unimed", sub.cod_item_unimed);
                    cmd.Parameters.AddWithValue("@des_observacion", sub.des_observacion ?? "");
                    cmd.Parameters.AddWithValue("@imp_precio_soles", (object?)sub.imp_precio_soles ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@nro_cantidad", (object?)sub.nro_cantidad ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@imp_subtotal", (object?)sub.imp_subtotal ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@cod_usuario", dto.cod_usuario);
                    await cmd.ExecuteNonQueryAsync();
                }

                transaction.Commit(); // 👈 confirma todo

                return new ResultadoDatosDto { estado = 1, mensaje = "Partida guardada correctamente" };

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return new ResultadoDatosDto { estado = 0, mensaje = ex.Message };
            }
        }




        // ─────────────────────────────────────────────────────────────
        // MAPEOS
        // ─────────────────────────────────────────────────────────────



        private DetPartidaPuCabeceraDto MapearCabecera(SqlDataReader r)
        {
            return new DetPartidaPuCabeceraDto
            {
                cod_empresa = GetString(r, "cod_empresa"),
                cod_empresa_unidad = GetString(r, "cod_empresa_unidad"),
                cod_contrato = GetString(r, "cod_contrato"),
                cod_catalogo_tarea = GetString(r, "cod_catalogo_tarea"),
                cod_actividad = GetString(r, "cod_actividad"),
                cod_tabla_unimed = GetString(r, "cod_tabla_unimed"),
                cod_item_unimed = GetString(r, "cod_item_unimed"),
                nro_partida = Convert.ToInt32(r["nro_partida"]), // Mapeado como int nativo
                des_catalogo_tarea = GetString(r, "des_catalogo_tarea"),
                imp_costo_directo = GetDecimal(r, "imp_costo_directo"),
                imp_gastos_parametros = GetDecimal(r, "imp_gastos_parametros"),
                imp_costo_partida = GetDecimal(r, "imp_costo_partida"),
                imp_costo_partida_dolar = GetDecimal(r, "imp_costo_partida_dolar"),
                flg_vigente = GetString(r, "flg_vigente"),
                cod_usuario_creo = GetString(r, "cod_usuario_creo"),
                des_observacion = GetString(r, "des_observacion"),
                fec_usuario_creo = GetDateTime(r, "fec_usuario_creo"),
                cod_usuario_modi = GetString(r, "cod_usuario_modi"),
                fec_usuario_modi = GetDateTime(r, "fec_usuario_modi"),
                imp_valor_calculo = GetDecimal(r, "imp_valor_calculo"),
                ind_estado = GetString(r, "ind_estado"),
                ind_situacion = GetString(r, "ind_situacion"),
                ind_zona = GetString(r, "ind_zona"),
                cod_zona = GetString(r, "cod_zona"),
                cod_metexp = GetString(r, "cod_metexp"),
                nro_anchopago_1 = GetDecimal(r, "nro_anchopago_1"),
                nro_anchopago_2 = GetDecimal(r, "nro_anchopago_2"),
                cod_seccion_labor = GetString(r, "cod_seccion_labor"),
                cod_avance_chimenea = r["cod_avance_chimenea"] != DBNull.Value ? Convert.ToInt32(r["cod_avance_chimenea"]) : null, // Mapeado como int?
                cod_desquinche_perforacion = GetString(r, "cod_desquinche_perforacion"),
                c_t_actividad = GetString(r, "c_t_actividad"),
                c_t_unidad_medida = GetString(r, "c_t_unidad_medida")
            };
        }

        private DetPartidaCostosPuDto MapearCostoPartida(SqlDataReader r)
        {
            return new DetPartidaCostosPuDto
            {
                cod_empresa = GetString(r, "cod_empresa"),
                cod_empresa_unidad = GetString(r, "cod_empresa_unidad"),
                cod_contrato = GetString(r, "cod_contrato"),
                cod_catalogo_tarea = GetString(r, "cod_catalogo_tarea"),
                cod_actividad = GetString(r, "cod_actividad"),
                nro_partida = Convert.ToInt32(r["nro_partida"]), // Mapeado como int nativo
                cod_parametro_contrato = GetString(r, "cod_parametro_contrato"),
                nro_trabajador = GetDecimal(r, "nro_trabajador"),
                nro_hotras_labor = GetDecimal(r, "nro_hotras_labor"),
                imp_tipo_cambio = GetDecimal(r, "imp_tipo_cambio"),
                imp_precio_soles = GetDecimal(r, "imp_precio_soles"),
                cod_usuario_creo = GetString(r, "cod_usuario_creo"),
                fec_usuario_creo = GetDateTime(r, "fec_usuario_creo"),
                cod_usuario_modi = GetString(r, "cod_usuario_modi"),
                fec_usuario_modi = GetDateTime(r, "fec_usuario_modi"),
                um_pago = GetString(r, "um_pago"),
                c_t_parametro = GetString(r, "c_t_parametro"),
                c_n_valor = GetString(r, "c_n_valor"),
                c_n_porcentaje = GetDecimal(r, "c_n_porcentaje"),
                c_n_monto = GetDecimal(r, "c_n_monto"),
                imp_costo_directo = GetDecimal(r, "imp_costo_directo")
            };
        }

        private DetParametrosPartidaPuDto MapearParametrosPrincipales(SqlDataReader r)
        {
            return new DetParametrosPartidaPuDto
            {
                cod_empresa = GetString(r, "cod_empresa"),
                cod_empresa_unidad = GetString(r, "cod_empresa_unidad"),
                cod_contrato = GetString(r, "cod_contrato"),
                cod_catalogo_tarea = GetString(r, "cod_catalogo_tarea"),
                cod_actividad = GetString(r, "cod_actividad"),
                nro_partida = Convert.ToInt32(r["nro_partida"]), // Mapeado como int nativo
                cod_parametro_tarea = GetString(r, "cod_parametro_tarea"),
                cod_tabla_unimed = GetString(r, "cod_tabla_unimed"),
                cod_item_unimed = GetString(r, "cod_item_unimed"),
                cod_tabla_um_calculo = GetString(r, "cod_tabla_um_calculo"),
                cod_item_um_calculo = GetString(r, "cod_item_um_calculo"),
                des_valor_1 = GetString(r, "des_valor_1"),
                des_valor_2 = GetString(r, "des_valor_2"),
                des_valor_3 = GetString(r, "des_valor_3"),
                nro_valor_1 = GetDecimal(r, "nro_valor_1"),
                nro_valor_calculo = GetDecimal(r, "nro_valor_calculo"),
                flg_vigente = GetString(r, "flg_vigente"),
                cod_usuario_creo = GetString(r, "cod_usuario_creo"),
                fec_usuario_creo = GetDateTime(r, "fec_usuario_creo"),
                cod_usuario_modi = GetString(r, "cod_usuario_modi"),
                fec_usuario_modi = GetDateTime(r, "fec_usuario_modi"),
                c_t_parametro = GetString(r, "c_t_parametro"),
                c_t_equipo = GetString(r, "c_t_equipo"),
                c_n_valor_1 = GetString(r, "c_n_valor_1")
            };
        }

        private DetSubpartidasPuDto MapearSubParametros(SqlDataReader r)
        {
            return new DetSubpartidasPuDto
            {
                cod_empresa = GetString(r, "cod_empresa"),
                cod_empresa_unidad = GetString(r, "cod_empresa_unidad"),
                cod_contrato = GetString(r, "cod_contrato"),
                cod_catalogo_tarea = GetString(r, "cod_catalogo_tarea"),
                cod_actividad = GetString(r, "cod_actividad"),
                nro_partida = Convert.ToInt32(r["nro_partida"]), // Mapeado como int nativo
                cod_subpartida = GetString(r, "cod_subpartida"),
                cod_concepto = GetString(r, "cod_concepto"),
                cod_tabla_unimed = GetString(r, "cod_tabla_unimed"),
                cod_item_unimed = GetString(r, "cod_item_unimed"),
                des_observacion = GetString(r, "des_observacion"),
                imp_calculo = GetDecimal(r, "imp_calculo"),
                imp_precio_soles = GetDecimal(r, "imp_precio_soles"),
                nro_cantidad = GetDecimal(r, "nro_cantidad"),
                imp_subtotal = GetDecimal(r, "imp_subtotal"),
                flg_vigente = GetString(r, "flg_vigente"),
                cod_usuario_creo = GetString(r, "cod_usuario_creo"),
                fec_usuario_creo = GetDateTime(r, "fec_usuario_creo"),
                cod_usuario_modi = GetString(r, "cod_usuario_modi"),
                fec_usuario_modi = GetDateTime(r, "fec_usuario_modi"),
                um_pago = GetString(r, "um_pago"),
                c_t_subpartida = GetString(r, "c_t_subpartida"),
                c_t_cargo = GetString(r, "c_t_cargo"),
                c_t_implemto_seg = GetString(r, "c_t_implemto_seg"),
                c_t_material = GetString(r, "c_t_material"),
                c_t_explosivos = GetString(r, "c_t_explosivos"),
                c_t_equipo = GetString(r, "c_t_equipo")
            };
        }

        // ─────────────────────────────────────────────────────────────
        // HELPERS para null-safe
        // ─────────────────────────────────────────────────────────────

        private string GetString(SqlDataReader r, string col)
            => r[col] == DBNull.Value ? null : r[col].ToString().Trim();

        private decimal? GetDecimal(SqlDataReader r, string col)
            => r[col] == DBNull.Value ? (decimal?)null : Convert.ToDecimal(r[col]);

        private DateTime? GetDateTime(SqlDataReader r, string col)
            => r[col] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(r[col]);

    }
}


