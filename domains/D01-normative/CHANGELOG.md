# CHANGELOG · D01 Нормативно-правовая база

## [Не выпущено]

### Добавлено
- `types-of-education.md` — справочный обзор 4 видов образования РФ (общее,
  профессиональное, дополнительное, профессиональное обучение), уровни каждого вида,
  правила переходов, mermaid-диаграмма образовательных траекторий.
  Перенос из `framework.univercon.aplicon.ru/docs/management/TypesOfEducation.md`
  (см. `inbox/2026-07-04-framework-univercon-site-repo.memo.md`).
- В `metadata.yml` добавлена ссылка на `implementations/univercon.md` — прототип, из
  которого был перенесён исходный реестр НПА и обзор видов образования.

## [0.1.0] — 2026-05-20

### Добавлено
- Структура домена: README, GUIDE, metadata.yml, processes/, data-model/
- Реестр НПА (`regulatory-registry.md`): 16 тематических блоков, ~120 актов
  перенесены из `framework.univercon.aplicon.ru/docs/management/legislation.md`
  и переструктурированы по доменам-получателям нового фреймворка
- Процесс D01-P01: Мониторинг изменений законодательства
- Модель данных НПА (`data-model/entities.md`)

### Источники и авторство
- Исходный реестр: репозиторий `framework.univercon.aplicon.ru`, файл `docs/management/legislation.md`
- Структурирование по доменам: iMironRU, 2026-05-20
- Помощь при оформлении: Claude Sonnet 4.6

### Примечание
Актуальность ссылок на момент переноса не верифицирована.
Необходима проверка по KonsultantPlus перед переводом в статус `review`.
