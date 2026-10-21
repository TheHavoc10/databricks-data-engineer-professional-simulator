# Databricks Data Engineer Professional — Learning Campus

Web estática interactiva, en español, para preparar **Databricks Certified Data Engineer Professional** (guía del **9 de octubre de 2026**).

**No es una web oficial ni está afiliada a Databricks**. No incluye material de exámenes filtrado ni pretende replicar preguntas reales. Antes de presentarte, revisa la [guía oficial](https://www.databricks.com/sites/default/files/2026-10/Databricks-Certified-Data-Engineer-Professional-Exam-Guide-9-Oct-2026.pdf); Databricks aconseja hacerlo dos semanas antes.

## Contenido

- **9 bloques** y **45 objetivos** enumerados en el temario oficial (los pesos suman 100 %).
- Teoría técnica, errores habituales, reglas de decisión, ejemplos SQL/PySpark/YAML y enlaces a documentación oficial.
- **16 laboratorios** con checklist, validación y límites de infraestructura explicados.
- **10 semanas / 80 horas** de itinerario orientativo, priorizando ingesta, CDC, streaming y optimización.
- **57 conceptos** de glosario con definiciones ocultables.
- Comparativa Databricks/Fabric, notas por bloque y objetivo, guardado en localStorage, exportación e importación JSON.
- Analíticas, cronómetro de estudio y marcadores personales.
- Sección **simulador** reservada para la fase 2 (no hay preguntas de examen en esta versión).

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio **público** en GitHub. Nombre sugerido: `databricks-data-engineer-professional`.
2. Sube a la **raíz de la rama `main`** los archivos `index.html`, `styles.css`, `app.js`, `content.js`, `favicon.svg`, `.nojekyll` y `README.md`. `build_content.py` es opcional: solo se utilizó para generar `content.js`.
3. En el repositorio ve a **Settings → Pages → Build and deployment**.
4. En **Source** elige **Deploy from a branch**. Selecciona **main** y **/(root)**; guarda.
5. GitHub publicará el sitio en una dirección con este patrón: `https://TU-USUARIO.github.io/databricks-data-engineer-professional/`. Espera a que Pages muestre su URL publicada.

No requiere npm, frameworks, compilación, servidor ni clave de API. Basta con archivos estáticos. También puedes abrir `index.html` en local.

## Desarrollo local

```bash
python -m http.server 8000
```

Abre `http://localhost:8000/`. Los datos de progreso se guardan solo en el navegador y en el origen actual (la copia local y GitHub Pages tienen almacenamientos separados).

## Archivos

```text
index.html     Estructura semántica y navegación
styles.css     Diseño responsive, temas claro/oscuro
content.js     Contenido académico, objetivos, labs y referencias
app.js         Vistas, estado y funcionalidades interactivas
favicon.svg    Icono propio
.nojekyll      Desactiva el procesamiento Jekyll innecesario
README.md      Instalación y arquitectura
build_content.py  Fuente editorial opcional para regenerar content.js
```

## Privacidad y limitaciones

Las notas, las marcas y el seguimiento se almacenan con **localStorage**. No se suben a GitHub ni se sincronizan entre dispositivos. Usa **Estadísticas → Exportar JSON** para hacer una copia y **Importar JSON** para recuperar el progreso. Si borras datos del navegador sin exportarlos, no se pueden recuperar desde el sitio.

Los fragmentos de código son guías pedagógicas que pueden requerir adaptar catálogos, permisos, rutas y versiones. Algunas funciones están limitadas por workspace, nube, runtime, edición o permisos. La web **no ejecuta SQL ni PySpark**: las pruebas se realizan en tu entorno Databricks.

## Integración futura del simulador

La futura aplicación de preguntas se añadirá como nueva vista o en un directorio `quiz/`, reutilizando la interfaz del simulador Associate. El contenido futuro deberá contar con referencias a documentación oficial, controles de calidad y estadísticas por objetivo; no hay puntuaciones ficticias en la versión actual.

## Referencias oficiales

- [Guía de examen Databricks DE Professional, octubre 2026](https://www.databricks.com/sites/default/files/2026-10/Databricks-Certified-Data-Engineer-Professional-Exam-Guide-9-Oct-2026.pdf)
- [Página de certificación Professional](https://www.databricks.com/learn/certification/data-engineer-professional)
- [Documentación de Databricks](https://docs.databricks.com/)
- [GitHub Pages: fuente de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Licencia y atribución

Contenido didáctico redactado para esta aplicación. Las referencias a productos y marcas pertenecen a sus respectivos titulares. No se reproducen ni incorporan bancos de examen de terceros.
