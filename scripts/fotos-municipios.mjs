// Busca la foto de cada municipio en Wikidata (P18) y sus datos de licencia en Wikimedia Commons.
// Solo acepta licencias libres que permiten uso comercial: dominio público, CC0, CC BY y CC BY-SA.
// Uso: node scripts/fotos-municipios.mjs   → escribe scripts/cache/fotos-municipios.json (sin descargar)
import fs from 'node:fs';
const UA = { 'User-Agent': 'esolarcantabria/1.0 (hola@esolarcantabria.es)' };
const municipios = JSON.parse(fs.readFileSync('src/data/municipios.json', 'utf8'));
const q = `SELECT ?ine ?img WHERE { ?m wdt:P772 ?ine; wdt:P18 ?img. FILTER(STRSTARTS(?ine, "39") && STRLEN(?ine) = 5) }`;
const r = await (await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), { headers: UA })).json();
const porIne = {};
for (const b of r.results.bindings) porIne[b.ine.value] ??= decodeURIComponent(b.img.value.split('/').pop());
const salida = {};
const libre = /^(cc0|cc[- ]by(-sa)?[- ][0-9.]+( [a-z]{2})?|public domain|pd.*)$/i;
for (const m of municipios) {
  const archivo = porIne[m.ine];
  if (!archivo) continue;
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1600&titles=${encodeURIComponent('File:' + archivo)}`;
  const j = await (await fetch(u, { headers: UA })).json();
  const info = Object.values(j.query.pages)[0].imageinfo?.[0];
  if (!info) continue;
  const md = info.extmetadata;
  const licencia = (md.LicenseShortName?.value || '').trim();
  const autor = (md.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
  salida[m.slug] = {
    archivo, licencia, autor: autor || 'Autor desconocido',
    licenciaUrl: md.LicenseUrl?.value || '', pagina: info.descriptionurl,
    url: info.thumburl, ancho: info.width, alto: info.height,
    valida: libre.test(licencia),
  };
}
fs.writeFileSync('scripts/cache/fotos-municipios.json', JSON.stringify(salida, null, 1));
const v = Object.values(salida);
console.log(`${v.length} con foto, ${v.filter((x) => x.valida).length} con licencia válida`);
console.log([...new Set(v.map((x) => x.licencia))].join(' | '));
