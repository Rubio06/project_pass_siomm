using Microsoft.Data.SqlClient;
using pass_siomm.Data;
using pass_siomm_backend.Models.RutasModels;
using System.Configuration;

namespace pass_siomm_backend.Services
{
    public class RoutesService
    {
        private readonly string _connectionString;

        public RoutesService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqlConnection");

        }
        public async Task<List<RutasPrimarias>> ObtenerRutas()
        {
            var rutas = new List<RutasPrimarias>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand(SqlQueries.SP_GET_OBTENER_RUTAS, conn))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                await conn.OpenAsync();
                var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    AgregarRutas(rutas, reader);
                }
            }

            return rutas;
        }

        private void AgregarRutas(List<RutasPrimarias> rutas, SqlDataReader reader)
        {
            int codRutaPrimer = reader.GetInt32(0);
            string nomRutaPrimer = reader.GetString(1);

            var rutaPrincipal = rutas.FirstOrDefault(r => r.cod_ruta_primer == codRutaPrimer);
            if (rutaPrincipal == null)
            {
                rutaPrincipal = new RutasPrimarias
                {
                    cod_ruta_primer = codRutaPrimer,
                    nom_ruta_primer = nomRutaPrimer,
                    rutas_secundarias = new List<RutasSecundaria>()
                };
                rutas.Add(rutaPrincipal);
            }

            AgregarRutaSecundaria(rutaPrincipal, reader);
        }

        private void AgregarRutaSecundaria(RutasPrimarias rutaPrincipal, SqlDataReader reader)
        {
            if (!reader.IsDBNull(2))
            {
                int codRutaSecun = reader.GetInt32(2);
                string nomRutaSecun = reader.GetString(3);

                var rutaSec = rutaPrincipal.rutas_secundarias.FirstOrDefault(rs => rs.cod_ruta_secun == codRutaSecun);
                if (rutaSec == null)
                {
                    rutaSec = new RutasSecundaria
                    {
                        cod_ruta_secun = codRutaSecun,
                        nom_ruta_secun = nomRutaSecun,
                        rutas_terciarias = new List<RutasTerciarias>()
                    };
                    rutaPrincipal.rutas_secundarias.Add(rutaSec);
                }

                AgregarRutaTerciaria(rutaSec, reader);
            }
        }

        private void AgregarRutaTerciaria(RutasSecundaria rutaSec, SqlDataReader reader)
        {
            if (!reader.IsDBNull(4))
            {
                int codRutaTerc = reader.GetInt32(4);
                string nomRutaTerc = reader.GetString(5);

                var rutaTerc = rutaSec.rutas_terciarias.FirstOrDefault(rt => rt.cod_ruta_terc == codRutaTerc);
                if (rutaTerc == null)
                {
                    rutaTerc = new RutasTerciarias
                    {
                        cod_ruta_terc = codRutaTerc,
                        nom_ruta_terc = nomRutaTerc,
                        rutas_cuartas = new List<RutasCuartas>()
                    };
                    rutaSec.rutas_terciarias.Add(rutaTerc);
                }

                AgregarRutaCuaternaria(rutaTerc, reader);
            }
        }

        private void AgregarRutaCuaternaria(RutasTerciarias rutaTerc, SqlDataReader reader)
        {
            if (!reader.IsDBNull(6))
            {
                int codRutaCuar = reader.GetInt32(6);
                string nomRutaCuar = reader.GetString(7);

                var rutaCuar = rutaTerc.rutas_cuartas.FirstOrDefault(rc => rc.cod_ruta_cuar == codRutaCuar);
                if (rutaCuar == null)
                {
                    rutaCuar = new RutasCuartas
                    {
                        cod_ruta_cuar = codRutaCuar,
                        nom_ruta_cuar = nomRutaCuar,
                        opciones = new List<RutasOpciones>()
                    };
                    rutaTerc.rutas_cuartas.Add(rutaCuar);
                }

                // Agregar opciones si existen
                if (!reader.IsDBNull(14))
                {
                    rutaCuar.opciones.Add(new RutasOpciones
                    {
                        cod_ruta_opc = reader.GetInt32(14),
                        nom_ruta_opc = reader.GetString(15)
                    });
                }
            }
        }












    }
}
