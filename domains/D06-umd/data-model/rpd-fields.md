<!-- ГЕНЕРИРУЕТСЯ из standards/rpd/data/discipline-program-twin.full-template.json (fieldRegistry). Не редактировать вручную: править реестр и пересобирать. -->

# Реестр реквизитов РПД (`fieldRegistry`)

> **Сгенерировано из `standards/rpd/data/discipline-program-twin.full-template.json` (`fieldRegistry`). Не править руками** — это проекция машиночитаемого реестра. Источник истины — массив `fieldRegistry`; форма записи — `$defs.fieldRegistryItem` схемы.

Всего реквизитов: **91**. ✱ — множественное (массив). Применимость «все» = 8 направлений (ДО, СПО, бакалавриат, специалитет, магистратура, ординатура, аспирантура, ДПО).

| Раздел | Лист «РП — дисциплина» | Реквизитов |
|---|---|---|
| Общая характеристика | Общая характеристика программы | 41 |
| Требования к результатам освоения | Тр. к результатам освоения | 12 |
| Тематический план | Тематический план | 9 |
| Карточка темы (занятия) | Карточка темы (занятия) | 14 |
| Условия реализации | Условия реализации | 15 |

## Общая характеристика (41)

| fieldId | Путь | Наименование | Тип | Применимость | Источник / заполнение |
|---|---|---|---|---|---|
| `general.developers` | `generalCharacteristics.developers` | Разработчики программы | array·personReference ✱ | все | справочник / выбор |
| `general.otherPersons` | `generalCharacteristics.otherPersons` | Иные лица | array·manualPerson ✱ | все | ручной ввод / ручной |
| `general.programNames.professionalModuleName` | `generalCharacteristics.programNames.professionalModuleName` | Наименование профессионального модуля | string | СПО | учебный план / произв. |
| `general.programNames.disciplineOrInterdisciplinaryCourseName` | `generalCharacteristics.programNames.disciplineOrInterdisciplinaryCourseName` | Наименование дисциплины / междисциплинарного курса | string | СПО | учебный план / произв. |
| `general.programNames.disciplineModuleName` | `generalCharacteristics.programNames.disciplineModuleName` | Наименование дисциплины (модуля) | string | ДО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.programNames.additionalEducationalProgramName` | `generalCharacteristics.programNames.additionalEducationalProgramName` | Наименование дополнительной образовательной программы | string | ДО | учебный план / произв. |
| `general.programNames.additionalProfessionalProgramName` | `generalCharacteristics.programNames.additionalProfessionalProgramName` | Наименование дополнительной профессиональной программы по специальности | string | ДПО | типовая программа / произв. |
| `general.educationForm` | `generalCharacteristics.educationForm` | Форма обучения | reference | ДПО | типовая программа / произв. |
| `general.workload.lectureHours` | `generalCharacteristics.workload.lectureHours` | Лекционные занятия | number | ДО, СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.lecturesWithElearningAndDotHours` | `generalCharacteristics.workload.lecturesWithElearningAndDotHours` | Лекции (с использованием ЭО и ДОТ) | number | ДПО | учебный план / произв. |
| `general.workload.practicalHours` | `generalCharacteristics.workload.practicalHours` | Практические занятия | number | все | учебный план / произв. |
| `general.workload.laboratoryHours` | `generalCharacteristics.workload.laboratoryHours` | Лабораторные занятия | number | ДО, СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.seminarHours` | `generalCharacteristics.workload.seminarHours` | Семинарские занятия | number | ДО, СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.consultationHours` | `generalCharacteristics.workload.consultationHours` | Консультации | number | Аспирантура | учебный план / произв. |
| `general.workload.independentWorkControlHours` | `generalCharacteristics.workload.independentWorkControlHours` | Контроль самостоятельной работы (КСР) | number | СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.attestationCurrentPeriodContactHours` | `generalCharacteristics.workload.attestationCurrentPeriodContactHours` | Контактная работа на аттестацию в период ТО (АтТО) | number | СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.attestationExamSessionAndGiaContactHours` | `generalCharacteristics.workload.attestationExamSessionAndGiaContactHours` | Контактная работа на аттестацию в период экз. сессии и ГИА (ЭкГИА) | number | СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.selfStudyHours` | `generalCharacteristics.workload.selfStudyHours` | Самостоятельная работа | number | ДО, СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.examSessionSelfStudyControlHours` | `generalCharacteristics.workload.examSessionSelfStudyControlHours` | Контроль (самостоятельная работа в период экз. сессии) | number | СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.practiceContactHours` | `generalCharacteristics.workload.practiceContactHours` | Контактные часы на практику (КчП) | number | СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.practiceReportPreparationHours` | `generalCharacteristics.workload.practiceReportPreparationHours` | Оформление отчетности по практике (ОП) | number | СПО, Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура | учебный план / произв. |
| `general.workload.practiceHours` | `generalCharacteristics.workload.practiceHours` | Практика | number | ДО, ДПО | учебный план / произв. |
| `general.workload.attestationHours` | `generalCharacteristics.workload.attestationHours` | Аттестация | number | ДО, ДПО | учебный план / произв. |
| `general.workload.totalHours` | `generalCharacteristics.workload.totalHours` | ИТОГО в часах | number | все | учебный план / произв. |
| `general.workload.totalCredits` | `generalCharacteristics.workload.totalCredits` | ИТОГО в ЗЕ | number | Бакалавр, Специалитет, Магистр, Ординатура, Аспирантура · гр:ВО | учебный план / произв. |
| `general.controlForms` | `generalCharacteristics.controlForms` | Форма контроля | array·controlForm ✱ | все | учебный план / произв. |
| `general.controlForms.exam` | `generalCharacteristics.controlForms[]` | Экзамен | controlFormItem | все | учебный план / произв. |
| `general.controlForms.credit` | `generalCharacteristics.controlForms[]` | Зачет | controlFormItem | все | учебный план / произв. |
| `general.controlForms.gradedCredit` | `generalCharacteristics.controlForms[]` | Зачет с оценкой | controlFormItem | СПО | учебный план / произв. |
| `general.controlForms.courseWork` | `generalCharacteristics.controlForms[]` | Курсовая работа | controlFormItem | СПО, Бакалавр, Специалитет, Магистр | учебный план / произв. |
| `general.controlForms.periodSemesterOrTrimester` | `generalCharacteristics.controlForms[].period` | № семестра / триместра | controlFormItem | все | учебный план / произв. |
| `general.controlForms.periodModule` | `generalCharacteristics.controlForms[].period` | № модуля | controlFormItem | все | учебный план / произв. |
| `general.controlForms.complexExam` | `generalCharacteristics.controlForms[]` | Комплексный экзамен | controlFormItem | все | учебный план / произв. |
| `general.controlForms.complexCredit` | `generalCharacteristics.controlForms[]` | Комплексный зачет | controlFormItem | все | учебный план / произв. |
| `general.controlForms.complexGradedCredit` | `generalCharacteristics.controlForms[]` | Комплексный зачет с оценкой | controlFormItem | все | учебный план / произв. |
| `general.controlForms.qualificationExam` | `generalCharacteristics.controlForms[]` | Квалификационный экзамен | controlFormItem | все | учебный план / произв. |
| `general.programGoal` | `generalCharacteristics.programGoal` | Цель программы | richText | все | ручной ввод / ручной |
| `general.programTasks` | `generalCharacteristics.programTasks` | Задачи программы | array·text ✱ | все | ручной ввод / ручной |
| `general.interdisciplinaryLinks` | `generalCharacteristics.interdisciplinaryLinks` | Межпредметные связи | object | все | учебный план / выбор/произв. |
| `general.interdisciplinaryLinks.disciplines` | `generalCharacteristics.interdisciplinaryLinks.disciplines` | Дисциплины | array·disciplineReference ✱ | все | справочник / выбор |
| `general.interdisciplinaryLinks.practices` | `generalCharacteristics.interdisciplinaryLinks.practices` | Практики | array·practiceReference ✱ | все | справочник / выбор |

