# Nombre del Proyecto - Frontend = PASS_SIOMM_FRONTEND

Sistema de operaciones mineras de migrado desde **PowerBuilder** 
hacia una arquitectura web moderna: **Angular** (frontend), **ADO.NET** (backend/API) 
y **SQL Server** (base de datos).

## Contexto de la migración
- Sistema legacy: PowerBuilder [10.5]
- Motivo de la migración: Escalabilidad y actualizacioón de los modulos
- Estado actual: en progreso - migración por modulos


## Arquitectura general
[Diagrama simple: Angular → API ADO.NET → SQL Server]


##  Stack Tecnológico
| Capa | Tecnología |
|---|---|
| Frontend | Angular versión 20.3.30. / DaisyUI versión  daisyui@5.6.3 | node versión v24.14.0
| Backend | ADO.NET / .NET 8.0 |
| Base de datos | SQL Server 2008 |


## Configuración

Antes de correr el proyecto, se debe indicar la URL del backend (API ADO.NET).

### Archivos de entorno
| Archivo | Uso |
|---|---|
| `src/environments/environment.ts` | Desarrollo local |
| `src/environments/environment.prod.ts` | Producción |

### Ejecución del proyecto
* Instalación del Frontend
* Requisitos
* Node.js v24.14.0
* Angular CLI 20.3.30
* Pasos

Instalar Node.js v24.14.0 desde:

https://nodejs.org/es/download

Instalar Angular CLI 20.3.30:

npm install -g @angular/cli@20.3.30

Más información:

https://angular.dev/installation

Clonar el repositorio e ingresar a la carpeta del proyecto.

Instalar las dependencias del proyecto:

npm install

Levantar el backend y verificar el puerto en el que queda escuchando (se mostrará en la consola al ejecutar dotnet run).

Ejemplo:

https://localhost:44334

Configurar la URL del backend en el archivo src/environments/environment.ts:

export const environment = {
  production: false,
  baseUrl: 'https://localhost:44334/'
};
Verificar que todos los servicios (src/app/**/services/*.service.ts) utilicen environment.baseUrl y no tengan URLs escritas directamente (hardcodeadas).

Iniciar la aplicación Angular:

ng serve

Abrir la aplicación en el navegador:

http://localhost:4200


### Problema común: error de CORS
Si aparece un error de CORS en consola, el backend no tiene habilitado 
`http://localhost:4200` como origen permitido. Ver sección CORS en 
`backend/README.md`.


### Estructura de carpetas

PASS_SIOMM_FRONTEND_V2/
├── src/
│   └── app/
│       ├── core/            # servicios singleton, guards, interceptors
│       ├── module/          # módulos funcionales del negocio (uno por feature)
│       ├── shared/          # componentes, pipes y directivas reutilizables
│       ├── utils/           # funciones/helpers utilitarios generales
│       ├── app.config.ts        # configuración principal de la app (providers, etc.)
│       ├── app.config.server.ts # configuración específica para SSR (server-side)
│       ├── app.routes.ts        # rutas del cliente
│       ├── app.routes.server.ts # rutas para SSR
│       ├── app.ts               # componente raíz
│       ├── app.html / app.css   # template y estilos del componente raíz
│       └── app.spec.ts          # tests del componente raíz
│   ├── environments/        # configuración por entorno (dev, prod)
│   ├── index.html
│   ├── main.ts               # bootstrap de la app (cliente)
│   ├── main.server.ts        # bootstrap de la app (servidor / SSR)
│   ├── server.ts              # servidor Express/Node para SSR
│   ├── styles.css             # estilos globales
│   └── custom-theme.scss      # tema personalizado (DaisyUI/Tailwind)
├── public/                  # assets estáticos
├── proxy.conf.json          # configuración de proxy (probablemente para redirigir /api al backend en dev)
├── tailwind.config.js       # configuración de Tailwind/DaisyUI
├── angular.json
├── package.json
└── tsconfig*.json           # configuración de TypeScript (app, spec, base)

