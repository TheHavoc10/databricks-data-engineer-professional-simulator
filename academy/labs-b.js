window.DE_LAB_GUIDES = Object.assign(window.DE_LAB_GUIDES || {}, {
  "L09": {
    "mode": "Unity Catalog managed Delta con permisos",
    "intro": "Comprueba propiedades físicas y cambios entre versiones en un dataset de prueba. Compara el comportamiento antes/después de clustering.",
    "setup": "CREATE TABLE IF NOT EXISTS dev.gold.orders_layout (\n order_id BIGINT, customer_id BIGINT, amount DOUBLE\n) USING DELTA;\nALTER TABLE dev.gold.orders_layout\nSET TBLPROPERTIES (delta.enableChangeDataFeed = true);",
    "run": "INSERT INTO dev.gold.orders_layout VALUES (1,10,25.0),(2,20,5.0);\nUPDATE dev.gold.orders_layout SET amount=30.0 WHERE order_id=1;\nDESCRIBE HISTORY dev.gold.orders_layout;\nDESCRIBE DETAIL dev.gold.orders_layout;",
    "verify": "-- Observa VERSION antes/después del UPDATE.\nSELECT * FROM table_changes('dev.gold.orders_layout', 0);\n-- En tabla compatible, prueba CLUSTER BY (customer_id) y mide.",
    "expected": "CDF documenta cambios habilitados desde el momento de activación; HISTORY muestra commits. La mejora de clustering se mide con mayor volumen y patrones de filtros reales.",
    "warning": "No copies ALTER/OPTIMIZE/VACUUM a producción sin revisar compatibilidad, retención y coste."
  },
  "L10": {
    "mode": "Cuenta con system tables habilitadas",
    "intro": "Atribuye consumo por día y SKU y comprueba unidades antes de construir una estimación de coste.",
    "setup": "SELECT current_date() AS fecha;\n-- Comprueba acceso SELECT a system.billing.usage.",
    "run": "SELECT usage_date, sku_name, SUM(usage_quantity) AS dbus\nFROM system.billing.usage\nWHERE usage_date >= date_sub(current_date(), 30)\nGROUP BY usage_date, sku_name\nORDER BY usage_date DESC;",
    "verify": "-- Cruza la usage table con precios apropiados por SKU y periodo.\n-- Documenta el tratamiento de descuentos y gasto externo al servicio.",
    "expected": "Una serie temporal de DBUs por SKU, con una segunda fase para convertir a importe aplicando precios vigentes.",
    "warning": "DBUs no son directamente euros; tablas de sistema exigen privilegios y puede haber latencia de publicación."
  },
  "L11": {
    "mode": "Análisis + workspace UC con gobernanza ABAC autorizada",
    "intro": "Diseña primero una matriz de actores, columnas y tags; prueba políticas únicamente en recursos de laboratorio administrados.",
    "setup": "-- Modelo de clasificación conceptual:\n-- customers.ssn  -> governed tag pii=ssn\n-- customers.email -> governed tag pii=email\n-- customers.city -> sin etiqueta sensible",
    "run": "-- Ejemplo de función SQL que se puede reutilizar en máscaras:\nCREATE OR REPLACE FUNCTION dev.sec.mask_ssn(v STRING)\nRETURNS STRING\nRETURN IF(is_account_group_member('pii_allowed'), v, '***');\n-- El siguiente paso es crear la política ABAC según la sintaxis\n-- soportada y asignarle governed tags administrados.",
    "verify": "-- Prueba al menos dos identidades de permisos distintos.\n-- Demuestra que una tabla nueva con el tag correcto recibe la política.\n-- Revisa qué tags se heredan y cuáles requieren asignación.",
    "expected": "Los usuarios autorizados visualizan SSN según política; el resto ve datos enmascarados, sin depender de configurar una máscara manual por tabla.",
    "warning": "Cambiar políticas ABAC requiere autorización y depende de versión/runtime; no des por válida la sintaxis de políticas sin contrastarla con la doc específica."
  },
  "L12": {
    "mode": "Análisis de arquitectura; comandos solo en tabla de prueba",
    "intro": "Resuelve un derecho de supresión de un cliente a través de Bronze, Silver, Gold, backups y datasets exportados.",
    "setup": "-- Dibuja el linaje de customer_id=101:\n-- bronze.customers_raw -> silver.customers -> gold.dim_customer\n-- -> exports, dashboards y copias de terceros.",
    "run": "-- Ejemplo únicamente en tabla de prueba:\nDELETE FROM dev.silver.customers WHERE customer_id=101;\nDESCRIBE HISTORY dev.silver.customers;\n-- Investiga retención y protocolo de purga física del formato.",
    "verify": "-- Consulta tabla actual y versiones históricas autorizadas.\n-- Registra fuentes/sinks donde el registro persiste.\n-- Diseña evidencia auditable de propagación de la solicitud.",
    "expected": "La desaparición en SELECT actual no prueba purga de históricos, checkpoints o copias. Un control correcto documenta alcance, retención y cumplimiento.",
    "warning": "No ejecutar VACUUM agresivo ni supresiones reales sin evaluación de normativa y ventanas de recuperación."
  },
  "L13": {
    "mode": "Local con pyspark y pytest o workspace",
    "intro": "Extrae normalización determinista a una función y pruébala sin depender de Jobs o de rutas externas.",
    "setup": "# Instala versiones compatibles: pyspark y pytest.\n# src/orderstream/transforms.py\nfrom pyspark.sql import functions as F\n\ndef normalize(df):\n    return df.select('order_id', F.upper(F.trim('country')).alias('country'))",
    "run": "# test_transforms.py\nfrom pyspark.testing.utils import assertDataFrameEqual\nfrom orderstream.transforms import normalize\n\ndef test_normalize(spark):\n    input_df=spark.createDataFrame([(1,' es ')],['order_id','country'])\n    expected=spark.createDataFrame([(1,'ES')],['order_id','country'])\n    assertDataFrameEqual(normalize(input_df),expected,checkRowOrder=False)",
    "verify": "pytest -q\n# Compara también el esquema con assertSchemaEqual.\n# Añade casos NULL y string vacío.",
    "expected": "Transformaciones aisladas y test determinista; el test no debería realizar lecturas ni escrituras en tablas reales.",
    "warning": "El fixture spark y la configuración de pytest deben crearse en conftest.py; el código de ejemplo no incluye ese fixture."
  },
  "L14": {
    "mode": "CLI Databricks + permisos de despliegue",
    "intro": "Define un bundle mínimo dev/prod, despliega en dev y comprueba que las variables y el run-as son los previstos.",
    "setup": "# databricks.yml\nbundle:\n  name: orderstream\ninclude:\n  - resources/*.yml\ntargets:\n  dev:\n    mode: development\n    default: true\n  prod:\n    mode: production",
    "run": "databricks bundle validate -t dev\ndatabricks bundle deploy -t dev\ndatabricks bundle run -t dev order_etl",
    "verify": "# Inspecciona los recursos creados en dev y sus referencias.\n# Intenta provocar un error controlado en una tarea posterior.\n# Valida cómo Repair Run conserva o reejecuta tareas.",
    "expected": "Bundle reproducible y trazable; deploy y run son fases distintas. El repair no elimina escrituras anteriores.",
    "warning": "Se necesita resources/*.yml con una definición real de order_etl, además de identidad, host y permisos. El snippet no es un proyecto completo."
  },
  "L15": {
    "mode": "Databricks SQL con tablas de ejemplo",
    "intro": "Define primero el grano y las medidas; después implementa una dimensión SCD2 y una fact table cuya unión histórica sea correcta.",
    "setup": "-- Grano: una fila por pedido confirmado.\n-- dim_customer SCD2: customer_id, region, valid_from, valid_to.\n-- fact_orders: order_id, customer_id, order_date, net_amount.",
    "run": "SELECT o.order_date, SUM(o.net_amount) AS net_revenue\nFROM dev.gold.fact_orders o\nWHERE o.status='CONFIRMED'\nGROUP BY o.order_date ORDER BY o.order_date;",
    "verify": "-- Une facts a la versión de dimensión vigente el día del evento.\n-- Comprueba que no se multiplica el número de pedidos.\n-- Evalúa MV para agregados y metric view para definición de KPI.",
    "expected": "Un KPI reproducible basado en definición única de grano, filtros y vigencia histórica.",
    "warning": "La definición y sintaxis de metric views dependen de features actuales; no son lo mismo que una materialized view."
  },
  "L16": {
    "mode": "Análisis guiado sin compute",
    "intro": "Caso: orders aparece en verde pero Gold lleva 90 minutos de retraso y el coste se ha duplicado desde la última promoción.",
    "setup": "# Incidente ficticio a analizar:\n# 09:10 deploy bundle v2.0\n# 09:15 cambio JSON: amount pasa a string en 15% de filas\n# 09:20 backlog sube; una task consume 80% de tiempo\n# 10:00 Gold atrasado 90 min; costes x2",
    "run": "# Entregables, texto/Markdown:\n# 1. incident_timeline.md\n# 2. hypotheses.md (schema drift, skew, acceso, checkpoint)\n# 3. evidence.md (event logs, Spark UI, billing)\n# 4. recovery_runbook.md (estrategia idempotente)\n# 5. adr.md (mitigación y prevención)",
    "verify": "# Cada hipótesis incluye prueba que la confirma o refuta.\n# El plan separa mitigar impacto y solucionar causa raíz.\n# El recovery no duplica datos ante reintentos.",
    "expected": "Documento de arquitectura operativa con RCA sustentada en evidencias, medidas preventivas y controles de reconciliación.",
    "warning": "No presupongas que el cambio de schema es la única causa; el skew podría ser un problema independiente."
  }
});
