# Слой `print` — печать и обратное восстановление

**Статус:** draft · best-practice

Печатный документ — это **представление** Двойника, а не источник истины. Сборка Word/PDF идёт
из `content` по привязкам; обратное восстановление — смысловое, не пиксельное.

## Модель печати (`$defs`: `printLayer` → `printSection` / `printBinding`)

```
print
├── description
├── defaultTemplateId
├── supportedFormats[]         // docx | pdf | html
├── roundTripMode             // semantic
├── sections[]
│   ├── sectionId
│   ├── title
│   └── source                // content.<section> — что питает раздел
└── bindings[]
    ├── bindingId
    ├── path                  // путь в content
    ├── label
    ├── sourceSection
    └── renderAs              // text | list | table | paragraphs | computed
```

`sections` задают порядок и заголовки печатного документа; `bindings` — куда и как подставляются
конкретные реквизиты. В v0.2.0 — по одной привязке на реквизит реестра (91 привязка).

## Сборка: Двойник → Word/PDF

```
вход: twin, templateId
1. для каждой section в print.sections (в порядке следования):
2.   вывести section.title
3.   для каждого binding с sourceSection == section.sectionId:
4.      value := getByPath(twin.content, binding.path)
5.      label := binding.label ?? fieldRegistry[binding.path].presentation.printLabel
6.      emit(value, binding.renderAs, label)
```

Ручного переноса данных из формы в Word нет: и форма, и печать читают один `content`.

## Семантика `renderAs`

| `renderAs` | Как выводится | Пример |
|---|---|---|
| `text` | строкой после подписи | `…workload.totalHours` → «Трудоёмкость в часах: 756» |
| `list` | маркированный/нумерованный список | `…programTasks` |
| `table` | повторяемая таблица по элементам массива | `…developers`, `…thematicPlan.periods` |
| `paragraphs` | абзацы из richText | `…programGoal` |
| `computed` | вычисляемое на сборке | агрегаты, итоги |

Подпись в печати берётся из `presentation.printLabel` (может отличаться от `formLabel`).

## Round-trip: `roundTripMode = semantic`

Цель — не восстановить исходную вёрстку пиксель-в-пиксель, а восстановить **смысловые
реквизиты** и затем собрать корректный документ по актуальному шаблону. Старый Word/PDF может
отличаться форматированием — система извлекает наименование, часы, компетенции, разработчиков,
цели и т.д., а не шрифты и отступы.

## Обратное восстановление (`$defs`: `reverseImportLayer`)

```
reverseImport
├── description
├── supportedSourceFormats[]   // docx | pdf | xlsx | html
├── strategy                   // semantic_extraction_with_human_verification
└── extractionTargets[]
    ├── target                 // context | content.generalCharacteristics | …
    └── description
```

Алгоритм:

```
вход: файл (docx/pdf/xlsx/html)
1. для каждого extractionTarget:
2.   найти в документе подписи/таблицы по presentation.printLabel и sourceWorksheet
3.   распознать значение, сопоставить с path реестра
4.   setByPath(twin.content, path, value)
5.   provenance[path] := { sourceType, sourcePage, sourceFragment,
                           extractionMethod, verificationStatus: requires_review }
6. человек верифицирует → verificationStatus: verified
7. прогнать validation.rules → черновик Двойника
```

Каждое восстановленное значение **обязано** нести `provenance` (откуда, как, подтверждено ли).
Стратегия по умолчанию — извлечение с обязательной проверкой человеком.

## Пример привязок

| bindingId | path | renderAs | в печати |
|---|---|---|---|
| `print.general.developers` | `…generalCharacteristics.developers` | table | таблица разработчиков |
| `print.general.workload.totalHours` | `…workload.totalHours` | text | «ИТОГО в часах: …» |
| `print.general.programGoal` | `…generalCharacteristics.programGoal` | paragraphs | абзац цели |

## Реализация в 1С

| Объект | Назначение |
|---|---|
| Обработка «ФормированиеПечатнойРПД» | сборка Word/PDF по `print.bindings` и шаблону |
| Обработка «ИмпортРПД» | заполнение Двойника из Word/PDF/XLSX/HTML, фиксация `provenance` |
| Макеты печатных форм | несколько `templateId` под разные кафедры/программы |

- Несколько шаблонов печати — через `defaultTemplateId` + альтернативные `templateId`.
- Печать всегда из Двойника; печатный файл не редактировать как самостоятельный источник.
