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
    public class RutasTransporteMovimientoController : ControllerBase
    {
        private readonly RutasTransporteMovimientoService _rutasTranporteMovimientoService;

        public RutasTransporteMovimientoController(RutasTransporteMovimientoService mantRutaTransporteMovimiento)
        {
            _rutasTranporteMovimientoService = mantRutaTransporteMovimiento;
        }

        [HttpGet("rutas-transporte-movimiento")]
        public async Task<IActionResult> ObtenerRutasTransporteMovimiento(string? cod_empresa, string? cod_empresa_unidad, string? texto_busqueda)
        {
            try
            {
                var lista = await _rutasTranporteMovimientoService.ObtenerRutasTransporteMovimiento(
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

        [HttpGet("rutas-transporte-movimiento-lista")]
        public async Task<IActionResult> ListarRutasTransporte()
        {
            try
            {
                var lista =
                    await _rutasTranporteMovimientoService
                        .ListarRutasTransporte();

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


        [HttpGet("obtener-codigo-ruta-transporte-movimiento")]
        public async Task<IActionResult> ObtenerSiguienteCodigo()
        {
            try
            {
                string codigo = await _rutasTranporteMovimientoService
                    .ObtenerSiguienteCodigoRutaMovimientoAsync();

                return Ok(codigo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("guardar-ruta-transporte-movimiento")]
        public async Task<IActionResult> GuardarRutaTransporteMovimiento([FromBody] List<RutasTransporteMovimientoDto> lista)
        {
            var resp = await _rutasTranporteMovimientoService.GuardarRutaTransporteMovimiento(lista);

            return Ok(resp);
        }

        [HttpDelete("eliminar-ruta-transporte-movimiento/{cod_ruta_transporte}")]
        public async Task<IActionResult> EliminarRutaTransporteMovimiento(string cod_ruta_transporte)
        {
            try
            {
                ResponseEliminarDto response = await _rutasTranporteMovimientoService.EliminarRutaTransporteMovimiento(cod_ruta_transporte);

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