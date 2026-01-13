namespace pass_siomm_backend.Models.RutasModels
{
    public class RutasCuartas
    {
        public int? cod_ruta_cuar { get; set; }
        public string nom_ruta_cuar { get; set; }
        public List<RutasOpciones> opciones { get; internal set; }
    }
}
