using Microsoft.Data.SqlClient;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
using System.Data;

namespace pass_siomm_backend.Services.PlaneamientoService
{
    public class SemanaAvanceServices
    {

        private readonly string _connectionString;


        public SemanaAvanceServices(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");
        }



        public async Task<bool> GuardarSemanaAsync(MaeSemanaAvanceDto semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var cmd = new SqlCommand(@"
                INSERT INTO mae_semana_avance (
                    cod_empresa, 
                    cod_empresa_unidad, 
                    cie_ano,
                    cie_per, 
                    num_semana, 
                    fec_ini, 
                    fec_fin, 
                    desc_semana,
                    usu_creo,
                    fec_creo,
                    usu_modi,
                    fec_modi
                )
                VALUES (
                    @cod_empresa,
                    @cod_empresa_unidad, 
                    @cie_ano, 
                    @cie_per, 
                    @num_semana, 
                    @fec_ini, 
                    @fec_fin, 
                    @desc_semana,
                    @usu_creo,
                    @fec_creo,
                    @usu_modi,
                    @fec_modi
                )", connection))
                    {
                        cmd.Parameters.AddWithValue("@cod_empresa", semana.cod_empresa);
                        cmd.Parameters.AddWithValue("@cod_empresa_unidad", semana.cod_empresa_unidad);
                        cmd.Parameters.AddWithValue("@cie_ano", semana.cie_ano);
                        cmd.Parameters.AddWithValue("@cie_per", semana.cie_per);

                        cmd.Parameters.AddWithValue("@num_semana", semana.num_semana);
                        cmd.Parameters.AddWithValue("@fec_ini", semana.fec_ini ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@fec_fin", semana.fec_fin ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@desc_semana", semana.desc_semana);

                        cmd.Parameters.AddWithValue("@usu_creo", semana.usu_creo);
                        cmd.Parameters.AddWithValue("@fec_creo", semana.fec_creo ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@usu_modi", semana.usu_modi ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@fec_modi", semana.fec_modi ?? (object)DBNull.Value);

                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al guardar la semana: " + ex.Message);
                return false;
            }
        }



        public async Task<bool> EliminarSemanaAvance(MaeSemanaAvanceEliminarDto semana)
        {

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new SqlCommand(@"
                        DELETE FROM mae_semana_avance
                        WHERE num_semana = @num_semana
                        AND CAST(fec_ini AS DATE) = @fec_ini
                        AND CAST(fec_fin AS DATE) = @fec_fin
                        AND desc_semana = @desc_semana", connection))
                    {
                        cmd.Parameters.AddWithValue("@num_semana", semana.num_semana);
                        cmd.Parameters.Add("@fec_ini", SqlDbType.Date).Value = semana.fec_ini?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@fec_fin", SqlDbType.Date).Value = semana.fec_fin?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.AddWithValue("@desc_semana", semana.desc_semana);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;

            }



        }


        public async Task<bool> EliminarSemanaCiclo(MaeSemanaAvanceEliminarDto semana)
        {

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new SqlCommand(@"
                        DELETE FROM mae_semana_periodo
                        WHERE num_semana = @num_semana
                        AND CAST(fec_ini AS DATE) = @fec_ini
                        AND CAST(fec_fin AS DATE) = @fec_fin
                        AND desc_semana = @desc_semana", connection))
                    {
                        cmd.Parameters.AddWithValue("@num_semana", semana.num_semana);
                        cmd.Parameters.Add("@fec_ini", SqlDbType.Date).Value = semana.fec_ini?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@fec_fin", SqlDbType.Date).Value = semana.fec_fin?.Date ?? (object)DBNull.Value;
                        cmd.Parameters.AddWithValue("@desc_semana", semana.desc_semana);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;

            }



        }



        public async Task<bool> EliminarMetodoMinado(MaePerMetExplotacionEliminarDto semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string sql = @"
                DELETE FROM mae_per_met_explotacion
                WHERE cie_ano = @anio
                  AND cie_per = @mes
                  AND cod_metexp = @cod_metexp
            ";

                    using (var cmd = new SqlCommand(sql, connection))
                    {
                        cmd.Parameters.AddWithValue("@anio", semana.anio);
                        cmd.Parameters.AddWithValue("@mes", semana.mes);
                        cmd.Parameters.AddWithValue("@cod_metexp", semana.cod_metexp);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;
            }
        }

        public async Task<bool> EliminarEstandarExploracion(MaeExploEstandarEliminar semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string sql = @"
                DELETE FROM mae_exp_estandar
                WHERE cie_ano = @anio
                  AND cie_per = @mes
                  AND cod_zona = @cod_zona
            ";

                    using (var cmd = new SqlCommand(sql, connection))
                    {
                        cmd.Parameters.AddWithValue("@anio", semana.anio);
                        cmd.Parameters.AddWithValue("@mes", semana.mes);
                        cmd.Parameters.AddWithValue("@cod_zona", semana.cod_zona);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;
            }
        }


        public async Task<bool> EliminarEstandarAvance(MaeLaboratorioEstandarEliminarDto semana)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string sql = @"
                DELETE FROM mae_tip_lab_estandar
                WHERE cie_ano = @anio
                  AND cie_per = @mes
                  AND cod_tiplab = @cod_tiplab
            ";

                    using (var cmd = new SqlCommand(sql, connection))
                    {
                        cmd.Parameters.AddWithValue("@anio", semana.anio);
                        cmd.Parameters.AddWithValue("@mes", semana.mes);
                        cmd.Parameters.AddWithValue("@cod_tiplab", semana.cod_tiplab);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al eliminar la semana: " + ex.Message);
                return false;
            }
        }
    }



}
