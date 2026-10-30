// Genera los PNG de marca (iconos de app, apple-touch-icon e imagen para compartir) a partir de los SVG de public/marca.
// Uso: node scripts/generar-imagenes.mjs
import fs from 'node:fs';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const png = (svg, ancho) => new Resvg(svg, { fitTo: { mode: 'width', value: ancho } }).render().asPng();
const icono = fs.readFileSync('public/marca/icono-app.svg', 'utf8');

// Iconos cuadrados (el SVG del icono ya trae el fondo azul con esquinas redondeadas; para iOS va a sangre)
const iconoSangre = icono.replace(/rx="[\d.]+"/, 'rx="0"');
fs.writeFileSync('public/apple-touch-icon.png', png(iconoSangre, 180));
fs.writeFileSync('public/marca/icono-192.png', png(iconoSangre, 192));
fs.writeFileSync('public/marca/icono-512.png', png(iconoSangre, 512));

// Imagen para compartir (1200×630): logotipo, frase y la producción mensual de Santander
const b = fs.readFileSync('marca/herramientas-logo/fuentes/schibsted-800.woff');
const fuente = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
const linea = (txt, x, y, tam) => {
  let cx = x; let d = '';
  for (const ch of txt) {
    const g = fuente.charToGlyph(ch);
    d += g.getPath(0, 0, tam).commands.map((c) => {
      const p = c.type === 'Z' ? [] : c.type === 'Q' ? [[c.x1, c.y1], [c.x, c.y]] : c.type === 'C' ? [[c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]] : [[c.x, c.y]];
      return c.type + p.map(([a, b2]) => `${(a + cx).toFixed(1)} ${(b2 + y).toFixed(1)}`).join(' ');
    }).join('');
    cx += g.advanceWidth * tam / fuente.unitsPerEm;
  }
  return d;
};
const municipios = JSON.parse(fs.readFileSync('src/data/municipios.json', 'utf8'));
const stdr = municipios.find((m) => m.slug === 'santander');
const max = 140, base = 560, alto = 190, x0 = 700, anchoB = 34, hueco = 8;
const barras = stdr.meses.map((v, i) => `<rect x="${x0 + i * (anchoB + hueco)}" y="${base - v / max * alto}" width="${anchoB}" height="${v / max * alto}" rx="5" fill="#F2A71B"/>`).join('');
const logo = fs.readFileSync('public/marca/logotipo-negativo.svg', 'utf8').replace(/<svg[^>]*>/, '').replace('</svg>', '');
const compartir = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#0F3B4C"/>
<g transform="translate(70 60) scale(0.72)">${logo}</g>
<path d="${linea('En Cantabria hay', 70, 330, 66)}" fill="#fff"/>
<path d="${linea('sol de sobra para', 70, 405, 66)}" fill="#fff"/>
<path d="${linea('tus placas', 70, 480, 66)}" fill="#fff"/>
${barras}
<path d="${linea(`${stdr.anual.toLocaleString('es-ES', { useGrouping: 'always' })} kWh por kWp al año en Santander`, 700, 600, 24)}" fill="#A9C9D3"/>
</svg>`;
fs.writeFileSync('public/compartir.png', png(compartir, 1200));
console.log('Imágenes generadas');

// Logotipo en PNG para los correos (los clientes de correo no muestran SVG)
fs.mkdirSync('public/correo', { recursive: true });
fs.writeFileSync('public/correo/logotipo-negativo.png', png(fs.readFileSync('public/marca/logotipo-negativo.svg', 'utf8'), 440));
console.log('Logotipo de correo generado');

// favicon.ico (16, 32 y 48 px) y PNG de 48 y 96 px: Google y algunos navegadores los piden además del SVG
const favicon = fs.readFileSync('public/favicon.svg', 'utf8');
for (const t of [16, 32, 48, 96]) fs.writeFileSync(`public/marca/favicon-${t}.png`, png(favicon, t));
const { execFileSync } = await import('node:child_process');
execFileSync('python', ['-c', `
from PIL import Image
im = Image.open('public/marca/favicon-48.png').convert('RGBA')
im.save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
`]);
console.log('favicon.ico y favicon-*.png generados');
