// Genera src/data/municipios.json: los 102 municipios de Cantabria con su producción solar (PVGIS).
// Uso: npm run datos            → usa la caché de scripts/cache si existe
//      npm run datos -- --nuevo → vuelve a consultar Wikidata y PVGIS
import fs from 'node:fs';

const NUEVO = process.argv.includes('--nuevo');
const CACHE = 'scripts/cache';

async function municipios() {
  const ruta = `${CACHE}/municipios-wd.json`;
  if (!NUEVO && fs.existsSync(ruta)) return JSON.parse(fs.readFileSync(ruta, 'utf8'));
  const q = `SELECT ?m ?mLabel ?ine ?coord (MAX(?pop) AS ?poblacion) WHERE {
    ?m wdt:P772 ?ine; wdt:P625 ?coord. FILTER(STRSTARTS(?ine, "39") && STRLEN(?ine) = 5)
    OPTIONAL { ?m wdt:P1082 ?pop. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
  } GROUP BY ?m ?mLabel ?ine ?coord`;
  const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), { headers: { 'User-Agent': 'esolarcantabria/1.0 (hola@esolarcantabria.es)' } });
  const filas = (await r.json()).results.bindings.map((b) => {
    const [lon, lat] = b.coord.value.match(/Point\(([-\d.]+) ([-\d.]+)\)/).slice(1).map(Number);
    return { nombre: b.mLabel.value, ine: b.ine.value, lat, lon, poblacion: b.poblacion ? Math.round(+b.poblacion.value) : null };
  });
  const unicos = Object.values(Object.fromEntries(filas.map((x) => [x.ine, x])));
  fs.writeFileSync(ruta, JSON.stringify(unicos, null, 1));
  return unicos;
}

async function pvgis(lista) {
  const ruta = `${CACHE}/pvgis.json`;
  const sal = !NUEVO && fs.existsSync(ruta) ? JSON.parse(fs.readFileSync(ruta, 'utf8')) : {};
  for (const x of lista) {
    if (sal[x.ine]) continue;
    const u = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${x.lat}&lon=${x.lon}&peakpower=1&loss=14&optimalangles=1&outputformat=json`;
    const j = await (await fetch(u)).json();
    const f = j.outputs.monthly.fixed;
    sal[x.ine] = {
      anual: Math.round(j.outputs.totals.fixed.E_y),
      meses: f.map((k) => Math.round(k.E_m * 10) / 10),
      irradiacion: Math.round(j.outputs.totals.fixed['H(i)_y']),
      inclinacion: j.inputs.mounting_system.fixed.slope.value,
      azimut: j.inputs.mounting_system.fixed.azimuth.value,
      altitud: j.inputs.location.elevation,
    };
    fs.writeFileSync(ruta, JSON.stringify(sal));
  }
  return sal;
}

const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const distancia = (a, b) => {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const lista = await municipios();
const datos = await pvgis(lista);
const salida = lista.map((m) => ({ ...m, slug: slug(m.nombre), ...datos[m.ine] }))
  .sort((a, b) => (b.poblacion || 0) - (a.poblacion || 0));
// Puesto en producción dentro de Cantabria y vecinos más cercanos (para enlazar entre páginas)
const orden = [...salida].sort((a, b) => b.anual - a.anual);
for (const m of salida) {
  m.puesto = orden.findIndex((x) => x.ine === m.ine) + 1;
  m.vecinos = salida.filter((x) => x.ine !== m.ine)
    .map((x) => ({ slug: x.slug, nombre: x.nombre, km: Math.round(distancia(m, x)) }))
    .sort((a, b) => a.km - b.km).slice(0, 5);
}
fs.writeFileSync('src/data/municipios.json', JSON.stringify(salida, null, 1));
console.log(`${salida.length} municipios → src/data/municipios.json`);
