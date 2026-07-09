namespace pass_siomm_backend.Planeamiento.Balanza_Detalle.Data
{
    // ICatalogosService.cs

    public interface ICatalogosService
    {

        Task<RespuestaTicketBalanzaDto> ObtenerTicketsBalanzaAsync(EntradaTicketBalanzaDto dto);

        Task<DetalleTicketBalanzaDto?> ObtenerDetalleAsync(EntradaDetTicketBlanzaDto entrada);

        Task<List<TurnoDto>> ObtenerTurnosActivosAsync(EntradaDto entrada);
        Task<List<TipoMaterialDetalleDto>> ObtenerTipoMaterialDetalleAsync(EntradaTipoDetalleDto entrada);
        Task<List<ContrataDto>> ObtenerContratasActivasAsync(EntradaDto entrada);
        Task<List<ContratoDto>> ObtenerContratoPorContrataAsync(string cod_contrata);
        Task<List<PersonalContrataDto>> ObtenerPersonalContrataAsync(string cod_contrata);
        Task<List<TipoCarroDto>> ObtenerTipoCarroAsync();
        Task<List<EquipoContrataDto>> ObtenerEquiposContrataAsync(EntradaEquiposContrataDto entrada);
        Task<List<MaquinariaDto>> ObtenerMaquinariaAsync(EntradaDto entrada);
        Task<List<TipoLaborBlnzDto>> ObtenerTipoLaborActivoAsync();
        Task<List<LaborProgramadaDto>> ObtenerLaboresProgramadasAsync(EntradaLaboresProgramadosDto entrada);
        Task<List<AlaDto>> ObtenerAlasAsync();
        Task<List<TarifarioTransporteDto>> ObtenerTarifarioTransporteAsync(EntradaTarifarioTransporteDto entrada);
    }
}
