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
    [Route("mantenimiento/opciones-modelo")]
    [ApiController]
    public class AdmContratoController : ControllerBase
    {
        private readonly AdmContratoService _admContratoService;

        public AdmContratoController(AdmContratoService admContrato)
        {
            _admContratoService = admContrato;
        }

        [HttpGet("obtener-adm-contrato")]
        public async Task<IActionResult> ListarAdmContrato([FromQuery] FiltrosAdmContratoDto filtros)
        {
            try
            {
                var lista = await _admContratoService.ListaAdmContrato(filtros);
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al listar contratos", detalle = ex.Message });
            }
        }

        [HttpGet]
        [Route("listar-contrata")]
        public async Task<IActionResult> ObteneAdmContrata()
        {
            try
            {
                var lista = await _admContratoService.ObteneAdmContrata();

                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener contratas",
                    error = ex.Message
                });
            }
        }
    }

}