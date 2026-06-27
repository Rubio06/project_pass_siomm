using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ExplotacionDto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services.ExplotacionService;
using System.Data;

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Controllers.ExplotacionController
{

    [Route("planeamiento/edicion-programa-mensual")]
    [ApiController]
    public class ExplotacionController : ControllerBase
    {

        private readonly ExplotacionService _explotacionService;

        public ExplotacionController(ExplotacionService explotacionService)
        {
            _explotacionService = explotacionService;
        }

        [HttpGet("explotacion-lista")]
        public async Task<IActionResult> ObtenerListaExplotacion([FromQuery] string nro_prog, [FromQuery] string cod_fase)
        {
            try
            {
                var listaExplotacion = await _explotacionService.ObtenerListaExplotacion(nro_prog, cod_fase);


                return Ok(listaExplotacion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("explotacion-indice-rendimiento")]
        public async Task<IActionResult> ObtenerIndiceRendimiento([FromQuery] string nro_prog, [FromQuery] string cod_fase)
        {
            try
            {
                var listaExplotacion = await _explotacionService.ObtenerIndiceRendimiento(nro_prog, cod_fase);


                return Ok(listaExplotacion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }


        [HttpGet("exploracion-select-cto")]
        public async Task<IActionResult> CodCto([FromQuery] string cie_ano, [FromQuery] string prefijoBusqueda)
        {
            try
            {

                var exploracion = await _explotacionService.CodCto(cie_ano, prefijoBusqueda);
                return Ok(exploracion);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("exploracion-select-cta")]
        public async Task<IActionResult> CodCta([FromQuery] string cie_ano)
        {
            try
            {
                var exploracion = await _explotacionService.CodCta(cie_ano);
                return Ok(exploracion);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("exploracion-select-ala")]
        public async Task<IActionResult> NomAla()
        {
            try
            {
                var exploracion = await _explotacionService.NomAla();
                return Ok(exploracion);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("exploracion-buscar-labor")]
        public async Task<IActionResult> BuscarLabor()
        {
            var result = await _explotacionService.BuscarLabor();
            return Ok(result);
        }

        [HttpGet("exploracion-select-fac")]
        public async Task<IActionResult> FactGeneralEzperanza([FromQuery] string cie_ano, [FromQuery] string cie_per)
        {
            try
            {
                var exploracion = await _explotacionService.FactGeneralEzperanza(cie_ano, cie_per);
                return Ok(exploracion);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("exploracion-info-prog")]
        public async Task<IActionResult> InfoProgMensual([FromQuery] string? nro_prog)
        {
            try
            {
                var exploracion = await _explotacionService.InfoProgMensual(nro_prog);
                return Ok(exploracion);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("exploracion-select-infor-maestro")]
        public async Task<IActionResult> ObtenerMaestros()
        {
            try
            {
                var resultado = await _explotacionService.ObtenerMaestros();

                return Ok(new
                {
                    listaUndEcon = resultado.Item1,
                    listaZona = resultado.Item2,
                    listContrata = resultado.Item3
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");

            }

        }

        [HttpGet("exploracion-mostrar-fases")]
        public async Task<IActionResult> MostrarMaeFase()
        {
            try
            {
                var resultado = await _explotacionService.MostrarMaeFase();
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");

            }

        }

        /// MODALS
        [HttpGet("exploracion-mostrar-block-reservas")]
        public async Task<IActionResult> BlockReservas([FromQuery] string nro_prog)
        {
            try
            {
                var resultado = await _explotacionService.BlockReservas(nro_prog);
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");

            }

        }

        [HttpGet("exploracion-mostrar-block-evaluacion")]
        public async Task<IActionResult> EvaluacionBloque([FromQuery] string nro_prog, [FromQuery] string des_labor)
        {
            try
            {
                var resultado = await _explotacionService.EvaluacionBloque(nro_prog, des_labor);
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");

            }

        }
        //ReservasGeologicas
        [HttpGet("exploracion-mostrar-programacion-mensual")]
        public async Task<IActionResult> GetProgramacionLabor([FromQuery] string des_labor)
        {
            try
            {
                var resultado = await _explotacionService.GetProgramacionLabor(des_labor);
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");

            }

        }

        [HttpGet("exploracion-reserva-geologica")]
        public async Task<IActionResult> ReservasGeologicas(
            [FromQuery] string cie_ano, [FromQuery] string cod_uni_econom, [FromQuery] string cod_zona,
            [FromQuery] string cod_veta, [FromQuery] string cod_nivel
            )
        {
            try
            {
                var resultado = await _explotacionService.ReservasGeologicas(
                    cie_ano,
                    cod_uni_econom,
                    cod_zona,
                    cod_veta,
                    cod_nivel
                    );
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");

            }

        }

        // LOGICA DE PLANOS
        [HttpPost("exploracion-subir-plano")]
        public async Task<IActionResult> SubirPlano([FromForm] SubirPlanoDto dto)
        {
            try
            {
                var resultado = await _explotacionService.SubirPlano(dto);

                if (resultado.resultado == 0)
                {
                    return BadRequest(new ResultadoDto
                    {
                        resultado = 0,
                        mensaje = resultado.mensaje
                    });
                }

                return Ok(new ResultadoDto
                {
                    resultado = 1,
                    mensaje = resultado.mensaje
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResultadoDto
                {
                    resultado = 0,
                    mensaje = "Error interno: " + ex.Message
                });
            }
        }

        [HttpGet("exploracion-mostrar-planos")]
        public async Task<IActionResult> MostrarDatosPlanos(
            string nro_prog,
            string cod_und_econom,
            string cod_zona,
            string cod_veta,
            string cod_nivel,
            string cod_tipo_labor,
            string cod_labor,
            string? cod_ala,
            string cod_fase)
        {
            try
            {
                var resultado = await _explotacionService.MostrarDatosPlanos(
                    nro_prog,
                    cod_und_econom,
                    cod_zona,
                    cod_veta,
                    cod_nivel,
                    cod_tipo_labor,
                    cod_labor,
                    cod_ala,
                    cod_fase
                );

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error del sistema",
                    detalle = ex.Message
                });
            }
        }

        [HttpDelete("eliminar-plano")]
        public async Task<IActionResult> EliminarPlano([FromBody] EliminarPlanoDto dto)
        {
            var resultado = await _explotacionService.EliminarPlano(dto);

            if (resultado.resultado == 0)
            {
                return BadRequest(resultado);
            }

            return Ok(resultado);
        }


        [HttpGet("planos/{nombre_archivo}")]
        public IActionResult VerPlano(string nombre_archivo)
        {
            var carpeta = @"C:\Planos\";
            var ruta = Path.Combine(carpeta, nombre_archivo);

            if (!System.IO.File.Exists(ruta))
                return NotFound();

            return PhysicalFile(ruta, "application/pdf");
        }

        [HttpGet("pref-cto-mina")]
        public async Task<IActionResult> ObtenerPrefCtoMina()
        {
            var prefijo = await _explotacionService.ObtenerPrefCtoMina();

            return Ok(new
            {
                pref_cto_mina = prefijo
            });
        }

        [HttpGet("pref-zona")]
        public async Task<IActionResult> ObtenerPrefijoZona(string cod_zona)
        {
            var prefijoZona = await _explotacionService.ObtenerPrefijoZona(cod_zona);

            return Ok(new
            {
                cod_costo_equivalente = prefijoZona
            });
        }


        // 🔹 1. Obtener Factor (desmonte + vptmin)
        [HttpGet("validacion-factor")]
        public IActionResult ObtenerFactor([FromQuery] string cie_ano, [FromQuery] string cie_per)
        {
            var result = _explotacionService.ObtenerFactor(cie_ano, cie_per);

            return Ok(new
            {
                denDesmonte = result.denDesmonte,
                vptmin = result.vptmin
            });
        }

        // 🔹 2. Obtener Zona
        [HttpGet("validacion-zona")]
        public IActionResult ObtenerZona([FromQuery] string cod_zona)
        {
            var result = _explotacionService.ObtenerZona(cod_zona);

            return Ok(new
            {
                denMineral = result.denMineral,
                indEstructura = result.indEstructura,
                vptminZona = result.vptminZona
            });
        }

        // 🔹 3. Obtener Densidad Veta
        [HttpGet("validacion-veta")]
        public IActionResult ObtenerDensidadVeta(
            [FromQuery] string cod_und_econom,
            [FromQuery] string cod_zona,
            [FromQuery] string cod_veta)
        {
            var den = _explotacionService.ObtenerDensidadVeta(cod_und_econom, cod_zona, cod_veta);

            return Ok(new
            {
                densidad = den
            });
        }

        // 🔹 4. Factores Operativos
        [HttpGet("validacion-factores-operativos")]
        public IActionResult ObtenerFactoresOperativos(
            [FromQuery] string cie_ano,
            [FromQuery] string cie_per,
            [FromQuery] string tipoFac)
        {
            var result = _explotacionService.ObtenerFactoresOperativos(cie_ano, cie_per, tipoFac);

            return Ok(new
            {
                ag = result.ag,
                cu = result.cu,
                pb = result.pb,
                zn = result.zn,
                au = result.au
            });
        }

        // 🔹 5. Método de Explotación
        [HttpGet("validacion-metodo-explotacion")]
        public IActionResult ObtenerMetodoExplotacion(
            [FromQuery] string cie_ano,
            [FromQuery] string cie_per,
            [FromQuery] string cod_metexp)
        {
            var result = _explotacionService.ObtenerMetodoExplotacion(cie_ano, cie_per, cod_metexp);

            return Ok(new
            {
                factorMetodo = result.factorMetodo,
                indDilucion = result.indDilucion,
                indLeyesMin = result.indLeyesMin
            });
        }

        [HttpGet("blocks-archivos")]
        public IActionResult ObtenerBlocksYArchivos()
        {
            var result = _explotacionService.ObtenerBlocksYArchivos();

            return Ok(new ProgramaResponse
            {
                blocks = result.blocks,
                archivos = result.archivos
            });
        }

        [HttpDelete("eliminar-fila-mensual")]
        public async Task<IActionResult> EliminarDetalle([FromBody] BlockReservasDto dto)
        {
            try
            {
                // 🔹 Llamada al servicio que ejecuta el SP
                var resultado = await _explotacionService.EliminarProgramaDetalleAsync(
                    dto.cod_empresa,
                    dto.cod_empresa_unidad,
                    dto.nro_prog,
                    dto.cod_fase,
                    dto.cod_und_econom,
                    dto.cod_zona,
                    dto.cod_veta,
                    dto.cod_nivel,
                    dto.cod_tipo_labor,
                    dto.cod_labor,
                    dto.cod_ala
                );

                // 🔹 Revisar si realmente eliminó
                if (resultado)
                    return Ok(new { mensaje = "Eliminado correctamente" });

                return BadRequest(new { mensaje = "No existe el registro a eliminar" });
            }
            catch (Exception ex)
            {
                // 🔹 Captura errores inesperados de la BD o servicio
                return StatusCode(500, new { mensaje = "Error al eliminar", detalle = ex.Message });
            }
        }


        [HttpGet("exploracion-lista-labores")]
        public async Task<IActionResult> ListaAvance([FromQuery] string cod_und_econom, [FromQuery] string cod_zona, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var resultado = await _explotacionService.ListaAvance(cod_und_econom, cod_zona, page, pageSize);
                return Ok(resultado);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");

            }

        }

        [HttpDelete("eliminar-det-prg")]
        public async Task<IActionResult> Eliminar([FromBody] DetPrgDto input)
        {
            //Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(input));

            try
            {
                var respuesta = await _explotacionService.EliminarFilaAsync(input);

                return Ok(respuesta); // 🔥 devuelves todo (codigo + mensaje)
            }
            catch (Exception ex)
            {
                return StatusCode(500, new RespuestaDto
                {
                    estado = -1,
                    mensaje = ex.Message
                });
            }
        }


        [HttpGet("generar-nro-prog")]
        public async Task<IActionResult> GenerarNroProg()
        {
            var nroProg = await _explotacionService.GenerarNroProg();
            return Ok(nroProg);
        }

        //INSERTAR CAB DETALLE
        [HttpPost("insertar-cab-deta")]
        public async Task<IActionResult> InsertarCabDet([FromBody] InsertarCabDetalleDto cabDeta)
        {
            try
            {
                if (cabDeta == null)
                    return BadRequest("Datos inválidos");

                var resultado = await _explotacionService.InsertarCabDet(cabDeta);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    estado = 0,
                    mensaje = "Error al insertar",
                    error = ex.Message
                });
            }
        }

        //INSERTAR CAB DETALLE
        [HttpPost("copiar-labor")]
        public async Task<IActionResult> CopiarLabor([FromBody] CopiarDetalleDto cabDeta)
        {

            //Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(cabDeta));
            //return Ok("ESTA BIEN");
            try
            {
                if (cabDeta == null)
                    return BadRequest("Datos inválidos");

                var resultado = await _explotacionService.CopiarLabor(cabDeta);

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    estado = 0,
                    mensaje = "Error al insertar",
                    error = ex.Message
                });
            }
        }


        [HttpPost("exportar-programa-mensual")]
        public async Task<IActionResult> ExportarExcel([FromBody] ReporteFiltroDto dto)
        {
            var resp = await _explotacionService.GenerarReporteAsync(dto);

            // ❌ error desde SQL Server
            if (resp.Estado != 1)
            {
                return BadRequest(new
                {
                    estado = resp.Estado,
                    mensaje = resp.Mensaje
                });
            }

            // ✅ éxito → archivo
            return File(
                resp.Archivo!,
                resp.ContentType!,
                resp.NombreArchivo
            );
        }


        [HttpPost("reporte-resumen")]
        public async Task<IActionResult> GetReporte([FromBody] ResumenProgramaRequest request)
        {
            var (data, estado, mensaje) = await _explotacionService.GetResumenAsync(
                request.cod_empresa,
                request.cod_empresa_unidad,
                request.nro_prog,
                request.cod_fase
            );

            if (estado == 0)
                return BadRequest(new { mensaje });

            return Ok(data);
        }


    }
}
