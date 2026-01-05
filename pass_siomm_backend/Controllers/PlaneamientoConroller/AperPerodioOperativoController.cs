using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
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
                return Ok(meses);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        [HttpGet("anio")]
        public async Task<IActionResult> ObtenerAnio()
        {
            try
            {
                var anio = await _AperPeriodoOperativoService.ObtenerAnio();
                return Ok(anio);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        //[HttpGet("fechas")]
        //public async Task<IActionResult> ObtenerFechas([FromQuery] string month, string anio)
        //{
        //    try
        //    {
        //        var fechas = await _AperPeriodoOperativoService.ObtenerFecha(month, anio);


        //        return Ok(fechas);
        //    }
        //    catch (System.Exception ex)
        //    {
        //        return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
        //    }
        //}

        [HttpGet("obtener-datos")]
        public async Task<IActionResult> FactorOperativo([FromQuery] string month, string anio)
        {
            try
            {
                var fechas = await _AperPeriodoOperativoService.ObtenerDatosCompletos(month, anio);
                Console.WriteLine(fechas);

                return Ok(fechas);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        [HttpGet("select-tipo-labor")]
        public async Task<IActionResult> SelectMetTipoLabor()
        {
            try
            {
                var exploracion = await _AperPeriodoOperativoService.SelectMetTipoLabor();
                return Ok(exploracion);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        [HttpGet("select-zona")]
        public async Task<IActionResult> SelectZona()
        {
            try
            {
                var zona = await _AperPeriodoOperativoService.SelectMetZona();
                return Ok(zona);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        [HttpGet("select-exploracion")]
        public async Task<IActionResult> SelectExploracion()
        {
            try
            {
                var zona = await _AperPeriodoOperativoService.SelectExploracion();
                return Ok(zona);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }
    }
}
