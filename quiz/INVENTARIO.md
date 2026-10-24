# Inventario de preguntas — Professional (versión 2026)

> **Importante.** Esta carpeta es un catálogo de preguntas candidatas, NO un banco técnicamente validado ni una filtración del examen. Las preguntas proceden de una guía comunitaria publicada bajo MIT, redactada para el esquema **30/11/2025**, anterior al de **09/10/2026**. La asignación a las nueve áreas actuales es orientativa (clasificador de palabras clave) y debe revisarse manualmente. Nunca des por cierta una respuesta sin contrastarla con Databricks Docs.

## Balance de importación

| Origen | Preguntas | Archivo | Estado |
|---|---:|---|---|
| Práctica por temas | 73 | [JSON](candidatos/practica-2025.json) | Pendiente de revisión |
| Simulacro 1 | 63 | [JSON](candidatos/simulacro-1-2025.json) | Pendiente de revisión |
| Simulacro 2 | 60 | [JSON](candidatos/simulacro-2-2025.json) | Pendiente de revisión |

**196** preguntas; **73** entradas de práctica con IDs originales no únicos (se han renumerado con prefijos propios) y **4** incidencias detectadas manualmente entre las preguntas de ejemplo. El resto no equivale a una validación de contenido.

## Clasificación tentativa según los 9 bloques actuales

| Bloque | Tema | Candidatas | Confiabilidad |
|---|---|---:|---|
| 01 | Desarrollo Python y SQL | 33 | Revisión pendiente |
| 02 | Ingesta | 14 | Revisión pendiente |
| 03 | Transformaciones | 18 | Revisión pendiente |
| 04 | Monitorización | 18 | Revisión pendiente |
| 05 | Optimización | 30 | Revisión pendiente |
| 06 | Seguridad | 36 | Revisión pendiente |
| 07 | Gobierno | 5 | Revisión pendiente |
| 08 | Depuración/CI-CD | 21 | Revisión pendiente |
| 09 | Modelado | 21 | Revisión pendiente |

## Fuentes adicionales — solo para referencia, sin copiar contenido restringido

