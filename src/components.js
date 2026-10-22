export const header = `
  <header class="header">
    <nav class="nav container">
      <a href="/" class="logo">
        <img src="/recursos/logotipo-horizontal.svg" alt="eSolar Cantabria">
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        <li><a href="/">Inicio</a></li>
        <li><a href="/servicios.html">Servicios</a></li>
        <li><a href="/subvenciones.html">Subvenciones</a></li>
        <li><a href="/proceso.html">Proceso</a></li>
        <li><a href="/nosotros.html">Nosotros</a></li>
        <li><a href="/faq.html">FAQ</a></li>
        <li><a href="/contacto.html" class="btn btn-primary nav-cta">Pide Presupuesto</a></li>
      </ul>
    </nav>
  </header>
`;

export const footer = `
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <a href="/" class="logo" style="margin-bottom: 1.5rem;">
          <img src="/recursos/logotipo-monocolor-blanco.svg" alt="eSolar Cantabria" style="height: 50px;">
        </a>
        <p style="margin-top: 1.5rem; color: #ccc;">Expertos en energía solar fotovoltaica en Cantabria. Lideramos la transición energética en nuestra región con soluciones personalizadas, asesoramiento experto y toda la documentación para tus ayudas.</p>
      </div>
      <div class="footer-col">
        <h4>Páginas</h4>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/servicios.html">Servicios</a></li>
          <li><a href="/subvenciones.html">Subvenciones</a></li>
          <li><a href="/faq.html">Preguntas Frecuentes</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Servicios</h4>
        <ul>
          <li><a href="/servicios.html#residencial">Autoconsumo Residencial</a></li>
          <li><a href="/servicios.html#industrial">Placas para Empresas</a></li>
          <li><a href="/servicios.html#aislada">Instalaciones Aisladas</a></li>
          <li><a href="/servicios.html#mantenimiento">Mantenimiento</a></li>
          <li><a href="/proceso.html">Proceso de Instalación</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contacto</h4>
        <ul>
          <li>✉️ hola@esolarcantabria.es</li>
        </ul>
      </div>
    </div>
    <div class="container copy">
      <p>&copy; 2026 eSolar Cantabria. Todos los derechos reservados. | <a href="/aviso-legal.html">Aviso Legal</a> | <a href="/privacidad.html">Privacidad</a></p>
    </div>
  </footer>
`;

export const cookieBanner = `
  <div id="cookie-banner" class="cookie-banner">
    <div class="cookie-content">
      <span>🍪</span>
      <p>Utilizamos cookies propias para asegurar que damos la mejor experiencia al usuario en nuestra web. Si continúas utilizando este sitio asumiremos que estás de acuerdo. <a href="/privacidad.html">Más información</a></p>
    </div>
    <div class="cookie-actions">
      <button id="accept-cookies" class="btn btn-primary" style="padding: 0.8rem 2rem;">Aceptar y continuar</button>
    </div>
  </div>
`;

export function initCommonUI() {
  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
  document.body.insertAdjacentHTML('beforeend', cookieBanner);

  // Scroll Header Effect
  window.addEventListener('scroll', () => {
    const headerEl = document.querySelector('.header');
    if (window.scrollY > 50) {
      headerEl.classList.add('scrolled');
    } else {
      headerEl.classList.remove('scrolled');
    }
  });

  // Active Link Highlight
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/')) {
      link.classList.add('active');
    }
  });

  // Menú hamburguesa
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    navLinks.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', true);
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Cerrar al hacer clic en el overlay
  overlay.addEventListener('click', closeMenu);

  // Cerrar al hacer clic en un enlace
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
