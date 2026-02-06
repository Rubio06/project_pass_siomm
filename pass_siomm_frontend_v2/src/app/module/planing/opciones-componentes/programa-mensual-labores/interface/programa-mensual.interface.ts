export type BotonVariant = 'primary' | 'success' | 'danger';

export interface BotonesInterface {
    texto: string;
    accion: string;
    variant: BotonVariant;
}

export const ARREGLO_BOTONES: BotonesInterface[] = [
    { texto: 'Nuevo', accion: 'nuevo', variant: "success" },
    { texto: 'Editar', accion: 'editar', variant: "primary" },
    { texto: 'Eliminar', accion: 'eliminar', variant: "danger" },
    { texto: 'Exportar', accion: 'exportar', variant: "danger" }
]
