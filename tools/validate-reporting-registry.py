#!/usr/bin/env python3
"""
validate-reporting-registry.py — проверка standards/reporting/registry.json и calendar.json.
Использование: python tools/validate-reporting-registry.py
Без внешних зависимостей: структура описана в standards/reporting/schema/registry.schema.json,
здесь проверяются те же правила напрямую (+ перекрёстные: уникальность id, id календаря).
"""
import json
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / "standards" / "reporting"
SECTIONS = {"STAT", "ADM", "DOC", "SELF", "GIA", "LIC", "REL", "MED"}
TYPES = {"VO", "SPO", "DO_PRE", "DO_ADD", "DPO"}
KINDS = {"periodic", "event", "continuous"}
VERIF = {"verified_2026-10", "verified_secondary_2026-10", "to_verify"}
SUB = {"fsn_web", "fis_web", "fis_api", "gosuslugi", "vendor_lk", "smev", "org_site", "paper", "email", "tks", "other"}
SIG = {"ukep", "mchd", "ukep_mchd", "none", "unknown"}
FORM_KIND = {"blank", "xml_template", "online_form", "free_form", "none"}
CHECK = {"primary", "secondary", "inferred", "unresolved"}
REQUIRED = ["id", "section", "name", "applies_to", "recipient", "channel", "kind", "periodicity", "deadline",
            "legal_basis", "verification", "contains_financial_block", "notes", "submission", "system", "format",
            "signature", "form_code", "forms", "print_note", "format_check", "format_sources"]


def main():
    errors = []
    reg = json.load(open(BASE / "registry.json", encoding="utf-8"))
    cal = json.load(open(BASE / "calendar.json", encoding="utf-8"))
    ids = set()
    for r in reg["reports"]:
        i = r.get("id", "?")
        if i in ids:
            errors.append(f"{i}: дубликат id")
        ids.add(i)
        miss = [k for k in REQUIRED if k not in r]
        if miss:
            errors.append(f"{i}: нет полей {miss}")
            continue
        if r["section"] not in SECTIONS: errors.append(f"{i}: раздел {r['section']}")
        if not r["applies_to"] or set(r["applies_to"]) - TYPES: errors.append(f"{i}: типы {r['applies_to']}")
        if r["kind"] not in KINDS: errors.append(f"{i}: kind {r['kind']}")
        if r["verification"] not in VERIF: errors.append(f"{i}: verification {r['verification']}")
        if not isinstance(r["contains_financial_block"], bool): errors.append(f"{i}: contains_financial_block")
        if not r["legal_basis"]: errors.append(f"{i}: пустое основание")
        if not r["submission"] or set(r["submission"]) - SUB: errors.append(f"{i}: submission {r['submission']}")
        if r["signature"] not in SIG: errors.append(f"{i}: signature {r['signature']}")
        if r["format_check"].get("status") not in CHECK: errors.append(f"{i}: format_check.status")
        for f in r["forms"]:
            if not f.get("name") or f.get("kind") not in FORM_KIND: errors.append(f"{i}: форма {f.get('name')}")
    for c in cal["items"]:
        if c["id"] not in ids: errors.append(f"calendar: неизвестный id {c['id']}")
        if not 1 <= c["month"] <= 12: errors.append(f"calendar: месяц {c['month']} у {c['id']}")
    if errors:
        print("\n".join("  ❌ " + e for e in errors))
        sys.exit(1)
    print(f"  ✓ registry.json: {len(reg['reports'])} позиций, calendar.json: {len(cal['items'])} записей")


if __name__ == "__main__":
    main()
