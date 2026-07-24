/* ============================================================
   PORTAL DE DASHBOARDS — ALVACO · INTELIGENCIA COMERCIAL
   script.js · Lógica y configuración
   v2.3 · jul 2026 — NUEVO: "Reporte Inventario" en el área IC
   Secciones: configuración · iconos · favoritos · sidebar ·
   hero · recientes · tarjetas · visor · zoom · carrusel ·
   reloj · buscador · Bootstrap (toast y tooltips)
   ============================================================ */

/* ============================================================
   ⚙️  CONFIGURACIÓN DE DASHBOARDS — EDITA SOLO ESTA SECCIÓN
   ------------------------------------------------------------
   - nombre / descripcion: texto de la tarjeta
   - categoria: agrupa en el menú lateral (puedes crear nuevas)
   - color: blue | teal | green | amber | purple | red
   - tipo: (opcional) "app" para aplicaciones de Power Apps.
     Si se omite, la tarjeta se trata como reporte de Power BI.
     Con tipo "app" el visor NO agrega parámetros de Power BI,
     el botón dice "Abrir app" y el badge muestra "Power Apps".
   - imagen: (opcional) ruta a una imagen para la tarjeta,
     p. ej. "img/maquina.png". Si se define, sustituye al
     icono. Guarda las imágenes junto a este archivo.
   - embed: URL de inserción segura (visor NO editable).
     · Power BI: se construye así:
       https://app.powerbi.com/reportEmbed?reportId=ID_DEL_REPORTE&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7
       (el ID del reporte es el que aparece en la URL después de /reports/)
       O cópiala de: Archivo → Insertar informe → Sitio web o portal.
     · Power Apps: vínculo web de la app + parámetros:
       https://apps.powerapps.com/play/e/ENVIRONMENT-ID/a/APP-ID?source=portal-ic&hideNavBar=true
       (el vínculo web está en make.powerapps.com → tu app →
       Detalles → Vínculo web)
   - url: liga opcional para el botón secundario "abrir en
     pestaña nueva" (vínculo de compartir o URL directa).
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
    nombre: "Instalaciones",
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
    nombre: "Tiendas Neto",
    descripcion: "Ingreso, renta y equipos por estado, plaza y precio de juego.",
    categoria: "Ingresos",
    color: "red",
    imagen: "img/maquina_sin_fondo.png",
    /* ── DESACTIVADO TEMPORALMENTE ──
       Para reactivarlo, restaura estas dos líneas:
       embed: "https://app.powerbi.com/reportEmbed?reportId=c89958f5-bfbe-4950-a686-8974525da509&autoAuth=true&ctid=923eb367-abae-4010-9989-b7cf33fb74a7",
       url: "https://app.powerbi.com/links/GdfBrn1uXa?ctid=923eb367-abae-4010-9989-b7cf33fb74a7&pbi_source=linkShare"
    */
    embed: "",
    url: ""
  },
  {
    nombre: "Análisis de Renta",
    descripcion: "Simula escenarios de renta mixta y prorrateo de renta fija: compara renta y margen actual vs. nuevo.",
    categoria: "Herramientas IC",
    color: "teal",
    tipo: "web",     /* ← herramienta HTML propia: se abre en el visor sin parámetros de Power BI */
    soloIC: true,    /* ← EXCLUSIVO EQUIPO IC: solo visible dentro del área IC (con sesión) */
    imagen: "img/oso_semaforo_verde_transparente.png",
    /* El archivo vive JUNTO al portal, en la misma carpeta
       (Portal BI): ruta directa, sin dependencias de carpetas */
    embed: "Herramientas_Renta_ALVACO.html",
    url: "Herramientas_Renta_ALVACO.html"
  },
  {
    /* ══════════ NUEVO · EXCLUSIVO IC ══════════
       Herramienta HTML de consulta de inventario.
       El archivo Reporte_Inventario.html debe estar en la
       MISMA carpeta del portal (junto a index.html).
       Si en realidad es un reporte de Power BI, quita la
       línea tipo: "web" y cambia embed/url por las ligas
       de Power BI.                                        */
    nombre: "Reporte Inventario",
    descripcion: "Consulta y filtrado del inventario de equipos por plaza, cadena y estatus.",
    categoria: "Herramientas IC",
    color: "blue",
    tipo: "web",     /* ← herramienta HTML propia */
    soloIC: true,    /* ← EXCLUSIVO EQUIPO IC */
    imagen: "img/maquina_sin_fondo.png",
    embed: "Reporte_Inventario.html",
    url: "Reporte_Inventario.html"
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
  }
  /* Agrega más dashboards copiando la estructura anterior.
     Con oculto: true la entrada no genera tarjeta ni cuenta
     en los chips; solo queda disponible para el visor.      */
];

