# Módulo: Programa Mensual de Labores

## Estructura del Módulo

### 📁 `/core` - Servicios e Interfaces Centrales
Contiene los servicios compartidos y las interfaces del módulo.

#### Servicios (`/services`)
- `lista-mensual.service.ts` - Gestión de listado de programas mensuales
- `boton-accion.service.ts` - Comunicación de acciones entre componentes
- `edicionProgrmaMensual.service.ts` - Lógica de edición de programas (ubicado en pages/edicion-programa-mensual-labores/services)

#### Interfaces (`/interface` y `/pages/edicion-programa-mensual-labores/interfaces`)
- `programa-mensual.interface.ts` - Interfaces para lista y botones
- `edicion-programa-mensual.interface.ts` - Interfaces para edición de programas

---

### 📁 `/components` - Componentes Compartidos
Componentes reutilizables en todo el módulo.

#### `/components/lista-programa-mensual-labores`
- `botones/` - Componente de botones de acción reutilizable
- `tabla-lista/` - Tabla para mostrar listado de programas

#### `/components/edicion-programa-mensual-labores`
- `formulario-programa-mensual/` - Formulario de información general
- `edicion-rutas/` - Componente de rutas
- `indice-rendimiento/` - Índices de rendimiento
- `programa/` - Componente de programa

---

### 📁 `/pages` - Páginas Principales

#### `/pages/panel-principal`
Página de entrada del módulo con navegación principal.

#### `/pages/lista-programa-mensual-labores`
Página que muestra el listado de todos los programas mensuales.

#### `/pages/edicion-programa-mensual-labores`
Página principal de edición con sub-componentes:

**Componentes de Edición (`/components`):**
- `/tablas-programa-rendimiento/` - Contenedor de tablas por fase
  - `tablas-preparacion/programa/` - Tabla de fase Preparación (cod: 03)
  - `tablas-explotacion/programa/` - Tabla de fase Explotación (cod: 01)
  - `tablas-desarrollo/programa/` - Tabla de fase Desarrollo (cod: 02)
  - `tablas-exploracion/programa/` - Tabla de fase Exploración (cod: 04)

**Sub-páginas (`/pages`):**
- `slider-programa-mensual/` - Navegación lateral por fases

---

## Flujo de Navegación

```
Panel Principal
    ↓
Lista Programa Mensual
    ↓
Edición Programa Mensual
    ├── Formulario General
    ├── Slider de Fases
    └── Tablas por Fase
        ├── Preparación (03)
        ├── Explotación (01)
        ├── Desarrollo (02)
        └── Exploración (04)
```

---

## Comunicación entre Componentes

### Servicio de Acciones de Botones
`BotonAccionService` permite que los botones del componente padre comuniquen acciones a los componentes hijos (tablas).

**Acciones disponibles:**
- `Nuevo` - Limpiar formulario
- `Guardar` - Guardar datos
- `Eliminar` - Eliminar registros
- `Copiar Labor` - Copiar labor
- `Resumen` - Ver resumen
- `Importar` - Importar datos
- `Exportar` - Exportar datos
- `Labores` - Gestión de labores
- `Cerrar` - Cerrar vista

---

## Rutas del Módulo

Definidas en `programama-mensua.routes.ts`:
- `/panel-principal` - Página principal
- `/lista` - Listado de programas
- `/edicion/:nro_prog/:cie_ano/:cie_per` - Edición de programa
  - `/preparacion` - Fase Preparación
  - `/explotacion` - Fase Explotación
  - `/desarrollo` - Fase Desarrollo
  - `/exploracion` - Fase Exploración

---

## Notas Importantes

1. **Interfaces duplicadas**: Existen dos archivos de interfaces que deberían consolidarse en el futuro.
2. **Servicios distribuidos**: Los servicios están en diferentes ubicaciones, considerar centralizar.
3. **Componentes de tabla**: Cada fase tiene su propia tabla con lógica similar, considerar abstraer.
4. **Colores del sistema**: El módulo usa el color principal `#033351` definido en `styles.css`.

---

## Mejoras Futuras Sugeridas

- [ ] Consolidar interfaces en una sola ubicación
- [ ] Centralizar todos los servicios en `/services`
- [ ] Crear componente base para tablas de fases
- [ ] Implementar lazy loading para las tablas
- [ ] Agregar tests unitarios
