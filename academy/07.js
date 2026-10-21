window.DE_ACADEMY_LESSONS = Object.assign(window.DE_ACADEMY_LESSONS || {}, {
  "07.01": {
    "title": "Tags, comentarios y descubrimiento",
    "why": "Un catálogo sin metadatos útiles es un inventario difícil de usar. La calidad de nombres, owners, glosario y linaje reduce búsquedas y accesos erróneos.",
    "mechanics": [
      "Los comentarios de tablas/columnas comunican semántica y expectativas. Los tags clasifican criticidad, sensibilidad y dominio; governed tags tienen control centralizado.",
      "Lineage puede mostrar relaciones entre procesos y activos cuando la plataforma dispone de metadatos de ejecución compatibles.",
      "Distingue clasificación de seguridad (gobernada) de etiquetado descriptivo. No conviertas tags arbitrarios en política ABAC sin control de cambios."
    ],
    "steps": [
      "Define owner, descripción, grano, SLA, sensibilidad y política de retención.",
      "Evalúa qué metadatos se heredan y cuáles requieren asignación explícita."
    ],
    "example": {
      "language": "sql",
      "code": "COMMENT ON TABLE analytics.gold.fact_orders IS\n'Una fila por pedido confirmado; moneda EUR; owner: equipo de datos';",
      "note": "Ejemplo de catalogación; requiere privilegios para modificar metadata."
    },
    "challenge": {
      "question": "El buscador muestra tres tablas customers sin descripción. ¿Qué añadirías?",
      "answer": "Propietario, finalidad, grano, actualización, calidad, clasificación, enlaces a contrato de datos y ejemplos de uso."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/tags"
      }
    ]
  },
  "07.02": {
    "title": "Herencia de permisos y securables",
    "why": "UC organiza metastore, catalogs, schemas, tables, views y otros securables. La herencia de ciertos privilegios facilita administración, pero hay límites y distinciones según objeto.",
    "mechanics": [
      "En modelos con herencia de privilegios, grants definidos sobre un nivel superior pueden aplicarse a objetos descendientes conforme a reglas de UC.",
      "USE CATALOG/USE SCHEMA y SELECT/CREATE/MODIFY son permisos distintos; un GRANT en el objeto final no siempre basta para llegar a él.",
      "Ownership y MANAGE permiten administración en ámbitos concretos; es crítico comprobar si un grant amplía involuntariamente la superficie de datos futuros."
    ],
    "steps": [
      "Haz matriz de permisos efectivos después de crear una tabla nueva.",
      "Revisa herencia, grupos Entra/identidad y concesiones a nivel de esquema."
    ],
    "example": {
      "language": "sql",
      "code": "SHOW GRANTS ON SCHEMA analytics.gold;\nSHOW GRANTS ON TABLE analytics.gold.fact_orders;",
      "note": "Evalúa permisos y su herencia con un usuario de prueba."
    },
    "challenge": {
      "question": "Concedes SELECT en un esquema y mañana se añade una tabla. ¿Qué debes saber?",
      "answer": "Un grant aplicable por herencia puede dar acceso también a tablas futuras del ámbito. Revisa diseño del esquema y mínimos privilegios."
    },
    "docs": [
      {
        "name": "Documentación oficial",
        "url": "https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/"
      }
    ]
  }
});
