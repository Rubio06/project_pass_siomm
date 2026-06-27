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
    public class RutasTransporteController : ControllerBase
    {
        private readonly RutasTransporteService _rutasTranporteService;

        public RutasTransporteController(RutasTransporteService mantRutaTransporte)
        {
            _rutasTranporteService = mantRutaTransporte;
        }

        [HttpGet("rutas-transporte")]
        public async Task<IActionResult> ObtenerRutasTransporte(string? cod_empresa, string? cod_empresa_unidad, string? texto_busqueda)
        {
            try
            {
                var lista = await _rutasTranporteService.ObtenerRutasTransporte(
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

        [HttpGet("obtener-codigo-ruta-transporte")]
        public async Task<IActionResult> ObtenerSiguienteCodigo()
        {
            try
            {
                string codigo = await _rutasTranporteService
                    .ObtenerSiguienteCodigoRutaAsync();

                return Ok(codigo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("guardar-ruta-transporte")]
        public async Task<IActionResult> GuardarRutaTransporte([FromBody] List<RutasTransporteDto> lista)
        {
            var resp = await _rutasTranporteService.GuardarRutaTransporte(lista);

            return Ok(resp);
        }

        [HttpDelete("eliminar-ruta-transporte/{cod_ruta}")]
        public async Task<IActionResult> EliminarRutaTramsporte(string cod_ruta)
        {
            try
            {
                ResponseEliminarDto response = await _rutasTranporteService.EliminarRutaTramsporte(cod_ruta);

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