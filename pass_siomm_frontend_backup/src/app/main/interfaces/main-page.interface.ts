// Nuevo Nivel: El nivel de Opciones/Enlaces finales
export interface MainPageOpc {
    cod_ruta_opc: number;
    nom_ruta_opc: string;
    // ... puedes omitir las propiedades 'pk_cod_ruta_primer', 'rutas_primarias_fk', etc., si no se usan
}

// Interfaz Corregida para Nivel Cuaternario
export interface MainPageCuar {
    cod_ruta_cuar: number;
    nom_ruta_cuar: string;
    // AÑADIDO: Para manejar el siguiente nivel en la data
    opciones?: MainPageOpc[]; // Propiedad opcional si no todas las rutas tienen opciones
}

// Interfaz Corregida para Nivel Terciario
export interface MainPageTerc {
    cod_ruta_terc: number;
    nom_ruta_terc: string;
    // CORREGIDO: Usamos 'rutas_cuartas' para coincidir con la data
    rutas_cuartas: MainPageCuar[];
}

// Las interfaces de Nivel 1 y Nivel 2 están correctas.
export interface MainPagePrimer {
    cod_ruta_primer: number;
    nom_ruta_primer: string;
    rutas_secundarias: MainPageSecun[];
}

export interface MainPageSecun {
    cod_ruta_secun: number;
    nom_ruta_secun: string;
    rutas_terciarias: MainPageTerc[];
}
