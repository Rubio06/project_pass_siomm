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
    public class VetaController : ControllerBase
    {
        private readonly VetaService _vetaService;

        public VetaController(VetaService mantVeta)
        {
            _vetaService = mantVeta;
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

        [HttpGet("veta")]
        public async Task<IActionResult> ObtenerZona(string cod_empresa, string cod_empresa_unidad, string? texto_busqueda)
        {
            var result = await _vetaService.ObtenerVeta(cod_empresa, cod_empresa_unidad, texto_busqueda);
            return Ok(result);
        }

        [HttpGet("veta-codigo")]
        public async Task<IActionResult> ObtenerVetaCodigo([FromQuery] string cod_empresa, [FromQuery] string cod_empresa_unidad, [FromQuery] string cod_veta, [FromQuery] string cod_zona, [FromQuery] string cod_und_econom)
        {
            var result = await _vetaService.ObtenerVetaCodigo(cod_empresa, cod_empresa_unidad,  cod_veta, cod_zona, cod_und_econom);
            return Ok(result);
        }

        [HttpGet("listas-select")]
        public async Task<IActionResult> ObtenerListasSelect(
            string cod_empresa,
            string cod_empresa_unidad)
        {
            try
            {
                var response = await _vetaService.ObtenerListasSelect(
                    cod_empresa,
                    cod_empresa_unidad);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    estado = 0,
                    mensaje = ex.Message
                });
            }
        }

        //[HttpDelete("eliminar-veta")]
        //public async Task<IActionResult> EliminarVeta([FromBody] EliminarVetaDto dto)
        //{
        //    try
        //    {
        //        RespuestaDto respuesta = await _vetaService.EliminarVetaAsync(dto);

        //        if (respuesta.estado == 1)
        //        {
        //            return Ok(respuesta);
        //        }

        //        return BadRequest(respuesta);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new RespuestaDto
        //        {
        //            estado = -1,
        //            mensaje = ex.Message
        //        });
        //    }
        //}

        [HttpDelete("eliminar-veta")]
        public async Task<IActionResult> EliminarVeta([FromQuery] string cod_veta, [FromQuery] string cod_zona, [FromQuery] string cod_und_econom)
        {
            try
            {
                ResponseEliminarDto response = await _vetaService.EliminarVeta(cod_veta, cod_zona, cod_und_econom);

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



        [HttpPost("guardar-veta")]
        public async Task<IActionResult> GuardarVeta([FromBody] List<VetaDto> lista)
        {
            var resp = await _vetaService.GuardarVeta(lista);

            return Ok(resp);
        }

        //[HttpGet("jefes-turno")]
        //public IActionResult ObtenerJefesTurno()
        //{
        //    var resultado = _zonaService.ObtenerUsuariosJefeTurno();
        //    return Ok(resultado);
        //}

        //[HttpGet("codigo-siguiente")]
        //public IActionResult ObtenerSiguienteCodigo()
        //{
        //    var resultado = _zonaService.ObtenerSiguienteCodigo();
        //    return Ok(resultado);
        //}



        //[HttpDelete("eliminar-zona")]
        //public async Task<IActionResult> EliminarZona(
        //        [FromQuery] string cod_empresa,
        //        [FromQuery] string cod_empresa_unidad,
        //        [FromQuery] string cod_zona)
        //{
        //    var resultado = await _zonaService.EliminarZona(
        //        cod_empresa,
        //        cod_empresa_unidad,
        //        cod_zona
        //    );

        //    if (!resultado.ok)
        //    {
        //        return BadRequest(new RespuestaEliminarDto
        //        {
        //            estado = 0,
        //            mensaje = resultado.mensaje
        //        });
        //    }

        //    return Ok(new RespuestaEliminarDto
        //    {
        //        estado = 1,
        //        mensaje = resultado.mensaje
        //    });
        //}


    }
}
