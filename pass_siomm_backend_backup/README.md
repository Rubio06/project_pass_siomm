# Sistema de Gestión [Nombre del Proyecto]

Aplicación desarrollada en **ASP.NET** con **ADO.NET** para el acceso a datos. El proyecto está organizado por **módulos funcionales**, cada uno con su propia capa de `Controllers`, `Data` y `Service`, siguiendo un patrón similar a una arquitectura por features (feature-based architecture).

## 📋 Tabla de contenidos

- [Requisitos](#requisitos)
- [Configuración](#configuración)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos](#módulos)
- [Capa de conexión (ADO.NET)](#capa-de-conexión-adonet)
- [Convenciones](#convenciones)
- [Ejemplos de uso](#ejemplos-de-uso)
- [Documentación adicional](#documentación-adicional)

## Requisitos

- .NET 8.0 SDK 
- SQL Server 2008
- Visual Studio 2022 / VS Code

## Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-proyecto.git
   ```

2. Configura la cadena de conexión en `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
        "SqlConnection": "Server=10.20.24.74,1433;Database=SPM_SIOMM;User Id=user_siomm;Password=U$3r3S10oM2025$;TrustServerCertificate=True;"
     }
   }
   ```

3. Restaura dependencias y ejecuta:
   ```bash
   dotnet restore
   dotnet run
   ```

## Estructura del proyecto

```
/Proyecto
│
├── /Autenticacion
│   ├── /Controllers
│   │   └── AuthController.cs        # Endpoints de login/autenticación
│   ├── /Data
│   │   ├── /Dto
│   │   │   └── UsersDto.cs          # DTO de usuario
│   │   ├── SqlQueriesLogin.cs       # Queries SQL de autenticación
│   │   └── UserModel.cs             # Modelo de usuario
│   └── /Service
│       └── UserService.cs           # Lógica de negocio de autenticación
│
├── /Conexion
│   └── DatabaseHelper.cs            # Manejo centralizado de SqlConnection
│
├── /Mantenimiento
│   └── /Planeamiento-mant
│       ├── /Controllers
│       ├── /Data
│       └── /Services
│
├── /Planeamiento
│   ├── /Apertura-Periodo-Operativo
│   ├── /Balanza-Detalle
│   ├── /Programa-Mensual-Labores
│   └── /Plantillas
│
├── /Rutas
│   ├── /Controllers
│   ├── /Data
│   └── /Service
│
├── /Utilitarios
│   └── /Fechas-Filtros
│       ├── /Controller
│       │   └── FiltrosFechasController.cs
│       └── /Servicio
│           └── FiltrosFechasService.cs
│
├── .editorconfig
├── .gitignore
└── appsettings.json
```

## Módulos

| Módulo | Descripción | Componentes clave |
|---|---|---|
| **Autenticacion** | Manejo de login y sesión de usuarios | `AuthController`, `UserService`, `SqlQueriesLogin` |
| **Conexion** | Capa transversal de acceso a base de datos | `DatabaseHelper` |
| **Mantenimiento** | Operaciones de mantenimiento de datos maestros | `Planeamiento-mant` |
| **Planeamiento** | Gestión de periodos operativos, balanzas y programas mensuales | `Apertura-Periodo-Operativo`, `Balanza-Detalle`, `Programa-Mensual-Labores` |
| **Rutas** | Gestión de rutas del sistema | `Controllers`, `Data`, `Service` |
| **Utilitarios** | Servicios auxiliares reutilizables  | `FiltrosFechasController`, `FiltrosFechasService` |

> ✏️ *Completa esta tabla con una descripción breve de qué hace cada módulo dentro del negocio.*

## Capa de conexión (ADO.NET)

Toda la aplicación centraliza el acceso a datos a través de `DatabaseHelper.cs` (carpeta `/Conexion`), que expone métodos reutilizables para ejecutar comandos SQL usando `SqlConnection`, `SqlCommand` y `SqlDataReader`/`SqlDataAdapter`.

**Ejemplo conceptual de `DatabaseHelper.cs`:**

```csharp
        using System.Data;
        using Microsoft.Extensions.Configuration;
        using Microsoft.Data.SqlClient;

        namespace pass_siomm_backend.Conexion
        {
            public class DatabaseHelper
            {
                private readonly string _connectionString;

                public DatabaseHelper(IConfiguration configuration)
                {
                    _connectionString = configuration.GetConnectionString("SqlConnection");
                }

        
            }
        }

```

Cada módulo (Autenticacion, Rutas, Planeamiento, etc.) inyecta o instancia `DatabaseHelper` en su capa `Data` para ejecutar las queries definidas en archivos como `SqlQueriesLogin.cs`.

> ✏️ *Reemplaza el ejemplo anterior con el código real de tu `DatabaseHelper.cs` una vez lo tengas a mano.*

## Convenciones

- **Controllers**: exponen los endpoints HTTP de cada módulo.
- **Data**: contiene modelos (`*Model.cs`), DTOs (`/Dto`) y queries SQL (`SqlQueries*.cs`).
- **Service**: contiene la lógica de negocio que orquesta llamadas a `Data` y transforma resultados hacia los `Controllers`.
- Las queries SQL crudas se mantienen separadas en archivos dedicados (ej. `SqlQueriesLogin.cs`) para facilitar su mantenimiento y auditoría.

## Ejemplos de uso

```csharp
// Ejemplo: login de usuario (módulo Autenticacion)
var userService = new UserService(databaseHelper);
UsersDto usuario = userService.ValidarCredenciales(email, password);

if (usuario != null)
{
    // generar token / iniciar sesión
}
```

## Documentación adicional

El código incluye comentarios XML (`///`) en clases y métodos públicos. Para generar documentación navegable en HTML:

```bash
dotnet tool install -g docfx
docfx init
docfx build
```

La documentación se genera en la carpeta `/docs`.

---

> 📌 **Nota:** Este README es una plantilla base ajustada a la estructura de carpetas del proyecto. Se recomienda completar las secciones marcadas con ✏️ con el detalle real de queries, procedimientos almacenados y reglas de negocio de cada módulo.
