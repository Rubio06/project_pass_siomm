namespace pass_siomm_backend.Data.Dto.PlaneamientoDto
{
    public class DatosCompletosDto
    {
        public List<AperPeriodoDto> cierre_periodo { get; set; } = new();
        public List<MaeValOperativoDto> factorOperativo { get; set; } = new();
        public List<MaeValCanchasDto> canchas { get; set; } = new();
        public List<MaeFactorSobredisolucionDto> factorSobredisolucion { get; set; } = new();
        public List<MaeFactorRecuperacionDto> recuperacionBudget { get; set; } = new();
        public List<MaeFactorDto> factor { get; set; } = new();
        public List<MaeValOperativoDetalleDto> operativo_detalle { get; set; } = new();
        public List<MaeLaboratorioEstandarDto> laboratorio_estandar { get; set; } = new();
        public List<MaePerMetExplotacionDto> metodo_minado { get; set; } = new();
        public List<MaeSemanaCicloDto> semana_ciclo { get; set; } = new();
        public List<MaeSemanaAvanceDto> semana_avance { get; set; } = new();

        public List<MaeExploEstandar> exploracion_extandar { get; set; } = new();



    }
}