/* ---------- Imágenes del carrusel del sidebar ----------
   Agrega o quita rutas; cambia la velocidad en CARRUSEL_MS
   (milisegundos entre cambio: 4000 = 4 segundos)          */
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

/* ---------- Paneles de Power BI en el visor ----------
   Solo aplican a reportes de Power BI (no a tipo "app").
   OCULTAR_PANEL_FILTROS: quita el panel "Filtros" del lado
   derecho (los filtros internos del dashboard siguen vivos).
   OCULTAR_PANEL_PAGINAS: quita la barra de páginas/pestañas
   del reporte (déjalo en false si tus reportes tienen varias
   páginas y quieres poder navegarlas).                     */
const OCULTAR_PANEL_FILTROS = true;
const OCULTAR_PANEL_PAGINAS = false;

/* ---------- Acceso directo del menú lateral ----------
   Botón destacado en el sidebar que abre de inmediato la
   app indicada (por su "nombre" en DASHBOARDS), sin pasar
   por las tarjetas. Deja "" para ocultar el botón.
   Tip: el portal también acepta ?abrir=tickets en la URL
   para abrir la app automáticamente al cargar la página. */
const ACCESO_DIRECTO_NOMBRE = "Tickets IC";
const ACCESO_DIRECTO_LABEL  = "Solicitar ticket";

/* ---------- Segundo acceso directo del sidebar ----------
   Botón teal que abre de inmediato la herramienta indicada
   (por su "nombre" en DASHBOARDS) dentro del visor.
   Deja "" para ocultar el botón.
   (Análisis de Renta y Reporte Inventario ahora viven dentro
   del área IC, por eso este acceso directo queda vacío;
   puedes reutilizarlo cuando quieras.)                     */
const ACCESO_DIRECTO2_NOMBRE = "";
const ACCESO_DIRECTO2_LABEL  = "";

/* ---------- ÁREA INTELIGENCIA COMERCIAL ----------
   Sección exclusiva del equipo IC: aparece como opción en el
   menú lateral. Al dar clic pide correo + contraseña; si son
   válidos, muestra las tarjetas marcadas con soloIC: true.
   La sesión queda guardada en el navegador (localStorage).
   Para agregar archivos al área IC: crea la entrada en
   DASHBOARDS con soloIC: true (sin oculto).

   ⚠️ EDITA AQUÍ los correos reales del equipo IC (minúsculas): */
const IC_EMAILS = [
  "david.castillo@alvaco.com.mx",   /* ← pon tu correo real   */
  "julio.chavez@alvaco.com.mx",     /* ← correo de Julio      */
  "marco.garcia@alvaco.com.mx"      /* ← correo de Marco      */
];

