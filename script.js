/* ============================================================
   PORTAL DE DASHBOARDS — ALVACO · INTELIGENCIA COMERCIAL
   script.js · Lógica y configuración
   v3.0 · ago 2026
   ------------------------------------------------------------
   Novedades v3.0
   · Dos reportes nuevos exclusivos IC (Promedio Master Final e
     Ingresos Mensuales Pelucheras)
   · Login general del portal para todo Comercialización
   · Avatar de perfil con menú de cuenta (contraseña, favoritos,
     área IC, atajos, cerrar sesión)
   ------------------------------------------------------------
   Secciones: configuración · iconos · favoritos · área IC ·
   login del portal · perfil · sidebar · hero · recientes ·
   tarjetas · visor · zoom · arranque · carrusel · reloj ·
   buscador · Bootstrap (toast y tooltips)
   ============================================================ */

/* ============================================================
   🚑 ARRANQUE A PRUEBA DE FALLOS  ·  v3.1
   ------------------------------------------------------------
   Corre antes que nada: si algo más abajo truena, el login ya
   está en pantalla y el error se muestra a la vista en lugar de
   dejar la página en blanco. No toca nada de la lógica.
   ============================================================ */
const PORTAL_VERSION = 'v3.1';
(function arranqueSeguro(){
  console.log('%cPortal IC ALVACO ' + PORTAL_VERSION, 'color:#17A2A6;font-weight:bold');

  /* 1) Muestra el login de inmediato si no hay sesión guardada */
  let haySesion = false;
  try {
    haySesion = !!(localStorage.getItem('alvaco-portal-user') ||
                   sessionStorage.getItem('alvaco-portal-user'));
  } catch(e){}
  if (!haySesion){
    const ov = document.getElementById('portalLoginOverlay');
    if (ov) ov.classList.add('visible');
  }

  /* 2) Cualquier error suelto se pinta arriba, con línea y archivo */
  window.addEventListener('error', function(ev){
    let caja = document.getElementById('portalErrorJS');
    if (!caja){
      caja = document.createElement('div');
      caja.id = 'portalErrorJS';
      caja.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;' +
        'background:#7F1D2E;color:#fff;font:12px/1.5 ui-monospace,Consolas,monospace;' +
        'padding:10px 14px;white-space:pre-wrap;word-break:break-word;' +
        'box-shadow:0 4px 18px rgba(0,0,0,.4)';
      document.body.appendChild(caja);
    }
    const archivo = (ev.filename || '').split('/').pop();
    caja.textContent += 'Portal ' + PORTAL_VERSION + ' · ' + (ev.message || 'Error') +
      '\n   ' + archivo + ' línea ' + (ev.lineno || '?') + '\n';
  });
})();

/* ============================================================
   ⚙️  CONFIGURACIÓN DE DASHBOARDS — EDITA SOLO ESTA SECCIÓN
   ------------------------------------------------------------
   - nombre / descripcion: texto de la tarjeta
   - categoria: agrupa en el menú lateral (puedes crear nuevas)
   - color: blue | teal | green | amber | purple | red
   - tipo: (opcional) "app" para aplicaciones de Power Apps y
     "web" para herramientas HTML propias. Si se omite, la
     tarjeta se trata como reporte de Power BI.
   - soloIC: true → la tarjeta solo existe dentro del área IC.
   - oculto: true → sin tarjeta; solo accesible desde el sidebar
     o por URL.
   - imagen: (opcional) ruta a una imagen para la tarjeta.
   - embed: URL de inserción segura (visor NO editable).
     · Power BI:
       https://app.powerbi.com/reportEmbed?reportId=ID&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7
     · Power Apps: vínculo web de la app + parámetros.
   - url: liga opcional para el botón "abrir en pestaña nueva".
   Deja embed: "" y url: "" para tarjeta deshabilitada.
   ============================================================ */
const DASHBOARDS = [
  {
    nombre: "Ingresos diarios",
    descripcion: "Ingreso diario por media.",
    categoria: "Ingresos",
    color: "blue",
    embed: "https://app.powerbi.com/reportEmbed?reportId=cd9e2484-22d8-44cc-9efc-04d6cc0aa303&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7",
    imagen: "img/pagina-bsica-muelocos-2.png",
    url: "https://app.powerbi.com/links/sk9uzy9SnS?ctid=923eb367-abae-4010-9989-b7cf33fb74a7&pbi_source=linkShare"
  },
  {
    nombre: "Equipos parados",
    descripcion: "Equipos parados sin resolver por 15 días",
    categoria: "Equipos",
    color: "teal",
    embed: "",
    imagen: "img/oso_constructor_transparente.png",
    url: ""
  },
  {
    nombre: "Altec",
    descripcion: "Instalaciones de equipos.",
    categoria: "Instalaciones",
    color: "green",
    imagen:"img/maquina_oso_transparente.png",
    embed: "https://app.powerbi.com/reportEmbed?reportId=348b2372-52a9-4844-a5b6-300d74b04d15&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7",
    url: "https://app.powerbi.com/links/CI94RENVAq?ctid=923eb367-abae-4010-9989-b7cf33fb74a7&pbi_source=linkShare"
  },
  {
    nombre: "Seguimiento de Locales",
    descripcion: "Pipeline: Arquitectura → Dir. Comercial → Ejecutivo → IC.",
    categoria: "Operación",
    color: "amber",
    imagen:"img/oso_semaforo_verde_transparente.png",
    embed: "https://app.powerbi.com/reportEmbed?reportId=96e39bfc-73e5-4fe7-bc95-902ac7e9c95b&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7",
    url: "https://app.powerbi.com/links/_THlr15aY4?ctid=923eb367-abae-4010-9989-b7cf33fb74a7&pbi_source=linkShare"
  },

  {
    nombre: "Análisis de Renta",
    descripcion: "Simula escenarios de renta mixta y prorrateo de renta fija: compara renta y margen actual vs. nuevo.",
    categoria: "Herramientas IC",
    color: "teal",
    tipo: "web",     /* ← herramienta HTML propia: se abre en el visor sin parámetros de Power BI */
    soloIC: true,    /* ← EXCLUSIVO EQUIPO IC: solo visible dentro del área IC (con sesión) */
    imagen: "img/oso_semaforo_verde_transparente.png",
    /* El archivo vive JUNTO al portal, en la misma carpeta */
    embed: "Herramientas_Renta_ALVACO.html",
    url: "Herramientas_Renta_ALVACO.html"
  },
  {
    /* ══════════ EXCLUSIVO IC ══════════
       Herramienta HTML de consulta de inventario.
       Reporte_Inventario.html debe estar en la MISMA carpeta
       del portal (junto a index.html).                       */
    nombre: "Reporte Inventario",
    descripcion: "Consulta y filtrado del inventario de equipos por plaza, cadena y estatus.",
    categoria: "Herramientas IC",
    color: "red",
    tipo: "web",
    soloIC: true,
    imagen: "img/oso otto real.png",
    embed: "Reporte_Inventario.html",
    url: "Reporte_Inventario.html"
  },
  {
    /* ══════════ EXCLUSIVO IC · Power BI ══════════ */
    nombre: "Promedio Master Final",
    descripcion: "Promedio de ingresos por equipo — modelo Master_Final.",
    categoria: "Ingresos",
    color: "blue",
    soloIC: true,
    imagen: "img/pagina-bsica-muelocos-2.png",
    embed: "https://app.powerbi.com/reportEmbed?reportId=02edafb0-b01a-4625-9a98-4c88ee378b70&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7",
    url: "https://app.powerbi.com/groups/9329f718-3abb-4325-8cfc-f5564b8e6fd2/reports/02edafb0-b01a-4625-9a98-4c88ee378b70/47bf8b942c1ad76902c5?language=es-MX&experience=power-bi"
  },
  {
    /* ══════════ EXCLUSIVO IC · Power BI ══════════ */
    nombre: "Ingresos Mensuales Pelucheras",
    descripcion: "Ingreso promedio mensual de pelucheras — formato grande.",
    categoria: "Ingresos",
    color: "purple",
    soloIC: true,
    imagen: "img/maquina_sin_fondo.png",
    embed: "https://app.powerbi.com/reportEmbed?reportId=fdec9637-aba1-4a84-a376-53b905a636f9&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7",
    url: "https://app.powerbi.com/groups/9329f718-3abb-4325-8cfc-f5564b8e6fd2/reports/fdec9637-aba1-4a84-a376-53b905a636f9/3d2c6234636490a08731?language=es-MX&experience=power-bi"
  },
  {
    nombre: "Tickets IC",
    descripcion: "Solicita apoyo al equipo de Inteligencia Comercial y da seguimiento a tus tickets.",
    categoria: "Solicitudes",
    color: "purple",
    tipo: "app",     /* ← Power Apps: el visor no agrega parámetros de Power BI */
    oculto: true,    /* ← sin tarjeta en el grid: se abre solo desde "Solicitar ticket" */
    imagen: "img/oso_constructor_transparente.png",
    embed: "https://apps.powerapps.com/play/e/default-923eb367-abae-4010-9989-b7cf33fb74a7/a/37998833-3d4f-485d-9e16-0f4a8d37e341?tenantId=923eb367-abae-4010-9989-b7cf33fb74a7&source=portal-ic&hideNavBar=true",
    url: "https://apps.powerapps.com/play/e/default-923eb367-abae-4010-9989-b7cf33fb74a7/a/37998833-3d4f-485d-9e16-0f4a8d37e341?tenantId=923eb367-abae-4010-9989-b7cf33fb74a7"
  },
    {
    nombre: "Tiendas Neto",
    descripcion: "Ingreso, renta y equipos por estado, plaza y precio de juego.",
    categoria: "Ingresos",
    color: "red",
    soloIC: true,
    imagen: "img/maquina_sin_fondo.png",
    embed: "https://app.powerbi.com/reportEmbed?reportId=c89958f5-bfbe-4950-a686-8974525da509&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7",
    url: "https://app.powerbi.com/links/GdfBrn1uXa?ctid=923eb367-abae-4010-9989-b7cf33fb74a7&pbi_source=linkShare"
   
  }
  /* Agrega más dashboards copiando la estructura anterior.
     La última entrada NO lleva coma al final.               */
];

