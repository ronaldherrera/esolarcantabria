// Comprueba que ningún enlace o imagen interna de dist/ apunta a algo que no existe.
// Uso: npm run enlaces (después de npm run build). Sale con error si hay rotos.
import fs from 'node:fs';
import path from 'node:path';

const archivos = [];
(function recorrer(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) recorrer(p);
    else if (p.endsWith('.html')) archivos.push(p);
  }
})('dist');

const rotos = new Map();
for (const f of archivos) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const url = m[1];
    let destino = path.join('dist', decodeURI(url));
    if (url.endsWith('/')) destino = path.join(destino, 'index.html');
    if (!fs.existsSync(destino)) rotos.set(url, [...(rotos.get(url) ?? []), path.relative('dist', f)]);
  }
}
if (rotos.size) {
  for (const [url, paginas] of rotos) console.error(`Roto: ${url} (en ${paginas.slice(0, 3).join(', ')})`);
  process.exit(1);
}
console.log(`${archivos.length} páginas, ningún enlace interno roto`);
