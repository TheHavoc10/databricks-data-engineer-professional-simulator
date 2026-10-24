# Plan de depuración de preguntas — Professional 2026

## Estado del repositorio (24/10/2026)

- **196** entradas abiertas y reutilizables bajo licencia MIT, importadas con escenario, cuatro opciones, respuesta propuesta y explicación.
- **196** tienen identificador interno único (KP-001…KP-073, KM1-001…KM1-063, KM2-001…KM2-060).
- **4** entradas con incidencias conocidas están bloqueadas en el visor: KM1-003, KM1-008, KM1-063 y KM2-060.
- **192** siguen disponibles para consulta/práctica provisional. **Ninguna** ha pasado aún una auditoría sistemática de exactitud frente a las guías de 2026.
- Mapeo de bloques 2026 **heurístico**, no revisado manualmente.

## Orden de revisión recomendado

1. **Ingesta y CDC** (área 02, debilidad en Associate): Auto Loader, schemaEvolutionMode, file notifications, CDF, Lakeflow Connect, snapshot/CDC, Iceberg como destino, Delta Sharing y Clean Rooms.
2. **Streaming / Lakeflow** (área 01): checkpoints, watermarks, output modes, exactly-once vs at-least-once, AUTO CDC, streaming table vs MV, Jobs triggers, dependencias Python/wheels, testing.
3. **Rendimiento** (área 05): query profile, AQE/skew/shuffle, CLUSTER BY AUTO, Predictive Optimization, deletion vectors y efecto de VACUUM.
4. **Transformaciones** (área 03): VARIANT, ai_query, UDFs, funciones window, expectations WARN/DROP/FAIL.
5. **Observabilidad** (área 04): system.billing, lakeflow timelines, event log, alertas y freshness.
6. **Gobierno y seguridad** (áreas 06 y 07): ABAC, governed tags, máscaras, row filters, permisos UC, privacidad y cumplimiento.
7. **Despliegue** (área 08): Bundles, targets, variables, repos/Git folders, repairs e idempotencia.
8. **Modelado** (área 09): grano, SCD2, MVs, metric views, Iceberg/Delta.

## Criterios para promocionar una pregunta

- [ ] Pertenece a un objetivo de la guía oficial de 9/10/2026 y se ha asignado el ID correcto.
- [ ] El escenario es autocontenido; incluye el código/datos sin los que la solución sería ambigua.
- [ ] Solo una respuesta es correcta, excepto si se identifica expresamente como selección múltiple.
- [ ] Se ha contrastado respuesta y todas las alternativas con documentación actual de Databricks.
- [ ] Se ha reescrito si una opción o explicación ya no es válida para versiones actuales.
- [ ] La explicación distingue por qué es correcta y por qué son incorrectos los distractores.
- [ ] Hay enlace concreto al documento oficial y fecha de revisión.
- [ ] La pregunta ha sido probada en interfaz móvil y tema oscuro/claro.
- [ ] Solo entonces cambiar de `reviewStatus: pendiente_revision` a `validada` y trasladar a banco oficial del simulador.

## Cuestiones detectadas que necesitan corrección

- **KM1-003:** explicar SCD2 como un único MERGE de actualización + inserción sin construcción adicional puede inducir a error.
- **KM1-008:** watermark descrito como descarte determinista basado en un simple retraso de llegada; exige matizar progreso event-time y operadores.
- **KM1-063:** opciones sobre alertas, explicación sobre OOM/shuffle; integridad de datos rota.
- **KM2-060:** opciones sobre alertas, explicación sobre OPTIMIZE/liquid clustering; integridad de datos rota.
- **Banco de práctica:** los IDs originales se repiten entre dominios; se sustituyeron por KP-xxx sin pérdida del ID previo.
- **Blueprint anterior:** contiene algunas terminologías DLT/APPLY CHANGES y un desglose diferente del actual; priorizar AUTO CDC, Liquid Clustering, ABAC, Lakeflow Connect y nuevas funcionalidades.
- **Nota de corte:** no tratar el 70% de bancos externos como mínimo oficial confirmado.

## Fuentes para validar

- [Guía Professional de octubre 2026](https://www.databricks.com/sites/default/files/2026-10/Databricks-Certified-Data-Engineer-Professional-Exam-Guide-9-Oct-2026.pdf)
- [Auto Loader schema evolution](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema)
- [AUTO CDC](https://docs.databricks.com/aws/en/ldp/cdc)
- [foreachBatch](https://docs.databricks.com/aws/en/structured-streaming/foreach)
- [Liquid Clustering](https://docs.databricks.com/aws/en/delta/clustering)
- [ABAC](https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac)

## Fuentes restringidas

Los bancos externos CertSafari, LearnDatabricks y NoblerWorks se mantienen como referencias. No se copia ni republica su contenido completo sin una licencia que lo autorice. A partir de los objetivos oficiales pueden redactarse **preguntas nuevas** de dificultad equivalente, con respuestas comprobadas y fuentes.
