window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "04.01": {
    "title": "System tables: consumo, facturación y auditoría",
    "why": "Las system tables permiten observar uso y eventos de la cuenta, pero necesitan habilitación, permisos y una interpretación correcta de unidades y metadatos.",
    "mechanics": [
      "system.billing.usage contiene unidades de uso atribuidas a SKUs, identidades y recursos; unir con tablas de precios requiere seleccionar la tarifa aplicable por periodo y SKU.",
      "Filtra por workspace, job, pipeline y custom tags para atribución, sin presuponer que cada registro identifica una única consulta.",
      "La auditoría de accesos se consulta mediante tablas de auditoría disponibles; evita exponer PII contenida en logs a un perfil de observación demasiado amplio."
    ],
    "steps": [
      "Distingue DBU de coste total de nube y evita confundir precio lista con coste negociado.",
      "Separa panel de facturación y panel de fiabilidad/latencia."
    ],
    "example": {
      "language": "sql",
      "code": "SELECT usage_date, sku_name, SUM(usage_quantity) AS dbus\nFROM system.billing.usage\nWHERE usage_date >= date_sub(current_date(), 7)\nGROUP BY usage_date, sku_name ORDER BY usage_date DESC;",
      "note": "DBUs agregadas, no euros; requiere acceso a system.billing.usage."
    },
    "challenge": {
      "question": "El gasto por Job sube un 40 %: ¿cómo separas volumen, tiempo y precio?",
      "answer": "Segmenta SKU y job, compara consumo y duración por ejecución, cambios de volumen de entrada y tarifas vigentes. Correlaciona con rendimiento y reintentos."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/admin/usage/system-tables"
      }
    ]
  },
  "04.02": {
    "title": "Jobs y pipelines mediante API, CLI y SDK",
    "why": "Operar a escala requiere interfaces automatizables y una identidad autorizada. UI, CLI y SDK acceden a recursos coherentes; las diferencias están en ergonomía y control de versiones.",
    "mechanics": [
      "Jobs API permite listar ejecuciones, consultar estados, parámetros y tareas; el SDK aporta clientes tipados. Las respuestas pueden paginarse, por lo que no basta con leer una única página.",
      "La monitorización debe correlacionar job_id, run_id, task_key y periodos con logs de la plataforma y las tablas de uso.",
      "Define etiquetas de severidad y una política de alertas que distinga fallos recuperables de errores persistentes."
    ],
    "steps": [
      "Registra run_id y parámetros efectivos antes de reparar.",
      "No copies un PAT personal a producción: usa identidad de servicio según política."
    ],
    "example": {
      "language": "bash",
      "code": "databricks jobs list\n# Identifica el job y consulta ejecuciones:\ndatabricks jobs list-runs --job-id 12345",
      "note": "ID ilustrativo y CLI configurada."
    },
    "challenge": {
      "question": "Tu monitor ve solo las primeras 25 ejecuciones y omite un incidente. ¿Qué revisar?",
      "answer": "Paginación de la API y filtros de consulta, además de límites de permisos y retención. Una llamada aislada no basta para monitorizar un estate grande."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/jobs/"
      }
    ]
  },
  "04.03": {
    "title": "Event logs de Lakeflow Pipelines",
    "why": "El event log registra el ciclo de vida de datasets y flows y ofrece evidencias de calidad y rendimiento. Permite analizar causas, no solo ver un estado rojo en la UI.",
    "mechanics": [
      "Los eventos se distinguen por event_type; flow_progress aporta progreso y métricas, con detalles estructurados que varían por evento.",
      "Puede consultarse mediante event_log(pipeline_id) con permisos adecuados o publicarse como tabla gestionada. No expongas el raw indiscriminadamente.",
      "Las métricas de expectativas permiten analizar registros válidos/incorrectos, pero algunas métricas dependen de tipo de fuente y versión."
    ],
    "steps": [
      "Filtra por update_id y flow para no mezclar ejecuciones.",
      "Explica si falló lectura, validación, transformación o publicación."
    ],
    "example": {
      "language": "sql",
      "code": "SELECT timestamp, event_type, message\nFROM event_log('PIPELINE_ID')\nWHERE event_type IN ('flow_progress','create_update')\nORDER BY timestamp DESC LIMIT 100;",
      "note": "Sustituye el ID de pipeline y verifica permisos de lectura."
    },
    "challenge": {
      "question": "Los gráficos muestran tablas actualizadas, pero la calidad cae desde ayer. ¿Dónde consultas?",
      "answer": "Event log por flow/update_id, métricas de expectations y fuente de registros inválidos; correlaciona con schema drift y versiones desplegadas."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/ldp/monitor-event-logs"
      }
    ]
  },
  "04.04": {
    "title": "Alertas sobre Lakehouse y SLOs",
    "why": "Una alerta útil comprueba condiciones operativas observables, con umbrales, responsables y acción definida. No debe convertirse en una notificación por cada fallo transitorio.",
    "mechanics": [
      "SQL Alerts puede evaluar consultas según programación y notificar a destinos autorizados. Diseña consultas para backlog, freshness, tasa de error o registros inválidos.",
      "Define SLI (medida), SLO (objetivo interno) y SLA (compromiso externo) con ventanas de evaluación compatibles.",
      "Ajusta deduplicación, severidad y periodos de silencio para evitar alert fatigue; incluye enlaces al runbook."
    ],
    "steps": [
      "Prueba que los datos detrás de la alerta se refrescan a tiempo.",
      "Distingue un job terminado en verde de datos realmente frescos."
    ],
    "example": {
      "language": "sql",
      "code": "SELECT MAX(event_time) AS latest_event,\n       timestampdiff(MINUTE, MAX(event_time), current_timestamp()) AS lag_min\nFROM dev.silver.orders;",
      "note": "Una query de frescura; una alerta debe manejar caso de tabla vacía y retrasos del reloj."
    },
    "challenge": {
      "question": "El Job finaliza en verde pero el dashboard lleva 2 horas congelado. ¿Qué alerta necesitas?",
      "answer": "Freshness de los datos y backlog de la fuente, no solo estado del Job. Define tiempo máximo tolerado y responsables."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/sql/user/alerts/"
      }
    ]
  },
  "04.05": {
    "title": "Diagnóstico y reparación de ejecuciones Jobs",
    "why": "El estado final del Job no dice qué dependencia ni qué task falló. La raíz suele localizarse comparando inputs, parámetros, permisos, métricas y logs de la tarea afectada.",
    "mechanics": [
      "Inspecciona timeline, retries, task runs, notebook output y error stack. El repair run puede reutilizar resultados de tareas anteriores según la configuración.",
      "Una reparación no es un rollback global: si una tarea que ya terminó generó efectos externos, esos cambios permanecen salvo compensación expresa.",
      "Documenta qué parámetros pueden cambiar entre intento original y reparación, y cómo garantizar la reconciliación de resultados."
    ],
    "steps": [
      "Crea runbooks por tipo de fallo y exige un test de idempotencia.",
      "No confundas un fallo de plataforma con un dato fuente inválido."
    ],
    "example": {
      "language": "bash",
      "code": "# Consultar ejecuciones del Job:\ndatabricks jobs list-runs --job-id 12345\n# Reparación: usar la interfaz o Jobs API con run_id real",
      "note": "La sintaxis de reparación concreta depende de la versión de CLI/API."
    },
    "challenge": {
      "question": "Un flujo falla en la última tarea después de publicar Silver. ¿Cómo lo reparas?",
      "answer": "Identifica efectos ya realizados y repara solo tareas necesarias si es seguro, verificando idempotencia y parámetros. El resto no se deshace automáticamente."
    },
    "docs": [
      {
        "name": "Referencia oficial",
        "url": "https://docs.databricks.com/aws/en/jobs/repair-job-failures"
      }
    ]
  }
});
