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
- **Simulador Professional original 2026:** 60 preguntas nuevas basadas en documentación oficial, 45 objetivos, 26 escenarios con código, explicaciones y distractores individualizados.

## Simulador Professional — banco original de 60 preguntas

- [Abrir el simulador](https://thehavoc10.github.io/databricks-data-engineer-professional-simulator/#/simulator)
- **60 preguntas completamente nuevas**, redactadas para el temario de la guía Professional del 9 de octubre de 2026. No son preguntas oficiales del examen ni filtraciones.
- **45 objetivos del temario cubiertos**, con 1-3 preguntas por objetivo, y distribución proporcional a los nueve bloques.
- Cada pregunta dispone de cuatro opciones, respuesta correcta, explicación, justificación de los otros tres distractores, referencia a Databricks Docs y, cuando procede, código SQL/PySpark/YAML.
- **Modo estudio:** corrección inmediata, doble clic sobre una opción, indicador de aciertos/errores y explicación ampliable.
- **Modo examen:** 60 preguntas, 120 minutos, orden aleatorio, sin soluciones hasta terminar, revisión integral y resultados por área.
- Mosaico navegable, marcadores de repaso, controles de progreso, historial de intentos, tema claro/oscuro y diseño responsive.
- Atajos en simulador: A-D / 1-4 para elegir, Enter para comprobar en modo estudio, flechas para avanzar/retroceder y F para marcar.
- **Sin nota de corte oficial inventada:** el porcentaje mostrado sirve para evaluar tu práctica. La página general de certificación puede no coincidir aún con la guía PDF del 9 de octubre.
- Progreso guardado localmente en `de-pro-original-exam-v1`, separado del progreso teórico y los bancos históricos. Cambiar de dispositivo o limpiar el navegador elimina ese progreso salvo copia de los datos del navegador.

**Distribución de preguntas:**

| Bloque | Peso | Preguntas |
|---|---:|---:|
| 01 · Desarrollo Python y SQL | 23 % | 14 |
| 02 · Ingesta y adquisición | 12 % | 7 |
| 03 · Manipulación y calidad | 12 % | 7 |
| 04 · Observabilidad y alertas | 10 % | 6 |
| 05 · Optimización y costes | 15 % | 9 |
| 06 · Seguridad y cumplimiento | 8 % | 5 |
| 07 · Gobierno | 5 % | 3 |
| 08 · Depuración y despliegue | 10 % | 6 |
| 09 · Modelado analítico | 5 % | 3 |
| **Total** | **100 %** | **60** |

**Fuentes de autoría:** los 60 enunciados son originales, escritos a partir de conceptos y ejemplos de la documentación oficial. Las páginas concretas de Databricks Docs aparecen enlazadas en cada pregunta. Las opciones y explicaciones no se copian literalmente de bancos comerciales. Los ejemplos se han revisado a nivel editorial, no ejecutados uno por uno en un workspace con todos los servicios habilitados.

## Bancos históricos — archivo independiente

La ruta [Bancos históricos](https://thehavoc10.github.io/databricks-data-engineer-professional-simulator/#/archive) conserva los tres bancos comunitarios con licencia MIT: **73 prácticas + 63 simulacro 1 + 60 simulacro 2 = 196 candidatas**. Están detalladas en [INVENTARIO.md](quiz/INVENTARIO.md) y su [plan de revisión](quiz/PLAN-REVISION.md). Material basado en blueprint 2025, **no validado** como simulacro actual y con cuatro incidencias bloqueadas. Aviso copyright original en [LICENCIA-FUENTE-MIT.txt](quiz/LICENCIA-FUENTE-MIT.txt).

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
quiz/original/01.json ... 09.json 60 preguntas originales por área
quiz/original.js              Modos estudio/examen, corrección y cronómetro
quiz/original.css             Diseño responsive del simulador
quiz/candidatos/*.json        196 preguntas históricas atribuidas
quiz/questions.js             Visor de preguntas históricas
.github/workflows/publish.yml Deploy automático de Pages
```

## GitHub Pages

El flujo `.github/workflows/publish.yml` se ejecuta al hacer push a `main` en HTML/JS/CSS/Academia y también manualmente. Publica el directorio `_site` y valida lecciones, nueve archivos de preguntas originales y los tres bancos históricos. En la configuración de Pages, utiliza **GitHub Actions** (no es necesario el ZIP). No necesita npm, Vite, backend ni API keys.

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

## Próximas mejoras

- Revisión técnica continua a medida que cambian las funcionalidades de Databricks y la guía del examen.
- Más preguntas originales, especialmente código de Lakeflow, Lakeflow Connect, Iceberg, ABAC y troubleshooting.
- Estadísticas por objetivo y exportación/importación específica del historial del simulador.
