# Fuentes comprobadas

Cada dato de normativa, ayudas o producción que aparece en la web sale de aquí. Si cambia una norma, se cambia aquí y en `src/data/`.

## Producción solar por municipio

- **PVGIS 5.3** (Comisión Europea, Centro Común de Investigación). API `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc`, base de radiación PVGIS-SARAH3 (2005–2023), horizonte calculado con el relieve, silicio cristalino, 14 % de pérdidas, inclinación y orientación óptimas, 1 kWp.
- Coordenadas y población de los 102 municipios: **Wikidata** (código INE, P772). Consulta y datos en `scripts/`.
- Consultado el 30/10/2026. Referencias: Santander 1.207 kWh/kWp·año, Berlín 1.053, Múnich 1.139.

## Deducciones del IRPF (comprobado en el BOE el 30/10/2026)

- **Real Decreto-ley 7/2026, de 20 de marzo** (BOE-A-2026-6544, publicado el 21/03/2026), art. 36: https://www.boe.es/buscar/doc.php?id=BOE-A-2026-6544
  - **Nueva disposición adicional 62.ª de la Ley 35/2006**: deducción del **10 %** de lo pagado del 1/1 al 31/12/2026 por instalar autoconsumo renovable (puede incluir baterías) en un inmueble propio. Para propietarios de viviendas en **edificios de uso predominante residencial**, el **20 %**. **Base máxima de 5.000 € al año.** No son compatibles entre sí ni con la DA 50.ª para la misma instalación. Pago por tarjeta, transferencia, cheque nominativo o ingreso en cuenta (nunca en efectivo). Hay que descontar las subvenciones. Se aplica en el ejercicio en que termina la instalación (como muy tarde, 2026). **Exige el CIE** (Certificado de Instalación Eléctrica). No vale si la instalación está afecta a una actividad económica.
  - **DA 50.ª** (eficiencia energética de viviendas, 20 % y 40 %): prorrogada hasta el 31/12/2026. Rehabilitación de edificios residenciales (60 %): hasta el 31/12/2027.
- Nota de la Agencia Tributaria del 23/03/2026: https://sede.agenciatributaria.gob.es/Sede/todas-noticias/2026/marzo/23/medidas-materia-tributacion.html
- El mismo RDL amplía la distancia del **autoconsumo colectivo** a través de la red hasta **5.000 m** (fotovoltaica de hasta 5 MW), permite combinar modalidades y crea la figura del gestor de autoconsumo.

## Licencia de obras en Cantabria

- **Ley de Cantabria 5/2022, de 15 de julio**, de Ordenación del Territorio y Urbanismo (BOE-A-2022-13844), **art. 234.2.e**: las placas solares o fotovoltaicas de autoconsumo de **menos de 100 kW** se tramitan con **declaración responsable** en cualquier clase de suelo, **salvo** parcelas o edificios con protección de patrimonio cultural. Art. 227.d: en suelo rústico, también por debajo de 100 kW. https://www.boe.es/buscar/act.php?id=BOE-A-2022-13844

## IBI por municipio (solo lo comprobado en la ordenanza)

- **Santander**: Ordenanza fiscal 1-I (IBI), art. sobre bonificaciones, apdo. 6. El **50 % de la cuota durante un año y una sola vez**, **solo para solar térmica** (aporte mínimo del 60 % del agua caliente sanitaria). **No bonifica la fotovoltaica.** PDF: https://www.santander.es/system/files/1-i_ibi_2025.pdf (revisado el 30/10/2026).
- **Torrelavega**: según la prensa local (octubre de 2026), la bonificación del 50 % es para **solar térmica**. Las ordenanzas de 2027, aprobadas de forma provisional, la amplían de 1 a 3 años. Falta comprobarlo en el texto publicado en el BOC.
- **Resto de municipios: sin comprobar.** La web no publica porcentajes de los municipios no comprobados.
- La web anterior anunciaba «Santander 50 % IBI», «Torrelavega 50 %», «Castro Urdiales 50 % durante 5 años» y «Camargo 30 %» para placas. Al menos lo de Santander era falso para la fotovoltaica. Se ha retirado.

## Pendiente de comprobar con datos reales del negocio

- Precio orientativo por kWp instalado en Cantabria (la calculadora usa 1.300 €/kWp, que se puede cambiar): confirmarlo con los instaladores de la red.
- Precio de compensación de excedentes y de la energía (las calculadoras usan 0,06 y 0,20 €/kWh, que se pueden cambiar).

## Fotos

- Todas de **Wikimedia Commons**, solo con licencias que permiten uso comercial (dominio público, CC0, CC BY, CC BY-SA). Crédito visible bajo cada foto y lista completa en `/creditos/`.
- Municipios: la imagen principal (P18) de cada municipio en Wikidata (`scripts/fotos-municipios.mjs`). Descartadas a ojo por mala calidad: Ampuero, Polanco, Santiurde de Toranzo, Penagos, Camaleño y Rionansa (`scripts/cache/fotos-descartadas.json`); esas páginas salen sin foto.
- Temas (placas, baterías, bomba de calor, costa): elegidas a mano entre candidatas de Commons (`scripts/buscar-fotos-commons.mjs`). Son ilustrativas, **no son instalaciones de la red**, y así se indica.
- Descarga y optimización a WebP: `node scripts/descargar-fotos.mjs` (escribe `src/data/fotos.json`).

## Otras deducciones del RDL 7/2026 (comprobadas en el BOE el 30/10/2026)

- **Punto de recarga** (DA 58.ª Ley 35/2006, apdo. 3): 15 % de lo pagado hasta el 31/12/2026 por instalar un sistema de recarga en un inmueble propio, base máxima de 4.000 € al año, por medios bancarios, no afecto a actividad.
- **Vehículo eléctrico** (DA 58.ª, apdo. 1): 15 % del valor de adquisición, con los requisitos de categoría, modelo subvencionable y precio máximo; matriculado antes del 31/12/2026.
- **Impuesto sobre Sociedades** (art. 37, DA 17.ª LIS): libertad de amortización para el autoconsumo renovable que sustituya instalaciones fósiles y entre en funcionamiento en 2023–2026; mantener la plantilla media durante 24 meses; máximo de 500.000 €; no se aplica a instalaciones obligatorias por el CTE ni a los edificios.
- **Desistimiento** en contratos fuera del establecimiento: 14 días naturales (RDLeg 1/2007, BOE-A-2007-20555).

## Datos de orientación (PVGIS, Santander, 1 kWp, 14 % de pérdidas)

Sur a 37°: 1.207 kWh; a 15°: 1.143; a 25°: 1.188; a 45°: 1.198; a 60°: 1.133; plano: 1.027; sureste a 30°: 1.130; suroeste a 30°: 1.140; este a 30°: 965; oeste a 30°: 978; norte a 30°: 691.
