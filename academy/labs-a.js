window.DE_LAB_GUIDES = Object.assign(window.DE_LAB_GUIDES || {}, {
  "L01": {
    "mode": "Ejecutable en workspace con acceso a volumen UC y Auto Loader",
    "intro": "Usa un volumen de Unity Catalog o una ruta autorizada. Escribe archivos realmente nuevos y conserva rutas de schema/checkpoint entre ejecuciones.",
    "setup": "from pyspark.sql import functions as F\nroot = \"/Volumes/dev/bronze/landing_orders\"\ninput_path = root + \"/input\"\nschema_path = root + \"/schema\"\ncheckpoint_path = root + \"/checkpoint\"\n# Crea el volumen/rutas mediante el procedimiento del workspace.\n# Guarda manualmente dos archivos JSON (un registro por línea):\n# lote1: {\"order_id\":1,\"amount\":10.5}\n# lote2: {\"order_id\":2,\"amount\":20.0,\"coupon\":\"SAVE\"}",
    "run": "q = (spark.readStream.format(\"cloudFiles\")\n    .option(\"cloudFiles.format\",\"json\")\n    .option(\"cloudFiles.schemaLocation\",schema_path)\n    .option(\"rescuedDataColumn\",\"_rescued_data\")\n    .load(input_path).writeStream\n    .trigger(availableNow=True)\n    .option(\"checkpointLocation\",checkpoint_path)\n    .toTable(\"dev.bronze.orders_lab\"))\nq.awaitTermination()",
    "verify": "display(spark.table(\"dev.bronze.orders_lab\"))\n# Repite con mismo checkpoint; después introduce lote2 y ejecuta de nuevo.\n# Compara filas y schema; comprueba errores de evolución y reinicio.",
    "expected": "Primer lote: 1 fila. La llegada de columna nueva depende de schemaEvolutionMode; puede requerir reinicio. Con el mismo checkpoint no se espera reprocesar archivos ya confirmados.",
    "warning": "El propio trigger availableNow termina al procesar lo disponible. Una columna nueva con modo addNewColumns puede actualizar el esquema y provocar fallo antes del reinicio. No borres checkpoints."
  },
  "L02": {
    "mode": "Lakeflow Pipelines habilitado",
    "intro": "Crea una fuente de cambios determinista (incluye customer_id, op, sequence_num) y administra una tabla histórica con AUTO CDC.",
    "setup": "-- Ejemplo de tabla fuente en catálogo de desarrollo:\nCREATE TABLE IF NOT EXISTS dev.bronze.customer_changes (\n customer_id BIGINT, city STRING, op STRING, sequence_num BIGINT\n);",
    "run": "-- Código SQL de pipeline (no notebook SQL ordinario):\nCREATE OR REFRESH STREAMING TABLE customer_history;\nCREATE FLOW apply_cdc AS AUTO CDC INTO customer_history\nFROM STREAM(dev.bronze.customer_changes)\nKEYS (customer_id)\nAPPLY AS DELETE WHEN op = 'DELETE'\nSEQUENCE BY sequence_num\nCOLUMNS * EXCEPT (op, sequence_num)\nSTORED AS SCD TYPE 2;",
    "verify": "-- Inspecciona la tabla destino del pipeline:\nSELECT customer_id, city, __START_AT, __END_AT\nFROM dev.silver.customer_history\nORDER BY customer_id, __START_AT;",
    "expected": "Un UPDATE posterior por sequence_num crea versión nueva; un evento con número menor recibido tarde no debe convertirse en estado vigente.",
    "warning": "Ejemplo requiere fuente streaming compatible, pipeline configurado para publicar en catálogo/esquema y permisos apropiados. No pegues sin adaptar."
  },
  "L03": {
    "mode": "Spark Structured Streaming con rate source (demostración de mecanismo)",
    "intro": "La fuente rate genera eventos con timestamp. Observa ventanas y salidas por microbatch antes de usar una fuente real con llegadas tardías.",
    "setup": "from pyspark.sql import functions as F\nrate = (spark.readStream.format(\"rate\")\n .option(\"rowsPerSecond\", 3).load())\nevents = rate.select(F.col(\"timestamp\").alias(\"event_time\"), \"value\")",
    "run": "counts = (events.withWatermark(\"event_time\",\"10 seconds\")\n .groupBy(F.window(\"event_time\",\"5 seconds\")).count())\nq = (counts.writeStream.format(\"console\")\n .outputMode(\"append\").option(\"truncate\",\"false\")\n .option(\"checkpointLocation\",checkpoint_path)\n .start())\n# Tras observar los lotes: q.stop()",
    "verify": "# Sustituye rate por entrada controlada para probar late arrivals.\n# Compara tiempo del evento y tiempo de procesamiento.\n# Comprueba progreso con q.lastProgress.",
    "expected": "No todas las ventanas se emiten inmediatamente: Append espera a que el watermark permita finalizarlas.",
    "warning": "La fuente rate no demuestra eventos tardíos por sí sola. Requiere checkpoint_path válida y soporte de console sink en el compute elegido."
  },
  "L04": {
    "mode": "Spark + Delta; operación de MERGE idempotente",
    "intro": "Prueba un mismo lote dos veces. El resultado debe permanecer estable. Introduce la condición de secuencia para impedir que versiones antiguas sobrescriban las nuevas.",
    "setup": "from pyspark.sql import functions as F\nspark.sql(\"CREATE TABLE IF NOT EXISTS dev.silver.orders_sink (order_id BIGINT, version BIGINT, amount DOUBLE) USING DELTA\")\nsource = spark.createDataFrame([(1,2,25.0),(2,1,5.0)],[\"order_id\",\"version\",\"amount\"])",
    "run": "def upsert(df, batch_id):\n    df.createOrReplaceTempView(\"incoming_orders\")\n    spark.sql(\"\"\"MERGE INTO dev.silver.orders_sink t\n        USING incoming_orders s ON t.order_id=s.order_id\n        WHEN MATCHED AND s.version > t.version THEN UPDATE SET *\n        WHEN NOT MATCHED THEN INSERT *\"\"\")\nupsert(source, 0)\nupsert(source, 0)  # simula replay del mismo lote",
    "verify": "display(spark.table(\"dev.silver.orders_sink\"))\n# Añade version=1 para order_id=1: no debería retroceder a amount antiguo.",
    "expected": "Después de procesar el mismo lote dos veces siguen existiendo exactamente dos order_id con la versión máxima.",
    "warning": "La fuente del MERGE debe venir deduplicada por clave de destino; de otro modo varias filas fuente pueden entrar en conflicto."
  },
  "L05": {
    "mode": "Análisis con destino opcional en Lakeflow SQL",
    "intro": "Compara requisitos de actualización para una fuente append-only frente a un agregado que refleja rectificaciones históricas.",
    "setup": "-- Identifica estas entradas conceptuales:\n-- events_append: eventos nuevos sin update del pasado.\n-- orders_mutable: tabla que admite corrección de pedidos antiguos.",
    "run": "-- Definiciones orientativas en pipeline SQL:\nCREATE OR REFRESH STREAMING TABLE orders_ingested\nAS SELECT * FROM STREAM(events_append);\n\nCREATE OR REFRESH MATERIALIZED VIEW revenue_by_day\nAS SELECT order_date, SUM(amount) AS total\nFROM orders_mutable GROUP BY order_date;",
    "verify": "-- Modifica un importe de hace un mes en orders_mutable.\n-- Refresca revenue_by_day; compara nuevo agregado con esperado.",
    "expected": "La MV refleja cambios permitidos por su mecanismo de refresh; la streaming table se centra en nueva entrada incremental.",
    "warning": "La sintaxis y actualización dependen del pipeline y tipo real de fuente. No afirmar incrementalización garantizada de toda MV."
  },
  "L06": {
    "mode": "SQL Warehouse compatible con VARIANT",
    "intro": "Comienza con un JSON tipado, agrega una propiedad nueva y fuerza una incompatibilidad deliberada para comprobar contratos.",
    "setup": "WITH samples AS (\n SELECT parse_json('{\"order\":{\"id\":1,\"amount\":20.5}}') AS p\n UNION ALL\n SELECT parse_json('{\"order\":{\"id\":2,\"amount\":\"bad\"}}') AS p\n) SELECT * FROM samples;",
    "run": "WITH samples AS (\n SELECT parse_json('{\"order\":{\"id\":1,\"amount\":20.5}}') p\n UNION ALL\n SELECT parse_json('{\"order\":{\"id\":2,\"amount\":\"bad\"}}') p\n)\nSELECT variant_get(p, '$.order.id', 'int') AS id,\n try_variant_get(p, '$.order.amount', 'double') AS amount\nFROM samples;",
    "verify": "-- El importe inválido debe resultar NULL con try_variant_get.\n-- Añade validación amount IS NOT NULL en tu Silver.",
    "expected": "El primer registro tiene amount 20.5 y el segundo NULL; la validación debe decidir cuarentena o descarte.",
    "warning": "Comprueba soporte de try_variant_get en tu SQL Warehouse/Runtime y diferencias entre NULL SQL y JSON null."
  },
  "L07": {
    "mode": "Lakeflow SQL Pipeline",
    "intro": "Prueba un conjunto válido e inválido frente a tres políticas. Hazlo en un entorno de desarrollo con un origen disponible.",
    "setup": "-- Source dev.bronze.test_orders contiene order_id NULL y no NULL.\n-- Defínelo con registros controlados antes de ejecutar el pipeline.",
    "run": "CREATE OR REFRESH STREAMING TABLE orders_clean (\n CONSTRAINT valid_id EXPECT (order_id IS NOT NULL)\n ON VIOLATION DROP ROW\n) AS SELECT * FROM STREAM(dev.bronze.test_orders);",
    "verify": "-- Revisa filas de salida y metrics del event log.\n-- Repite en una tabla distinta con EXPECT sin DROP.\n-- Repite con ON VIOLATION FAIL UPDATE.",
    "expected": "WARN conserva inválidas y registra métricas; DROP elimina inválidas del destino; FAIL detiene la actualización.",
    "warning": "La política requiere definición del dataset en un pipeline SQL. Conserva siempre Bronze para investigar registros descartados."
  },
  "L08": {
    "mode": "PySpark con funciones nativas; ejecutable en entorno Spark",
    "intro": "Crea un join sesgado donde una clave aparece millones de veces y compara planes, tiempos y tareas.",
    "setup": "from pyspark.sql import functions as F\nleft = spark.range(100000).select(\n    F.when(F.col(\"id\") < 90000, F.lit(0)).otherwise(F.col(\"id\") % 100).alias(\"key\"),\n    F.col(\"id\").alias(\"event_id\"))\nright = spark.range(100).select(F.col(\"id\").alias(\"key\"))",
    "run": "joined = left.join(right, \"key\")\njoined.explain(\"formatted\")\nprint(joined.count())\n# Compara con broadcast si right es realmente pequeña:\nprint(left.join(F.broadcast(right), \"key\").count())",
    "verify": "# Inspecciona Spark UI: shuffle bytes, tasks, skew y plan.\n# Repite con AQE habilitado/deshabilitado en entorno de prueba.",
    "expected": "Ambas versiones producen mismo resultado, pero el plan con broadcast evita shuffle de una de las partes cuando procede.",
    "warning": "Con un conjunto tan pequeño las diferencias de tiempo pueden ser insignificantes. Aumenta volumen con prudencia."
  }
});
