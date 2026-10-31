# eSolar Cantabria

**Web de captación para una red de instaladores de placas solares en Cantabria.** El visitante calcula cuánto produciría una instalación en su municipio, cuánto ahorraría y qué ayudas tiene, y pide presupuesto. La solicitud llega a un instalador de la red de su zona.

🌐 **[esolarcantabria.es](https://esolarcantabria.es)**

<!-- Añadir aquí 2–3 capturas: portada, página de un municipio y calculadora de ahorro -->
<!-- ![eSolar Cantabria](docs/capturas/portada.png) -->

---

## Qué tiene de interesante

| | |
| --- | --- |
| **102 municipios con datos reales** | Una página por municipio de Cantabria con su producción solar mes a mes. Un script cruza Wikidata (municipios, coordenadas y población) con la API de PVGIS de la Comisión Europea y guarda el resultado en `src/data/municipios.json`, con caché para no repetir consultas. |
| **6 calculadoras** | Ahorro, número de placas, batería, compensación de excedentes, deducción del IRPF y aerotermia. Todas usan la misma lógica (`src/lib/solar.js`), que también genera las cifras de las páginas de municipio en el build. |
| **Contenido con fuentes** | 25 artículos con sus fuentes oficiales enlazadas. Las bonificaciones del IBI solo aparecen si se ha comprobado la ordenanza del ayuntamiento. |
| **Marca propia** | Identidad «Sol del norte» diseñada desde cero, con un generador del logotipo por código (`marca/herramientas-logo/`). |
| **Formulario por SMTP** | PHP con PHPMailer en el hosting. La contraseña está en un archivo de configuración fuera de la carpeta pública, nunca en el repositorio. |
| **Despliegue con control** | GitHub Actions compila, comprueba que no haya enlaces internos rotos y solo entonces sube los cambios por rsync/SSH. |

## Stack

- **Astro 7** con salida estática (~150 páginas) y sitemap
- **JavaScript** sin framework en el cliente para las calculadoras
- **PHP + PHPMailer** para el formulario
- **GitHub Actions** → Hostinger por rsync/SSH
- Fotos de Wikimedia Commons con licencia libre y crédito visible (`/creditos/`)

## Estructura

```
src/
  pages/            portada, calculadoras, placas-solares/[municipio], blog, legales
  components/       formulario, gráfico mensual, campo de municipio, foto con crédito
  lib/solar.js      cálculos compartidos (servidor y navegador)
  data/             municipios, calculadoras, IBI, fotos
  content/blog/     artículos en Markdown con sus fuentes
scripts/            datos de municipios (Wikidata + PVGIS), fotos, imágenes, enlaces
public/send-mail.php
```

## Arrancar en local

```bash
npm install
npm run dev        # servidor de desarrollo
npm run datos      # regenera los datos de los municipios
npm run build      # web estática en dist/
npm run enlaces    # comprueba los enlaces internos
```

---

Diseñado y desarrollado por **Ronald Herrera** · [ronaldherrera.es](https://ronaldherrera.es) · [LinkedIn](https://linkedin.com/in/ronald-sc-herrera)
