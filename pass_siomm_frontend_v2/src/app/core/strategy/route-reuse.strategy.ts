import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class AppRouteReuseStrategy implements RouteReuseStrategy {

    private storedRoutes = new Map<string, DetachedRouteHandle>();

    private shouldNotReuse(route: ActivatedRouteSnapshot): boolean {
        return route.data?.['noReuse'] === true;
    }

    // ❌ NO guardar si es noReuse
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (this.shouldNotReuse(route)) return false;

        const path = route.routeConfig?.path;
        return !!path && path !== '';
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        if (this.shouldNotReuse(route)) return;

        const path = route.routeConfig?.path;
        if (path && handle) {
            this.storedRoutes.set(path, handle);
        }
    }

    // ❌ NO restaurar si es noReuse
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (this.shouldNotReuse(route)) return false;

        const path = route.routeConfig?.path;
        return !!path && this.storedRoutes.has(path);
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (this.shouldNotReuse(route)) return null;

        const path = route.routeConfig?.path;
        return path ? this.storedRoutes.get(path) || null : null;
    }

    // ❌ Forzar recreación
    shouldReuseRoute(
        future: ActivatedRouteSnapshot,
        curr: ActivatedRouteSnapshot
    ): boolean {
        if (this.shouldNotReuse(future)) return false;
        return future.routeConfig === curr.routeConfig;
    }
}
