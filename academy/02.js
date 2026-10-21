window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "02.01": {
    "title": "Formatos de entrada y semántica de lectura",
    "why": "La ingesta no consiste solo en que Spark pueda leer un formato. Debes conocer la unidad de descubrimiento, esquema, consistencia y evolución de cada fuente.",
    "mechanics": [
      "CSV y JSON necesitan reglas de parseo y schema; Parquet incorpora tipos y lectura columnar; Delta añade transaction log, evolución y garantías ACID; Iceberg utiliza sus propios metadatos y snapshots.",
      "Los formatos binarios y eventos requieren parseadores o deserializadores; evita inferencias ambiguas para datos críticos. La lectura directa de archivos no equivale necesariamente a Auto Loader con checkpoint.",
      "Diseña Bronze como representación fiel de la fuente, preservando metadatos de origen, fecha de ingesta e identificador de evento para auditoría."
    ],
    "steps": [
      "Explica fallos de parseo y estrategia de quarantena/rescate.",
      "Distingue carga completa, incremento por ficheros y consulta a tabla transaccional."
    ],
    "example": {
      "language": "python",
      "code": "df = (spark.read.format(\"json\")\n  .option(\"mode\", \"PERMISSIVE\")\n  .load(input_path))\ndf.printSchema()\n# Para descubrimiento incremental usa readStream+cloudFiles.",
      "note": "Fragmento batch; la opción de parseo no garantiza validez de negocio."
    },
    "challenge": {
      "question": "Una tabla Parquet se sobrescribe parcialmente durante tu lectura. ¿Qué diferencia aporta Delta?",
      "answer": "Su transaction log permite leer versiones consistentes y commits ACID. Parquet sin un formato de tabla transaccional no proporciona esas mismas garantías."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/ingestion/"
      }
    ]
  },
  "02.02": {
    "title": "CDC incremental: del log de cambios al destino",
    "why": "Un snapshot y un feed CDC no tienen la misma semántica. CDC contiene eventos insert/update/delete con orden; si omites deletes o secuencia puedes reconstruir un estado incorrecto.",
    "mechanics": [
      "Separa captura del origen, transporte de eventos, staging raw y aplicación en Silver. Mantén trazabilidad de identificadores y posición de log.",
      "En Delta, CDF facilita consumo incremental de cambios cuando está habilitado y existe historia retenida. No es una copia eterna del registro: operaciones de VACUUM y retención afectan capacidad de reconstruir.",
      "Para destinos Iceberg o Delta valida quién administra commits y qué esquema de upsert está disponible. El formato de almacenamiento no resuelve por sí mismo la ordenación de eventos."
    ],
    "steps": [
      "Planifica una carga inicial seguida de CDC sin brechas entre snapshot y stream.",
      "Prueba delete físico/lógico, evento tardío y reintento del mismo cambio."
    ],
    "example": {
      "language": "sql",
      "code": "ALTER TABLE dev.silver.orders\nSET TBLPROPERTIES (delta.enableChangeDataFeed = true);\nSELECT * FROM table_changes('dev.silver.orders', 10);",
      "note": "10 es una versión ilustrativa existente; revisa retención y habilitación de CDF."
    },
    "challenge": {
      "question": "Un consumidor estuvo parado semanas y ya no puede leer una versión antigua de CDF. ¿Qué haces?",
      "answer": "Evalúa retención y versiones disponibles: puede necesitar un nuevo snapshot y reconciliación. CDF no es un archivo CDC perpetuo."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/delta/delta-change-data-feed"
      }
    ]
  },
  "02.03": {
    "title": "Lakeflow Connect: CDC relacional gestionado",
    "why": "La captura de cambios desde PostgreSQL y otras fuentes gestionadas no equivale a un simple SELECT periódico. Exige permisos y una estrategia de snapshot+incrementales consistente.",
    "mechanics": [
      "Lakeflow Connect separa conexión y pipeline de ingesta. Su alcance depende de la fuente, versión y estado del conector; no presupongas que cualquier BD tiene las mismas capacidades.",
      "La carga inicial debe dejar un punto de continuación consistente para los eventos incrementales. En PostgreSQL es relevante la replicación lógica, slots, WAL y políticas de retención, según la integración.",
      "Las restricciones de red, privilegios, cambios de esquema y costes operativos afectan el diseño más que una captura de pantalla del asistente."
    ],
    "steps": [
      "Revisa requisitos del conector concreto antes de estimar esfuerzo o SLA.",
      "Documenta la recuperación cuando se pierde la posición de log o caduca el slot."
    ],
    "example": {
      "language": "sql",
      "code": "-- Consulta informativa ejecutada en PostgreSQL de origen:\nSELECT slot_name, plugin, active\nFROM pg_replication_slots;",
      "note": "Requiere permisos y que la integración utilice slots; no es un comando Databricks SQL."
    },
    "challenge": {
      "question": "Tras una parada prolongada el conector no logra continuar el CDC. ¿Qué investigar?",
      "answer": "Retención de WAL/log, estado y posición de replicación, derechos, conectividad y mecanismo soportado para resnapshot sin perder cambios."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/ingestion/lakeflow-connect/"
      }
    ]
  },
  "02.04": {
    "title": "OpenSharing, Delta Sharing y Clean Rooms",
    "why": "Compartir datos sin duplicarlos exige separar el acceso lógico del movimiento de información. Una Clean Room introduce condiciones de colaboración y privacidad, no solo otra forma de conceder SELECT.",
    "mechanics": [
      "Delta Sharing permite compartir datasets mediante protocolo abierto con destinatarios compatibles, sujeto a privilegios y modelo de proveedor/receptor.",
      "Clean Rooms facilita análisis conjunto controlado para partes que no desean exponer datos crudos entre sí. Evalúa políticas permitidas, costes y restricciones del producto.",
      "Un proyecto debe distinguir datasets internos a UC, compartición externa, federación y ejecución de consultas conjuntas."
    ],
    "steps": [
      "Pregunta quién custodia el dato, dónde se ejecuta la consulta y qué resultados se pueden extraer.",
      "Revisa revocación, auditoría y capacidad real de impedir inferencias."
    ],
    "example": {
      "language": "sql",
      "code": "-- Consulta ordinaria al dataset recibido (según catálogo):\nSELECT COUNT(*) AS customers\nFROM shared_catalog.analytics.customers;",
      "note": "Esquema ilustrativo. La configuración Delta Sharing/Clean Room ocurre en UC y recursos de colaboración."
    },
    "challenge": {
      "question": "Dos empresas quieren sumar clientes coincidentes sin intercambiar identificadores en claro. ¿Basta Delta Sharing?",
      "answer": "No necesariamente. Es un problema de cómputo colaborativo y privacidad; estudia Clean Rooms y controles de output permitidos además del mecanismo de compartir datasets."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/delta-sharing/"
      }
    ]
  },
  "02.05": {
    "title": "Lakehouse Federation: consulta remota, no ingesta",
    "why": "Federation conecta motores externos para consultarlos desde Databricks, pero no sustituye automáticamente a un proceso de ingestión o CDC si necesitas baja latencia, histórico fiable o muchas lecturas.",
    "mechanics": [
      "Se declara una conexión y un catálogo foráneo con credenciales y permisos pertinentes; los datos pueden permanecer en la fuente, sujetos a sus costes y capacidad.",
      "Las capacidades de predicate pushdown varían por fuente, consulta y conector. Joins entre orígenes pueden provocar movimiento de datos elevado.",
      "Compara latencia, consistencia, costes de egress, residencia y permisos antes de adoptar un patrón federado."
    ],
    "steps": [
      "Elige Federation para acceso puntual/virtualizado cuando SLA y volumen lo permitan.",
      "Prefiere ingesta administrada para cargas persistentes, grandes agregaciones o independencia de la fuente."
    ],
    "example": {
      "language": "sql",
      "code": "-- Esquema conceptual: consulta tabla foránea existente\nSELECT region, COUNT(*) AS n\nFROM foreign_catalog.public.accounts\nWHERE status = 'ACTIVE'\nGROUP BY region;",
      "note": "Se requiere catálogo foráneo con conexión creada y permisos."
    },
    "challenge": {
      "question": "Un dashboard ejecuta joins pesados sobre 200 M filas federadas cada cinco minutos. ¿Qué decides?",
      "answer": "Mide pushdown, latencia y carga del sistema remoto; una réplica incremental administrada en Delta puede ser más sostenible."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/query-federation/"
      }
    ]
  }
});