/* ---------- CONTRASEÑAS DEL ÁREA IC (100% en el portal) ----------
   Sin SharePoint, sin servidores: el login funciona con el
   portal abierto de forma local, tal cual lo usan siempre.

   1) CONTRASEÑA MAESTRA del equipo (hash SHA-256, no legible):
      · Siempre funciona para los 3 correos de IC_EMAILS.
      · Es la llave de respaldo si alguien olvida la suya.
      Para cambiarla: abre la consola del navegador (F12) en el
      portal y ejecuta  hashIC("NuevaContraseña").then(console.log)
      y pega el resultado aquí:                                  */
const IC_PASS_HASH = "8bf7c3aa8c97f0782bf9fcb452bbe72627620a6945385fc08f7442b22f21e292";

/* 2) CONTRASEÑAS PERSONALES permanentes (opcional, por correo).
      Cuando alguien cambia su contraseña desde el portal, este
      le muestra un código (hash) para enviarte. Pégalo aquí con
      su correo y su contraseña personal funcionará en CUALQUIER
      equipo. (Sin este paso, el cambio aplica solo en el
      navegador donde lo hizo; la maestra siempre es respaldo.)
      Ejemplo:
        "julio.chavez@alvaco.com.mx": "a1b2c3... (64 caracteres)",
*/
const IC_PASS_USUARIOS = {
  /* "correo@alvaco.com.mx": "hash-de-64-caracteres", */
};
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

/* ==================== REFERENCIAS DEL DOM ==================== */
const grid       = document.getElementById('grid');
const sideNav    = document.getElementById('sideNav');
const searchIn   = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');

/* ==================== FAVORITOS ==================== */
let filtroActivo = 'Todos';
let favoritos = new Set();

/* Favoritos persistentes (si el navegador lo permite) */
try {
  const saved = localStorage.getItem('alvaco-favoritos');
  if (saved) favoritos = new Set(JSON.parse(saved));
} catch(e){ /* modo en memoria */ }

function guardarFavoritos(){
  try { localStorage.setItem('alvaco-favoritos', JSON.stringify([...favoritos])); }
  catch(e){ /* modo en memoria */ }
}

/* ==================== ÁREA IC: SESIÓN Y LOGIN ==================== */
async function hashIC(texto){
  const data = new TextEncoder().encode(texto);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function correoSesionIC(){
  try { return (localStorage.getItem('alvaco-ic-user') || '').toLowerCase().trim(); }
  catch(e){ return ''; }
}

function esUsuarioIC(){
  const correo = correoSesionIC();
  return !!correo && IC_EMAILS.map(e => e.toLowerCase().trim()).includes(correo);
}

/* --- Modal de login --- */
const icLoginOverlay = document.getElementById('icLoginOverlay');
const icLoginCorreo  = document.getElementById('icLoginCorreo');
const icLoginPass    = document.getElementById('icLoginPass');
const icLoginError   = document.getElementById('icLoginError');

function abrirLoginIC(){
  icLoginError.classList.remove('visible');
  icLoginCorreo.value = '';
  icLoginPass.value = '';
  icLoginOverlay.classList.add('visible');
  setTimeout(() => icLoginCorreo.focus(), 80);
}
function cerrarLoginIC(){
  icLoginOverlay.classList.remove('visible');
}

/* --- Contraseñas personales (por correo, en este navegador) --- */
function hashPersonalIC(correo){
  try { return localStorage.getItem('alvaco-ic-pass-' + correo) || ''; }
  catch(e){ return ''; }
}

/* Valida una contraseña para un correo. Acepta, en este orden:
   1) su contraseña personal de este navegador (localStorage)
   2) su contraseña personal permanente (IC_PASS_USUARIOS)
   3) la maestra del equipo (IC_PASS_HASH)                    */
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

/* --- Modal de cambio de contraseña --- */
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
  /* 1) Verificar contraseña actual (personal o maestra) */
  if (!(await validarPassIC(correo, icPassActual.value))){
    errorPassIC('La contraseña actual no es correcta.', icPassActual);
    return;
  }
  /* 2) Validar la nueva */
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
  /* 3) Guardar el hash personal para este correo (este navegador)
        y mostrar el código para volverlo permanente en el código */
  const hashNuevo = await hashIC(nueva);
  try { localStorage.setItem('alvaco-ic-pass-' + correo, hashNuevo); } catch(e){}
  document.getElementById('icPassCodigo').textContent = '"' + correo + '": "' + hashNuevo + '",';
  document.getElementById('icPassForm').style.display = 'none';
  document.getElementById('icPassExito').classList.add('visible');
  mostrarToast('✔ Contraseña actualizada');
}

