import { initCommonUI } from './src/components.js';

// Initialize Global UI Components
initCommonUI();

/**
 * ANIMACIONES AL HACER SCROLL (REVEAL)
 */
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Una vez animado, dejamos de observar para ahorrar recursos
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Seleccionamos elementos que queremos animar automáticamente
  // Añadimos la clase .reveal a secciones, tarjetas y elementos de rejilla
  const elementsToAnimate = document.querySelectorAll('section, .glass-card, .step-card, .faq-item, .grid-3 > div');
  
  elementsToAnimate.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
};

// --- CALCULADOR WIZARD LOGIC v2.0 ---
const wizard = {
  // ... (mantenemos la lógica del calculador igual)
  currentStep: 1,
  totalSteps: 4,
  data: { municipioIbi: 0, gastoLuz: 120, superficie: 40, consumoKwh: null, email: '' },
  
  init() {
    this.bindEvents();
    this.updateUI();
  },

  bindEvents() {
    document.querySelectorAll('.next-step').forEach(btn => btn.addEventListener('click', () => this.nextStep()));
    document.querySelectorAll('.prev-step').forEach(btn => btn.addEventListener('click', () => this.prevStep()));
    
    // Step 1
    const gastoInput = document.getElementById('gastoLuz');
    if (gastoInput) {
      gastoInput.addEventListener('input', (e) => {
        this.data.gastoLuz = e.target.value;
        document.getElementById('gastoLuzVal').textContent = e.target.value;
      });
    }

    // Step 2
    const superficieInput = document.getElementById('superficieTejado');
    if (superficieInput) {
      superficieInput.addEventListener('change', (e) => this.data.superficie = e.target.value);
    }
    const consumptionInput = document.getElementById('consumoKwh');
    if (consumptionInput) {
      consumptionInput.addEventListener('change', (e) => this.data.consumoKwh = e.target.value);
    }

    // Lead Form
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
      leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.data.email = document.getElementById('userEmail').value;
        this.nextStep();
      });
    }

    // Restart
    document.querySelectorAll('.restart-calc').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentStep = 1;
        this.updateUI();
      });
    });
  },

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateUI();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateUI();
    }
  },

  updateUI() {
    document.querySelectorAll('.calc-step').forEach((el, index) => {
      el.style.display = (index + 1 === this.currentStep) ? 'block' : 'none';
      if (index + 1 === this.currentStep) el.classList.add('fade-in');
    });

    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
    }

    if (this.currentStep === this.totalSteps) this.calculateFinal();
  },

  calculateFinal() {
    const municipio = document.getElementById('municipioIbi').value;
    const superficie = parseFloat(document.getElementById('superficieTejado').value) || 40;
    const kwhManual = parseFloat(document.getElementById('consumoKwh').value);
    
    const consumoMensualKwh = kwhManual || (this.data.gastoLuz / 0.22);
    const panelesDeseados = Math.round(consumoMensualKwh / 45); 
    const panelesPorSuperficie = Math.floor(superficie / 2.1); 
    
    const numPaneles = Math.min(panelesDeseados, panelesPorSuperficie);
    const limitado = numPaneles < panelesDeseados;
    
    const potenciaKwp = (numPaneles * 0.45).toFixed(1);
    let ahorroMensualFactura = (numPaneles * 45) * 0.20; 
    let ahorroAnualIbi = (municipio !== "0") ? 250 : 0;
    
    const ahorroTotalAnual = Math.round((ahorroMensualFactura * 12) + ahorroAnualIbi);
    const inversionAprox = numPaneles * 900;
    const roi = (inversionAprox / ahorroTotalAnual).toFixed(1);
    const co2 = (numPaneles * 0.28).toFixed(1);

    const dashboard = document.getElementById('dashboard-content');
    if (dashboard) {
        dashboard.innerHTML = `
          <div style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); color: white; padding: 2.5rem 2rem; border-radius: 1.5rem; margin-bottom: 2rem; box-shadow: 0 15px 30px rgba(147, 197, 114, 0.3);">
            <h3 style="margin-bottom: 0.5rem; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px;">Ahorro Anual Estimado</h3>
            <div style="font-size: 4rem; font-weight: 800; line-height: 1;">
              ${ahorroTotalAnual.toLocaleString('es-ES')} <span style="font-size: 1.8rem; opacity: 0.8;">€</span>
            </div>
            ${limitado ? `<p style="margin-top: 1rem; font-size: 0.85rem; padding: 0.5rem; background: rgba(0,0,0,0.1); border-radius: 0.5rem;">⚠️ Limitado por superficie disponible (${superficie}m²)</p>` : ''}
          </div>
          
          <div class="grid grid-3" style="gap: 1rem; margin-bottom: 2rem;">
            <div class="glass-card" style="padding: 1.2rem; background: #fafafa; border: none;">
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary-color);">${numPaneles}</div>
              <div style="font-size: 0.65rem; font-weight: 800; color: #999; text-transform: uppercase;">Paneles</div>
            </div>
            <div class="glass-card" style="padding: 1.2rem; background: #fafafa; border: none;">
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary-color);">${roi}</div>
              <div style="font-size: 0.65rem; font-weight: 800; color: #999; text-transform: uppercase;">Años ROI</div>
            </div>
            <div class="glass-card" style="padding: 1.2rem; background: #fafafa; border: none;">
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-color);">${co2} t</div>
              <div style="font-size: 0.65rem; font-weight: 800; color: #999; text-transform: uppercase;">CO2 Evitado/Año</div>
            </div>
          </div>
    
          <div style="background: #fdfdfd; border: 1px solid #eee; border-radius: 1rem; padding: 1.5rem; text-align: left; margin-bottom: 1.5rem;">
            <h4 style="font-size: 0.9rem; color: var(--dark-color); margin-bottom: 1rem;">🔍 Detalle Técnico de tu instalación</h4>
            <div style="font-size: 0.85rem; color: #666; display: grid; gap: 0.8rem;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 0.5rem;">
                <span>Potencia Total:</span>
                <strong style="color: var(--dark-color);">${potenciaKwp} kWp</strong>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 0.5rem;">
                <span>Consumo Estimado:</span>
                <strong style="color: var(--dark-color);">${Math.round(consumoMensualKwh)} kWh/mes</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Superficie Utilizada:</span>
                <strong style="color: var(--dark-color);">${(numPaneles * 2.1).toFixed(1)} m²</strong>
              </div>
            </div>
          </div>
        `;
    }
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Calculador
    if (document.getElementById('calculator-wizard') || document.getElementById('step1')) {
        wizard.init();
    }
    
    // FAQ
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
          const faqItem = button.parentElement;
          faqItem.classList.toggle('active');
        });
    });

    // Iniciar Animaciones
    initScrollAnimations();

    // Lógica de Cookies
    const cookieBannerEl = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    
    if (cookieBannerEl && acceptBtn) {
        // Si no ha aceptado, mostrar tras un pequeño delay
        if (!localStorage.getItem('cookies-accepted')) {
            setTimeout(() => {
                cookieBannerEl.classList.add('visible');
            }, 500);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'true');
            cookieBannerEl.classList.remove('visible');
        });
    }
});
