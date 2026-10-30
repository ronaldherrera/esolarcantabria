# eSolar Cantabria

Web de captación de una **red de instaladores** de placas solares en Cantabria (no es una instaladora). Astro 7 estático + `public/send-mail.php` (PHPMailer) en Hostinger.

- Dev: `npx astro dev --port 4330`. Build: `npm run build` → `dist/`. Despliegue: `docs/DESPLIEGUE.md`.
- Marca «Sol del norte» (aprobada el 30/10/2026): `marca/propuesta-marca.html`. Generador del logotipo en `marca/herramientas-logo/`. Tokens en `src/styles/global.css`.
- Datos de los 102 municipios (Wikidata + PVGIS) en `src/data/municipios.json`, generados con `scripts/datos-municipios.mjs`.
- Cálculos compartidos en `src/lib/solar.js`. Supuestos de precio en `SUPUESTOS`.
- Blog: `src/content/blog/*.md`, cada artículo con `fuentes` oficiales e `imagen` (clave de `src/data/fotos.json`).
- Fotos: solo Wikimedia Commons con licencia libre y crédito visible (componente `Foto.astro`, página `/creditos/`). Nunca presentar una foto ilustrativa como instalación de la red.

## Reglas del proyecto

- **Solo datos comprobados.** Ayudas, normativa e IBI salen de `docs/fuentes.md`. Bonificaciones del IBI: solo las de `src/data/ibi.js`, con enlace a la ordenanza. Nada de plazos («48 h») ni cifras que el negocio no haya confirmado.
- Nunca nombrar la gran superficie donde trabaja el socio vendedor.
- Siempre «un instalador de la red», nunca «nuestros técnicos».
- La contraseña SMTP no va en el repositorio: `config-correo.php` fuera de `public_html`.
- Cifras con punto de millar (`useGrouping: 'always'`) y espacio de no separación antes de €, % y kWh.
- Las cifras del texto se dibujan con Schibsted (fuente «Cifras» en `global.css`), porque el cero de Atkinson lleva barra.