function copiarCodigoPassIC(){
  const texto = document.getElementById('icPassCodigo').textContent;
  const listo = () => mostrarToast('Código copiado · envíalo a David');
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

/* Salida por URL: ?ic=salir */
(function salidaIC(){
  const p = new URLSearchParams(window.location.search).get('ic');
  if (p && p.toLowerCase() === 'salir'){
    try { localStorage.removeItem('alvaco-ic-user'); } catch(e){}
  }
})();

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

  /* Botón teal: segundo acceso directo (oculto si el nombre está
     vacío; si la herramienta es soloIC, requiere sesión IC)     */
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
    .filter(d => d.embed || d.url)              /* sin liga (desactivado) no aparece   */
    .filter(d => !d.soloIC || esUsuarioIC());   /* soloIC no aparece sin modo IC       */
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

  DASHBOARDS.forEach((d, i) => {
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
        /* Estrella con rebote al marcar (Animate.css) */
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
    /* ALEJAR: se amplía el lienzo y se reduce; Power BI re-ajusta y muestra todo más compacto */
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
  /* Entrada del marco con Animate.css */
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

/* ==================== ARRANQUE ==================== */
iniciarHero();
renderRecientes();
construirSidebar();
render();

/* Apertura automática por URL: ?abrir=<nombre>
   Abre de inmediato cualquier tarjeta del portal al cargar.
   Atajos: ?abrir=tickets (Power App) · ?abrir=renta (Análisis
   de Renta) · ?abrir=inventario (Reporte Inventario); los dos
   últimos requieren sesión IC. También acepta el nombre de la
   tarjeta normalizado (minúsculas, sin acentos, espacios como
   guiones), p. ej. ?abrir=ingresos-diarios.                   */
(function autoAbrir(){
  const p = new URLSearchParams(window.location.search).get('abrir');
  if (!p) return;
  const norm = s => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
  const ALIAS = {
    'tickets':    ACCESO_DIRECTO_NOMBRE,
    'renta':      'Análisis de Renta',
    'inventario': 'Reporte Inventario'
  };
  const objetivo = ALIAS[p.toLowerCase()];
  const d = DASHBOARDS.find(x => x.embed &&
    (objetivo ? x.nombre === objetivo : norm(x.nombre) === norm(p)));
  if (!d) return;
  if (d.soloIC && !esUsuarioIC()) return;   /* exclusivo equipo IC */
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
/* Toast al marcar/quitar favoritos, con rebote de Animate.css */
function mostrarToast(texto){
  if (typeof bootstrap === 'undefined') return; /* sin conexión al CDN */
  const toastEl = document.getElementById('toastFav');
  document.getElementById('toastFavTexto').textContent = texto;
  toastEl.style.backgroundColor = '#0C447C';
  toastEl.style.color = '#fff';
  toastEl.classList.remove('animate__animated', 'animate__bounceIn');
  void toastEl.offsetWidth; /* reinicia la animación para toasts seguidos */
  toastEl.classList.add('animate__animated', 'animate__bounceIn');
  bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2000 }).show();
}

/* Tooltips en todos los botones con atributo title */
function activarTooltips(){
  if (typeof bootstrap === 'undefined') return; /* sin conexión al CDN */
  document.querySelectorAll('[title]').forEach(el => {
    bootstrap.Tooltip.getOrCreateInstance(el, { placement: 'top' });
  });
}
activarTooltips();
