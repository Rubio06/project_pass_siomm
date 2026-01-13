using Azure.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using pass_siomm.Data;
using pass_siomm.Models;
using pass_siomm.Services;
using System.Data;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static pass_siomm.Data.Dto.UsersDto;

namespace pass_siomm.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private IConfiguration config;

        public AuthController(UserService userService, IConfiguration config)
        {
            _userService = userService;
            this.config = config;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> AutenticatheUser([FromBody] LoginRequestDto request)
        {
            string mensaje = "";
            bool valid = false;

            try
            {
                if (string.IsNullOrWhiteSpace(request.username) || string.IsNullOrWhiteSpace(request.password))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Debe ingresar usuario y contraseña."
                    });
                }

                bool validateBD = await _userService.UserExistsAsync(request.username);

                if (!validateBD)
                {
                    mensaje = "Usuario no registrado en la base de datos.";
                    return Unauthorized(new { success = false, message = mensaje });
                }

                valid = AuthenticateUser(request.username, request.password, ref mensaje);

                if (!valid)
                {
                    return Unauthorized(new { success = false, message = mensaje });
                }

                string jwtToken = GenerateJwtToken(request);

                return Ok(new
                {
                    success = true,
                    message = "Autenticación exitosa.",
                    data = new
                    {
                        token = jwtToken,
                        username = request.username,
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor.",
                    details = ex.Message
                });
            }
        }

        private static string GetCurrentDomainPath()
        {
            {
                DirectoryEntry de = new DirectoryEntry("LDAP://RootDSE");
                string domainPath = "LDAP://" + de.Properties["defaultNamingContext"][0].ToString();

                return domainPath;
            }
        }

        private static bool AuthenticateUser(string userName, string password, ref string mensaje)
        {
            bool valid = false;
            try
            {

                DirectoryEntry de = new DirectoryEntry(GetCurrentDomainPath(), userName, password);
                DirectorySearcher dsearch = new DirectorySearcher(de);
                dsearch.Filter = "sAMAccountName=" + userName + "";
                SearchResult results = null;

                results = dsearch.FindOne();
                string NombreCompleto = results.GetDirectoryEntry().Properties["DisplayName"].Value.ToString();
                string NTusername = results.GetDirectoryEntry().Properties["sAMAccountName"].Value.ToString();
                var co = results.GetDirectoryEntry().Properties["department"].Value.ToString(); // department

                valid = true;
            }
            catch (Exception ex)
            {
                valid = false;
                mensaje = ex.Message;
            }
            return valid;
        }

        private string GenerateJwtToken(LoginRequestDto user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("JWT:Key").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var securityToken = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(1),
                    signingCredentials: creds);

            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);

            return token;
        }
    }
}
