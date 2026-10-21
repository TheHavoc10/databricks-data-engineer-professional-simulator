window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "05.01": {
    "title": "Managed tables y Predictive Optimization",
    "why": "La optimización física de una tabla afecta lectura, escritura y coste. Las tablas administradas por Unity Catalog pueden beneficiarse de mantenimiento automático, pero deben observarse beneficios medibles.",
    "mechanics": [
      "Predictive Optimization automatiza ciertas tareas de mantenimiento como OPTIMIZE y VACUUM bajo condiciones soportadas. Los intervalos y efectos son gestionados por el servicio.",
      "Mide latencia de consultas, pruning y evolución del número/tamaño de archivos. No assumes que toda query mejorará tras habilitarlo.",
      "El mantenimiento tiene coste y decisiones de retención afectan time travel y lectura incremental; consulta propiedades efectivas."
    ],
    "steps": [
      "Compara antes/después con el mismo workload, datos y concurrencia.",
      "No configures VACUUM agresivo sin evaluar CDC y requerimientos de recuperación."
    ],
    "example": {
      "language": "sql",
      "code": "DESCRIBE DETAIL dev.gold.fact_orders;\nDESCRIBE HISTORY dev.gold.fact_orders;\n-- Consulta propiedades y actividad de mantenimiento de la tabla",
      "note": "Comandos de inspección; su compatibilidad depende del tipo de tabla."
    },
    "challenge": {
      "question": "Una consulta acelera pero CDF de consumidores históricos falla. ¿Qué riesgo investigas?",
      "answer": "Retención de logs y archivos/versiones accesibles, especialmente operaciones de limpieza. Performance y recuperación deben diseñarse conjuntamente."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/optimizations/predictive-optimization"
      }
    ]
  },
  "05.02": {
    "title": "Deletion vectors y CLUSTER BY AUTO",
    "why": "Deletion vectors permiten marcar eliminaciones sin reescribir inmediatamente todos los archivos, con beneficios para operaciones DML. Liquid clustering cambia el layout en función de claves.",
    "mechanics": [
      "Deletion vectors representan filas lógicamente eliminadas; operaciones posteriores pueden materializar cambios físicamente. Las garantías de borrado regulatorio requieren verificar la purga de datos.",
      "CLUSTER BY AUTO selecciona claves de clustering en tablas compatibles administradas por UC con Predictive Optimization. Su comportamiento es asíncrono y depende del uso observado.",
      "No mezcles sin revisar partitioning clásico, ZORDER y liquid clustering en una misma estrategia: las decisiones de layout son mutuamente condicionantes."
    ],
    "steps": [
      "Revisa tipo de tabla, runtime y soporte de DVs/auto-clustering.",
      "Valida impacto en metadata, concurrencia y lectores externos."
    ],
    "example": {
      "language": "sql",
      "code": "CREATE OR REPLACE TABLE dev.gold.fact_orders (\n  order_id BIGINT, customer_id BIGINT, amount DECIMAL(18,2)\n) CLUSTER BY AUTO;",
      "note": "Ejemplo de tabla Delta administrada compatible; comprueba características habilitadas."
    },
    "challenge": {
      "question": "Una tabla tiene consultas muy variables y miles de archivos pequeños. ¿Qué valorar?",
      "answer": "Liquid clustering automático y mantenimiento Predictive Optimization si está soportado; mide los patrones de filtro y coste de reclustering."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/delta/clustering"
      }
    ]
  },
  "05.03": {
    "title": "Caching y coste de lecturas repetidas",
    "why": "El caching evita recomputar algunas lecturas o transformaciones, pero no arregla joins ineficientes, datos sesgados ni escritura mal diseñada.",
    "mechanics": [
      "DataFrame.cache persiste resultados para reutilización, según nivel de almacenamiento y recursos disponibles; la materialización es perezosa.",
      "El cache puede consumir memoria y desplazar otros datos, provocando spills o presión del ejecutor. Distingue cache de resultados SQL y data-skipping de Delta.",
      "En jobs batch que leen cada conjunto una vez, el beneficio puede ser nulo o negativo. El caché debe responder a una medición específica."
    ],
    "steps": [
      "Justifica la reutilización del DataFrame antes de cachearlo.",
      "Deshaz persistencias al finalizar procesos largos."
    ],
    "example": {
      "language": "python",
      "code": "base = spark.table(\"dev.silver.orders\").filter(\"status = 'PAID'\")\nbase.cache()\nprint(base.count())  # materializa la cache\n# reutilización en varias consultas\nbase.unpersist()",
      "note": "Ilustra el patrón. Mide planes/tiempos antes y después."
    },
    "challenge": {
      "question": "Una transformación se usa una vez y causa spill. ¿Añadir cache?",
      "answer": "No como reflejo. Puede agravar presión de memoria; investiga shuffle, distribución de claves y tamaño de las particiones."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://spark.apache.org/docs/latest/sql-performance-tuning.html"
      }
    ]
  },
  "05.04": {
    "title": "Delta Change Data Feed para consumidores incrementales",
    "why": "CDF permite leer cambios entre versiones Delta, pero el feed es una característica de la tabla y su historia está limitada por retención. Debe coordinarse con el consumidor.",
    "mechanics": [
      "Cuando está habilitado, expone información de cambios como tipo de operación, commit version y timestamp. Una consulta por versiones puede reconstruir incrementos.",
      "Se diferencia del histórico SCD2: CDF es flujo de cambios a consumir y SCD2 es representación histórica de atributos del negocio.",
      "Diseña bookmarks durables para cada consumidor y manejo de reintentos. Evita arrancar desde una versión que fue eliminada por retención."
    ],
    "steps": [
      "Documenta versión inicial, estado de checkpoint y plan para backfills.",
      "Los cambios existentes antes de habilitar CDF pueden no estar disponibles como feed histórico."
    ],
    "example": {
      "language": "sql",
      "code": "ALTER TABLE dev.silver.orders\nSET TBLPROPERTIES (delta.enableChangeDataFeed = true);\nSELECT _change_type, _commit_version, order_id\nFROM table_changes('dev.silver.orders', 12, 15);",
      "note": "Las versiones 12-15 son ejemplos y tienen que existir y permanecer retenidas."
    },
    "challenge": {
      "question": "Un consumidor quiere repetir el último lote, ¿qué hace?",
      "answer": "Usa intervalo/versión de commit persistidos, idempotencia al aplicar y comprueba disponibilidad de versiones; no depende de fecha de carga física."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/delta/delta-change-data-feed"
      }
    ]
  },
  "05.05": {
    "title": "Query profile, Spark UI y cuellos de botella",
    "why": "Optimizar requiere distinguir tiempo de espera, IO, CPU, shuffle, skew y volumen de salida. Un mismo tiempo total puede tener causas completamente diferentes.",
    "mechanics": [
      "Spark UI expone stages, tasks, tiempo, lectura, spill y distribuciones. Query profile y EXPLAIN muestran operadores, estimaciones y volumen procesado.",
      "Un shuffle muy grande puede indicar join/groupBy costoso; pocas tareas lentísimas frente a muchas rápidas sugieren skew. Revisa cardinalidades y claves.",
      "El remedio debe atacar causa: broadcast para dimensión pequeña compatible; preagregación para cardinalidad; clustering para filtros; compute para límites de memoria."
    ],
    "steps": [
      "Registra hipótesis, métrica, cambio y resultado antes/después.",
      "Nunca optimices solo con 'más workers' sin comprender el plan."
    ],
    "example": {
      "language": "sql",
      "code": "EXPLAIN FORMATTED\nSELECT c.country, SUM(o.amount)\nFROM dev.silver.orders o\nJOIN dev.silver.customers c ON o.customer_id=c.customer_id\nGROUP BY c.country;",
      "note": "Inspecciona el plan, pero confirma tiempos y shuffle en una ejecución real."
    },
    "challenge": {
      "question": "Una task tarda 5 minutos mientras las otras acaban en segundos. ¿Qué hipótesis principal tienes?",
      "answer": "Skew de datos o partición atípica. Comprueba tamaños por task y claves de unión; evalúa salting, broadcast o rebalanceo según contexto."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/optimizations/query-profile"
      }
    ]
  },
  "05.06": {
    "title": "Liquid Clustering frente a particiones y ZORDER",
    "why": "El layout debe responder a los patrones de filtrado y volumen; un esquema rígido de particionado no siempre conviene a tablas que evolucionan.",
    "mechanics": [
      "Partitioning físico puede ser razonable con pocas particiones grandes y filtros altamente predictibles, pero genera carpetas y posibles archivos pequeños con cardinalidad alta.",
      "ZORDER reorganiza datos dentro de un layout tradicional para mejorar data skipping, mientras liquid clustering utiliza una estrategia de organización basada en claves más flexible.",
      "Liquid clustering reemplaza el uso clásico conjunto de partitioning y ZORDER para tablas compatibles. CLUSTER BY AUTO permite adaptar claves cuando el sistema tiene evidencias."
    ],
    "steps": [
      "Analiza tamaño de tabla, cardinalidad, filtros reales y evolución del workload.",
      "Mide data skipping y coste de mantenimiento antes de migrar."
    ],
    "example": {
      "language": "sql",
      "code": "ALTER TABLE dev.gold.fact_orders\nCLUSTER BY (customer_id, order_date);\n-- En tablas UC gestionadas compatibles también puede evaluarse:\nALTER TABLE dev.gold.fact_orders CLUSTER BY AUTO;",
      "note": "No ejecutes a ciegas sobre producción; verifica coste de reclustering y compatibilidad."
    },
    "challenge": {
      "question": "La tabla se filtraba por country, ahora por customer_id y fecha. ¿Qué enfoque admite adaptación?",
      "answer": "Liquid clustering permite redefinir claves sin reescribir inmediatamente todo el histórico; el reclustering se materializa progresivamente mediante mantenimiento."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/delta/clustering"
      }
    ]
  }
});
