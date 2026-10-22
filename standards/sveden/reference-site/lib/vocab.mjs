// Единая точка загрузки словаря микроразметки sveden.
// Источник истины — standards/sveden/vocab/*.yaml, этот модуль их не копирует,
// а читает напрямую из соседней папки при каждом build/dev — рассинхронизации
// со словарём не возникает.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VOCAB_DIR = path.resolve(__dirname, "..", "..", "vocab");

let cachedVocab = null;
let cachedGlobal = null;

export function loadVocab() {
  if (!cachedVocab) {
    const raw = fs.readFileSync(path.join(VOCAB_DIR, "base.yaml"), "utf8");
    cachedVocab = yaml.load(raw);
  }
  return cachedVocab;
}

export function loadGlobalRules() {
  if (!cachedGlobal) {
    const raw = fs.readFileSync(path.join(VOCAB_DIR, "_global.yaml"), "utf8");
    cachedGlobal = yaml.load(raw);
  }
  return cachedGlobal;
}

// Список ключей подразделов в порядке объявления в base.yaml (14 штук, Табл. 3.1).
export function listSectionKeys() {
  return Object.keys(loadVocab());
}

export function getSection(key) {
  const section = loadVocab()[key];
  if (!section) {
    throw new Error(`Неизвестный подраздел sveden: ${key}`);
  }
  return section;
}

// Разворачивает подраздел в плоский список одиночных полей { key, itemprop, from }.
export function sectionFields(section) {
  return Object.entries(section.fields ?? {}).map(([key, def]) => ({ key, ...def }));
}

// Разворачивает подраздел в список групп (повторяющихся блоков) с их полями.
export function sectionGroups(section) {
  return Object.entries(section.groups ?? {}).map(([key, def]) => ({
    key,
    itemprop: def.itemprop,
    from: def.from,
    fields: Object.entries(def.fields ?? {}).map(([fkey, fdef]) => ({ key: fkey, ...fdef })),
  }));
}
