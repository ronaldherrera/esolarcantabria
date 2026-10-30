// Foto de perfil animada (Google, redes): la «e» de eSolar con el sol que se pone en el horizonte y vuelve a salir.
// El primer fotograma es el logotipo completo, porque algunas plataformas solo muestran ese.
// Uso: node scripts/avatar-animado.mjs   (necesita Python con Pillow para unir los fotogramas)
// Salida: marca/avatar/foto-perfil-animada.gif y marca/avatar/foto-perfil.png
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const LADO = 512, FPS = 20, FOTOGRAMAS = 72; // 3,6 s de ciclo
const AZUL = '#0F3B4C', SOL = '#F2A71B', BLANCO = '#FFFFFF';

const b = fs.readFileSync('marca/herramientas-logo/fuentes/schibsted-800.woff');
const fuente = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
const glifo = fuente.charToGlyph('e');

// La «e» ocupa el 56 % del cuadro: cabe entera en el recorte circular de los avatares
const T = (LADO * 0.56) / 0.544;           // tamaño de fuente para ese ancho de tinta
const k = T / 1000;                         // medidas del glifo tomadas a 1000 px (marca/herramientas-logo)
const ancho = (glifo.advanceWidth * T) / 2048;
const dx = LADO / 2 - ancho / 2;
const base = LADO / 2 + 0.2637 * T;         // centra la tinta en vertical
const yHorizonte = base - 320 * k;          // borde superior de la barra de la «e»
const hueco = 38 * k;                       // línea blanca del horizonte (variante C2)
const alturaSol = (540 - 320) * k + hueco;  // lo que hay que bajar el sol para esconderlo del todo

const trazo = (dy = 0) => glifo.getPath(0, 0, T).commands.map((c) => {
  const p = c.type === 'Z' ? [] : c.type === 'Q' ? [[c.x1, c.y1], [c.x, c.y]] : c.type === 'C' ? [[c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]] : [[c.x, c.y]];
  return c.type + p.map(([x, y]) => `${(x + dx).toFixed(2)} ${(y + base + dy).toFixed(2)}`).join(' ');
}).join('');

const suave = (t) => t * t * (3 - 2 * t);
// Línea de tiempo: quieto con el sol arriba, se pone, un instante sin sol, sale y vuelve a quedarse quieto
function desplazamiento(f) {
  if (f < 22) return 0;
  if (f < 40) return alturaSol * suave((f - 22) / 18);
  if (f < 44) return alturaSol;
  if (f < 66) return alturaSol * (1 - suave((f - 44) / 22));
  return 0;
}

function fotograma(f) {
  const dy = desplazamiento(f);
  const ojo = `<rect x="${(dx + 195 * k).toFixed(2)}" y="${(base - 445 * k + dy).toFixed(2)}" width="${(230 * k).toFixed(2)}" height="${(125 * k).toFixed(2)}" fill="${SOL}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO}" height="${LADO}" viewBox="0 0 ${LADO} ${LADO}">
  <defs>
    <clipPath id="arriba"><rect x="0" y="0" width="${LADO}" height="${(yHorizonte - hueco).toFixed(2)}"/></clipPath>
    <clipPath id="abajo"><rect x="0" y="${yHorizonte.toFixed(2)}" width="${LADO}" height="${LADO}"/></clipPath>
  </defs>
  <rect width="${LADO}" height="${LADO}" fill="${AZUL}"/>
  <g clip-path="url(#arriba)">${ojo}<path d="${trazo(dy)}" fill="${SOL}"/></g>
  <g clip-path="url(#abajo)"><path d="${trazo()}" fill="${BLANCO}"/></g>
</svg>`;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'esolar-avatar-'));
for (let f = 0; f < FOTOGRAMAS; f++) {
  fs.writeFileSync(path.join(tmp, `${String(f).padStart(3, '0')}.png`), new Resvg(fotograma(f)).render().asPng());
}
fs.mkdirSync('marca/avatar', { recursive: true });
fs.copyFileSync(path.join(tmp, '000.png'), 'marca/avatar/foto-perfil.png');
execFileSync('python', ['-c', `
import glob, sys
from PIL import Image
fs = sorted(glob.glob(sys.argv[1] + '/*.png'))
im = [Image.open(f).convert('P', palette=Image.ADAPTIVE, colors=64) for f in fs]
im[0].save(sys.argv[2], save_all=True, append_images=im[1:], duration=${1000 / FPS}, loop=0, optimize=True, disposal=1)
`, tmp, 'marca/avatar/foto-perfil-animada.gif']);
fs.rmSync(tmp, { recursive: true, force: true });
console.log('marca/avatar/foto-perfil-animada.gif y marca/avatar/foto-perfil.png');
