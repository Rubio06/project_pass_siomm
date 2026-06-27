using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services;
using System.Text.Json;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Controllers
{
    [Route("mantenimiento/opciones-modelo")]
    [ApiController]
    public class ZonaController : ControllerBase
    {
        private readonly ZonaService _zonaService;

        public ZonaController(ZonaService mantZona)
        {
            _zonaService = mantZona;
        }


        //[HttpGet("empresas")]
        //public async Task<IActionResult> ObtenerEmpresa()
        //{
        //    var result = await _mantUndEconomicaService.ObtenerEmpresa();
        //    return Ok(result);
        //}

        //[HttpGet("empresas-unidad")]
        //public async Task<IActionResult> ObtenerEmpresaUnidad()
        //{
        //    var result = await _mantUndEconomicaService.ObtenerEmpresaUnidad();
        //    return Ok(result);
        //}

        [HttpGet("zona")]
        public async Task<IActionResult> ObtenerZona(string cod_empresa, string cod_empresa_unidad, string? texto_busqueda)
        {
            var result = await _zonaService.ObtenerZona(cod_empresa, cod_empresa_unidad, texto_busqueda);
            return Ok(result);
        }

        [HttpGet("jefes-turno")]
        public async Task<IActionResult> ListarUsuario()
        {
            var result = await _zonaService.ListarUsuario();
            return Ok(result);
        }

        [HttpGet("zona-codigo")]
        public async Task<IActionResult> ObtenerZonaCodigo([FromQuery] string cod_empresa, [FromQuery] string cod_empresa_unidad, [FromQuery] string cod_zona)
        {
            var result = await _zonaService.ObtenerZonaCodigo(cod_empresa, cod_empresa_unidad, cod_zona);
            return Ok(result);
        }

        [HttpGet("codigo-siguiente")]
        public IActionResult ObtenerSiguienteCodigo()
        {
            var resultado = _zonaService.ObtenerSiguienteCodigo();
            return Ok(resultado);
        }

        [HttpPost("guardar-zona")]
        public async Task<IActionResult> GuardarZona([FromBody] List<ZonaDTO> lista)
        {
            var resp = await _zonaService.GuardarZona(lista);

            return Ok(resp);
        }

        [HttpDelete("eliminar-zona")]
        public async Task<IActionResult> EliminarZona(
                [FromQuery] string cod_zona)
        {
            var resultado = await _zonaService.EliminarZona(
                cod_zona
            );

            if (!resultado.ok)
            {
                return BadRequest(new RespuestaEliminarDto
                {
                    estado = 0,
                    mensaje = resultado.mensaje
                });
            }

            return Ok(new RespuestaEliminarDto
            {
                estado = 1,
                mensaje = resultado.mensaje
            });
        }


    }
}
