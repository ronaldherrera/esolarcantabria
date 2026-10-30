// Ayudas de interfaz para las calculadoras (solo navegador)

// Une un deslizador con su casilla numérica: al mover uno se actualiza el otro
export function enlazarDeslizadores(raiz = document) {
  raiz.querySelectorAll('.deslizador').forEach((d) => {
    const rango = d.querySelector('input[type=range]');
    const num = d.querySelector('input[type=number]');
    if (!rango || !num) return;
    rango.addEventListener('input', () => { num.value = rango.value; num.dispatchEvent(new Event('input', { bubbles: true })); });
    num.addEventListener('input', () => { if (num.value !== '') rango.value = num.value; });
  });
}

export const valor = (form, nombre) => {
  const el = form.elements.namedItem(nombre);
  if (!el) return null;
  if (el instanceof RadioNodeList) return el.value;
  if (el.type === 'checkbox') return el.checked;
  if (el.type === 'number' || el.type === 'range') return el.value === '' ? null : Number(el.value);
  return el.value;
};

export const escribir = (raiz, clave, texto) => {
  raiz.querySelectorAll(`[data-r="${clave}"]`).forEach((el) => { el.textContent = texto; });
};

// Barras de producción (amarillo) con la línea de consumo (azul)
export function pintarBarras(caja, produccion, consumo) {
  const max = Math.max(...produccion, ...consumo, 1);
  caja.innerHTML = produccion.map((p, i) =>
    `<div class="m"><div class="p" style="height:${(p / max) * 100}%"></div><div class="c" style="bottom:${(consumo[i] / max) * 100}%"></div></div>`).join('');
}

// Guarda el resumen para que el formulario de presupuesto lo adjunte
export function guardarCalculo(texto, municipio) {
  try { sessionStorage.setItem('esolar-calculo', JSON.stringify({ texto, municipio })); } catch {}
}

// Recuerda el municipio elegido entre calculadoras
export const municipioGuardado = () => { try { return localStorage.getItem('esolar-municipio'); } catch { return null; } };
export const recordarMunicipio = (slug) => { try { localStorage.setItem('esolar-municipio', slug); } catch {} };
