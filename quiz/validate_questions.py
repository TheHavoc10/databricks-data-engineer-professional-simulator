#!/usr/bin/env python3
"""Comprueba integridad y cobertura del banco ORIGINAL Professional 2026."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "original"
EXPECTED = {"01": 14, "02": 7, "03": 7, "04": 6, "05": 9,
            "06": 5, "07": 3, "08": 6, "09": 3}
questions = []
for domain, count in EXPECTED.items():
    filepath = ROOT / f"{domain}.json"
    payload = json.loads(filepath.read_text(encoding="utf-8"))
    rows = payload["questions"]
    assert payload["domain"] == domain, (filepath, "domain")
    assert len(rows) == count, (filepath, "question count", len(rows), count)
    for q in rows:
        assert q["domain"] == domain
        assert q["objective"].startswith(domain + ".")
        assert len(q["stem"]) >= 50
        assert len(q["options"]) == 4
        assert len(q["whyWrong"]) == 4
        assert q["answer"] in "ABCD"
        assert q["whyWrong"]["ABCD".index(q["answer"])] == ""
        for idx, rationale in enumerate(q["whyWrong"]):
            if idx != "ABCD".index(q["answer"]):
                assert len(rationale.strip()) >= 20, q["id"]
        assert len(q["explanation"]) >= 60
        assert q["source"].startswith("https://docs.databricks.com/"), q["id"]
        questions.append(q)

ids = [q["id"] for q in questions]
assert len(questions) == 60 and len(set(ids)) == 60
assert ids == [f"OF-{i:03d}" for i in range(1, 61)]
assert len({q["objective"] for q in questions}) == 45
assert Counter(q["answer"] for q in questions) == Counter(dict.fromkeys("ABCD", 15))
print("QA OK: 60 preguntas, 45 objetivos, 9 bloques, 15 respuestas por letra.")
