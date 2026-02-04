import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { debounce, debounceTime, finalize, Subject, switchMap, tap } from "rxjs";
import { SpinnerService } from "src/app/shared/components/spinner/service/spinner.service";

export function loaderInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const loaderService = inject(SpinnerService);
    // Mostrar spinner AL INICIO de la petición
    loaderService.show();
    return next(req).pipe(
        // finalize se ejecuta siempre al terminar (success o error)
        finalize(() => loaderService.hide())
    );
}
