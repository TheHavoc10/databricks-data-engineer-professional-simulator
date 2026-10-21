window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "01.01": {
    "title": "Arquitectura Python modular y bundles",
    "why": "Una aplicación de datos madura separa transformaciones, entradas/salidas, configuración y definición de recursos. Un notebook exploratorio no debería ser el único lugar donde vive la lógica de negocio.",
    "mechanics": [
      "Los módulos importables hacen que una transformación pueda probarse sin arrancar Jobs ni llamar a servicios externos. Expón funciones que acepten DataFrames y devuelvan DataFrames, sin escrituras ocultas.",
      "El archivo databricks.yml describe el proyecto y sus targets; los recursos en YAML describen Jobs y pipelines, mientras el código Python implementa las transformaciones. Los secretos se gestionan fuera del repositorio.",
      "Empaquetar en wheel ayuda a fijar dependencias, crear versiones y desplegar una única unidad. El bundle valida y despliega configuración, pero no sustituye a Git o a pruebas unitarias."
    ],
    "steps": [
      "Separa src/ para código, tests/ para pruebas y resources/ para recursos desplegables.",
      "Fija versiones y separa parámetros dev/prod; nunca codifiques secretos en YAML."
    ],
    "example": {
      "language": "yaml",
      "code": "bundle:\n  name: orderstream\ninclude:\n  - resources/*.yml\ntargets:\n  dev:\n    mode: development\n    default: true\n  prod:\n    mode: production",
      "note": "Esqueleto de bundle: requiere archivos de recursos reales y ajustes para tu workspace."
    },
    "challenge": {
      "question": "Una tarea funciona manualmente pero no en prod. ¿Qué evidencia recogerías antes de cambiar código?",
      "answer": "Compara wheel desplegado, configuración efectiva del target, versión de Python, run-as y referencias de recursos. Reproducir el problema en dev con el mismo artefacto permite localizar una deriva de despliegue."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/dev-tools/bundles/"
      }
    ]
  },
  "01.02": {
    "title": "Diagnóstico de dependencias",
    "why": "ModuleNotFoundError o un fallo al instalar un wheel no demuestra que el código de transformación sea erróneo: puede existir una diferencia de entorno, arquitectura, versión o permisos.",
    "mechanics": [
      "Distingue dependencias de paquete instaladas a través de un artefacto wheel, librerías desde PyPI y paquetes proporcionados por el runtime. Las versiones del intérprete y del runtime son parte del contrato de ejecución.",
      "No todos los modelos de cómputo administran dependencias del mismo modo. En serverless se emplean mecanismos compatibles con ese entorno; no traslades sin revisar la configuración de clusters clásicos.",
      "Un fallo en import puede proceder de wheel incompleto, paquete no incluido, dependencias transitivas en conflicto, ausencia de acceso a índices de paquetes o nombre de módulo diferente al nombre de distribución."
    ],
    "steps": [
      "Comprueba sys.version y versión de las librerías en la tarea que falla, no en otra sesión.",
      "Genera wheel reproducible, valida su contenido y realiza un smoke test de importaciones."
    ],
    "example": {
      "language": "python",
      "code": "import sys\nimport importlib.metadata as md\nprint(sys.version)\nfor package in (\"pyspark\", \"pandas\"):\n    try:\n        print(package, md.version(package))\n    except md.PackageNotFoundError:\n        print(package, \"no instalado\")",
      "note": "Script de inspección, no modifica dependencias."
    },
    "challenge": {
      "question": "El notebook se ejecuta en un cluster, pero una task serverless falla al importar un módulo. ¿Por qué?",
      "answer": "Los entornos pueden resolver librerías y versiones de forma distinta. Inspecciona el entorno ejecutor, empaquetado y declaración de dependencias de esa task; no supongas que instalar en un notebook instala globalmente."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/dev-tools/bundles/library-dependencies"
      }
    ]
  },
  "01.03": {
    "title": "UDF de SQL, Python y Pandas",
    "why": "Una UDF no es automáticamente la mejor forma de implementar una transformación. La primera alternativa debe ser una función nativa SQL/Spark, pues permite al optimizador razonar sobre la expresión y evita sobrecostes de serialización.",
    "mechanics": [
      "Las Python UDF habituales introducen una frontera JVM/Python que puede limitar ciertas optimizaciones y consumir CPU por serialización. Las Pandas UDF procesan lotes vectorizados usando Arrow, con su propio coste de memoria.",
      "Las SQL UDF de Unity Catalog resultan útiles cuando quieres compartir lógica gobernada entre consumidores. Evalúa permisos de ejecución, firma, tipos y semántica NULL.",
      "Prueba rendimiento con un volumen representativo. No confundas vectorización con paralelismo ilimitado y distingue las UDF escalares de las APIs nativas Spark para ventanas y agregaciones."
    ],
    "steps": [
      "Prioriza expresiones SQL nativas; usa UDF solo si la lógica no puede expresarse razonablemente.",
      "Comprueba salida con nulos, tipos incompatibles, lotes grandes y manejo de errores."
    ],
    "example": {
      "language": "sql",
      "code": "-- Preferible a una UDF Python para limpieza simple:\nSELECT order_id, upper(trim(country)) AS country_norm,\n       coalesce(net_amount, 0) AS amount\nFROM dev.bronze.orders;",
      "note": "Adapta dev.bronze.orders a un origen existente."
    },
    "challenge": {
      "question": "Quieres normalizar códigos de país y aplicar una regex a millones de registros. ¿Qué eliges?",
      "answer": "Empieza por funciones nativas de Spark SQL, como upper, trim y regexp_replace. Solo introduce UDF cuando necesitas lógica específica no expresable de forma eficiente en built-ins."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/udf/"
      }
    ]
  },
  "01.04": {
    "title": "Auto Loader y Lakeflow productivo",
    "why": "Auto Loader detecta y procesa archivos nuevos incrementalmente; es una pieza de ingestión, no un servicio mágico de corrección de datos. En producción importa más la estrategia de reinicio que la llamada mínima de API.",
    "mechanics": [
      "cloudFiles gestiona descubrimiento de nuevos archivos con metadatos persistentes. schemaLocation guarda evolución del esquema; checkpointLocation guarda el progreso de la consulta. Son responsabilidades distintas.",
      "En ciertos modos de evolución, una columna nueva puede provocar la terminación del stream tras registrar el nuevo esquema; un Job con reinicio automático puede continuar. Los comportamientos dependen de las opciones de esquema.",
      "_rescued_data permite analizar contenido inesperado según opciones y formato. No sustituye validación de reglas de negocio ni deduplicación por identificador transaccional."
    ],
    "steps": [
      "Define política de evolución, rescate, cuarentena y protección ante backfills.",
      "Prueba llegada duplicada, archivo corrupto, columna nueva y cambio de ubicación de checkpoint."
    ],
    "example": {
      "language": "python",
      "code": "stream = (spark.readStream.format(\"cloudFiles\")\n  .option(\"cloudFiles.format\", \"json\")\n  .option(\"cloudFiles.schemaLocation\", schema_path)\n  .option(\"rescuedDataColumn\", \"_rescued_data\")\n  .load(input_path))\n(stream.writeStream\n  .option(\"checkpointLocation\", checkpoint_path)\n  .toTable(\"dev.bronze.orders_raw\"))",
      "note": "Requiere rutas y permisos válidos. Verifica la política de evolución de esquema del entorno."
    },
    "challenge": {
      "question": "La fuente introduce una columna y la actualización falla una vez. ¿Debes borrar el checkpoint?",
      "answer": "No por defecto. Inspecciona la política de evolución y los metadatos de esquema; borrar el checkpoint crea una nueva identidad lógica de consulta y puede provocar reprocesamiento."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/schema"
      }
    ]
  },
  "01.05": {
    "title": "Jobs: UI, API, CLI y ejecución reproducible",
    "why": "Lakeflow Jobs ejecuta tareas relacionadas por dependencias, con parámetros, límites, reintentos e identidades. La API y la CLI no son orquestadores distintos: son vías de administrar Jobs.",
    "mechanics": [
      "Un workflow puede mezclar notebooks, archivos Python, SQL y pipelines con tipos de tareas compatibles. Las dependencias forman un grafo; una tarea se ejecuta cuando se cumplen sus condiciones de ejecución.",
      "Distingue el scheduler de la frecuencia de procesamiento del stream. Los tiempos de arranque y la política de triggers impactan costes y SLA.",
      "Cada ejecución tiene contexto, parámetros y estado observable. Para automatización fiable, define el Job como código y valida que el run-as pueda acceder a sus tablas y secretos."
    ],
    "steps": [
      "Explica dependencia de tareas y resultado de fallo en tareas ascendentes.",
      "Diseña reintentos teniendo en cuenta efectos externos y ausencia de rollback transaccional entre tareas."
    ],
    "example": {
      "language": "bash",
      "code": "databricks jobs list\n# Con un bundle ya desplegado:\ndatabricks bundle run -t dev order_etl",
      "note": "El nombre order_etl es ilustrativo; valida el bundle y tu autenticación."
    },
    "challenge": {
      "question": "Dos tareas modifican el mismo destino y fallan después de la primera. ¿Qué hace un retry?",
      "answer": "Reintenta según la configuración, pero no deshace automáticamente escrituras completadas por tareas previas. Diseña cada tarea para ser repetible o usa staging y commits controlados."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/jobs/"
      }
    ]
  },
  "01.06": {
    "title": "Streaming table frente a materialized view",
    "why": "La elección depende de la semántica del origen y del resultado esperado, no de qué tecnología es más reciente. Streaming tables procesan incrementos, mientras materialized views mantienen el resultado de una consulta declarativa.",
    "mechanics": [
      "Una streaming table está diseñada para ingesta/transformación incremental de nuevas entradas; no debes asumir que una corrección histórica del origen se propague como una recomputación completa.",
      "Una materialized view puede mantener consultas derivadas y actualizar su resultado; el motor decidirá si puede incrementalizar el refresco o requiere más trabajo, según consulta y condiciones.",
      "Define consistencia requerida, latencia, coste y volumen. Un dataset con borrados y actualizaciones históricas necesita una estrategia explícita para reflejar dichos cambios."
    ],
    "steps": [
      "Pregunta si el dato que llega es append-only o si puede cambiar lo ya procesado.",
      "No equipares refresh de una MV a un stream continuo ni garantices incrementalización universal."
    ],
    "example": {
      "language": "sql",
      "code": "-- Declaraciones conceptuales en un pipeline SQL\nCREATE OR REFRESH STREAMING TABLE bronze_orders\nAS SELECT * FROM STREAM(raw_orders);\nCREATE OR REFRESH MATERIALIZED VIEW daily_sales\nAS SELECT order_date, SUM(amount) AS revenue\nFROM silver_orders GROUP BY order_date;",
      "note": "Los orígenes deben existir y ser compatibles; ejemplo para comparar semánticas."
    },
    "challenge": {
      "question": "Una venta de hace 60 días cambia de importe. ¿Qué destino tiene mejor encaje para recalcular KPI histórico?",
      "answer": "Una materialized view sobre una fuente mutable suele encajar mejor que asumir que una streaming table append-only reprocesará automáticamente el pasado. Contrasta reglas de refresh y costes."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/ldp/"
      }
    ]
  },
  "01.07": {
    "title": "AUTO CDC y dimensión histórica SCD2",
    "why": "CDC registra cambios lógicos y AUTO CDC aplica los eventos a tablas de destino. SCD1 mantiene el estado vigente; SCD2 conserva versiones por intervalos para responder consultas 'as of'.",
    "mechanics": [
      "La clave identifica la entidad y sequence_by define el orden lógico. Llegada física y orden del negocio pueden diferir: usar hora de ingestión puede producir historiales erróneos.",
      "En SCD2 Databricks administra columnas de vigencia __START_AT y __END_AT. Los deletes se declaran con una condición expresa y deben validarse también si llegan fuera de orden.",
      "En algunos casos conviene ignorar del histórico cambios de columnas cosméticas mediante TRACK HISTORY; distingue esa selección del listado de columnas excluidas del destino."
    ],
    "steps": [
      "Prueba INSERT, UPDATE, DELETE y secuencias desordenadas, además de eventos repetidos.",
      "No interpretes NULL en __END_AT como un timestamp desconocido: representa la versión abierta."
    ],
    "example": {
      "language": "python",
      "code": "from pyspark import pipelines as dp\nfrom pyspark.sql.functions import col, expr\n\ndp.create_streaming_table(\"customers_history\")\ndp.create_auto_cdc_flow(\n    target=\"customers_history\", source=\"customer_changes\",\n    keys=[\"customer_id\"], sequence_by=col(\"change_version\"),\n    apply_as_deletes=expr(\"op = 'DELETE'\"),\n    except_column_list=[\"op\", \"change_version\"],\n    stored_as_scd_type=\"2\")",
      "note": "Fragmento para un pipeline Lakeflow: customer_changes debe ser una vista/stream válido de cambios."
    },
    "challenge": {
      "question": "Se reciben UPDATE versión 8 y luego UPDATE versión 7 del mismo cliente. ¿Cuál debe determinar el estado vigente?",
      "answer": "La secuencia de negocio: versión 8. El diseño debe admitir llegadas fuera de orden y preservar correctamente el histórico, no ordenar por fecha de ingestión."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/ldp/cdc"
      }
    ]
  },
  "01.08": {
    "title": "Structured Streaming vs Lakeflow Pipelines",
    "why": "Structured Streaming es una API de Spark para consultas continuas/microbatches; Lakeflow Pipelines ofrece un plano declarativo de datasets, flujos, calidad y operación. Se apoyan en conceptos comunes pero no son idénticos.",
    "mechanics": [
      "Usa API directa si necesitas controlar una transformación o un sink personalizado y puedes mantener checkpoints, despliegue y observabilidad. Lakeflow ayuda a declarar dependencias, CDC y datasets.",
      "Una query de Structured Streaming requiere fuente y sink adecuados, configuración del trigger, estado y checkpoint. Un pipeline declarativo puede coordinar actualizaciones y restricciones de forma más integrada.",
      "La elección debe basarse en control requerido, capacidades soportadas, SLA, permisos, coste y coste de mantenimiento, no en una equivalencia simple Fabric/Databricks."
    ],
    "steps": [
      "Dibuja el flujo y marca quién es responsable de checkpoint y retry.",
      "Explica cómo actuaría cada alternativa ante schema drift y fallos del sink."
    ],
    "example": {
      "language": "python",
      "code": "query = (spark.readStream.table(\"dev.bronze.orders_raw\")\n  .writeStream\n  .option(\"checkpointLocation\", checkpoint_path)\n  .trigger(availableNow=True)\n  .toTable(\"dev.silver.orders_copy\"))",
      "note": "Ejemplo de API directa para consumir datos disponibles; requiere origen Delta compatible."
    },
    "challenge": {
      "question": "Necesitas enviar cada microbatch a una API externa idempotente. ¿Qué ruta explorarías?",
      "answer": "Structured Streaming con foreachBatch ofrece control sobre el sink; diseña claves idempotentes y límites de tasa. Valora alternativas gestionadas si existe un conector soportado."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/structured-streaming/"
      }
    ]
  },
  "01.09": {
    "title": "For Each, If/Else y dependencia condicional",
    "why": "El control de flujo en Lakeflow Jobs permite ejecutar tareas basadas en condiciones o sobre colecciones de parámetros; es distinto de la lógica de transformación fila a fila.",
    "mechanics": [
      "If/Else evalúa una condición a partir de valores disponibles y define una ruta de ejecución. For Each repite una tarea anidada para cada elemento del input; revisa concurrencia y límites de la plataforma.",
      "Los estados skipped/excluded no deben equipararse sin más a un fallo de ejecución. Las dependencias y condiciones de ejecución determinan qué tareas prosiguen.",
      "Un bucle que procesa tablas en paralelo puede introducir colisiones en destino. Define identidad de cada elemento, permisos y recuperación por unidad lógica."
    ],
    "steps": [
      "Define entradas y salidas explícitas de cada rama.",
      "Usa idempotencia cuando una iteración puede repetirse tras repair o retry."
    ],
    "example": {
      "language": "json",
      "code": "{\"tables\":[\"customers\",\"orders\",\"payments\"],\n \"validation\":{\"passed\":true},\n \"mode\":\"incremental\"}",
      "note": "Payload ilustrativo de parámetros de control; no es definición completa de recurso Job."
    },
    "challenge": {
      "question": "El bucle procesa tres tablas, pero una falla. ¿Qué hay que inspeccionar?",
      "answer": "La ejecución concreta de la iteración fallida, su input, concurrencia, configuración de reintentos y dependencias posteriores. No vuelvas a ejecutar ciegamente tareas que ya escribieron resultados."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/jobs/for-each"
      }
    ]
  },
  "01.10": {
    "title": "Seleccionar compute y costes operativos",
    "why": "Elegir compute implica equilibrar latencia, control, compatibilidad, escala y precio. Los modelos disponibles en Databricks no aceptan siempre la misma configuración de dependencias, librerías o perfiles de ejecución.",
    "mechanics": [
      "Comprueba requisitos de memoria, paralelismo, datos y concurrencia; calcula coste de arranque para cargas frecuentes muy pequeñas.",
      "Serverless simplifica operación, pero requiere observar compatibilidad de paquetes y características. Job compute tradicional ofrece distintos controles y puede tener overhead de arranque.",
      "El cálculo correcto usa tiempo real de ejecución, uso de recursos y facturación; no presupongas que mayor cluster garantiza mejor latencia por shuffle o skew."
    ],
    "steps": [
      "Separa optimización lógica del código de simple escalado de compute.",
      "Relaciona tipo de tarea y SLA con concurrency, retries y permisos."
    ],
    "example": {
      "language": "sql",
      "code": "-- Ejemplo de inspección de consumo disponible según permisos:\nSELECT usage_date, sku_name, SUM(usage_quantity) AS dbus\nFROM system.billing.usage\nGROUP BY usage_date, sku_name\nORDER BY usage_date DESC;",
      "note": "La system table y permisos deben estar habilitados; DBUs no son equivalentes directamente a euros."
    },
    "challenge": {
      "question": "Un Job tarda 4 minutos y se programa cada 5. ¿Qué problema puede aparecer?",
      "answer": "Overhead de arranque, ejecuciones solapadas y coste de compute ocioso. Mide tiempo extremo a extremo y la política de concurrencia antes de cambiar frecuencia."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/compute/"
      }
    ]
  },
  "01.11": {
    "title": "Pruebas PySpark: datos, esquema y propiedades",
    "why": "Un test que solo comprueba count() no detecta columnas mal tipadas, registros cruzados o nulabilidad. Diseña transformaciones puras, datos mínimos representativos y propiedades invariantes.",
    "mechanics": [
      "assertDataFrameEqual compara contenidos; assertSchemaEqual contrasta esquemas. La ordenación de DataFrames no está garantizada sin orden explícito: evita pruebas frágiles.",
      "Aísla IO y configuraciones en fixtures. Usa pequeños datos sintéticos para duplicados, nulos, fechas límites, actualizaciones y evolucionado del esquema.",
      "Las pruebas de integración verifican permisos, registro en UC, accesibilidad de tablas y comportamiento real del Job. No reemplazan pruebas de unidad en entornos rápidos."
    ],
    "steps": [
      "Una transformación de deduplicación debe definir desempate determinista.",
      "Prueba al menos un caso negativo por regla crítica de negocio."
    ],
    "example": {
      "language": "python",
      "code": "from pyspark.testing.utils import assertDataFrameEqual\nfrom pyspark.sql import functions as F\n\ndef normalise(df):\n    return df.select(\"order_id\", F.upper(\"country\").alias(\"country\"))\n\nactual = normalise(input_df)\nassertDataFrameEqual(actual, expected_df, checkRowOrder=False)",
      "note": "input_df y expected_df son fixtures definidos por el laboratorio."
    },
    "challenge": {
      "question": "Dos pipelines devuelven el mismo número de filas pero uno cruza pedidos y clientes. ¿Qué test lo detecta?",
      "answer": "Una comparación de DataFrames con contenido esperado o invariantes por clave. El conteo total no detecta asignaciones incorrectas."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/pyspark/"
      }
    ]
  },
  "01.12": {
    "title": "Watermarks, estado, checkpoints y foreachBatch",
    "why": "El eje de streaming fiable es diferenciar event-time, processing-time y progreso durable. No basta con poner un watermark: hay que entender qué estado se conserva y cuándo se puede descartar.",
    "mechanics": [
      "Los offsets determinan qué entrada consume cada microbatch; el checkpoint registra progreso y, en operaciones stateful, estado recuperable. Cambiar a un checkpoint nuevo equivale a iniciar una nueva consulta.",
      "El watermark permite acotar estado en ciertas operaciones basadas en tiempo de evento. Su progreso depende de la información observada y la consulta; no es una regla universal que descarte siempre todos los eventos anteriores.",
      "foreachBatch ejecuta lógica por lote y tiene semántica at-least-once: un lote puede reintentarse después de que su efecto externo haya ocurrido. Debes aplicar deduplicación, claves transaccionales o idempotencia del sink."
    ],
    "steps": [
      "Define fuente de verdad, id de lote y clave de negocio para recuperar.",
      "Comprueba en pruebas el fallo entre escritura externa y commit del checkpoint."
    ],
    "example": {
      "language": "python",
      "code": "def write_batch(batch_df, batch_id):\n    # El destino debe tolerar que este batch_id se repita.\n    batch_df.createOrReplaceTempView(\"incoming_batch\")\n    spark.sql(\"\"\"MERGE INTO dev.silver.orders t\n      USING incoming_batch s ON t.order_id=s.order_id\n      WHEN MATCHED THEN UPDATE SET *\n      WHEN NOT MATCHED THEN INSERT *\"\"\")\n\nquery = (source_stream.writeStream\n  .foreachBatch(write_batch)\n  .option(\"checkpointLocation\", checkpoint_path)\n  .start())",
      "note": "Ejemplo ilustrativo: la condición de MERGE debe incluir versionado para evitar updates fuera de orden."
    },
    "challenge": {
      "question": "Un lote se escribió al destino y la query cayó antes de confirmar su checkpoint. ¿Cuál es el riesgo?",
      "answer": "El microbatch puede repetirse. Spark no garantiza exactamente una vez en sinks arbitrarios con foreachBatch; usa operaciones idempotentes y una clave estable o log transaccional."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/structured-streaming/production"
      }
    ]
  }
});
