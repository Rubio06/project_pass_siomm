apertura-periodo-operativo/
├── components/                       # Componentes de soporte locales
│   ├── factor-operativo/             # Gestión de factores operativos particulares
│   ├── factor-operativo-tabla/       # Renderizado en malla/tabla de los factores
│   ├── periodo/                      # Componente de control del periodo
│   ├── tabs-menu/                    # Vistas principales de configuración por pestañas
│   │   ├── estandar-avance-main/     # Estándares de avance lineal
│   │   ├── estandar-exploracion-main/# Estándares de perforación/exploración
│   │   ├── factor-operativo-main/    # Orquestador del factor operativo
│   │   ├── metodo-minado-main/       # Configuración de métodos de explotación
│   │   ├── semanas-avance-main/      # Planificación semanal de avances
│   │   └── semanas-ciclo-main/       # Control del ciclo operativo por semanas
│   └── valores/                      # Gestión de valores base paramétricos
├── interface/                        # Modelos y contratos de datos
│   └── aper-per-oper.interface.ts    # Tipado estricto del módulo
├── page/planning-main/               # Contenedor de la página principal de planeamiento
│   └── modal-periodo/                # Diálogo para la apertura/edición de periodos
├── services/                         # Servicios de lógica de negocio y estado
│   ├── semanas-avance-main/
│   │   └── semanas-avance-main.service.ts
│   ├── planing-compartido.service.ts # Estado compartido entre pestañas/componentes
│   └── planning.service.ts           # Servicio principal de comunicación con la API
├── aper-periodo-operativo.component.ts # Componente raíz y contenedor
└── apertura-periodo-operativo.routes.ts# Enrutamiento dinámico del módulo