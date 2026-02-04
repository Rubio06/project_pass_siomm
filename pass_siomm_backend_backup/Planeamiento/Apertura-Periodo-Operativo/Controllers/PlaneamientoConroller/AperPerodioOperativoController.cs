using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Planeamiento.Services.PlaneamientoService;


namespace pass_siomm_backend.Planeamiento.Controllers.PlaneamientoConroller
{
    [Authorize]
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
                var anio = await _AperPeriodoOperativoService.ObtenerAnio();
                return Ok(anio);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }


        [HttpGet("obtener-datos")]
        public async Task<IActionResult> FactorOperativo([FromQuery] string month, string anio)
        {
            try
            {
                var fechas = await _AperPeriodoOperativoService.ObtenerDatosCompletos(month, anio);
                Console.WriteLine(fechas);

                return Ok(fechas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
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
            catch (Exception ex)
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
            catch (Exception ex)
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }

        //BLOQUEO DE SELECTS

        [HttpGet("select-lab-estandar-bloqueo")]
        public async Task<IActionResult> labEstandarBloqueo([FromQuery] string anio, [FromQuery] string mes, [FromQuery] string tipoConsulta)
        {
            try
            {
                var zona = await _AperPeriodoOperativoService.labEstandarBloqueo(anio, mes, tipoConsulta);
                return Ok(zona);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }


        [HttpGet("lista-enteros-num-semana")]
        public async Task<IActionResult> listaEnterosConFecha([FromQuery] string anio, [FromQuery] string mes, [FromQuery] string tipoConsulta)
        {
            try
            {
                var zona = await _AperPeriodoOperativoService.listaEnterosConFecha(anio, mes, tipoConsulta);
                return Ok(zona);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los meses: {ex.Message}");
            }
        }


    }
}
