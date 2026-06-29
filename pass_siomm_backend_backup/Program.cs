using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using pass_siomm_backend.Autenticacion.Service;
using pass_siomm_backend.Conexion;
using pass_siomm_backend.Mantenimiento.Planeamiento_mant.Services;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services;
using pass_siomm_backend.Planeamiento.Programa_Mensual_Labores.Services.ExplotacionService;
using pass_siomm_backend.Planeamiento.Services.PlaneamientoService;
using pass_siomm_backend.Rutas.Service;
using pass_siomm_backend.Utilitarios.Fechas_Filtros.Servicio;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var erroresCasteados = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .Select(e => new
                {
                    Campo = e.Key,
                    Error = e.Value.Errors.First().ErrorMessage
                }).ToList();

            string mensajeDetalle = string.Join(" | ", erroresCasteados.Select(x => $"{x.Campo}: {x.Error}"));

            var respuestaPersonalizada = new
            {
                estado = -1,
                mensaje = $"Error de validación en los datos enviados: {mensajeDetalle}"
            };

            return new BadRequestObjectResult(respuestaPersonalizada);
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependencias
builder.Services.AddSingleton<DatabaseHelper>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoutesService>();
builder.Services.AddScoped<AperPeriodoOperativoServices>();
builder.Services.AddScoped<SemanaAvanceServices>();
builder.Services.AddScoped<FiltrosFechasService>();
builder.Services.AddScoped<ListaMensualService>();
builder.Services.AddScoped<ExplotacionService>();
builder.Services.AddScoped<ManteUndEconomicaService>();
builder.Services.AddScoped<ZonaService>();
builder.Services.AddScoped<VetaService>();
builder.Services.AddScoped<NivelService>();
builder.Services.AddScoped<TipoLaborService>();
builder.Services.AddScoped<LaborService>();
builder.Services.AddScoped<ContrataService>();
builder.Services.AddScoped<RutasTransporteService>();
builder.Services.AddScoped<RutasTransporteMovimientoService>();
builder.Services.AddScoped<AdmContratoService>();
builder.Services.AddScoped<ServicioTransporteService>();
builder.Services.AddScoped<TarifarioService>();
builder.Services.AddScoped<TarifarioEscrituraService>();
builder.Services.AddScoped<PreciosUnitariosService>();
builder.Services.AddHttpClient();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
    };
});

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[]{}
        }
    });
});

builder.Services.AddAuthorization();

builder.Services.AddAuthentication(IISDefaults.AuthenticationScheme);
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();