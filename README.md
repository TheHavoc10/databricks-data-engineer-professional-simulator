# Databricks Data Engineer Professional — Academia interactiva (v2.0)

Curso y campus de estudio en español, basado en la **guía oficial Databricks Certified Data Engineer Professional del 9 de octubre de 2026**. No oficial ni afiliado a Databricks.

## Abrir el campus

https://thehavoc10.github.io/databricks-data-engineer-professional-simulator/

Si la dirección aún no responde, activa **Settings → Pages → Build and deployment → GitHub Actions** y revisa el flujo en **Actions**.

## Qué incluye esta versión

- **45 lecciones** individuales que cubren los objetivos enumerados de las **9 áreas oficiales**.
- Cada lección: fundamento, tres explicaciones técnicas, decisiones de producción, código, limitaciones, situación razonada con respuesta oculta, errores frecuentes, enlaces y notas.
- **8 masterclasses** de profundización (Auto Loader, AUTO CDC/SCD2, streaming, CDF, joins y ventanas, Spark UI, ABAC y bundles), con secuencias y diagnósticos.
- **16 laboratorios ampliados** con requisitos, preparación, código de ejecución, comprobaciones, resultados esperados y advertencias.
- Temario resumido anterior, buscador, tablas de referencia, glosario de 57 conceptos, comparaciones con Fabric y plan de 10 semanas.
- Progreso por objetivo (pendiente, en estudio, dominado), marcadores, notas, cronómetro, tema claro/oscuro y diseño para móvil.
- Importación/exportación de progreso JSON. Al actualizar, se mantiene la clave original de `localStorage`.
- **Simulador Professional reservado** para la siguiente etapa (esta versión no incluye banco de preguntas).

## Cómo estudiar

1. Abre **Academia completa** en el menú y selecciona la lección de la sección deseada.
2. Lee los mecanismos, copia y adapta el código en Databricks; revisa qué funcionalidades exige el entorno.
3. Resuelve el **caso razonado** antes de expandir su explicación.
4. Completa el laboratorio enlazado, guarda observaciones y marca el objetivo como dominado solo cuando puedas justificarlo sin ayuda.
5. Consulta **Estadísticas** para seguir el avance y haz una copia JSON cuando cambies de dispositivo.

Los ejemplos no se ejecutan desde GitHub Pages. Son didácticos: **algunos son scripts adaptables, otros son definiciones parciales o pseudocódigo expresamente señalado**. Conectores, system tables, métricas ABAC, triggers y Lakeflow pueden requerir permisos, nube/edición, runtimes o funcionalidades no disponibles en Free Edition.

## Estructura

```text
index.html                    Entrada de la aplicación
content.js                    Temario, objetivos, glosario y mapa de labs
app.js                        Rutas, estado local y acciones
styles.css                    Estilos generales
favicon.svg                   Icono
academy/01.js ... 09.js       45 lecciones en nueve archivos
academy/academy-ui.js         Renderizado de lecciones y navegación
academy/masterclass.js           Profundizaciones de ocho temas prioritarios
academy/academy.css           Presentación responsive de Academia
academy/labs-a.js             Laboratorios L01 a L08
academy/labs-b.js             Laboratorios L09 a L16
.github/workflows/publish.yml Deploy automático de Pages
```

## GitHub Pages

El flujo `.github/workflows/publish.yml` se ejecuta al hacer push a `main` en HTML/JS/CSS/Academia y también manualmente. Publica el directorio `_site` y valida el número de archivos de lecciones. En la configuración de Pages, utiliza **GitHub Actions** (no es necesario el ZIP). No necesita npm, Vite, backend ni API keys.

## Desarrollo local

```bash
python -m http.server 8000
```

Abre http://localhost:8000/ desde la raíz del repositorio.

## Privacidad y límites

El progreso, las notas y los marcadores se guardan en `localStorage` de **ese navegador y origen**, sin sincronización. Exporta un JSON desde Estadísticas antes de borrar datos o cambiar de equipo. Los ejemplos deben validarse en tu entorno; el proyecto no garantiza comportamientos homogéneos entre todas las nubes, versiones de Runtime y modalidades de compute.

## Referencias

- [Guía oficial del examen, octubre 2026](https://www.databricks.com/sites/default/files/2026-10/Databricks-Certified-Data-Engineer-Professional-Exam-Guide-9-Oct-2026.pdf)
- [Databricks Docs](https://docs.databricks.com/)
- [Databricks Data Engineer Professional](https://www.databricks.com/learn/certification/data-engineer-professional)

## Próxima fase

Integrar el banco de preguntas original de la Professional con referencias, explicaciones por distractor, modo estudio/examen, estadísticas por objetivo y la experiencia móvil de nuestro simulador Associate.
