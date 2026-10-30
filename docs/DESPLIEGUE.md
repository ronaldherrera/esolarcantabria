# Despliegue en Hostinger

Igual que Tankily: **se despliega solo con cada push a `main`.** La acción de GitHub (`.github/workflows/deploy.yml`) instala, compila (`npm run build`), comprueba que no haya enlaces internos rotos (`npm run enlaces`) y sube `dist/` por **SSH con rsync** a `domains/esolarcantabria.es/public_html`. Solo sube lo que cambia y borra del servidor lo que ya no existe. Si la compilación o la comprobación de enlaces fallan, no se publica nada.

## Secretos de GitHub (esolarcantabria → Settings → Secrets and variables → Actions)

Los mismos que Tankily, porque es la misma cuenta de Hostinger: `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SSH_USER`, `SSH_HOST` y `SSH_PORT`. Además, `SSH_RUTA` = `domains/esolarcantabria.es/public_html`.

## Contraseña del correo

`config-correo.php` está en la raíz del dominio, **fuera de `public_html`**, así que rsync no lo toca. Las solicitudes van solo a hola@esolarcantabria.es. No va nunca en git. Plantilla: `docs/config-correo.ejemplo.php`.

## Volver a publicar sin cambios

GitHub → Actions → «Deploy eSolar Cantabria to Hostinger» → Run workflow.

## Plan B manual

`npm run build` y subir el contenido de `dist/` a `public_html` (incluidos `.htaccess` y `_lib/.htaccess`).

## Después de un cambio grande

La web tiene la CDN de Hostinger activada: hPanel → Panel → Caché → «Borrar caché».

## Historia

El 30/10/2026 se publicó primero con el despliegue Git de Hostinger (rama `hostinger`) y ese mismo día se pasó a rsync por SSH, como el resto de proyectos. La web antigua quedó en la papelera del administrador de archivos (`.trash/web-antigua`).

## Datos

- `npm run datos`: regenera `src/data/municipios.json` desde la caché (`scripts/cache/`). Con `-- --nuevo` vuelve a consultar Wikidata y PVGIS.
- `node scripts/descargar-fotos.mjs`: fotos y créditos (`src/data/fotos.json`).
- `node scripts/generar-imagenes.mjs`: iconos, imagen para compartir y logotipo de los correos.
- `node scripts/cifras-blog.mjs`: cifras que citan los artículos, para revisarlas si cambian los datos.
