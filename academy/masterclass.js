window.DE_MASTERCLASS = {
  "01.04": {
    "title": "Auto Loader: descubrimiento, esquema y recuperación",
    "sequence": [
      "Llegada de nuevos ficheros",
      "Descubrimiento cloudFiles",
      "Inferencia/evolución de schema",
      "Microbatch + checkpoint",
      "Validación Bronze/Silver"
    ],
    "sections": [
      {
        "h": "Dos estados persistentes distintos",
        "p": [
          "schemaLocation conserva los metadatos de esquema inferido y sus revisiones; checkpointLocation conserva el progreso lógico de una consulta streaming. Si cambias el primero, puedes perder el historial de evolución y provocar inferencias distintas. Si cambias el segundo, Spark trata la ejecución como una consulta distinta y puede volver a procesar datos de origen.",
          "La garantía de no reprocesar archivos confirmados se refiere al descubrimiento por Auto Loader con su estado duradero. No es sinónimo de deduplicación semántica: dos archivos nuevos pueden contener el mismo order_id y deben reconciliarse en Silver."
        ]
      },
      {
        "h": "Schema drift sin perder registros",
        "p": [
          "Para JSON y CSV, el comportamiento ante nuevas columnas depende de cloudFiles.schemaEvolutionMode, esquema proporcionado y pistas de esquema. Algunos cambios amplían los metadatos y desencadenan una parada que debe recuperarse mediante un reinicio programado; no conviene interpretar cada parada como pérdida de datos.",
          "La columna de rescate sirve para conservar fragmentos que no encajan en las expectativas de parseo. Es aconsejable almacenar raw, registrar tipo de anomalía y solo aplicar casts tipados con reglas claras en Silver."
        ]
      },
      {
        "h": "Diseño de producción",
        "p": [
          "Define contrato de proveedor, ruta y permisos de lectura, política de backfill, latencia máxima, ubicación persistente de schema/checkpoint y estrategia de cuarentena. Separa Bronze crudo de Silver normalizado para poder cambiar reglas sin reextraer todos los datos externos.",
          "Ensaya cuatro incidentes: columna añadida, archivo corrupto, archivo repetido con identificador ya visto y parada en mitad del lote. Para cada uno documenta evidencia esperada, opción técnica y operación de recuperación."
        ]
      }
    ]
  },
  "01.07": {
    "title": "AUTO CDC: construir correctamente un SCD2",
    "sequence": [
      "Snapshot inicial consistente",
      "Eventos insert/update/delete",
      "Claves + sequence_by",
      "Aplicación ordenada de CDC",
      "Intervalos de vigencia"
    ],
    "sections": [
      {
        "h": "Distinguir orden de llegada y orden del cambio",
        "p": [
          "El orden en que Spark recibe eventos no tiene por qué coincidir con el orden real del sistema de origen. Debes identificar un campo secuencial estable (por ejemplo, una posición de log u orden de commit) y definir qué significa en conflictos, empates y deletes. Una fecha de ingestión no suele servir para el orden transaccional.",
          "En SCD Type 2, cada modificación relevante puede abrir una nueva versión y cerrar la anterior. La vigencia se representa con __START_AT y __END_AT, con un intervalo abierto para la versión vigente. La consulta as-of enlaza un hecho con la versión válida en su fecha de referencia."
        ]
      },
      {
        "h": "Tres errores muy frecuentes",
        "p": [
          "Primero, ignorar deletes: el destino mantiene clientes que el origen eliminó. Segundo, interpretar eventos fuera de orden como updates recientes: puedes recuperar valores obsoletos. Tercero, historizar atributos insignificantes: una columna de última comprobación puede provocar millones de versiones innecesarias.",
          "AUTO CDC proporciona mecánica gestionada, pero tú defines semántica: claves, secuencia, borrados, columnas que se excluyen y atributos que generan historia. Esa responsabilidad arquitectónica no puede delegarse al motor."
        ]
      },
      {
        "h": "Laboratorio correcto",
        "p": [
          "Crea customer_id=17 con ciudad Madrid en secuencia 10. Aplica UPDATE Burgos secuencia 13 y, después, UPDATE Valladolid secuencia 12. Comprueba que la línea temporal quede Madrid→Valladolid→Burgos en orden lógico, no según el orden de llegada.",
          "Repite con un DELETE final y con un evento de secuencia duplicada. Documenta la política de desempate y valida que un hecho ocurrido cuando estaba vigente Valladolid se vincula a esa versión."
        ]
      }
    ]
  },
  "01.12": {
    "title": "Watermarks, checkpoints y exactly-once: modelo mental",
    "sequence": [
      "Offset de entrada",
      "Construcción de microbatch",
      "Estado / watermark",
      "Sink / efecto externo",
      "Commit de progreso"
    ],
    "sections": [
      {
        "h": "Qué significa 'tiempo' en streaming",
        "p": [
          "Event-time viene del dato, mientras processing-time depende de cuándo llega a la infraestructura. Con ventanas basadas en event-time, los eventos tardíos pueden modificar agregados ya abiertos. Un watermark expresa progreso de tiempo lógico y permite que ciertas operaciones limiten el estado retenido.",
          "No existe una norma universal de 'si timestamp es menor que hora actual menos X, descartar'. El resultado depende del mayor tiempo de evento observado, retraso configurado, operadores, fuentes y output mode. Es imprescindible probar con microbatches controlados."
        ]
      },
      {
        "h": "Checkpoint y consistencia tras fallos",
        "p": [
          "El checkpoint conserva offsets de origen y estados necesarios para restaurar la consulta. Si una query falla mientras procesa un lote, puede reintentar ese mismo microbatch al reiniciar. Por eso el diseño de un sink no se deduce únicamente de que el origen sea Delta.",
          "foreachBatch permite lógica por microbatch, pero su contrato ofrece al menos una vez (at-least-once). Si el destino publicó un lote y la query no registró el avance, la función puede ejecutarse otra vez. MERGE idempotente por clave y versión, o transacciones externas con identificador de lote, son patrones de protección."
        ]
      },
      {
        "h": "Diagnóstico ante retrasos",
        "p": [
          "Inspecciona source lag, inputRowsPerSecond, processedRowsPerSecond, estado, cantidad de shuffle, tamaño de batch y latencia de sink. Si la query no alcanza el ritmo de llegada, no basta con reducir trigger: estás creando trabajo más frecuente sin eliminar la causa.",
          "No borres checkpoint para arreglar un stream atrasado: perderías el progreso durable. Primero averigua si cambió el volumen, el esquema, el acceso o el plan físico de ejecución."
        ]
      }
    ]
  },
  "02.02": {
    "title": "CDC vs Delta Change Data Feed vs snapshots",
    "sequence": [
      "Snapshot o estado inicial",
      "Posición transaccional",
      "Eventos de cambio",
      "Consumidor con watermark/version",
      "Reconciliación final"
    ],
    "sections": [
      {
        "h": "Tres conceptos que parecen el mismo",
        "p": [
          "CDC de una base de datos registra operaciones del origen, a menudo extraídas de su log transaccional. Delta Change Data Feed expone cambios de una tabla Delta desde el momento en que está habilitado, sujetos a la historia retenida. Un snapshot representa un estado en un instante, pero no explica por sí mismo qué eventos lo originaron.",
          "Se puede construir un pipeline snapshot inicial → CDC incremental para el origen relacional → tabla Delta Silver con su propio CDF habilitado → consumidores analíticos. Cada flecha requiere posición de continuación y reconciliación, pero no implica que todos los feeds tengan la misma semántica de delete/update."
        ]
      },
      {
        "h": "Orden y persistencia del cursor",
        "p": [
          "El consumidor debe almacenar una versión, offset o marcador durable; no debe confiar solo en 'última fecha de ejecución'. Cuando hay reintentos, aplica cambios con una clave única y secuencia lógica para evitar duplicados o retrocesos.",
          "La retención de historial y ficheros determina cuánto tiempo puede permanecer parado un consumidor. Si la versión que necesita ya no existe, requiere reconstrucción desde snapshot y una política que evite solapamiento o pérdida."
        ]
      },
      {
        "h": "Qué se considera correcto",
        "p": [
          "Una prueba robusta compara tabla origen en un instante de reconciliación con tabla destino, por claves y hashes de columnas relevantes, no únicamente mediante COUNT(*). Incluye inserts, updates, deletes y registros fuera de orden.",
          "Documenta RPO y RTO: cuánto cambio puedes perder antes de reconciliar y cuánto tiempo aceptas para recuperar una canalización completa."
        ]
      }
    ]
  },
  "03.01": {
    "title": "Joins, ventanas y cardinalidad: la semántica antes del rendimiento",
    "sequence": [
      "Definir grano",
      "Validar unicidad de claves",
      "Aplicar join / ventana",
      "Controlar explosión de filas",
      "Medir shuffle y exactitud"
    ],
    "sections": [
      {
        "h": "La trampa del join válido pero incorrecto",
        "p": [
          "Un LEFT JOIN puede ejecutar sin excepciones y multiplicar las filas si la tabla derecha contiene varias coincidencias por clave. Cuando agregas importes después, el KPI puede multiplicarse sin que el motor detecte el error. El grano del modelo debe quedar explícito y verificarse mediante restricciones o tests.",
          "Antes del join calcula cardinalidad por clave, identifica relaciones 1:1, 1:N o N:M y decide si necesitas preagregar, filtrar versiones o escoger una fila determinista. La deduplicación no consiste en aplicar dropDuplicates al azar: debes justificar la regla de elección."
        ]
      },
      {
        "h": "Ventanas para cambios y desempate",
        "p": [
          "row_number con PARTITION BY y ORDER BY permite elegir una fila vigente, pero las columnas de orden deben resolver los empates; si no, resultados idénticos pueden cambiar entre ejecuciones por orden físico.",
          "Las funciones de ventana mueven y ordenan datos según partición. Un skew extremo en algunas claves genera pocas tareas gigantes y problemas de memoria. Aísla combinaciones que producen spill y revisa el plan."
        ]
      },
      {
        "h": "Spark físico y estrategia",
        "p": [
          "Broadcast es útil cuando uno de los lados es efectivamente pequeño y el tipo de join lo permite. Para un join sobre dos tablas enormes quizá convenga mejorar el layout de datos, preagregar o tratar claves sesgadas.",
          "No compares optimizaciones usando distintos datos o diferentes niveles de concurrencia. Conserva planes, métricas y controles de calidad antes y después."
        ]
      }
    ]
  },
  "05.05": {
    "title": "Spark UI, query profile y diagnóstico basado en evidencia",
    "sequence": [
      "Síntoma",
      "Hipótesis",
      "Stage y task",
      "Operador físico",
      "Cambio aislado",
      "Medida antes/después"
    ],
    "sections": [
      {
        "h": "Del SLA a una hipótesis falsable",
        "p": [
          "La frase 'la query va lenta' no identifica una causa. Fija objetivo cuantitativo (p95 de latencia, coste por millón de registros, freshness) y toma baseline con el mismo volumen, capacidad y caché. Después observa esperas, CPU, IO, bytes leídos, shuffle y tiempos por task.",
          "Query profile muestra dónde se emplea tiempo en un plan SQL; Spark UI detalla stages, tareas y métricas de Spark. EXPLAIN ayuda a entender qué operadores se planearon, pero no sustituye una ejecución medible."
        ]
      },
      {
        "h": "Diagnóstico de cuatro patrones",
        "p": [
          "Skew: una minoría de tasks dura mucho más que las demás. Shuffle: grandes intercambios de datos entre stages por join/groupBy. Small files: overhead de metadatos/lectura y muchas unidades diminutas. OOM/spill: datos intermedios exceden memoria y se vuelcan a disco.",
          "Cada patrón implica una mitigación distinta. Broadcast o tratamiento de skew para joins; layout/clustering para filtrado; compaction para ficheros pequeños; cambios lógicos de query antes de aumentar cómputo."
        ]
      },
      {
        "h": "Evitar optimización de escaparate",
        "p": [
          "Una mejora en una ejecución aislada no prueba una reducción general. Repite pruebas y controla warm-cache, concurrencia y distribución de entrada. Además, vigila el coste en escritura que puede añadir mantener un layout más optimizado.",
          "Mantén una ficha de experimento: hipótesis, cambio, medida y regresiones. No cambies múltiples parámetros simultáneamente porque perderías capacidad de atribución."
        ]
      }
    ]
  },
  "06.02": {
    "title": "ABAC y gobernanza de PII a escala",
    "sequence": [
      "Definir taxonomía de tags",
      "Etiquetar recursos",
      "Aplicar política por ámbito",
      "Evaluación en consulta",
      "Auditoría y pruebas"
    ],
    "sections": [
      {
        "h": "Del RBAC disperso a políticas por atributos",
        "p": [
          "Con permisos tradicionales puedes conceder SELECT a una tabla, pero la necesidad de enmascarar una misma categoría de columna en cientos de tablas multiplica el mantenimiento. ABAC permite definir políticas que se aplican a objetos que cumplan condiciones sobre governed tags dentro de su ámbito.",
          "No se trata simplemente de 'marcar una columna': también necesitas gobernar quién puede crear o asignar tags y quién puede modificar políticas. Un tag incorrecto puede dejar datos desprotegidos o bloquear procesos legítimos."
        ]
      },
      {
        "h": "Herencia, columnas y conflictos",
        "p": [
          "Los tags de ciertos objetos se heredan en su jerarquía; las columnas no heredan automáticamente tags de la tabla, por lo que la clasificación a nivel de columna debe ser deliberada. Revisa los límites exactos de las políticas, su evaluación y posibles conflictos.",
          "La disponibilidad de filtrado, máscaras, GRANT/DENY y políticas de ámbito metastore evoluciona por runtime/preview. Usa siempre la versión de documentación correspondiente a tu workspace; no generalices features Beta a todos los clientes."
        ]
      },
      {
        "h": "Prueba de seguridad profesional",
        "p": [
          "Construye matriz de al menos tres identidades: administrador de políticas, lector PII autorizado y analista sin permiso sensible. Prueba SELECT directo, vistas, Jobs con otra identidad y acceso a raw/Gold. Verifica el resultado y los logs de auditoría.",
          "La máscara en Gold no sustituye minimización ni política de retención de raw, checkpoints, snapshots y exportaciones. La privacidad debe diseñarse por ciclo de vida."
        ]
      }
    ]
  },
  "08.03": {
    "title": "Bundles, entornos y CI/CD sin deriva",
    "sequence": [
      "Commit y tests",
      "bundle validate",
      "Deploy target dev",
      "Pruebas de integración",
      "Aprobación",
      "Deploy target prod"
    ],
    "sections": [
      {
        "h": "Qué versiona cada elemento",
        "p": [
          "El código Python/SQL implementa la transformación, los recursos YAML describen Jobs/Pipelines y las variables o targets parametrizan entornos. El artefacto desplegado debe asociarse a un commit identificable y versión de dependencias.",
          "Separar lógica de negocio de configuración permite que DEV y PROD compartan el mismo código bajo parámetros apropiados. Evita duplicar notebooks y aplicar diferencias manuales en UI: crean deriva y vuelven difícil el rollback."
        ]
      },
      {
        "h": "Validar, desplegar y ejecutar",
        "p": [
          "bundle validate comprueba la definición sin ejecutar el Job; bundle deploy crea/actualiza recursos; bundle run inicia el recurso desplegado. La secuencia se repite por target y con credenciales adecuadas. No confundas estas operaciones con un proceso de compilación o con un merge Git.",
          "La identidad de despliegue puede tener permisos distintos de la identidad run-as; un despliegue exitoso no garantiza que la ejecución acceda a tablas, volúmenes y conexiones correctos."
        ]
      },
      {
        "h": "Recover y gobernanza operativa",
        "p": [
          "Las pruebas post-deploy deben verificar parámetros efectivos y un caso end-to-end pequeño. Revertir bundle puede cambiar la configuración de Jobs, pero no revierte mágicamente datos publicados durante ejecuciones defectuosas.",
          "Define runbooks para repair, compatibilidad de esquema, rollback de lógica, migraciones de tablas y reconciliación. La estrategia debe cubrir tanto objetos desplegados como efectos en datos."
        ]
      }
    ]
  }
};