/* ---------- Imágenes del carrusel del sidebar ---------- */
const CARRUSEL_IMAGENES = [
  "img/maquina_oso_transparente.png",
  "img/maquina_sin_fondo.png",
  "img/lastic_sin_fondo.png",
  "img/xtreme_sin_fondo.png",
  "img/munelocos_classic_sin_fondo.png",
  "img/munelocos_nano_sin_fondo.png",
  "img/munelocos_collections_sin_fondo.png",
  "img/munelocos_plus_sin_fondo.png",
  "img/tren_kiddie_ride_sin_fondo.png"
];
const CARRUSEL_MS = 4000;

/* ---------- Paneles de Power BI en el visor ---------- */
const OCULTAR_PANEL_FILTROS = true;
const OCULTAR_PANEL_PAGINAS = false;

/* ---------- Accesos directos del menú lateral ---------- */
const ACCESO_DIRECTO_NOMBRE = "";
const ACCESO_DIRECTO_LABEL  = "Solicitar ticket";
const ACCESO_DIRECTO2_NOMBRE = "";
const ACCESO_DIRECTO2_LABEL  = "";

/* ============================================================
   🔐 ACCESOS — CORREOS Y CONTRASEÑAS
   ============================================================ */

/* ---------- 1) PORTAL: todo Comercialización ----------
   Nadie ve el portal sin correo + contraseña.
   ⚠️ EDITA la lista con los correos reales (minúsculas):     */
const PORTAL_EMAILS = [
  "david.castillo@alvaco.com.mx",
  "julio.chavez@alvaco.com.mx",
  "marco.garcia@alvaco.com.mx",
  "monica.vazquez@alvaco.com.mx",
  "Sharoon.zepeda@alvaco.com.mx",
  "eric.reyes@alvaco.com.mx"
  /* ← agrega aquí a los demás de Comercialización */
];

/* true = cualquier correo @alvaco.com.mx entra con la contraseña
   general, sin listarlo arriba. false = solo la lista.        */
const PORTAL_DOMINIO_LIBRE = true;
const PORTAL_DOMINIO       = "@alvaco.com.mx";
/* CONTRASEÑA GENERAL DEL PORTAL (hash SHA-256).
   El hash de abajo corresponde a Comer26 */
const PORTAL_PASS_HASH = "9198275ee83a5cfd67f9117a9da71db3c295383a171280ec7c19049d8149b17c";
/* Contraseñas personales permanentes del portal (opcional).
   Pega aquí el código que te envíe cada quien:
     "julio.chavez@alvaco.com.mx": "hash-de-64-caracteres",   */
const PORTAL_PASS_USUARIOS = {
};

/* Horas que dura la sesión con "mantener sesión" marcado.
   Sin la palomita, la sesión muere al cerrar la pestaña.      */
const PORTAL_HORAS_SESION = 12;

/* IMAGEN DE LA PANTALLA DE ACCESO
   Ruta de la foto que se ve del lado izquierdo del login.
   Ponla en la carpeta img/ y escribe aquí su nombre. Se recorta
   sola (tipo "cover"), así que funciona mejor en vertical o
   cuadrada, mínimo 900 px de alto. Déjalo en "" para usar solo
   el degradado azul-teal de ALVACO.                           */
const PORTAL_LOGIN_IMAGEN = "img/oso otto real.png";

/* ---------- 2) ÁREA IC: segundo candado ----------
   Solo estos correos ven las tarjetas con soloIC: true.       */
const IC_EMAILS = [
  "david.castillo@alvaco.com.mx",
  "julio.chavez@alvaco.com.mx",
  "marco.garcia@alvaco.com.mx"
];

/* Contraseña maestra del equipo IC (hash SHA-256) */
const IC_PASS_HASH = "8bf7c3aa8c97f0782bf9fcb452bbe72627620a6945385fc08f7442b22f21e292";

/* Contraseñas personales permanentes del área IC (opcional) */
const IC_PASS_USUARIOS = {
  /* "correo@alvaco.com.mx": "hash-de-64-caracteres", */
};

/* ---------- 3) FOTOS DE PERFIL ----------
   Guarda las fotos en  img/perfiles/  con el nombre de usuario
   del correo, p. ej.  img/perfiles/david.castillo.png
   (cuadradas, 256×256). Si no existe, se dibuja un avatar con
   las iniciales y un color de marca fijo por persona.         */
const PERFIL_RUTA_FOTOS = 'img/perfiles/';
const PERFIL_FOTO_AUTO  = true;
const PERFIL_FOTOS = {
  /* Rutas manuales (tienen prioridad):
     "david.castillo@alvaco.com.mx": "img/perfiles/david.jpg", */
};

/* Foto del perfil de Microsoft 365 (la del correo).
   El portal la pide a Outlook con la sesión que ya tiene abierta
   el navegador. Si el equipo bloquea cookies de terceros o no hay
   sesión de M365, no pasa nada: cae al archivo local y, si tampoco
   existe, a las iniciales. Ponlo en false para no intentarlo.   */
const PERFIL_FOTO_M365 = true;
const PERFIL_M365_URL  = 'https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email={correo}&UA=0&size=HR648x648';
const PERFIL_PALETA = ['#2D7DD2','#17A2A6','#22A55B','#E8A020','#7C4DD2','#E2486B'];

/* ---------- 4) COLORES DEL SALUDO ----------
   Letras del saludo al estilo del logo Muñelocos. Son los mismos
   acentos de marca del portal, así que se leen bien sobre blanco.
   Cambia el orden si quieres otro ritmo.                       */
const MUNELOCOS_COLORES = ['#E2486B','#E8A020','#22A55B','#2D7DD2','#7C4DD2','#17A2A6'];

/* ============================================================
   FIN DE LA CONFIGURACIÓN
   ============================================================ */

/* ==================== ICONOS SVG ==================== */
const ICONS = {
  chart: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="18" y1="20" x2="18" y2="10"/><path d="M4 20h16"/></svg>',
  home:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
  folder:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  star:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.5 15 9 22 9.8 17 14.6 18.2 21.5 12 18.2 5.8 21.5 7 14.6 2 9.8 9 9"/></svg>',
  external:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></svg>',
  eye:   '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  starSmall:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.5 15 9 22 9.8 17 14.6 18.2 21.5 12 18.2 5.8 21.5 7 14.6 2 9.8 9 9"/></svg>',
  app:   '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  ticket:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-6Z"/><line x1="14" y1="5" x2="14" y2="8"/><line x1="14" y1="11" x2="14" y2="13"/><line x1="14" y1="16" x2="14" y2="19"/></svg>',
  lock:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  lockMini:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
};

/* Iconos del menú de perfil */
const PF_ICO = {
  ic:      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  star:    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.5 15 9 22 9.8 17 14.6 18.2 21.5 12 18.2 5.8 21.5 7 14.6 2 9.8 9 9"/></svg>',
  ticket:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.5 2.5 0 0 0 0-6Z"/><line x1="14" y1="5" x2="14" y2="19" stroke-dasharray="2 3"/></svg>',
  llave:   '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3"/></svg>',
  teclado: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>',
  bote:    '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  salir:   '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  reloj:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>'
};

/* ==================== REFERENCIAS DEL DOM ==================== */
const grid       = document.getElementById('grid');
const sideNav    = document.getElementById('sideNav');
const searchIn   = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');

