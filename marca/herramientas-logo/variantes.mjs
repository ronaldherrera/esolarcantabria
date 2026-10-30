// Variantes pulidas de la «e» solar, construidas con las proporciones de la «e» de Schibsted Grotesk 800
import fs from 'node:fs';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const carga = (n) => { const b = fs.readFileSync(`fuentes/${n}.woff`); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const sch800 = carga('schibsted-800'), sch500 = carga('schibsted-500');
const UPM = 2048, XH = 1080, OV = 27;

function trazo(path, dx, dy) {
  const r = (v) => Math.round(v * 100) / 100;
  return path.commands.map((c) => {
    const pts = c.type === 'Z' ? [] : c.type === 'Q' ? [[c.x1, c.y1], [c.x, c.y]]
      : c.type === 'C' ? [[c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]] : [[c.x, c.y]];
    return c.type + pts.map(([x, y]) => `${r(x + dx)} ${r(y + dy)}`).join(' ');
  }).join('');
}
function texto(fuente, cadena, x, y, tam, esp = 0) {
  let cx = x; const d = [];
  const gl = [...cadena].map((ch) => fuente.charToGlyph(ch));
  gl.forEach((g, i) => {
    d.push(trazo(g.getPath(0, 0, tam), cx, y));
    let av = g.advanceWidth * tam / fuente.unitsPerEm;
    if (i < gl.length - 1) av += (fuente.getKerningValue(g, gl[i + 1]) || 0) * tam / fuente.unitsPerEm;
    cx += av + esp;
  });
  return { d: d.join(''), ancho: cx - x - esp };
}

// Punto de una elipse; ángulo en grados, 0 = derecha, positivo hacia abajo (coordenadas SVG)
const P = (cx, cy, rx, ry, a) => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
const f2 = (n) => Math.round(n * 100) / 100;

/**
 * Dibuja la «e» solar.
 * cx, cy: centro; rx, ry: radios exteriores; sv/sh: grosor vertical/horizontal; o: opciones
 *  modo 'sol'  → medio disco lleno arriba (sol), barra = horizonte, arco abajo
 *  modo 'ojo'  → «e» completa en azul con el ojo superior relleno de sol
 */
function eSolar({ cx, cy, rx, ry, sv, sh, barra, hueco, modo, c, tOut = 24, tIn = 40, barraY = 0 }) {
  const rxi = rx - sv, ryi = ry - sh;
  const yb1 = cy + barraY - barra / 2, yb2 = cy + barraY + barra / 2; // borde superior e inferior de la barra
  const anchoEn = (y, a, b) => a * Math.sqrt(Math.max(0, 1 - ((y - cy) / b) ** 2));
  let s = '';
  // Parte inferior: arco desde la barra hasta el remate diagonal
  const xo = anchoEn(yb2, rx, ry), xi = anchoEn(yb2, rxi, ryi);
  const [ox, oy] = P(cx, cy, rx, ry, tOut), [ix, iy] = P(cx, cy, rxi, ryi, tIn);
  s += `<path d="M${f2(cx - xo)} ${f2(yb2)} A${rx} ${ry} 0 0 0 ${f2(ox)} ${f2(oy)} L${f2(ix)} ${f2(iy)} A${rxi} ${ryi} 0 0 1 ${f2(cx - xi)} ${f2(yb2)} Z" fill="${c.mar}"/>`;
  // Barra (horizonte): de borde a borde exterior
  const xbar = anchoEn(cy + barraY, rx, ry);
  s += `<path d="M${f2(cx - anchoEn(yb1, rx, ry))} ${f2(yb1)} H${f2(cx + anchoEn(yb1, rx, ry))} L${f2(cx + anchoEn(yb2, rx, ry))} ${f2(yb2)} H${f2(cx - anchoEn(yb2, rx, ry))} Z" fill="${c.mar}"/>`;
  if (modo === 'sol') {
    const ys = yb1 - hueco, xs = anchoEn(ys, rx, ry);
    s += `<path d="M${f2(cx - xs)} ${f2(ys)} A${rx} ${ry} 0 0 1 ${f2(cx + xs)} ${f2(ys)} Z" fill="${c.sol}"/>`;
  } else {
    // anillo superior azul + ojo de sol
    const xo1 = anchoEn(yb1, rx, ry), xi1 = anchoEn(yb1, rxi, ryi);
    s += `<path d="M${f2(cx - xo1)} ${f2(yb1)} A${rx} ${ry} 0 0 1 ${f2(cx + xo1)} ${f2(yb1)} H${f2(cx + xi1)} A${rxi} ${ryi} 0 0 0 ${f2(cx - xi1)} ${f2(yb1)} Z" fill="${c.mar}"/>`;
    s += `<path d="M${f2(cx - xi1)} ${f2(yb1)} A${rxi} ${ryi} 0 0 1 ${f2(cx + xi1)} ${f2(yb1)} Z" fill="${c.sol}"/>`;
  }
  return s;
}

// Parámetros de cada variante, en proporción a la altura de x (H)
const VAR = {
  'A1': { esc: 1.42, sv: 0.38, sh: 0.38, barra: 0.31, hueco: 0.075, modo: 'sol', tOut: 35, tIn: 35, barraY: -0.03 }, // la de ayer (aprox.)
  'C1': { esc: 1.0, modo: 'glifo', g: 'cupula', h: 0 },
  'C2': { esc: 1.0, modo: 'glifo', g: 'cupula', h: 38 },
  'C3': { esc: 1.14, modo: 'glifo', g: 'cupula', h: 38 },
  'B3': { esc: 1.0, modo: 'glifo', g: 'ojo', h: 0 },
};

// La «e» real de Schibsted 800 con el ojo relleno de sol. (x, base) = centro horizontal y línea base
let nClip = 0;
function eGlifo(x, base, tam, c, modo = 'ojo', hueco = 0) {
  const g = sch800.charToGlyph('e');
  const ancho = g.advanceWidth * tam / UPM;
  const dx = x - ancho / 2, k = tam / 1000;
  const d = trazo(g.getPath(0, 0, tam), dx, base);
  // Medidas del glifo a 1000 px: ojo x 212–407, y −425…−320; barra de −320 a −230
  const ojo = (col) => `<rect x="${f2(dx + 195 * k)}" y="${f2(base - 445 * k)}" width="${f2(230 * k)}" height="${f2(125 * k)}" fill="${col}"/>`;
  if (modo === 'ojo') return ojo(c.sol) + `<path d="${d}" fill="${c.mar}"/>`;
  // cúpula: todo lo que queda por encima de la barra es sol
  const id = `e${++nClip}`, yH = base - 320 * k;
  return `<defs><clipPath id="${id}a"><rect x="${f2(dx - 10)}" y="${f2(base - 700 * k)}" width="${f2(ancho + 20)}" height="${f2(700 * k - 320 * k - hueco * k)}"/></clipPath>` +
    `<clipPath id="${id}b"><rect x="${f2(dx - 10)}" y="${f2(yH)}" width="${f2(ancho + 20)}" height="${f2(400 * k)}"/></clipPath></defs>` +
    `<g clip-path="url(#${id}a)">${ojo(c.sol)}<path d="${d}" fill="${c.sol}"/></g>` +
    `<g clip-path="url(#${id}b)"><path d="${d}" fill="${c.mar}"/></g>`;
}


function logotipo(v, c, fondo) {
  const tam = 150, base = 128, H = XH / UPM * tam, ov = OV / UPM * tam;
  const p = VAR[v];
  const ry = (H / 2 + ov) * p.esc, rx = ry * (1115 / 1134);
  const cy = base + ov - ry;                // apoya en la línea base con su rebase
  const advE = sch800.charToGlyph('e').advanceWidth / UPM * tam * p.esc;
  const kernES = (sch800.getKerningValue(sch800.charToGlyph('e'), sch800.charToGlyph('s')) || 0) / UPM * tam;
  // con la «e» de la fuente se compone como una letra más; con la geométrica, a ojo
  const cx = p.modo === 'glifo' ? 8 + advE / 2 : 8 + rx;
  const izq = p.modo === 'glifo' ? 8 + advE + kernES - 2 + 50 / UPM * tam : cx + rx + 63 / UPM * tam * 1.2;
  const solar = texto(sch800, 'solar', izq - 50 / UPM * tam, base, tam, -2);
  const prov = texto(sch500, 'cantabria', 0, 0, 44, 0);
  const sol0 = texto(sch800, 'solar', 0, 0, tam, -2);
  const espC = 0.4;
  const cant = texto(sch500, 'cantabria', izq, base + 50, 44, espC);
  const w = Math.ceil(izq + solar.ancho + 10);
  const e = p.modo === 'glifo' ? eGlifo(cx, base, tam * p.esc, c, p.g, p.h) : eSolar({ cx, cy, rx, ry, sv: p.sv * H * p.esc, sh: p.sh * H * p.esc, barra: p.barra * H * p.esc, hueco: p.hueco * H * p.esc, modo: p.modo, c, tOut: p.tOut, tIn: p.tIn, barraY: p.barraY * H * p.esc });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 196" width="${w}" height="196">${fondo ? `<rect width="${w}" height="196" fill="${fondo}"/>` : ''}${e}<path d="${solar.d}" fill="${c.mar}"/><path d="${cant.d}" fill="${c.texto2}"/></svg>`;
}

function simbolo(v, c, lado, fondo, radioFondo = 0) {
  const p = VAR[v];
  // En el símbolo suelto la «e» ocupa casi todo el cuadro y se engorda un poco para tamaños pequeños
  const ry = lado * 0.40, rx = ry * (1115 / 1134);
  const k = lado <= 32 ? 1.12 : 1;
  const u = ry / 0.525; // altura de x equivalente
  if (p.modo === 'glifo') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado}" height="${lado}">${fondo ? `<rect width="${lado}" height="${lado}" rx="${radioFondo}" fill="${fondo}"/>` : ''}${eGlifo(lado / 2, lado / 2 + 0.2637 * (lado * 0.74 / 0.544), lado * 0.74 / 0.544, c, p.g, p.h)}</svg>`;
  const e = eSolar({ cx: lado / 2, cy: lado / 2, rx, ry, sv: p.sv * u * k, sh: p.sh * u * k, barra: p.barra * u * k, hueco: p.hueco * u, modo: p.modo, c, tOut: p.tOut, tIn: p.tIn, barraY: p.barraY * u });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" width="${lado}" height="${lado}">${fondo ? `<rect width="${lado}" height="${lado}" rx="${radioFondo}" fill="${fondo}"/>` : ''}${e}</svg>`;
}

