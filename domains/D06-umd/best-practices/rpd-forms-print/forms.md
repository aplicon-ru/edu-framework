# Слой `forms` — пользовательские формы поверх Двойника

**Статус:** draft · best-practice

Описывает, как из одного `content` построить разные формы под уровни образования, не дублируя
модель данных. Форма — это **проекция** реестра реквизитов через профиль уровня.

## Модель (`$defs`: `formsLayer` → `formProfile` → `formSection` → `formGroupRef`)

```
forms
├── description
├── activeProfileId            // какой профиль показан сейчас (опц.)
└── profiles
    └── <DIRECTION>            // DO | SPO | BACHELOR | … | DPO
        ├── direction
        └── sections[]
            ├── sectionId      // generalCharacteristics | learningOutcomes | …
            ├── title
            ├── sourceWorksheet
            └── groups[]
                ├── groupId    // authors | programNames | workload | …
                └── fields[]   // массив path-ов в content
```

Профиль **не хранит данные** — только перечень путей, которые видны на уровне. Сами значения
лежат в `content`, описание каждого пути — в `fieldRegistry`.

## Разрешение применимости

Видимость поля определяется на пересечении трёх источников:

1. поле включено в `forms.profiles[level].sections[].groups[].fields[]`;
2. `fieldRegistry[path].applicableDirections` содержит выбранное направление (или
   `applicableDirectionGroups` — его группу);
3. правило `validation` типа `applicability`/`required` для этого пути и уровня.

Профили v0.2.0 уже согласованы с реестром: каждый путь из профиля присутствует в
`fieldRegistry`, поэтому шаг 2 — это контроль целостности, а не фильтр на лету.

## Алгоритм построения формы

```
вход: level (DO…DPO), twin
1. profile := twin.forms.profiles[level]
2. для каждой section в profile.sections:
3.   для каждой group в section.groups:
4.     для каждого path в group.fields:
5.        reg  := lookup(twin.fieldRegistry, path)      // по полю path
6.        control := uiControl(reg.valueType, reg.itemType, reg.multiple)
7.        label   := reg.presentation.formLabel ?? reg.title
8.        readOnly:= isDerived(reg.source.fillMode)
9.        value   := getByPath(twin.content, path)       // чтение
10.       render(control, label, value, readOnly)
11.       onChange → setByPath(twin.content, path, v)    // запись
```

`getByPath` / `setByPath` следуют резолверу из корневого `$comment` схемы: точечный путь от
корня; `[]` — «каждый элемент массива» (для табличных групп строится повторяемая строка).

## Привязка `valueType` → контрол (рекомендация)

| `valueType` | Контрол | Примечание |
|---|---|---|
| string | `text` | |
| richText | `textarea` | многострочный |
| number | `number` | |
| boolean | `checkbox` | |
| reference | `referencePicker` | выбор из справочника по `source.sourcePath` |
| array (`multiple`) | `table` / `multiselect` | таблица — если `itemType` объектный (personReference, indicator, topic…) |
| object | подформа / группа | вложенный блок (например `workload`) |
| controlFormItem | `table` | строки форм контроля с привязкой к периоду |
| integerOrString | `text` | период: номер или строка |

## Read-only по источнику

`source.fillMode` определяет редактируемость:

| `fillMode` | Поведение в форме |
|---|---|
| `derived` | read-only; значение проецируется из источника (`source.sourcePath`), правка — в источнике |
| `select_from_reference` | выбор из справочника |
| `manual` | ручной ввод |
| `*_or_*` (`derived_or_manual`, `select_or_manual` …) | предзаполнение из источника с возможностью переопределить вручную; переопределение фиксируется в `provenance` |

> Инвариант (из сущности 1.6): часы и формы контроля — `derived` из строки учебного плана.
> В форме они **не редактируются**; правка — только через учебный план, иначе два источника истины.

## Пример

Уровень `SPECIALIST`, группа `workload` раздела `generalCharacteristics`:

| path | valueType | fillMode | контрол | состояние |
|---|---|---|---|---|
| `…workload.lectureHours` | number | derived | number | read-only |
| `…workload.totalHours` | number | derived | number | read-only |
| `…workload.totalCredits` | number | derived | number | read-only (виден: ВО) |

Группа `authors`: `…developers` (array · personReference · select_from_reference) →
таблица с выбором сотрудников кафедры; `…otherPersons` (array · manualPerson · manual) →
таблица ручного ввода.

Поле `…programNames.professionalModuleName` присутствует в реестре, но его `applicableDirections = [SPO]`,
поэтому в профиле `SPECIALIST` оно отсутствует и в форме не появляется.

## Реализация в 1С

Форму строить **не жёстко под уровень**, а динамически:

```
выбран профиль (например SPECIALIST)
   → forms.profiles.SPECIALIST.sections
   → список путей content.*
   → fieldRegistry даёт заголовок, тип, источник, применимость
   → управляемая форма показывает только нужные реквизиты
```

- Применимость и подписи не зашивать в код — брать из `forms` и `fieldRegistry`.
- Derived-поля помечать как недоступные для редактирования; источник тянуть из учебного плана (D06, 1.4).
- Запись и чтение — по путям в JSON-поле документа; ключевые атрибуты дублировать в реквизиты 1С для отбора и отчётности.
