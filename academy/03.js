window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "03.01": {
    "title": "Transformaciones complejas y ventanas",
    "why": "La corrección de joins y windows es tan importante como su coste. Una agregación correcta con grano erróneo produce KPIs incorrectos aunque termine rápido.",
    "mechanics": [
      "Define el grano y unicidad esperada de cada entrada antes de hacer un JOIN. Una relación uno-a-muchos puede multiplicar filas y sumas.",
      "Las ventanas permiten ranking, deduplicación y acumulados sin colapsar filas. Su coste depende del particionado lógico, orden y volumen.",
      "Selecciona funciones nativas antes de UDF; inspecciona el plan físico en operaciones con shuffle y grandes órdenes."
    ],
    "steps": [
      "Especifica desempate determinista al usar row_number para deduplicar.",
      "Antes/después de cada JOIN verifica cardinalidad de claves y recuentos."
    ],
    "example": {
      "language": "sql",
      "code": "WITH ranked AS (\n SELECT *, row_number() OVER (\n PARTITION BY order_id ORDER BY change_version DESC, ingest_ts DESC\n ) AS rn FROM dev.bronze.orders)\nSELECT * EXCEPT (rn) FROM ranked WHERE rn = 1;",
      "note": "Usa un criterio total de orden si puede haber empates en change_version e ingest_ts."
    },
    "challenge": {
      "question": "Un JOIN incrementa por 20 la facturación sin error técnico. ¿Qué revisar?",
      "answer": "Multiplicación de filas por claves no únicas y grano incompatible; cuenta coincidencias por clave y agrega/deduplica antes del join según semántica."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/transform/"
      }
    ]
  },
  "03.02": {
    "title": "VARIANT y datos semiestructurados",
    "why": "VARIANT almacena datos semiestructurados con tipos internos. No es lo mismo que un STRING con JSON; esa diferencia afecta extracción, errores y evolución de esquema.",
    "mechanics": [
      "parse_json convierte texto JSON válido a VARIANT. variant_get extrae rutas y requiere un tipo destino; try_variant_get puede servir cuando quieres NULL en lugar de error por algunos fallos de conversión.",
      "Un objeto puede carecer de propiedad, contener JSON null o tener un tipo incompatible. Diseña validaciones que distingan esos casos.",
      "Mantén raw fiel y normaliza Silver con columnas tipadas para consultas frecuentes; evita convertir todo a STRING por comodidad."
    ],
    "steps": [
      "Prueba propiedades ausentes, arrays, JSON null y tipos mixtos.",
      "Cuando la estructura es muy estable, considera columnas tipadas por rendimiento y contrato."
    ],
    "example": {
      "language": "sql",
      "code": "WITH source AS (\n SELECT parse_json('{\"order\":{\"id\":17,\"amount\":29.5}}') AS payload)\nSELECT variant_get(payload, '$.order.id', 'int') AS order_id,\n       variant_get(payload, '$.order.amount', 'double') AS amount\nFROM source;",
      "note": "Ejemplo autocontenido para SQL Warehouse compatible con VARIANT."
    },
    "challenge": {
      "question": "Un productor envía amount como cadena en una parte de los eventos. ¿Qué haces?",
      "answer": "Define explícitamente conversiones y política para valores inválidos; no dependas de casts implícitos sin observabilidad. Prueba la variante errónea."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/semi-structured/variant"
      }
    ]
  },
  "03.03": {
    "title": "Funciones de IA en transformaciones",
    "why": "Las funciones IA añaden capacidades semánticas a SQL, pero no deben usarse como sustitución silenciosa de transformaciones deterministas en pipelines críticos.",
    "mechanics": [
      "Funciones como ai_query pueden implicar acceso a modelos, permisos, costes por invocación, límites de tasa y comportamiento variable. El contrato de entrada/salida debe estar controlado.",
      "Una etapa de enriquecimiento con LLM puede devolver resultados inconsistentes o no válidos. Introduce validación estructural, métricas de errores, mecanismos de retry y consideraciones de privacidad.",
      "No invoques un modelo generativo para operaciones que SQL, regex o tablas de referencia pueden resolver de forma exacta."
    ],
    "steps": [
      "Calcula coste por fila y plazo extremo a extremo antes de procesar volúmenes grandes.",
      "No envíes PII a un endpoint sin autorización y condiciones de tratamiento verificadas."
    ],
    "example": {
      "language": "sql",
      "code": "-- Patrón ilustrativo: valida el endpoint y su firma\n-- SELECT ai_query('endpoint_autorizado', prompt)\n-- FROM catalog.schema.documentos;",
      "note": "Intencionadamente conceptual: ai_query depende de endpoint, tipos y permisos."
    },
    "challenge": {
      "question": "Necesitas clasificar 5 M comentarios todos los días. ¿Qué comparar?",
      "answer": "Un clasificador tradicional, reglas y funciones IA: precisión, reproducibilidad, privacidad, throughput, coste y posibilidad de reentrenamiento."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/large-language-models/ai-functions"
      }
    ]
  },
  "03.04": {
    "title": "Expectations y cuarentena",
    "why": "La calidad en Lakeflow Pipelines no se reduce a una condición booleana: cada expectation necesita una política sobre filas inválidas y una estrategia de observación.",
    "mechanics": [
      "EXPECT (warn) conserva filas pero registra métricas; EXPECT ... ON VIOLATION DROP ROW descarta filas del destino; FAIL UPDATE impide que la actualización termine correctamente.",
      "Para datos valiosos inválidos, la cuarentena separa registros para reparación posterior y evita perder trazabilidad. No equivale a hacer DROP sin capturar el raw.",
      "Asegura que las métricas de calidad estén visibles en los event logs y asociadas al lote o actualización correspondiente."
    ],
    "steps": [
      "Distingue reglas de integridad física, semántica y contratos del consumidor.",
      "Decide qué condiciones justifican fallar una actualización completa frente a aislar registros."
    ],
    "example": {
      "language": "sql",
      "code": "CREATE OR REFRESH STREAMING TABLE clean_orders (\n CONSTRAINT valid_id EXPECT (order_id IS NOT NULL)\n   ON VIOLATION DROP ROW\n) AS SELECT * FROM STREAM(bronze_orders);",
      "note": "Ejemplo de pipeline SQL compatible; bronze_orders debe existir."
    },
    "challenge": {
      "question": "El 1 % de filas tiene order_id nulo, pero se requiere auditoría completa. ¿Qué patrón propones?",
      "answer": "Conserva Bronze, dirige registros inválidos a cuarentena y solo publica válidos en Silver. DROP sin retener evidencia dificulta su recuperación."
    },
    "docs": [
      {
        "name": "Guía oficial técnica",
        "url": "https://docs.databricks.com/aws/en/ldp/expectations"
      }
    ]
  }
});
