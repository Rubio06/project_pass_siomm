using ClosedXML.Excel;
using Microsoft.Data.SqlClient;
using pass_siomm_backend.Planeamiento.Data.Dto.PlaneamientoDto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;
using pass_siomm_backend.Rutas.Data;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Reflection.PortableExecutable;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services.ExplotacionService
{
    public class ExplotacionService
    {

        private readonly string _connectionString;


        public ExplotacionService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        string GetString(object value) => value == DBNull.Value ? "" : value.ToString();
        DateTime? GetDato(object value) => value == DBNull.Value ? null : (DateTime?)value;

        public async Task<List<ProgramaExplotacionDto>> ObtenerListaExplotacion(string nro_prog, string cod_fase)
        {
            var lista = new List<ProgramaExplotacionDto>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_PROGRAMA_EXPLOTACION", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                    cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;
                    cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 02).Value = cod_fase;


                    await conn.OpenAsync();

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var item = new ProgramaExplotacionDto
                            {
                                // ================= det_prg (NOT NULL)
                                cod_veta = reader["cod_veta"].ToString(),
                                cod_nivel = reader["cod_nivel"].ToString(),
                                cod_labor = reader["cod_labor"].ToString(),
                                des_labor = reader["des_labor"].ToString(),


                                cod_empresa_unidad = reader["cod_empresa_unidad"].ToString(),
                                nro_prog = reader["nro_prog"].ToString(),
                                cod_und_econom = reader["cod_und_econom"].ToString(),
                                cod_zona = reader["cod_zona"].ToString(),
                                cod_tipo_labor = reader["cod_tipo_labor"].ToString(),
                                cod_ala = reader["cod_ala"].ToString(),
                                cod_fase = reader["cod_fase"].ToString(),

                                nom_veta = reader["nom_veta"].ToString(),
                                //cod_empresa = reader["cod_empresa"].ToString(),

                                // ================= VARCHAR NULL
                                cod_cto = reader["cod_cto"] as string,
                                cod_cta = reader["cod_cta"] as string,
                                ind_tip_roca = reader["ind_tip_roca"] as string,
                                prg_tipace = reader["prg_tipace"] as string,
                                metexp_cod = reader["metexp_cod"] as string,
                                prg_blocks = reader["prg_blocks"] as string,

                                cod_tipo_labor_ant = reader["cod_tipo_labor_ant"] as string,
                                cod_labor_ant = reader["cod_labor_ant"] as string,
                                cod_ala_ant = reader["cod_ala_ant"] as string,
                                ind_tip_roca_piso = reader["ind_tip_roca_piso"] as string,
                                ind_tip_roca_techo = reader["ind_tip_roca_techo"] as string,
                                prg_tramin = reader["prg_tramin"] as string,
                                des_proyecto = reader["des_proyecto"] as string,
                                nom_proyecto = reader["nom_proyecto"] as string,
                                ind_clasificacion_sos = reader["ind_clasificacion_sos"] as string,
                                prg_tramin_prog = reader["prg_tramin_prog"] as string,
                                ind_taladro_largo = reader["ind_taladro_largo"] as string,
                                ind_verificacion = reader["ind_verificacion"] as string,
                                val_tipo_fac = reader["val_tipo_fac"] as string,

                                // ================= DECIMAL NULLABLE


                                // ================= DATETIME




                                prg_avamts = reader["prg_avamts"].ToString(),
                                prg_progra = reader["prg_progra"].ToString(),
                                prg_secancho = reader["prg_secancho"].ToString(),
                                prg_secaltu = reader["prg_secaltu"].ToString(),
                                prg_tmsdes = reader["prg_tmsdes"].ToString(),
                                prg_tmsmin = reader["prg_tmsmin"].ToString(),
                                prg_ancmin = reader["prg_ancmin"].ToString(),
                                prg_ancvet = reader["prg_ancvet"].ToString(),
                                prg_loncor = reader["prg_loncor"].ToString(),
                                prg_altcor = reader["prg_altcor"].ToString(),
                                prg_tmsrotvet = reader["prg_tmsrotvet"].ToString(),
                                prg_tmsrotdil = reader["prg_tmsrotdil"].ToString(),
                                prg_tmsextraid = reader["prg_tmsextraid"].ToString(),
                                prg_leyag = reader["prg_leyag"].ToString(),
                                prg_leycu = reader["prg_leycu"].ToString(),
                                prg_leypb = reader["prg_leypb"].ToString(),
                                prg_leyzn = reader["prg_leyzn"].ToString(),
                                prg_leyagdil = reader["prg_leyagdil"].ToString(),
                                prg_leycudil = reader["prg_leycudil"].ToString(),
                                prg_leypbdil = reader["prg_leypbdil"].ToString(),
                                prg_leyzndil = reader["prg_leyzndil"].ToString(),
                                prg_vptdil = reader["prg_vptdil"].ToString(),
                                prg_homlab = reader["prg_homlab"].ToString(),
                                prg_tareas = reader["prg_tareas"].ToString(),
                                prg_nroper = reader["prg_nroper"].ToString(),
                                prg_nrowinche = reader["prg_nrowinche"].ToString(),
                                prg_nropala = reader["prg_nropala"].ToString(),
                                prg_pieper = reader["prg_pieper"].ToString(),
                                prg_brocas = reader["prg_brocas"].ToString(),
                                prg_barcon = reader["prg_barcon"].ToString(),
                                prg_barren = reader["prg_barren"].ToString(),
                                prg_dinami = reader["prg_dinami"].ToString(),
                                prg_fulmin = reader["prg_fulmin"].ToString(),
                                prg_conect = reader["prg_conect"].ToString(),
                                prg_punmar = reader["prg_punmar"].ToString(),
                                prg_tablas = reader["prg_tablas"].ToString(),
                                prg_pernos = reader["prg_pernos"].ToString(),
                                prg_mallas = reader["prg_mallas"].ToString(),
                                prg_cimbras = reader["prg_cimbras"].ToString(),
                                prg_vptmin = reader["prg_vptmin"].ToString(),
                                dist_desde = reader["dist_desde"].ToString(),
                                dist_hasta = reader["dist_hasta"].ToString(),
                                num_buzamiento = reader["num_buzamiento"].ToString(),
                                por_dilucion = reader["por_dilucion"].ToString(),
                                prg_leyau = reader["prg_leyau"].ToString(),
                                prg_leyaudil = reader["prg_leyaudil"].ToString(),
                                prg_num_tramin_prog = reader["prg_num_tramin_prog"].ToString(),
                                prg_num_tramin = reader["prg_num_tramin"].ToString(),
                                prg_ancmin_leyes = reader["prg_ancmin_leyes"].ToString(),
                                num_factor_x = reader["num_factor_x"].ToString(),
                                num_corte = reader["num_corte"].ToString(),
                                num_dis_limpieza = reader["num_dis_limpieza"].ToString(),

                                // DATETIME convertido a string

                                prg_fecmuestreo = reader["prg_fecmuestreo"] as DateTime?,
                                // ================= cab_prg
                                prg_est = reader["prg_est"].ToString(),
                                prg_cutoff = reader["prg_cutoff"].ToString(),
                                ind_calc_dil = reader["ind_calc_dil"].ToString(),

                                // ================= mae_factor
                                fac_vptmin = reader["fac_vptmin"].ToString(),

                                // ================= mae_zona
                                val_vpt = reader["val_vpt"].ToString(),

                                // ================= CAMPOS FIJOS
                                ind_calc_tipo_dil = reader["ind_calc_tipo_dil"].ToString(),
                                ind_tipo_ley = reader["ind_tipo_ley"].ToString(),
                                p_block = reader["p_block"].ToString(),
                                as_add = reader["as_add"].ToString(),
                                p_bloques = reader["p_bloques"].ToString()
                            };

                            lista.Add(item);
                        }
                    }
                }
            }

            return lista;
        }

        //ELIMINAR REGISTRO 

        public async Task<RespuestaDto> EliminarFilaAsync(DetPrgDto input)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand("SP_ELIMINAR_DET_CAB_PRG", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@cod_fase", input.cod_fase);
                cmd.Parameters.AddWithValue("@cod_labor", input.cod_labor);
                cmd.Parameters.AddWithValue("@nro_prog", input.nro_prog);

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new RespuestaDto
                        {
                            estado = Convert.ToInt32(reader["estado"]),
                            mensaje = reader["mensaje"].ToString()
                        };
                    }
                    else
                    {
                        return new RespuestaDto
                        {
                            estado = -1,
                            mensaje = "No se recibió respuesta del procedimiento almacenado."
                        };
                    }
                }
            }
        }

        public async Task<List<IndiceRendimientoDto>> ObtenerIndiceRendimiento(string nro_prog, string cod_fase)
        {
            var lista = new List<IndiceRendimientoDto>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand("SP_EXPLORACION_IND_REND", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
                cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
                cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;
                cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 2).Value = cod_fase;

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var item = new IndiceRendimientoDto
                        {
                            cod_empresa = reader["cod_empresa"]?.ToString(),
                            cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                            nro_prog = reader["nro_prog"]?.ToString(),
                            cod_und_econom = reader["cod_und_econom"]?.ToString(),
                            cod_zona = reader["cod_zona"]?.ToString(),
                            cod_veta = reader["cod_veta"]?.ToString(),
                            cod_nivel = reader["cod_nivel"]?.ToString(),
                            cod_tipo_labor = reader["cod_tipo_labor"]?.ToString(),
                            cod_labor = reader["cod_labor"]?.ToString(),
                            cod_ala = reader["cod_ala"]?.ToString(),
                            cod_fase = reader["cod_fase"]?.ToString(),
                            cod_cto = reader["cod_cto"]?.ToString(),
                            cod_cta = reader["cod_cta"]?.ToString(),
                            ind_tip_roca = reader["ind_tip_roca"]?.ToString(),
                            prg_tipace = reader["prg_tipace"]?.ToString(),
                            prg_blocks = reader["prg_blocks"]?.ToString(),
                            prg_progra = reader["prg_progra"]?.ToString(),
                            cod_tipo_labor_ant = reader["cod_tipo_labor_ant"]?.ToString(),
                            cod_labor_ant = reader["cod_labor_ant"]?.ToString(),
                            cod_ala_ant = reader["cod_ala_ant"]?.ToString(),
                            ind_tip_roca_piso = reader["ind_tip_roca_piso"]?.ToString(),
                            ind_tip_roca_techo = reader["ind_tip_roca_techo"]?.ToString(),
                            prg_tramin = reader["prg_tramin"]?.ToString(),
                            prg_tramin_prog = reader["prg_tramin_prog"]?.ToString(),
                            val_tipo_fac = reader["val_tipo_fac"]?.ToString(),
                            ind_calc_dil = reader["ind_calc_dil"]?.ToString(),
                            ind_clasificacion_sos = reader["ind_clasificacion_sos"]?.ToString(),
                            ind_taladro_largo = reader["ind_taladro_largo"]?.ToString(),
                            ind_verificacion = reader["ind_verificacion"]?.ToString(),
                            prg_est = reader["prg_est"]?.ToString(),
                            des_proyecto = reader["des_proyecto"]?.ToString(),
                            nom_proyecto = reader["nom_proyecto"]?.ToString(),

                            prg_avamts = GetDecimal(reader["prg_avamts"]),
                            prg_secancho = GetDecimal(reader["prg_secancho"]),
                            prg_secaltu = GetDecimal(reader["prg_secaltu"]),
                            prg_tmsdes = GetDecimal(reader["prg_tmsdes"]),
                            prg_tmsmin = GetDecimal(reader["prg_tmsmin"]),
                            prg_ancmin = GetDecimal(reader["prg_ancmin"]),
                            prg_ancvet = GetDecimal(reader["prg_ancvet"]),
                            prg_num_tramin = GetDecimal(reader["prg_num_tramin"]),
                            prg_loncor = GetDecimal(reader["prg_loncor"]),
                            prg_altcor = GetDecimal(reader["prg_altcor"]),
                            prg_tmsrotvet = GetDecimal(reader["prg_tmsrotvet"]),
                            prg_tmsrotdil = GetDecimal(reader["prg_tmsrotdil"]),
                            prg_tmsextraid = GetDecimal(reader["prg_tmsextraid"]),
                            prg_leyag = GetDecimal(reader["prg_leyag"]),
                            prg_leycu = GetDecimal(reader["prg_leycu"]),
                            prg_leypb = GetDecimal(reader["prg_leypb"]),
                            prg_leyzn = GetDecimal(reader["prg_leyzn"]),
                            prg_leyagdil = GetDecimal(reader["prg_leyagdil"]),
                            prg_leycudil = GetDecimal(reader["prg_leycudil"]),
                            prg_leypbdil = GetDecimal(reader["prg_leypbdil"]),
                            prg_leyzndil = GetDecimal(reader["prg_leyzndil"]),
                            prg_vptdil = GetDecimal(reader["prg_vptdil"]),
                            prg_homlab = GetDecimal(reader["prg_homlab"]),
                            prg_tareas = GetDecimal(reader["prg_tareas"]),
                            prg_nroper = GetDecimal(reader["prg_nroper"]),
                            prg_nrowinche = GetDecimal(reader["prg_nrowinche"]),
                            prg_nropala = GetDecimal(reader["prg_nropala"]),
                            prg_pieper = GetDecimal(reader["prg_pieper"]),
                            prg_brocas = GetDecimal(reader["prg_brocas"]),
                            prg_barcon = GetDecimal(reader["prg_barcon"]),
                            prg_barren = GetDecimal(reader["prg_barren"]),
                            prg_dinami = GetDecimal(reader["prg_dinami"]),
                            prg_fulmin = GetDecimal(reader["prg_fulmin"]),
                            prg_conect = GetDecimal(reader["prg_conect"]),
                            prg_punmar = GetDecimal(reader["prg_punmar"]),
                            prg_tablas = GetDecimal(reader["prg_tablas"]),
                            prg_pernos = GetDecimal(reader["prg_pernos"]),
                            prg_mallas = GetDecimal(reader["prg_mallas"]),
                            prg_cimbras = GetDecimal(reader["prg_cimbras"]),
                            prg_vptmin = GetDecimal(reader["prg_vptmin"]),
                            dist_desde = GetDecimal(reader["dist_desde"]),
                            dist_hasta = GetDecimal(reader["dist_hasta"]),
                            num_buzamiento = GetDecimal(reader["num_buzamiento"]),
                            por_dilucion = GetDecimal(reader["por_dilucion"]),
                            prg_leyau = GetDecimal(reader["prg_leyau"]),
                            prg_leyaudil = GetDecimal(reader["prg_leyaudil"]),
                            prg_num_tramin_prog = GetDecimal(reader["prg_num_tramin_prog"]),
                            prg_ancmin_leyes = GetDecimal(reader["prg_ancmin_leyes"]),
                            num_factor_x = GetDecimal(reader["num_factor_x"]),
                            num_corte = GetDecimal(reader["num_corte"]),
                            num_dis_limpieza = GetDecimal(reader["num_dis_limpieza"]),
                            val_vpt = GetDecimal(reader["val_vpt"]),
                            fac_vptmin = GetDecimal(reader["fac_vptmin"]),
                            prg_fecmuestreo = GetDate(reader["prg_fecmuestreo"])
                        };

                        lista.Add(item);
                    }
                }
            }

            return lista;
        }


        private decimal? GetDecimal(object value)
        {
            if (value == DBNull.Value || value == null)
                return null;

            return Convert.ToDecimal(value);
        }

        private DateTime? GetDate(object value)
        {
            if (value == DBNull.Value || value == null)
                return null;

            return Convert.ToDateTime(value);
        }

        public async Task<List<SelectCodCtoDtocs>> CodCto(string anio, string prefijoBusqueda)
        {
            var list = new List<SelectCodCtoDtocs>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_COD_CTO", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = anio;
            cmd.Parameters.Add("@codigo_prefijo", SqlDbType.VarChar, 4).Value = prefijoBusqueda;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new SelectCodCtoDtocs
                {
                    cod_centro_costo = reader["cod_centro_costo"].ToString(),
                    des_centro_costo = reader["des_centro_costo"].ToString()
                };

                list.Add(item);
            }

            return list;
        }

        public async Task<List<SelectCodCtaDtocs>> CodCta(string anio)
        {
            var list = new List<SelectCodCtaDtocs>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_COD_CTA", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = anio;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new SelectCodCtaDtocs
                {
                    cod_cuenta_contable = reader["cod_cuenta_contable"].ToString(),
                    des_cuenta_contable = reader["des_cuenta_contable"].ToString()
                };

                list.Add(item);
            }

            return list;
        }


        public async Task<List<SelectAla>> NomAla()
        {
            var list = new List<SelectAla>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_NOM_ALA", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new SelectAla
                {
                    cod_ala = reader["cod_ala"].ToString(),
                    nom_ala = reader["nom_ala"].ToString()
                };

                list.Add(item);
            }

            return list;
        }

        public async Task<List<CodLaborDto>> BuscarLabor()
        {
            var list = new List<CodLaborDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_BUSCAR_LABOR", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            //cmd.Parameters.AddWithValue("@texto", string.IsNullOrWhiteSpace(texto) ? (object)DBNull.Value : texto);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new CodLaborDto
                {
                    cod_labor = reader["cod_labor"].ToString(),
                    nom_labor = reader["nom_labor"].ToString()
                };

                list.Add(item);
            }

            return list;
        }

        public async Task<List<SelectOperativo>> FactGeneralEzperanza(string cie_ano, string cie_per)
        {
            var list = new List<SelectOperativo>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_COD_OPERATIVO_DETALLE", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 4).Value = cie_ano;
            cmd.Parameters.Add("@cie_per", SqlDbType.VarChar, 2).Value = cie_per;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new SelectOperativo
                {
                    val_tipo_fac = reader["val_tipo_fac"].ToString(),
                    val_des_tipo_fac = reader["val_des_tipo_fac"].ToString()
                };

                list.Add(item);
            }

            return list;
        }


        public async Task<List<InfoProgMensualDto>> InfoProgMensual(string? nro_prog)
        {
            var list = new List<InfoProgMensualDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_INFO_PROG_MENSUAL", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new InfoProgMensualDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    nro_prog = reader["nro_prog"]?.ToString(),
                    cod_und_econom = reader["cod_und_econom"]?.ToString(),
                    cod_zona = reader["cod_zona"]?.ToString(),
                    cod_contrata = reader["cod_contrata"]?.ToString(),
                    des_contrata = reader["des_contrata"]?.ToString(),
                    cie_ano = reader["cie_ano"]?.ToString(),
                    cie_per = reader["cie_per"]?.ToString(),
                    fec_emi = reader["fec_emi"] as DateTime?,
                    prg_est = reader["prg_est"]?.ToString(),
                    cod_usuario_creo = reader["cod_usuario_creo"]?.ToString(),
                    fec_usuario_creo = reader["fec_usuario_creo"] as DateTime?,
                    cod_usuario_modi = reader["cod_usuario_modi"]?.ToString(),
                    fec_usuario_modi = reader["fec_usuario_modi"] as DateTime?,
                    prg_cutoff = reader["prg_cutoff"] != DBNull.Value
                                    ? Convert.ToDecimal(reader["prg_cutoff"])
                                    : null,
                    prg_pre_apr = reader["prg_pre_apr"]?.ToString(),
                    ind_calc_dil = reader["ind_calc_dil"]?.ToString()
                };

                list.Add(item);
            }

            return list;
        }


        public async Task<(List<UndEconomDto>, List<ZonaDto>, List<ContrataDto>)> ObtenerMaestros()
        {
            var listaUndEcon = new List<UndEconomDto>();
            var listaZona = new List<ZonaDto>();
            var listContrata = new List<ContrataDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_SELECTS_INFORMACION", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            // 🔹 Primer resultset (Unidades)
            while (await reader.ReadAsync())
            {
                listaUndEcon.Add(new UndEconomDto
                {
                    cod_und_econom = reader["cod_und_econom"]?.ToString(),
                    nom_und_econom = reader["nom_und_econom"]?.ToString()
                });
            }

            // 🔹 Pasamos al segundo resultset
            await reader.NextResultAsync();

            // 🔹 Segundo resultset (Zonas)
            while (await reader.ReadAsync())
            {
                listaZona.Add(new ZonaDto
                {
                    cod_zona = reader["cod_zona"]?.ToString(),
                    des_zona = reader["des_zona"]?.ToString()
                });
            }

            await reader.NextResultAsync();

            // 🔹 Primer resultset (Contratas)
            while (await reader.ReadAsync())
            {
                listContrata.Add(new ContrataDto
                {
                    cod_contrata = reader["cod_contrata"]?.ToString(),
                    des_contrata = reader["des_contrata"]?.ToString()
                });
            }


            return (listaUndEcon, listaZona, listContrata);
        }


        /* EXPLORACION, DESARROLLO PREPARACION, EXPLOTACION */
        public async Task<List<MaeFaseDto>> MostrarMaeFase()
        {
            var list = new List<MaeFaseDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_MOSTRAR_MAE_FASE", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new MaeFaseDto
                {
                    cod_fase = reader["cod_fase"].ToString().Trim(),
                    nom_fase = reader["nom_fase"].ToString().Trim()
                };

                list.Add(item);
            }

            return list;
        }

        ///MODALS
        public async Task<List<BlockReservasDto>> BlockReservas(string nro_prog)
        {
            var list = new List<BlockReservasDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_OBTENER_DET_PRG_BLOCK", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_unidad_empresa", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new BlockReservasDto
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    nro_prog = reader["nro_prog"]?.ToString(),
                    cod_und_econom = reader["cod_und_econom"]?.ToString(),
                    cod_zona = reader["cod_zona"]?.ToString(),
                    cod_veta = reader["cod_veta"]?.ToString(),
                    cod_nivel = reader["cod_nivel"]?.ToString(),
                    cod_tipo_labor = reader["cod_tipo_labor"]?.ToString(),
                    cod_labor = reader["cod_labor"]?.ToString(),
                    cod_ala = reader["cod_ala"]?.ToString(),
                    cod_fase = reader["cod_fase"]?.ToString(),
                    prg_blocks = reader["prg_blocks"]?.ToString(),

                    num_tms = reader["num_tms"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_tms"]),
                    num_ag_veta = reader["num_ag_veta"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_ag_veta"]),
                    num_au_veta = reader["num_au_veta"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_au_veta"]),
                    num_cu_veta = reader["num_cu_veta"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_cu_veta"]),
                    num_pb_veta = reader["num_pb_veta"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_pb_veta"]),
                    num_zn_veta = reader["num_zn_veta"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_zn_veta"]),
                    num_anc_veta = reader["num_anc_veta"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_anc_veta"]),
                    num_anc_min = reader["num_anc_min"] == DBNull.Value ? null : Convert.ToDecimal(reader["num_anc_min"])
                };


                list.Add(item);
            }

            return list;
        }

        public async Task<List<ReservaGeologicaDto>> ReservasGeologicas(
            string cie_ano, string cod_und_econom, string cod_zona, string cod_veta, string cod_nivel)
        {
            var list = new List<ReservaGeologicaDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_OBTENER_BLOCKS", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@cie_ano", SqlDbType.VarChar, 10).Value = cie_ano;
            cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 10).Value = cod_und_econom;
            cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = cod_zona;
            cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 10).Value = cod_veta;
            cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 10).Value = cod_nivel;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new ReservaGeologicaDto
                {
                    num_block = reader["num_block"].ToString(),
                    num_tms_total = reader["num_tms_total"] as decimal?,
                    num_potencia = reader["num_potencia"] as decimal?,
                    num_potencia_diluida = reader["num_potencia_diluida"] as decimal?,
                    num_ag_diluida = reader["num_ag_diluida"] as decimal?,
                    num_au_diluida = reader["num_au_diluida"] as decimal?,
                    num_cu_diluida = reader["num_cu_diluida"] as decimal?,
                    num_pb_diluida = reader["num_pb_diluida"] as decimal?,
                    num_zn_diluida = reader["num_zn_diluida"] as decimal?,
                    num_vpt_diluida = reader["num_vpt_diluida"] as decimal?
                };


                list.Add(item);
            }

            return list;
        }


        public async Task<List<EvaluacionBloquesDto>> EvaluacionBloque(string nro_prog, string des_labor)
        {
            var list = new List<EvaluacionBloquesDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_EVALUACION_BLOQUE", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;
            cmd.Parameters.Add("@des_labor", SqlDbType.VarChar, 50).Value = des_labor;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new EvaluacionBloquesDto
                {
                    des_labor = reader["des_labor"]?.ToString(),
                    cod_seccion = reader["cod_seccion"]?.ToString(),
                    cod_eje = reader["cod_eje"]?.ToString(),

                    prg_tmsextraid = reader["prg_tmsextraid"] == DBNull.Value ? null : Convert.ToDecimal(reader["prg_tmsextraid"]),
                    prg_leycu = reader["prg_leycu"] == DBNull.Value ? null : Convert.ToDecimal(reader["prg_leycu"]),
                    prg_leyau = reader["prg_leyau"] == DBNull.Value ? null : Convert.ToDecimal(reader["prg_leyau"]),
                    prg_leyag = reader["prg_leyag"] == DBNull.Value ? null : Convert.ToDecimal(reader["prg_leyag"]),
                    prg_leycueq = reader["prg_leycueq"] == DBNull.Value ? null : Convert.ToDecimal(reader["prg_leycueq"]),
                    prg_leynsr = reader["prg_leynsr"] == DBNull.Value ? null : Convert.ToDecimal(reader["prg_leynsr"]),

                    prg_perf = reader["prg_perf"] == DBNull.Value ? null : Convert.ToDecimal(reader["prg_perf"]),

                    ind_version = reader["ind_version"]?.ToString(),

                    cie_per = reader["cie_per"]?.ToString(),
                    cie_ano = reader["cie_ano"]?.ToString(),

                    nro_prog = reader["nro_prog"]?.ToString(),
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString()
                };

                list.Add(item);
            }

            return list;
        }

        public async Task<List<ProgramacionPlanDto>> GetProgramacionLabor(string des_labor)
        {
            var list = new List<ProgramacionPlanDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_OBTENER_PROGRAMACION_LABOR", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@des_labor", SqlDbType.VarChar, 50).Value = des_labor;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new ProgramacionPlanDto
                {
                    des_labor = reader["des_labor"].ToString(),
                    cod_seccion = reader["cod_seccion"].ToString(),
                    cod_eje = reader["cod_eje"].ToString(),
                    prg_tmsextraid = Convert.ToDecimal(reader["prg_tmsextraid"]),
                    prg_leycu = Convert.ToDecimal(reader["prg_leycu"]),
                    prg_leyau = Convert.ToDecimal(reader["prg_leyau"]),
                    prg_leyag = Convert.ToDecimal(reader["prg_leyag"]),
                    prg_leycueq = Convert.ToDecimal(reader["prg_leycueq"]),
                    prg_leynsr = Convert.ToDecimal(reader["prg_leynsr"]),
                    prg_perf = Convert.ToDecimal(reader["prg_perf"]),
                    ind_version = reader["ind_version"].ToString()
                };

                list.Add(item);
            }

            return list;
        }

        public async Task<List<DetPrgArchivosDto>> MostrarDatosPlanos(string nro_prog, string cod_und_econom, string cod_zona, string cod_veta,
            string cod_nivel, string cod_tipo_labor, string cod_labor, string cod_ala, string cod_fase)
        {
            var list = new List<DetPrgArchivosDto>();

            using var conn = new SqlConnection(_connectionString);

            await using var cmd = new SqlCommand("SP_LISTAR_PLANOS", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;
            cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 2).Value = cod_und_econom;
            cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = cod_zona;
            cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 10).Value = cod_veta;
            cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 10).Value = cod_nivel;
            cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 10).Value = cod_tipo_labor;
            cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 10).Value = cod_labor;
            cmd.Parameters.Add("@cod_ala", SqlDbType.VarChar, 4).Value =
                string.IsNullOrWhiteSpace(cod_ala) ? "" : cod_ala;
            cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 4).Value = cod_fase;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var item = new DetPrgArchivosDto
                {
                    cod_empresa = reader["cod_empresa"].ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"].ToString(),
                    nro_prog = reader["nro_prog"].ToString(),
                    cod_und_econom = reader["cod_und_econom"].ToString(),
                    cod_zona = reader["cod_zona"].ToString(),
                    cod_veta = reader["cod_veta"].ToString(),
                    cod_nivel = reader["cod_nivel"].ToString(),
                    cod_tipo_labor = reader["cod_tipo_labor"].ToString(),
                    cod_labor = reader["cod_labor"].ToString(),
                    cod_ala = reader["cod_ala"].ToString(),
                    cod_fase = reader["cod_fase"].ToString(),
                    tipo_archivo = reader["tipo_archivo"].ToString(),
                    secuencia = Convert.ToInt32(reader["secuencia"]),
                    ruta_archivo = reader["ruta_archivo"] == DBNull.Value ? null : reader["ruta_archivo"].ToString(),
                    nombre_archivo = reader["nombre_archivo"] == DBNull.Value ? null : reader["nombre_archivo"].ToString(),
                    descripcion = reader["descripcion"] == DBNull.Value ? null : reader["descripcion"].ToString()
                };

                list.Add(item);
            }

            return list;
        }



        public async Task<ResultadoDto> SubirPlano(SubirPlanoDto dto)
        {
            var nombreArchivo =
                "P" +
                dto.nro_prog +
                dto.cod_und_econom +
                dto.cod_zona +
                dto.cod_veta +
                dto.cod_nivel +
                dto.cod_tipo_labor +
                dto.cod_labor +
                dto.cod_ala +
                dto.cod_fase +
                DateTime.Now.Ticks +
                ".pdf";

            var carpeta = @"C:\Planos\";

            if (!Directory.Exists(carpeta))
                Directory.CreateDirectory(carpeta);

            var ruta = Path.Combine(carpeta, nombreArchivo);

            using (var stream = new FileStream(ruta, FileMode.Create))
            {
                await dto.file.CopyToAsync(stream);
            }

            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = new SqlCommand("SP_SUBIR_PLANO", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = dto.nro_prog;
            cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 2).Value = dto.cod_und_econom;
            cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = dto.cod_zona;
            cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 10).Value = dto.cod_veta;
            cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 10).Value = dto.cod_nivel;
            cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 10).Value = dto.cod_tipo_labor;
            cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 10).Value = dto.cod_labor;
            cmd.Parameters.Add("@cod_ala", SqlDbType.VarChar, 4).Value =
                string.IsNullOrWhiteSpace(dto.cod_ala) ? "" : dto.cod_ala;
            cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 4).Value = dto.cod_fase;
            cmd.Parameters.Add("@ruta", SqlDbType.VarChar, 100).Value = ruta;
            cmd.Parameters.Add("@nombre_archivo", SqlDbType.VarChar, 100).Value = nombreArchivo;
            cmd.Parameters.Add("@titulo", SqlDbType.VarChar, 250).Value = dto.titulo;


            using var reader = await cmd.ExecuteReaderAsync();

            var resultado = new ResultadoDto();

            if (await reader.ReadAsync())
            {
                resultado.resultado = reader.GetInt32(0);
                resultado.mensaje = reader.GetString(1);
            }

            return resultado;
        }

        public async Task<ResultadoDto> EliminarPlano(EliminarPlanoDto dto)
        {
            var resultado = new ResultadoDto();

            using var conn = new SqlConnection(_connectionString);

            await using var cmd = new SqlCommand("SP_ELIMINAR_PLANO", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = dto.nro_prog;
            cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 2).Value = dto.cod_und_econom;
            cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = dto.cod_zona;
            cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 10).Value = dto.cod_veta;
            cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 10).Value = dto.cod_nivel;
            cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 10).Value = dto.cod_tipo_labor;
            cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 10).Value = dto.cod_labor;
            cmd.Parameters.Add("@cod_ala", SqlDbType.VarChar, 4).Value = dto.cod_ala ?? "";
            cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 4).Value = dto.cod_fase;
            cmd.Parameters.Add("@secuencia", SqlDbType.Int).Value = dto.secuencia;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                resultado.resultado = Convert.ToInt32(reader["resultado"]);
                resultado.mensaje = reader["mensaje"].ToString();
            }

            return resultado;
        }


        public async Task<string?> ObtenerPrefCtoMina()
        {
            using var conn = new SqlConnection(_connectionString);

            const string query = @"
                    SELECT pref_cto_mina
                    FROM mae_parametros
                    WHERE cod_empresa = @cod_empresa
                    AND cod_empresa_unidad = @cod_empresa_unidad";

            using var cmd = new SqlCommand(query, conn);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";

            await conn.OpenAsync();

            var result = await cmd.ExecuteScalarAsync();

            return result?.ToString();
        }

        public async Task<string?> ObtenerPrefijoZona(string cod_zona)
        {
            using var conn = new SqlConnection(_connectionString);

            const string query = @"
                        SELECT cod_costo_equivalente
                        FROM mae_zona
                        WHERE cod_empresa = @cod_empresa
                        AND cod_empresa_unidad = @cod_empresa_unidad
                        AND cod_zona = @cod_zona";

            using var cmd = new SqlCommand(query, conn);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = "03";
            cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = "01";
            cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = cod_zona;

            await conn.OpenAsync();

            var result = await cmd.ExecuteScalarAsync();

            return result?.ToString();
        }



        //VALIDACIONES FORMULAS 

        public (decimal denDesmonte, decimal vptmin) ObtenerFactor(string cie_ano, string cie_per)
        {
            decimal denDesmonte = 0;
            decimal vptmin = 0;

            using var cn = new SqlConnection(_connectionString);
            cn.Open();

            var query = @"
                SELECT fac_dendes, fac_vptmin
                FROM mae_factor
                WHERE cod_empresa = @cod_empresa
                  AND cod_empresa_unidad = @cod_empresa_unidad
                  AND cie_ano = @cie_ano
                  AND cie_per = @cie_per";

            using var cmd = new SqlCommand(query, cn);
            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
            cmd.Parameters.AddWithValue("@cie_ano", cie_ano);
            cmd.Parameters.AddWithValue("@cie_per", cie_per);

            using var dr = cmd.ExecuteReader();
            if (dr.Read())
            {
                denDesmonte = dr["fac_dendes"] != DBNull.Value ? Convert.ToDecimal(dr["fac_dendes"]) : 0;
                vptmin = dr["fac_vptmin"] != DBNull.Value ? Convert.ToDecimal(dr["fac_vptmin"]) : 0;
            }

            return (denDesmonte, vptmin);
        }


        public (decimal denMineral, string indEstructura, decimal vptminZona) ObtenerZona(
            string cod_zona)
        {
            decimal denMineral = 0;
            string indEstructura = "";
            decimal vptminZona = 0;

            using var cn = new SqlConnection(_connectionString);
            cn.Open();

            var query = @"
                SELECT nro_den, ind_dens_estructura, val_vpt
                FROM mae_zona
                WHERE cod_empresa = @cod_empresa
                  AND cod_empresa_unidad = @cod_empresa_unidad
                  AND cod_zona = @cod_zona";

            using var cmd = new SqlCommand(query, cn);
            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
            cmd.Parameters.AddWithValue("@cod_zona", cod_zona);

            using var dr = cmd.ExecuteReader();
            if (dr.Read())
            {
                denMineral = dr["nro_den"] != DBNull.Value ? Convert.ToDecimal(dr["nro_den"]) : 0;
                indEstructura = dr["ind_dens_estructura"]?.ToString();
                vptminZona = dr["val_vpt"] != DBNull.Value ? Convert.ToDecimal(dr["val_vpt"]) : 0;
            }

            return (denMineral, indEstructura, vptminZona);
        }


        public decimal ObtenerDensidadVeta(
            string cod_und_econom,
            string cod_zona,
            string cod_veta)
        {
            decimal den = 0;

            using var cn = new SqlConnection(_connectionString);
            cn.Open();

            var query = @"
                SELECT nro_den
                FROM mae_veta
                WHERE cod_empresa = @cod_empresa
                  AND cod_empresa_unidad = @cod_empresa_unidad
                  AND cod_und_econom = @cod_und_econom
                  AND cod_zona = @cod_zona
                  AND cod_veta = @cod_veta";

            using var cmd = new SqlCommand(query, cn);
            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
            cmd.Parameters.AddWithValue("@cod_und_econom", cod_und_econom);
            cmd.Parameters.AddWithValue("@cod_zona", cod_zona);
            cmd.Parameters.AddWithValue("@cod_veta", cod_veta);

            var result = cmd.ExecuteScalar();

            if (result != null && result != DBNull.Value)
                den = Convert.ToDecimal(result);

            return den;
        }


        public (decimal ag, decimal cu, decimal pb, decimal zn, decimal au) ObtenerFactoresOperativos(string cie_ano, string cie_per, string tipoFac)
        {
            decimal ag = 0, cu = 0, pb = 0, zn = 0, au = 0;

            using var cn = new SqlConnection(_connectionString);
            cn.Open();

            var query = @"
                SELECT val_fac_ag, val_fac_cu, val_fac_pb, val_fac_zn, val_fac_au
                FROM mae_val_operativo_detalle
                WHERE cod_empresa = @cod_empresa
                  AND cod_empresa_unidad = @cod_empresa_unidad
                  AND val_ano = @cie_ano
                  AND val_per = @cie_per
                  AND val_tipo_fac = @tipo_fac";

            using var cmd = new SqlCommand(query, cn);
            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
            cmd.Parameters.AddWithValue("@cie_ano", cie_ano);
            cmd.Parameters.AddWithValue("@cie_per", cie_per);
            cmd.Parameters.AddWithValue("@tipo_fac", tipoFac);

            using var dr = cmd.ExecuteReader();
            if (dr.Read())
            {
                ag = dr["val_fac_ag"] != DBNull.Value ? Convert.ToDecimal(dr["val_fac_ag"]) : 0;
                cu = dr["val_fac_cu"] != DBNull.Value ? Convert.ToDecimal(dr["val_fac_cu"]) : 0;
                pb = dr["val_fac_pb"] != DBNull.Value ? Convert.ToDecimal(dr["val_fac_pb"]) : 0;
                zn = dr["val_fac_zn"] != DBNull.Value ? Convert.ToDecimal(dr["val_fac_zn"]) : 0;
                au = dr["val_fac_au"] != DBNull.Value ? Convert.ToDecimal(dr["val_fac_au"]) : 0;
            }

            return (ag, cu, pb, zn, au);
        }

        public (decimal factorMetodo, string indDilucion, string indLeyesMin) ObtenerMetodoExplotacion(string cie_ano, string cie_per, string cod_metexp)
        {
            decimal factor = 1;
            string indDilucion = "";
            string indLeyesMin = "";

            using var cn = new SqlConnection(_connectionString);
            cn.Open();

            var query = @"
                    SELECT fac_metexp, ind_calculo_dilucion, ind_calculo_leyes_min
                    FROM mae_per_met_explotacion
                    WHERE cod_empresa = @cod_empresa
                      AND cod_empresa_unidad = @cod_empresa_unidad
                      AND cie_ano = @cie_ano
                      AND cie_per = @cie_per
                      AND cod_metexp = @cod_metexp";

            using var cmd = new SqlCommand(query, cn);
            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");
            cmd.Parameters.AddWithValue("@cie_ano", cie_ano);
            cmd.Parameters.AddWithValue("@cie_per", cie_per);
            cmd.Parameters.AddWithValue("@cod_metexp", cod_metexp);

            using var dr = cmd.ExecuteReader();
            if (dr.Read())
            {
                factor = dr["fac_metexp"] != DBNull.Value ? Convert.ToDecimal(dr["fac_metexp"]) : 1;
                indDilucion = dr["ind_calculo_dilucion"]?.ToString();
                indLeyesMin = dr["ind_calculo_leyes_min"]?.ToString();
            }

            return (factor, indDilucion, indLeyesMin);
        }

        public (List<BlockReservasDto> blocks, List<DetPrgArchivosDto> archivos) ObtenerBlocksYArchivos()
        {
            var listaBlocks = new List<BlockReservasDto>();
            var listaArchivos = new List<DetPrgArchivosDto>();

            using var cn = new SqlConnection(_connectionString);
            cn.Open();

            var query = @"
                    SELECT * 
                    FROM det_prg_block_reservas
                    WHERE cod_empresa = @cod_empresa
                      AND cod_empresa_unidad = @cod_empresa_unidad;
                      

                    SELECT * 
                    FROM det_prg_archivos
                    WHERE cod_empresa = @cod_empresa
                      AND cod_empresa_unidad = @cod_empresa_unidad;
                      
                ";

            using var cmd = new SqlCommand(query, cn);
            cmd.Parameters.AddWithValue("@cod_empresa", "03");
            cmd.Parameters.AddWithValue("@cod_empresa_unidad", "01");

            using var dr = cmd.ExecuteReader();

            // 🔹 blocks
            while (dr.Read())
            {
                listaBlocks.Add(new BlockReservasDto
                {
                    cod_empresa = dr["cod_empresa"]?.ToString(),
                    cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                    nro_prog = dr["nro_prog"]?.ToString(),
                    cod_zona = dr["cod_zona"]?.ToString(),
                    cod_veta = dr["cod_veta"]?.ToString()
                });
            }

            // 🔹 archivos
            if (dr.NextResult())
            {
                while (dr.Read())
                {
                    listaArchivos.Add(new DetPrgArchivosDto
                    {
                        cod_empresa = dr["cod_empresa"]?.ToString(),
                        cod_empresa_unidad = dr["cod_empresa_unidad"]?.ToString(),
                        nro_prog = dr["nro_prog"]?.ToString(),
                        nombre_archivo = dr["nombre_archivo"]?.ToString(),
                        ruta_archivo = dr["ruta_archivo"]?.ToString()
                    });
                }
            }

            return (listaBlocks, listaArchivos);
        }


        public async Task<bool> EliminarProgramaDetalleAsync(
            string cod_empresa,
            string cod_empresa_unidad,
            string nro_prog,
            string cod_fase,
            string cod_und_econom,
            string cod_zona,
            string cod_veta,
            string cod_nivel,
            string cod_tipo_labor,
            string cod_labor,
            string cod_ala
        )
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_PROGRMA_MENSUAL_DELETE_INSERT_UPDATE", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // 🔹 Parámetros SP
                    cmd.Parameters.Add("@cod_empresa", SqlDbType.VarChar, 2).Value = cod_empresa;
                    cmd.Parameters.Add("@cod_empresa_unidad", SqlDbType.VarChar, 2).Value = cod_empresa_unidad;
                    cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 10).Value = nro_prog;
                    cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 2).Value = cod_fase;

                    cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 10).Value = cod_und_econom;
                    cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 10).Value = cod_zona;
                    cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 10).Value = cod_veta;
                    cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 10).Value = cod_nivel;
                    cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 10).Value = cod_tipo_labor;
                    cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 10).Value = cod_labor;
                    cmd.Parameters.Add("@cod_ala", SqlDbType.VarChar, 10).Value = cod_ala;

                    cmd.Parameters.Add("@accion", SqlDbType.Char, 1).Value = "D"; // 🔹 DELETE

                    await conn.OpenAsync();

                    var resultado = (int)await cmd.ExecuteScalarAsync();

                    if (resultado == 1)
                        return true; // eliminado
                    else
                        return false; // no existía
                }
            }
        }

        public async Task<object> ListaAvance(string cod_und_econom, string cod_zona, int page, int pageSize)
        {
            var list = new List<LaborDto>();
            int total = 0;

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand("SP_LISTA_AVANCES", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@cod_und_econom", SqlDbType.VarChar, 2).Value = cod_und_econom;
            cmd.Parameters.Add("@cod_zona", SqlDbType.VarChar, 2).Value = cod_zona;
            cmd.Parameters.Add("@page", SqlDbType.Int).Value = page;
            cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            // 🔹 1. PRIMER RESULTSET → TOTAL
            if (await reader.ReadAsync())
            {
                total = reader["total"] == DBNull.Value ? 0 : Convert.ToInt32(reader["total"]);
            }

            // 🔹 2. SEGUNDO RESULTSET → DATA
            await reader.NextResultAsync();

            while (await reader.ReadAsync())
            {
                var item = new LaborDto
                {
                    cod_empresa = GetString(reader["cod_empresa"]),
                    cod_und_econom = GetString(reader["cod_und_econom"]),
                    cod_zona = GetString(reader["cod_zona"]),
                    cod_veta = GetString(reader["cod_veta"]),
                    cod_nom_veta = reader["cod_nom_veta"].ToString(),

                    cod_nivel = GetString(reader["cod_nivel"]),
                    cod_tipo_labor = GetString(reader["cod_tipo_labor"]),
                    cod_labor = GetString(reader["cod_labor"]),
                    nom_labor = GetString(reader["nom_labor"]),
                    des_labor = GetString(reader["des_labor"]),

                    est_labor = GetString(reader["est_labor"]),

                    cod_usuario_creo = GetString(reader["cod_usuario_creo"]),
                    fec_usuario_creo = GetDato(reader["fec_usuario_creo"]),

                    cod_usuario_modi = GetString(reader["cod_usuario_modi"]),
                    fec_usuario_modi = GetDato(reader["fec_usuario_modi"]),

                    cod_empresa_unidad = GetString(reader["cod_empresa_unidad"]),

                    cod_tipo_labor_ant = GetString(reader["cod_tipo_labor_ant"]),
                    cod_labor_ant = GetString(reader["cod_labor_ant"])
                };

                list.Add(item);
            }

            return new LaboresAvanceDto
            {
                total = total,
                page = page,
                pageSize = pageSize,
                data = list
            };
        }


        //GENERAR NRO_PROG
        public async Task<string> GenerarNroProg()
        {
            string nroProg = "";

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_GENERAR_NRO_PROG", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    var result = await cmd.ExecuteScalarAsync();
                    nroProg = result?.ToString() ?? "";
                }
            }

            return nroProg;
        }

        //INSERTAR PRG_CAB

        private decimal ToDecimal(object value)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                return 0;

            return Convert.ToDecimal(value);
        }

        public async Task<RespuestaDto> InsertarCabDet(InsertarCabDetalleDto data)
        {
            var response = new RespuestaDto();

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                foreach (var det in data.detalle)
                {
                    using (SqlCommand cmd = new SqlCommand("SP_INSERTAR_PROGRAMA", cn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // =========================
                        // 🔹 HELPERS
                        // =========================
                        void AddDecimal(string name, object value)
                        {
                            var p = cmd.Parameters.Add(name, SqlDbType.Decimal);
                            p.Precision = 18;
                            p.Scale = 4;

                            if (value == null || value.ToString().Trim() == "")
                                p.Value = DBNull.Value;
                            else
                                p.Value = Convert.ToDecimal(value);
                        }

                        void AddVarchar(string name, object value, int size)
                        {
                            cmd.Parameters.Add(name, SqlDbType.VarChar, size)
                                .Value = value ?? (object)DBNull.Value;
                        }

                        void AddChar(string name, object value, int size)
                        {
                            cmd.Parameters.Add(name, SqlDbType.Char, size)
                                .Value = value ?? (object)DBNull.Value;
                        }

                        // =========================
                        // 🔹 CABECERA
                        // =========================
                        AddVarchar("@cod_und_econom", data.cabecera.cod_und_econom, 2);
                        AddVarchar("@cod_contrata", data.cabecera.cod_contrata, 10);
                        AddVarchar("@cod_zona", data.cabecera.cod_zona, 2);
                        AddDecimal("@prg_cutoff", data.cabecera.prg_cutoff);
                        AddVarchar("@nro_prog", data.cabecera.nro_prog, 20);
                        AddVarchar("@cie_ano", data.cabecera.cie_ano, 4);
                        AddVarchar("@cie_per", data.cabecera.cie_per, 2);

                        cmd.Parameters.Add("@fec_emi", SqlDbType.DateTime)
                            .Value = data.cabecera.fec_emi;

                        AddChar("@prg_est", data.cabecera.prg_est ?? "A", 1);
                        AddChar("@ind_calc_dil", data.cabecera.ind_calc_dil ?? "N", 1);
                        AddVarchar("@cod_usuario_creo", data.cabecera.cod_usuario_creo, 50);

                        // =========================
                        // 🔹 FASE
                        // =========================
                        AddVarchar("@cod_fase", det.cod_fase, 2);

                        // =========================
                        // 🔹 IDENTIFICACIÓN
                        // =========================
                        AddVarchar("@cod_veta", det.cod_veta, 10);
                        AddVarchar("@cod_nivel", det.cod_nivel, 10);
                        AddVarchar("@cod_tipo_labor", det.cod_tipo_labor, 10);
                        AddVarchar("@cod_labor", det.cod_labor, 20);
                        AddVarchar("@cod_ala", det.cod_ala, 5);
                        AddVarchar("@cod_cto", det.cod_cto, 20);
                        AddVarchar("@cod_cta", det.cod_cta, 20);

                        // =========================
                        // 🔹 ROCA
                        // =========================
                        AddVarchar("@ind_tip_roca", det.ind_tip_roca, 10);
                        AddVarchar("@ind_tip_roca_piso", det.ind_tip_roca_piso, 10);
                        AddVarchar("@ind_tip_roca_techo", det.ind_tip_roca_techo, 10);
                        AddChar("@ind_taladro_largo", det.ind_taladro_largo, 10);

                        // =========================
                        // 🔹 AVANCE
                        // =========================
                        AddDecimal("@prg_blocks", det.prg_blocks);
                        AddDecimal("@prg_avamts", det.prg_avamts);
                        AddDecimal("@prg_secancho", det.prg_secancho);
                        AddDecimal("@prg_secaltu", det.prg_secaltu);

                        // =========================
                        // 🔹 TONELAJE
                        // =========================
                        AddDecimal("@prg_tmsdes", det.prg_tmsdes);
                        AddDecimal("@prg_tmsmin", det.prg_tmsmin);
                        AddDecimal("@prg_tmsextraid", det.prg_tmsextraid);
                        AddDecimal("@prg_tmsrotvet", det.prg_tmsrotvet);
                        AddDecimal("@prg_tmsrotdil", det.prg_tmsrotdil);

                        // =========================
                        // 🔹 GEOMETRÍA
                        // =========================
                        AddDecimal("@prg_ancmin", det.prg_ancmin);
                        AddDecimal("@prg_ancvet", det.prg_ancvet);
                        AddDecimal("@prg_loncor", det.prg_loncor);
                        AddDecimal("@prg_altcor", det.prg_altcor);

                        // =========================
                        // 🔹 OTROS
                        // =========================
                        AddVarchar("@prg_progra", det.prg_progra ?? "N", 20);

                        cmd.Parameters.Add("@prg_fecmuestreo", SqlDbType.Date)
                            .Value = det.prg_fecmuestreo ?? (object)DBNull.Value;

                        // =========================
                        // 🔹 LEYES
                        // =========================
                        AddDecimal("@prg_leyag", det.prg_leyag);
                        AddDecimal("@prg_leycu", det.prg_leycu);
                        AddDecimal("@prg_leypb", det.prg_leypb);
                        AddDecimal("@prg_leyzn", det.prg_leyzn);
                        AddDecimal("@prg_leyau", det.prg_leyau);

                        AddDecimal("@prg_leyagdil", det.prg_leyagdil);
                        AddDecimal("@prg_leycudil", det.prg_leycudil);
                        AddDecimal("@prg_leypbdil", det.prg_leypbdil);
                        AddDecimal("@prg_leyzndil", det.prg_leyzndil);
                        AddDecimal("@prg_leyaudil", det.prg_leyaudil);

                        // =========================
                        // 🔹 VPT
                        // =========================
                        AddDecimal("@prg_vptmin", det.prg_vptmin);
                        AddDecimal("@prg_vptdil", det.prg_vptdil);

                        // =========================
                        // 🔹 FACTORES
                        // =========================
                        AddVarchar("@metexp_cod", det.cod_metexp, 10);
                        AddDecimal("@num_factor_x", det.num_factor_x);
                        AddDecimal("@num_buzamiento", det.num_buzamiento);

                        // =========================
                        // 🔹 FINALES
                        // =========================
                        AddDecimal("@prg_homlab", det.prg_homlab);
                        AddChar("@ind_clasificacion_sos", det.ind_clasificacion_sos, 1);
                        AddVarchar("@ind_verificacion", det.ind_verificacion ?? "N", 1);
                        AddVarchar("@val_tipo_fac", det.val_tipo_fac, 10);

                        // =========================
                        // 🔹 EJECUCIÓN
                        // =========================
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                response.estado = reader.GetInt32(0);
                                response.mensaje = reader.GetString(1);
                            }
                        }

                        if (response.estado == 0)
                            return response;
                    }
                }
            }

            return response;
        }

        //COPIAR LABOR
        public async Task<RespuestaDto> CopiarLabor(CopiarDetalleDto det)
        {
            var response = new RespuestaDto();

            try
            {
                using (SqlConnection cn = new SqlConnection(_connectionString))
                {
                    await cn.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("SP_COPIAR_PROGRAMA", cn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros
                        cmd.Parameters.Add("@nro_prog", SqlDbType.VarChar, 20).Value = det.nro_prog ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@cod_veta", SqlDbType.VarChar, 10).Value = det.cod_veta ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@cod_nivel", SqlDbType.VarChar, 10).Value = det.cod_nivel ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@cod_tipo_labor", SqlDbType.VarChar, 10).Value = det.cod_tipo_labor ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@cod_labor", SqlDbType.VarChar, 20).Value = det.cod_labor ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@cod_fase", SqlDbType.VarChar, 4).Value = det.cod_fase ?? (object)DBNull.Value;

                        cmd.Parameters.Add("@cod_ala", SqlDbType.VarChar, 4).Value = det.cod_ala ?? (object)DBNull.Value;

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                response.estado = !reader.IsDBNull(0) ? reader.GetInt32(0) : 0;
                                response.mensaje = !reader.IsDBNull(1) ? reader.GetString(1) : string.Empty;
                            }
                            else
                            {
                                response.estado = 0;
                                response.mensaje = "No se obtuvo respuesta del procedimiento.";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.estado = 0;
                response.mensaje = $"Error: {ex.Message}";
            }

            return response;
        }

        //EXPORTAR ARCHIVO A PLANTILLA
        public async Task<RespuestaArchivoDto> GenerarReporteAsync(ReporteFiltroDto dto)
        {
            var (ds, estado, mensaje) = await ObtenerDatosAsync(dto);

            // 🔴 Si SQL Server devuelve error
            if (estado != 1)
            {
                return new RespuestaArchivoDto
                {
                    Estado = estado,
                    Mensaje = mensaje,
                    Archivo = null
                };
            }

            DataTable cabecera = ds.Tables[0];
            DataTable detalle = ds.Tables[1];


            var filaCab = cabecera.Rows[0];

            var filaDet = detalle.Rows[0];

            string plantilla = Path.Combine(
                Directory.GetCurrentDirectory(),
                "Plantillas",
                "reporte_programa_mensual.xlsx");

            using var workbook = new XLWorkbook(plantilla);

            string periodo = filaCab["cie_per"]?.ToString() switch
            {
                "01" => "ENERO",
                "02" => "FEBRERO",
                "03" => "MARZO",
                "04" => "ABRIL",
                "05" => "MAYO",
                "06" => "JUNIO",
                "07" => "JULIO",
                "08" => "AGOSTO",
                "09" => "SETIEMBRE",
                "10" => "OCTUBRE",
                "11" => "NOVIEMBRE",
                "12" => "DICIEMBRE",
                _ => ""
            };

            var ws = workbook.Worksheet(1);

            /* ============================================
               CABECERA
            ============================================ */

            ws.Cell("A2").Value = filaCab["nom_empresa"]?.ToString();
            ws.Cell("A3").Value = filaCab["nom_empresa_unidad"]?.ToString();

            ws.Cell("A5").Value = "Fase";
            ws.Cell("B5").Value = filaDet["nom_fase"]?.ToString();

            ws.Cell("A6").Value = "Unidad Económica";
            ws.Cell("B6").Value = filaCab["des_und_econom"]?.ToString();

            ws.Cell("C5").Value = "Zona";
            ws.Cell("D5").Value = filaCab["des_zona"]?.ToString();

            ws.Cell("C6").Value = "Contrata";
            ws.Cell("D6").Value = filaCab["des_contrata"]?.ToString();

            ws.Cell("E5").Value = "CutOff";
            ws.Cell("F5").Value = filaCab["prg_cutoff"].ToString();

            ws.Cell("E6").Value = "Nro Programa";
            ws.Cell("F6").Value = filaCab["nro_prog"]?.ToString();

            ws.Cell("A9").Value = $"Programa Mensual de Labores - {periodo} {filaCab["cie_ano"]}";

            /* ============================================
               DETALLE
            ============================================ */

            int filaInicio = 11;

            for (int i = 0; i < detalle.Rows.Count; i++)
            {
                var row = detalle.Rows[i];

                ws.Cell(filaInicio + i, 1).Value = row["cod_veta"]?.ToString();
                ws.Cell(filaInicio + i, 2).Value = row["cod_nivel"]?.ToString();
                ws.Cell(filaInicio + i, 3).Value = row["cod_tipo_labor"]?.ToString();
                ws.Cell(filaInicio + i, 4).Value = row["cod_labor"]?.ToString();
                ws.Cell(filaInicio + i, 5).Value = row["cod_ala"]?.ToString();
                ws.Cell(filaInicio + i, 6).Value = row["cod_cto"]?.ToString();
                ws.Cell(filaInicio + i, 7).Value =
                    row["prg_blocks"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_blocks"])
                    : "";

                ws.Cell(filaInicio + i, 8).Value =
                    row["ind_tip_roca_piso"] != DBNull.Value
                    ? Convert.ToDecimal(row["ind_tip_roca_piso"])
                    : "";

                ws.Cell(filaInicio + i, 9).Value =
                    row["ind_tip_roca"] != DBNull.Value
                    ? Convert.ToDecimal(row["ind_tip_roca"])
                    : "";

                ws.Cell(filaInicio + i, 10).Value =
                    row["ind_tip_roca_techo"] != DBNull.Value
                    ? Convert.ToDecimal(row["ind_tip_roca_techo"])
                    : "";

                ws.Cell(filaInicio + i,11).Value =
                    row["prg_avamts"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_avamts"])
                    : "";

                ws.Cell(filaInicio + i, 12).Value =
                    row["prg_secancho"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_secancho"])
                    : "";

                ws.Cell(filaInicio + i,13).Value =
                    row["prg_secaltu"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_secaltu"])
                    : "";

                ws.Cell(filaInicio + i, 14).Value =
                    row["prg_tmsdes"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_tmsdes"])
                    : "";

                ws.Cell(filaInicio + i, 15).Value =
                    row["prg_tmsmin"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_tmsmin"])
                    : "";

                ws.Cell(filaInicio + i, 16).Value =
                    row["prg_tmsmin"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_tmsmin"])
                    : "";

                ws.Cell(filaInicio + i, 17).Value =
                    row["prg_ancmin"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_ancmin"])
                    : "";

                ws.Cell(filaInicio + i, 18).Value =
                    row["prg_ancvet"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_ancvet"])
                    : "";

                ws.Cell(filaInicio + i, 19).Value =
                    row["prg_ancdil"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_ancdil"])
                    : "";


                ws.Cell(filaInicio + i, 20).Value =
                    row["prg_tramin"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_tramin"])
                    : "";

                ws.Cell(filaInicio + i, 21).Value =
                    row["prg_num_tramin"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_num_tramin"])
                    : "";


                //ws.Cell(filaInicio + i, 23).Value =
                //    row["prg_tramin_prog"] != DBNull.Value
                //    ? Convert.ToDecimal(row["prg_tramin_prog"])
                //    : 0;

                ws.Cell(filaInicio + i, 22).Value =
                    row["prg_loncor"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_loncor"])
                    : "";


                ws.Cell(filaInicio + i, 23).Value =
                    row["prg_altcor"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_altcor"])
                    : "";

                ws.Cell(filaInicio + i, 24).Value =
                    row["prg_tmsrotvet"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_tmsrotvet"])
                    : "";


                ws.Cell(filaInicio + i, 25).Value =
                    row["prg_tmsrotdil"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_tmsrotdil"])
                    : "";

                var fecha = row["prg_fecmuestreo"] != DBNull.Value
                    ? Convert.ToDateTime(row["prg_fecmuestreo"])
                    : (DateTime?)null;

                var cell = ws.Cell(filaInicio + i, 26);

                if (fecha != null)
                {
                    cell.Value = fecha;
                    cell.Style.DateFormat.Format = "dd/MM/yyyy";
                }
                else
                {
                    cell.Value = "";
                }


                ws.Cell(filaInicio + i, 27).Value =
                    row["prg_leyag"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_leyag"])
                    : "";

                ws.Cell(filaInicio + i, 28).Value =
                    row["prg_leycu"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_leycu"])
                    : "";


                ws.Cell(filaInicio + i, 29).Value =
                    row["prg_leypb"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_leypb"])
                    : "";

                ws.Cell(filaInicio + i, 30).Value =
                    row["prg_leyzn"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_leyzn"])
                    : "";


                //ws.Cell(filaInicio + i, 34).Value =
                //    row["prg_leyau"] != DBNull.Value
                //    ? Convert.ToDecimal(row["prg_leyau"])
                //    : 0;

                ws.Cell(filaInicio + i, 31).Value =
                    row["prg_vptmin"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_vptmin"])
                    : "";


                ws.Cell(filaInicio + i, 32).Value =
                    row["dif_cutoff"] != DBNull.Value
                    ? Convert.ToDecimal(row["dif_cutoff"])
                    : "";

                ws.Cell(filaInicio + i, 33).Value =
                    row["metexp_cod"] != DBNull.Value
                    ? row["metexp_cod"].ToString()
                    : "";


                ws.Cell(filaInicio + i, 34).Value =
                    row["prg_homlab"] != DBNull.Value
                    ? Convert.ToDecimal(row["prg_homlab"])
                    : "";


                ws.Cell(filaInicio + i, 35).Value =
                    row["des_proyecto"] != DBNull.Value
                    ? row["des_proyecto"].ToString()
                    : "";

                ws.Cell(filaInicio + i, 36).Value =
                    row["nom_proyecto"] != DBNull.Value
                    ? row["nom_proyecto"].ToString()
                    : "";
            }

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return new RespuestaArchivoDto
            {
                Estado = 1,
                Mensaje = "OK",
                Archivo = stream.ToArray(),
                NombreArchivo = "ReporteProgramaMensual.xlsx",
                ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
        }

        private async Task<(DataSet ds, int estado, string mensaje)> ObtenerDatosAsync(ReporteFiltroDto dto)
        {
            DataSet ds = new();

            int estado = 0;
            string mensaje = string.Empty;

            using (SqlConnection cn = new SqlConnection(_connectionString))
            {
                await cn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SP_REPORTE_PROGRAMA_MENSUAL", cn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // =========================
                    // PARAMETROS DE ENTRADA
                    // =========================
                    cmd.Parameters.AddWithValue("@cod_empresa", dto.cod_empresa);
                    cmd.Parameters.AddWithValue("@cod_empresa_unidad", dto.cod_empresa_unidad);
                    cmd.Parameters.AddWithValue("@nro_prog", dto.nro_prog);
                    cmd.Parameters.AddWithValue("@cod_fase", dto.cod_fase);

                    // =========================
                    // PARAMETROS OUTPUT
                    // =========================
                    var pEstado = new SqlParameter("@estado", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    var pMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500)
                    {
                        Direction = ParameterDirection.Output
                    };

                    cmd.Parameters.Add(pEstado);
                    cmd.Parameters.Add(pMensaje);

                    // =========================
                    // EJECUTAR DATASET
                    // =========================
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        da.Fill(ds);
                    }

                    // =========================
                    // LEER OUTPUTS
                    // =========================
                    estado = pEstado.Value != DBNull.Value ? Convert.ToInt32(pEstado.Value) : 0;
                    mensaje = pMensaje.Value?.ToString() ?? string.Empty;
                }
            }

            return (ds, estado, mensaje);
        }


        public async Task<(ResumenProgramaResponse data, int estado, string mensaje)> GetResumenAsync(
            string codEmpresa,
            string codEmpresaUnidad,
            string nroProg,
            string codFase)
        {
            ResumenCabecera cabecera = null;
            var detalle = new List<ResumenDetalle>();
            int estado = 0;
            string mensaje = string.Empty;

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand("SP_REPORTE_PDF_PROGRAMA_MENSUAL", connection)
            {
                CommandType = CommandType.StoredProcedure,
                CommandTimeout = 120
            };

            // Parámetros de entrada
            command.Parameters.AddWithValue("@cod_empresa", codEmpresa);
            command.Parameters.AddWithValue("@cod_empresa_unidad", codEmpresaUnidad);
            command.Parameters.AddWithValue("@nro_prog", nroProg);
            command.Parameters.AddWithValue("@cod_fase", codFase);

            // Parámetros de salida
            var paramEstado = new SqlParameter("@estado", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            var paramMensaje = new SqlParameter("@mensaje", SqlDbType.VarChar, 500)
            {
                Direction = ParameterDirection.Output
            };

            command.Parameters.Add(paramEstado);
            command.Parameters.Add(paramMensaje);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            // ── Resultset 1: Cabecera ──
            if (await reader.ReadAsync())
            {
                cabecera = new ResumenCabecera
                {
                    cod_empresa = reader["cod_empresa"]?.ToString(),
                    nom_empresa = reader["nom_empresa"]?.ToString(),
                    cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                    nom_empresa_unidad = reader["nom_empresa_unidad"]?.ToString(),
                    cod_und_econom = reader["cod_und_econom"]?.ToString(),
                    des_und_econom = reader["des_und_econom"]?.ToString(),
                    cod_zona = reader["cod_zona"]?.ToString(),
                    des_zona = reader["des_zona"]?.ToString(),
                    cod_contrata = reader["cod_contrata"]?.ToString(),
                    des_contrata = reader["des_contrata"]?.ToString(),
                    prg_cutoff = reader["prg_cutoff"] == DBNull.Value
                        ? 0
                        : Convert.ToDecimal(reader["prg_cutoff"]),
                    cie_ano = reader["cie_ano"]?.ToString(),
                    cie_per = reader["cie_per"]?.ToString(),
                    nro_prog = reader["nro_prog"]?.ToString(),
                    prg_est = reader["prg_est"]?.ToString(),
                    ind_calc_dil = reader["ind_calc_dil"]?.ToString()
                };
            }

            // ── Resultset 2: Detalle ──
            if (await reader.NextResultAsync())
            {
                while (await reader.ReadAsync())
                {
                    detalle.Add(new ResumenDetalle
                    {
                        cod_empresa = reader["cod_empresa"]?.ToString(),
                        cod_empresa_unidad = reader["cod_empresa_unidad"]?.ToString(),
                        nro_prog = reader["nro_prog"]?.ToString(),
                        cod_und_econom = reader["cod_und_econom"]?.ToString(),
                        cod_zona = reader["cod_zona"]?.ToString(),
                        cod_veta = reader["cod_veta"]?.ToString(),
                        cod_nivel = reader["cod_nivel"]?.ToString(),
                        cod_tipo_labor = reader["cod_tipo_labor"]?.ToString(),
                        cod_labor = reader["cod_labor"]?.ToString(),
                        cod_ala = reader["cod_ala"]?.ToString(),
                        cod_fase = reader["cod_fase"]?.ToString(),
                        nom_fase = reader["nom_fase"]?.ToString(),
                        cod_cto = reader["cod_cto"]?.ToString(),
                        cod_cta = reader["cod_cta"]?.ToString(),

                        // ✅ Indicadores: siempre ToString()
                        ind_tip_roca = reader["ind_tip_roca"]?.ToString(),
                        ind_tip_roca_piso = reader["ind_tip_roca_piso"]?.ToString(),
                        ind_tip_roca_techo = reader["ind_tip_roca_techo"]?.ToString(),
                        prg_tipace = reader["prg_tipace"]?.ToString(),
                        metexp_cod = reader["metexp_cod"]?.ToString(),
                        ind_clasificacion_sos = reader["ind_clasificacion_sos"]?.ToString(),
                        ind_taladro_largo = reader["ind_taladro_largo"]?.ToString(),
                        ind_verificacion = reader["ind_verificacion"]?.ToString(),
                        ind_calc_dil = reader["ind_calc_dil"]?.ToString(),
                        ind_calc_tipo_dil = reader["ind_calc_tipo_dil"]?.ToString(),
                        ind_tipo_ley = reader["ind_tipo_ley"]?.ToString(),
                        prg_est = reader["prg_est"]?.ToString(),
                        cod_tipo_labor_ant = reader["cod_tipo_labor_ant"]?.ToString(),
                        cod_labor_ant = reader["cod_labor_ant"]?.ToString(),
                        cod_ala_ant = reader["cod_ala_ant"]?.ToString(),
                        des_proyecto = reader["des_proyecto"]?.ToString(),
                        nom_proyecto = reader["nom_proyecto"]?.ToString(),

                        // ✅ Numéricos: ToDecimalSafe()
                        prg_avamts = ToDecimalSafe(reader["prg_avamts"]),
                        prg_secancho = ToDecimalSafe(reader["prg_secancho"]),
                        prg_secaltu = ToDecimalSafe(reader["prg_secaltu"]),
                        prg_tmsdes = ToDecimalSafe(reader["prg_tmsdes"]),
                        prg_tmsmin = ToDecimalSafe(reader["prg_tmsmin"]),
                        prg_ancdil = ToDecimalSafe(reader["prg_ancdil"]),
                        dif_cutoff = ToDecimalSafe(reader["dif_cutoff"]),
                        prg_blocks = ToDecimalSafe(reader["prg_blocks"]),
                        prg_ancmin = ToDecimalSafe(reader["prg_ancmin"]),
                        prg_ancvet = ToDecimalSafe(reader["prg_ancvet"]),
                        prg_ancmin_leyes = ToDecimalSafe(reader["prg_ancmin_leyes"]),
                        prg_loncor = ToDecimalSafe(reader["prg_loncor"]),
                        prg_altcor = ToDecimalSafe(reader["prg_altcor"]),
                        prg_tmsrotvet = ToDecimalSafe(reader["prg_tmsrotvet"]),
                        prg_tmsrotdil = ToDecimalSafe(reader["prg_tmsrotdil"]),
                        prg_tmsextraid = ToDecimalSafe(reader["prg_tmsextraid"]),
                        prg_fecmuestreo = reader["prg_fecmuestreo"] == DBNull.Value
                                        ? null
                                        : Convert.ToDateTime(reader["prg_fecmuestreo"]),
                        prg_leyag = ToDecimalSafe(reader["prg_leyag"]),
                        prg_leycu = ToDecimalSafe(reader["prg_leycu"]),
                        prg_leypb = ToDecimalSafe(reader["prg_leypb"]),
                        prg_leyzn = ToDecimalSafe(reader["prg_leyzn"]),
                        prg_leyagdil = ToDecimalSafe(reader["prg_leyagdil"]),
                        prg_leycudil = ToDecimalSafe(reader["prg_leycudil"]),
                        prg_leypbdil = ToDecimalSafe(reader["prg_leypbdil"]),
                        prg_leyzndil = ToDecimalSafe(reader["prg_leyzndil"]),
                        prg_leyau = ToDecimalSafe(reader["prg_leyau"]),
                        prg_leyaudil = ToDecimalSafe(reader["prg_leyaudil"]),
                        prg_vptdil = ToDecimalSafe(reader["prg_vptdil"]),
                        prg_vptmin = ToDecimalSafe(reader["prg_vptmin"]),
                        prg_homlab = ToDecimalSafe(reader["prg_homlab"]),
                        prg_tareas = ToDecimalSafe(reader["prg_tareas"]),
                        prg_nroper = ToDecimalSafe(reader["prg_nroper"]),
                        prg_nrowinche = ToDecimalSafe(reader["prg_nrowinche"]),
                        prg_nropala = ToDecimalSafe(reader["prg_nropala"]),
                        prg_pieper = ToDecimalSafe(reader["prg_pieper"]),
                        prg_brocas = ToDecimalSafe(reader["prg_brocas"]),
                        prg_barcon = ToDecimalSafe(reader["prg_barcon"]),
                        prg_barren = ToDecimalSafe(reader["prg_barren"]),
                        prg_dinami = ToDecimalSafe(reader["prg_dinami"]),
                        prg_fulmin = ToDecimalSafe(reader["prg_fulmin"]),
                        prg_conect = ToDecimalSafe(reader["prg_conect"]),
                        prg_punmar = ToDecimalSafe(reader["prg_punmar"]),
                        prg_tablas = ToDecimalSafe(reader["prg_tablas"]),
                        prg_pernos = ToDecimalSafe(reader["prg_pernos"]),
                        prg_mallas = ToDecimalSafe(reader["prg_mallas"]),
                        prg_cimbras = ToDecimalSafe(reader["prg_cimbras"]),
                        prg_progra = reader["prg_progra"]?.ToString(),

                        prg_tramin = ToDecimalSafe(reader["prg_tramin"]),
                        prg_num_tramin = ToDecimalSafe(reader["prg_num_tramin"]),
                        prg_tramin_prog = ToDecimalSafe(reader["prg_tramin_prog"]),
                        prg_num_tramin_prog = ToDecimalSafe(reader["prg_num_tramin_prog"]),
                        dist_desde = ToDecimalSafe(reader["dist_desde"]),
                        dist_hasta = ToDecimalSafe(reader["dist_hasta"]),
                        num_buzamiento = ToDecimalSafe(reader["num_buzamiento"]),
                        por_dilucion = ToDecimalSafe(reader["por_dilucion"]),
                        num_factor_x = ToDecimalSafe(reader["num_factor_x"]),
                        val_tipo_fac = ToDecimalSafe(reader["val_tipo_fac"]),
                        num_corte = ToDecimalSafe(reader["num_corte"]),
                        num_dis_limpieza = ToDecimalSafe(reader["num_dis_limpieza"]),
                        prg_cutoff = ToDecimalSafe(reader["prg_cutoff"]),
                        fac_vptmin = ToDecimalSafe(reader["fac_vptmin"]),
                        val_vpt = ToDecimalSafe(reader["val_vpt"]),
                    });
                }
            }

            // Leer parámetros OUTPUT después de cerrar el reader
            await reader.CloseAsync();

            estado = Convert.ToInt32(paramEstado.Value);
            mensaje = paramMensaje.Value?.ToString();

            return (
                new ResumenProgramaResponse { Cabecera = cabecera, Detalle = detalle },
                estado,
                mensaje
            );
        }

        private static decimal ToDecimalSafe(object value)
        {
            if (value == null || value == DBNull.Value) return 0;
            if (decimal.TryParse(value.ToString(), out var result)) return result;
            return 0; // si es 'S', 'N', 'O', etc. devuelve 0 sin explotar
        }

    }
}