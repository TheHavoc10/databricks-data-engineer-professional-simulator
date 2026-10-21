/* Contenido original en español, alineado con el temario oficial de 09/10/2026. */
window.DE_PRO_DATA = {
  "exam": {
    "title": "Databricks Certified Data Engineer Professional",
    "version": "9 de octubre de 2026",
    "guide": "https://www.databricks.com/sites/default/files/2026-10/Databricks-Certified-Data-Engineer-Professional-Exam-Guide-9-Oct-2026.pdf",
    "questions": 60,
    "minutes": 120,
    "weightTotal": 100,
    "price": "200 USD + impuestos",
    "validity": "2 años",
    "sourceNote": "Temario adaptado del PDF oficial de 09/10/2026. Verifica actualizaciones 2 semanas antes del examen. Esta web es un proyecto independiente no afiliado a Databricks."
  },
  "sections": [
    {
      "id": "01",
      "name": "Desarrollo Python y SQL",
      "weight": 23,
      "priority": "Alta",
      "icon": "code-2",
      "summary": "El área más importante del examen: construir, probar y mantener aplicaciones de ingeniería de datos que funcionan en producción.",
      "foundation": [
        [
          "Arquitectura del proyecto",
          "Separar lógica de negocio, entrada/salida, configuración y pruebas permite reutilizar el código dentro y fuera del notebook. Los bundles describen recursos; los módulos Python encapsulan transformaciones. Un pipeline fiable no debería depender de copiar celdas entre notebooks."
        ],
        [
          "Procesamiento declarativo",
          "Lakeflow Pipelines permite definir datasets y sus dependencias: streaming tables para procesamiento incremental y materialized views cuando hay que mantener una consulta sobre el conjunto de datos. La elección depende de mutabilidad del origen, latencia, coste y consistencia."
        ],
        [
          "Streaming con estado",
          "Structured Streaming utiliza offsets, estado y checkpoints para recuperar consultas. Un watermark limita el estado en agregaciones event-time y define qué datos pueden considerarse demasiado tardíos; no equivale a eliminar cualquier evento pasado por un umbral fijo en todas las operaciones."
        ]
      ],
      "advanced": [
        [
          "AUTO CDC y SCD",
          "AUTO CDC utiliza claves y secuenciación para aplicar cambios. SCD1 conserva el valor vigente; SCD2 conserva versiones con rangos de vigencia. La clave es resolver correctamente eventos fuera de orden, borrados y cambios repetidos."
        ],
        [
          "Garantías de entrega",
          "La recuperación exactamente una vez del estado interno no implica que cualquier escritura a un sistema externo sea exactamente una vez. foreachBatch aporta semántica at-least-once y requiere idempotencia del destino si puede repetirse el mismo micro-lote."
        ],
        [
          "Testing profesional",
          "Aísla transformaciones puras y prueba tanto los datos como el esquema con assertDataFrameEqual y assertSchemaEqual. Añade tests para nulos, duplicados, cambios de tipos, late arrivals y evolución de esquema."
        ]
      ],
      "decision": [
        [
          "Streaming table vs MV",
          "Usa una streaming table para procesar incrementos de forma continua; valora una materialized view si una agregación debe reflejar modificaciones históricas de su origen. Comprueba las restricciones de incrementalización y refresco."
        ],
        [
          "Lakeflow vs Structured Streaming",
          "Escoge abstracciones declarativas cuando simplifiquen dependencias, CDC y operación; usa las APIs directas cuando necesitas controles y sinks específicos, comprobando sus garantías."
        ],
        [
          "Retries y tareas",
          "Configura reintentos, timeouts, dependencias y ramas If/Else o For Each en Jobs; no asumas que repetir una tarea es seguro si causa efectos externos no idempotentes."
        ]
      ],
      "fabric": "Fabric: notebooks PySpark y Pipelines cubren partes de la ejecución; Lakeflow Pipelines aporta un modelo declarativo de datasets, dependencias y mantenimiento. Bundles se parecen al uso combinado de Git, IaC y deployment pipelines, pero no son intercambiables.",
      "pitfalls": [
        "Confundir exactly-once del estado con exactly-once de un sink arbitrario.",
        "Tratar una materialized view como sinónimo de streaming table.",
        "Aplicar AUTO CDC sin claves, secuenciación y estrategia de borrado explícitas.",
        "Suponer que instalar una dependencia en un notebook sirve en todas las configuraciones de serverless."
      ],
      "links": [
        {
          "name": "Guía Lakeflow Pipelines",
          "url": "https://docs.databricks.com/aws/en/ldp/"
        },
        {
          "name": "AUTO CDC",
          "url": "https://docs.databricks.com/aws/en/ldp/cdc"
        },
        {
          "name": "Structured Streaming",
          "url": "https://docs.databricks.com/aws/en/structured-streaming/"
        },
        {
          "name": "Bundles",
          "url": "https://docs.databricks.com/aws/en/dev-tools/bundles"
        },
        {
          "name": "Dependencias Bundles",
          "url": "https://docs.databricks.com/aws/en/dev-tools/bundles/library-dependencies"
        }
      ],
      "objectives": [
        {
          "title": "Estructuras Python modulares para Declarative Automation Bundles",
          "concept": "Paquetes reutilizables, configuración por entorno, tests y recursos del bundle en databricks.yml.",
          "trap": "Copiar notebooks como forma principal de reutilización o introducir secretos en YAML.",
          "exercise": "Dibuja carpetas src/, tests/ y resources/; decide qué va en un módulo frente al bundle.",
          "id": "01.01",
          "domain": "01"
        },
        {
          "title": "Resolver problemas de instalación y dependencias",
          "concept": "Diferencia wheel local, sdist y PyPI; revisa runtime, versiones de Python y restricciones del compute.",
          "trap": "Afirmar que un paquete funciona en serverless porque funcionó en un cluster clásico.",
          "exercise": "Explica cómo diagnosticar un ModuleNotFoundError tras un despliegue.",
          "id": "01.02",
          "domain": "01"
        },
        {
          "title": "Elegir y crear UDF Python, Pandas y SQL",
          "concept": "Compara coste de serialización, vectorización y gobernanza de funciones en Unity Catalog.",
          "trap": "Recurrir a una Python UDF cuando un builtin Spark SQL basta.",
          "exercise": "Clasifica tres transformaciones en builtin, SQL UDF o Pandas UDF.",
          "id": "01.03",
          "domain": "01"
        },
        {
          "title": "Pipelines streaming productivos con Lakeflow y Auto Loader",
          "concept": "Identifica evolución de esquema, ubicación de checkpoints, calidad y modos de ingesta.",
          "trap": "Suponer que AUTO LOADER corrige duplicados semánticos sin definir claves.",
          "exercise": "Diseña Bronze que reciba JSON y resista una columna nueva.",
          "id": "01.04",
          "domain": "01"
        },
        {
          "title": "Automatizar ETL con Jobs, UI, API y CLI",
          "concept": "Parámetros, scheduling, disparadores, identidades, tareas, reparación y automatización.",
          "trap": "Pensar que CLI y API son sistemas de orquestación diferentes.",
          "exercise": "Documenta un job reproducible fuera de la UI.",
          "id": "01.05",
          "domain": "01"
        },
        {
          "title": "Elegir streaming table frente a materialized view",
          "concept": "Distingue origen append-only, actualizaciones históricas, granularidad y frecuencia de refresco.",
          "trap": "Asegurar que una streaming table recalcula siempre todas las agregaciones.",
          "exercise": "Propón destino para eventos append-only y para agregado histórico corregible.",
          "id": "01.06",
          "domain": "01"
        },
        {
          "title": "AUTO CDC, SCD Type 1 y Type 2",
          "concept": "Keys, sequence_by, delete handling, stored_as_scd_type y rangos de vigencia.",
          "trap": "Confundir sequence_by con fecha de ingestión; no gestionar cambios desordenados.",
          "exercise": "Aplica eventos insert/update/delete fuera de orden sobre un cliente.",
          "id": "01.07",
          "domain": "01"
        },
        {
          "title": "Structured Streaming frente a Lakeflow Pipelines",
          "concept": "Cuándo conviene trabajar con API directa y cuándo con dependencia declarativa.",
          "trap": "Elegir basándose solo en el lenguaje de programación.",
          "exercise": "Defiende diseño para pipeline Kafka→Delta con reintentos y validación.",
          "id": "01.08",
          "domain": "01"
        },
        {
          "title": "Control de flujo If/Else y For Each en Lakeflow Jobs",
          "concept": "Condiciones, bucles parametrizados y salidas de tareas.",
          "trap": "Dar por hecho que una rama detenida implica fallo del job.",
          "exercise": "Crea pseudoflujo que valide conteos y procese 4 tablas.",
          "id": "01.09",
          "domain": "01"
        },
        {
          "title": "Seleccionar compute y configuración de tareas",
          "concept": "Serverless environments, modo de rendimiento, memoria, instalación, retries, costes.",
          "trap": "Aplicar idéntica configuración a cargas interactivas y batch.",
          "exercise": "Compara Job compute y serverless ante distintas dependencias.",
          "id": "01.10",
          "domain": "01"
        },
        {
          "title": "Unit tests e integration tests para PySpark",
          "concept": "assertDataFrameEqual, assertSchemaEqual, DataFrame.transform, fixtures y casos negativos.",
          "trap": "Probar solo recuentos de filas y pasar por alto los tipos.",
          "exercise": "Redacta tests de deduplicación y validación de schema.",
          "id": "01.11",
          "domain": "01"
        },
        {
          "title": "Watermarks, output modes, foreachBatch y checkpoints",
          "concept": "Estado, event-time, actualizaciones, recuperación y garantías del sink.",
          "trap": "Asumir exactly-once end-to-end al escribir con foreachBatch sin idempotencia.",
          "exercise": "Simula un fallo después del MERGE pero antes del commit del lote.",
          "id": "01.12",
          "domain": "01"
        }
      ],
      "snippets": [
        {
          "title": "Streaming + watermark",
          "language": "python",
          "code": "from pyspark.sql import functions as F\n\nresult = (events\n    .withWatermark('event_time', '10 minutes')\n    .groupBy(F.window('event_time', '5 minutes'), 'store_id')\n    .agg(F.sum('amount').alias('sales')))\n\nquery = (result.writeStream\n    .outputMode('append')\n    .option('checkpointLocation', checkpoint_path)\n    .toTable('dev.silver.sales_5m'))",
          "comment": "El watermark define la tolerancia a llegada tardía usada para finalizar ventanas y controlar el estado. El checkpoint permite reanudar offsets y estado."
        },
        {
          "title": "Test unitario de PySpark",
          "language": "python",
          "code": "from pyspark.testing.utils import assertDataFrameEqual, assertSchemaEqual\n\ndef normalise(df):\n    return df.transform(lambda x: x.dropDuplicates(['order_id']))\n\nactual = normalise(input_df)\nassertSchemaEqual(actual.schema, expected.schema)\nassertDataFrameEqual(actual, expected, checkRowOrder=False)",
          "comment": "Probar esquema y datos: el resultado correcto no se reduce a un count()."
        }
      ]
    },
    {
      "id": "02",
      "name": "Ingesta y adquisición",
      "weight": 12,
      "priority": "Máxima",
      "icon": "database-zap",
      "summary": "Tu mayor prioridad personal: fuentes heterogéneas, cargas incrementales, CDC gestionado, Iceberg y compartición segura.",
      "foundation": [
        [
          "Taxonomía de fuentes",
          "Primero distingue ficheros (cloud object storage), eventos (Kafka/Kinesis/PubSub), bases relacionales (log CDC o snapshots) y tablas abiertas (Delta/Iceberg). Cada tipo necesita un cursor o mecanismo de progreso distinto."
        ],
        [
          "Incrementalidad",
          "Un pipeline incremental debe registrar qué ha procesado y poder reintentarse. Comprueba si el origen aporta secuencia, watermark, offset, ruta/etiqueta de fichero o Change Data Feed; no infieras cambios solo por una fecha modificada poco fiable."
        ],
        [
          "Lakeflow Connect",
          "Conectores gestionados pueden reducir código de CDC para fuentes relacionales. Verifica permisos del origen, configuración de captura de cambios, soporte de tablas, límites y disponibilidad por nube/edición."
        ]
      ],
      "advanced": [
        [
          "Delta e Iceberg",
          "Ambos son formatos de tabla abiertos con metadatos transaccionales; la estrategia depende de catálogo, motores lectores/escritores y compatibilidad de las funciones. No supongas igualdad de soporte de propiedades entre ambos."
        ],
        [
          "Federation vs ingestion",
          "Lakehouse Federation consulta datos remotos bajo conexiones gobernadas, sin que ello implique materializar tablas. Es una decisión distinta de replicarlos y administrarlos localmente."
        ],
        [
          "OpenSharing y Clean Rooms",
          "La compartición puede exponer datasets sin ETL tradicional; Clean Rooms incorporan restricciones de colaboración para proteger privacidad. Verifica modelo de identidad, participantes y contratos de consulta."
        ]
      ],
      "decision": [
        [
          "CDC vs recarga completa",
          "Para cambios frecuentes o deletes de gran volumen el log CDC suele ser más adecuado. Un snapshot total puede ser aceptable para pequeños maestros y cuando el origen no provee logs."
        ],
        [
          "Streaming vs batch",
          "Decide usando SLA, frecuencia de origen, coste de arranque y tolerancia a duplicados; no elijas continuous para cualquier SLA sin analizar el coste."
        ],
        [
          "Iceberg como objetivo",
          "Comprueba si el objetivo admite la operación incremental deseada y el proveedor del catálogo. La compatibilidad depende del modo de gestión y de versiones."
        ]
      ],
      "fabric": "Fabric: Dataflow Gen2/Pipelines para extracción y Eventstream/RTI para eventos; OneLake shortcuts evitan ciertas copias. Federation y conectores gestionados de Databricks tienen otro modelo de consistencia, gobierno y disponibilidad.",
      "pitfalls": [
        "Un JDBC nocturno no es CDC transaccional.",
        "Confundir Federation (consulta virtual) con ingesta física.",
        "Prometer disponibilidad en Free Edition o preview sin comprobar región y permisos.",
        "No considerar deletes ni orden de cambios."
      ],
      "links": [
        {
          "name": "Auto Loader",
          "url": "https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader"
        },
        {
          "name": "Lakeflow Connect",
          "url": "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/"
        },
        {
          "name": "Federation",
          "url": "https://docs.databricks.com/aws/en/query-federation/"
        },
        {
          "name": "Compartición Delta",
          "url": "https://docs.databricks.com/aws/en/delta-sharing/"
        },
        {
          "name": "Clean Rooms",
          "url": "https://docs.databricks.com/aws/en/clean-rooms/"
        }
      ],
      "objectives": [
        {
          "title": "Ingerir Delta, Parquet, JSON, Iceberg, CSV, Binary y eventos",
          "concept": "Formato, origen, descubrimiento incremental, schema inference y conectores message bus.",
          "trap": "Confundir csv parse errors con corrupción transaccional de Delta.",
          "exercise": "Selecciona herramienta para S3 JSON, Kafka y una tabla Iceberg.",
          "id": "02.01",
          "domain": "02"
        },
        {
          "title": "CDC incremental con Delta o Iceberg como destino",
          "concept": "Diferencia cambios de filas de snapshots; considera tipo de objetivo y soporte actual.",
          "trap": "Aplicar SCD2 sin sequence_by determinista o borrar filas equivocadas.",
          "exercise": "Define clave y secuencia para tabla destino, señalando supuestos.",
          "id": "02.02",
          "domain": "02"
        },
        {
          "title": "CDC relacional con Lakeflow Connect",
          "concept": "Gestiona extracción de SQL Server, MySQL, PostgreSQL, permisos y captura de cambios.",
          "trap": "Asumir que un SELECT JDBC incremental captura deletes por sí solo.",
          "exercise": "Compara JDBC incremental con log-based CDC ante deletes.",
          "id": "02.03",
          "domain": "02"
        },
        {
          "title": "OpenSharing y Clean Rooms",
          "concept": "Compartir con clientes compatibles y colaborar sin exposición irrestricta del dato.",
          "trap": "Pensar que Clean Rooms implica entregar físicamente todos los datos.",
          "exercise": "Dibuja dos organizaciones con requisitos de privacidad y acceso.",
          "id": "02.04",
          "domain": "02"
        },
        {
          "title": "Lakehouse Federation, permisos y conexiones",
          "concept": "Conexiones, credenciales, external catalogs y UC para acceso gobernado.",
          "trap": "Confundir READ en objeto UC con permiso de base remota que no existe.",
          "exercise": "Justifica cuándo consultas virtualmente y cuándo replicas.",
          "id": "02.05",
          "domain": "02"
        }
      ],
      "snippets": [
        {
          "title": "Auto Loader con rescue column",
          "language": "python",
          "code": "raw = (spark.readStream\n    .format('cloudFiles')\n    .option('cloudFiles.format', 'json')\n    .option('cloudFiles.schemaLocation', schema_path)\n    .option('cloudFiles.schemaEvolutionMode', 'rescue')\n    .load(source_path))\n\n(raw.writeStream\n    .option('checkpointLocation', checkpoint_path)\n    .toTable('dev.bronze.orders_raw'))",
          "comment": "Puntos a vigilar: schemaLocation y checkpointLocation deben mantenerse de forma estable entre reinicios; la columna rescatada recoge campos inesperados según configuración."
        }
      ]
    },
    {
      "id": "03",
      "name": "Manipulación y calidad",
      "weight": 12,
      "priority": "Alta",
      "icon": "workflow",
      "summary": "SQL y PySpark avanzados para grandes volúmenes, datos semiestructurados, IA aplicada y expectativas de calidad.",
      "foundation": [
        [
          "Ventanas y joins",
          "row_number y dense_rank resuelven requisitos distintos. Identifica el orden determinista, shuffle y coste de materializar resultados. Evita usar un join cuando existe un semi/anti join más expresivo."
        ],
        [
          "Datos semiestructurados",
          "VARIANT permite almacenar información JSON con esquema flexible y consultar atributos mediante acceso por ruta o funciones. Separa ingestión flexible de tipado de columnas analíticas."
        ],
        [
          "Calidad incorporada",
          "En Lakeflow Pipelines, expectations se aplican a registros con acciones de observación, descarte o fallo. La cuarentena se diseña explícitamente; no es una operación mágica que cree automáticamente una tabla."
        ]
      ],
      "advanced": [
        [
          "AI functions",
          "ai_query permite usar modelos habilitados dentro de flujos SQL; exige revisar costes, privacidad y comportamiento no determinista, además de la compatibilidad de la región/endpoint."
        ],
        [
          "Dedupe en streaming",
          "La deduplicación por clave de negocio difiere de dropDuplicates sin límite temporal. La gestión de estado y su vencimiento es crucial."
        ],
        [
          "Nulls y casteos",
          "TRY_CAST evita fallar ante ciertos valores no convertibles devolviendo NULL; necesitas diseñar acciones de validación y cuarentena para que el dato no se pierda silenciosamente."
        ]
      ],
      "decision": [
        [
          "Ventanas",
          "Usa ROW_NUMBER con orden total cuando necesitas exactamente un ganador por grupo."
        ],
        [
          "Calidad",
          "FAIL para bloquear datos críticos, DROP para descartar por regla controlada y WARN/observación para métricas sin eliminar filas."
        ],
        [
          "AI",
          "Evita confiar decisiones regulatorias exclusivamente a salidas de un modelo sin controles."
        ]
      ],
      "fabric": "Fabric y Databricks comparten Spark SQL/PySpark como base; VARIANT, las expectations de Lakeflow y ai_query tienen sintaxis, alcance y operación específicos de Databricks.",
      "pitfalls": [
        "No proporcionar desempate determinista en ROW_NUMBER.",
        "Suponer que DROP equivale a cuarentena rastreable.",
        "Confundir SQL TRY_CAST con transformar automáticamente dato inválido en correcto."
      ],
      "links": [
        {
          "name": "VARIANT",
          "url": "https://docs.databricks.com/aws/en/semi-structured/variant"
        },
        {
          "name": "Funciones IA",
          "url": "https://docs.databricks.com/aws/en/large-language-models/ai-functions"
        },
        {
          "name": "Expectations",
          "url": "https://docs.databricks.com/aws/en/ldp/expectations"
        },
        {
          "name": "Spark SQL",
          "url": "https://docs.databricks.com/aws/en/sql/language-manual/"
        }
      ],
      "objectives": [
        {
          "title": "Transformaciones avanzadas con Spark SQL y PySpark",
          "concept": "Ventanas, joins, agregaciones, plan físico y shuffle.",
          "trap": "Particiones y joins mal elegidos pueden causar skew.",
          "exercise": "Construye deduplicación última versión con desempate.",
          "id": "03.01",
          "domain": "03"
        },
        {
          "title": "VARIANT, parse_json y variant_get",
          "concept": "Lectura flexible de campos con rutas y conversión al tipo esperado.",
          "trap": "Pretender que VARIANT evita definir contrato analítico posterior.",
          "exercise": "Extrae order.id y amount de eventos heterogéneos.",
          "id": "03.02",
          "domain": "03"
        },
        {
          "title": "Funciones de IA como ai_query",
          "concept": "Inferencia y clasificación en pipelines, control de errores y coste.",
          "trap": "Asumir salidas idénticas o gratuitas en cada ejecución.",
          "exercise": "Diseña clasificación textual y su validación manual.",
          "id": "03.03",
          "domain": "03"
        },
        {
          "title": "Expectations y tratamiento de registros inválidos",
          "concept": "WARN, DROP y FAIL; cuarentena explícita con observabilidad.",
          "trap": "Crear DROP si debes auditar por qué se rechazó un pedido.",
          "exercise": "Especifica política para correo inválido, importe negativo y PII.",
          "id": "03.04",
          "domain": "03"
        }
      ],
      "snippets": [
        {
          "title": "VARIANT en SQL",
          "language": "sql",
          "code": "SELECT\n  variant_get(parse_json(payload), '$.order.id', 'STRING') AS order_id,\n  try_cast(variant_get(parse_json(payload), '$.amount', 'STRING') AS DECIMAL(12,2)) AS amount\nFROM dev.bronze.raw_events;",
          "comment": "Separar parsing flexible y conversión tipada es esencial para una capa Silver fiable."
        },
        {
          "title": "Deduplicación SQL",
          "language": "sql",
          "code": "WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY order_id\n    ORDER BY event_version DESC, ingested_at DESC\n  ) AS rn\n  FROM dev.silver.order_changes\n)\nSELECT * EXCEPT (rn) FROM ranked WHERE rn = 1;",
          "comment": "Requiere un criterio de orden que realmente identifique el evento más reciente; si hay empates idénticos, añade otra clave determinista."
        }
      ]
    },
    {
      "id": "04",
      "name": "Observabilidad y alertas",
      "weight": 10,
      "priority": "Media",
      "icon": "activity",
      "summary": "Diagnosticar salud, coste, rendimiento y cumplimiento con observabilidad orientada a incidentes.",
      "foundation": [
        [
          "System tables",
          "Metadatos gobernados en Unity Catalog aportan información de consumo, acceso, compute y Lakeflow. Cada tabla tiene cobertura, granularidad y retención propias; valida disponibilidad en tu cuenta."
        ],
        [
          "Pipeline event logs",
          "Los eventos permiten detectar actualizaciones, fallos, expectativas y métricas de calidad de un pipeline. Es mejor basar alertas en señales observables que revisar notebooks manualmente."
        ],
        [
          "Jobs y APIs",
          "El estado de runs/tasks, reparaciones y tiempos de ejecución puede consultarse mediante UI, Jobs API, CLI o SDK, sujeto a permisos."
        ]
      ],
      "advanced": [
        [
          "SLO de datos",
          "Diferencia latencia de ingestión, frescura del dataset y duración de ejecución. Un job exitoso puede producir datos caducados o vacíos."
        ],
        [
          "Coste atribuible",
          "system.billing.usage proporciona eventos de consumo; la atribución requiere etiquetado/contexto y, cuando corresponda, tablas de lista de precios. DBU no equivale a coste total de infraestructura."
        ],
        [
          "Alertas específicas",
          "Prioriza alertas con impacto accionable: anomalía de volumen, incumplimiento de frescura, errores repetidos o picos de coste."
        ]
      ],
      "decision": [
        [
          "Incidente",
          "Primero identifica dónde falla: origen, transformación, destino, recursos o permisos."
        ],
        [
          "Monitorización",
          "No dependas de mirar el estado verde de Jobs como única prueba de calidad de datos."
        ]
      ],
      "fabric": "Fabric ofrece Capacity Metrics, Monitoring Hub y métricas de pipelines. Databricks añade system tables y event logs con otra granularidad, nomenclatura y modelos de coste.",
      "pitfalls": [
        "Confundir DBUs facturados con coste total cloud.",
        "No controlar la frescura de la salida.",
        "Crear alertas que disparan continuamente sin respuesta operativa."
      ],
      "links": [
        {
          "name": "System tables",
          "url": "https://docs.databricks.com/aws/en/admin/usage/system-tables"
        },
        {
          "name": "Pipeline event log",
          "url": "https://docs.databricks.com/aws/en/ldp/monitor-event-logs"
        },
        {
          "name": "Lakeflow Jobs",
          "url": "https://docs.databricks.com/aws/en/jobs/"
        },
        {
          "name": "SQL alerts",
          "url": "https://docs.databricks.com/aws/en/sql/user/alerts/"
        }
      ],
      "objectives": [
        {
          "title": "Analizar costes y auditoría con system tables",
          "concept": "system.billing, compute, access y lakeflow con permisos y retención.",
          "trap": "Tratar las system tables como disponibles en todas las cuentas sin habilitación.",
          "exercise": "Obtén tendencia de consumo por workspace y job.",
          "id": "04.01",
          "domain": "04"
        },
        {
          "title": "Monitorizar Jobs y pipelines con API/CLI/SDK",
          "concept": "Runs, paginación, parámetros, tareas fallidas y permisos.",
          "trap": "Leer solo la última ejecución del job.",
          "exercise": "Diseña un monitor que detecte retries repetidos.",
          "id": "04.02",
          "domain": "04"
        },
        {
          "title": "Usar los event logs de pipelines",
          "concept": "Métricas, estado y expectativas con registros de eventos.",
          "trap": "Confundir métricas agregadas con registros fallidos individuales.",
          "exercise": "Investiga por qué falló una regla de calidad.",
          "id": "04.03",
          "domain": "04"
        },
        {
          "title": "Configurar Lakehouse alerts",
          "concept": "Alertas para datos, coste, SQL, seguridad y calidad según soporte disponible.",
          "trap": "Alertas sin ventana temporal ni umbral de recuperación.",
          "exercise": "Propón alerta de freshness y plan de escalado.",
          "id": "04.04",
          "domain": "04"
        },
        {
          "title": "Monitorizar Lakeflow Jobs por UI y Jobs API",
          "concept": "Detalle de tareas, runs y tiempos de ejecución.",
          "trap": "Asumir que el dashboard muestra todos los errores subyacentes.",
          "exercise": "Escribe árbol de decisión de un run fallido.",
          "id": "04.05",
          "domain": "04"
        }
      ],
      "snippets": [
        {
          "title": "Coste DBU por SKU",
          "language": "sql",
          "code": "SELECT\n  usage_date, sku_name,\n  ROUND(SUM(usage_quantity), 2) AS dbu\nFROM system.billing.usage\nWHERE usage_date >= DATE_SUB(CURRENT_DATE(), 30)\nGROUP BY usage_date, sku_name\nORDER BY usage_date DESC;",
          "comment": "Consulta DBUs, no euros/dólares. Para coste monetario debes considerar precios y atributos de facturación."
        }
      ]
    },
    {
      "id": "05",
      "name": "Optimización y costes",
      "weight": 15,
      "priority": "Alta",
      "icon": "gauge",
      "summary": "Entender el plan de ejecución y escoger cambios medibles: almacenamiento, joins, escrituras, clustering y costes.",
      "foundation": [
        [
          "Diagnóstico primero",
          "Mira query profile/Spark UI antes de modificar la arquitectura. Detecta tiempo en scan, shuffle, skew, broadcast, spill, tareas y ficheros pequeños. Plantea hipótesis y mide el antes/después."
        ],
        [
          "Diseño físico Delta",
          "Liquid Clustering organiza datos para patrones de consulta sin crear una partición por cada valor. El particionado clásico y ZORDER siguen existiendo en sistemas legados, pero no son equivalentes a clustering."
        ],
        [
          "Mantenimiento automatizado",
          "Predictive Optimization puede automatizar tareas de mantenimiento para tablas UC managed compatibles. Comprueba sus condiciones y no des por hecho que cubre tablas externas."
        ]
      ],
      "advanced": [
        [
          "Deletion vectors",
          "Reducen reescrituras inmediatas de ficheros ante borrados/updates elegibles, pero pueden requerir operaciones de mantenimiento y compatibilidad en lectores."
        ],
        [
          "CDF",
          "Change Data Feed permite consumir cambios de filas una vez activado en una tabla compatible; no reconstruye eventos anteriores a su activación. Gestiona versiones, retención y esquema."
        ],
        [
          "Cache",
          "Distingue caching por capa y cómputo; la utilidad depende de lecturas repetidas, volumen, eviction y características del compute. No confundir con una optimización permanente de la tabla."
        ]
      ],
      "decision": [
        [
          "Skew vs paralelismo",
          "Si pocas tareas concentran duración/tamaño, considera skew, broadcast elegible o rediseño de clave antes de subir particiones a ciegas."
        ],
        [
          "Liquid vs ZORDER",
          "Evita mezclar estrategias incompatibles en la misma tabla sin migración y pruebas."
        ],
        [
          "Costo",
          "La configuración óptima minimiza coste total del SLA, no simplemente latencia o DBUs por ejecución."
        ]
      ],
      "fabric": "Fabric también usa Spark, Delta, OPTIMIZE y técnicas de partición; Liquid Clustering, predictive optimization y Query Profile presentan comportamientos concretos de Databricks.",
      "pitfalls": [
        "OPTIMIZE no corrige por sí solo una join key mal distribuida.",
        "Activar CDF después del dato histórico no recupera cambios previos.",
        "VACUUM con retención excesivamente corta puede romper lectores y time travel."
      ],
      "links": [
        {
          "name": "Liquid clustering",
          "url": "https://docs.databricks.com/aws/en/delta/clustering"
        },
        {
          "name": "Optimización Delta",
          "url": "https://docs.databricks.com/aws/en/delta/optimize"
        },
        {
          "name": "Change Data Feed",
          "url": "https://docs.databricks.com/aws/en/delta/delta-change-data-feed"
        },
        {
          "name": "Predictive optimization",
          "url": "https://docs.databricks.com/aws/en/optimizations/predictive-optimization"
        },
        {
          "name": "Query profile",
          "url": "https://docs.databricks.com/aws/en/sql/user/queries/query-profile"
        }
      ],
      "objectives": [
        {
          "title": "Managed tables, Predictive Optimization y clustering",
          "concept": "Responsabilidad operativa y mantenimiento automático.",
          "trap": "Afirmar mantenimiento idéntico en tablas UC externas.",
          "exercise": "Decide managed/external bajo requerimientos multi-engine.",
          "id": "05.01",
          "domain": "05"
        },
        {
          "title": "Deletion vectors, Liquid Clustering, CLUSTER BY AUTO",
          "concept": "Efecto sobre MERGE, consultas por rangos y patrones variables.",
          "trap": "Confundir deletion vectors con borrado físico inmediato.",
          "exercise": "Justifica técnica para MERGE frecuente y filtro por cliente.",
          "id": "05.02",
          "domain": "05"
        },
        {
          "title": "Caching para lecturas repetidas",
          "concept": "Cuándo mejora scans, qué se guarda y en qué condiciones se reutiliza.",
          "trap": "Creer que persistir caché cambia el almacenamiento durable.",
          "exercise": "Experimenta dos lecturas repetidas controlando cache warm-up.",
          "id": "05.03",
          "domain": "05"
        },
        {
          "title": "Change Data Feed para consumidores incrementales",
          "concept": "Versiones de Delta, eventos update_preimage/postimage y deletes.",
          "trap": "Suponer que CDF produce historia anterior a su activación.",
          "exercise": "Diseña Silver incremental desde cambios de Bronze.",
          "id": "05.04",
          "domain": "05"
        },
        {
          "title": "Identificar bottlenecks con query profile",
          "concept": "Data skipping, join strategy, shuffle/spill y tiempo de tareas.",
          "trap": "Tocar parámetros sin observar el plan físico.",
          "exercise": "Distingue patrón de skew de falta de data skipping.",
          "id": "05.05",
          "domain": "05"
        },
        {
          "title": "Liquid Clustering vs partitioning/ZORDER",
          "concept": "Tamaño de tabla, cardinalidad, acceso y costes de mantenimiento.",
          "trap": "Particionar por columna de altísima cardinalidad.",
          "exercise": "Elige organización para tres patrones de consulta.",
          "id": "05.06",
          "domain": "05"
        }
      ],
      "snippets": [
        {
          "title": "Activar CDF y consumir versiones",
          "language": "sql",
          "code": "ALTER TABLE dev.silver.orders\nSET TBLPROPERTIES (delta.enableChangeDataFeed = true);\n\nSELECT _change_type, _commit_version, order_id\nFROM table_changes('dev.silver.orders', 10, 15);",
          "comment": "Los números de versión son ilustrativos: deben existir y estar dentro de la retención; habilitar CDF no recupera cambios previos."
        }
      ]
    },
    {
      "id": "06",
      "name": "Seguridad y cumplimiento",
      "weight": 8,
      "priority": "Media",
      "icon": "shield-check",
      "summary": "Diseñar privacidad y mínimo privilegio con Unity Catalog, ABAC, políticas de PII y borrado regulatorio.",
      "foundation": [
        [
          "Least privilege",
          "Concede USAGE y permisos específicos según jerarquía; evalúa grupos/identidades de servicio y el alcance real de recursos de workspace y UC."
        ],
        [
          "ABAC",
          "Las governed tags describen atributos protegidos. Las políticas se aplican en niveles de la jerarquía y se evalúan dinámicamente para row filters y column masks; requieren permisos y compute compatibles."
        ],
        [
          "Técnicas de anonimización",
          "Hashing, tokenización, supresión y generalización tienen garantías distintas. Un hash determinista de un identificador no equivale automáticamente a anonimización irreversible."
        ]
      ],
      "advanced": [
        [
          "PII en batch y streaming",
          "Descubre, etiqueta, transforma y audita PII antes de exponer datasets derivados; incluye nuevos campos y cambios de esquema en las políticas."
        ],
        [
          "Derecho de supresión",
          "Eliminar lógicamente una fila no implica inmediatamente purga física de todos los ficheros, copias y backups. Revisa VACUUM, retención, replication, CDF y requisitos legales."
        ]
      ],
      "decision": [
        [
          "Goberned tag vs etiqueta normal",
          "Las governed tags tienen control administrativo y se utilizan para políticas centralizadas."
        ],
        [
          "Mask vs hash",
          "Las máscaras restringen visibilidad; los hashes transforman valores y requieren análisis de riesgo de reidentificación."
        ]
      ],
      "fabric": "Fabric dispone de RLS/OLS, sensibilidad y gobierno, pero ABAC de Unity Catalog combina governed tags y políticas declarativas con reglas y requisitos propios.",
      "pitfalls": [
        "Confundir vista dinámica con la política central ABAC.",
        "Creer que DELETE equivale a eliminación física inmediata.",
        "Guardar datos sensibles en valores de tags o notas operativas."
      ],
      "links": [
        {
          "name": "UC ABAC",
          "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac"
        },
        {
          "name": "Tutorial ABAC",
          "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/tutorial-sql"
        },
        {
          "name": "Unity Catalog",
          "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/"
        },
        {
          "name": "VACUUM",
          "url": "https://docs.databricks.com/aws/en/delta/vacuum"
        }
      ],
      "objectives": [
        {
          "title": "ACL y mínimo privilegio para objetos y workspace",
          "concept": "Grupos, USAGE, SELECT/MODIFY y alcance de permisos.",
          "trap": "Otorgar ALL PRIVILEGES a cuentas de servicio de producción sin necesidad.",
          "exercise": "Diseña grupos lectores, productores y administradores.",
          "id": "06.01",
          "domain": "06"
        },
        {
          "title": "Políticas ABAC con governed tags",
          "concept": "Máscaras/row filters automáticos al detectar atributos protegidos.",
          "trap": "Crear tags ordinarios creyendo que son políticas de seguridad.",
          "exercise": "Diseña política de máscara para pii=ssn a escala de catálogo.",
          "id": "06.02",
          "domain": "06"
        },
        {
          "title": "Anonimización y pseudonimización",
          "concept": "Riesgos de hashing, tokenización, generalización y enmascaramiento.",
          "trap": "Llamar anónimo a hash reversible por diccionario de valores.",
          "exercise": "Decide técnica para correo, DNI y código postal.",
          "id": "06.03",
          "domain": "06"
        },
        {
          "title": "Protección de PII en batch y streaming",
          "concept": "Descubrimiento, etiquetado, tratamiento de nuevas columnas y permisos del sink.",
          "trap": "Proteger Bronze y olvidar tablas Gold derivadas.",
          "exercise": "Traza el flujo de un campo sensible de Bronze a Gold.",
          "id": "06.04",
          "domain": "06"
        },
        {
          "title": "Retención y borrado conforme a normativa",
          "concept": "DELETE, archivos físicos, VACUUM, retención y copias aguas abajo.",
          "trap": "Prometer borrado irreversible instantáneo tras DELETE.",
          "exercise": "Crea checklist de right-to-erasure y evidencias auditables.",
          "id": "06.05",
          "domain": "06"
        }
      ],
      "snippets": [
        {
          "title": "Concepto de protección UC",
          "language": "sql",
          "code": "-- Patrón didáctico: revisar permisos efectivos antes de conceder.\nSHOW GRANTS ON TABLE dev.silver.customers;\n\n-- Los filtros/máscaras ABAC se administran por políticas\n-- y governed tags, no con un GRANT genérico.\n",
          "comment": "Para implementar una política ABAC real sigue el tutorial de Databricks y comprueba privilegios de administrador y versión de compute."
        }
      ]
    },
    {
      "id": "07",
      "name": "Gobierno y metadatos",
      "weight": 5,
      "priority": "Media",
      "icon": "library",
      "summary": "Catálogo, metadatos, clasificación y herencia de privilegios para mantener datasets gobernados.",
      "foundation": [
        [
          "Catálogo gobernado",
          "Añade descripciones, contactos, comentarios y etiquetas para que los consumidores sepan qué significa un dato y quién responde por él."
        ],
        [
          "Herencia de privilegios",
          "Unity Catalog permite conceder privilegios en niveles jerárquicos aplicables a objetos descendientes. USAGE y otros privilegios se evalúan según semántica de UC; no confundas privilegios de consulta con propiedad."
        ]
      ],
      "advanced": [
        [
          "Metadata as code",
          "Usa un proceso gobernado para mantener metadatos y etiquetas junto a cambios de esquemas."
        ],
        [
          "Linaje y contratos",
          "Para operaciones reales, el linaje y los contratos de datos completan la clasificación, aunque no sustituyen los objetivos concretos de este examen."
        ]
      ],
      "decision": [
        [
          "Permisos heredados",
          "Analiza primero las concesiones a nivel superior."
        ],
        [
          "Tags",
          "Evita incorporar datos personales en descripciones o valores de etiquetas."
        ]
      ],
      "fabric": "El catálogo de Fabric cumple algunos objetivos análogos, pero los permisos heredados de Unity Catalog y su integración ABAC deben estudiarse por separado.",
      "pitfalls": [
        "Una etiqueta no convierte un dataset en seguro por sí sola.",
        "SELECT heredado no convierte a nadie en owner."
      ],
      "links": [
        {
          "name": "Tags UC",
          "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/tags"
        },
        {
          "name": "Privilegios UC",
          "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/"
        }
      ],
      "objectives": [
        {
          "title": "Tags y comentarios para discoverability",
          "concept": "Metadatos de objetos, vocabulario común y atributos gobernados.",
          "trap": "Meter secretos o PII en los valores de tags.",
          "exercise": "Diseña ficha de 5 columnas críticas con comentario y tags.",
          "id": "07.01",
          "domain": "07"
        },
        {
          "title": "Modelo de herencia de permisos en Unity Catalog",
          "concept": "Catalog→schema→object; permisos aplicables a descendientes nuevos y existentes.",
          "trap": "Confundir uso del catálogo, lectura y propiedad.",
          "exercise": "Calcula permisos efectivos de un grupo con grants a distintos niveles.",
          "id": "07.02",
          "domain": "07"
        }
      ],
      "snippets": [
        {
          "title": "Auditar grants",
          "language": "sql",
          "code": "SHOW GRANTS ON CATALOG dev;\nSHOW GRANTS ON SCHEMA dev.silver;\nSHOW GRANTS ON TABLE dev.silver.orders;",
          "comment": "Interpreta permisos al nivel pertinente; la tabla visible no explica por sí sola todas las rutas heredadas."
        }
      ]
    },
    {
      "id": "08",
      "name": "Depuración y despliegue",
      "weight": 10,
      "priority": "Media",
      "icon": "git-branch",
      "summary": "Ingeniería de software aplicada a pipelines: diagnóstico, reparación, Git, automatización y despliegues reproducibles.",
      "foundation": [
        [
          "Triaging",
          "Comienza por logs y mensaje de error, comprueba cambios recientes, tipo de tarea, recursos y permisos. Usa Spark UI/query profile si el fallo es de rendimiento o memoria."
        ],
        [
          "Reparar Jobs",
          "Repair run permite reejecutar tareas fallidas o dependientes en determinados escenarios, con opciones de parámetros. Antes de reparar valida idempotencia y estado de tareas previas."
        ],
        [
          "Bundles",
          "databricks.yml y los recursos declarados permiten validar y desplegar en targets. Separa credenciales de configuración y evita destruir recursos compartidos por cambios de target."
        ]
      ],
      "advanced": [
        [
          "Git folders y CI/CD",
          "Git folders integran código fuente, pero las operaciones de aprobación, merge y pipelines externos siguen dependiendo del proveedor Git y automatización configurada."
        ],
        [
          "Compatibilidad y dependencias",
          "En deploys reproducibles fija versiones compatibles, construye wheels cuando convenga, y valida acceso a secretos y librerías desde el entorno de ejecución."
        ]
      ],
      "decision": [
        [
          "Debug",
          "Una task fallida por permiso no se arregla aumentando worker nodes."
        ],
        [
          "Repair",
          "No reejecutes un write no idempotente sin evaluar duplicados."
        ],
        [
          "Deploy",
          "Valida bundle en dev antes de desplegar y considera rollback."
        ]
      ],
      "fabric": "Fabric y Databricks comparten buenas prácticas Git/CI/CD, pero la estructura de bundle, destinos, repair runs y Git folders son particulares de Databricks.",
      "pitfalls": [
        "Confundir commit/pull de Git folders con merge de PR en proveedor remoto.",
        "Reparar una tarea con efectos duplicados sin revisar idempotencia.",
        "Desplegar secretos incrustados en el repositorio."
      ],
      "links": [
        {
          "name": "Bundles",
          "url": "https://docs.databricks.com/aws/en/dev-tools/bundles"
        },
        {
          "name": "Config Bundle",
          "url": "https://docs.databricks.com/aws/en/dev-tools/bundles/settings"
        },
        {
          "name": "Lakeflow Jobs",
          "url": "https://docs.databricks.com/aws/en/jobs/"
        },
        {
          "name": "Git folders",
          "url": "https://docs.databricks.com/aws/en/dev-tools/git/"
        },
        {
          "name": "Spark UI",
          "url": "https://docs.databricks.com/aws/en/compute/troubleshooting/"
        }
      ],
      "objectives": [
        {
          "title": "Diagnosticar con Spark UI, logs, tablas y query profile",
          "concept": "Localiza la capa del fallo: motor, permisos, origen, red, código, capacidad.",
          "trap": "Corregir síntoma de shuffle con una nueva cuenta de servicio.",
          "exercise": "Diagnostica 3 logs: OOM, 403 y skew.",
          "id": "08.01",
          "domain": "08"
        },
        {
          "title": "Job repairs y parameter overrides",
          "concept": "Determina qué tareas reejecutar sin dañar consistencia ni costes.",
          "trap": "Repair no revierte los efectos de una tarea ya completada.",
          "exercise": "Construye plan de recuperación de un job de cuatro etapas.",
          "id": "08.02",
          "domain": "08"
        },
        {
          "title": "Desplegar con Declarative Automation Bundles",
          "concept": "YAML, targets dev/stage/prod, validate, deploy, run.",
          "trap": "Usar nombres/paths constantes entre workspaces por error de target.",
          "exercise": "Prepara un bundle mínimo con dev/prod.",
          "id": "08.03",
          "domain": "08"
        },
        {
          "title": "CI/CD con Git folders y proveedor Git",
          "concept": "Clone/pull/commit en workspace; PR/merge y pipelines automatizados en proveedor.",
          "trap": "Suponer que Git folders crea por sí solo política de revisión de código.",
          "exercise": "Define flujo de PR y deploy progresivo.",
          "id": "08.04",
          "domain": "08"
        }
      ],
      "snippets": [
        {
          "title": "Comandos de bundles",
          "language": "bash",
          "code": "databricks bundle validate -t dev\ndatabricks bundle deploy -t dev\ndatabricks bundle run -t dev order_etl\n\n# En un pipeline de CI/CD, validar antes del despliegue a prod\ndatabricks bundle validate -t prod",
          "comment": "Los targets y el recurso order_etl deben existir en databricks.yml. Autenticación y permisos dependen del workspace."
        }
      ]
    },
    {
      "id": "09",
      "name": "Modelado analítico",
      "weight": 5,
      "priority": "Media",
      "icon": "blocks",
      "summary": "Diseño físico y modelos de consumo: Delta/Iceberg, hechos/dimensiones, materialized views y metric views.",
      "foundation": [
        [
          "Grano antes que tablas",
          "Define qué representa una fila y sus claves antes de optimizar. Hechos transaccionales y dimensiones descriptivas tienen patrones de acceso diferentes."
        ],
        [
          "Materialized vs Metric Views",
          "Materialized views materializan resultados calculados; metric views definen métricas reutilizables y gobernadas. Son complementarias, no sustitutos directos."
        ],
        [
          "Layout físico",
          "Diseña tamaños de fichero razonables, clustering y compactación acorde a tamaño y consultas, sin crear millares de particiones pequeñas."
        ]
      ],
      "advanced": [
        [
          "Dimensionalidad y SCD",
          "La tabla de hechos debe enlazar correctamente con la dimensión vigente en la fecha del evento. SCD2 añade intervalos o versiones que requieren joins temporales."
        ],
        [
          "Delta vs Iceberg",
          "Valida interoperabilidad, soporte de características de tabla y ciclo de vida del catálogo antes de elegir formato."
        ]
      ],
      "decision": [
        [
          "BI",
          "Separa definición de indicador de materialización de resultados."
        ],
        [
          "Dimensiones",
          "Valida semántica temporal de SCD2."
        ]
      ],
      "fabric": "Fabric dispone de Warehouse, modelos dimensionales y medidas DAX. Metric views resuelven métricas gobernadas en Unity Catalog sin replicar el modelo semántico Power BI.",
      "pitfalls": [
        "Elegir la partición física por clave de cliente de cardinalidad extrema.",
        "Usar metric view suponiendo almacenamiento precalculado automáticamente."
      ],
      "links": [
        {
          "name": "Metric views",
          "url": "https://docs.databricks.com/aws/en/metric-views/"
        },
        {
          "name": "Materialized views",
          "url": "https://docs.databricks.com/aws/en/ldp/materialized-views"
        },
        {
          "name": "Liquid clustering",
          "url": "https://docs.databricks.com/aws/en/delta/clustering"
        },
        {
          "name": "Iceberg",
          "url": "https://docs.databricks.com/aws/en/iceberg"
        }
      ],
      "objectives": [
        {
          "title": "Layout Delta/Iceberg para grandes datasets",
          "concept": "Grano, agrupación, compactación, tamaños de fichero y patrones de acceso.",
          "trap": "Particionar por identificador único de alto cardinal.",
          "exercise": "Diseña layout para hechos de ventas de 500 M de filas.",
          "id": "09.01",
          "domain": "09"
        },
        {
          "title": "Modelado dimensional, MVs y Metric Views",
          "concept": "Dimensiones y hechos, agregados precomputados y definiciones gobernadas.",
          "trap": "Confundir métrica lógica con vista materializada.",
          "exercise": "Diseña estrella y KPI net_revenue gobernado.",
          "id": "09.02",
          "domain": "09"
        }
      ],
      "snippets": [
        {
          "title": "Agregado de consumo",
          "language": "sql",
          "code": "CREATE OR REPLACE MATERIALIZED VIEW dev.gold.daily_revenue AS\nSELECT order_date, store_id, SUM(net_amount) AS net_revenue\nFROM dev.silver.order_facts\nGROUP BY order_date, store_id;",
          "comment": "Ejemplo conceptual de MV SQL. Requiere compute y permisos adecuados; valida las limitaciones de tu edición."
        }
      ]
    }
  ],
  "labs": [
    {
      "id": "L01",
      "title": "Bronze resistente a cambios de esquema",
      "domain": "02",
      "minutes": 50,
      "level": "Realizable con datos simulados",
      "objectiveIds": [
        "02.01",
        "01.04"
      ],
      "goal": "Ingerir 3 lotes JSON con un campo añadido en el segundo lote y verificar qué información se rescata o evoluciona.",
      "steps": [
        "Preparar tres archivos JSON válidos: esquema base, campo extra y payload inválido.",
        "Configurar Auto Loader con schemaLocation y checkpoint persistentes.",
        "Ejecutar dos micro-lotes y registrar número de filas.",
        "Reiniciar la consulta con el mismo checkpoint y comprobar ausencia de reprocesamiento técnico.",
        "Analizar rescued data y documentar la estrategia de Silver."
      ],
      "verify": [
        "Con checkpoint igual, los ficheros procesados no reaparecen por reiniciar.",
        "Los registros inesperados están explicados; no se pierden silenciosamente."
      ],
      "note": "Si Free Edition limita el uso de ficheros externos, utiliza tablas Delta de prueba y documenta las opciones de Auto Loader con una maqueta.",
      "code": "spark.range(3).selectExpr('id AS order_id').write.mode('overwrite').saveAsTable('dev.bronze.orders_seed')"
    },
    {
      "id": "L02",
      "title": "CDC SCD1/SCD2 con cambios desordenados",
      "domain": "01",
      "minutes": 70,
      "level": "Workspace compatible con Lakeflow",
      "objectiveIds": [
        "01.07",
        "02.02"
      ],
      "goal": "Mantener dimensión de clientes tras insert/update/delete y llegada fuera de orden.",
      "steps": [
        "Crear stream de cambios con keys y sequence_by inequívoca.",
        "Configurar AUTO CDC SCD1.",
        "Repetir usando stored_as_scd_type=2.",
        "Inyectar dos updates fuera de orden y un delete.",
        "Inspeccionar intervalos __START_AT/__END_AT de la dimensión."
      ],
      "verify": [
        "La fila vigente refleja la secuencia lógica, no el orden de llegada.",
        "Las versiones históricas aparecen según el tipo SCD elegido."
      ],
      "note": "Si el entorno no admite AUTO CDC, resuelve manualmente la línea temporal y contrástala con la referencia oficial.",
      "code": "# Pseudocódigo: usa la API AUTO CDC según la versión del pipeline\n# KEYS (customer_id)\n# SEQUENCE BY event_version\n# STORED AS SCD TYPE 2"
    },
    {
      "id": "L03",
      "title": "Structured Streaming: watermarks y ventanas",
      "domain": "01",
      "minutes": 70,
      "level": "PySpark local o Databricks",
      "objectiveIds": [
        "01.12",
        "01.08"
      ],
      "goal": "Comprobar cuándo se completan ventanas y cómo afectan eventos tardíos.",
      "steps": [
        "Generar eventos con event_time y processing_time distintos.",
        "Crear ventana de cinco minutos y watermark de diez.",
        "Ejecutar varios micro-lotes con eventos fuera de orden.",
        "Analizar estado y output mode.",
        "Reiniciar con el mismo checkpoint."
      ],
      "verify": [
        "Explicas qué filas llegan demasiado tarde para la agregación.",
        "Los offsets y el estado se restauran sin empezar desde cero."
      ],
      "note": "No confundas un watermark con una regla universal de descarte.",
      "code": "events.withWatermark('event_time', '10 minutes').groupBy(F.window('event_time', '5 minutes')).count()"
    },
    {
      "id": "L04",
      "title": "Idempotencia de foreachBatch tras fallos",
      "domain": "01",
      "minutes": 55,
      "level": "PySpark + Delta",
      "objectiveIds": [
        "01.12"
      ],
      "goal": "Reproducir el reintento del mismo micro-lote y evitar escritura duplicada.",
      "steps": [
        "Diseñar destino con clave única lógica.",
        "Escribir lote con MERGE determinista.",
        "Provocar excepción tras el write antes de confirmación de lote.",
        "Reiniciar la consulta y observar repetición del batch.",
        "Comparar append no idempotente frente a MERGE."
      ],
      "verify": [
        "Número de pedidos únicos estable después de reintento.",
        "Documentadas las garantías reales y sus límites."
      ],
      "note": "El diseño de MERGE debe ser determinista y compatible con duplicados dentro de un mismo lote.",
      "code": "def upsert_batch(df, batch_id):\n    # Preparar MERGE por order_id para operación idempotente\n    print('processing batch', batch_id)"
    },
    {
      "id": "L05",
      "title": "Streaming table o materialized view",
      "domain": "01",
      "minutes": 45,
      "level": "Análisis + Databricks SQL",
      "objectiveIds": [
        "01.06",
        "09.02"
      ],
      "goal": "Definir dos destinos Gold y comparar latencia, correcciones históricas y coste de refresco.",
      "steps": [
        "Preparar origen append-only y otro que modifica importes anteriores.",
        "Definir latencia objetivo de 15 min y gasto permitido.",
        "Elegir streaming table para un caso y MV para otro.",
        "Revisar restricciones de refresco y respuesta a actualizaciones tardías.",
        "Anotar decisión de diseño con ventajas y límites."
      ],
      "verify": [
        "La elección se justifica por semántica y operación, no por nombre."
      ],
      "note": "El soporte incremental de materialized views depende del plan y características de consulta.",
      "code": "-- Revisa la sintaxis de CREATE STREAMING TABLE y CREATE MATERIALIZED VIEW\n-- en la versión y compute que utilices."
    },
    {
      "id": "L06",
      "title": "VARIANT y contratos Silver",
      "domain": "03",
      "minutes": 45,
      "level": "Databricks SQL",
      "objectiveIds": [
        "03.02",
        "03.01"
      ],
      "goal": "Extraer información de JSON heterogéneo sin ocultar errores de tipos.",
      "steps": [
        "Insertar JSON válido y JSON sin amount.",
        "Convertir STRING a VARIANT con parse_json.",
        "Extraer rutas con variant_get.",
        "Distinguir campo ausente, null y dato inválido.",
        "Definir esquema Silver con tipos."
      ],
      "verify": [
        "Se explica cómo se controla un campo ausente y un cast inválido."
      ],
      "note": "VARIANT puede requerir un runtime compatible.",
      "code": "SELECT variant_get(parse_json(payload), '$.order.id', 'STRING') AS id FROM dev.bronze.payloads;"
    },
    {
      "id": "L07",
      "title": "Calidad: WARN, DROP y FAIL",
      "domain": "03",
      "minutes": 55,
      "level": "Lakeflow Pipelines",
      "objectiveIds": [
        "03.04"
      ],
      "goal": "Decidir calidad de datos en una transformación crítica y diseñar cuarentena explícita.",
      "steps": [
        "Crear lote con importes negativos, IDs vacíos y duplicados.",
        "Implementar una expectation de observación y medir incidencia.",
        "Aplicar regla de descarte a registros claramente inválidos.",
        "Aplicar política de fallo ante incumplimiento crítico.",
        "Construir tabla de cuarentena conservando motivo de rechazo."
      ],
      "verify": [
        "Diferencias de WARN/DROP/FAIL explicadas.",
        "La cuarentena se ha implementado, no asumido."
      ],
      "note": "En algunas APIs la denominación de comportamiento cambia; confirma contra versión oficial.",
      "code": "# Ejemplo conceptual: expectations declarativas y rama de cuarentena.\n# Documentar reglas, métricas y propietarios antes de elegir DROP."
    },
    {
      "id": "L08",
      "title": "Optimizar un join con skew",
      "domain": "05",
      "minutes": 60,
      "level": "Spark / Databricks",
      "objectiveIds": [
        "05.05",
        "03.01"
      ],
      "goal": "Diagnosticar un join desequilibrado sin cambiar parámetros al azar.",
      "steps": [
        "Crear fact con 70% de registros en una sola clave.",
        "Hacer join con dimensión y medir etapas en Spark UI.",
        "Identificar tareas lentas y tamaño de shuffle.",
        "Comparar estrategia broadcast si dimensión lo permite.",
        "Registrar trade-offs antes/después."
      ],
      "verify": [
        "Separa skew, data-skipping y costes de shuffle."
      ],
      "note": "No fuerces broadcast si dimensión excede memoria disponible.",
      "code": "from pyspark.sql.functions import broadcast\njoined = fact.join(broadcast(dim), 'customer_id')"
    },
    {
      "id": "L09",
      "title": "Liquid clustering y CDF",
      "domain": "05",
      "minutes": 65,
      "level": "Workspace con Delta",
      "objectiveIds": [
        "05.02",
        "05.04",
        "05.06"
      ],
      "goal": "Comparar decisiones físicas y consumir cambios incrementales.",
      "steps": [
        "Preparar tabla grande con varias claves de acceso.",
        "Valorar partitioning frente a CLUSTER BY.",
        "Habilitar CDF antes de modificaciones nuevas.",
        "Aplicar UPDATE/DELETE y leer cambios.",
        "Medir y documentar efectos de mantenimiento."
      ],
      "verify": [
        "Distingues deletion vectors de eliminación física.",
        "CDF refleja únicamente cambios cubiertos desde activación y versiones retenidas."
      ],
      "note": "No es necesario ejecutar OPTIMIZE si el entorno no lo soporta: justifica la estrategia con documentación.",
      "code": "ALTER TABLE dev.silver.orders SET TBLPROPERTIES (delta.enableChangeDataFeed = true);"
    },
    {
      "id": "L10",
      "title": "Investigación de costes con system tables",
      "domain": "04",
      "minutes": 45,
      "level": "Cuenta con system tables",
      "objectiveIds": [
        "04.01",
        "04.04"
      ],
      "goal": "Atribuir DBUs a trabajos y proponer alertas accionables.",
      "steps": [
        "Revisar permisos de acceso a system.billing.usage.",
        "Agrupar usage_quantity por fecha y SKU.",
        "Investigar metadatos de job en registros de consumo.",
        "Especificar qué falta para el coste monetario total.",
        "Diseñar alertas por desviación de coste y frescura."
      ],
      "verify": [
        "Las métricas son reproducibles y el periodo correcto."
      ],
      "note": "Si el catálogo system no está disponible, diseña la consulta y documenta el límite de tu plan.",
      "code": "SELECT usage_date, SUM(usage_quantity) AS dbu FROM system.billing.usage GROUP BY usage_date;"
    },
    {
      "id": "L11",
      "title": "ABAC con PII y herencia de permisos",
      "domain": "06",
      "minutes": 65,
      "level": "UC y privilegios de administración",
      "objectiveIds": [
        "06.02",
        "07.02"
      ],
      "goal": "Proteger columnas tagged pii y verificar acceso efectivo por grupos.",
      "steps": [
        "Definir grupos analysts y finance.",
        "Crear tag gobernada pii y lista permitida de valores.",
        "Asignar la tag a columnas apropiadas.",
        "Crear o documentar política ABAC de enmascaramiento.",
        "Probar identidad lectora y evidencia de control."
      ],
      "verify": [
        "Separación entre grant, tag y política de máscara.",
        "Se prueba que el acceso no depende de copiar vistas."
      ],
      "note": "La creación de governed tags/policies puede necesitar administrador y runtime compatible.",
      "code": "-- Consulta el tutorial oficial de ABAC antes de ejecutar cambios de seguridad.\nSHOW GRANTS ON CATALOG dev;"
    },
    {
      "id": "L12",
      "title": "Derecho al olvido: eliminar no basta",
      "domain": "06",
      "minutes": 40,
      "level": "Análisis + Delta",
      "objectiveIds": [
        "06.05"
      ],
      "goal": "Diseñar un procedimiento verificable de borrado legal.",
      "steps": [
        "Inventariar Bronze/Silver/Gold, CDF, backups, exports y receptores externos.",
        "Aplicar DELETE lógico a registros de prueba.",
        "Analizar cuándo se eliminan archivos físicos bajo políticas de retención.",
        "Definir cómo propagar borrados a consumidores.",
        "Escribir evidencias de cumplimiento y riesgos residuales."
      ],
      "verify": [
        "No se confunde DELETE con purga física inmediata."
      ],
      "note": "No reducir VACUUM retention en entornos compartidos por un experimento.",
      "code": "DELETE FROM dev.silver.customers WHERE customer_id = 'TEST_ONLY';"
    },
    {
      "id": "L13",
      "title": "Proyecto modular y tests PySpark",
      "domain": "01",
      "minutes": 70,
      "level": "Local + Databricks",
      "objectiveIds": [
        "01.01",
        "01.11"
      ],
      "goal": "Extraer funciones de notebooks, instalar paquete y automatizar pruebas.",
      "steps": [
        "Crear paquete src/orderstream y tests/.",
        "Programar función pura de normalización de órdenes.",
        "Escribir test de esquema con assertSchemaEqual.",
        "Escribir test de filas con assertDataFrameEqual.",
        "Empaquetar un wheel e identificar dependencias del runtime."
      ],
      "verify": [
        "Pruebas pasan local y se entiende ejecución remota."
      ],
      "note": "Spark Connect y PySpark local tienen diferencias de instalación que debes revisar.",
      "code": "from pyspark.testing.utils import assertDataFrameEqual\nassertDataFrameEqual(actual_df, expected_df, checkRowOrder=False)"
    },
    {
      "id": "L14",
      "title": "Bundle dev/prod y repair run",
      "domain": "08",
      "minutes": 75,
      "level": "CLI y permisos",
      "objectiveIds": [
        "08.02",
        "08.03",
        "08.04"
      ],
      "goal": "Desplegar una definición reproducible y definir recuperación ante fallo.",
      "steps": [
        "Crear databricks.yml con recursos y targets dev/prod.",
        "Validar bundle con CLI.",
        "Desplegar en dev y ejecutar job parametrizado.",
        "Provocar fallo controlado en una task posterior.",
        "Evaluar repair sin duplicar datos y registrar parámetros efectivos."
      ],
      "verify": [
        "Bundle es reproducible sin acciones manuales en UI.",
        "Recuperación no asume rollback de tareas ejecutadas."
      ],
      "note": "Usa un workspace de prueba. Un deploy podría crear recursos y consumir compute.",
      "code": "databricks bundle validate -t dev\ndatabricks bundle deploy -t dev\ndatabricks bundle run -t dev order_etl"
    },
    {
      "id": "L15",
      "title": "Modelo Gold y métricas gobernadas",
      "domain": "09",
      "minutes": 60,
      "level": "Databricks SQL",
      "objectiveIds": [
        "09.01",
        "09.02"
      ],
      "goal": "Crear estrella de pedidos y separar definición de métricas y materialización.",
      "steps": [
        "Definir grano de fact_orders y dimensiones.",
        "Resolver dimensión cliente SCD2 según fecha del pedido.",
        "Crear agregado diario mediante materialized view.",
        "Definir net_revenue como metric view según soporte.",
        "Explicar por qué una no sustituye a la otra."
      ],
      "verify": [
        "Una sola definición del KPI y agregación usable en BI."
      ],
      "note": "Revisar disponibilidad de metric views en tu workspace/edición.",
      "code": "SELECT date_trunc('day', order_ts) AS day, SUM(net_amount) AS net_revenue FROM dev.gold.fact_orders GROUP BY 1;"
    },
    {
      "id": "L16",
      "title": "Postmortem de producción end-to-end",
      "domain": "08",
      "minutes": 90,
      "level": "Análisis guiado",
      "objectiveIds": [
        "08.01",
        "04.03",
        "05.05"
      ],
      "goal": "Actuar como arquitecto ante latencia elevada, anomalías, errores y fuga de costes.",
      "steps": [
        "Define incident timeline y señales observables.",
        "Analiza 4 hipótesis: schema drift, skew, permisos y checkpoint.",
        "Escoge mediciones para refutar cada hipótesis.",
        "Propón recuperación idempotente y medidas preventivas.",
        "Redacta ADR y runbook de operaciones."
      ],
      "verify": [
        "El runbook separa síntoma, causa raíz, mitigación y prevención.",
        "Las decisiones tienen costes y riesgos explícitos."
      ],
      "note": "Laboratorio plenamente realizable sin compute con datos y logs simulados.",
      "code": "# Entregables: ADR.md, runbook.md, incident_timeline.csv\n# Criterio de calidad: hipótesis, evidencia, recuperación y prevención."
    }
  ],
  "roadmap": [
    {
      "week": 1,
      "title": "Diagnóstico e ingesta",
      "domains": [
        "02"
      ],
      "hours": 7,
      "deliverable": "Mapa de lagunas y laboratorio Bronze robusto",
      "tasks": [
        "Lectura de objetivos 02.01–02.05",
        "L01 · Cambios de esquema",
        "Tabla de decisión CDC vs full load vs Federation"
      ]
    },
    {
      "week": 2,
      "title": "CDC y Lakeflow Connect",
      "domains": [
        "01",
        "02"
      ],
      "hours": 8,
      "deliverable": "Dimensión SCD2 con casos fuera de orden",
      "tasks": [
        "Estudiar AUTO CDC y sequence_by",
        "L02 · SCD1/SCD2",
        "Diseñar captura de cambios desde PostgreSQL"
      ]
    },
    {
      "week": 3,
      "title": "Structured Streaming profundo",
      "domains": [
        "01"
      ],
      "hours": 9,
      "deliverable": "Stream recuperable y escritura idempotente",
      "tasks": [
        "Checkpoint, estado, watermark y output modes",
        "L03 · Ventanas",
        "L04 · Reintentos foreachBatch"
      ]
    },
    {
      "week": 4,
      "title": "Lakeflow, Jobs y testing",
      "domains": [
        "01"
      ],
      "hours": 8,
      "deliverable": "Paquete PySpark testeado y criterios de MV",
      "tasks": [
        "L05 · Streaming table vs MV",
        "L13 · Tests PySpark",
        "Revisar dependencias de bundles"
      ]
    },
    {
      "week": 5,
      "title": "Manipulación y calidad",
      "domains": [
        "03"
      ],
      "hours": 8,
      "deliverable": "Silver con validación y cuarentena",
      "tasks": [
        "L06 · VARIANT",
        "L07 · Expectations",
        "Revisar funciones IA y ventanas"
      ]
    },
    {
      "week": 6,
      "title": "Rendimiento y Delta",
      "domains": [
        "05"
      ],
      "hours": 9,
      "deliverable": "Análisis antes/después con Spark UI",
      "tasks": [
        "L08 · Join skew",
        "L09 · Clustering y CDF",
        "Revisar caching y predictive optimization"
      ]
    },
    {
      "week": 7,
      "title": "Observabilidad",
      "domains": [
        "04"
      ],
      "hours": 7,
      "deliverable": "SLOs, alertas y costes atribuibles",
      "tasks": [
        "L10 · System tables",
        "Revisar event logs y Jobs API",
        "Diseñar dashboard de operación"
      ]
    },
    {
      "week": 8,
      "title": "Seguridad y gobierno",
      "domains": [
        "06",
        "07"
      ],
      "hours": 8,
      "deliverable": "Modelo de acceso/PII con política de supresión",
      "tasks": [
        "L11 · ABAC y herencia",
        "L12 · Right-to-erasure",
        "Matriz roles-permisos"
      ]
    },
    {
      "week": 9,
      "title": "Despliegue y modelado",
      "domains": [
        "08",
        "09"
      ],
      "hours": 8,
      "deliverable": "Bundle dev/prod y Gold dimensional",
      "tasks": [
        "L14 · Bundles y repair",
        "L15 · Metric views",
        "Diseño de CI/CD y rollback"
      ]
    },
    {
      "week": 10,
      "title": "Producción y consolidación",
      "domains": [
        "01",
        "04",
        "05",
        "08"
      ],
      "hours": 8,
      "deliverable": "Postmortem y checklist de preparación",
      "tasks": [
        "L16 · Incidente end-to-end",
        "Revisar todos los objetivos pendientes",
        "Reservar un hueco para el simulador futuro"
      ]
    }
  ],
  "comparisons": [
    [
      "Ingesta de archivos",
      "Auto Loader",
      "Copy activity / Spark notebooks",
      "En ambos decide si haces streaming o batch; Auto Loader mantiene progreso y evolución específica."
    ],
    [
      "Orquestación",
      "Lakeflow Jobs",
      "Data Pipelines",
      "Jobs añade modelo de tasks, repairs, control flow y APIs propios."
    ],
    [
      "Transformación declarativa",
      "Lakeflow Pipelines",
      "Notebooks + pipelines / Dataflow Gen2",
      "No existe equivalencia exacta 1:1: se define un grafo de datasets."
    ],
    [
      "Data streaming",
      "Structured Streaming",
      "Spark notebooks / Eventstream",
      "Spark comparte semántica; Eventstream no es la misma API ni motor."
    ],
    [
      "Cambios relacionales",
      "Lakeflow Connect + AUTO CDC",
      "Pipelines + conectores + lógica MERGE",
      "Conectar captura de cambios y aplicar su semántica son decisiones separadas."
    ],
    [
      "Tablas abiertas",
      "Delta / Iceberg",
      "Delta sobre OneLake",
      "Revisa lectores, catálogo, modos de escritura y características soportadas."
    ],
    [
      "Catálogo y permisos",
      "Unity Catalog",
      "Gobierno Fabric/OneLake",
      "Diferencias en jerarquía, herencia y ABAC."
    ],
    [
      "Seguridad por atributos",
      "UC ABAC + governed tags",
      "RLS/OLS + etiquetas",
      "No asumir equivalencia completa con RLS en modelos semánticos."
    ],
    [
      "Datos semi-estructurados",
      "VARIANT",
      "Spark SQL / JSON tipado",
      "VARIANT tiene tipo y funciones específicas en Databricks."
    ],
    [
      "Vistas materializadas",
      "Materialized views",
      "Warehouse / artefactos de actualización",
      "Considerar coste de refresco e incrementalidad real."
    ],
    [
      "Métricas reutilizables",
      "Unity Catalog Metric Views",
      "Power BI semantic models / DAX",
      "Objetivo parecido; alcance, semántica y consumo diferente."
    ],
    [
      "CI/CD",
      "Declarative Automation Bundles",
      "Git + Deployment Pipelines + IaC",
      "Databricks declara jobs y pipelines mediante YAML por targets."
    ],
    [
      "Monitorización",
      "System Tables y event logs",
      "Monitoring Hub y Capacity Metrics",
      "Costes, granularidad y permisos no son equivalentes."
    ],
    [
      "Mantenimiento Delta",
      "Predictive Optimization y Liquid Clustering",
      "OPTIMIZE/V-Order y controles Spark",
      "No extrapolar funciones de Databricks a Fabric."
    ],
    [
      "Consultas sin copia",
      "Lakehouse Federation",
      "Shortcuts / conectores",
      "Federation consulta remoto con conexiones gobernadas."
    ],
    [
      "Compartición",
      "OpenSharing / Delta Sharing",
      "OneLake data sharing / permisos",
      "Comparar fronteras organizativas y restricciones de seguridad."
    ]
  ],
  "glossary": [
    {
      "term": "AUTO CDC",
      "definition": "API de Lakeflow para aplicar eventos de cambio a destinos con SCD Type 1 o 2.",
      "domain": "01"
    },
    {
      "term": "sequence_by",
      "definition": "Orden lógico usado para resolver qué cambio ocurre después por clave.",
      "domain": "01"
    },
    {
      "term": "SCD Type 1",
      "definition": "Mantiene únicamente el valor actual, sobrescribiendo historia de atributos.",
      "domain": "01"
    },
    {
      "term": "SCD Type 2",
      "definition": "Conserva versiones históricas de dimensiones y sus intervalos de vigencia.",
      "domain": "01"
    },
    {
      "term": "foreachBatch",
      "definition": "Procesa cada micro-lote con lógica personalizada; exige diseñar idempotencia del destino.",
      "domain": "01"
    },
    {
      "term": "Checkpoint",
      "definition": "Ubicación de estado y progreso para recuperación de una consulta streaming.",
      "domain": "01"
    },
    {
      "term": "Watermark",
      "definition": "Umbral de tardanza ligado al tiempo de evento para limitar estado en operaciones elegibles.",
      "domain": "01"
    },
    {
      "term": "Output mode",
      "definition": "Cómo se emiten resultados de una consulta streaming: append, update o complete según operación/sink.",
      "domain": "01"
    },
    {
      "term": "Streaming table",
      "definition": "Objeto administrado para procesamiento incremental según el modelo Lakeflow.",
      "domain": "01"
    },
    {
      "term": "Materialized view",
      "definition": "Objeto cuyo resultado persistido se actualiza mediante refrescos.",
      "domain": "01"
    },
    {
      "term": "Unity Catalog function",
      "definition": "Función gobernada/compartida mediante catálogo, esquemas y permisos.",
      "domain": "01"
    },
    {
      "term": "Pandas UDF",
      "definition": "Función vectorizada que intercambia batches columnares con Spark y Python.",
      "domain": "01"
    },
    {
      "term": "assertDataFrameEqual",
      "definition": "Utilidad para comparar contenido de DataFrames en tests PySpark.",
      "domain": "01"
    },
    {
      "term": "Declarative Automation Bundles",
      "definition": "Proyecto declarativo que agrupa recursos, código y targets para despliegue.",
      "domain": "08"
    },
    {
      "term": "databricks.yml",
      "definition": "Archivo raíz de configuración principal de bundles.",
      "domain": "08"
    },
    {
      "term": "Git folders",
      "definition": "Integración con repositorios Git dentro del workspace Databricks.",
      "domain": "08"
    },
    {
      "term": "Repair run",
      "definition": "Reejecución dirigida de determinadas tareas de un run de Jobs fallido.",
      "domain": "08"
    },
    {
      "term": "Auto Loader",
      "definition": "Servicio de ingestión incremental de ficheros desde almacenamiento cloud.",
      "domain": "02"
    },
    {
      "term": "Schema rescue",
      "definition": "Conservación de datos que no encajan en el esquema previsto.",
      "domain": "02"
    },
    {
      "term": "Lakeflow Connect",
      "definition": "Conectores gestionados para fuentes empresariales y CDC según disponibilidad.",
      "domain": "02"
    },
    {
      "term": "Lakehouse Federation",
      "definition": "Acceso gobernado a fuentes remotas mediante conexiones/catálogos externos.",
      "domain": "02"
    },
    {
      "term": "Delta Sharing",
      "definition": "Protocolo abierto para compartir datasets de forma controlada.",
      "domain": "02"
    },
    {
      "term": "OpenSharing",
      "definition": "Opciones de compartición Databricks a Databricks u otros consumidores compatibles.",
      "domain": "02"
    },
    {
      "term": "Clean Rooms",
      "definition": "Colaboración controlada para analizar datos entre participantes sin acceso abierto.",
      "domain": "02"
    },
    {
      "term": "Apache Iceberg",
      "definition": "Formato abierto de tabla con metadatos transaccionales; interoperabilidad sujeta a capacidades.",
      "domain": "02"
    },
    {
      "term": "VARIANT",
      "definition": "Tipo de dato Databricks orientado a contenido semiestructurado.",
      "domain": "03"
    },
    {
      "term": "parse_json",
      "definition": "Función que analiza JSON para convertirlo a VARIANT.",
      "domain": "03"
    },
    {
      "term": "variant_get",
      "definition": "Función de extracción de valor de una ruta de VARIANT con tipo esperado.",
      "domain": "03"
    },
    {
      "term": "ai_query",
      "definition": "Función para invocar inferencia de un modelo habilitado desde una consulta.",
      "domain": "03"
    },
    {
      "term": "Expectation",
      "definition": "Condición declarativa de calidad dentro de Lakeflow Pipelines.",
      "domain": "03"
    },
    {
      "term": "Quarantine",
      "definition": "Diseño explícito de almacenamiento/etiquetado de filas no válidas.",
      "domain": "03"
    },
    {
      "term": "Row_number",
      "definition": "Función de ventana que asigna número secuencial por partición y orden.",
      "domain": "03"
    },
    {
      "term": "Anti join",
      "definition": "Join que conserva filas de un lado sin coincidencia en el otro.",
      "domain": "03"
    },
    {
      "term": "System tables",
      "definition": "Tablas de metadatos de cuenta para consumo, acceso, computación y operación.",
      "domain": "04"
    },
    {
      "term": "Event log",
      "definition": "Eventos operativos de pipelines, incluidos fallos y métricas de calidad.",
      "domain": "04"
    },
    {
      "term": "Data freshness",
      "definition": "Tiempo desde última actualización efectiva del dataset.",
      "domain": "04"
    },
    {
      "term": "SLO",
      "definition": "Objetivo medible de servicio: frescura, disponibilidad, errores o latencia.",
      "domain": "04"
    },
    {
      "term": "DBU",
      "definition": "Unidad de consumo de Databricks, no coste total de infraestructura por sí sola.",
      "domain": "04"
    },
    {
      "term": "Liquid Clustering",
      "definition": "Diseño físico orientado a accesos sin particionamiento rígido por columnas.",
      "domain": "05"
    },
    {
      "term": "CLUSTER BY AUTO",
      "definition": "Selección automática de claves de clustering donde está disponible.",
      "domain": "05"
    },
    {
      "term": "Predictive Optimization",
      "definition": "Automatización de mantenimiento compatible para tablas gestionadas.",
      "domain": "05"
    },
    {
      "term": "Deletion vector",
      "definition": "Mecanismo que marca filas eliminadas sin reescribir inmediatamente todo el archivo.",
      "domain": "05"
    },
    {
      "term": "Change Data Feed (CDF)",
      "definition": "Funcionalidad Delta que registra cambios de fila para consumidores incrementales.",
      "domain": "05"
    },
    {
      "term": "Data skipping",
      "definition": "Salto de archivos/bloques que no cumplen filtros gracias a estadísticas.",
      "domain": "05"
    },
    {
      "term": "Shuffle",
      "definition": "Redistribución de datos entre particiones durante una operación Spark.",
      "domain": "05"
    },
    {
      "term": "Skew",
      "definition": "Distribución desigual de datos que ralentiza algunas tareas frente a otras.",
      "domain": "05"
    },
    {
      "term": "Spill",
      "definition": "Volcado a disco por presión de memoria durante operaciones.",
      "domain": "05"
    },
    {
      "term": "ABAC",
      "definition": "Control de acceso por atributos asociados a objetos, evaluados por políticas.",
      "domain": "06"
    },
    {
      "term": "Governed tag",
      "definition": "Etiqueta controlada por administradores usada para clasificación y políticas.",
      "domain": "06"
    },
    {
      "term": "Column mask",
      "definition": "Transformación condicionada del valor visible de una columna.",
      "domain": "06"
    },
    {
      "term": "Row filter",
      "definition": "Filtro que limita filas visibles según la política e identidad.",
      "domain": "06"
    },
    {
      "term": "Pseudonimización",
      "definition": "Transformación de identificadores que puede permitir vinculación/reidentificación con información adicional.",
      "domain": "06"
    },
    {
      "term": "Right to erasure",
      "definition": "Requisito de supresión que exige estrategia de datos, historial y receptores.",
      "domain": "06"
    },
    {
      "term": "USAGE",
      "definition": "Privilegio que permite navegar/usar ciertos contenedores UC según jerarquía.",
      "domain": "07"
    },
    {
      "term": "Permission inheritance",
      "definition": "Aplicación de determinadas concesiones de nivel superior a objetos descendientes.",
      "domain": "07"
    },
    {
      "term": "Metric view",
      "definition": "Definición gobernada reutilizable de indicadores analíticos en Unity Catalog.",
      "domain": "09"
    },
    {
      "term": "Dimensional grain",
      "definition": "Evento o entidad representados por una fila de tabla de hechos.",
      "domain": "09"
    }
  ],
  "associate": {
    "platform": 100,
    "ingestion": 44,
    "transform": 70,
    "jobs": 100,
    "cicd": 80,
    "security": 83
  },
  "meta": {
    "version": "1.0.0",
    "date": "2026-10-21",
    "objectives": 45,
    "description": "Campus profesional interactivo para certificación Databricks Data Engineer Professional: teoría, laboratorios, seguimiento y notas."
  }
};
