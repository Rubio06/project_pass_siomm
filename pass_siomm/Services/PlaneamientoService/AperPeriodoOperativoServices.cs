using Microsoft.Data.SqlClient;
using pass_siomm.Data;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
using pass_siomm_backend.Models.RutasModels;

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

            string query = @"select distinct cie_ano, cie_per from trb_cierre_periodo where cie_ano = @anio order by cie_per ASC";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);

            // ✅ Aquí agregas el parámetro que falta
            cmd.Parameters.AddWithValue("@anio", anio);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                meses.Add(reader["cie_per"].ToString());
            }

            return meses;
        }


        /* OBTENER AÑO */
        public async Task<List<string>> ObtenerAnio()
        {
            var anio = new List<string>();

            string query = @"select distinct cie_ano from trb_cierre_periodo";

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                anio.Add(reader["cie_ano"].ToString());
            }

            return anio;
        }

        //public async Task<List<AperPeriodoDto>> ObtenerFecha(string month, string anio)
        //{
        //    var fechas = new List<AperPeriodoDto>();

        //    string query = @"SELECT 
        //                cie_per,
        //                fec_ini AS FechaInicio,
        //                fec_fin AS FechaFin,
        //                cie_ano AS Anio
        //             FROM trb_cierre_periodo
        //             WHERE cie_ano = @anio AND cie_per = @month
        //             ORDER BY CAST(cie_per AS INT);";

        //    using var conn = new SqlConnection(_connectionString);
        //    using var cmd = new SqlCommand(query, conn);

        //    cmd.Parameters.AddWithValue("@month", month);
        //    cmd.Parameters.AddWithValue("@anio", anio);

        //    await conn.OpenAsync();

        //    using var reader = await cmd.ExecuteReaderAsync();
        //    while (await reader.ReadAsync())
        //    {
        //        fechas.Add(new AperPeriodoDto
        //        {
        //            CiePer = reader["cie_per"].ToString(),
        //            FechaInicio = Convert.ToDateTime(reader["FechaInicio"]),
        //            FechaFin = Convert.ToDateTime(reader["FechaFin"]),
        //            Anio = reader["Anio"].ToString()
        //        });
        //    }

        //    return fechas;
        //}


        public async Task<object> ObtenerDatosCompletos(string month, string anio)
        {
            string query = @"
        -- 1️⃣ CIERRE PERIODO
        SELECT 
            cie_per,
            fec_ini,
            fec_fin,
            cie_ano
        FROM trb_cierre_periodo
        WHERE cie_ano = @anio AND cie_per = @month
        ORDER BY CAST(cie_per AS INT);

        -- 2️⃣ FACTOR OPERATIVO
        SELECT 
            val_fac_ag, val_pre_ag, val_fac_cu, val_pre_cu, val_fac_pb, val_pre_pb, 
            val_fac_zn, val_pre_zn, val_fac_au, val_pre_au, cod_empresa, val_ano, val_per, 
            val_vig, usu_creo, fec_creo, usu_modi, fec_modi, cod_empresa_unidad
        FROM mae_val_operativo
        WHERE cod_empresa = 3 
          AND cod_empresa_unidad = 1
          AND val_ano = @anio 
          AND val_per = @month;

        -- 3️⃣ CANCHAS
        SELECT 
            val_tms,
            val_ag,
            val_cu,
            val_pb,
            val_zn,
            val_vpt
        FROM mae_val_canchas
        WHERE cod_empresa = 3
          AND cod_empresa_unidad = 1
          AND cie_ano = @anio
          AND cie_per = @month;

        -- 4️⃣ FACTOR SOBREDILUCIÓN
        SELECT 
            val_fac_ag, 
            val_fac_cu, 
            val_fac_pb, 
            val_fac_zn, 
            val_fac_au 
        FROM mae_factor_sobredilucion 
        WHERE cod_empresa = 03
          AND cod_empresa_unidad = 01
          AND cie_ano = @anio
          AND cie_per = @month;

SELECT
val_fac_bud_ag,
val_fac_bud_cu,
val_fac_bud_pb,
val_fac_bud_zn,
val_fac_bud_au,
val_con_ag,
val_con_cu,
val_con_pb,
val_con_zn,
val_con_au
FROM mae_factor_recuperacion
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = @anio
  AND cie_per = @month;

select fac_denmin, fac_dendes, fac_vptmin, fac_dialab,fac_tarhor, fac_porcum, fac_porhum, fac_tms_dif from mae_factor WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND cie_ano = @anio
  AND cie_per = @month;


select val_fac_rec_ag, val_fac_rec_cu, val_fac_rec_pb,val_fac_rec_zn, val_fac_rec_au, val_des_tipo_fac  from mae_val_operativo_detalle
WHERE cod_empresa = 03
  AND cod_empresa_unidad = 01
  AND val_ano = @anio
  AND val_per = @month
  AND val_des_tipo_fac = 'GENERAL';

    ";

            var result = new
            {
                cierre_periodo = new List<AperPeriodoDto>(),
                factorOperativo = new List<MaeValOperativoDto>(),
                canchas = new List<MaeValCanchasDto>(),
                factorSobredisolucion = new List<MaeFactorSobredisolucionDto>(),
                recuperacionBudget = new List<MaeFactorRecuperacionDto>(),
                factor = new List<MaeFactorDto>(),
                operativo_detalle = new List<MaeValOperativoDetalleDto>()


            };

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@month", month);
            cmd.Parameters.AddWithValue("@anio", anio);

            await conn.OpenAsync();

            using var reader = await cmd.ExecuteReaderAsync();

            // 🟩 1️⃣ Primer conjunto: CIERRE PERIODO
            while (await reader.ReadAsync())
            {
                result.cierre_periodo.Add(new AperPeriodoDto
                {
                    cie_per = reader["cie_per"].ToString(),
                    fec_ini = Convert.ToDateTime(reader["fec_ini"]),
                    fec_fin = Convert.ToDateTime(reader["fec_fin"]),
                    cie_ano = reader["cie_ano"].ToString()
                });
            }

            // 🟩 2️⃣ Segundo conjunto: FACTOR OPERATIVO
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                result.factorOperativo.Add(new MaeValOperativoDto
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
                    val_pre_au = reader["val_pre_au"].ToString(),
                });
            }

            // 🟩 3️⃣ Tercer conjunto: CANCHAS
            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                result.canchas.Add(new MaeValCanchasDto
                {
                    val_tms = reader["val_tms"].ToString(),
                    val_ag = reader["val_ag"].ToString(),
                    val_cu = reader["val_cu"].ToString(),
                    val_pb = reader["val_pb"].ToString(),
                    val_zn = reader["val_zn"].ToString(),
                    val_vpt = reader["val_vpt"].ToString()
                });
            }

            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                result.factorSobredisolucion.Add(new MaeFactorSobredisolucionDto
                {
                    val_fac_ag = reader["val_fac_ag"].ToString(),
                    val_fac_cu = reader["val_fac_cu"].ToString(),
                    val_fac_pb = reader["val_fac_pb"].ToString(),
                    val_fac_zn = reader["val_fac_zn"].ToString(),
                    val_fac_au = reader["val_fac_au"].ToString()
                });
            }

            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                result.recuperacionBudget.Add(new MaeFactorRecuperacionDto
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

            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                result.factor.Add(new MaeFactorDto
                {
                    fac_denmin = reader["fac_denmin"].ToString(),
                    fac_dendes = reader["fac_dendes"].ToString(),
                    fac_vptmin = reader["fac_dialab"].ToString(),
                    fac_dialab = reader["fac_dialab"].ToString(),
                    fac_tarhor = reader["fac_tarhor"].ToString(),

                    fac_porcum = reader["fac_porcum"].ToString(),
                    fac_porhum = reader["fac_porhum"].ToString(),
                    fac_tms_dif = reader["fac_tms_dif"].ToString()

                });
            }

            await reader.NextResultAsync();
            while (await reader.ReadAsync())
            {
                result.operativo_detalle.Add(new MaeValOperativoDetalleDto
                {
                    val_fac_rec_ag = reader["val_fac_rec_ag"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_ag"]) : (decimal?)null,
                    val_fac_rec_cu = reader["val_fac_rec_cu"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_cu"]) : (decimal?)null,
                    val_fac_rec_pb = reader["val_fac_rec_pb"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_pb"]) : (decimal?)null,
                    val_fac_rec_zn = reader["val_fac_rec_zn"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_zn"]) : (decimal?)null,
                    val_fac_rec_au = reader["val_fac_rec_au"] != DBNull.Value ? Convert.ToDecimal(reader["val_fac_rec_au"]) : (decimal?)null,
                    val_des_tipo_fac = reader["val_des_tipo_fac"].ToString(),

                });
            }



            return new
            {
                success = true,
                data = result
            };
        }

    }
}