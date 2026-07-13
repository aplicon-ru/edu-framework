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

// Один сетевой запрос, с таймаутом (по умолчанию агрессивные таймауты fetch на
// старых/перегруженных серверах вузов дают ложный "недоступен" раньше времени).
async function fetchOnce(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const buffer = Buffer.from(await res.arrayBuffer());
    return { ok: true, html: decodeHtml(buffer, res.headers.get("content-type")) };
  } catch (err) {
    const reason = err.name === "AbortError" ? `таймаут ${timeoutMs}мс` : err.cause?.message || err.message;
    return { ok: false, reason };
  } finally {
    clearTimeout(timer);
  }
}

// Провал уровня соединения (таймаут/сброс/DNS) отличаем от HTTP-статуса: статус
// (даже 404/403) означает, что сервер вообще отвечает — а вот таймаут/обрыв на
// первом же разделе — сильный сигнал, что недоступен весь хост целиком, а не
// одна страница.
function isConnectionLevelFailure(reason) {
  return typeof reason === "string" && !reason.startsWith("HTTP ");
}

// Максимальная живучесть по сети: короткая попытка → более долгий повтор →
// если и HTTPS полностью недоступен (не просто TLS-нюанс, а обрыв/таймаут
// соединения) — пробуем HTTP тем же путём (реальный случай: старые вузовские
// сайты нередко держат рабочий HTTP при сломанном/медленном HTTPS).
//
// fastMode — включается после того, как на ПРЕДЫДУЩЕМ разделе весь хост уже
// не ответил ни по HTTPS, ни по HTTP: тратить по 45с полной лестницы на каждый
// из оставшихся 13 разделов бессмысленно — раз в разделах остаётся шанс, что
// именно этот путь на сайте всё же жив, делаем одну короткую попытку вместо
// полного повтора.
async function fetchWithFallback(url, fastMode) {
  if (fastMode) {
    return fetchOnce(url, 6_000);
  }

  let attempt = await fetchOnce(url, 10_000);
  if (attempt.ok) return attempt;

  attempt = await fetchOnce(url, 20_000);
  if (attempt.ok) return attempt;

  if (url.startsWith("https://")) {
    const httpUrl = "http://" + url.slice("https://".length);
    const httpAttempt = await fetchOnce(httpUrl, 15_000);
    if (httpAttempt.ok) return httpAttempt;
    return { ok: false, reason: `${attempt.reason} (https); ${httpAttempt.reason} (http)` };
  }
  return attempt;
}

async function fetchHtml(source, sectionKey, sectionUrl, fastMode) {
  if (/^https?:\/\//.test(source)) {
    const url = new URL(sectionUrl, source).toString();
    const result = await fetchWithFallback(url, fastMode);
    if (!result.ok) {
      return { html: null, reason: result.reason, connectionLevel: isConnectionLevelFailure(result.reason) };
    }
    return { html: result.html, reason: null, connectionLevel: false };
  }
  const file = path.join(source, `${sectionKey}.html`);
  if (!fs.existsSync(file)) return { html: null, reason: "файл не найден", connectionLevel: false };
  try {
    return { html: decodeHtml(fs.readFileSync(file), null), reason: null, connectionLevel: false };
  } catch (err) {
    return { html: null, reason: err.message, connectionLevel: false };
  }
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

// Максимальная живучесть при разборе: реальные сайты дают неожиданную вложенность,
// оборванные теги, нестандартные структуры. Одно поле/группа не должны обрушивать
// разбор всего раздела — каждое читается независимо, ошибка на одном не должна
// стоить остальных уже извлечённых значений.
function safeExtract(fn, onErrorLabel) {
  try {
    return fn();
  } catch (err) {
    console.warn(`  ⚠ ${onErrorLabel}: ${err.message}`);
    return undefined;
  }
}

function parseSection($, section) {
  const result = { fields: {}, groups: {} };

  for (const f of sectionFields(section)) {
    const value = safeExtract(() => {
      const el = $(`[itemprop="${f.itemprop}"]`).first();
      return el.length ? extractValue($, el.get(0)) : undefined;
    }, `поле ${f.key}`);
    if (value !== undefined) result.fields[f.key] = value;
  }

  for (const g of sectionGroups(section)) {
    // Соглашение словаря (base.yaml, шапка файла): from оканчивается на "[]" —
    // повторяющийся блок (массив); иначе — одиночный (напр. managers.rucovodstvo).
    const isCollection = typeof g.from === "string" && g.from.endsWith("[]");
    const items = safeExtract(() => {
      const itemEls = $(`[itemprop="${g.itemprop}"]`).toArray();
      return itemEls.map((itemEl, i) =>
        safeExtract(() => {
          const $item = $(itemEl);
          const item = {};
          for (const f of g.fields) {
            const el = $item.find(`[itemprop="${f.itemprop}"]`).first();
            if (el.length) item[f.key] = extractValue($, el.get(0));
          }
          return item;
        }, `группа ${g.key}[${i}]`) ?? {}
      );
    }, `группа ${g.key}`) ?? [];
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
  const outPath = outArg ?? "data/parsed.sveden.json";

  // Каждый раздел — независимая попытка. Сбой одного (сеть, разметка, что угодно)
  // не должен стоить уже собранных остальных 13 — ни разу не даём исключению
  // выйти из тела цикла наружу.
  //
  // hostSuspectedDown: если на каком-то разделе не ответили ни HTTPS, ни HTTP
  // (полный обрыв соединения, не HTTP-статус) — весь хост, скорее всего, лежит
  // целиком. Дальше не тратим полную лестницу повторов (~45с) на каждый из
  // оставшихся разделов, а быстро проверяем каждый по одной короткой попытке.
  let hostSuspectedDown = false;

  for (const key of listSectionKeys()) {
    try {
      const section = vocab[key];
      const { html, reason, connectionLevel } = await fetchHtml(source, key, section.url, hostSuspectedDown);
      if (!html) {
        console.warn(`  ⚠ ${key}: пропущен — ${reason}`);
        skipped.push({ key, reason });
        if (connectionLevel && !hostSuspectedDown) {
          hostSuspectedDown = true;
          console.warn("  ⚠ хост не отвечает ни по HTTPS, ни по HTTP — дальше проверяю разделы в быстром режиме");
        }
        continue;
      }
      const $ = load(html);
      data[key] = parseSection($, section);
    } catch (err) {
      console.warn(`  ⚠ ${key}: пропущен — неожиданная ошибка: ${err.message}`);
      skipped.push({ key, reason: `неожиданная ошибка: ${err.message}` });
    }
  }

  // Пишем результат в любом случае — даже 1 успешный раздел из 14 лучше,
  // чем ничего из-за одного сбойного.
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf8");

  console.log(`Разобрано разделов: ${Object.keys(data).length}/${listSectionKeys().length} → ${outPath}`);
  if (skipped.length) {
    console.log("Пропущено:");
    for (const { key, reason } of skipped) {
      console.log(`  ${key}: ${reason}`);
    }
  }
}

main().catch((err) => {
  // Сюда мы дойти не должны (см. try/catch в цикле выше) — если всё же дошли,
  // это ошибка до начала разбора (например, битый словарь), а не сайта.
  console.error("Ошибка до начала разбора разделов:", err);
  process.exit(1);
});
