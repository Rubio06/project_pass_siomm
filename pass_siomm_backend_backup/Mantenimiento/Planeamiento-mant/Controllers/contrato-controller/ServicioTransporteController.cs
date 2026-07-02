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
    [Route("mantenimiento/servicio-transporte")]
    [ApiController]
    public class ServicioTranporteController : ControllerBase
    {
        private readonly ServicioTransporteService _servicioTransporte;

        public ServicioTranporteController(ServicioTransporteService servicioTransporte)
        {
            _servicioTransporte = servicioTransporte;
        }





        [HttpGet("listar-contrata")]
        public async Task<IActionResult> ListarContratasActivas()
        {
            try
            {

                var resultado = await _servicioTransporte.ListarContratasActivas();

                if (resultado == null)

                    return NotFound(new { estado = 0, mensaje = "Contrato no encontrado." });

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { estado = -1, mensaje = ex.Message });
            }
        }


        [HttpGet("listar")]
        public async Task<IActionResult> GetDetalle([FromQuery] ServicioTranporteRequestDto request)
        {
            var resultado = await _servicioTransporte.ObtenerServicioTransporte(request);

            if (resultado == null) return NotFound();

            return Ok(resultado); // 👈 Angular recibe { cabecera + parametros[] + mediciones[] }
        }

        [HttpGet("listar-equipos-contrata")]
        public async Task<IActionResult> GetEquiposContrata([FromQuery] EquiposContrataRequestDto request)
        {
            try
            {
                var resultado = await _servicioTransporte.GetEquiposContrataAsync(request);

                //if (resultado == null || resultado.Count == 0)
                //    return NotFound(new { estado = 0, mensaje = "No se encontraron equipos." });

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { estado = -1, mensaje = ex.Message });
            }
        }

        [HttpGet("parametros-contrato")]
        public async Task<IActionResult> ObtenerParametrosContrato()
        {
            var data = await _servicioTransporte.ObtenerParametrosContrato();
            return Ok(data);
        }

        [HttpGet("tabla-detalle")]
        public async Task<IActionResult> ObtenerTablaDetalle([FromQuery] string cod_tabla)
        {
            var data = await _servicioTransporte.ObtenerTablaDetalle(cod_tabla);
            return Ok(data);
        }

        [HttpGet("medicion")]
        public async Task<IActionResult> ObtenerParametroMedicion()
        {
            var data = await _servicioTransporte.ObtenerParametroMedicion();
            return Ok(data);
        }

        [HttpGet("gastos-generales")]
        public async Task<ActionResult<List<GastosGeneralesDTO>>> ObtenerGastosGenerales(
            [FromQuery] string cod_empresa,
            [FromQuery] string cod_empresa_unidad,
            [FromQuery] string cod_contrato)
        {
            try
            {
                if (string.IsNullOrEmpty(cod_empresa) || string.IsNullOrEmpty(cod_contrato))
                {
                    return BadRequest("Los parámetros codEmpresa y codContrato son obligatorios.");
                }

                // Agregamos await para esperar la respuesta de la base de datos de forma no bloqueante
                var resultado = await _servicioTransporte.ObtenerGastosGenerales(cod_empresa, cod_empresa_unidad, cod_contrato);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("costos-fijos")]
        public async Task<ActionResult<List<CostosFijosMaeDto>>> ObtenerCostosFijos()
        {
            try
            {
                // Agregamos await para la lectura asíncrona del maestro de costos fijos
                var resultado = await _servicioTransporte.ObtenerCostosFijos();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("costos-fijos-detalle")]
        public async Task<ActionResult<List<CostosFijosDetalleDto>>> ObtenerCostosFijosDetalle(
            [FromQuery] string cod_empresa,
            [FromQuery] string cod_empresa_unidad,
            [FromQuery] string cod_costo_fijo)
        {
            try
            {
                // Agregamos await para la lectura asíncrona del maestro de costos fijos
                var resultado = await _servicioTransporte.ObtenerCostosFijosDetalle(cod_empresa, cod_empresa_unidad, cod_costo_fijo);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost("insertar-gastos-generales")]
        public async Task<IActionResult> InsertarGastosGenerales([FromBody] List<GastosGeneralesDTO> filas)
        {


            if (filas == null || filas.Count == 0)
                return BadRequest(new GastosGeneralesRequestDTO
                {
                    estado = 0,
                    mensaje = "No se enviaron registros."
                });

            var resultado = await _servicioTransporte.InsertarGastosGenerales(filas);

            if (resultado.estado == 0)
                return BadRequest(resultado);

            return Ok(resultado);
        }

        [HttpDelete("eliminar-fila-costo-detalle")]
        public IActionResult Eliminar([FromBody] EntradaCostoFijoDto request)
        {
            RespuestCostoFijoDto resultado = _servicioTransporte.EliminarCostoFijoDetalle(request);

            switch (resultado.estado)
            {
                case 1:
                    return Ok(resultado);

                case 0:
                    return NotFound(resultado);

                case -1:
                    return StatusCode(500, resultado);

                default:
                    return StatusCode(500, resultado);
            }
        }

        [HttpDelete("eliminar-equipo-pesado")]
        public async Task<IActionResult> EliminarEquipoPesado([FromBody] EntradaTarifarioDto dto)
        {
            var respuesta = await _servicioTransporte.EliminarTarifarioEquipoPesadoAsync(dto);
            return Ok(respuesta);
        }

        [HttpDelete("eliminar-parametro-contrato")]
        public async Task<IActionResult> EliminarParametroContrato([FromBody] EliminarParametroContratoDto dto)
        {
            var respuesta = await _servicioTransporte.EliminarParametroContratoAsync(dto);
            return Ok(respuesta);
        }

        [HttpDelete("eliminar-det-contrato-medicion")]
        public async Task<IActionResult> EliminarDetContratoMedicion([FromBody] EliminarDetContratoMedicionDto dto)
        {
            var respuesta = await _servicioTransporte.EliminarDetContratoMedicionAsync(dto);
            return Ok(respuesta);
        }

        [HttpPost("guardar-servicios-transporte")]
        public async Task<IActionResult> GuardarContratoCompleto([FromBody] ContratoDTO contrato)
        {
            // 1. Validación inicial del modelo recibido
            if (contrato == null)
            {
                return BadRequest(new { estado = 0, mensaje = "El objeto de contrato no puede ser nulo o vacío." });
            }

            if (string.IsNullOrEmpty(contrato.cod_contrato))
            {
                return BadRequest(new { estado = 0, mensaje = "El código de contrato es obligatorio." });
            }

            try
            {
                // 2. Ejecutar la transacción de forma asíncrona en la capa de datos
                bool exito = await _servicioTransporte.GuardarContratoCompletoAsync(contrato);

                if (exito)
                {
                    // Retornamos un objeto de respuesta estándar estructurado
                    return Ok(new
                    {
                        estado = 1,
                        mensaje = $"El contrato {contrato.cod_contrato} y sus detalles se procesaron correctamente."
                    });
                }
                else
                {
                    return StatusCode(500, new { estado = 0, mensaje = "No se pudo completar la operación en la base de datos." });
                }
            }
            catch (Exception ex)
            {
                // 3. Captura cualquier error que haya hecho saltar el Rollback en el ADO.NET
                return StatusCode(500, new
                {
                    estado = 0,
                    mensaje = "Ocurrió un error interno al procesar el contrato corporativo.",
                    error = ex.Message
                });
            }
        }

        // GENERAR CODIGO POR ANIO
        [HttpGet("siguiente-codigo/{cod_contrato_anio}")]
        public async Task<IActionResult> ObtenerSiguienteCodigo(string cod_contrato_anio)
        {
            // 1. Validación básica
            if (string.IsNullOrEmpty(cod_contrato_anio) || cod_contrato_anio.Length != 4 || !int.TryParse(cod_contrato_anio, out _))
            {
                return BadRequest(new { estado = 0, mensaje = "El año proporcionado no es válido." });
            }

            try
            {
                // 2. Llamada asíncrona usando await 🔄
                string siguienteCodigo = await _servicioTransporte.ObtenerNuevoCodigoContratoAsync(cod_contrato_anio);

                if (string.IsNullOrEmpty(siguienteCodigo))
                {
                    return NotFound(new { estado = 0, mensaje = "No se pudo generar el código." });
                }

                // 3. Respuesta estructurada para Angular
                return Ok(new
                {
                    estado = 1,
                    codigoGenerado = siguienteCodigo,
                    mensaje = "Correlativo generado con éxito de forma asíncrona."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    estado = 0,
                    mensaje = "Error interno en el servidor al procesar el código.",
                    detalle = ex.Message
                });
            }
        }

    }
}