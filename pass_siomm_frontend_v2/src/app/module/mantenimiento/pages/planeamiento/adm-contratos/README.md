# Sub-módulo: Adm-Contratos

## ¿Qué hace?
Administración de contratos: listado, filtros, reportes y gestión 
del servicio de transporte asociado a cada contrato.

## Estructura interna

### Página principal
- `pages/lista-adm-contratos/`: listado de contratos con filtros y tabla

### Componentes de apoyo
- `filtros-contrato/`: filtros de búsqueda
- `tabla-contrato/`: tabla que renderiza el listado
- `reporte/`: generación de reportes
  - `reporte-exportar/`: exportación (¿Excel/PDF?)
  - `reporte-imprimir/`: vista de impresión

### ⚠️ Sub-módulo: servicio-transporte
A diferencia de los demás, **no es un componente simple** — tiene su 
propia estructura completa (components, interfaces, services y rutas), 
por lo que funciona como un sub-módulo independiente con lazy loading 
propio dentro de adm-contratos.

Ver detalle en [`components/servicio-transporte/README.md`](./components/servicio-transporte/README.md) 
(crear si aún no existe).

## Modelos (interfaces/)
[Pendiente: pasar contenido de esa carpeta para documentar el modelo de Contrato]

## Servicios
- `adm-contratos.service.ts`: CRUD y consultas de contratos contra la API

## Flujo principal
1. `ListaAdmContratosComponent` carga contratos vía `adm-contratos.service.ts`
2. `FiltrosContratoComponent` permite filtrar el listado
3. `TablaContratoComponent` renderiza los resultados
4. `ReporteComponent` permite exportar/imprimir lo filtrado
5. Desde el listado se puede acceder a `servicio-transporte` para gestionar 
   el transporte asociado a un contrato específico