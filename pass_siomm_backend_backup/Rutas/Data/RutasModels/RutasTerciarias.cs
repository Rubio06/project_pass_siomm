namespace pass_siomm_backend.Rutas.Data.RutasModels
{
    public class RutasTerciarias
    {
        public int? cod_ruta_terc { get; set; }
        public string nom_ruta_terc { get; set; }

<<<<<<< HEAD
        public string est_ruta_terc { get; set; }
=======
>>>>>>> c45079df0e0a1b70654d02127f049dfe2b624190

        public List<RutasCuartas> rutas_cuartas { get; set; } = new List<RutasCuartas>();

    }
}