## Требования к результатам освоения (12)

| fieldId | Путь | Наименование | Тип | Применимость | Источник / заполнение |
|---|---|---|---|---|---|
| `learningOutcomes.section` | `learningOutcomes` | Требования к результатам освоения / планируемые результаты обучения | object | все | ручной ввод / смеш. |
| `learningOutcomes.competencies` | `learningOutcomes.competencies` | Компетенции / результаты обучения | array·competencyResult ✱ | все | ОПОП / произв./ручной |
| `learningOutcomes.competencies.code` | `learningOutcomes.competencies[].code` | Индекс / код | string | все | ОПОП / произв./выбор |
| `learningOutcomes.competencies.name` | `learningOutcomes.competencies[].name` | Наименование компетенции | string | все | ОПОП / произв./выбор |
| `learningOutcomes.indicator` | `learningOutcomes.competencies[].indicators[]` | Индикатор | array·indicator ✱ | все | ОПОП / произв./выбор |
| `learningOutcomes.descriptors.knowledge` | `learningOutcomes.competencies[].indicators[].descriptors.knowledge` | Знать | array·text ✱ | все | ручной/программа / ручной/произв. |
| `learningOutcomes.descriptors.skills` | `learningOutcomes.competencies[].indicators[].descriptors.skills` | Уметь | array·text ✱ | все | ручной/программа / ручной/произв. |
| `learningOutcomes.descriptors.mastery` | `learningOutcomes.competencies[].indicators[].descriptors.mastery` | Владеть | array·text ✱ | все | ручной/программа / ручной/произв. |
| `learningOutcomes.controlForms` | `learningOutcomes.competencies[].indicators[].controlForms` | Формы контроля | array·reference ✱ | все | справочник / выбор |
| `learningOutcomes.assessmentMaterials.resultAssessmentMaterials` | `learningOutcomes.assessmentMaterials.resultAssessmentMaterials` | Материалы для оценки результатов освоения программы | object | все | внешний / ссылка |
| `learningOutcomes.assessmentMaterials.plannedResultAssessmentMaterials` | `learningOutcomes.assessmentMaterials.plannedResultAssessmentMaterials` | Материалы для оценки планируемых результатов обучения | object | все | внешний / ссылка |
| `learningOutcomes.competencyIndicatorMode` | `learningOutcomes.competencyIndicatorMode` | Компетенция = Индикатор | boolean | все | системное / расч./флаг |

