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
    public class LaborController : ControllerBase
    {
        private readonly LaborService _laborService;

        public LaborController(LaborService mantLabor)
        {
            _laborService = mantLabor;
        }

        [HttpGet("labor-mant")]
        public async Task<IActionResult> ObtenerLabor([FromQuery] FiltroMantDto filtro)
        {
            try
            {
                PaginacionLaborDto lista = await _laborService.ObtenerLabor(filtro);

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

        [HttpGet("zonas-mant")]
        public async Task<IActionResult> ObtenerZonas(string? cod_empresa, string? cod_empresa_unidad)
        {
            try
            {
                var response = await _laborService.ObtenerZonas(
                    cod_empresa,
                    cod_empresa_unidad
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("maestros-labores-mant")]
        public async Task<IActionResult> ObtenerMaestrosLabor(string? cod_empresa, string? cod_empresa_unidad)
        {
            try
            {
                var response = await _laborService.ObtenerMaestrosLabor(
                    cod_empresa,
                    cod_empresa_unidad
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("eliminar-labor")]
        public async Task<IActionResult> EliminarLabor([FromBody] LaborMantDto data)
        {
            try
            {
                ResponseEliminarDto response = await _laborService.EliminarLabor(data);

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

        [HttpPost("guardar-labor")]
        public async Task<IActionResult> Guardar([FromBody] List<LaborMantDto> lista)
        {

            ResponseLaborMantDto resp = await _laborService.GuardarLabor(lista);

            return Ok(resp);
        }


    }

}