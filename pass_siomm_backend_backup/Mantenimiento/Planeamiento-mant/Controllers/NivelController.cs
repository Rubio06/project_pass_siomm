using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services;
using System.Text.Json;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Controllers
{
    [Route("mantenimiento/opciones-modelo")]
    [ApiController]
    public class NivelController : ControllerBase
    {
        private readonly NivelService _nivelService;

        public NivelController(NivelService mantNivel)
        {
            _nivelService = mantNivel;
        }

        [HttpGet("nivel")]
        public async Task<IActionResult> ObtenerNivel(string? cod_empresa, string? cod_empresa_unidad, string? texto_busqueda)
        {
            try
            {
                var lista = await _nivelService.ObtenerNivel(
                    cod_empresa,
                    cod_empresa_unidad,
                    texto_busqueda
                );

                return Ok(lista);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    estado = -1,
                    mensaje = ex.Message
                });
            }
        }

        [HttpPost("guardar-nivel")]
        public async Task<IActionResult> Guardar([FromBody] List<NivelDto> lista)
        {
            var resp = await _nivelService.GuardarNivel(lista);

            return Ok(resp);
        }

        [HttpDelete("eliminar-nivel/{cod_nivel}")]
        public async Task<IActionResult> EliminarNivel(string cod_nivel)
        {
            try
            {
                ResponseEliminarDto response = await _nivelService.EliminarNivel(cod_nivel);

                return Ok(response);
            }
            catch (Exception ex)
            {
                // opcional: log del error
                return StatusCode(500, new ResponseEliminarDto
                {
                    estado = -1,
                    mensaje = ex.Message
                });
            }
        }
    }

}