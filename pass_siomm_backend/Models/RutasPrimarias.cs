namespace pass_siomm_backend.Models
{
    public class RutasPrimarias
    {
        public int cod_ruta_primer { get; set; }
        public string nom_ruta_primer { get; set; }
        public List<RutasSecundaria> rutas_secundarias { get; set; } = new List<RutasSecundaria>();

    }
}


