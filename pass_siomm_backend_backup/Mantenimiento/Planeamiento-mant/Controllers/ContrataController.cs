using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Autenticacion.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Data;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services;
using System.Text.Json;

namespace pass_siomm_backend.Mantenimiento.Planeamiento_mant.Controllers
{
    [Route("mantenimiento/opciones-modelo")]
    [ApiController]
    public class ContrataController : ControllerBase
    {
        private readonly ContrataService _contrataService;

        public ContrataController(ContrataService mantContrata)
        {
            _contrataService = mantContrata;
        }

        [HttpGet("contrata")]
        public async Task<IActionResult> ObtenerContrata(string? cod_empresa, string? texto_busqueda)
        {
            try
            {
                var lista = await _contrataService.ObtenerContrata(
                    cod_empresa,
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

        [HttpPost("guardar-contrata")]
        public async Task<IActionResult> Guardar([FromBody] List<ContrataMantDto> lista)
        {
            var resp = await _contrataService.GuardarContrata(lista);

            return Ok(resp);
        }

        [HttpGet("obtener-codigo-contrata")]
        public async Task<IActionResult> ObtenerSiguienteCodigo()
        {
            try
            {
                string codigo = await _contrataService
                    .ObtenerSiguienteCodigoContratasync();

                return Ok(codigo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("eliminar-contrata/{cod_contrata}")]
        public async Task<IActionResult> EliminarContrata(string cod_contrata)
        {
            try
            {
                ResponseEliminarDto response = await _contrataService.EliminarContrata(cod_contrata);

                if (response.estado == 1)
                    return Ok(response);

                if (response.estado == 0)
                    return BadRequest(response);

                return StatusCode(500, response);
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