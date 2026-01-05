namespace pass_siomm_backend.Models.RutasModels
{
    public class RutasOpciones
    {
        public int cod_ruta_opc { get; set; }
        public string nom_ruta_opc { get; set; }

        public string Pk_cod_ruta_primer { get; set; }

        public string Pk_cod_ruta_secun { get; set; }

        public string Pk_cod_ruta_terc { get; set; }

        public string Pk_cod_ruta_cuar { get; set; }

        public List<RutasPrimarias> rutas_primarias_fk { get; set; } = new List<RutasPrimarias>();

        public List<RutasSecundaria> rutas_secundarias_fk { get; set; } = new List<RutasSecundaria>();

        public List<RutasTerciarias> rutas_terciarias_fk { get; set; } = new List<RutasTerciarias>();

        public List<RutasCuartas> rutas_cuartas_fk { get; set; } = new List<RutasCuartas>();

    }
}
