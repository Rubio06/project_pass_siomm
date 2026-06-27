import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { EdicionProgrmaMensualService } from '../services';
import { FormUtils } from 'src/app/utils/form-utils';
import { BotonAccionService } from '../services';
import { FormArray } from '@angular/forms';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = async () => {
    const programaState = inject(EdicionProgrmaMensualService);
    const botonAccionService = inject(BotonAccionService);

    if (!programaState.hayDatosPendientes()) return true;

    const result = await FormUtils.confirmarAnulacion(
        'Salir de la interfaz',
        '<b>¿Tiene cambios sin guardar, desea salir?</b><br>Si continúa, perderá los datos no guardados.',
        'Sí, deseo salir',
        'No deseo salir'
    );

    if (!result.isConfirmed) return false;

    // Limpiar datos y FormArray activo
    programaState.limpiarTodosDatosFases();
    const formDetalle = botonAccionService.getFormulario();
    const labores = formDetalle?.get('labores') as FormArray | null;
    labores?.clear();

    return true;
};