/* ==================== FAVORITOS ==================== */
let filtroActivo = 'Todos';
let favoritos = new Set();

try {
  const saved = localStorage.getItem('alvaco-favoritos');
  if (saved) favoritos = new Set(JSON.parse(saved));
} catch(e){ /* modo en memoria */ }

function guardarFavoritos(){
  try { localStorage.setItem('alvaco-favoritos', JSON.stringify([...favoritos])); }
  catch(e){ /* modo en memoria */ }
}

/* ==================== HASH (compartido) ====================
   Usa crypto.subtle cuando existe (https). Al abrir el portal como
   archivo local (file://) el navegador no lo expone, así que cae a
   una implementación propia de SHA-256: mismo resultado, mismos
   hashes, el login sirve igual en los dos casos.                */
async function hashIC(texto){
  const data = new TextEncoder().encode(texto);
  if (window.crypto && window.crypto.subtle){
    const buf = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return sha256Local(data);
}

/* SHA-256 en JavaScript puro (respaldo para file://) */
function sha256Local(bytes){
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];

  const largo = bytes.length;
  const conRelleno = new Uint8Array((((largo + 8) >> 6) + 1) << 6);
  conRelleno.set(bytes);
  conRelleno[largo] = 0x80;
  new DataView(conRelleno.buffer).setUint32(conRelleno.length - 4, largo * 8, false);

  const w = new Uint32Array(64);
  const vista = new DataView(conRelleno.buffer);
  const gira = (x, n) => (x >>> n) | (x << (32 - n));

  for (let bloque = 0; bloque < conRelleno.length; bloque += 64){
    for (let i = 0; i < 16; i++) w[i] = vista.getUint32(bloque + i * 4, false);
    for (let i = 16; i < 64; i++){
      const s0 = gira(w[i-15], 7) ^ gira(w[i-15], 18) ^ (w[i-15] >>> 3);
      const s1 = gira(w[i-2], 17) ^ gira(w[i-2], 19) ^ (w[i-2] >>> 10);
      w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,hh] = h;
    for (let i = 0; i < 64; i++){
      const S1 = gira(e,6) ^ gira(e,11) ^ gira(e,25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = gira(a,2) ^ gira(a,13) ^ gira(a,22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e;
      e = (d + t1) >>> 0;
      d = c; c = b; b = a;
      a = (t1 + t2) >>> 0;
    }
    h = [h[0]+a, h[1]+b, h[2]+c, h[3]+d, h[4]+e, h[5]+f, h[6]+g, h[7]+hh].map(x => x >>> 0);
  }
  return h.map(x => x.toString(16).padStart(8, '0')).join('');
}

/* ============================================================
   ÁREA IC: SESIÓN Y LOGIN
   ============================================================ */
function correoSesionIC(){
  try { return (localStorage.getItem('alvaco-ic-user') || '').toLowerCase().trim(); }
  catch(e){ return ''; }
}

function esUsuarioIC(){
  const correo = correoSesionIC();
  return !!correo && IC_EMAILS.map(e => e.toLowerCase().trim()).includes(correo);
}

const icLoginOverlay = document.getElementById('icLoginOverlay');
const icLoginCorreo  = document.getElementById('icLoginCorreo');
const icLoginPass    = document.getElementById('icLoginPass');
const icLoginError   = document.getElementById('icLoginError');

function abrirLoginIC(){
  icLoginError.classList.remove('visible');
  /* Hereda el correo con el que ya entró al portal */
  icLoginCorreo.value = correoSesionPortal();
  icLoginPass.value = '';
  icLoginOverlay.classList.add('visible');
  setTimeout(() => (icLoginCorreo.value ? icLoginPass : icLoginCorreo).focus(), 80);
}
function cerrarLoginIC(){
  icLoginOverlay.classList.remove('visible');
}

function hashPersonalIC(correo){
  try { return localStorage.getItem('alvaco-ic-pass-' + correo) || ''; }
  catch(e){ return ''; }
}

/* Acepta, en orden: personal de este navegador · personal
   permanente (IC_PASS_USUARIOS) · maestra del equipo         */
async function validarPassIC(correo, pass){
  if (!pass) return false;
  const h = await hashIC(pass);
  const personalLocal  = hashPersonalIC(correo);
  const personalCodigo = (IC_PASS_USUARIOS[correo] || '').toLowerCase().trim();
  return (personalLocal && h === personalLocal) ||
         (personalCodigo && h === personalCodigo) ||
         h === IC_PASS_HASH;
}

function errorLoginIC(msg){
  icLoginError.textContent = msg;
  icLoginError.classList.add('visible');
}

async function intentarLoginIC(){
  const correo = icLoginCorreo.value.toLowerCase().trim();
  const pass   = icLoginPass.value;
  const correoOk = IC_EMAILS.map(e => e.toLowerCase().trim()).includes(correo);
  const passOk   = correoOk && (await validarPassIC(correo, pass));
  if (correoOk && passOk){
    try { localStorage.setItem('alvaco-ic-user', correo); } catch(e){}
    cerrarLoginIC();
    filtroActivo = '__IC__';
    construirSidebar();
    render();
    mostrarToast('✔ Bienvenido al área IC');
  } else {
    errorLoginIC('Correo o contraseña incorrectos.');
    icLoginPass.value = '';
    icLoginPass.focus();
  }
}

document.getElementById('icLoginEntrar').addEventListener('click', intentarLoginIC);
document.getElementById('icLoginCancelar').addEventListener('click', cerrarLoginIC);
icLoginOverlay.addEventListener('click', e => { if (e.target === icLoginOverlay) cerrarLoginIC(); });
[icLoginCorreo, icLoginPass].forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') intentarLoginIC(); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && icLoginOverlay.classList.contains('visible')) cerrarLoginIC();
});

/* --- Cambio de contraseña del área IC --- */
const icPassOverlay  = document.getElementById('icPassOverlay');
const icPassActual   = document.getElementById('icPassActual');
const icPassNueva    = document.getElementById('icPassNueva');
const icPassConfirma = document.getElementById('icPassConfirma');
const icPassError    = document.getElementById('icPassError');

function abrirCambioPassIC(){
  if (!esUsuarioIC()) return;
  icPassError.classList.remove('visible');
  icPassActual.value = '';
  icPassNueva.value = '';
  icPassConfirma.value = '';
  document.getElementById('icPassSubtitulo').textContent = correoSesionIC();
  document.getElementById('icPassForm').style.display = '';
  document.getElementById('icPassExito').classList.remove('visible');
  icPassOverlay.classList.add('visible');
  setTimeout(() => icPassActual.focus(), 80);
}
function cerrarCambioPassIC(){
  icPassOverlay.classList.remove('visible');
}

function errorPassIC(msg, campo){
  icPassError.textContent = msg;
  icPassError.classList.add('visible');
  if (campo){ campo.value = ''; campo.focus(); }
}

async function guardarCambioPassIC(){
  const correo = correoSesionIC();
  if (!correo) return;
  if (!(await validarPassIC(correo, icPassActual.value))){
    errorPassIC('La contraseña actual no es correcta.', icPassActual);
    return;
  }
  const nueva = icPassNueva.value;
  if (nueva.length < 8){
    errorPassIC('La nueva contraseña debe tener al menos 8 caracteres.', icPassNueva);
    icPassConfirma.value = '';
    return;
  }
  if (nueva !== icPassConfirma.value){
    errorPassIC('La confirmación no coincide con la nueva contraseña.', icPassConfirma);
    return;
  }
  const hashNuevo = await hashIC(nueva);
  try { localStorage.setItem('alvaco-ic-pass-' + correo, hashNuevo); } catch(e){}
  document.getElementById('icPassCodigo').textContent = '"' + correo + '": "' + hashNuevo + '",';
  document.getElementById('icPassForm').style.display = 'none';
  document.getElementById('icPassExito').classList.add('visible');
  mostrarToast('✔ Contraseña actualizada');
}

function copiarTexto(texto, aviso){
  const listo = () => mostrarToast(aviso);
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(texto).then(listo).catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = texto;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); listo(); } catch(e){}
    document.body.removeChild(ta);
  }
}
function copiarCodigoPassIC(){
  copiarTexto(document.getElementById('icPassCodigo').textContent, 'Código copiado · envíalo a David');
}

document.getElementById('icBannerPass').addEventListener('click', abrirCambioPassIC);
document.getElementById('icPassGuardar').addEventListener('click', guardarCambioPassIC);
document.getElementById('icPassCancelar').addEventListener('click', cerrarCambioPassIC);
document.getElementById('icPassListo').addEventListener('click', cerrarCambioPassIC);
document.getElementById('icPassCopiar').addEventListener('click', copiarCodigoPassIC);
document.getElementById('icPassCodigo').addEventListener('click', copiarCodigoPassIC);
icPassOverlay.addEventListener('click', e => { if (e.target === icPassOverlay) cerrarCambioPassIC(); });
[icPassActual, icPassNueva, icPassConfirma].forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') guardarCambioPassIC(); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && icPassOverlay.classList.contains('visible')) cerrarCambioPassIC();
});

