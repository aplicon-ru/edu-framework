// Загрузка данных для рендера — файл в "sveden-форме" (зеркалит структуру
// vocab/base.yaml: { [раздел]: { fields: {...}, groups: { [группа]: [...] } } }).
// Путь переопределяется переменной SVEDEN_DATA_FILE — так `parse` и `build`
// можно направить на разные файлы без правки кода.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA_FILE = path.resolve(__dirname, "..", "data", "example.sveden.json");

export function loadSvedenData() {
  const file = process.env.SVEDEN_DATA_FILE
    ? path.resolve(process.cwd(), process.env.SVEDEN_DATA_FILE)
    : DEFAULT_DATA_FILE;
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw);
}

export function sectionData(data, sectionKey) {
  return data[sectionKey] ?? { fields: {}, groups: {} };
}
