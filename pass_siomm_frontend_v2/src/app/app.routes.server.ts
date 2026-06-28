import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: 'menu-principal/planeamiento/programa_mensual_de_labores/detalle-programacion/**',
        renderMode: RenderMode.Server,
    },
    {
        path: '**',
        renderMode: RenderMode.Prerender,
    },
];


// import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//     // 1. Rutas específicas con parámetros complejos (SSR)
//     {
//         path: 'menu-principal/planeamiento/programa_mensual_de_labores/detalle-programacion/**',
//         renderMode: RenderMode.Server,
//     },
//     // 2. Mantenimiento y otras rutas con parámetros (SSR)
//     {
//         path: 'menu-principal/mantenimiento/**',
//         renderMode: RenderMode.Server,
//     },
//     // 3. El resto de la aplicación que sea estático (Login, Dashboards fijos, etc.)
// import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//     {
//         path: '**',
//         renderMode: RenderMode.Prerender,
//     },
// ];

// import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//     {
//         path: 'menu-principal/planeamiento/programa_mensual_de_labores/detalle-programacion/**',
//         renderMode: RenderMode.Server,
//     },

//     {
//         path: '**',
//         renderMode: RenderMode.Server,
//     },
// ];



// import { RenderMode, ServerRoute } from '@angular/ssr';

// export const serverRoutes: ServerRoute[] = [
//     {
//         path: '**',
//         renderMode: RenderMode.Prerender, // <- Cambia todo a Prerender
//     },
// ];
