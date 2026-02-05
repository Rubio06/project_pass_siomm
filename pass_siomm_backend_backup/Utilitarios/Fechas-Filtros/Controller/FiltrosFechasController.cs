using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Planeamiento.Services.PlaneamientoService;
using pass_siomm_backend.Utilitarios.Fechas_Filtros.Servicio;

namespace pass_siomm_backend.Utilitarios.Fechas_Filtros.Controller
{

    [Authorize]
    [Route("fechas-filtros/select-data")]
    [ApiController]
    public class FiltrosFechasController: ControllerBase
    {
        private readonly FiltrosFechasService _filtrosFechasService;

        public FiltrosFechasController(FiltrosFechasService filtrosFechasService)
        {
            _filtrosFechasService = filtrosFechasService;
        }


        [HttpGet("meses")]
        public async Task<IActionResult> ObtenerMeses([FromQuery] string year)
        {
            try
            {
                var meses = await _filtrosFechasService.ObtenerMeses(year);
                return Ok(meses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        [HttpGet("anio")]
        public async Task<IActionResult> ObtenerAnio()
        {
            try
            {
                var anio = await _filtrosFechasService.ObtenerAnio();
                return Ok(anio);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

    }
}
