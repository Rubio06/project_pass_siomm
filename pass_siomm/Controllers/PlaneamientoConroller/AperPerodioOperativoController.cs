using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Services;
using pass_siomm_backend.Services.PlaneamientoService;

namespace pass_siomm_backend.Controllers.aper_per_oper
{
    [Route("planeamiento/aper-periodo-operativo")]
    [ApiController]
    public class AperPerodioOperativoController : ControllerBase
    {
        private readonly AperPeriodoOperativoServices _AperPeriodoOperativoService;

        public AperPerodioOperativoController(AperPeriodoOperativoServices AperPeriodoOperativoService)
        {
            _AperPeriodoOperativoService = AperPeriodoOperativoService;
        }


        [HttpGet("meses")]
        public async Task<IActionResult> ObtenerMeses([FromQuery] string year)
        {
            try
            {
                var meses = await _AperPeriodoOperativoService.ObtenerMeses(year);
                return Ok(meses); // Devuelve lista de meses como JSON
            }
            catch (System.Exception ex)
            {
                // Manejo de errores
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        [HttpGet("anio")]
        public async Task<IActionResult> ObtenerAnio()
        {
            try
            {
                var anio = await _AperPeriodoOperativoService.ObtenerAnio();
                return Ok(anio); // Devuelve lista de meses como JSON
            }
            catch (System.Exception ex)
            {
                // Manejo de errores
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        [HttpGet("fechas")]
        public async Task<IActionResult> ObtenerFechas([FromQuery] string month, string anio)
        {
            try
            {
                var fechas = await _AperPeriodoOperativoService.ObtenerFecha(month, anio);

                
                return Ok(fechas); // Devuelve lista de meses como JSON
            }
            catch (System.Exception ex)
            {
                // Manejo de errores
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }
    }
}
