
export interface MaeUsuario {
    cod_empresa: string;
    cod_empresa_unidad: string;
    cod_usuario: string;

    ind_usu_min?: string;
    ind_usu_plt?: string;
    ind_usu_pln?: string;
    ind_usu_geo?: string;
    ind_usu_lab?: string;
    ind_usu_jefe_turno?: string;
    ind_usu_jefe_zona_mina?: string;
    ind_usu_sup_mina?: string;
    ind_usu_sup?: string;
    ind_usu_ing?: string;
    ind_usu_sis?: string;
}

export interface LogResponse {
    success: boolean;
    message: string;
    token: string;
    data: MaeUsuario
}


export function emptyMaeUsuario(): MaeUsuario {
    return {
        cod_empresa: '',
        cod_empresa_unidad: '',
        cod_usuario: '',
        ind_usu_min: '',
        ind_usu_plt: '',
        ind_usu_pln: '',
        ind_usu_geo: '',
        ind_usu_lab: '',
        ind_usu_jefe_turno: '',
        ind_usu_jefe_zona_mina: '',
        ind_usu_sup_mina: '',
        ind_usu_sup: '',
        ind_usu_ing: '',
        ind_usu_sis: ''
    };
}