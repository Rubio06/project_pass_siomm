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
    [Route("mantenimiento/servicio-transporte/tarifario-escritura")]
    [ApiController]
    public class TarifarioEscrituraController : ControllerBase
    {
        private readonly TarifarioEscrituraService _servicioEscrituraTarifario;

        public TarifarioEscrituraController(TarifarioEscrituraService servicioEscrituraTarifario)
        {
            _servicioEscrituraTarifario = servicioEscrituraTarifario;
        }

        [HttpDelete("eliminar-tarifario-transporte")]
        public async Task<IActionResult> EliminarTarifarioDetalle([FromBody] EliminarTarifarioTransporteDto request)
        {
            var resultado = await _servicioEscrituraTarifario.EliminarTarifarioDetalleAsync(request);

            if (resultado.estado == 1)
                return Ok(resultado);

            if (resultado.estado == 0)
                return NotFound(resultado);

            return StatusCode(500, resultado);
        }

        [HttpDelete("eliminar-tarifario-transporte-material")]
        public async Task<IActionResult> EliminarTarifarioMaterial([FromBody] EliminarTarifarioTransporteMaterialDto request)
        {
            var resultado = await _servicioEscrituraTarifario.EliminarTarifarioMaterialAsync(request);

            if (resultado.estado == 1)
                return Ok(resultado);

            if (resultado.estado == 0)
                return NotFound(resultado);

            return StatusCode(500, resultado);
        }

        [HttpDelete("eliminar-tarifario-equipos-alquiler")]
        public async Task<IActionResult> EliminarTarifarioEquiposAlquiler([FromBody] EliminarTarifarioEquiposAlquilerDto request)
        {
            var resultado = await _servicioEscrituraTarifario.EliminarTarifarioEquiposAlquilerAsync(request);

            if (resultado.estado == 1)
                return Ok(resultado);

            if (resultado.estado == 0)
                return NotFound(resultado);

            return StatusCode(500, resultado);
        }

        [HttpPost("guardar-detalle")]
        public IActionResult GuardarDetalle([FromBody] List<TarifarioDetalleDto> listaFilas)
        {
            // 1. Validación básica del Payload por seguridad
            if (listaFilas == null || listaFilas.Count == 0)
            {
                return BadRequest(new RespuestaTarifarioDto
                {
                    estado = 0,
                    mensaje = "La lista de registros no puede estar vacía."
                });
            }

            try
            {
                // 2. Llamamos a tu método ADO.NET tradicional
                RespuestaTarifarioDto resultado = _servicioEscrituraTarifario.GuardarTarifarioDetalle(listaFilas);

                // 3. Evaluamos la respuesta que devolvió el SP
                if (resultado.estado == 1)
                {
                    return Ok(resultado); // Código HTTP 200 (Éxito)
                }
                else
                {
                    return BadRequest(resultado); // Código HTTP 400 (Error de negocio controlado)
                }
            }
            catch (Exception ex)
            {
                // Error de última instancia por si algo falló antes de entrar a la transacción
                return StatusCode(500, new RespuestaTarifarioDto
                {
                    estado = 0,
                    mensaje = "Error crítico en el servidor: " + ex.Message
                });
            }
        }


        [HttpPost("guardar-rutas-fijas-balanza")]
        public IActionResult GuardarRutasFijasBalanza([FromBody] List<RutasFijasBalanzaModel> listaFilas)
        {
            // 1. Validación básica del Payload por seguridad
            if (listaFilas == null || listaFilas.Count == 0)
            {
                return BadRequest(new RespuestaTarifarioDto
                {
                    estado = 0,
                    mensaje = "La lista de registros no puede estar vacía."
                });
            }

            try
            {
                // 2. Llamamos a tu método ADO.NET tradicional
                ProcesarResult resultado = _servicioEscrituraTarifario.GuardarRutasFijasBalanza(listaFilas);

                // 3. Evaluamos la respuesta que devolvió el SP
                if (resultado.estado == 1)
                {
                    return Ok(resultado); // Código HTTP 200 (Éxito)
                }
                else
                {
                    return BadRequest(resultado); // Código HTTP 400 (Error de negocio controlado)
                }
            }
            catch (Exception ex)
            {
                // Error de última instancia por si algo falló antes de entrar a la transacción
                return StatusCode(500, new RespuestaTarifarioDto
                {
                    estado = 0,
                    mensaje = "Error crítico en el servidor: " + ex.Message
                });
            }
        }


        [HttpPost("guardar-equipos-alquiler")]
        public IActionResult GuardarAlquilerEquipo([FromBody] List<TarifarioAlquilerEquiposModel> listaFilas)
        {
            // 1. Validación básica del Payload por seguridad
            if (listaFilas == null || listaFilas.Count == 0)
            {
                return BadRequest(new RespuestaTarifarioDto
                {
                    estado = 0,
                    mensaje = "La lista de registros no puede estar vacía."
                });
            }

            try
            {
                // 2. Llamamos a tu método ADO.NET tradicional
                ProcesarResult resultado = _servicioEscrituraTarifario.GuardarTarifarioAlquilerEquipos(listaFilas);

                // 3. Evaluamos la respuesta que devolvió el SP
                if (resultado.estado == 1)
                {
                    return Ok(resultado); // Código HTTP 200 (Éxito)
                }
                else
                {
                    return BadRequest(resultado); // Código HTTP 400 (Error de negocio controlado)
                }
            }
            catch (Exception ex)
            {
                // Error de última instancia por si algo falló antes de entrar a la transacción
                return StatusCode(500, new RespuestaTarifarioDto
                {
                    estado = 0,
                    mensaje = "Error crítico en el servidor: " + ex.Message
                });
            }
        }


    }
}

