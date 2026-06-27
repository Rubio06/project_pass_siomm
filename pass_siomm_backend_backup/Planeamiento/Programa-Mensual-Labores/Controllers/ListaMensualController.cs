using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Data.Dto.ModalsDto;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services;
using pass_siomm_backend.Planeamiento.Services.PlaneamientoService;
using ExcelDataReader;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Controllers
{

    //[Authorize]
    [Route("planeamiento/lista-mensual")]
    [ApiController]
    public class ListaMensualController : ControllerBase
    {

        private readonly ListaMensualService _listaMensualService;

        public ListaMensualController(ListaMensualService listaMensualService)
        {
            _listaMensualService = listaMensualService;
        }


        [HttpGet("obtener-lista-mensual")]
        public async Task<IActionResult> ObtenerListaMensual([FromQuery] string cie_ano, [FromQuery] string? cie_per)
        {


            try
            {
                var listaMensual = await _listaMensualService.ObtenerListaMensual(cie_ano, cie_per);
                return Ok(listaMensual);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("obtener-lista-incidencias")]
        public async Task<IActionResult> ObtenerListaIncidencia([FromQuery] string nro_prog)
        {
            try
            {
                var listaMensual = await _listaMensualService.ObtenerListaIncidencia(nro_prog);
                return Ok(listaMensual);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }


        [HttpPatch("anular-programacion")]
        public async Task<IActionResult> AnularProgramacion([FromQuery] string nro_prog)
        {
            try
            {
                var listaMensual = await _listaMensualService.AnularProgramacion(nro_prog);
                return Ok(listaMensual);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpPatch("aprobar-programacion")]
        public async Task<IActionResult> AprobarProgramacion([FromQuery] string nro_prog, [FromQuery] string? cod_usuario)
        {

            Console.WriteLine(nro_prog, cod_usuario);
            try
            {
                var listaMensual = await _listaMensualService.AprobarProgramacion(nro_prog, cod_usuario);
                return Ok(listaMensual);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpPatch("pre-aprobacion-programacion")]
        public async Task<IActionResult> PreAprobacionProgramacion([FromQuery] string nro_prog, [FromQuery] string? prg_pre_pr)
        {
            Console.WriteLine(nro_prog, prg_pre_pr);
            try
            {
                var listaMensual = await _listaMensualService.PreAprobacionProgramacion(nro_prog, prg_pre_pr);
                return Ok(listaMensual);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpGet("exporta-lista-programacion")]
        public async Task<IActionResult> ExportarProgramacion([FromQuery] ExportarProgramacionRequest datos)
        {

            try
            {
                var exportarData = await _listaMensualService.ExportarProgramacion(datos);
                Console.WriteLine(exportarData);
                return Ok(exportarData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }

        [HttpPost("importar-excel")]
        public async Task<IActionResult> ImportarExcel(IFormFile file)
        {   
            
            if (file == null || file.Length == 0)
                return BadRequest("Archivo vacío");

            var resultado = await _listaMensualService.ImportarExcel(file);

            return Ok(resultado);
        }

        //[HttpPost("importar-excel")]
        //public async Task<IActionResult> ImportarExcel(IFormFile file)
        //{
        //    if (file == null || file.Length == 0) return BadRequest("Archivo no recibido");

        //    // Registramos el proveedor de codificación (necesario para Excel en .NET Core)
        //    System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        //    using (var stream = file.OpenReadStream())
        //    {
        //        using (var reader = ExcelReaderFactory.CreateReader(stream))
        //        {
        //            // Este DataSet contendrá todas las hojas y filas del Excel
        //            var result = reader.AsDataSet();
        //            var tabla = result.Tables[0]; // La primera hoja

        //            // AQUÍ PUEDES VER LA DATA: 
        //            // Recorremos las filas para debuggear (ver en la consola de salida)
        //            foreach (System.Data.DataRow row in tabla.Rows)
        //            {
        //                // Es mejor convertir a string y limpiar espacios
        //                var anio = row[0]?.ToString().Trim();
        //                var mes = row[1]?.ToString().Trim();
        //                var unidad = row[6]?.ToString().Trim(); // Aquí verás "COND"

        //                // Esto saldrá en la terminal/consola
        //                Console.WriteLine($"---> DATOS EXCEL: Año: {anio} | Mes: {mes} | Unidad: {unidad}");
        //            }
        //        }
        //    }

        //    var resultado = await _listaMensualService.ImportarExcel(file);
        //    return Ok(resultado);
        //}

        //COPIAR PERIODO
        [HttpPost("copiar-programacion")]
        public async Task<IActionResult> CopiarProgramacion([FromBody] CopiarProgramacionDto request)
        {
            try
            {
                var result = await _listaMensualService.CopiarProgramacion(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro del sistema: {ex.Message}");
            }
        }


        [HttpGet("generar-nro-prog")]
        public IActionResult Generar([FromBody] RequestCorrelativo req)
        {
            var result = _listaMensualService.GenerarCorrelativo(req.cod_empresa, req.cod_unidad_empresa);

            if (result.result == -1)
            {
                return BadRequest(new
                {
                    message = "Error al generar correlativo",
                    error = result.error
                });
            }

            return Ok(new
            {
                prg_num = result.prgNum
            });
        }







    }
}
