using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Data.Dto.PlaneamientoDto;
using pass_siomm_backend.Services.PlaneamientoService;
using static pass_siomm_backend.Services.PlaneamientoService.SemanaAvanceServices;

namespace pass_siomm_backend.Controllers.PlaneamientoConroller
{
    [Route("aper-periodo-operativo")]
    [ApiController]
    public class SemanaController : ControllerBase
    {

        private readonly SemanaAvanceServices _service;

        public SemanaController(SemanaAvanceServices service)
        {
            _service = service;
        }

        [HttpPost("semana/semana-avance-eliminar")]
        public async Task<IActionResult> Eliminado([FromBody] MaeSemanaAvanceEliminarDto semana)
        {
            //Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(semana));

            //return Ok(semana);

            try
            {
                //Console.WriteLine(semana);
                //return Ok(semana);
                if (semana == null)
                    return BadRequest("Datos inválidos");
                
                bool result = await _service.EliminarRegistro(semana);

                if (result)
                    return Ok(new { success = true, message = "Fila eliminada" });
                else
                    return StatusCode(500, new { success = false, message = "Error al eliminar fila" });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR REAL SQL:");
                Console.WriteLine(ex.ToString());   // 🔥 imprime el error exacto con detalle

                throw; // 🔥 hace que el error llegue completo al controlador
            }
        }


    }
}
