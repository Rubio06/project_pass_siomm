using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pass_siomm_backend.Services;

namespace pass_siomm_backend.Controllers
{
    [Route("rutas")]
    [ApiController]
    public class RoutersController : ControllerBase
    {
        private readonly RoutesService _routesService;

        public RoutersController(RoutesService routesService) 
        {
            _routesService = routesService;
        }


        [HttpGet("mostrar-rutas")]
        public async Task<IActionResult> GetRutas()
        {
            var data = await _routesService.ObtenerRutas();
            return Ok(data);
        }
    }
}
