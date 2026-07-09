using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using pass_siomm_backend.Planeamiento.Balanza_Detalle.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services;
using System.Text.Json;

namespace pass_siomm_backend.Planeamiento.Balanza_Detalle.Services
{
    [Route("planeamiento/detalle-balanza")]
    [ApiController]
    public class BalanzaDetalleController : ControllerBase
    {
        private readonly ICatalogosService _catalogosService;

        public BalanzaDetalleController(ICatalogosService catalogosService)
        {
            _catalogosService = catalogosService;

        }

        [HttpPost("obtener-tickets-balanza")]
        public async Task<IActionResult> ObtenerTicketsBalanza([FromBody] EntradaTicketBalanzaDto dto)
        {
            var respuesta = await _catalogosService.ObtenerTicketsBalanzaAsync(dto);
            return Ok(respuesta);
        }

        // GET api/ticketbalanza/detalle?empresa=E01&unidad=U01&ticket=TB000123
        [HttpGet("obtener-ticket-detalle")]
        public async Task<ActionResult<DetalleTicketBalanzaDto>> ObtenerDetalle([FromQuery] EntradaDetTicketBlanzaDto entrada)
        {
            var opciones = new JsonSerializerOptions
            {
                WriteIndented = true
            };


            if (string.IsNullOrWhiteSpace(entrada.cod_empresa) ||
                string.IsNullOrWhiteSpace(entrada.cod_empresa_unidad) ||
                string.IsNullOrWhiteSpace(entrada.cod_ticket_balanza))
            {
                return BadRequest("Los parámetros empresa, unidad y ticket son obligatorios.");
            }

            try
            {
                var detalle = await _catalogosService.ObtenerDetalleAsync(entrada);

                return Ok(detalle);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error de base de datos al obtener el ticket de balanza {Ticket}", ticket);
                return StatusCode(500, "Ocurrió un error al consultar la información.");
            }
        }

        [HttpGet("turnos-activos")]
        public async Task<ActionResult<List<TurnoDto>>> ObtenerTurnos([FromQuery] EntradaDto entrada)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerTurnosActivosAsync(entrada);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener turnos");
                return StatusCode(500, "Error al consultar turnos.");
            }
        }

        [HttpGet("tipo-material-detalle")]
        public async Task<ActionResult<List<TipoMaterialDetalleDto>>> ObtenerTipoMaterialDetalle(
            [FromQuery] EntradaTipoDetalleDto entrada)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerTipoMaterialDetalleAsync(entrada);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener tipo material detalle");
                return StatusCode(500, "Error al consultar tipo material detalle.");
            }
        }

        [HttpGet("contratas-activas")]
        public async Task<ActionResult<List<ContrataDto>>> ObtenerContratas(
            [FromQuery] EntradaDto entrada)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerContratasActivasAsync(entrada);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener contratas");
                return StatusCode(500, "Error al consultar contratas.");
            }
        }

        [HttpGet("contratos-x-contrata")]
        public async Task<ActionResult<List<ContratoDto>>> ObtenerContratos(
            [FromQuery] string contrata)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerContratoPorContrataAsync(contrata);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener contratos");
                return StatusCode(500, "Error al consultar contratos.");
            }
        }

        [HttpGet("personal-contrata")]
        public async Task<ActionResult<List<PersonalContrataDto>>> ObtenerPersonalContrata(
            [FromQuery] string contrata)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerPersonalContrataAsync(contrata);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener personal de contrata");
                return StatusCode(500, "Error al consultar personal de contrata.");
            }
        }

        [HttpGet("tipo-carro")]
        public async Task<ActionResult<List<TipoCarroDto>>> ObtenerTipoCarro()
        {
            try
            {
                var resultado = await _catalogosService.ObtenerTipoCarroAsync();
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener tipo de carro");
                return StatusCode(500, "Error al consultar tipo de carro.");
            }
        }

        [HttpGet("equipos-contrata")]
        public async Task<ActionResult<List<EquipoContrataDto>>> ObtenerEquiposContrata(
            [FromQuery] EntradaEquiposContrataDto entrada)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerEquiposContrataAsync(entrada);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener equipos de contrata");
                return StatusCode(500, "Error al consultar equipos de contrata.");
            }
        }

        [HttpGet("maquinaria")]
        public async Task<ActionResult<List<MaquinariaDto>>> ObtenerMaquinaria(
            [FromQuery] EntradaDto entrada)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerMaquinariaAsync(entrada);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener maquinaria");
                return StatusCode(500, "Error al consultar maquinaria.");
            }
        }

        [HttpGet("tipo-labor-activo")]
        public async Task<ActionResult<List<TipoLaborBlnzDto>>> ObtenerTipoLabor()
        {
            try
            {
                var resultado = await _catalogosService.ObtenerTipoLaborActivoAsync();
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener tipo de labor");
                return StatusCode(500, "Error al consultar tipo de labor.");
            }
        }

        [HttpGet("labores-programadas")]
        public async Task<ActionResult<List<LaborProgramadaDto>>> ObtenerLaboresProgramadas([FromQuery] EntradaLaboresProgramadosDto entrada)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerLaboresProgramadasAsync(entrada);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener labores programadas");
                return StatusCode(500, "Error al consultar labores programadas.");
            }
        }

        [HttpGet("alas")]
        public async Task<ActionResult<List<AlaDto>>> ObtenerAlas()
        {
            try
            {
                var resultado = await _catalogosService.ObtenerAlasAsync();
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener alas");
                return StatusCode(500, ex);
            }
        }

        [HttpGet("tarifario-transporte")]
        public async Task<ActionResult<List<TarifarioTransporteDto>>> ObtenerTarifarioTransporte([FromQuery] EntradaTarifarioTransporteDto entrada)
        {
            try
            {
                var resultado = await _catalogosService.ObtenerTarifarioTransporteAsync(entrada);
                return Ok(resultado);
            }
            catch (SqlException ex)
            {
                //_logger.LogError(ex, "Error al obtener tarifario de transporte");
                return StatusCode(500, "Error al consultar tarifario de transporte.");
            }
        }
    }
}