/* --- Entrar / salir del área IC --- */
function entrarAreaIC(){
  if (esUsuarioIC()){
    filtroActivo = '__IC__';
    construirSidebar();
    render();
  } else {
    abrirLoginIC();
  }
}

function cerrarSesionIC(){
  try { localStorage.removeItem('alvaco-ic-user'); } catch(e){}
  filtroActivo = 'Todos';
  construirSidebar();
  render();
  mostrarToast('Sesión IC cerrada');
}
document.getElementById('icBannerSalir').addEventListener('click', cerrarSesionIC);

/* ============================================================
   LOGIN GENERAL DEL PORTAL
   ============================================================ */
function correoSesionPortal(){
  try {
    const store = sessionStorage.getItem('alvaco-portal-user')
      ? sessionStorage : localStorage;
    const correo = (store.getItem('alvaco-portal-user') || '').toLowerCase().trim();
    if (!correo) return '';
    const exp = parseInt(store.getItem('alvaco-portal-exp') || '0', 10);
    if (exp && Date.now() > exp){ cerrarSesionPortal(true); return ''; }
    return correo;
  } catch(e){ return ''; }
}

function correoPermitidoPortal(correo){
  if (PORTAL_EMAILS.map(e => e.toLowerCase().trim()).includes(correo)) return true;
  return PORTAL_DOMINIO_LIBRE && correo.endsWith(PORTAL_DOMINIO);
}

function esUsuarioPortal(){
  const correo = correoSesionPortal();
  return !!correo && correoPermitidoPortal(correo);
}

async function validarPassPortal(correo, pass){
  if (!pass) return false;
  const h = await hashIC(pass);
  let personalLocal = '';
  try { personalLocal = localStorage.getItem('alvaco-portal-pass-' + correo) || ''; } catch(e){}
  const personalCodigo = (PORTAL_PASS_USUARIOS[correo] || '').toLowerCase().trim();
  return (personalLocal && h === personalLocal) ||
         (personalCodigo && h === personalCodigo) ||
         h === PORTAL_PASS_HASH;
}

const portalOverlay = document.getElementById('portalLoginOverlay');
const portalCorreo  = document.getElementById('portalLoginCorreo');
const portalPass    = document.getElementById('portalLoginPass');
const portalError   = document.getElementById('portalLoginError');

function abrirPortalLogin(){
  document.body.classList.add('portal-cerrado');
  portalError.classList.remove('visible');
  portalPass.value = '';
  /* Recuerda el último correo usado: solo hay que teclear la contraseña */
  if (!portalCorreo.value){
    try { portalCorreo.value = localStorage.getItem('alvaco-portal-ultimo') || ''; } catch(e){}
  }
  pintarSaludo();
  portalOverlay.classList.add('visible');
  setTimeout(() => (portalCorreo.value ? portalPass : portalCorreo).focus(), 120);
}

function desbloquearPortal(){
  portalOverlay.classList.remove('visible');
  document.body.classList.remove('portal-cerrado');
  montarPerfil();
}

const portalBtn  = document.getElementById('portalLoginEntrar');
const portalCard = document.getElementById('portalLoginCard');

function errorPortal(msg){
  portalError.textContent = msg;
  portalError.classList.add('visible');
  portalCard.classList.remove('animate__animated', 'animate__headShake');
  void portalCard.offsetWidth;                 /* reinicia la animación */
  portalCard.classList.add('animate__animated', 'animate__headShake');
}

/* Freno tras varios intentos fallidos (aguanta recargas de página) */
const PORTAL_INTENTOS_MAX = 5;
const PORTAL_ESPERA_SEG   = 120;

function portalBloqueoRestante(){
  try {
    const hasta = parseInt(sessionStorage.getItem('alvaco-portal-bloqueo') || '0', 10);
    return Math.max(0, Math.ceil((hasta - Date.now()) / 1000));
  } catch(e){ return 0; }
}
function portalSumarIntento(){
  try {
    const n = parseInt(sessionStorage.getItem('alvaco-portal-fallos') || '0', 10) + 1;
    sessionStorage.setItem('alvaco-portal-fallos', String(n));
    if (n >= PORTAL_INTENTOS_MAX){
      sessionStorage.setItem('alvaco-portal-bloqueo', String(Date.now() + PORTAL_ESPERA_SEG * 1000));
      sessionStorage.setItem('alvaco-portal-fallos', '0');
    }
  } catch(e){}
}

let portalOcupado = false;
async function intentarLoginPortal(){
  if (portalOcupado) return;                   /* evita doble envío */

  const espera = portalBloqueoRestante();
  if (espera){
    errorPortal(`Demasiados intentos. Espera ${espera} segundos e inténtalo de nuevo.`);
    return;
  }

  const correo = portalCorreo.value.toLowerCase().trim();
  const pass   = portalPass.value;

  if (!correo || !pass){
    errorPortal('Escribe tu correo y tu contraseña.');
    (correo ? portalPass : portalCorreo).focus();
    return;
  }

  portalOcupado = true;
  portalBtn.classList.add('cargando');
  const permitido = correoPermitidoPortal(correo);
  const passOk    = permitido && await validarPassPortal(correo, pass);
  portalBtn.classList.remove('cargando');
  portalOcupado = false;

  if (permitido && passOk){
    const recordar = document.getElementById('portalLoginRecordar').checked;
    try {
      const store = recordar ? localStorage : sessionStorage;
      (recordar ? sessionStorage : localStorage).removeItem('alvaco-portal-user');
      store.setItem('alvaco-portal-user', correo);
      store.setItem('alvaco-portal-exp',
        recordar ? String(Date.now() + PORTAL_HORAS_SESION * 3600000) : '0');
    } catch(e){}
    try {
      localStorage.setItem('alvaco-portal-ultimo', correo);
      sessionStorage.removeItem('alvaco-portal-fallos');
      sessionStorage.removeItem('alvaco-portal-bloqueo');
    } catch(e){}
    portalError.classList.remove('visible');
    desbloquearPortal();
    mostrarToast(saludoHora().replace(/[¡!]/g, '') + ', ' + pfNombre(correo));
  } else {
    portalSumarIntento();
    const restan = portalBloqueoRestante();
    errorPortal(restan
      ? `Demasiados intentos. Espera ${restan} segundos e inténtalo de nuevo.`
      : 'Correo o contraseña incorrectos.');
    portalPass.value = '';
    portalPass.focus();
  }
}

function cerrarSesionPortal(silencioso){
  try {
    ['localStorage','sessionStorage'].forEach(s => {
      window[s].removeItem('alvaco-portal-user');
      window[s].removeItem('alvaco-portal-exp');
    });
    localStorage.removeItem('alvaco-ic-user');   /* también sale del área IC */
  } catch(e){}
  if (silencioso) return;
  filtroActivo = 'Todos';
  construirSidebar();
  render();
  cerrarVisor();
  abrirPortalLogin();
}

portalBtn.addEventListener('click', intentarLoginPortal);
[portalCorreo, portalPass].forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') intentarLoginPortal(); });
});

/* --- Detalles de la pantalla de acceso --- */
(function pantallaAcceso(){
  /* Imagen del panel izquierdo (si falla la carga, queda el degradado) */
  if (PORTAL_LOGIN_IMAGEN){
    const prueba = new Image();
    prueba.onload = () => document.getElementById('portalVisual')
      .style.setProperty('--portal-img', 'url("' + PORTAL_LOGIN_IMAGEN + '")');
    prueba.src = PORTAL_LOGIN_IMAGEN;
  }

  /* Saludo según la hora, con letras de colores */
  pintarSaludo();

  /* Enter en el correo pasa a la contraseña en vez de intentar entrar */
  portalCorreo.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !portalPass.value){
      e.stopImmediatePropagation();
      e.preventDefault();
      portalPass.focus();
    }
  }, true);

  /* Mostrar / ocultar contraseña */
  const OJO_VER = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const OJO_OCULTAR = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.2A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.2 6.2A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.3-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  const ojo = document.getElementById('portalVerPass');
  ojo.innerHTML = OJO_VER;
  ojo.addEventListener('click', () => {
    const ver = portalPass.type === 'password';
    portalPass.type = ver ? 'text' : 'password';
    ojo.innerHTML = ver ? OJO_OCULTAR : OJO_VER;
    ojo.setAttribute('aria-label', ver ? 'Ocultar contraseña' : 'Mostrar contraseña');
    portalPass.focus();
  });

  /* Aviso de Bloq Mayús */
  const caps = document.getElementById('portalCaps');
  const revisarCaps = e => {
    const on = typeof e.getModifierState === 'function' && e.getModifierState('CapsLock');
    caps.classList.toggle('visible', !!on);
  };
  [portalCorreo, portalPass].forEach(inp => {
    inp.addEventListener('keyup', revisarCaps);
    inp.addEventListener('keydown', revisarCaps);
  });
  portalPass.addEventListener('blur', () => caps.classList.remove('visible'));
})();

