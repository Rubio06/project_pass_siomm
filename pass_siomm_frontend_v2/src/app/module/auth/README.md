# Módulo: Auth

## ¿Qué hace?
Maneja la autenticación de usuarios: login, layout de páginas de acceso 
y los servicios/tipos relacionados a la sesión.

## Estructura interna
- **auth-layout/**: componente de layout compartido para las páginas de 
  autenticación (ej: fondo, logo, contenedor centrado del login)
- **interfaces/**: tipos TypeScript usados en el módulo 
  (ej: `LoginRequest`, `LoginResponse`, `Usuario`)
- **pages/login/**: página de login (componente standalone/página)
- **services/auth.service.ts**: lógica de negocio — llamadas a la API 
  de autenticación, manejo de token, etc.
- **auth.routes.ts**: Definidas en `auth.routes.ts` y registradas por lazy loading directamente 
en `app.config.ts` (no existe un `app.routes.ts` central; el proyecto 
usa componentes standalone).

## Componentes y su relación
`AuthLayoutComponent` (contenedor) 
  └── `LoginPageComponent` (se renderiza dentro del layout vía `<router-outlet>`)

## Flujo de datos (Login)
1. `LoginPageComponent` captura usuario/contraseña del formulario
2. Llama a `AuthService.login(credenciales)`
3. `AuthService` hace `POST /api/auth/login` a la API (ADO.NET)
4. Si es exitoso, guarda el token (ej: en localStorage o un servicio de estado)
5. Redirige al usuario a la ruta principal según su rol

## Rutas
| Ruta | Componente | Descripción |
|---|---|---|
| /auth/login | LoginPageComponent | Pantalla de inicio de sesión |

## Dependencias
- `core/` → probablemente usa el `AuthGuard` o `HttpInterceptor` de core 
  para proteger rutas y adjuntar el token a las peticiones



module/auth/
├── auth-layout/
│   ├── auth-layout.component.ts
│   └── auth-layout.component.html
├── interfaces/
│   └── auth.interface.ts        # tipos/interfaces del módulo (ej: LoginRequest, AuthResponse)
├── pages/
│   └── login/
│       ├── login-page.component.ts
│       ├── login-page.component.html
│       ├── login-page.component.css
│       └── login-page.component.spec.ts
├── services/
│   └── auth.service.ts          # lógica de autenticación, llamadas HTTP
└── auth.routes.ts               # rutas propias del módulo (lazy loading)