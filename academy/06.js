window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "06.01": {
    "title": "Privilegios y mínimo acceso en Unity Catalog",
    "why": "UC separa privilegios sobre recursos de datos de permisos sobre workspace/compute. Poder ver una carpeta del workspace no implica poder consultar una tabla gobernada.",
    "mechanics": [
      "En la jerarquía de UC necesitas USE CATALOG y USE SCHEMA, además de SELECT sobre los datos cuando corresponda. Para escritura y creación existen privilegios diferentes.",
      "Los service principals o identidades run-as deben tener solo derechos precisos; asignaciones amplias al grupo de usuarios reducen trazabilidad.",
      "El acceso se evalúa a múltiples niveles; distingue permisos de ownership, grants explícitos e inheritance según objeto."
    ],
    "steps": [
      "Construye matriz rol-acción-recurso en catálogo, esquema, tabla y Job.",
      "Prueba con un usuario no administrador para detectar privilegios excesivos."
    ],
    "example": {
      "language": "sql",
      "code": "GRANT USE CATALOG ON CATALOG analytics TO `data_readers`;\nGRANT USE SCHEMA ON SCHEMA analytics.gold TO `data_readers`;\nGRANT SELECT ON SCHEMA analytics.gold TO `data_readers`;",
      "note": "Nombres ilustrativos; ejecutar solo con autoridad y política corporativa."
    },
    "challenge": {
      "question": "Un usuario tiene SELECT en la tabla, pero recibe error de acceso al consultarla. ¿Por qué?",
      "answer": "Puede faltar USE CATALOG y USE SCHEMA, o existir otra restricción efectiva. Comprueba también la identidad que ejecuta la consulta."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/"
      }
    ]
  },
  "06.02": {
    "title": "ABAC, governed tags y políticas a escala",
    "why": "ABAC permite aplicar reglas de seguridad al conjunto de objetos que cumplan determinados atributos, en vez de aplicar máscaras manualmente tabla a tabla.",
    "mechanics": [
      "Las políticas pueden vivir en catálogo, esquema u otros ámbitos soportados; los governed tags clasifican datos y pueden heredar en la jerarquía según restricciones.",
      "ABAC aplica filtros de filas y máscaras de columnas, y ha ampliado sus capacidades con políticas de privilegios bajo condiciones de producto/versión. No debe suponerse disponibilidad en cualquier runtime.",
      "Una política de máscara invoca lógica de control contextual, pero puede afectar planes de consulta y debe validarse frente a accesos indirectos, vistas y compatibilidad de compute."
    ],
    "steps": [
      "Diseña taxonomía estable para tags sensibles y controla quién los asigna.",
      "Prueba columna sin tag, columna con tag, usuarios autorizados y no autorizados."
    ],
    "example": {
      "language": "sql",
      "code": "-- Sintaxis orientativa de función de máscara que se reutiliza\nCREATE OR REPLACE FUNCTION sec.mask_ssn(v STRING)\nRETURNS STRING\nRETURN IF(is_account_group_member('pii_allowed'), v, '***');",
      "note": "Solo ilustra una función; la política ABAC se configura aparte con governed tags y permisos apropiados."
    },
    "challenge": {
      "question": "Un nuevo dataset contiene columna ssn con un governed tag sensible. ¿Cómo puede heredar controles?",
      "answer": "Una política ABAC con condición sobre ese tag puede aplicarse automáticamente dentro de su ámbito, siempre que configuración y características sean compatibles."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac"
      }
    ]
  },
  "06.03": {
    "title": "Anonimización y pseudonimización",
    "why": "La anonimización busca impedir reidentificación dentro de supuestos fuertes; la pseudonimización sustituye identificadores pero conserva la posibilidad de asociar datos mediante clave o información adicional.",
    "mechanics": [
      "Enmascarar al consultar limita exposición, pero no borra necesariamente el valor original ni convierte automáticamente el dataset en anónimo.",
      "Hash determinista de identificadores puede seguir siendo reversible por diccionario o enlazable entre datasets. Usa claves, HMAC/tokenización y control de acceso según amenaza.",
      "Diseña minimización por finalidad: retira columnas innecesarias, documenta conservación, protege tablas raw y audita accesos."
    ],
    "steps": [
      "Clasifica técnicas según reversibilidad, riesgo de enlace y finalidad analítica.",
      "Comprueba si los datos indirectos permiten reidentificación mediante cruces."
    ],
    "example": {
      "language": "sql",
      "code": "-- Pseudonimización ilustrativa, NO anonimización irreversible:\nSELECT sha2(concat(customer_id, 'salt_no_secreto'),256) AS token\nFROM dev.silver.customers;",
      "note": "No usar sal visible ni incrustado en producción; considerar HMAC/tokenización gestionada."
    },
    "challenge": {
      "question": "¿Es anónimo un email que transformaste con SHA-256 sin sal?",
      "answer": "No necesariamente: correos adivinables pueden identificarse con diccionarios; además puede persistir capacidad de enlazar individuos. Evalúa riesgo de reidentificación."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/security/privacy/"
      }
    ]
  },
  "06.04": {
    "title": "PII en batch y streaming",
    "why": "La protección de PII debe extenderse desde el origen hasta logs, checkpoints, colas de cuarentena, resultados de consulta y exportaciones.",
    "mechanics": [
      "En streaming los eventos pueden conservar raw sensible en checkpoints, estados y DLQ. La seguridad de tabla Gold no protege copias anteriores automáticamente.",
      "Aplica clasificación temprana, minimización, cifrado en tránsito/reposo, tags, UC y controles de acceso por finalidad.",
      "Gestiona las identidades técnicas separadamente; un Job run-as con permisos amplios puede exponer PII aunque el dashboard aplique máscara."
    ],
    "steps": [
      "Traza el recorrido completo de un SSN desde entrada hasta salida.",
      "Verifica que excepciones/logs no impriman payloads sensibles."
    ],
    "example": {
      "language": "sql",
      "code": "-- Selección minimizada como control de exposición:\nCREATE OR REPLACE VIEW analytics.gold.orders_public AS\nSELECT order_id, date(order_ts) AS order_date, amount\nFROM analytics.silver.orders;",
      "note": "Crear vistas exige privilegios; evalúa si otra columna permite reidentificación."
    },
    "challenge": {
      "question": "Una máscara de SSN existe en Gold pero Bronze contiene SSN en claro. ¿Está resuelto?",
      "answer": "No. Protege Bronze, checkpoints, backfills y logs, limita quién puede leerlos, y aplica minimización a lo largo del pipeline."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac"
      }
    ]
  },
  "06.05": {
    "title": "Retención, purga y derecho de supresión",
    "why": "Un DELETE lógico en una tabla Delta no garantiza por sí solo la desaparición física de todos los bytes y copias de datos; hay archivos/versiones, caches y destinos derivados.",
    "mechanics": [
      "El borrado lógico modifica el estado visible. Para eliminación física debes considerar operación de mantenimiento apropiada, restricciones de VACUUM, deletion vectors y retención.",
      "No reduzcas indiscriminadamente retención: puedes romper time travel, streaming y consumidores incrementales. Diseña una ventana compatible con SLAs y obligaciones legales.",
      "Mantén un registro de solicitudes y un grafo de propagación Bronze-Silver-Gold, backups, exportaciones y datos compartidos."
    ],
    "steps": [
      "Verifica propagación y trazabilidad, no solo ausencia en SELECT.",
      "Consulta con seguridad y legal antes de fijar periodos o hacer purga irreparable."
    ],
    "example": {
      "language": "sql",
      "code": "DELETE FROM analytics.silver.customers\nWHERE customer_id = 101;\n-- La purga física y sus garantías dependen del tipo de tabla,\n-- features activas, archivos retenidos y políticas de VACUUM.",
      "note": "No ejecutar sin autorización y procedimiento documentado de supresión."
    },
    "challenge": {
      "question": "Se ha borrado una fila, pero sigue en una versión histórica accesible. ¿Se completó la supresión?",
      "answer": "No se puede afirmar. Comprueba procedimiento de purga física, backups, consumidores e historial, sujeto a las obligaciones aplicables."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/delta/vacuum"
      }
    ]
  }
});
