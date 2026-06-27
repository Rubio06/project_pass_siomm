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
    [Route("mantenimiento/servicio-transporte/precio-unitario")]
    [ApiController]
    public class PrecioUnitarioController : ControllerBase
    {
        private readonly PreciosUnitariosService _servicioPrecioUnitario;
        private readonly HttpClient _httpClient;

        public PrecioUnitarioController(PreciosUnitariosService servicioPrecioUnitario, IHttpClientFactory httpClientFactory)
        {
            _servicioPrecioUnitario = servicioPrecioUnitario;
            _httpClient = httpClientFactory.CreateClient();

        }

        [HttpGet("listar-actividad-tarea")]
        public async Task<IActionResult> ListarActividadesVigentes()
        {
            try
            {
                // Consumo asíncrono con await hacia la capa de datos
                var resultado = await _servicioPrecioUnitario.ListarActividadesVigentesAsync();

                if (resultado == null || resultado.Count == 0)
                {
                    return NoContent(); // HTTP 204 si no encuentra registros
                }

                return Ok(resultado); // HTTP 200 con la lista en formato JSON
            }
            catch (Exception ex)
            {
                // Manejo seguro de excepciones internas
                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error interno en el servidor al listar las actividades.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("buscar-catalogo-tarea")]
        public async Task<IActionResult> BuscarCatalogoTarea(
            [FromQuery] EntradaActividadTareaMantDto entrada)
        {
            // Validaciones de parámetros obligatorios de contexto (Empresa y Unidad de Minado)
            if (string.IsNullOrWhiteSpace(entrada.cod_empresa) || string.IsNullOrWhiteSpace(entrada.cod_empresa_unidad))
            {
                return BadRequest(new { mensaje = "Los parámetros codEmpresa y codUnidad son estrictamente obligatorios." });
            }

            try
            {
                // Invocación asíncrona hacia el repositorio ADO.NET
                var resultado = await _servicioPrecioUnitario.BuscarCatalogoTareaAsync(entrada);

                if (resultado == null || resultado.Count == 0)
                {
                    return NoContent(); // Retorna HTTP 204 si la búsqueda no arroja coincidencias
                }

                return Ok(resultado); // Retorna HTTP 200 con la lista mapeada en formato JSON
            }
            catch (Exception ex)
            {
                // Captura segura de excepciones internas del servidor o de base de datos
                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error interno en el servidor al realizar la búsqueda en el catálogo.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("listar-partidas-pu")]
        public async Task<ActionResult<List<PartidaPuDto>>> ListarPartidasPu([FromQuery] EntradaPartidasPuDto entrada)
        {
            try
            {
                if (entrada == null)
                {
                    return BadRequest("Los parámetros de entrada son requeridos.");
                }

                var resultado = await _servicioPrecioUnitario.ListarPartidasPuAsync(entrada);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al listar las partidas.", detalle = ex.Message });
            }
        }

        [HttpPost("insertar-partidas-pu")]
        public async Task<IActionResult> InsertarPartida([FromBody] List<PartidaPuInsertDto> dto)
        {
            if (dto == null || dto.Count == 0)
            {
                return BadRequest(new { mensaje = "Los parámetros de inserción estructural no fueron suministrados o la lista está vacía." });
            }

            try
            {
                // 1. Invocamos el flujo masiva que devuelve List<RespuestaSpDto>
                List<RespuestaSpDto> resultadosBd = await _servicioPrecioUnitario.EjecutarInsercionPartidasMasivaAsync(dto);

                // 2. Buscamos si alguna de las operaciones devolvió un error controlado en el SP
                var partidaConError = resultadosBd.FirstOrDefault(r => r.cod_error != 0);

                if (partidaConError == null)
                {
                    return Ok(new
                    {
                        success = true,
                        mensaje = "Todas las partidas de precio unitario fueron registradas con éxito en el sistema.",
                        detalles = resultadosBd // Devuelve los IDs generados si los necesitas
                    });
                }

                // Si se encontró un error (Recuerda que la transacción hizo Rollback automáticamente)
                return BadRequest(new
                {
                    success = false,
                    codigoError = partidaConError.cod_error,
                    mensaje = $"Error en procesamiento: {partidaConError.des_mensaje}"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    mensaje = "Surgió una interrupción interna al procesar la inserción masiva en el servidor.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("listar-tabla-detalle")]
        public async Task<IActionResult> Listar([FromQuery] string cod_empresa, [FromQuery] string cod_empresa_unidad)
        {
            // Validaciones básicas de parámetros requeridos
            if (string.IsNullOrWhiteSpace(cod_empresa) || string.IsNullOrWhiteSpace(cod_empresa_unidad))
            {
                return BadRequest(new { mensaje = "Los parámetros empresa, unidad y tabla son obligatorios." });
            }

            try
            {
                // 🌟 Consumo asíncrono usando 'await' hacia el Repositorio
                var resultado = await _servicioPrecioUnitario.ListarTablaDetalleAsync(cod_empresa, cod_empresa_unidad);

                if (resultado == null || resultado.Count == 0)
                {
                    return NotFound(new { mensaje = "No se encontraron registros para los criterios especificados." });
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // Retorna un error de servidor con el mensaje controlado
                return StatusCode(500, new { mensaje = "Error interno en el servidor", detalle = ex.Message });
            }
        }

        [HttpDelete("eliminar-partida-pu")]
        public async Task<IActionResult> EliminarPartida(
            [FromQuery] EntradaEliminarPrecioUnitario entrada)
        {
            try
            {
                var resultado = await _servicioPrecioUnitario.EliminarPartidaPuAsync(entrada);

                // Si el estado del SP es 1, fue un éxito rotundo
                if (resultado.estado == 1)
                {
                    return Ok(new EliminarRespuestaDto
                    {
                        estado = resultado.estado,
                        mensaje = resultado.mensaje
                    });
                }

                // Si es 0, significa que entró al ELSE o al CATCH del SP (Error controlado)
                return BadRequest(new EliminarRespuestaDto
                {
                    estado = resultado.estado,
                    mensaje = resultado.mensaje
                });
            }
            catch (Exception ex)
            {
                // Para errores críticos del servidor (Status 500), forzamos un estado -1 o 0 interno
                return StatusCode(500, new
                {
                    estado = 0,
                    mensaje = "Error interno en el servidor",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("obtener-detalle-pu-cab-tab")]
        public async Task<IActionResult> ObtenerDetallePrecioUnitario([FromQuery] EntradaPartidaPuDto entrada)
        {
            try
            {
                // Validar que la entrada no venga vacía
                if (entrada == null)
                {
                    return BadRequest(new { mensaje = "Los parámetros de entrada son requeridos." });
                }

                // Invocación al método asíncrono que lee los 4 conjuntos de resultados (ResultSets)
                var detalleCompleto = await _servicioPrecioUnitario.ObtenerDetalleAsync(entrada);

                // Si la cabecera no existe, significa que la partida principal no fue encontrada
                if (detalleCompleto.cabecera == null)
                {
                    return NotFound(new { mensaje = "La partida especificada no existe en el sistema." });
                }

                return Ok(detalleCompleto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error interno en el servidor al compilar el detalle del precio unitario.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("obtener-pu-zonas")]
        public async Task<IActionResult> ObtenerZonas()
        {
            try
            {
                var zonas = await _servicioPrecioUnitario.ObtenerZonasAsync();
                return Ok(zonas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        [HttpGet("listar-parametros-contrato")]
        public ActionResult<List<ParametrosContratoDto>> GetParametros()
        {
            try
            {


                var resultado = _servicioPrecioUnitario.ListarParametrosPorAnexo();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // Reemplaza por tu logger interno si es necesario
                return StatusCode(500, new { mensaje = "Error interno del servidor", detalle = ex.Message });
            }
        }

        [HttpGet("listar-tabla-detalle-pu")]
        public async Task<ActionResult<List<TablaDetallePuDto>>> GetDetalle([FromQuery] string cod_empresa, [FromQuery] string cod_empresa_unidad)
        {
            try
            {
                var resultado = await _servicioPrecioUnitario.ListarTablaDetalleAsync(cod_empresa, cod_empresa_unidad);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error interno", detalle = ex.Message });
            }
        }

        [HttpDelete("eliminar-det-partida-costo-pu")]
        public async Task<IActionResult> EliminarPartidaCostoPu([FromQuery] EliminarPartidaDto entrada)
        {
            try
            {
                // 1. Llamamos al servicio (asegúrate de que tu servicio devuelva RespuestaApiDto)
                var resultado = await _servicioPrecioUnitario.EliminarDetallePartidaAsync(entrada);

                // 2. Evaluamos el estado basado en el DTO de respuesta
                if (resultado.estado == 1)
                {
                    return Ok(resultado); // Devuelve { "estado": 1, "mensaje": "..." }
                }
                else
                {
                    return BadRequest(resultado); // Devuelve { "estado": 0, "mensaje": "..." }
                }
            }
            catch (Exception ex)
            {
                // Log del error aquí (puedes usar ILogger)
                return StatusCode(500, new RespuestaApiDto
                {
                    estado = 0,
                    mensaje = "Ocurrió un error inesperado: " + ex.Message
                });
            }
        }


        [HttpPost("guardar-partida")]
        public async Task<IActionResult> GuardarPartida([FromBody] PartidaPUDto dto)
        {
            var resultado = await _servicioPrecioUnitario.GuardarPartidaAsync(dto);

            if (resultado.estado == 1)
                return Ok(resultado);
            else
                return BadRequest(resultado);
        }

        //TRAER EL VALOR DE DOLARES
        [HttpGet("usd-pen")]
        public async Task<IActionResult> GetUSDtoPEN()
        {
            var response = await _httpClient.GetAsync(
                "https://open.er-api.com/v6/latest/USD"
            );

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<JsonElement>(content);
            var rate = Math.Round(data.GetProperty("rates").GetProperty("PEN").GetDouble(), 3);

            return Ok(new { tipoCambio = rate });
        }


    }

}