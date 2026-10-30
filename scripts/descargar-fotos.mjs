// Descarga y optimiza las fotos (WebP en 1400 y 640 px) y escribe los créditos en src/data/fotos.json.
// Lee scripts/cache/fotos-municipios.json (municipios) y scripts/cache/fotos-temas.json (temas), si existen.
// Las fotos de scripts/cache/fotos-descartadas.json no se usan.
import fs from 'node:fs';
import sharp from 'sharp';
const UA = { 'User-Agent': 'esolarcantabria/1.0 (hola@esolarcantabria.es)' };
const leer = (r) => (fs.existsSync(r) ? JSON.parse(fs.readFileSync(r, 'utf8')) : {});
const descartadas = new Set(leer('scripts/cache/fotos-descartadas.json').claves ?? []);
const creditos = {};
const grupos = { municipios: leer('scripts/cache/fotos-municipios.json'), temas: leer('scripts/cache/fotos-temas.json') };
for (const [grupo, fotos] of Object.entries(grupos)) {
  fs.mkdirSync(`public/fotos/${grupo}`, { recursive: true });
  for (const [clave, f] of Object.entries(fotos)) {
    if (!f.valida || descartadas.has(`${grupo}/${clave}`)) continue;
    const destino = `public/fotos/${grupo}/${clave}`;
    if (!fs.existsSync(`${destino}.webp`)) {
      const r = await fetch(f.url, { headers: UA });
      if (!r.ok) { console.log('fallo', clave, r.status); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      await sharp(buf).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 70 }).toFile(`${destino}.webp`);
      await sharp(buf).rotate().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 68 }).toFile(`${destino}-640.webp`);
      await new Promise((ok) => setTimeout(ok, 300));
    }
    const { width, height } = await sharp(`${destino}.webp`).metadata();
    // Autor: primera línea, sin el usuario entre paréntesis ni notas añadidas
    const autor = f.autor.split('\n')[0].replace(/\s*\(.*?\)\s*$/, '').trim().slice(0, 80);
    const titulo = (f.titulo ?? f.archivo ?? '').replace(/\.[a-z]+$/i, '').replace(/[_]+/g, ' ').trim();
    creditos[`${grupo}/${clave}`] = { src: `/fotos/${grupo}/${clave}.webp`, src640: `/fotos/${grupo}/${clave}-640.webp`, ancho: width, alto: height, autor, licencia: f.licencia, licenciaUrl: f.licenciaUrl, pagina: f.pagina, titulo };
  }
}
fs.writeFileSync('src/data/fotos.json', JSON.stringify(creditos, null, 1));
console.log(Object.keys(creditos).length, 'fotos');
