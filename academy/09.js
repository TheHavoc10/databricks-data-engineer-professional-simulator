window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "09.01": {
    "title": "Diseño físico de Delta e Iceberg",
    "why": "El formato de tabla define metadatos transaccionales y capacidades de lectura/escritura; el diseño físico se elige por carga de trabajo, compatibilidad y mantenimiento.",
    "mechanics": [
      "Delta utiliza transaction log y soporta time travel/CDF según features; Iceberg administra snapshots y metadata propios, con compatibilidad y versiones que pueden variar.",
      "Particionado, clustering y tamaño de archivos impactan pruning, planificación y escrituras. En managed Iceberg el soporte para algunas optimizaciones depende de runtime.",
      "No asumas que soporte de lectura de un formato implica capacidades equivalentes de escritura, CDC y optimización en todos los motores."
    ],
    "steps": [
      "Haz matriz de lectores externos, formatos, runtimes, mantenimiento y SLA.",
      "Valida operativamente snapshots y evolución de esquema antes de adoptar un formato."
    ],
    "example": {
      "language": "sql",
      "code": "DESCRIBE DETAIL analytics.gold.fact_orders;\nDESCRIBE HISTORY analytics.gold.fact_orders;",
      "note": "Válido para tabla Delta compatible; en Iceberg usa metadatos/consultas apropiados."
    },
    "challenge": {
      "question": "Necesitas interoperabilidad con lectores externos Iceberg. ¿Qué priorizas?",
      "answer": "Comprueba versión/protocolo, soportes de cada motor, formatos gestionados disponibles y limitaciones antes de fijar tabla/operación."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/tables/"
      }
    ]
  },
  "09.02": {
    "title": "Grano dimensional, materialized y metric views",
    "why": "Modelar Gold consiste en definir significados estables y evitar incoherencias entre KPI. Una fact table representa hechos con grano explícito; las dimensiones aportan contexto.",
    "mechanics": [
      "SCD2 permite resolver atributos históricos mediante intervalos de vigencia a la fecha de cada hecho. Un join solo por identificador multiplica filas si hay varias versiones.",
      "Una materialized view almacena el resultado mantenible de una query para acelerar lectura. Una metric view define medidas y dimensiones reutilizables con semántica consistente, con disponibilidad y sintaxis propias.",
      "Compara rendimiento, frescura y seguridad: semántica reutilizable no es automáticamente materialización y la materialización no garantiza definición única de KPI."
    ],
    "steps": [
      "Describe grano, fechas de vigencia, reglas de moneda y filtros de cancelación.",
      "Valida que el KPI coincida entre dashboard, warehouse y consumidor externo."
    ],
    "example": {
      "language": "sql",
      "code": "SELECT o.order_date, SUM(o.net_amount) AS net_revenue\nFROM analytics.gold.fact_orders o\nWHERE o.status = 'CONFIRMED'\nGROUP BY o.order_date;",
      "note": "Ejemplo de KPI; exige especificar reglas de negocio para devoluciones e impuestos."
    },
    "challenge": {
      "question": "Dos dashboards difieren en revenue aun usando el mismo Gold. ¿Qué solución propones?",
      "answer": "Acordar grano, filtros y medidas gobernadas; considerar metric views como capa semántica reusable y tests de consistencia."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/metric-views/"
      }
    ]
  }
});