/* ============================================================
   PERFIL DE USUARIO: AVATAR Y MENÚ DE CUENTA
   ============================================================ */
const pfUser   = c => (c || '').split('@')[0];
const pfPartes = c => pfUser(c).split(/[._-]+/).filter(Boolean);

function pfNombre(correo){
  return pfPartes(correo).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Usuario';
}
function pfIniciales(correo){
  const p = pfPartes(correo);
  return (((p[0] || '?')[0]) + ((p[1] || '')[0] || '')).toUpperCase();
}
function pfColor(correo){
  let h = 0;
  for (let i = 0; i < correo.length; i++) h = (h * 31 + correo.charCodeAt(i)) >>> 0;
  return PERFIL_PALETA[h % PERFIL_PALETA.length];
}
function pfEsIC(correo){
  return IC_EMAILS.map(e => e.toLowerCase().trim()).includes((correo || '').toLowerCase());
}
/* Orden en que se busca la foto: ruta manual · archivo local ·
   Microsoft 365. Si ninguna carga, quedan las iniciales.       */
function pfFuentesFoto(correo){
  const fuentes = [];
  if (PERFIL_FOTOS[correo]) fuentes.push(PERFIL_FOTOS[correo]);
  if (PERFIL_FOTO_AUTO)  fuentes.push(PERFIL_RUTA_FOTOS + pfUser(correo) + '.png');
  if (PERFIL_FOTO_M365)  fuentes.push(PERFIL_M365_URL.replace('{correo}', encodeURIComponent(correo)));
  return fuentes;
}

/* Al fallar una fuente, prueba la siguiente; al agotarlas, se quita */
function pfSiguienteFoto(img){
  let fuentes = [];
  try { fuentes = JSON.parse(img.dataset.fuentes); } catch(e){}
  const i = parseInt(img.dataset.i || '0', 10) + 1;
  if (i < fuentes.length){ img.dataset.i = i; img.src = fuentes[i]; }
  else img.remove();
}

function pfAvatar(correo, extra){
  const fuentes = pfFuentesFoto(correo);
  const datos = JSON.stringify(fuentes).replace(/"/g, '&quot;');
  return `<span class="avatar ${extra || ''}" style="--av:${pfColor(correo)}">
      <span class="avatar-ini">${pfIniciales(correo)}</span>
      ${fuentes.length ? `<img src="${fuentes[0]}" alt="" referrerpolicy="no-referrer"
         data-fuentes="${datos}" data-i="0" onerror="pfSiguienteFoto(this)">` : ''}
    </span>`;
}
function letrasMunelocos(texto){
  let i = 0;
  return [...texto].map(ch => {
    if (ch === ' ') return '<span class="letra-espacio"> </span>';
    const color = MUNELOCOS_COLORES[i % MUNELOCOS_COLORES.length];
    const giro  = i % 2 ? '2.5deg' : '-2.5deg';
    const salto = i % 2 ? '1.5px'  : '-1.5px';
    const paso  = (i * 45) + 'ms';
    i++;
    return `<span class="letra" style="--l:${color};--giro:${giro};--salto:${salto};--paso:${paso}">${ch}</span>`;
  }).join('');
}

function pintarSaludo(){
  const el = document.getElementById('portalSaludo');
  if (el) el.innerHTML = letrasMunelocos(saludoHora());
}

function saludoHora(){
  const h = new Date().getHours();
  if (h < 12) return '¡Buenos días!';
  if (h < 19) return '¡Buenas tardes!';
  return '¡Buenas noches!';
}
function pfExpira(){
  try{
    const store = sessionStorage.getItem('alvaco-portal-user') ? sessionStorage : localStorage;
    const exp = parseInt(store.getItem('alvaco-portal-exp') || '0', 10);
    if (!exp) return 'Sesión válida hasta cerrar el navegador';
    return 'Sesión activa hasta las ' + new Date(exp)
      .toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', hour12:true })
      .toUpperCase().replace(/\./g,'');
  }catch(e){ return 'Sesión activa'; }
}

const avatarBtn     = document.getElementById('avatarBtn');
const perfilPanel   = document.getElementById('perfilPanel');
const perfilBackdrop= document.getElementById('perfilBackdrop');

function montarPerfil(){
  const correo = correoSesionPortal();
  if (!correo) return;
  avatarBtn.innerHTML = pfAvatar(correo);
}

/* Ancla el panel al avatar sin depender del hero (que recorta) */
function ubicarPanelPerfil(){
  if (window.innerWidth <= 900){           /* móvil: hoja inferior */
    perfilPanel.style.top = perfilPanel.style.left = perfilPanel.style.maxHeight = '';
    return;
  }
  const r = avatarBtn.getBoundingClientRect();
  const w = perfilPanel.offsetWidth || 308;
  const top = r.bottom + 12;
  perfilPanel.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
  perfilPanel.style.top  = top + 'px';
  perfilPanel.style.maxHeight = (window.innerHeight - top - 18) + 'px';
}

function cerrarPerfil(){
  perfilPanel.classList.remove('visible');
  perfilBackdrop.classList.remove('visible');
  avatarBtn.classList.remove('abierto');
  avatarBtn.setAttribute('aria-expanded','false');
}

function abrirPerfil(){
  const correo  = correoSesionPortal();
  if (!correo) return;
  const esIC    = pfEsIC(correo);
  const enIC    = esUsuarioIC();
  const tickets = DASHBOARDS.find(d => d.nombre === ACCESO_DIRECTO_NOMBRE && d.embed);

  perfilPanel.innerHTML = `
    <div class="perfil-cabecera">
      ${pfAvatar(correo, 'avatar-xl')}
      <div class="perfil-datos">
        <h4>${pfNombre(correo)}</h4>
        <p>${correo}</p>
        <span class="perfil-badge ${esIC ? '' : 'badge-com'}">
          ${esIC ? 'Inteligencia Comercial' : 'Comercialización'}
        </span>
      </div>
    </div>
    <div class="perfil-lista">
      ${esIC ? `<button class="perfil-item perfil-item-ic" data-accion="${enIC ? 'salirIC' : 'entrarIC'}">
        ${PF_ICO.ic}<span>${enIC ? 'Salir del área IC' : 'Entrar al área IC'}</span>
        <span class="perfil-chip">${enIC ? 'Activa' : 'Exclusiva'}</span></button>` : ''}
      <button class="perfil-item" data-accion="favoritos">
        ${PF_ICO.star}<span>Mis favoritos</span><span class="perfil-chip">${favoritos.size}</span></button>
      ${tickets ? `<button class="perfil-item" data-accion="ticket">
        ${PF_ICO.ticket}<span>Solicitar un ticket a IC</span></button>` : ''}
      <div class="perfil-sep"></div>
      <button class="perfil-item" data-accion="pass">
        ${PF_ICO.llave}<span>Cambiar mi contraseña</span></button>
      ${enIC ? `<button class="perfil-item perfil-item-ic" data-accion="passIC">
        ${PF_ICO.llave}<span>Cambiar contraseña del área IC</span></button>` : ''}
      <button class="perfil-item" data-accion="atajos">
        ${PF_ICO.teclado}<span>Atajos de teclado</span></button>
      <button class="perfil-item perfil-item-peligro" data-accion="limpiar">
        ${PF_ICO.bote}<span id="pfLimpiarTxt">Borrar favoritos y recientes</span></button>
      <div class="perfil-sep"></div>
      <button class="perfil-item perfil-item-peligro" data-accion="salir">
        ${PF_ICO.salir}<span>Cerrar sesión</span></button>
    </div>
    <div class="perfil-pie">${PF_ICO.reloj}<span>${pfExpira()}</span></div>`;

  perfilPanel.querySelectorAll('[data-accion]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      accionPerfil(btn.dataset.accion, btn);
    });
  });

  perfilPanel.classList.add('visible');
  perfilBackdrop.classList.add('visible');
  avatarBtn.classList.add('abierto');
  avatarBtn.setAttribute('aria-expanded','true');
  ubicarPanelPerfil();
}

