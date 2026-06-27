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
    public class TipoLaborController : ControllerBase
    {
        private readonly TipoLaborService _tipoLaborService;

        public TipoLaborController(TipoLaborService mantTipoLabor)
        {
            _tipoLaborService = mantTipoLabor;
        }

        [HttpGet("tipo-labor")]
        public async Task<IActionResult> ObtenerNivel(string? cod_empresa, string? cod_empresa_unidad, string? texto_busqueda)
        {
            try
            {
                var lista = await _tipoLaborService.ObtenerTipoLabor(
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

        [HttpPost("guardar-tipo-labor")]
        public async Task<IActionResult> Guardar([FromBody] List<TipoLaborDto> lista)
        {
            var resp = await _tipoLaborService.GuardarTipoLabor(lista);

            return Ok(resp);
        }

        [HttpDelete("eliminar-tipo-labor/{cod_tipo_labor}")]
        public async Task<IActionResult> EliminarTipoLabor(string cod_tipo_labor)
        {
            try
            {
                ResponseEliminarDto response = await _tipoLaborService.EliminarTipoLabor(cod_tipo_labor);

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