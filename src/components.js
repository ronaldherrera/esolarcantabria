export const header = `
  <header class="header">
    <nav class="nav container">
      <a href="/" class="logo">
        <img src="/logotipo-horizontal.svg" alt="eSolar Cantabria">
      </a>
      <ul class="nav-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/servicios.html">Servicios</a></li>
        <li><a href="/subvenciones.html">Subvenciones</a></li>
        <li><a href="/proceso.html">Proceso</a></li>
        <li><a href="/nosotros.html">Nosotros</a></li>
        <li><a href="/faq.html">FAQ</a></li>
        <li><a href="/contacto.html" class="btn btn-primary">Pide Presupuesto</a></li>
      </ul>
    </nav>
  </header>
`;

export const footer = `
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <a href="/" class="logo" style="margin-bottom: 1.5rem;">
          <img src="/logotipo-monocolor-blanco.svg" alt="eSolar Cantabria" style="height: 50px;">
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
      <p>&copy; 2026 eSolar Cantabria. Todos los derechos reservados. | <a href="#">Aviso Legal</a> | <a href="#">Privacidad</a></p>
    </div>
  </footer>
`;

export function initCommonUI() {
  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);

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
}
