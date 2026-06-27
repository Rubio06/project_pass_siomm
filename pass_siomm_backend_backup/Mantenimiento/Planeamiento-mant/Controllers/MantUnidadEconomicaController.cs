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
    public class UnidadEconomicaMantController : ControllerBase
    {
        private readonly ManteUndEconomicaService _mantUndEconomicaService;

        public UnidadEconomicaMantController(ManteUndEconomicaService manteUndEconomica)
        {
            _mantUndEconomicaService = manteUndEconomica;
        }


        [HttpGet("empresas")]
        public async Task<IActionResult> ObtenerEmpresa()
        {
            var result = await _mantUndEconomicaService.ObtenerEmpresa();
            return Ok(result);
        }

        [HttpGet("empresas-unidad")]
        public async Task<IActionResult> ObtenerEmpresaUnidad()
        {
            var result = await _mantUndEconomicaService.ObtenerEmpresaUnidad();
            return Ok(result);
        }

        [HttpGet("unidad-economica")]
        public async Task<IActionResult> ObtenerUndEconomica([FromQuery] string cod_empresa, [FromQuery] string cod_empresa_unidad, [FromQuery] string? texto_busqueda)
        {
            var result = await _mantUndEconomicaService.ObtenerUndEconomica(cod_empresa, cod_empresa_unidad, texto_busqueda);
            return Ok(result);
        }

        [HttpPost("guardar-unidad-economica")]
        public async Task<IActionResult> InsertarUnidadEconomica([FromBody] List<InsertarUndEconomDto> data)
        {

            var result = await _mantUndEconomicaService.InsertarUnidadEconomica(data);
            return Ok(result);
        }

        [HttpDelete("eliminar-unidad-economica")]
        public async Task<IActionResult> EliminarUndEconomica(
            [FromQuery] string cod_empresa,
            [FromQuery] string cod_empresa_unidad,
            [FromQuery] string cod_und_economica)
        {
            var resultado = await _mantUndEconomicaService.EliminarUndEconomica(
                cod_empresa,
                cod_empresa_unidad,
                cod_und_economica
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

        [HttpGet("siguiente-codigo-unidad-economica")]
        public async Task<IActionResult> ObtenerSiguienteCodigoUnidadEconomica()
        {
            try
            {
                var codigo = await _mantUndEconomicaService.ObtenerSiguienteCodigoUnidadEconomica();

                return Ok(codigo);
            }
            catch (Exception ex)
            {
                return BadRequest(new RespuestaDto
                {
                    estado = 0,
                    mensaje = ex.Message
                });
            }
        }


    }
}