## Тематический план (9)

| fieldId | Путь | Наименование | Тип | Применимость | Источник / заполнение |
|---|---|---|---|---|---|
| `thematicPlan.periods` | `thematicPlan.periods` | Период обучения | array·studyPeriod ✱ | все | учебный план / произв./ручной |
| `thematicPlan.semesterTrimesterNumber` | `thematicPlan.periods[].number` | № семестра / триместра | integerOrString | все | учебный план / произв. |
| `thematicPlan.moduleNumber` | `thematicPlan.periods[].modules[].moduleNumber` | № модуля | integerOrString | все | учебный план / произв./ручной |
| `thematicPlan.moduleName` | `thematicPlan.periods[].modules[].name` | Наименование модуля / дисциплины / междисциплинарного курса | string | все | учебный план / произв./ручной |
| `thematicPlan.topics` | `thematicPlan.periods[].modules[].topics` | Тема | array·topic ✱ | все | ручной ввод / ручной |
| `thematicPlan.topicName` | `thematicPlan.periods[].modules[].topics[].name` | Наименование темы | string | все | ручной ввод / ручной |
| `thematicPlan.lessons` | `thematicPlan.periods[].modules[].topics[].lessons` | Занятие | array·lesson ✱ | все | ручной ввод / ручной |
| `thematicPlan.lessonType` | `thematicPlan.periods[].modules[].topics[].lessons[].lessonType` | Вид занятия | reference | все | справочник / выбор |
| `thematicPlan.contactHours` | `thematicPlan.periods[].modules[].topics[].lessons[].contactHours` | Контактная работа в часах | number | все | ручной/уч.план / ручной/произв. |

## Карточка темы (занятия) (14)

