# Archive

> Архив устаревших и выполненных планирующих документов

## Назначение

Эта директория содержит документы, которые выполнили свою функцию и больше не являются актуальными для повседневной работы, но сохраняются для:

- Истории принятия решений
- Контекста реализации
- Будущих ретроспектив

---

## Файлы в архиве

### 1. DIAGRAMS_PLAN_2025-10-14_completed.md

**Дата создания:** 2025-10-14
**Дата завершения:** 2025-10-19
**Статус:** ✅ Выполнено (Фаза 1 + Фаза 2)

**Описание:**
План реализации Architecture Diagrams as Code. Документ содержит:

- Первоначальный план структуры диаграмм
- Приоритизацию (Must Have / Should Have / Nice to Have)
- Обоснование выбора Mermaid
- Критерии уровня детализации
- Итоговые статусы выполнения

**Что было реализовано:**

- ✅ 4 C4 диаграммы (Level 1-4)
- ✅ 2 Sequence диаграммы (Connect Wallet, Send Transaction)
- ✅ 2 State Machine диаграммы (Wallet Connection, Transaction)
- ✅ ADR структура (README, template, 2 ADR)

**Что НЕ было реализовано (Фаза 3 - Nice to Have):**

- ❌ Sequence: Account Change Flow
- ❌ Sequence: Network Change Flow
- ❌ Deployment Diagram
- ❌ Data Flow Diagram
- ❌ ADR-003: Tailwind CSS

**⚠️ Важно о примерах кода:**
Примеры кода в архивном документе являются упрощенными набросками для планирования и могут не соответствовать финальной реализации. Для актуальной структуры классов и методов см. [Level 4: Code Diagram](../architecture/c4-diagrams/level-4-code.md).

**Актуальная документация:**
См. [docs/architecture/README.md](../architecture/README.md)

---

### 2. C4_DIAGRAMS_2025-10-14_draft.md

**Дата создания:** 2025-10-14
**Статус:** 📝 Черновик (заменен Mermaid диаграммами)

**Описание:**
Первоначальный черновик с ASCII-art диаграммами для всех уровней C4 Model.

**Содержит:**

- ASCII-art диаграммы для Level 1-4
- Текстовые описания Sequence диаграмм
- Базовые ADR (001: ethers.js, 002: Service Layer, 003: Tailwind)
- Вопросы для согласования

**Почему архивирован:**
Заменен структурированными Mermaid диаграммами в `docs/architecture/c4-diagrams/`, которые:

- Автоматически рендерятся в GitHub
- Легче поддерживать и обновлять
- Имеют единообразный стиль
- Детальнее документированы

**Актуальная версия:**

- C4 диаграммы: [docs/architecture/c4-diagrams/](../architecture/c4-diagrams/)
- ADR: [docs/architecture/adrs/](../architecture/adrs/)

---

### 3. FRAMEWORK_AGNOSTIC_RESEARCH_2025-10-14.md

**Дата создания:** 2025-10-14
**Статус:** 📚 Исследование (вошло в ADR-002)

**Описание:**
Исследование возможности построения framework-agnostic архитектуры для Web3 приложений.

**Содержит:**

- Анализ проблемы зависимости от React
- Layered Architecture подход
- Примеры адаптеров для React, Vue, Svelte
- Паттерны: Observer, Service Layer, Adapter
- Сравнение подходов

**Почему архивирован:**
Информация из исследования:

- ✅ Легла в основу [ADR-002: Framework-agnostic архитектура](../architecture/adrs/002-framework-agnostic-architecture.md)
- ✅ Отражена в [Level 3: Component Diagram](../architecture/c4-diagrams/level-3-components.md)
- ✅ Реализована в архитектуре проекта (WalletService + useWallet)

**Актуальная версия:**
См. [ADR-002](../architecture/adrs/002-framework-agnostic-architecture.md)

---

**Последнее обновление:** 2025-10-19
