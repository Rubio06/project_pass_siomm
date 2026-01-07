
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
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js"
    ],
    "route": "/menu-principal"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js"
    ],
    "route": "/menu-principal/planeamiento"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js",
      "chunk-WXBJ253Y.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js",
      "chunk-WXBJ253Y.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/factor-operativo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js",
      "chunk-WXBJ253Y.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-avance"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js",
      "chunk-WXBJ253Y.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-exploracion"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js",
      "chunk-WXBJ253Y.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/metodo-minado"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js",
      "chunk-WXBJ253Y.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-avance"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
      "chunk-LWGT3H6O.js",
      "chunk-BSRY2CHD.js",
      "chunk-WXBJ253Y.js",
      "chunk-GBBKM3KW.js"
    ],
    "route": "/menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-ciclo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4QCK4TVE.js",
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
    'index.csr.html': {size: 7496, hash: 'b7daa45e23791ce702b12da944189b10be413c090b08d5a681aacd0904939060', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1213, hash: 'd1cf19d9e0f9f5dea55990952ecaae2e57179a91ff81082f62ef736a79c68b45', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/auth_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/factor-operativo/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_factor-operativo_index_html.mjs').then(m => m.default)},
    'menu-principal/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-ciclo/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_semanas-ciclo_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/metodo-minado/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_metodo-minado_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-exploracion/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_estandar-exploracion_index_html.mjs').then(m => m.default)},
    'menu-principal/geologia/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_geologia_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/estandar-avance/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_estandar-avance_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 18195, hash: '414f4dad01ad692b705a56639dcb353f39c7488522ad426c74d91914920f4c67', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/apertura_de_periodo_operativo/semanas-avance/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_apertura_de_periodo_operativo_semanas-avance_index_html.mjs').then(m => m.default)},
    'menu-principal/planeamiento/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/menu-principal_planeamiento_index_html.mjs').then(m => m.default)},
    'main-4SGQRSDL.css': {size: 30476, hash: 'C+8X673iqY0', text: () => import('./assets-chunks/main-4SGQRSDL_css.mjs').then(m => m.default)},
    'chunk-C7EN5WYG.css': {size: 30476, hash: 'C+8X673iqY0', text: () => import('./assets-chunks/chunk-C7EN5WYG_css.mjs').then(m => m.default)},
    'main.server.css': {size: 30476, hash: 'C+8X673iqY0', text: () => import('./assets-chunks/main_server_css.mjs').then(m => m.default)},
    'styles-RN3OGN3U.css': {size: 76929, hash: '40Volqxh61U', text: () => import('./assets-chunks/styles-RN3OGN3U_css.mjs').then(m => m.default)}
  },
};
