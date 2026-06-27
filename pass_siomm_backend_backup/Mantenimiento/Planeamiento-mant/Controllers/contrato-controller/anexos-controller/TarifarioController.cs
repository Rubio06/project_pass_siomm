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
    [Route("mantenimiento/servicio-transporte/tarifario")]
    [ApiController]
    public class TarifarioController : ControllerBase
    {
        private readonly TarifarioService _servicioTarifario;

        public TarifarioController(TarifarioService servicioTarifario)
        {
            _servicioTarifario = servicioTarifario;
        }

        [HttpGet]
        [Route("obtener-tarifario-detalle")]
        public async Task<IActionResult> ObtenerTarifarioDetalle(
            [FromQuery] EntradaTarifarioDetalleDto request)
        {
            try
            {
                var resultado =
                    await _servicioTarifario
                        .ObtenerTarifarioDetalleAsync(request);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = ex.Message
                });
            }
        }

        // GET: api/Maestros/rutas
        [HttpGet("lista-rutas")]
        public async Task<IActionResult> GetRutas()
        {
            try
            {
                var resultado = await _servicioTarifario.ListarRutasAsync();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar rutas.", detalle = ex.Message });
            }
        }

        // GET: api/Maestros/centros-costo
        [HttpGet("lista-cto")]
        public async Task<IActionResult> ListarCto()
        {
            try
            {
                var resultado = await _servicioTarifario.ListarCto();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar centros de costo.", detalle = ex.Message });
            }
        }

        // GET: api/Maestros/cuentas-contables
        [HttpGet("lista-cta")]
        public async Task<IActionResult> ListarCta()
        {
            try
            {
                var resultado = await _servicioTarifario.ListarCta();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar cuentas contables.", detalle = ex.Message });
            }
        }

        [HttpGet("obtener-tarifario-material")]
        // 1. Agregamos [FromQuery] para arreglar Swagger
        // 2. Cambiamos a async Task<IActionResult>
        public async Task<IActionResult> ObtenerTarifarioTransporteMaterial([FromQuery] EntradaTarifarioMaterialDto request)
        {
            // Validamos que los parámetros obligatorios no vengan vacíos
            //if (string.IsNullOrWhiteSpace(request.cod_empresa) ||
            //    string.IsNullOrWhiteSpace(request.cod_empresa_unidad) ||
            //    string.IsNullOrWhiteSpace(request.cod_contrato))
            //{
            //    return BadRequest(new { mensaje = "Todos los parámetros de búsqueda son obligatorios." });
            //}

            try
            {
                // Usamos await para esperar la respuesta de la BD de forma asíncrona
                List<TarifarioTransporteMaterialDto> resultado = await _servicioTarifario.ObtenerTarifarioTransporteMaterial(request);

                //if (resultado == null || resultado.Count == 0)
                //{
                //    return NotFound(new { mensaje = "No se encontraron registros con los filtros proporcionados." });
                //}

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    mensaje = "Ocurrió un error interno en el servidor al procesar la solicitud.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("obtener-tarifario-lista")]
        public async Task<IActionResult> ObtenerTarifarioLista()
        {
            try
            {
                var resultado = await _servicioTarifario.ObtenerTarifarioLista();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar cuentas contables.", detalle = ex.Message });
            }
        }

        [HttpGet("obtener-tabla-lista")]
        public async Task<IActionResult> ObtenerListaTabla([FromQuery] EntradaTablaDto request)
        {
            try
            {
                var resultado = await _servicioTarifario.ObtenerListaTabla(request);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar cuentas contables.", detalle = ex.Message });
            }
        }

        [HttpGet("obtener-tarifario-equipos")]
        public async Task<IActionResult> ObtenerTarifarioEquipos([FromQuery] EntradaTarifarioMaterialDto request)
        {
            try
            {
                var resultado = await _servicioTarifario.ObtenerTarifarioEquipos(request);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar cuentas contables.", detalle = ex.Message });
            }
        }

        [HttpGet("obtener-equipos-vigentes")]
        public async Task<IActionResult> GetEquiposVigentesAsync()
        {
            try
            {
                var resultado = await _servicioTarifario.GetEquiposVigentesAsync();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar cuentas contables.", detalle = ex.Message });
            }
        }

        [HttpGet("obtener-tabla-detalle")]
        public async Task<IActionResult> ListaTablaDetalle()
        {
            try
            {
                var resultado = await _servicioTarifario.ListaTablaDetalle();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = "Error al listar cuentas contables.", detalle = ex.Message });
            }
        }

        // INCREMENTANDO CODIGOS + 1
        [HttpGet("siguiente-item-transporte")]
        public IActionResult ObtenerSiguienteItem( [FromQuery] string cod_empresa, [FromQuery] string cod_empresa_unidad, [FromQuery] string cod_contrato)
        {
            try
            {
                // Invocamos a la capa de negocio
                int siguienteId = _servicioTarifario.ObtenerSiguienteItemRuta(cod_empresa, cod_empresa_unidad, cod_contrato);

                // Retornamos un estado 200 OK con el número listo para ser consumido por Angular
                return Ok(new { siguienteCodItem = siguienteId });
            }
            catch (Exception ex)
            {
                // Manejo seguro del error corporativo
                return StatusCode(500, new { mensaje = "Error interno al procesar el correlativo.", detalle = ex.Message });
            }
        }

        [HttpGet("imprimir-transporte-mineral")]
        public async Task<IActionResult> ImprimirTransporteMineral([FromQuery] EntradaTarifarioDetalleImprimrDto request)
        {
            try
            {
                // 🎯 1. Invocamos el método asíncrono que creamos en el repositorio/servicio
                List<TarifarioTransporteDetalleDto> listaDetalle = await _servicioTarifario.ImprimirTransporteMineral(request);

                // 🎯 2. Si no hay datos, puedes retornar un 204 No Content o simplemente la lista vacía
                if (listaDetalle == null || listaDetalle.Count == 0)
                {
                    return Ok(new List<TarifarioTransporteDetalleDto>());
                }

                // 🎯 3. Retornamos la lista completa con un estado 200 OK hacia Angular
                return Ok(listaDetalle);
            }
            catch (Exception ex)
            {
                // Manejo seguro del error corporativo
                return StatusCode(500, new { mensaje = "Error interno al procesar los datos del tarifario de transporte.", detalle = ex.Message });
            }
        }

        [HttpGet("imprimir-transporte-otros")]
        public async Task<IActionResult> ObtenerTransporteOtrosReporte([FromQuery] EntradaTarifarioDetalleImprimrDto request)
        {
            try
            {
                // 🎯 1. Invocamos el método estructurado del repositorio que devuelve el objeto con las dos listas
                ReporteTransporteOtrosResponse resultado = await _servicioTarifario.ObtenerTransporteOtrosReporte(request);

                // 🎯 2. Evaluamos si ambos bloques vinieron completamente vacíos o nulos
                bool sinDatosActivos = resultado.rutasActivas == null || resultado.rutasActivas.Count == 0;
                bool sinDatosInactivos = resultado.rutasInactivas == null || resultado.rutasInactivas.Count == 0;

                if (sinDatosActivos && sinDatosInactivos)
                {
                    // Retornamos el objeto estructurado con las listas vacías para que Angular lo maneje limpiamente
                    return Ok(new ReporteTransporteOtrosResponse());
                }

                // 🎯 3. Retornamos el objeto compuesto (rutasActivas y rutasInactivas) con un estado 200 OK
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // Manejo seguro del error corporativo
                return StatusCode(500, new
                {
                    mensaje = "Error interno al procesar las rutas activas e inactivas del tarifario de transporte.",
                    detalle = ex.Message
                });
            }
        }

    }

}