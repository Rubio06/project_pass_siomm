using System.ComponentModel.DataAnnotations;

namespace pass_siomm.Data.Dto
{
    public class UsersDto
    {
        public class LoginRequestDto
        {
            [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
            public string username { get; set; }

            [Required(ErrorMessage = "La contraseña es obligatoria.")]
            public string password { get; set; }
        }
    }
}
