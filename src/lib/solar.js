// Cálculos solares de eSolar Cantabria. Se usan en el servidor (páginas de municipio) y en el navegador (calculadoras).
// Todo es mensual: producción de PVGIS para el municipio frente al consumo de la casa.

export const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// Referencias de PVGIS con los mismos parámetros que los municipios (inclinación óptima, 14 % de pérdidas)
export const REFERENCIAS = {
  berlin: 1053,
  munich: 1139,
  berlinMeses: [33, 57, 91, 121, 130, 130, 127, 120, 104, 72, 40, 29],
};

// Supuestos por defecto. Todos se pueden cambiar en las calculadoras.
export const SUPUESTOS = {
  precioLuz: 0.20,         // €/kWh que dejas de comprar (energía + impuestos)
  precioExcedente: 0.06,   // €/kWh que te compensan por verter a la red
  parteFija: 18,           // €/mes de la factura que no depende del consumo (potencia, contador)
  costeKwp: 1300,          // €/kWp instalado, IVA incluido (orientativo; el precio real lo da el instalador)
  potenciaPanel: 0.45,     // kWp por panel
  superficiePanel: 2.3,    // m² de tejado por panel, contando separaciones
  degradacion: 0.005,      // pérdida anual de producción de un panel de calidad
  costeBateriaKwh: 650,    // €/kWh útil de batería instalada, IVA incluido (orientativo)
  rendimientoBateria: 0.9, // energía que devuelve la batería por cada kWh que guarda
};

// Parte del consumo que ocurre con sol, según el tipo de hogar
export const PERFILES = {
  fuera: { texto: 'Casi nadie en casa de día', diurno: 0.30 },
  mixto: { texto: 'Alguien en casa parte del día', diurno: 0.42 },
  casa: { texto: 'Teletrabajo o casa ocupada todo el día', diurno: 0.55 },
  negocio: { texto: 'Negocio o taller que abre de día', diurno: 0.70 },
};

export const consumoDesdeFactura = (facturaMes, s = SUPUESTOS) =>
  Math.max(0, (facturaMes - s.parteFija) / s.precioLuz) * 12;

export const repartirConsumo = (anual) => DIAS_MES.map((d) => (anual * d) / 365);

// Potencia recomendada: cubrir en torno al 80 % del consumo anual, en paneles enteros y con un mínimo de 4
export function potenciaRecomendada(consumoAnual, produccionKwp, s = SUPUESTOS, techoM2 = null) {
  let paneles = Math.max(4, Math.round((consumoAnual * 0.8) / produccionKwp / s.potenciaPanel));
  if (techoM2) paneles = Math.min(paneles, Math.max(1, Math.floor(techoM2 / s.superficiePanel)));
  return { paneles, kwp: Math.round(paneles * s.potenciaPanel * 100) / 100, m2: Math.ceil(paneles * s.superficiePanel) };
}

/**
 * Balance mensual de una instalación.
 * meses: producción por kWp de cada mes (PVGIS); kwp: potencia; consumoAnual: kWh; diurno: fracción del consumo con sol
 */
export function balance({ meses, kwp, consumoAnual, diurno, s = SUPUESTOS, bateriaKwh = 0 }) {
  const consumo = repartirConsumo(consumoAnual);
  const filas = meses.map((porKwp, i) => {
    const produccion = porKwp * kwp;
    const c = consumo[i];
    let auto = Math.min(produccion, c * diurno);
    let excedente = produccion - auto;
    let compra = c - auto;
    let deBateria = 0;
    if (bateriaKwh > 0) {
      // Cada día la batería guarda lo que sobra y lo devuelve por la noche, hasta su capacidad
      const dias = DIAS_MES[i];
      const porDia = Math.min(bateriaKwh, excedente / dias) * s.rendimientoBateria;
      deBateria = Math.min(porDia * dias, compra);
      excedente -= deBateria / s.rendimientoBateria;
      compra -= deBateria;
      auto += deBateria;
    }
    // Compensación simplificada: nunca supera lo que pagas por la energía que compras ese mes
    const compensacionBruta = excedente * s.precioExcedente;
    const tope = compra * s.precioLuz;
    const compensacion = Math.min(compensacionBruta, tope);
    const ahorro = auto * s.precioLuz + compensacion;
    return { mes: i, produccion, consumo: c, auto, excedente, compra, deBateria, compensacion, compensacionPerdida: compensacionBruta - compensacion, ahorro };
  });
  const suma = (k) => filas.reduce((a, f) => a + f[k], 0);
  const produccion = suma('produccion');
  const auto = suma('auto');
  return {
    filas,
    produccion,
    auto,
    excedente: suma('excedente'),
    compra: suma('compra'),
    compensacion: suma('compensacion'),
    compensacionPerdida: suma('compensacionPerdida'),
    ahorro: suma('ahorro'),
    cobertura: auto / consumoAnual,
    aprovechamiento: produccion ? auto / produccion : 0,
  };
}

// Ahorro acumulado en N años, con la pérdida de rendimiento de los paneles y sin contar subidas de la luz
export const ahorroAcumulado = (ahorroAnual, anios = 25, s = SUPUESTOS) =>
  Array.from({ length: anios }, (_, i) => ahorroAnual * (1 - s.degradacion) ** i).reduce((a, b) => a + b, 0);

// Deducción del IRPF por autoconsumo (DA 62.ª Ley 35/2006, RDL 7/2026): 10 % o 20 %, base máxima 5.000 €/año
export function deduccionIrpf({ pagado, subvencion = 0, edificio = false }) {
  const porcentaje = edificio ? 0.20 : 0.10;
  const base = Math.min(5000, Math.max(0, pagado - subvencion));
  return { porcentaje, base, deduccion: Math.round(base * porcentaje) };
}

// Calefacción: reparto del gasto de calefacción por meses en un clima como el de Cantabria (suma 1)
export const REPARTO_CALEFACCION = [0.17, 0.15, 0.13, 0.09, 0.05, 0.02, 0.01, 0.01, 0.02, 0.07, 0.12, 0.16];

// Formatos
const nf = (d) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d, useGrouping: 'always' });
export const euros = (n, d = 0) => `${nf(d).format(n)} €`;
export const kwh = (n) => `${nf(0).format(n)} kWh`;
export const numero = (n, d = 0) => nf(d).format(n);
export const porcentaje = (n) => `${nf(0).format(n * 100)} %`;
