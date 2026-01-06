
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/auth/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-QQ7LSPAJ.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-QQ7LSPAJ.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-QQ7LSPAJ.js",
      "chunk-GBBKM3KW.js"
    ],
    "redirectTo": "/auth/login",
    "route": "/auth/**"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js"
    ],
    "route": "/menu-principal"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js"
    ],
    "route": "/menu-principal/planeamiento"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js",
      "chunk-ZDT7RBIG.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js",
      "chunk-ZDT7RBIG.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/factor-operativo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js",
      "chunk-ZDT7RBIG.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-avance"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js",
      "chunk-ZDT7RBIG.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-exploracion"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js",
      "chunk-ZDT7RBIG.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/metodo-minado"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js",
      "chunk-ZDT7RBIG.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-avance"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-XKTAQPUH.js",
      "chunk-ZDT7RBIG.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-ciclo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-MEM2EME5.js",
      "chunk-LWGT3H6O.js",
      "chunk-TOTGFLFV.js"
    ],
    "route": "/menu-principal/geologia"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-XPCEO4XQ.js"
    ],
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 7561, hash: '7ae20510610abe3c699cb14b61dd832235675bd169d18f29a16baeeeffd920ca', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1213, hash: 'c8869b4c8d2b521ae58c801db605e1f0ec40b5d2a3fd86045f14c235cd5ee777', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-avance/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_estandar-avance_index_html.mjs').then(m => m.default)},
    'auth/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/auth_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-ciclo/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_semanas-ciclo_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_index_html.mjs').then(m => m.default)},
    'menu-principal/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/metodo-minado/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_metodo-minado_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/factor-operativo/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_factor-operativo_index_html.mjs').then(m => m.default)},
    'menu-principal/geologia/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_geologia_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-exploracion/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_estandar-exploracion_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 18263, hash: 'ba1d196cd3348f7a301b58b949b7e7aa9a508d544430b75409b3ef838a0c1b23', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-avance/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_semanas-avance_index_html.mjs').then(m => m.default)},
    'main-4SGQRSDL.css': {size: 30476, hash: 'C+8X673iqY0', text: () => import('./assets-chunks/main-4SGQRSDL_css.mjs').then(m => m.default)},
    'chunk-C7EN5WYG.css': {size: 30476, hash: 'C+8X673iqY0', text: () => import('./assets-chunks/chunk-C7EN5WYG_css.mjs').then(m => m.default)},
    'main.server.css': {size: 30476, hash: 'C+8X673iqY0', text: () => import('./assets-chunks/main_server_css.mjs').then(m => m.default)},
    'styles-VIVG2W7K.css': {size: 77082, hash: 'EajNYDI3Pio', text: () => import('./assets-chunks/styles-VIVG2W7K_css.mjs').then(m => m.default)}
  },
};
