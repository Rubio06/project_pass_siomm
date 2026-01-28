import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class AppRouteReuseStrategy implements RouteReuseStrategy {
    private storedRoutes = new Map<string, DetachedRouteHandle>();
    private currentParentPath: string | null = null;

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return !(route.data && route.data['noReuse']);
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        const path = route.routeConfig?.path;
        if (!path || !handle) return;

        const fullPath = this.getFullPath(route);

        // Detectamos si cambiamos de ruta padre
        const parentPath = this.getParentFullPath(route);
        if (this.currentParentPath && this.currentParentPath !== parentPath) {
            // Limpiamos todas las rutas hijas de la ruta padre anterior
            const keysToDelete = Array.from(this.storedRoutes.keys())
                .filter(k => k.startsWith(this.currentParentPath + '/'));
            keysToDelete.forEach(k => this.storedRoutes.delete(k));

            // Además borrar la ruta padre anterior
            this.storedRoutes.delete(this.currentParentPath);
        }

        // Actualizamos la ruta padre actual
        this.currentParentPath = parentPath;

        // Guardamos la ruta normalmente
        if (!(route.data && route.data['noReuse'])) {
            this.storedRoutes.set(fullPath, handle);
        }
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

    private getFullPath(route: ActivatedRouteSnapshot): string {
        return route.pathFromRoot
            .map(r => r.routeConfig?.path)
            .filter(p => !!p)
            .join('/');
    }

    private getParentFullPath(route: ActivatedRouteSnapshot): string {
        // El fullPath sin el último segmento: identifica la ruta padre
        const paths = route.pathFromRoot
            .map(r => r.routeConfig?.path)
            .filter(p => !!p);
        if (paths.length <= 1) return paths[0] || ''; // si es ruta raíz
        return paths.slice(0, -1).join('/');
    }


}



    // private storedRoutes = new Map<string, DetachedRouteHandle>();
    // private parentToChildren = new Map<string, string[]>(); // ruta padre -> rutas hijas
    // private currentParentPath: string | null = null;

    // shouldDetach(route: ActivatedRouteSnapshot): boolean {
    //     return !(route.data && route.data['noReuse']);
    // }

    // store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    //     if (!handle || !route.routeConfig?.path) return;

    //     const fullPath = this.getFullPath(route);
    //     const parentPath = this.getParentFullPath(route);

    //     // Si cambiamos de padre, eliminar todas las rutas hijas del padre anterior
    //     if (this.currentParentPath && this.currentParentPath !== parentPath) {
    //         const oldChildren = this.parentToChildren.get(this.currentParentPath) || [];
    //         oldChildren.forEach(k => this.storedRoutes.delete(k));
    //         this.storedRoutes.delete(this.currentParentPath);
    //         this.parentToChildren.delete(this.currentParentPath);
    //     }

    //     // Actualizamos la ruta padre actual
    //     this.currentParentPath = parentPath;

    //     // Guardar ruta en storedRoutes
    //     if (!(route.data && route.data['noReuse'])) {
    //         this.storedRoutes.set(fullPath, handle);

    //         // Registrar ruta hija bajo su padre
    //         if (parentPath) {
    //             const children = this.parentToChildren.get(parentPath) || [];
    //             if (!children.includes(fullPath)) {
    //                 children.push(fullPath);
    //                 this.parentToChildren.set(parentPath, children);
    //             }
    //         }
    //     }
    // }

    // shouldAttach(route: ActivatedRouteSnapshot): boolean {
    //     const key = this.getFullPath(route);
    //     return !!route.routeConfig?.path && this.storedRoutes.has(key) && !(route.data && route.data['noReuse']);
    // }

    // retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    //     if (!route.routeConfig?.path || (route.data && route.data['noReuse'])) return null;
    //     const key = this.getFullPath(route);
    //     return this.storedRoutes.get(key) || null;
    // }

    // shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    //     return future.routeConfig === curr.routeConfig;
    // }

    // private getFullPath(route: ActivatedRouteSnapshot): string {
    //     return route.pathFromRoot
    //         .map(r => r.routeConfig?.path)
    //         .filter(p => !!p)
    //         .join('/');
    // }

    // private getParentFullPath(route: ActivatedRouteSnapshot): string {
    //     const paths = route.pathFromRoot
    //         .map(r => r.routeConfig?.path)
    //         .filter(p => !!p);
    //     if (paths.length <= 1) return paths[0] || ''; // ruta raíz
    //     return paths[0]; // Consideramos solo la **primera ruta no vacía** como padre
    // }
