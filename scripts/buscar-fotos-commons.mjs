// Busca candidatas en Wikimedia Commons para revisarlas a mano (licencias libres con uso comercial).
// Uso: node scripts/buscar-fotos-commons.mjs "consulta" [n]  → añade a scripts/cache/candidatas.json
import fs from 'node:fs';
const UA = { 'User-Agent': 'esolarcantabria/1.0 (hola@esolarcantabria.es)' };
const [consulta, n = 16] = process.argv.slice(2);
const libre = /^(cc0|cc[- ]by(-sa)?[- ][0-9.]+( [a-z]{2})?|public domain|pd.*)$/i;
const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=${n}&gsrsearch=${encodeURIComponent(consulta + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600`;
const j = await (await fetch(u, { headers: UA })).json();
const ruta = 'scripts/cache/candidatas.json';
const todas = fs.existsSync(ruta) ? JSON.parse(fs.readFileSync(ruta, 'utf8')) : {};
let n2 = 0;
for (const p of Object.values(j.query?.pages ?? {})) {
  const i = p.imageinfo?.[0]; if (!i || i.width < 1400) continue;
  const md = i.extmetadata, lic = (md.LicenseShortName?.value || '').trim();
  if (!libre.test(lic)) continue;
  const id = p.title.replace('File:', '');
  todas[id] = { consulta, titulo: id, url: i.thumburl, autor: (md.Artist?.value || '').replace(/<[^>]+>/g, '').trim() || 'Autor desconocido', licencia: lic, licenciaUrl: md.LicenseUrl?.value || '', pagina: i.descriptionurl, ancho: i.width, alto: i.height, valida: true };
  n2++;
}
fs.writeFileSync(ruta, JSON.stringify(todas, null, 1));
console.log(consulta, n2, '→ total', Object.keys(todas).length);
