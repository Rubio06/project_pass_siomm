import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class AppRouteReuseStrategy implements RouteReuseStrategy {

    // Map para almacenar los componentes reutilizables
    private storedRoutes = new Map<string, DetachedRouteHandle>();

    // Decidir si se guarda o no según data.noReuse
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // Si la ruta tiene data.noReuse → no la guardamos
        return !(route.data && route.data['noReuse']);
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        const path = route.routeConfig?.path;
        if (!path || !handle) return;

        // Si la ruta general tiene noReuse, limpiar todos los hijos guardados
        if (route.data && route.data['noReuse']) {
            const keysToDelete = Array.from(this.storedRoutes.keys())
                .filter(k => k.startsWith(path)); // elimina rutas hijas
            keysToDelete.forEach(k => this.storedRoutes.delete(k));
            return; // no guardamos la ruta general
        }

        // Guardar ruta normal
        const key = this.getFullPath(route);
        this.storedRoutes.set(key, handle);
    }



    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const key = this.getFullPath(route);
        return !!route.routeConfig?.path && this.storedRoutes.has(key) && !(route.data && route.data['noReuse']);
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (!route.routeConfig?.path || (route.data && route.data['noReuse'])) return null;
        const key = this.getFullPath(route);
        return this.storedRoutes.get(key) || null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    // Función para obtener un path único considerando rutas hijas
    private getFullPath(route: ActivatedRouteSnapshot): string {

        return route.pathFromRoot
            .map(r => r.routeConfig?.path)
            .filter(p => !!p)
            .join('/');
    }
}