const pos = { sol: '#F2A71B', mar: '#0F3B4C', texto2: '#3B6E7E' };
const neg = { sol: '#F2A71B', mar: '#FFFFFF', texto2: '#A9C9D3' };

const dir = process.argv[2] || 'variantes';
fs.mkdirSync(dir, { recursive: true });
for (const v of Object.keys(VAR)) {
  fs.writeFileSync(`${dir}/${v}-logotipo.svg`, logotipo(v, pos));
  fs.writeFileSync(`${dir}/${v}-logotipo-negativo.svg`, logotipo(v, neg, '#0F3B4C'));
  fs.writeFileSync(`${dir}/${v}-simbolo.svg`, simbolo(v, pos, 160));
  fs.writeFileSync(`${dir}/${v}-favicon.svg`, simbolo(v, pos, 32, '#FFFFFF', 6));
  fs.writeFileSync(`${dir}/${v}-app.svg`, simbolo(v, neg, 160, '#0F3B4C', 36));
}

// Hoja comparativa: cada variante en positivo, negativo, icono de app y favicon a 32 y 16 px reales
const filas = Object.keys(VAR).map((v, i) => {
  const y = 20 + i * 250;
  const L = fs.readFileSync(`${dir}/${v}-logotipo.svg`, 'utf8'), N = fs.readFileSync(`${dir}/${v}-logotipo-negativo.svg`, 'utf8');
  const A = fs.readFileSync(`${dir}/${v}-app.svg`, 'utf8'), F = fs.readFileSync(`${dir}/${v}-favicon.svg`, 'utf8');
  const cuerpo = (s) => s.replace(/<svg[^>]*>/, '').replace('</svg>', '');
  const wL = +L.match(/viewBox="0 0 (\d+)/)[1];
  return `<text x="20" y="${y + 14}" font-family="sans-serif" font-size="18" fill="#333">${v}</text>
  <g transform="translate(20 ${y + 24}) scale(${380 / wL})">${cuerpo(L)}</g>
  <g transform="translate(430 ${y + 24}) scale(${380 / wL})">${cuerpo(N)}</g>
  <g transform="translate(840 ${y + 30}) scale(0.9)">${cuerpo(A)}</g>
  <g transform="translate(1010 ${y + 60})">${cuerpo(F)}</g>
  <g transform="translate(1060 ${y + 68}) scale(0.5)">${cuerpo(F)}</g>`;
}).join('');
const hoja = `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="${20 + Object.keys(VAR).length * 250}"><rect width="100%" height="100%" fill="#E9EDEE"/>${filas}</svg>`;
fs.writeFileSync(`${dir}/hoja.png`, new Resvg(hoja, { fitTo: { mode: 'width', value: 1100 } }).render().asPng());
console.log('ok');