function accionPerfil(accion, btn){
  switch(accion){
    case 'entrarIC': cerrarPerfil(); entrarAreaIC(); break;
    case 'salirIC':  cerrarPerfil(); cerrarSesionIC(); break;
    case 'favoritos':
      cerrarPerfil();
      filtroActivo = '__FAV__';
      construirSidebar();
      render();
      grid.scrollIntoView({ behavior:'smooth', block:'start' });
      mostrarToast('★ Mostrando tus favoritos');
      break;
    case 'ticket':
      cerrarPerfil();
      abrirVisor(DASHBOARDS.find(d => d.nombre === ACCESO_DIRECTO_NOMBRE));
      break;
    case 'pass':   cerrarPerfil(); abrirCambioPassPortal(); break;
    case 'passIC': cerrarPerfil(); abrirCambioPassIC(); break;
    case 'atajos': cerrarPerfil(); document.getElementById('pfAtajos').classList.add('visible'); break;
    case 'limpiar':
      if (btn.classList.contains('perfil-item-armado')){
        favoritos.clear();
        guardarFavoritos();
        recientes = [];
        try { localStorage.removeItem('alvaco-recientes'); } catch(e){}
        renderRecientes();
        construirSidebar();
        render();
        cerrarPerfil();
        mostrarToast('Favoritos y recientes borrados');
      } else {
        btn.classList.add('perfil-item-armado');
        document.getElementById('pfLimpiarTxt').textContent = '¿Seguro? Toca otra vez';
      }
      break;
    case 'salir':
      cerrarPerfil();
      cerrarSesionPortal(false);
      break;
  }
}

avatarBtn.addEventListener('click', e => {
  e.stopPropagation();
  perfilPanel.classList.contains('visible') ? cerrarPerfil() : abrirPerfil();
});
perfilBackdrop.addEventListener('click', cerrarPerfil);
perfilPanel.addEventListener('click', e => e.stopPropagation());
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && perfilPanel.classList.contains('visible')) cerrarPerfil();
});
['resize','scroll'].forEach(ev => window.addEventListener(ev, () => {
  if (perfilPanel.classList.contains('visible')) ubicarPanelPerfil();
}, { passive:true }));

/* --- Cambio de contraseña del portal --- */
const pfPassOverlay = document.getElementById('pfPassOverlay');
const pfPassError   = document.getElementById('pfPassError');
const pfPassActual  = document.getElementById('pfPassActual');
const pfPassNueva   = document.getElementById('pfPassNueva');
const pfPassConfirma= document.getElementById('pfPassConfirma');

function abrirCambioPassPortal(){
  if (!esUsuarioPortal()) return;
  pfPassError.classList.remove('visible');
  pfPassActual.value = pfPassNueva.value = pfPassConfirma.value = '';
  document.getElementById('pfPassSub').textContent = correoSesionPortal();
  document.getElementById('pfPassForm').style.display = '';
  document.getElementById('pfPassExito').classList.remove('visible');
  pfPassOverlay.classList.add('visible');
  setTimeout(() => pfPassActual.focus(), 80);
}
function cerrarCambioPassPortal(){
  pfPassOverlay.classList.remove('visible');
}

async function guardarCambioPassPortal(){
  const correo = correoSesionPortal();
  if (!correo) return;
  const falla = (msg, campo) => {
    pfPassError.textContent = msg;
    pfPassError.classList.add('visible');
    campo.value = '';
    campo.focus();
  };
  if (!(await validarPassPortal(correo, pfPassActual.value)))
    return falla('La contraseña actual no es correcta.', pfPassActual);
  /* La contraseña personal del portal es un NIP de 3 dígitos */
  if (!/^\d{3}$/.test(pfPassNueva.value))
    return falla('Tu NIP debe ser de 3 números, sin letras ni espacios.', pfPassNueva);
  if (pfPassNueva.value !== pfPassConfirma.value)
    return falla('La confirmación no coincide con el NIP que escribiste.', pfPassConfirma);

  const hashNuevo = await hashIC(pfPassNueva.value);
  try { localStorage.setItem('alvaco-portal-pass-' + correo, hashNuevo); } catch(e){}
  document.getElementById('pfPassCodigo').textContent = '"' + correo + '": "' + hashNuevo + '",';
  document.getElementById('pfPassForm').style.display = 'none';
  document.getElementById('pfPassExito').classList.add('visible');
  mostrarToast('✔ Contraseña actualizada');
}

document.getElementById('pfPassGuardar').addEventListener('click', guardarCambioPassPortal);
document.getElementById('pfPassCancelar').addEventListener('click', cerrarCambioPassPortal);
document.getElementById('pfPassListo').addEventListener('click', cerrarCambioPassPortal);
[pfPassActual, pfPassNueva, pfPassConfirma].forEach(inp => {
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') guardarCambioPassPortal(); });
});
pfPassOverlay.addEventListener('click', e => { if (e.target === pfPassOverlay) cerrarCambioPassPortal(); });
const copiarPassPortal = () =>
  copiarTexto(document.getElementById('pfPassCodigo').textContent, 'Código copiado · envíalo a David');
document.getElementById('pfPassCopiar').addEventListener('click', copiarPassPortal);
document.getElementById('pfPassCodigo').addEventListener('click', copiarPassPortal);

/* --- Atajos --- */
const pfAtajos = document.getElementById('pfAtajos');
document.getElementById('pfAtajosCerrar').addEventListener('click', () => pfAtajos.classList.remove('visible'));
pfAtajos.addEventListener('click', e => { if (e.target === pfAtajos) pfAtajos.classList.remove('visible'); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  pfAtajos.classList.remove('visible');
  if (pfPassOverlay.classList.contains('visible')) cerrarCambioPassPortal();
});

/* ==================== MENÚ LATERAL ==================== */
function construirSidebar(){
  /* Solo los dashboards públicos cuentan en el menú */
  const visibles = DASHBOARDS.filter(d => !d.oculto && !d.soloIC);
  const items = [
    { label:'Inicio', filtro:'Todos', icon:ICONS.home, count:visibles.length }
  ];
  sideNav.innerHTML = '';

  /* Botón destacado: abre la app de tickets de inmediato */
  const appDirecta = ACCESO_DIRECTO_NOMBRE
    ? DASHBOARDS.find(d => d.nombre === ACCESO_DIRECTO_NOMBRE && d.embed)
    : null;
  if (appDirecta){
    const btnDirecto = document.createElement('button');
    btnDirecto.className = 'side-item side-item-destacado';
    btnDirecto.innerHTML = ICONS.ticket + `<span>${ACCESO_DIRECTO_LABEL}</span><span class="count">app</span>`;
    btnDirecto.addEventListener('click', () => abrirVisor(appDirecta));
    sideNav.appendChild(btnDirecto);
  }

  /* Botón teal: segundo acceso directo */
  const herramientaDirecta = ACCESO_DIRECTO2_NOMBRE
    ? DASHBOARDS.find(d => d.nombre === ACCESO_DIRECTO2_NOMBRE && d.embed)
    : null;
  if (herramientaDirecta && (!herramientaDirecta.soloIC || esUsuarioIC())){
    const btnHerr = document.createElement('button');
    btnHerr.className = 'side-item side-item-web';
    btnHerr.innerHTML = ICONS.app + `<span>${ACCESO_DIRECTO2_LABEL}</span><span class="count">web</span>`;
    btnHerr.addEventListener('click', () => abrirVisor(herramientaDirecta));
    sideNav.appendChild(btnHerr);
  }

  items.forEach(it => {
    const btn = document.createElement('button');
    btn.className = 'side-item' + (filtroActivo === it.filtro ? ' active' : '');
    btn.innerHTML = it.icon + `<span>${it.label}</span><span class="count">${it.count}</span>`;
    btn.addEventListener('click', () => {
      filtroActivo = it.filtro;
      construirSidebar();
      render();
    });
    sideNav.appendChild(btn);
  });

  /* Área Inteligencia Comercial: pide login si no hay sesión */
  const itemsIC = DASHBOARDS.filter(d => d.soloIC);
  if (itemsIC.length){
    const btnIC = document.createElement('button');
    btnIC.className = 'side-item side-item-ic' + (filtroActivo === '__IC__' ? ' active' : '');
    const cuenta = esUsuarioIC() ? itemsIC.length : ICONS.lockMini;
    btnIC.innerHTML = ICONS.lock + `<span>Inteligencia Comercial</span><span class="count">${cuenta}</span>`;
    btnIC.addEventListener('click', entrarAreaIC);
    sideNav.appendChild(btnIC);
  }
}

/* ==================== HERO: FECHA Y CHIPS ==================== */
function iniciarHero(){
  const fechas = new Date().toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  document.getElementById('heroFecha').textContent =
    fechas.charAt(0).toUpperCase() + fechas.slice(1) + ' · Selecciona un dashboard para visualizar en Power BI';
  const visibles = DASHBOARDS.filter(d => !d.oculto && !d.soloIC);
  const activos = visibles.filter(d => d.embed || d.url).length;
  const categorias = new Set(visibles.map(d => d.categoria)).size;
  document.getElementById('heroChips').innerHTML = `
    <span class="chip">${visibles.length} dashboards</span>
    <span class="chip chip-ok">${activos} activos</span>
    <span class="chip">${categorias} categorías</span>`;
}

