# Módulo: Planeamiento

## ¿Qué hace?
Gestiona el planeamiento minero: contratos, rutas de transporte, 
labores, zonas y sus catálogos asociados.

## Sub-módulos

| Sub-módulo | Descripción | Documentación |
|---|---|---|
| `adm-contratos` | Administración de contratos | [Ver detalle](./adm-contratos/README.md) |
| `contrata` | Gestión de contratas/empresas contratistas | — |
| `labor` | Catálogo de labores mineras | — |
| `nivel` | Catálogo de niveles | — |
| `ruta-transporte` | Rutas de transporte y sus detalles | — |
| `tipo-labor` | Catálogo de tipos de labor | — |
| `unidad-economica` | Unidades económicas | — |
| `veta` | Catálogo de vetas | — |
| `zona` | Catálogo de zonas | — |

## Rutas
Definidas en `planeamiento-mant.routes.ts`, registradas por lazy loading 
en `app.config.ts`.

## Dependencias
[ej: usa `shared/tabla-generica` si tienen un componente de tabla reutilizable, 
o `core/` para permisos]