| Fuente | Preguntas declaradas | Licencia/reutilización | Situación |
|---|---:|---|---|
| [CertSafari, nueva guía 2026](https://www.certsafari.com/databricks/data-engineer-professional-after-october-9/practice-questions) | 35 muestras gratuitas de 353+ | No verificada como reutilizable | Ver temas, escribir casos propios |
| [LearnDatabricks 2026](https://learndatabricks.com/practice/databricks-data-engineer-professional) | 78 en el pool, 60 por intento | No verificada como reutilizable | Benchmark externo, no importar texto |
| [Amrit-Hub GitHub](https://github.com/Amrit-Hub/Databricks-Certified-Data-Engineer-Professional-Questions) | 57 recuerdos/temas orientativos | No verificada como reutilizable | Ideas y lagunas, no banco MCQ completo |
| [NoblerWorks](https://data.noblerworks.com/resources/practice-questions/databricks-data-engineer-professional/) | ~30 gratuitas (referencia previa) | No verificada como reutilizable | Revisar disponibilidad y derechos |

**Atribución del material importado:** [kengio/databricks-certification-study-guide](https://github.com/kengio/databricks-certification-study-guide), © 2026 Suppaseth Charoenkarnka, licencia MIT. Copia completa en [LICENCIA-FUENTE-MIT.txt](LICENCIA-FUENTE-MIT.txt). Los IDs KP/KM1/KM2 son nuevos; los identificadores originales se conservan en el JSON.

## Incidencias que bloquean una importación ciega

- **KM1-003** (Simulacro 1) — SCD2: una única rama WHEN MATCHED UPDATE no inserta simultáneamente nueva versión.
- **KM1-008** (Simulacro 1) — Watermark: formulación demasiado absoluta sobre retraso de llegada.
- **KM1-063** (Simulacro 1) — ERROR DOCUMENTADO: opciones y explicación se refieren a preguntas diferentes.
- **KM2-060** (Simulacro 2) — ERROR DOCUMENTADO: opciones y explicación se refieren a preguntas diferentes.
- **KP-001 y otras:** la documentación de Auto Loader aclara que `addNewColumns` puede requerir reiniciar el stream tras `UnknownFieldException`; respuestas simplistas deben actualizarse.
- **Todos los bancos:** la cifra del 70 % de aprobado publicada por algunos autores no está confirmada como umbral oficial; no usarla como nota de corte garantizada.

## Listado detallado de las 196 preguntas

Cada fila es una **pregunta candidata** en idioma original, con ID interno único, bloque de mapeo automático y enlace al archivo de origen. Abre el JSON correspondiente para ver escenario, cuatro opciones, respuesta propuesta, explicación y advertencias.

### Práctica por temas (73)

| ID | Bloque 2026* | Título / asunto | Dificultad | Incidencias |
|---|:---:|---|---|---|
| KP-001 | 03 | Auto Loader Schema Evolution | easy | Por validar |
| KP-002 | 01 | Streaming Triggers | medium | Por validar |
| KP-003 | 01 | MERGE Operation | easy | Por validar |
| KP-004 | 02 | Change Data Feed | easy | Por validar |
| KP-005 | 01 | Watermarking in Streaming | medium | Por validar |
| KP-006 | 01 | Incremental Processing with readStream | medium | Por validar |
| KP-007 | 01 | Stream-Stream Join | medium | Por validar |
| KP-008 | 05 | Stream-Static Join | medium | Por validar |
| KP-009 | 03 | Stateful Streaming Operations | hard | Por validar |
| KP-010 | 03 | Advanced Watermarking | medium | Por validar |
| KP-011 | 03 | Streaming Deduplication | hard | Por validar |
| KP-012 | 05 | Back-Pressure and Rate Limiting | medium | Por validar |
| KP-013 | 01 | State Store Configuration | hard | Por validar |
| KP-014 | 01 | dbutils.widgets | easy | Por validar |
| KP-015 | 01 | %run Magic Command | easy | Por validar |
| KP-016 | 06 | Databricks CLI Authentication | medium | Por validar |
| KP-017 | 01 | Jobs API Run Now | easy | Por validar |
| KP-018 | 01 | Cluster Types | medium | Por validar |
| KP-019 | 06 | Unity Catalog Volumes vs DBFS | easy | Por validar |
| KP-020 | 09 | Medallion Architecture | easy | Por validar |
| KP-021 | 09 | Delta Lake Time Travel | medium | Por validar |
| KP-022 | 02 | Schema Evolution | easy | Por validar |
| KP-023 | 09 | SCD Type 2 | easy | Por validar |
| KP-024 | 05 | Liquid Clustering vs Z-ORDER | medium | Por validar |
| KP-025 | 05 | Partitioning Best Practices | hard | Por validar |
| KP-026 | 06 | Unity Catalog Permission Inheritance | easy | Por validar |
| KP-027 | 06 | Row-Level Security | medium | Por validar |
| KP-028 | 02 | Delta Sharing | easy | Por validar |
| KP-029 | 06 | Secret Management | easy | Por validar |
| KP-030 | 09 | Managed vs External Tables | easy | Por validar |
| KP-031 | 06 | Data Lineage | medium | Por validar |
| KP-032 | 07 | Audit Logging | medium | Por validar |
| KP-033 | 06 | Column Masking | hard | Por validar |
| KP-034 | 06 | Information Schema | medium | Por validar |
| KP-035 | 06 | Network Security | hard | Por validar |
| KP-036 | 06 | Data Classification Tags | medium | Por validar |
| KP-037 | 06 | GDPR Compliance - Right to Erasure | hard | Por validar |
| KP-038 | 04 | System Tables | easy | Por validar |
| KP-039 | 08 | Spark UI Debugging | medium | Por validar |
| KP-040 | 04 | Lakeflow Declarative Pipelines Event Log | easy | Por validar |
| KP-041 | 04 | Query Profiler | medium | Por validar |
| KP-042 | 05 | Identifying Data Skew | medium | Por validar |
| KP-043 | 08 | Databricks Asset Bundles | medium | Por validar |
| KP-044 | 08 | Bundle Deployment Mode | easy | Por validar |
| KP-045 | 08 | Git Folders | easy | Por validar |
| KP-046 | 08 | Unit Testing with Nutter | medium | Por validar |
| KP-047 | 08 | CI/CD Pipeline | easy | Por validar |
| KP-048 | 06 | OIDC Federation for CI/CD | hard | Por validar |
| KP-049 | 08 | Blue/Green Deployment | hard | Por validar |
| KP-050 | 08 | Bundle Variable Substitution | medium | Por validar |
| KP-051 | 08 | Integration Testing Lakeflow Declarative Pipelines Pipelines | hard | Por validar |
| KP-052 | 08 | Deployment Validation | easy | Por validar |
| KP-053 | 08 | GitOps Workflow | medium | Por validar |
| KP-054 | 08 | Testing Strategies - Unit vs Integration | medium | Por validar |
| KP-055 | 09 | Streaming Table vs Materialized View | medium | Por validar |
| KP-056 | 03 | Expectations | easy | Por validar |
| KP-057 | 09 | APPLY CHANGES | medium | Por validar |
| KP-058 | 01 | Lakeflow Declarative Pipelines Table Reference | easy | Por validar |
| KP-059 | 01 | Pipeline Modes | easy | Por validar |
| KP-060 | 01 | Full Refresh | easy | Por validar |
| KP-061 | 05 | OPTIMIZE and ZORDER | easy | Por validar |
| KP-062 | 05 | Shuffle Partitions | medium | Por validar |
| KP-063 | 05 | Broadcast Join | easy | Por validar |
| KP-064 | 05 | AQE (Adaptive Query Execution) | medium | Por validar |
| KP-065 | 05 | File Size Optimization | easy | Por validar |
| KP-066 | 05 | Cost Optimization | easy | Por validar |
| KP-067 | 05 | EXPLAIN Plan Analysis | hard | Por validar |
| KP-068 | 05 | Photon Engine | medium | Por validar |
| KP-069 | 05 | Memory and Spill Diagnostics | medium | Por validar |
| KP-070 | 05 | Spark UI Stage Analysis | medium | Por validar |
| KP-071 | 05 | Liquid Clustering | hard | Por validar |
| KP-072 | 05 | Query Optimization with Predicate Pushdown | hard | Por validar |
| KP-073 | 05 | Auto Optimize Settings | medium | Por validar |

### Simulacro 1 (63)

| ID | Bloque 2026* | Título / asunto | Dificultad | Incidencias |
|---|:---:|---|---|---|
| KM1-001 | 03 | Question 1 | easy | Por validar |
| KM1-002 | 01 | Question 2 | medium | Por validar |
| KM1-003 | 09 | Question 3 | hard | ⚠️ Revisar error |
| KM1-004 | 03 | Question 4 | medium | Por validar |
| KM1-005 | 03 | Question 5 | medium | Por validar |
| KM1-006 | 02 | Question 6 | medium | Por validar |
| KM1-007 | 05 | Question 7 | medium | Por validar |
| KM1-008 | 01 | Question 8 | medium | ⚠️ Revisar error |
| KM1-009 | 02 | Question 9 | medium | Por validar |
| KM1-010 | 05 | Question 10 | easy | Por validar |
| KM1-011 | 03 | Question 11 | medium | Por validar |
| KM1-012 | 03 | Question 12 | hard | Por validar |
| KM1-013 | 03 | Question 13 | hard | Por validar |
| KM1-014 | 03 | Question 14 | easy | Por validar |
| KM1-015 | 01 | Question 15 | medium | Por validar |
| KM1-016 | 01 | Question 16 | easy | Por validar |
| KM1-017 | 01 | Question 17 | medium | Por validar |
| KM1-018 | 01 | Question 18 | hard | Por validar |
| KM1-019 | 01 | Question 19 | medium | Por validar |
| KM1-020 | 01 | Question 20 | medium | Por validar |
| KM1-021 | 06 | Question 21 | easy | Por validar |
| KM1-022 | 02 | Question 22 | easy | Por validar |
| KM1-023 | 06 | Question 23 | medium | Por validar |
| KM1-024 | 06 | Question 24 | medium | Por validar |
| KM1-025 | 05 | Question 25 | medium | Por validar |
| KM1-026 | 06 | Question 26 | medium | Por validar |
| KM1-027 | 01 | Question 27 | easy | Por validar |
| KM1-028 | 01 | Question 28 | medium | Por validar |
| KM1-029 | 06 | Question 29 | medium | Por validar |
| KM1-030 | 02 | Question 30 | medium | Por validar |
| KM1-031 | 03 | Question 31 | easy | Por validar |
| KM1-032 | 09 | Question 32 | easy | Por validar |
| KM1-033 | 09 | Question 33 | medium | Por validar |
| KM1-034 | 09 | Question 34 | easy | Por validar |
| KM1-035 | 05 | Question 35 | hard | Por validar |
| KM1-036 | 02 | Question 36 | medium | Por validar |
| KM1-037 | 09 | Question 37 | medium | Por validar |
| KM1-038 | 09 | Question 38 | easy | Por validar |
| KM1-039 | 09 | Question 39 | medium | Por validar |
| KM1-040 | 06 | Question 40 | medium | Por validar |
| KM1-041 | 06 | Question 41 | medium | Por validar |
| KM1-042 | 02 | Question 42 | easy | Por validar |
| KM1-043 | 06 | Question 43 | easy | Por validar |
| KM1-044 | 06 | Question 44 | easy | Por validar |
| KM1-045 | 06 | Question 45 | hard | Por validar |
| KM1-046 | 04 | Question 46 | easy | Por validar |
| KM1-047 | 05 | Question 47 | medium | Por validar |
| KM1-048 | 04 | Question 48 | medium | Por validar |
| KM1-049 | 04 | Question 49 | medium | Por validar |
| KM1-050 | 04 | Question 50 | easy | Por validar |
| KM1-051 | 04 | Question 51 | medium | Por validar |
| KM1-052 | 08 | Question 52 | easy | Por validar |
| KM1-053 | 08 | Question 53 | medium | Por validar |
| KM1-054 | 08 | Question 54 | easy | Por validar |
| KM1-055 | 06 | Question 55 | medium | Por validar |
| KM1-056 | 08 | Question 56 | medium | Por validar |
| KM1-057 | 08 | Question 57 | medium | Por validar |
| KM1-058 | 09 | Question 58 | medium | Por validar |
| KM1-059 | 05 | Question 59 | medium | Por validar |
| KM1-060 | 04 | Question 60 | medium | Por validar |
| KM1-061 | 05 | Question 61 | medium | Por validar |
| KM1-062 | 05 | Question 62 | medium | Por validar |
| KM1-063 | 04 | Question 63 | medium | ⚠️ Revisar error |

### Simulacro 2 (60)

| ID | Bloque 2026* | Título / asunto | Dificultad | Incidencias |
|---|:---:|---|---|---|
| KM2-001 | 04 | Question 1 | medium | Por validar |
| KM2-002 | 02 | Question 2 | hard | Por validar |
| KM2-003 | 09 | Question 3 | hard | Por validar |
| KM2-004 | 01 | Question 4 | hard | Por validar |
| KM2-005 | 07 | Question 5 | hard | Por validar |
| KM2-006 | 02 | Question 6 | medium | Por validar |
| KM2-007 | 06 | Question 7 | medium | Por validar |
| KM2-008 | 03 | Question 8 | hard | Por validar |
| KM2-009 | 02 | Question 9 | medium | Por validar |
| KM2-010 | 01 | Question 10 | medium | Por validar |
| KM2-011 | 01 | Question 11 | hard | Por validar |
| KM2-012 | 07 | Question 12 | medium | Por validar |
| KM2-013 | 03 | Question 13 | medium | Por validar |
| KM2-014 | 03 | Question 14 | medium | Por validar |
| KM2-015 | 03 | Question 15 | medium | Por validar |
| KM2-016 | 01 | Question 16 | hard | Por validar |
| KM2-017 | 03 | Question 17 | medium | Por validar |
| KM2-018 | 09 | Question 18 | hard | Por validar |
| KM2-019 | 01 | Question 19 | medium | Por validar |
| KM2-020 | 06 | Question 20 | medium | Por validar |
| KM2-021 | 01 | Question 21 | medium | Por validar |
| KM2-022 | 01 | Question 22 | hard | Por validar |
| KM2-023 | 01 | Question 23 | medium | Por validar |
| KM2-024 | 06 | Question 24 | medium | Por validar |
| KM2-025 | 06 | Question 25 | medium | Por validar |
| KM2-026 | 01 | Question 26 | medium | Por validar |
| KM2-027 | 02 | Question 27 | medium | Por validar |
| KM2-028 | 06 | Question 28 | medium | Por validar |
| KM2-029 | 01 | Question 29 | hard | Por validar |
| KM2-030 | 06 | Question 30 | medium | Por validar |
| KM2-031 | 09 | Question 31 | hard | Por validar |
| KM2-032 | 09 | Question 32 | hard | Por validar |
| KM2-033 | 09 | Question 33 | hard | Por validar |
| KM2-034 | 09 | Question 34 | medium | Por validar |
| KM2-035 | 07 | Question 35 | medium | Por validar |
| KM2-036 | 05 | Question 36 | hard | Por validar |
| KM2-037 | 05 | Question 37 | medium | Por validar |
| KM2-038 | 07 | Question 38 | medium | Por validar |
| KM2-039 | 09 | Question 39 | hard | Por validar |
| KM2-040 | 06 | Question 40 | medium | Por validar |
| KM2-041 | 06 | Question 41 | hard | Por validar |
| KM2-042 | 02 | Question 42 | hard | Por validar |
| KM2-043 | 06 | Question 43 | hard | Por validar |
| KM2-044 | 06 | Question 44 | medium | Por validar |
| KM2-045 | 06 | Question 45 | hard | Por validar |
| KM2-046 | 05 | Question 46 | hard | Por validar |
| KM2-047 | 04 | Question 47 | hard | Por validar |
| KM2-048 | 04 | Question 48 | medium | Por validar |
| KM2-049 | 04 | Question 49 | hard | Por validar |
| KM2-050 | 04 | Question 50 | hard | Por validar |
| KM2-051 | 04 | Question 51 | hard | Por validar |
| KM2-052 | 08 | Question 52 | medium | Por validar |
| KM2-053 | 06 | Question 53 | hard | Por validar |
| KM2-054 | 08 | Question 54 | medium | Por validar |
| KM2-055 | 08 | Question 55 | hard | Por validar |
| KM2-056 | 06 | Question 56 | medium | Por validar |
| KM2-057 | 08 | Question 57 | medium | Por validar |
| KM2-058 | 04 | Question 58 | medium | Por validar |
| KM2-059 | 05 | Question 59 | medium | Por validar |
| KM2-060 | 04 | Question 60 | medium | ⚠️ Revisar error |

\* **Mapa provisional:** los temas del blueprint 2025 no se corresponden 1:1 con los nueve bloques de 2026. El inventario no representa ninguna garantía de cobertura de los 45 subobjetivos.
