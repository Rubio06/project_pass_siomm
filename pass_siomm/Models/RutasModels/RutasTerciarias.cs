namespace pass_siomm_backend.Models.RutasModels
{
    public class RutasTerciarias
    {
        public int? cod_ruta_terc { get; set; }
        public string nom_ruta_terc { get; set; }


        public List<RutasCuartas> rutas_cuartas { get; set; } = new List<RutasCuartas>();

    }
}
