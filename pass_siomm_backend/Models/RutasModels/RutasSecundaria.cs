namespace pass_siomm_backend.Models.RutasModels
{
    public class RutasSecundaria
    {
        public int? cod_ruta_secun { get; set; }
        public string nom_ruta_secun { get; set; }

        public List<RutasTerciarias> rutas_terciarias { get; set;} = new  List<RutasTerciarias>();
    }
}
