#!/usr/bin/env python3
"""Валидация машиночитаемых ФГОС по standards/fgos/schema/fgos.schema.json.

  python tools/validate-fgos.py standards/fgos/data/FGOS-VO-31.05.01-2020.json
  python tools/validate-fgos.py --all

Дополнительно проверяется: имя файла соответствует meta (FGOS-<ТИП>-<КОД>-<ГОД>[-<приказ>].json),
формулировки компетенций не пусты, коды в пределах одного ФГОС (по спискам компетенций) не повторяются
(повтор допустим, если он есть в самом тексте стандарта, — тогда это предупреждение, не ошибка).
"""
import json, sys, glob, re, os, collections

try:
    import jsonschema
except ImportError:
    sys.exit("pip install jsonschema")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMA = os.path.join(ROOT, "standards", "fgos", "schema", "fgos.schema.json")
DATA = os.path.join(ROOT, "standards", "fgos", "data")


def check(path, validator):
    errs, warns = [], []
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    for e in validator.iter_errors(d):
        errs.append(f"{'.'.join(str(x) for x in e.absolute_path) or '/'}: {e.message[:140]}")
    m = d.get("meta", {})
    stem = os.path.basename(path)[:-5]
    m_name = re.match(r"^FGOS-(VO|SPO|OO|DO|DPO)-(\d{2}\.\d{2}\.\d{2})-(\d{4})(-\d+)?$", stem)
    if not m_name:
        warns.append("имя файла не по шаблону FGOS-<ТИП>-<КОД>-<ГОД>[-<приказ>].json")
    elif m.get("ugsn_code") and m_name.group(2) != m["ugsn_code"]:
        errs.append(f"код в имени файла {m_name.group(2)} ≠ meta.ugsn_code {m['ugsn_code']}")
    elif m.get("order_date") and m_name.group(3) != m["order_date"][:4]:
        errs.append(f"год в имени файла {m_name.group(3)} ≠ год meta.order_date {m['order_date']}")
    codes = collections.Counter(c["code"] for lst in d.get("competencies", {}).values() for c in lst)
    dup = [c for c, n in codes.items() if n > 1]
    if dup:
        warns.append("повторяющиеся коды компетенций (проверьте по тексту стандарта): " + ", ".join(dup))
    for lst in d.get("competencies", {}).values():
        for c in lst:
            if not c.get("name", "").strip():
                errs.append(f"пустая формулировка {c.get('code')}")
    return errs, warns


def main():
    args = sys.argv[1:]
    files = sorted(glob.glob(os.path.join(DATA, "*.json"))) if "--all" in args else [a for a in args if not a.startswith("--")]
    if not files:
        sys.exit(__doc__)
    with open(SCHEMA, encoding="utf-8") as f:
        validator = jsonschema.Draft7Validator(json.load(f))
    bad = 0
    for p in files:
        errs, warns = check(p, validator)
        if errs:
            bad += 1
            print(f"✗ {os.path.basename(p)}")
            for e in errs:
                print("   ", e)
        for w in warns:
            print(f"⚠ {os.path.basename(p)}: {w}")
    print(f"\nпроверено файлов: {len(files)}, с ошибками: {bad}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