/* ==================== RECIENTES ==================== */
let recientes = [];
try {
  const r = localStorage.getItem('alvaco-recientes');
  if (r) recientes = JSON.parse(r);
} catch(e){ /* modo en memoria */ }

function registrarReciente(nombre){
  recientes = [nombre, ...recientes.filter(n => n !== nombre)].slice(0, 3);
  try { localStorage.setItem('alvaco-recientes', JSON.stringify(recientes)); } catch(e){}
  renderRecientes();
}

function renderRecientes(){
  const cont = document.getElementById('recientes');
  const items = recientes
    .map(n => DASHBOARDS.find(d => d.nombre === n))
    .filter(Boolean)
    .filter(d => d.embed || d.url)              /* sin liga (desactivado) no aparece */
    .filter(d => !d.soloIC || esUsuarioIC());   /* soloIC no aparece sin sesión IC   */
  if (!items.length){ cont.innerHTML = ''; return; }
  cont.innerHTML = '<span class="recientes-label">Recientes:</span>' + items.map(d => `
    <button class="reciente-chip accent-${d.color || 'blue'}" data-nombre="${d.nombre}">
      ${(d.tipo === 'app' || d.tipo === 'web') ? ICONS.app : ICONS.eye}<span>${d.nombre}</span>
    </button>`).join('');
  cont.querySelectorAll('.reciente-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = DASHBOARDS.find(x => x.nombre === btn.dataset.nombre);
      if (d && d.embed) abrirVisor(d);
      else if (d && d.url) window.open(d.url, '_blank', 'noopener');
    });
  });
}

