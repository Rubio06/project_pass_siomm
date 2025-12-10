using Microsoft.Data.SqlClient;
using pass_siomm.Data;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
using pass_siomm_backend.Models.RutasModels;
using System.Data;

namespace pass_siomm_backend.Services.PlaneamientoService
{
    public class AperPeriodoOperativoServices
    {


        private readonly string _connectionString;

        public AperPeriodoOperativoServices(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }

        public async Task<List<string>> ObtenerMeses(string anio)
        {
            var meses = new List<string>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_OBTENER_MESES, conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@anio", SqlDbType.VarChar, 4).Value = anio;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                meses.Add(reader["cie_per"].ToString());
            }

            return meses;
        }

        public async Task<List<string>> ObtenerAnio()
        {
            var anio = new List<string>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_OBTENER_ANIO, conn);

            cmd.CommandType = CommandType.StoredProcedure;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                anio.Add(reader["cie_ano"].ToString());
            }

            return anio;
        }

        public async Task<object> ObtenerDatosCompletos(string month, string anio)
        {
            var result = new DatosCompletosDto();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_CARGAR_DATOS, conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@month", SqlDbType.VarChar, 2).Value = month;
            cmd.Parameters.Add("@anio", SqlDbType.VarChar, 4).Value = anio;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            result.cierre_periodo = await LeerCierrePeriodo(reader);
            await reader.NextResultAsync();

            result.factorOperativo = await LeerFactorOperativo(reader);
            await reader.NextResultAsync();

            result.canchas = await LeerCanchas(reader);
            await reader.NextResultAsync();

            result.factorSobredisolucion = await LeerFactorSobredisolucion(reader);
            await reader.NextResultAsync();

            result.recuperacionBudget = await LeerRecuperacionBudget(reader);
            await reader.NextResultAsync();

            result.factor = await LeerFactor(reader);
            await reader.NextResultAsync();

            result.operativo_detalle = await LeerOperativoDetalle(reader);
            await reader.NextResultAsync();

            result.laboratorio_estandar = await LeerLaboratorioEstandar(reader);
            await reader.NextResultAsync();


            result.metodo_minado = await MetodoMinado(reader);
            await reader.NextResultAsync();

            result.semana_ciclo = await LeerSemanaCiclo(reader);
            await reader.NextResultAsync();

            result.semana_avance = await LeerSeamanAvance(reader);
            await reader.NextResultAsync();


            result.exploracion_extandar = await LeerExploracionEstandar(reader);
            await reader.NextResultAsync();


            await conn.CloseAsync();

            return new { success = true, data = result };
        }

        private async Task<List<AperPeriodoDto>> LeerCierrePeriodo(SqlDataReader reader)
        {
            var lista = new List<AperPeriodoDto>();

            while (await reader.ReadAsync())
            {
                lista.Add(new AperPeriodoDto
                {
                    cie_per = reader["cie_per"]?.ToString(),

                    fec_ini = reader.IsDBNull(reader.GetOrdinal("fec_ini"))
                                ? null
                                : reader.GetDateTime(reader.GetOrdinal("fec_ini")),

                    fec_fin = reader.IsDBNull(reader.GetOrdinal("fec_fin"))
                                ? null
                                : reader.GetDateTime(reader.GetOrdinal("fec_fin")),

                    cie_ano = reader["cie_ano"]?.ToString()
                });
            }

            return lista;
        }

        private async Task<List<MaeValOperativoDto>> LeerFactorOperativo(SqlDataReader reader)
        {
            var lista = new List<MaeValOperativoDto>();
            while (await reader.ReadAsync())
            {
                lista.Add(new MaeValOperativoDto
                {
                    val_fac_ag = reader["val_fac_ag"].ToString(),
                    val_pre_ag = reader["val_pre_ag"].ToString(),
                    val_fac_cu = reader["val_fac_cu"].ToString(),
                    val_pre_cu = reader["val_pre_cu"].ToString(),
                    val_fac_pb = reader["val_fac_pb"].ToString(),
                    val_pre_pb = reader["val_pre_pb"].ToString(),
                    val_fac_zn = reader["val_fac_zn"].ToString(),
                    val_pre_zn = reader["val_pre_zn"].ToString(),
                    val_fac_au = reader["val_fac_au"].ToString(),
                    val_pre_au = reader["val_pre_au"].ToString()
                });
            }
            return lista;
        }

        private async Task<List<MaeValCanchasDto>> LeerCanchas(SqlDataReader reader)
        {
            var lista = new List<MaeValCanchasDto>();
            while (await reader.ReadAsync())
            {
                lista.Add(new MaeValCanchasDto
                {
                    val_tms = reader["val_tms"].ToString(),
                    val_ag = reader["val_ag"].ToString(),
                    val_cu = reader["val_cu"].ToString(),
                    val_pb = reader["val_pb"].ToString(),
                    val_zn = reader["val_zn"].ToString(),
                    val_vpt = reader["val_vpt"].ToString()
                });
            }
            return lista;
        }

        private async Task<List<MaeFactorSobredisolucionDto>> LeerFactorSobredisolucion(SqlDataReader reader)
        {
            var lista = new List<MaeFactorSobredisolucionDto>();
            while (await reader.ReadAsync())
            {
                lista.Add(new MaeFactorSobredisolucionDto
                {
                    val_fac_ag = reader["val_fac_ag"].ToString(),
                    val_fac_cu = reader["val_fac_cu"].ToString(),
                    val_fac_pb = reader["val_fac_pb"].ToString(),
                    val_fac_zn = reader["val_fac_zn"].ToString(),
                    val_fac_au = reader["val_fac_au"].ToString()
                });
            }
            return lista;
        }

        private async Task<List<MaeFactorRecuperacionDto>> LeerRecuperacionBudget(SqlDataReader reader)
        {
            var lista = new List<MaeFactorRecuperacionDto>();
            while (await reader.ReadAsync())
            {
                lista.Add(new MaeFactorRecuperacionDto
                {
                    val_fac_bud_ag = reader["val_fac_bud_ag"].ToString(),
                    val_fac_bud_cu = reader["val_fac_bud_cu"].ToString(),
                    val_fac_bud_pb = reader["val_fac_bud_pb"].ToString(),
                    val_fac_bud_zn = reader["val_fac_bud_zn"].ToString(),
                    val_fac_bud_au = reader["val_fac_bud_au"].ToString(),
                    val_con_ag = reader["val_con_ag"].ToString(),
                    val_con_cu = reader["val_con_cu"].ToString(),
                    val_con_pb = reader["val_con_pb"].ToString(),
                    val_con_zn = reader["val_con_zn"].ToString(),
                    val_con_au = reader["val_con_au"].ToString()
                });
            }
            return lista;
        }

        private async Task<List<MaeFactorDto>> LeerFactor(SqlDataReader reader)
        {
            var lista = new List<MaeFactorDto>();
            while (await reader.ReadAsync())
            {
                lista.Add(new MaeFactorDto
                {
                    fac_denmin = reader["fac_denmin"].ToString(),
                    fac_dendes = reader["fac_dendes"].ToString(),
                    fac_vptmin = reader["fac_vptmin"].ToString(),
                    fac_dialab = reader["fac_dialab"].ToString(),
                    fac_tarhor = reader["fac_tarhor"].ToString(),
                    fac_porcum = reader["fac_porcum"].ToString(),
                    fac_porhum = reader["fac_porhum"].ToString(),
                    fac_tms_dif = reader["fac_tms_dif"].ToString()
                });
            }
            return lista;
        }

        private async Task<List<MaeValOperativoDetalleDto>> LeerOperativoDetalle(SqlDataReader reader)
        {
            var lista = new List<MaeValOperativoDetalleDto>();
            while (await reader.ReadAsync())
            {
                lista.Add(new MaeValOperativoDetalleDto
                {
                    val_fac_rec_ag = reader["val_fac_rec_ag"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_ag"]) : (decimal?)null,
                    val_fac_rec_cu = reader["val_fac_rec_cu"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_cu"]) : (decimal?)null,
                    val_fac_rec_pb = reader["val_fac_rec_pb"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_pb"]) : (decimal?)null,
                    val_fac_rec_zn = reader["val_fac_rec_zn"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_zn"]) : (decimal?)null,
                    val_fac_rec_au = reader["val_fac_rec_au"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_au"]) : (decimal?)null,
                    val_des_tipo_fac = reader["val_des_tipo_fac"].ToString()
                });
            }
            return lista;
        }

        private async Task<List<MaeLaboratorioEstandarDto>> LeerLaboratorioEstandar(SqlDataReader reader)
        {
            var lista = new List<MaeLaboratorioEstandarDto>();
            while (await reader.ReadAsync())
            {
                lista.Add(new MaeLaboratorioEstandarDto
                {
                    cod_tiplab = reader["cod_tiplab"].ToString(),
                    nro_lab_ancho = reader["nro_lab_ancho"].ToString(),
                    nro_lab_altura = reader["nro_lab_altura"].ToString(),
                    nro_lab_pieper = reader["nro_lab_pieper"].ToString(),
                    nro_lab_broca = reader["nro_lab_broca"].ToString(),
                    nro_lab_barcon = reader["nro_lab_barcon"].ToString(),
                    nro_lab_barren = reader["nro_lab_barren"].ToString(),
                    nro_lab_facpot = reader["nro_lab_facpot"].ToString(),
                    nro_lab_fulmin = reader["nro_lab_fulmin"].ToString(),
                    nro_lab_conect = reader["nro_lab_conect"].ToString(),
                    nro_lab_punmar = reader["nro_lab_punmar"].ToString(),
                    nro_lab_tabla = reader["nro_lab_tabla"].ToString()
                });
            }
            return lista;
        }

        private async Task<List<MaePerMetExplotacionDto>> MetodoMinado(SqlDataReader reader)
        {
            var lista = new List<MaePerMetExplotacionDto>();


            //Console.WriteLine(reader["cod_metexp"]); // Verifica que llega algo
            while (await reader.ReadAsync())
            {
                lista.Add(new MaePerMetExplotacionDto
                {
                    cod_metexp = reader["cod_metexp"].ToString(),
                    nom_metexp = reader["nom_metexp"].ToString(),
                    ind_calculo_dilucion = reader["ind_calculo_dilucion"].ToString(),
                    ind_calculo_leyes_min = reader["ind_calculo_leyes_min"].ToString(),
                    ind_act = reader["ind_act"].ToString(),
                });
            }
            return lista;
        }


        public async Task<List<MaeSemanaCicloDto>> LeerSemanaCiclo(SqlDataReader reader)
        {
            var lista = new List<MaeSemanaCicloDto>();

            while (await reader.ReadAsync())
            {
                lista.Add(new MaeSemanaCicloDto
                {
                    num_semana = Convert.ToInt32(reader["num_semana"]),
                    fec_ini = Convert.ToDateTime(reader["fec_ini"]),
                    fec_fin = Convert.ToDateTime(reader["fec_fin"]),
                    desc_semana = reader["desc_semana"].ToString()
                });
            }
            return lista;

        }

        public async Task<List<MaeSemanaAvanceDto>> LeerSeamanAvance(SqlDataReader reader)
        {
            var lista = new List<MaeSemanaAvanceDto>();

            while (await reader.ReadAsync())
            {
                lista.Add(new MaeSemanaAvanceDto
                {
                    num_semana = reader["num_semana"] == DBNull.Value ? 0 : Convert.ToInt32(reader["num_semana"]),
                    fec_ini = reader["fec_ini"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_ini"]),
                    fec_fin = reader["fec_fin"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fec_fin"]),
                    desc_semana = reader["desc_semana"]?.ToString()
                });
            }
            return lista;

        }

        public async Task<List<MaeExploEstandar>> LeerExploracionEstandar(SqlDataReader reader)
        {
            var lista = new List<MaeExploEstandar>();

            while (await reader.ReadAsync())
            {
                lista.Add(new MaeExploEstandar
                {
                    cod_zona = reader["cod_zona"].ToString(),
                    lab_pieper = reader["lab_pieper"].ToString(),
                    lab_broca = reader["lab_broca"].ToString(),
                    lab_barcon = reader["lab_barcon"].ToString(),
                    lab_barren = reader["lab_barren"].ToString(),
                    lab_facpot = reader["lab_facpot"].ToString(),
                    lab_fulmin = reader["lab_fulmin"].ToString(),
                    lab_conect = reader["lab_conect"].ToString(),
                    lab_punmar = reader["lab_punmar"].ToString(),
                    lab_tabla = reader["lab_tabla"].ToString(),
                    lab_apr = reader["lab_apr"].ToString(),

                });
            }
            return lista;

        }

        public async Task<List<SelectTipoLaborDto>> SelectMetTipoLabor()
        {
            var list = new List<SelectTipoLaborDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_LISTA_TIPO_LABOR, conn);

            cmd.CommandType = CommandType.StoredProcedure;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new SelectTipoLaborDto
                {
                    cod_tipo_labor = reader["cod_tipo_labor"].ToString(),
                    nom_tipo_labor = reader["nom_tipo_labor"].ToString()
                };

                list.Add(item);
            }

            return list;
        }

        public async Task<List<SelectZonaDto>> SelectMetZona()
        {
            var list = new List<SelectZonaDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_LISTA_ZONA, conn);

            cmd.CommandType = CommandType.StoredProcedure;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new SelectZonaDto
                {
                    cod_zona = reader["cod_zona"].ToString(),
                    des_zona = reader["des_zona"].ToString()
                };

                list.Add(item);
            }

            return list;
        }


        public async Task<List<SelectExploracionDto>> SelectExploracion()
        {
            var list = new List<SelectExploracionDto>();

            using var conn = new SqlConnection(_connectionString);
            await using var cmd = new SqlCommand(SqlQueries.SP_LISTA_EXPLOTACION, conn);

            cmd.CommandType = CommandType.StoredProcedure;

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var item = new SelectExploracionDto
                {
                    cod_metexp = reader["cod_metexp"].ToString(),
                    nom_metexp = reader["nom_metexp"].ToString()
                };

                list.Add(item);
            }

            return list;
        }

    }



}