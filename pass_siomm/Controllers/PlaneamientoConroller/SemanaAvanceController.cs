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
        public async Task<IActionResult> EliminarSemanaAvance([FromBody] MaeSemanaAvanceEliminarDto semana)
        {

            try
            {
                if (semana == null)
                    return BadRequest("Datos inválidos");
                
                bool result = await _service.EliminarSemanaAvance(semana);

                if (result)
                    return Ok(new { success = true, message = "Fila eliminada" });
                else
                    return StatusCode(500, new { success = false, message = "Error al eliminar fila" });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR REAL SQL:");
                Console.WriteLine(ex.ToString()); 

                throw; 
            }
        }


        [HttpPost("semana/semana-ciclo-eliminar")]
        public async Task<IActionResult> EliminarSemanaCiclo([FromBody] MaeSemanaAvanceEliminarDto semana)
        {

            try
            {

                if (semana == null)
                    return BadRequest("Datos inválidos");

                bool result = await _service.EliminarSemanaCiclo(semana);

                if (result)
                    return Ok(new { success = true, message = "Fila eliminada" });
                else
                    return StatusCode(500, new { success = false, message = "Error al eliminar fila" });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR REAL SQL:");
                Console.WriteLine(ex.ToString());

                throw; 
            }
        }

        [HttpPost("semana/metodo-minado-eliminar")]
        public async Task<IActionResult> EliminarMetodoMinado([FromBody] MaePerMetExplotacionEliminarDto semana)
        {

            try
            {

                if (semana == null)
                    return BadRequest("Datos inválidos");

                bool result = await _service.EliminarMetodoMinado(semana);

                if (result)
                    return Ok(new { success = true, message = "Fila eliminada" });
                else
                    return StatusCode(500, new { success = false, message = "Error al eliminar fila" });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR REAL SQL:");
                Console.WriteLine(ex.ToString());

                throw;
            }
        }



        [HttpPost("semana/estandar-exploracion-eliminar")]
        public async Task<IActionResult> EliminarEstandarExploracion([FromBody] MaeExploEstandarEliminar semana)
        {

            try
            {

                if (semana == null)
                    return BadRequest("Datos inválidos");

                bool result = await _service.EliminarEstandarExploracion(semana);

                if (result)
                    return Ok(new { success = true, message = "Fila eliminada" });
                else
                    return StatusCode(500, new { success = false, message = "Error al eliminar fila" });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR REAL SQL:");
                Console.WriteLine(ex.ToString());

                throw;
            }
        }


        [HttpPost("semana/estandar-avance-eliminar")]
        public async Task<IActionResult> EliminarEstandarAvance([FromBody] MaeLaboratorioEstandarEliminarDto semana)
        {

            try
            {

                if (semana == null)
                    return BadRequest("Datos inválidos");

                bool result = await _service.EliminarEstandarAvance(semana);

                if (result)
                    return Ok(new { success = true, message = "Fila eliminada" });
                else
                    return StatusCode(500, new { success = false, message = "Error al eliminar fila" });

            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR REAL SQL:");
                Console.WriteLine(ex.ToString());

                throw;
            }
        }


    }
}
