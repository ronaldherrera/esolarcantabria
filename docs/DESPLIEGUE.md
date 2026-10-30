# Despliegue en Hostinger

La web es estática (Astro) más un único PHP para los formularios. **Se despliega sola con cada push a `main`:**

1. GitHub Actions (`.github/workflows/publicar.yml`) instala, compila (`npm run build`) y deja el contenido de `dist/` en la rama **`hostinger`**.
2. El webhook de Hostinger recibe el push y hPanel → Git despliega la rama **`hostinger`** en `public_html`.

La rama `main` tiene el código fuente; la rama `hostinger` solo tiene la web compilada. **Nunca hay que configurar Hostinger con la rama `main`**: copiaría el código sin compilar y la web se caería.

## Contraseña del correo (una sola vez)

En el administrador de archivos de Hostinger, crea `config-correo.php` **una carpeta por encima de `public_html`** (junto a ella, no dentro). Copia `docs/config-correo.ejemplo.php` y pon la contraseña real del buzón `hola@esolarcantabria.es`. No va nunca en git. Sin este archivo el formulario no envía nada.

## Estado (30/10/2026)

Hecho: despliegue Git de Hostinger conectado con GitHub (rama `hostinger` → `public_html`, implementación automática activada). `config-correo.php` está en la raíz del dominio, junto a `public_html`; la contraseña ya está puesta y las solicitudes van solo a hola@esolarcantabria.es. La web antigua se movió a la papelera del administrador de archivos (`.trash/web-antigua`), recuperable hasta que se vacíe.

## Paso de la web antigua a la nueva (una sola vez, ya hecho)

1. **hPanel → Avanzado → Git:** borra el despliegue actual (el de la rama `main`). Así un push no publica el código sin compilar.
2. Haz el commit y el `git push` de `main`. En GitHub → Actions, espera a que «Publicar web» termine en verde: habrá creado la rama `hostinger`.
3. **Copia de seguridad** de `public_html` y **vacíala** (Hostinger pide la carpeta vacía para crear un despliegue Git). `config-correo.php` está fuera y no se toca.
4. **hPanel → Git → Crear:** repositorio `https://github.com/ronaldherrera/esolarcantabria.git`, rama **`hostinger`**, directorio vacío (`public_html`). Despliega.
5. Activa el **despliegue automático** y comprueba que el webhook que indica Hostinger está en GitHub → Settings → Webhooks.
6. Comprueba la web y prueba el formulario.

## Si algo falla

- Plan B manual: `npm run build` y subir el contenido de `dist/` a `public_html` (incluidos `.htaccess` y `_lib/.htaccess`).
- Volver a publicar sin cambios: GitHub → Actions → «Publicar web» → Run workflow.

## Datos

- `npm run datos`: regenera `src/data/municipios.json` desde la caché (`scripts/cache/`). Con `-- --nuevo` vuelve a consultar Wikidata y PVGIS.
- `node scripts/descargar-fotos.mjs`: fotos y créditos (`src/data/fotos.json`).
- `node scripts/generar-imagenes.mjs`: iconos, imagen para compartir y logotipo de los correos.
- `node scripts/cifras-blog.mjs`: cifras que citan los artículos, para revisarlas si cambian los datos.
