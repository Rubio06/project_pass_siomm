using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using pass_siomm.Data;
using pass_siomm.Models;
using pass_siomm.Services;
using System.Data;
using System.DirectoryServices.AccountManagement;
using static pass_siomm.Data.Dto.UsersDto;

namespace pass_siomm.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _productService;

        public AuthController(UserService productService)
        {
            _productService = productService;
        }

        [HttpPost("auth/session-start")]
        public async Task<IActionResult> CheckUserExists([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.username))
                return BadRequest(new { success = false, message = "El nombre de usuario no puede estar vacío." });

            if (string.IsNullOrWhiteSpace(request.password))
                return BadRequest(new { success = false, message = "La contraseña no puede estar vacía." });

            try
            {
                bool exists = await _productService.UserExistsAsync(request.username);

                using var context = new PrincipalContext(ContextType.Domain, "spm.com");
                bool validAD = context.ValidateCredentials(request.username, request.password);

                if (!exists)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "El usuario no existe en el sistema."
                    });
                }

                if (!validAD)
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Usuario o contraseña incorrectos en Active Directory."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "El usuario existe y se autenticó correctamente."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor."
                });
            }
        }

    }
}
