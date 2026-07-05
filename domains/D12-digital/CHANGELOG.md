# CHANGELOG — D12: Цифровая инфраструктура и интеграции

Формат: [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/)  
Версионирование: [Semantic Versioning](https://semver.org/lang/ru/)

---

## [Не выпущено]

### Добавлено
- Первичная структура домена D12: README, GUIDE, metadata.yml, data-model, processes
- D12-P01: Интеграция с ФИС ГИА и Приём (draft)
- Документация ФИС ГИА API в `best-practices/fis-egia-api/`:
  - API ВО v3.5.0: getting-started, scenarios, reference, entities, classifiers, XSD-схемы (168 файлов)
  - API СПО v1.0: JSON Schema (98 файлов), spo/README
- `best-practices/gosklyuch-integration.md` — полный жизненный цикл интеграции с сервисом
  «Отправка документов на подпись в Госключ» через ЕПГУ / ЕСИА: настройка прав, получение
  API-Key, работа с Access Token, спецификация API, требования к ZIP-архивам,
  жизненный цикл заявления, типовые применения в ОО. Источник: `framework.univercon.aplicon.ru`
  (архивный репо, разбираем из inbox).
- Изначальный драфт: Claude Sonnet 4.6 / Opus 4.8, отредактирован вручную
