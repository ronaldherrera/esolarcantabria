// Saca las cifras de referencia que citan los artículos del blog (para revisarlas si cambian los datos)
import fs from 'node:fs';
import * as S from '../src/lib/solar.js';
const M = JSON.parse(fs.readFileSync('src/data/municipios.json', 'utf8'));
const by = (s) => M.find((m) => m.slug === s);
for (const s of ['santander', 'torrelavega', 'castro-urdiales', 'camargo', 'pielagos', 'laredo', 'reinosa', 'potes', 'santillana-del-mar', 'san-vicente-de-la-barquera', 'suances', 'noja', 'vega-de-pas', 'san-roque-de-riomiera', 'valdeolea', 'comillas', 'santona', 'los-corrales-de-buelna', 'cabezon-de-la-sal']) {
  const m = by(s); if (!m) { console.log('NO', s); continue; }
  console.log(m.nombre, m.anual, 'dic', m.meses[11], 'jul', m.meses[6], 'ene', m.meses[0], 'puesto', m.puesto, 'incl', m.inclinacion);
}
const med = Math.round(M.reduce((a, x) => a + x.anual, 0) / M.length);
console.log('media', med, 'más que Berlín', M.filter((m) => m.anual > 1053).length, 'menos', M.filter((m) => m.anual <= 1053).map((m) => m.nombre + ' ' + m.anual).join(', '));
const m = by('santander');
for (const f of [60, 90, 140]) {
  const c = S.consumoDesdeFactura(f); const p = S.potenciaRecomendada(c, m.anual);
  for (const k of ['fuera', 'mixto', 'casa']) {
    const b = S.balance({ meses: m.meses, kwp: p.kwp, consumoAnual: c, diurno: S.PERFILES[k].diurno });
    console.log(f, k, Math.round(c), p.paneles, p.kwp, Math.round(b.produccion), 'ahorro', Math.round(b.ahorro), 'cob', Math.round(b.cobertura * 100), 'aprov', Math.round(b.aprovechamiento * 100), 'perd', Math.round(b.compensacionPerdida), 'exc', Math.round(b.excedente), 'comp', Math.round(b.compensacion));
  }
}
for (const bat of [5, 10]) {
  const base = { meses: m.meses, kwp: 3.6, consumoAnual: 4320, diurno: 0.3 };
  const a = S.balance(base), b = S.balance({ ...base, bateriaKwh: bat });
  console.log('batería', bat, Math.round(a.ahorro), Math.round(b.ahorro), 'extra', Math.round(b.ahorro - a.ahorro), 'retorno', Math.round(bat * 650 / (b.ahorro - a.ahorro)));
}
