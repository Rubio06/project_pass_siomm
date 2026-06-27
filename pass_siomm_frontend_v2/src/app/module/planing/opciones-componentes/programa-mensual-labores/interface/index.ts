/**
 * ÍNDICE CENTRAL DE INTERFACES
 * Módulo: Programa Mensual de Labores
 * 
 * Este archivo centraliza todas las interfaces del módulo para facilitar las importaciones.
 * Uso: import { BotonesInterface, ProgramaExplotacion } from './interfaces';
 */

// ============================================
// INTERFACES DE LISTA Y BOTONES
// ============================================
export type {
    BotonesInterface,
    ListMensualIncidencias,
    ListaMensual,
    ProgramaMensualInformacion
} from './programa-mensual.interface';

export { ARREGLO_BOTONES } from './programa-mensual.interface';

// ============================================
// INTERFACES DE EDICIÓN
// ============================================
export type {
    menuItem,
    ProgramaExplotacion,
    IndiceRendimiento,
    CodCto,
    CodCta,
    Ala,
    Sostenimiento,
    TaladrosLargos,
    valOperativo,
    DatosEntradaPrograma,
    UndEconomDto,
    ZonaDto,
    MaestrosProgMensual,
    MostrarMaeFase
} from './edicion-programa-mensual.interface';

export { ICONOS } from './edicion-programa-mensual.interface';
