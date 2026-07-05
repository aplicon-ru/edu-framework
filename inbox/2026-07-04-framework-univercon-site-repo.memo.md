# Memo: framework.univercon.aplicon.ru — старый репозиторий сайта фреймворка

**Дата попадания:** 2026-07-04
**Источник:** @iMironRU (перенос организации aplicon-ru, беклог)
**Тип:** оргвопрос / техдолг
**Предположительная судьба:** архивация репозитория + перепривязка домена, отказ от содержимого
**Ответственный:** @iMironRU

## Что это

`iMironRU/framework.univercon.aplicon.ru` — более старый репозиторий с похожим содержимым
(та же методология фреймворка), к которому сейчас фактически привязан домен `framework.aplicon.ru`
(GitHub Pages, `homepage` репозитория). При этом штатный custom domain в настройках Pages
(`CNAME`-файл) в репозитории не обнаружен — домен, вероятно, указывает на GH Pages не через
стандартный механизм, а иначе (например, через внешний DNS/прокси) — при переносе это не проверялось
из песочницы (нет надёжного сетевого доступа для проверки DNS).

## Что с этим делать

1. Свериться, нет ли в `framework.univercon.aplicon.ru` контента, не попавшего в этот фреймворк —
   если есть, извлечь и распределить по доменам здесь.
2. Разобраться, как в реальности настроен домен `framework.aplicon.ru`, и перепривязать его на
   `aplicon-ru/edu-framework` (для этого сюда же нужно будет добавить сборку/публикацию Pages —
   сейчас в `edu-framework` Pages не включены).
3. После переезда домена — заархивировать `iMironRU/framework.univercon.aplicon.ru` (не удалять).

## Разбор проведён 2026-07-04

Полный анализ содержимого архива `a9ce6897-framework.univercon.aplicon.rumain.zip`.

**Уже было в edu-framework на момент разбора:**
- `students/database/list_of_orders.md` — перенесено в D05 entities.md (енумы приказов)
- `students/database/list_of_status.md` — перенесено в D05 entities.md (енумы статусов)
- `management/legislation.md` — полностью покрыто в D01 `regulatory-registry.md`
  (наш реестр был построен из того же источника, переструктурирован по доменам)

**Извлечено в этом раунде (приоритет 1):**
- `management/edu_org_staffing.md` → **D07** best-practice `typical-org-structure.md`
  (D07 создан целиком как новый домен)
- `about/api/ExtAPI/GosKeyAPI/index.md` → **D12** best-practice `gosklyuch-integration.md`

**Осталось на следующие раунды (приоритет 2):**
- `management/TypesOfEducation.md` (166 стр., виды образования РФ + mermaid) — в D01 или D04
- `management/LicensingOfEducationalActivities/opf.md` (71 стр., таблица ОПФ+ОКВЭД) — в D02
- `management/LicensingOfEducationalActivities/index.md` (110 стр., регламент лицензирования)
  — сверить с D02-P02, извлечь недостающее
- `about/api.md` (61 стр., обзор API — упоминает Кабиторий) — в `implementations/` для
  Универкона и Кабитория, либо в D12

**Пропущено (заглушки или нерелевантно):**
- `docs/glossary.md` — технический глоссарий про API/git/деплой, не про образование
- `docs/about/introduction.md` — упоминает «EduFlow Framework» (посторонняя заглушка)
- ~20 файлов по 25 строк со стандартным «Это заглушка» (planning/*, extracurricular/*,
  research/*, about/user-guide, faq, technical и т.д.) — контента нет

**Про сам старый репо `iMironRU/framework.univercon.aplicon.ru`:**
- Отдельный MkDocs-сайт с русскоязычным заголовком «Универкон»
- Сайт `framework.aplicon.ru` уже показывает контент из нового `aplicon-ru/edu-framework`
  (проверено WebFetch: содержит D14, что появилось только у нас)
- Логично оформить как `implementations/univercon.md` (kind: prototype, status: archived)
  на следующем раунде

**Итог:** после раунда приоритета 2 старый репо можно архивировать без потерь.
