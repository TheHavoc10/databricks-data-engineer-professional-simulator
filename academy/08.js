window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "08.01": {
    "title": "Depuración multi-capa",
    "why": "Una query lenta, un error de permisos y una ruptura de esquema requieren rutas de investigación diferentes. La trazabilidad comienza antes de abrir Spark UI.",
    "mechanics": [
      "Empieza por clasificar síntoma: falló resolución/analizador, autenticación, lectura, transformación, shuffle, escritura o publicación.",
      "Consulta plan lógico/físico, métricas de stages y tasks, event logs, run logs y metadatos de cambios. Evita confundir correlación con causa.",
      "Reproduce con datos controlados, compara versiones y aísla una variable por cambio."
    ],
    "steps": [
      "Para cada hipótesis documenta evidencia que la refute.",
      "Captura IDs de Jobs, tasks, runs, catálogo, versión de datos y código."
    ],
    "example": {
      "language": "sql",
      "code": "EXPLAIN FORMATTED SELECT *\nFROM analytics.silver.orders\nWHERE order_date >= DATE '2026-10-01';",
      "note": "El plan puede indicar pruning, filtros y escaneos; no sustituye métricas reales."
    },
    "challenge": {
      "question": "Un pipeline falla con PERMISSION_DENIED solo cuando se programa. ¿Dónde miras?",
      "answer": "Run-as efectivo, ownership del Job, permisos UC, dependencias, conexiones y diferencia entre identidad interactiva y de ejecución."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/compute/troubleshooting/"
      }
    ]
  },
  "08.02": {
    "title": "Repairs y parameter overrides",
    "why": "Repair run puede reejecutar tareas seleccionadas que fallaron o necesitan repetirse según soporte del producto; sus efectos dependen de la semántica del workflow.",
    "mechanics": [
      "Una reparación no elimina efectos previos. Las tareas que escribieron datos, publicaron notificaciones o llamaron APIs pueden haber tenido éxito antes de que fallase una dependencia posterior.",
      "Los parámetros efectivos pueden variar entre ejecuciones. Registra entradas, referencias, identificadores de lote y versión de código.",
      "El uso de staging y operaciones idempotentes es esencial cuando distintas tareas comparten destino."
    ],
    "steps": [
      "Separa fallos de datos, código y plataforma antes de hacer repair.",
      "Inspecciona qué ramas no se ejecutaron y qué objetos fueron modificados."
    ],
    "example": {
      "language": "bash",
      "code": "databricks jobs list-runs --job-id 12345\n# En UI de Jobs: identificar run/tarea y aplicar Repair run",
      "note": "ID ilustrativo. No ejecutar repairs sin inventario de escrituras previas."
    },
    "challenge": {
      "question": "Una task de email envió el mensaje y falló antes de confirmar. ¿Qué cuidado requiere repair?",
      "answer": "Puede enviarlo dos veces; utiliza clave idempotente, registro de envíos o lógica compensatoria."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/jobs/repair-job-failures"
      }
    ]
  },
  "08.03": {
    "title": "Automation Bundles y despliegue reproducible",
    "why": "Bundles definen recursos de Databricks como código con targets. Validar, desplegar y ejecutar son operaciones distintas y deben integrarse con entornos y aprobaciones.",
    "mechanics": [
      "El bundle describe recursos como Jobs y pipelines e incluye mappings por entorno. Las variables parametrizan nombres, rutas y configuraciones; no son sustituto de secretos gestionados.",
      "El ciclo típico valida archivos, despliega recursos y después ejecuta los Jobs. Evita usar el mismo target para DEV y PROD con valores confundibles.",
      "Prueba drift, ownership, permisos de principal de ejecución y estrategias de rollback de versiones."
    ],
    "steps": [
      "Versiona dependencias, resources y código al mismo commit o artefacto.",
      "Valida target prod en CI sin desplegarlo hasta que pase la puerta de aprobación."
    ],
    "example": {
      "language": "yaml",
      "code": "bundle:\n  name: orderstream\ninclude:\n  - resources/*.yml\ntargets:\n  dev:\n    mode: development\n  prod:\n    mode: production",
      "note": "Base parcial que requiere recursos/identidad y configuración adicional."
    },
    "challenge": {
      "question": "El bundle se despliega con éxito pero la tarea apunta a tablas DEV. ¿Qué faltó?",
      "answer": "Config por target correctamente parametrizada y pruebas post-deploy. Valida nombres de catálogo, parámetros y run-as antes de promocionar."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/dev-tools/bundles/"
      }
    ]
  },
  "08.04": {
    "title": "Git folders, CI/CD y promoción entre entornos",
    "why": "El repositorio externo resuelve colaboración (PR, merge, revisiones y auditoría), mientras Git folders facilita trabajar con código versionado dentro de Databricks.",
    "mechanics": [
      "Un commit guarda un cambio local; pull sincroniza upstream; merge resuelve ramas normalmente en proveedor Git. La UI de workspace no sustituye una política de revisión.",
      "Un pipeline CI valida sintaxis, linters, tests, seguridad y bundle antes de desplegar. CD despliega artefacto trazable a stage/prod con aprobaciones.",
      "Rollback requiere restaurar configuración y código, y entender si las mutaciones de tablas pueden revertirse de forma segura."
    ],
    "steps": [
      "Usa credenciales de servicio con alcance mínimo y evita PAT personales.",
      "Bloquea deploy si fallan pruebas o hay incompatibilidad de schema."
    ],
    "example": {
      "language": "bash",
      "code": "databricks bundle validate -t dev\ndatabricks bundle deploy -t dev\ndatabricks bundle run -t dev order_etl",
      "note": "Exige recursos definidos, CLI autenticada y permisos."
    },
    "challenge": {
      "question": "Se hace merge pero la producción no cambia. ¿Qué falta?",
      "answer": "Que el proceso CD despliegue la versión aprobada; merge en Git no implica despliegue ni actualización inmediata del Job."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/dev-tools/bundles/"
      }
    ]
  }
});