| fieldId | Путь | Наименование | Тип | Применимость | Источник / заполнение |
|---|---|---|---|---|---|
| `lessonCards.cards` | `lessonCards.cards` | Карточка темы / вида занятия | array·lessonCard ✱ | все | ручной ввод / ручной |
| `lessonCards.disciplineOrModuleRef` | `lessonCards.cards[].disciplineOrModuleRef` | Дисциплина / модуль | reference | все | учебный план / ручной |
| `lessonCards.topicRef` | `lessonCards.cards[].topicRef` | Тема занятия | reference | все | содержательное / ручной |
| `lessonCards.duration.quantity` | `lessonCards.cards[].duration.quantity` | Кол-во | number | все | ручной ввод / ручной |
| `lessonCards.duration.pairHours` | `lessonCards.cards[].duration.pairHours` | Пара | number | все | системное / ручной |
| `lessonCards.duration.lessonHours` | `lessonCards.cards[].duration.lessonHours` | Урок | number | все | системное / ручной |
| `lessonCards.lessonType` | `lessonCards.cards[].lessonType` | Вид занятия | reference | все | справочник / выбор/ручной |
| `lessonCards.goal` | `lessonCards.cards[].goal` | Цель | richText | все | ручной ввод / ручной |
| `lessonCards.annotation` | `lessonCards.cards[].annotation` | Аннотация | richText | все | ручной ввод / ручной |
| `lessonCards.methods` | `lessonCards.cards[].methods` | Методы обучения | array | все | справочник / выбор/ручной |
| `lessonCards.means` | `lessonCards.cards[].means` | Средства обучения | array | все | справочник / выбор/ручной |
| `lessonCards.controlForms` | `lessonCards.cards[].controlForms` | Форма контроля | array | все | справочник / выбор/ручной |
| `lessonCards.formedCompetencies` | `lessonCards.cards[].formedCompetencies` | Формируемые компетенции | array | все | справочник / выбор/ручной |
| `lessonCards.outcomeAlignment` | `lessonCards.cards[].outcomeAlignment` | Соотнесение с требованиями к результатам освоения | array | все | справочник / выбор/ручной |

## Условия реализации (15)

| fieldId | Путь | Наименование | Тип | Применимость | Источник / заполнение |
|---|---|---|---|---|---|
| `conditions.educationalMethodicalSupport` | `implementationConditions.educationalMethodicalSupport` | Учебно-методическое обеспечение | object | все | ручной/справочник / смеш. |
| `conditions.literature` | `implementationConditions.educationalMethodicalSupport.literature` | Список литературы | object | все | ручной/справочник / выбор/ручной |
| `conditions.literature.main` | `implementationConditions.educationalMethodicalSupport.literature.main` | Основная литература | array·literatureItem ✱ | все | справочник / выбор |
| `conditions.literature.additional` | `implementationConditions.educationalMethodicalSupport.literature.additional` | Дополнительная литература | array·literatureItem ✱ | все | справочник / выбор |
| `conditions.software` | `implementationConditions.educationalMethodicalSupport.software` | Программное обеспечение | array·softwareItem ✱ | все | справочник / выбор/умолч. |
| `conditions.electronicResources` | `implementationConditions.educationalMethodicalSupport.electronicResources` | Электронно-библиотечные системы, профессиональные базы данных и информационные справочные системы | array·electronicResource ✱ | все | справочник / выбор/умолч. |
| `conditions.materialTechnicalSupport` | `implementationConditions.materialTechnicalSupport` | Материально-техническое обеспечение | object | все | аудиторный фонд / произв. |
| `conditions.rooms.address` | `implementationConditions.materialTechnicalSupport.rooms[].address` | Адрес помещения | string | все | аудиторный фонд / произв. |
| `conditions.rooms.roomNumber` | `implementationConditions.materialTechnicalSupport.rooms[].roomNumber` | № помещения | string | все | аудиторный фонд / произв. |
| `conditions.rooms.roomType` | `implementationConditions.materialTechnicalSupport.rooms[].roomType` | Тип помещения | string | все | аудиторный фонд / произв. |
| `conditions.rooms.roomKind` | `implementationConditions.materialTechnicalSupport.rooms[].roomKind` | Вид помещения | string | все | аудиторный фонд / произв. |
| `conditions.rooms.equipment` | `implementationConditions.materialTechnicalSupport.rooms[].equipment` | Оснащение помещения | array·equipmentItem ✱ | все | аудиторный фонд / произв. |
| `conditions.clinicalBaseContracts` | `implementationConditions.materialTechnicalSupport.clinicalBaseContracts` | Клиническая база на основании договора | array·contractReference ✱ | все | договоры/базы / выбор/произв. |
| `conditions.practicalTraining.medicalOrganizationsText` | `implementationConditions.practicalTraining.medicalOrganizationsText` | Практическая подготовка в медицинских организациях | richText | все | шаблон/ручной / шаблон/ручной |
| `conditions.practicalTraining.pharmaceuticalOrganizationsText` | `implementationConditions.practicalTraining.pharmaceuticalOrganizationsText` | Практическая подготовка в фармацевтических организациях | richText | все | шаблон/ручной / шаблон/ручной |
