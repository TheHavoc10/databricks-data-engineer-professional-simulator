# Databricks Certified Data Engineer Professional — Learning Campus

Campus interactivo en español para preparar la certificación **Databricks Data Engineer Professional**, basado en la guía oficial del **9 de octubre de 2026**. No está afiliado a Databricks.

## Abrir el campus

**GitHub Pages (una vez habilitado):** https://thehavoc10.github.io/databricks-data-engineer-professional-simulator/

## Contenido actual (fase 1)

- 9 bloques y 45 objetivos del temario oficial, con teoría, errores habituales y referencias.
- 16 laboratorios guiados; snippets SQL, PySpark y YAML; comparaciones con Microsoft Fabric.
- Itinerario orientativo de 10 semanas / 80 horas.
- Glosario de 57 conceptos y seguimiento por objetivo.
- Buscador, marcadores, notas, temporizador, estadísticas, tema oscuro/claro y diseño responsive.
- Importación y exportación de los avances en JSON.
- Apartado reservado para el **simulador Professional**, que se incorporará en la fase 2.

## Publicación en GitHub Pages

Los archivos de la web ya están descomprimidos en la raíz de `main`. **No necesitas subir un ZIP.**

1. Abre **Settings → Pages** de este repositorio.
2. En **Build and deployment → Source** selecciona **GitHub Actions** (no «Deploy from a branch»).
3. En **Actions**, comprueba el flujo **Publicar Databricks Professional Campus**.
4. Si no se ha ejecutado, abre el flujo y pulsa **Run workflow** usando la rama `main`.
5. Cuando el flujo `deploy` termine en verde, abre la URL indicada arriba.

El flujo `.github/workflows/publish.yml` valida y despliega los archivos estáticos desde `main` automáticamente cuando cambian. No hace falta npm, compilación, servidor ni claves.

## Estructura

```text
index.html                         Estructura y carga de scripts
styles.css                         Diseño y temas
content.js                         Contenido académico y objetivos
app.js                             Navegación y funcionalidad
favicon.svg                        Icono
.github/workflows/publish.yml      Publicación de GitHub Pages
README.md                          Instrucciones
```

## Desarrollo local

```bash
python -m http.server 8000
```

Visita http://localhost:8000/.

## Privacidad y alcance

El avance se almacena en `localStorage` del navegador. No se sincroniza entre navegadores ni dispositivos: utiliza la función de exportación/importación JSON de la web para hacer copias.

Los ejemplos de código son pedagógicos; debes adaptar workspace, permisos, catálogo, versión y entorno. Esta web **no ejecuta SQL ni PySpark**. El simulador de preguntas se añadirá más adelante.

## Documentación

- [Guía oficial, 9 de octubre de 2026](https://www.databricks.com/sites/default/files/2026-10/Databricks-Certified-Data-Engineer-Professional-Exam-Guide-9-Oct-2026.pdf)
- [Certificación Databricks Professional](https://www.databricks.com/learn/certification/data-engineer-professional)
- [Documentación oficial Databricks](https://docs.databricks.com/)
