namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class DatosCompletosGuardarDto
    {
        public List<AperPeriodoCierreGuardarDto> cierre_periodo { get; set; } = new();
        public List<MaeFactorGuardarDto> factor { get; set; } = new();
        public List<MaeFactorOperativoGuardarDto> factorOperativo { get; set; } = new();

        public List<MaeValOperativoDetalleGuardarDto> operativo_detalle { get; set; } = new();

        public List<MaeValCanchasGuardarDto> canchas { get; set; } = new();

        public List<MaeFactorSobredisolucionGuardarDto> factorSobredisolucion { get; set; } = new();


        public List<MaeFactorRecuperacionGuardarDto> recuperacionBudget { get; set; } = new();

        public List<MaeLaboratorioEstandarGuardarDto> laboratorio_estandar { get; set; } = new();

        public List<MaePerMetExplotacionGuardarDto> metodo_minado { get; set; } = new();

        public List<MaeSemanaCicloGuardarDto> semana_ciclo { get; set; } = new();


        public List<MaeSemanaAvanceGuardarDto> semana_avance { get; set; } = new();



        public List<MaeExploEstandarGuardarDto> exploracion_extandar { get; set; } = new();

        public string? username { get; set; }

        public string? modo { get; set; } // "N" o "E"



    }
}
