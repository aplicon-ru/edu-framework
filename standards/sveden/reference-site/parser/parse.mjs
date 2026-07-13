#!/usr/bin/env node
// Универсальный парсер раздела /sveden/ — работает с ЛЮБЫМ сайтом ОО, размеченным
// по Приказу Рособрнадзора № 1493 (та же микроразметка itemprop, что описана в
// standards/sveden/vocab/base.yaml). Ничего не знает про конкретную организацию —
// весь список полей и групп берёт из словаря, а не зашивает в код.
//
// Использование:
//   node parser/parse.mjs https://example-oo.ru [data/parsed.sveden.json]
//   node parser/parse.mjs ./saved-pages [data/parsed.sveden.json]
//
// Источник — либо базовый URL сайта (подразделы читаются по своим /sveden/<slug>/
// адресам из словаря), либо локальная папка с сохранёнными страницами вида
// <раздел>.html (common.html, struct.html, ...) — удобно для офлайн-разбора и тестов
// без обращения к реальному сайту.
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { loadVocab, listSectionKeys, sectionFields, sectionGroups } from "../lib/vocab.mjs";

// Немало старых сайтов ОО (в т.ч. реальные вузовские CMS) отдают кириллицу не в
// UTF-8, а в KOI8-R/windows-1251/cp1251 — и HTTP-заголовок Content-Type при этом
// часто врёт (наблюдалось: charset=iso-8859-1 по заголовку при фактическом
// KOI8-R в <meta>). Поэтому кодировку определяем по телу страницы (её
// декларация всегда в ASCII, читается независимо от реальной кодировки), а
// заголовок — только запасной вариант.
function detectCharset(buffer, headerContentType) {
  const asciiPrefix = buffer.subarray(0, 2048).toString("latin1");
  const metaMatch = asciiPrefix.match(/<meta[^>]+charset=["']?\s*([\w-]+)/i);
  if (metaMatch) return metaMatch[1].toLowerCase();
  const headerMatch = headerContentType?.match(/charset=([\w-]+)/i);
  if (headerMatch) return headerMatch[1].toLowerCase();
  return "utf-8";
}

function decodeHtml(buffer, headerContentType) {
  const charset = detectCharset(buffer, headerContentType);
  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    console.warn(`  ⚠ неизвестная кодировка "${charset}", читаю как UTF-8`);
    return new TextDecoder("utf-8").decode(buffer);
  }
}

async function fetchHtml(source, sectionKey, sectionUrl) {
  if (/^https?:\/\//.test(source)) {
    const url = new URL(sectionUrl, source).toString();
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠ ${url}: HTTP ${res.status}`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return decodeHtml(buffer, res.headers.get("content-type"));
  }
  const file = path.join(source, `${sectionKey}.html`);
  if (!fs.existsSync(file)) return null;
  return decodeHtml(fs.readFileSync(file), null);
}

// Значение поля: если размечен элемент со ссылкой (сам <a> или содержит <a href>) —
// сохраняем текст и href отдельно (нужно для *DocLink/*El полей — это гиперссылки на
// документы, а не просто текст); иначе — только нормализованный текст.
function extractValue($, el) {
  const $el = $(el);
  const tag = el.tagName?.toLowerCase();
  const href = tag === "a" ? $el.attr("href") : $el.find("a[href]").first().attr("href");
  const text = $el.text().trim().replace(/\s+/g, " ");
  if (href) return { text, href };
  return text || null;
}

function parseSection($, section) {
  const result = { fields: {}, groups: {} };

  for (const f of sectionFields(section)) {
    const el = $(`[itemprop="${f.itemprop}"]`).first();
    if (el.length) result.fields[f.key] = extractValue($, el.get(0));
  }

  for (const g of sectionGroups(section)) {
    // Соглашение словаря (base.yaml, шапка файла): from оканчивается на "[]" —
    // повторяющийся блок (массив); иначе — одиночный (напр. managers.rucovodstvo).
    const isCollection = typeof g.from === "string" && g.from.endsWith("[]");
    const itemEls = $(`[itemprop="${g.itemprop}"]`).toArray();
    const items = itemEls.map((itemEl) => {
      const $item = $(itemEl);
      const item = {};
      for (const f of g.fields) {
        const el = $item.find(`[itemprop="${f.itemprop}"]`).first();
        if (el.length) item[f.key] = extractValue($, el.get(0));
      }
      return item;
    });
    result.groups[g.key] = isCollection ? items : (items[0] ?? null);
  }

  return result;
}

async function main() {
  const [, , source, outArg] = process.argv;
  if (!source) {
    console.error("Использование: node parser/parse.mjs <base-url-или-папка-с-html> [выходной.json]");
    console.error("  base-url — сайт с подразделами /sveden/<slug>/ по стандартной микроразметке Приказа №1493");
    console.error("  папка    — локальные сохранённые страницы <раздел>.html (common.html, struct.html, ...)");
    process.exit(1);
  }

  const vocab = loadVocab();
  const data = {};
  const skipped = [];

  for (const key of listSectionKeys()) {
    const section = vocab[key];
    const html = await fetchHtml(source, key, section.url);
    if (!html) {
      skipped.push(key);
      continue;
    }
    const $ = load(html);
    data[key] = parseSection($, section);
  }

  const outPath = outArg ?? "data/parsed.sveden.json";
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf8");

  console.log(`Разобрано разделов: ${Object.keys(data).length}/${listSectionKeys().length} → ${outPath}`);
  if (skipped.length) {
    console.log(`Пропущено (страница не найдена): ${skipped.join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