/* ==================== TARJETAS ==================== */
function render(){
  const q = searchIn.value.trim().toLowerCase();
  grid.innerHTML = '';
  let visibles = 0;

  /* Seguridad: si el filtro es IC pero no hay sesión, regresa a Inicio */
  if (filtroActivo === '__IC__' && !esUsuarioIC()) filtroActivo = 'Todos';
  const enAreaIC = filtroActivo === '__IC__';

  /* Banner del área IC */
  const banner = document.getElementById('icBanner');
  banner.classList.toggle('visible', enAreaIC);
  if (enAreaIC) document.getElementById('icBannerUser').textContent = correoSesionIC();

  DASHBOARDS.forEach((d) => {
    if (d.oculto) return;   /* sin tarjeta: solo accesible desde el sidebar */
    /* Los elementos soloIC viven únicamente dentro del área IC */
    if (enAreaIC && !d.soloIC) return;
    if (!enAreaIC && d.soloIC) return;
    if (filtroActivo === '__FAV__' && !favoritos.has(d.nombre)) return;
    if (filtroActivo !== 'Todos' && filtroActivo !== '__FAV__' && filtroActivo !== '__IC__' && d.categoria !== filtroActivo) return;
    if (q && !(d.nombre.toLowerCase().includes(q) || d.descripcion.toLowerCase().includes(q) || d.categoria.toLowerCase().includes(q))) return;

    visibles++;
    const card = document.createElement('article');
    const inactiva = !d.embed && !d.url;
    card.className = 'card accent-' + (d.color || 'blue') + (inactiva ? ' card-inactiva' : '');
    card.style.animationDelay = (Math.min(visibles - 1, 8) * 80) + 'ms';

    const esApp = d.tipo === 'app';
    const esWeb = d.tipo === 'web';
    const txtAbrir = esApp ? 'Abrir app' : (esWeb ? 'Abrir herramienta' : 'Ver dashboard');
    const esFav = favoritos.has(d.nombre);
    let btnPrincipal;
    if (d.embed) {
      btnPrincipal = `<button class="btn-open btn-ver">${(esApp || esWeb) ? ICONS.app : ICONS.eye} ${txtAbrir}</button>`;
    } else if (d.url) {
      btnPrincipal = `<a class="btn-open" href="${d.url}" target="_blank" rel="noopener">${ICONS.external} ${esApp || esWeb ? txtAbrir : 'Abrir en Power BI'}</a>`;
    } else {
      btnPrincipal = `<button class="btn-open disabled" disabled title="No disponible por el momento">${ICONS.external} No disponible</button>`;
    }
    const btnSecundario = (d.embed && d.url)
      ? `<a class="btn-fav" href="${d.url}" target="_blank" rel="noopener" title="Abrir en pestaña nueva" aria-label="Abrir en pestaña nueva">${ICONS.external}</a>`
      : '';

    const badgeEstado = esApp
      ? '<span class="badge-card badge-app">Power Apps</span>'
      : (esWeb
          ? '<span class="badge-card badge-web">Herramienta</span>'
          : (d.embed
              ? '<span class="badge-card badge-activo">Actualización diaria</span>'
              : (d.url ? '' : '<span class="badge-card badge-prox">Próximamente</span>')));
    const badgeIC = d.soloIC ? '<span class="badge-card badge-ic">' + ICONS.lockMini + ' Exclusivo IC</span>' : '';

    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon">${d.imagen ? `<img src="${d.imagen}" alt="${d.nombre}">` : ICONS.chart}</div>
        <div class="card-badges">
          <span class="badge-card badge-cat">${d.categoria}</span>
          ${badgeEstado}
          ${badgeIC}
        </div>
      </div>
      <h3>${d.nombre}</h3>
      <p>${d.descripcion}</p>
      <div class="card-actions">
        ${btnPrincipal}
        ${btnSecundario}
        <button class="btn-fav ${esFav ? 'faved' : ''}" title="${esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}" aria-label="Favorito">${ICONS.starSmall}</button>
      </div>`;

    const btnVer = card.querySelector('.btn-ver');
    if (btnVer) btnVer.addEventListener('click', () => abrirVisor(d));

    const linkExterno = card.querySelector('a.btn-open');
    if (linkExterno) linkExterno.addEventListener('click', () => registrarReciente(d.nombre));

    card.querySelector('.card-actions .btn-fav:last-child').addEventListener('click', (ev) => {
      const btnStar = ev.currentTarget;
      if (favoritos.has(d.nombre)) { favoritos.delete(d.nombre); mostrarToast('Quitado de favoritos'); }
      else {
        favoritos.add(d.nombre);
        mostrarToast('★ Agregado a favoritos');
        btnStar.classList.add('animate__animated', 'animate__tada');
      }
      guardarFavoritos();
      construirSidebar();
      render();
    });

    grid.appendChild(card);
  });

  emptyState.classList.toggle('visible', visibles === 0);
  if (visibles === 0){
    emptyState.classList.add('animate__animated', 'animate__headShake');
    emptyState.addEventListener('animationend', () => {
      emptyState.classList.remove('animate__animated', 'animate__headShake');
    }, { once:true });
  }
  const sc = document.getElementById('searchCount');
  sc.textContent = q ? `${visibles} dashboard${visibles === 1 ? '' : 's'} encontrado${visibles === 1 ? '' : 's'}` : '';
  activarTooltips();
}

/* ==================== VISOR NO EDITABLE ==================== */
const visorOverlay = document.getElementById('visorOverlay');
const visorFrame   = document.getElementById('visorFrame');
const visorLoader  = document.getElementById('visorLoader');
const visorTitle   = document.getElementById('visorTitle');

/* ---------- Zoom del visor (lupa +/−) ---------- */
let zoomVisor = 1;
function aplicarZoom(){
  zoomVisor = Math.min(2, Math.max(0.5, Math.round(zoomVisor * 100) / 100));
  const marco = document.querySelector('.visor-marco');
  visorFrame.style.transformOrigin = 'top left';
  if (zoomVisor >= 1){
    /* ACERCAR: magnifica el dashboard real; lo que no cabe se navega con scroll */
    visorFrame.style.width  = '100%';
    visorFrame.style.height = '100%';
    visorFrame.style.transform = 'scale(' + zoomVisor + ')';
    marco.style.overflow = zoomVisor > 1 ? 'auto' : 'hidden';
  } else {
    /* ALEJAR: se amplía el lienzo y se reduce; Power BI re-ajusta */
    visorFrame.style.width  = (100 / zoomVisor) + '%';
    visorFrame.style.height = (100 / zoomVisor) + '%';
    visorFrame.style.transform = 'scale(' + zoomVisor + ')';
    marco.style.overflow = 'hidden';
  }
  document.getElementById('zoomNivel').textContent = Math.round(zoomVisor * 100) + '%';
}
document.getElementById('zoomMas').addEventListener('click',  () => { zoomVisor += 0.1; aplicarZoom(); });
document.getElementById('zoomMenos').addEventListener('click', () => { zoomVisor -= 0.1; aplicarZoom(); });
document.getElementById('zoomNivel').addEventListener('click', () => { zoomVisor = 1; aplicarZoom(); });

function abrirVisor(d){
  if (!d || !d.embed) return;
  const esApp = d.tipo === 'app';
  const esWeb = d.tipo === 'web';
  registrarReciente(d.nombre);
  visorTitle.textContent = d.nombre;
  document.getElementById('visorCategoria').textContent = d.categoria || '';
  document.getElementById('visorPill').textContent = esApp ? 'App interactiva' : (esWeb ? 'Herramienta interactiva' : 'Solo lectura');
  document.getElementById('visorLoaderTitulo').textContent = (esApp || esWeb) ? 'Cargando herramienta…' : 'Cargando dashboard…';
  zoomVisor = 1;
  aplicarZoom();
  visorLoader.style.display = 'flex';
  visorFrame.classList.remove('visible');
  visorFrame.onload = () => {
    visorLoader.style.display = 'none';
    visorFrame.classList.add('visible');
  };
  /* Construir URL: los parámetros de paneles solo aplican a Power BI */
  let urlVisor = d.embed;
  if (!esApp && !esWeb) {
    if (OCULTAR_PANEL_FILTROS) urlVisor += '&filterPaneEnabled=false';
    if (OCULTAR_PANEL_PAGINAS) urlVisor += '&navContentPaneEnabled=false';
  }
  visorFrame.src = urlVisor;
  visorOverlay.classList.add('visible');
  const marco = document.getElementById('visorMarco');
  marco.classList.remove('animate__animated', 'animate__zoomIn', 'animate__faster');
  void marco.offsetWidth; /* reinicia la animación */
  marco.classList.add('animate__animated', 'animate__zoomIn', 'animate__faster');
  document.body.style.overflow = 'hidden';
}
function cerrarVisor(){
  visorOverlay.classList.remove('visible');
  visorFrame.src = 'about:blank';
  document.body.style.overflow = '';
  if (document.fullscreenElement) document.exitFullscreen();
}
document.getElementById('visorBack').addEventListener('click', cerrarVisor);
document.getElementById('visorRefresh').addEventListener('click', () => {
  if (!visorFrame.src || visorFrame.src === 'about:blank') return;
  visorLoader.style.display = 'flex';
  visorFrame.classList.remove('visible');
  visorFrame.src = visorFrame.src;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && visorOverlay.classList.contains('visible')) cerrarVisor();
});
document.getElementById('visorFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) visorOverlay.requestFullscreen().catch(()=>{});
  else document.exitFullscreen();
});

searchIn.addEventListener('input', render);

/* ==================== SALIDAS POR URL ==================== */
/* ?salir=1  → cierra la sesión del portal (y la de IC)
   ?ic=salir → cierra solo la sesión del área IC            */
(function salidasPorURL(){
  const p = new URLSearchParams(window.location.search);
  if (p.get('salir') === '1') cerrarSesionPortal(true);
  const ic = p.get('ic');
  if (ic && ic.toLowerCase() === 'salir'){
    try { localStorage.removeItem('alvaco-ic-user'); } catch(e){}
  }
})();

/* ==================== ARRANQUE ==================== */
iniciarHero();
renderRecientes();
construirSidebar();
render();

/* Candado del portal: nadie pasa sin sesión válida */
if (esUsuarioPortal()){
  desbloquearPortal();
} else {
  cerrarVisor();
  abrirPortalLogin();
}

/* Apertura automática por URL: ?abrir=<nombre>
   Atajos: ?abrir=tickets · ?abrir=renta · ?abrir=inventario
   (los dos últimos requieren sesión IC). También acepta el
   nombre normalizado, p. ej. ?abrir=ingresos-diarios.       */
(function autoAbrir(){
  if (!esUsuarioPortal()) return;              /* con el portal cerrado, no abre nada */
  const p = new URLSearchParams(window.location.search).get('abrir');
  if (!p) return;
  const norm = s => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
  const ALIAS = {
    'tickets':    ACCESO_DIRECTO_NOMBRE,
    'renta':      'Análisis de Renta',
    'inventario': 'Reporte Inventario',
    'promedio':   'Promedio Master Final',
    'pelucheras': 'Ingresos Mensuales Pelucheras'
  };
  const objetivo = ALIAS[p.toLowerCase()];
  const d = DASHBOARDS.find(x => x.embed &&
    (objetivo ? x.nombre === objetivo : norm(x.nombre) === norm(p)));
  if (!d) return;
  if (d.soloIC && !esUsuarioIC()) return;      /* exclusivo equipo IC */
  abrirVisor(d);
})();

/* ==================== CARRUSEL DEL SIDEBAR ==================== */
(function iniciarCarrusel(){
  const cont = document.getElementById('sideCarousel');
  if (!cont || !CARRUSEL_IMAGENES.length) return;
  cont.innerHTML = `
    <div id="carruselMunelocos" class="carousel slide carousel-fade">
      <div class="carousel-indicators">
        ${CARRUSEL_IMAGENES.map((_, i) =>
          `<button type="button" data-bs-target="#carruselMunelocos" data-bs-slide-to="${i}" ${i===0?'class="active" aria-current="true"':''} aria-label="Imagen ${i+1}"></button>`
        ).join('')}
      </div>
      <div class="carousel-inner">
        ${CARRUSEL_IMAGENES.map((src, i) => `
        <div class="carousel-item ${i===0?'active':''}">
          <img src="${src}" alt="Muñelocos ${i+1}">
        </div>`).join('')}
      </div>
    </div>`;
  if (typeof bootstrap !== 'undefined'){
    new bootstrap.Carousel(document.getElementById('carruselMunelocos'), {
      interval: CARRUSEL_MS,
      ride: 'carousel',
      pause: 'hover',
      touch: true
    });
  }
})();

/* ==================== SIDEBAR RETRÁCTIL ==================== */
document.getElementById('btnMenu').addEventListener('click', () => {
  document.querySelector('.app').classList.toggle('sidebar-oculto');
});

/* ==================== RELOJ EN TIEMPO REAL ==================== */
function tick(){
  const ahora = new Date();
  const h = ahora.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', hour12:true });
  const hFmt = h.replace(/\s?(a|p)\.?\s?m\.?/i, m => ' ' + m.trim().toUpperCase().replace(/\./g,''));
  document.getElementById('relojHora').textContent = hFmt;
  document.getElementById('relojSeg').textContent = String(ahora.getSeconds()).padStart(2, '0');
  document.getElementById('visorHora').textContent = hFmt;
  /* La fecha se refresca sola al cambiar de día (medianoche) */
  const hoy = ahora.toDateString();
  if (window._ultimoDia !== hoy){ window._ultimoDia = hoy; iniciarHero(); }
  /* Si la sesión expiró mientras el portal estaba abierto, vuelve al login */
  if (!document.body.classList.contains('portal-cerrado') && !esUsuarioPortal()){
    cerrarPerfil();
    cerrarVisor();
    abrirPortalLogin();
    mostrarToast('Tu sesión expiró · vuelve a entrar');
  }
}
tick();
setInterval(tick, 1000);

/* ==================== BUSCADOR: LIMPIAR Y CTRL+K ==================== */
const searchClear = document.getElementById('searchClear');
function actualizarClear(){
  searchClear.classList.toggle('visible', searchIn.value.length > 0);
}
searchIn.addEventListener('input', actualizarClear);
searchClear.addEventListener('click', () => {
  searchIn.value = '';
  actualizarClear();
  render();
  searchIn.focus();
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    searchIn.focus();
    searchIn.select();
  }
  if (e.key === 'Escape' && document.activeElement === searchIn){
    searchIn.value = '';
    actualizarClear();
    render();
  }
});
actualizarClear();

/* ==================== FUNCIONES BOOTSTRAP 5 ==================== */
/* Toast con rebote de Animate.css */
function mostrarToast(texto){
  if (typeof bootstrap === 'undefined') return; /* sin conexión al CDN */
  const toastEl = document.getElementById('toastFav');
  document.getElementById('toastFavTexto').textContent = texto;
  toastEl.style.backgroundColor = '#0C447C';
  toastEl.style.color = '#fff';
  toastEl.classList.remove('animate__animated', 'animate__bounceIn');
  void toastEl.offsetWidth; /* reinicia la animación para toasts seguidos */
  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2000 }).show();
  toastEl.classList.add('animate__animated', 'animate__bounceIn');
}

/* Tooltips en todos los botones con atributo title */
function activarTooltips(){
  if (typeof bootstrap === 'undefined') return; /* sin conexión al CDN */
  document.querySelectorAll('.card [title], .side-item[title], .visor-btn[title]').forEach(el => {
    bootstrap.Tooltip.getOrCreateInstance(el, { placement: 'top' });
  });
}
activarTooltips();