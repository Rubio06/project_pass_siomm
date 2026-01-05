import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class AppRouteReuseStrategy implements RouteReuseStrategy {

    private storedRoutes = new Map<string, DetachedRouteHandle>();

    // Decide si una ruta debe guardarse (NO destruirse)
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = route.routeConfig?.path;
        return !!path && path !== ''; // Guardamos todos los hijos
    }

    // Guarda el componente
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        const path = route.routeConfig?.path;
        if (path && handle) {
            this.storedRoutes.set(path, handle);
        }
    }

    // Decide si una ruta puede restaurarse
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = route.routeConfig?.path;
        return !!path && this.storedRoutes.has(path);
    }

    // Devuelve el componente guardado
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const path = route.routeConfig?.path;
        return path ? this.storedRoutes.get(path) || null : null;
    }

    // Reutilizar la ruta si es literalmente la misma
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}
