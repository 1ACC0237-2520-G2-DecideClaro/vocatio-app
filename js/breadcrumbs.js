// Breadcrumbs minimalista y reutilizable para Vocatio
// Inserta un breadcrumb sutil bajo el <header> sin romper estilos existentes.
(function () {
  'use strict';

  // Inyectar estilos locales (sutiles, no invasivos)
  function injectStyles() {
    if (document.getElementById('vc-breadcrumb-style')) return;
    const style = document.createElement('style');
    style.id = 'vc-breadcrumb-style';
    style.textContent = `
      nav.vc-breadcrumb { 
        font-family: 'Roboto', system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif;
        font-size: 14px; 
        line-height: 1.6; 
        color: rgba(0,0,0,0.56); 
        margin: 10px auto 0; 
        max-width: 1200px; 
        padding: 0 16px; 
        user-select: none;
      }
      nav.vc-breadcrumb a { 
        color: inherit; 
        text-decoration: none; 
        opacity: 0.9; 
      }
      nav.vc-breadcrumb a:hover { 
        text-decoration: underline; 
        opacity: 1; 
      }
      .vc-crumb { display: inline-flex; align-items: center; white-space: nowrap; }
      .vc-sep { margin: 0 6px; opacity: 0.5; }
    `;
    document.head.appendChild(style);
  }

  // Helpers de numeración del test
  function getHistory() {
    try { return JSON.parse(localStorage.getItem('vocatio_history') || '[]'); } catch (_) { return []; }
  }
  function getCurrentTestId() {
    try { const t = JSON.parse(localStorage.getItem('vocatio_current_test') || 'null'); return t && t.id; } catch (_) { return null; }
  }
  function getSeqForCurrentTest() {
    const id = getCurrentTestId();
    if (!id) return null;
    const entry = getHistory().find(e => e.id === id);
    return entry && typeof entry.seq === 'number' ? entry.seq : null;
  }
  function getNextSeqPreview() {
    const counter = parseInt(localStorage.getItem('vocatio_test_counter') || '0', 10);
    return counter + 1;
  }

  // Construcción de items por página
  function buildItems() {
    const path = (location.pathname || '').toLowerCase();
    const make = (label, href, current) => ({ label, href, current: !!current });

    // Mapear por archivo
    if (path.endsWith('/pages/test.html') || path.endsWith('pages/test.html')) {
      const n = getNextSeqPreview();
      return [ make(`Test Vocacional #${n}`, null, true) ];
    }

    if (path.endsWith('/pages/suggest.html') || path.endsWith('pages/suggest.html')) {
      const seq = getSeqForCurrentTest();
      const n = seq != null ? seq : getNextSeqPreview();
      return [
        make('Dashboard', 'dashboard.html'),
        make('Historial', 'history.html'),
        make(`Test Vocacional #${n}`, null, true)
      ];
    }

    if (path.endsWith('/pages/history.html') || path.endsWith('pages/history.html')) {
      return [ make('Dashboard', 'dashboard.html'), make('Historial', null, true) ];
    }

    if (path.endsWith('/pages/explore.html') || path.endsWith('pages/explore.html')) {
      // Requisito: mostrar simplemente "Explorar/"
      return [ make('Explorar', null, true) ];
    }

    if (path.endsWith('/pages/materials.html') || path.endsWith('pages/materials.html')) {
      return [ make('Explorar', 'explore.html'), make('Materiales', null, true) ];
    }

    if (path.endsWith('/pages/favorites.html') || path.endsWith('pages/favorites.html')) {
      return [ make('Dashboard', 'dashboard.html'), make('Favoritos', null, true) ];
    }

    if (path.endsWith('/pages/dashboard.html') || path.endsWith('pages/dashboard.html')) {
      // Opcional: mostrar Dashboard/
      return [ make('Dashboard', null, true) ];
    }

    return null; // Páginas no soportadas o públicas
  }

  function render(items) {
    if (!items || !items.length) return;
    const header = document.querySelector('body > header');
    if (!header) return;

    const nav = document.createElement('nav');
    nav.className = 'vc-breadcrumb';
    nav.setAttribute('aria-label', 'breadcrumb');

    // Construir contenido
    items.forEach((it, idx) => {
      const span = document.createElement('span');
      span.className = 'vc-crumb';
      if (it.href && !it.current) {
        const a = document.createElement('a');
        a.textContent = it.label;
        a.href = resolveHref(it.href);
        span.appendChild(a);
      } else {
        span.textContent = it.label;
      }
      nav.appendChild(span);
      if (idx < items.length - 1) {
        const sep = document.createElement('span');
        sep.className = 'vc-sep';
        sep.textContent = '/';
        nav.appendChild(sep);
      }
    });

    // Insertar inmediatamente después del header
    header.insertAdjacentElement('afterend', nav);
  }

  // Resolver rutas relativas desde /pages/*.html
  function resolveHref(href) {
    // Si ya es absoluta o tiene esquema
    if (/^https?:/i.test(href)) return href;
    // Desde /pages/*.html, enlazar a sibling en pages
    if (location.pathname.toLowerCase().includes('/pages/')) {
      return href; // "xxx.html" ya apunta a /pages/xxx.html relativo al documento actual
    }
    // Desde raíz (index): prefijar pages/
    return 'pages/' + href.replace(/^\/?/, '');
  }

  function init() {
    injectStyles();
    const items = buildItems();
    render(items);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
