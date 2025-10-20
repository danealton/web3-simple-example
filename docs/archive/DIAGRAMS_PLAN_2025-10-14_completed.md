# План реализации Architecture Diagrams as Code

> Согласование списка диаграмм для реализации в формате Diagrams-as-Code
>
> ⚠️ **АРХИВНЫЙ ДОКУМЕНТ**
>
> Этот документ отражает **первоначальный план** (2025-10-14) и был завершен 2025-10-19.
> Примеры кода в этом документе являются **упрощенными набросками** для планирования и могут не соответствовать финальной реализации.
>
> **Для актуальной информации см.:**
>
> - 📄 [Architecture Documentation](../architecture/README.md) - главная навигация
> - 📄 [Level 4: Code Diagram](../architecture/c4-diagrams/level-4-code.md) - актуальная структура классов и интерфейсов
> - 📄 [ADR-001](../architecture/adrs/001-use-ethers-js-v6.md), [ADR-002](../architecture/adrs/002-framework-agnostic-architecture.md) - принятые архитектурные решения

**Дата создания:** 2025-10-14
**Статус:** ✅ Выполнено (Фаза 1 + Фаза 2)

---

## 📋 Предлагаемая структура

```text
docs/architecture/
├── README.md                           # Навигация по архитектурным документам
├── DIAGRAMS_PLAN.md                    # Этот файл - план реализации
│
├── c4-diagrams/                        # C4 Model диаграммы
│   ├── level-1-system-context.md      # Level 1: System Context
│   ├── level-2-containers.md          # Level 2: Container Diagram
│   ├── level-3-components.md          # Level 3: Component Diagram
│   └── level-4-code.md                # Level 4: Code (Classes)
│
├── sequences/                          # Sequence Diagrams
│   ├── connect-wallet-flow.md         # Подключение кошелька
│   ├── send-transaction-flow.md       # Отправка транзакции
│   ├── account-change-flow.md         # Смена аккаунта
│   └── network-change-flow.md         # Смена сети
│
├── state-machines/                     # State Diagrams
│   ├── wallet-connection-states.md    # Состояния подключения
│   └── transaction-states.md          # Состояния транзакции
│
└── adr/                                # Architecture Decision Records
    ├── README.md                       # Индекс всех ADR
    ├── template.md                     # Шаблон для новых ADR
    ├── 0001-ethers-js-over-web3js.md
    ├── 0002-service-layer-pattern.md
    └── 0003-tailwind-css.md
```

---

## 🎯 Список диаграмм для реализации

### Фаза 1: C4 Model (Обязательные) ✅

#### 1.1 Level 1: System Context Diagram

**Файл:** `c4-diagrams/level-1-system-context.md`
**Инструмент:** Mermaid `flowchart TB` (Top-Bottom)
**Показывает:**

- User
- Web3 DApp Application
- MetaMask Wallet (External)
- Ethereum Blockchain (External)

**Взаимодействия:**

- User → Web3 DApp
- Web3 DApp → MetaMask
- MetaMask → Ethereum

**Статус:** ✅ Готово (2025-10-19)

---

#### 1.2 Level 2: Container Diagram

**Файл:** `c4-diagrams/level-2-containers.md`
**Инструмент:** Mermaid `flowchart TB` с `subgraph` для границ контейнеров
**Показывает:**

- React SPA [TypeScript, React 18]
- Web3 Integration Layer [ethers.js v6]
- MetaMask Provider [Browser Extension]
- Ethereum Node [JSON-RPC API]

**Взаимодействия:**

- React SPA → Web3 Integration Layer
- Web3 Integration Layer → MetaMask Provider
- Web3 Integration Layer → Ethereum Node

**Статус:** ✅ Готово (2025-10-19)

---

#### 1.3 Level 3: Component Diagram

**Файл:** `c4-diagrams/level-3-components.md`
**Инструмент:** Mermaid `flowchart TB` с `subgraph` для слоев архитектуры
**Показывает:**

- App Component
- WalletConnect Component
- WalletInfo Component
- SendTransaction Component
- useWallet Hook (Adapter)
- WalletService (Core)
- EthereumUtils
- Types/Interfaces

**Взаимодействия:**

- Components → useWallet Hook
- useWallet Hook → WalletService
- WalletService → EthereumUtils

**Статус:** ✅ Готово (2025-10-19)

---

#### 1.4 Level 4: Code Diagram

**Файл:** `c4-diagrams/level-4-code.md`
**Инструмент:** Mermaid (classDiagram)
**Показывает:**

##### 1.4.1 WalletService Class

```typescript
class WalletService {
  - state: WalletState
  - provider: BrowserProvider | null
  - listeners: Set<StateListener>

  + connect(): Promise<void>
  + disconnect(): Promise<void>
  + sendTransaction(to, amount): Promise<string>
  + subscribe(listener): UnsubscribeFn
  + getState(): WalletState

  - notify(): void
  - handleAccountsChanged(accounts): void
  - handleChainChanged(chainId): void
}
```

##### 1.4.2 useWallet Hook Structure

```typescript
function useWallet() {
  service: WalletService
  state: WalletState

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    sendTransaction
  }
}
```

##### 1.4.3 Dependencies

- WalletService → ethers.js (BrowserProvider, formatEther, parseEther)
- useWallet → WalletService
- Components → useWallet

**Статус:** ✅ Готово (2025-10-19)

---

### Фаза 2: Sequence Diagrams (Обязательные) ✅

#### 2.1 Connect Wallet Flow

**Файл:** `sequences/connect-wallet-flow.md`
**Инструмент:** Mermaid (sequenceDiagram)
**Участники:**

- User
- WalletConnect Component
- useWallet Hook
- WalletService
- MetaMask
- Ethereum

**Сценарий:**

1. User clicks "Connect"
2. Component → useWallet.connectWallet()
3. useWallet → WalletService.connect()
4. WalletService → MetaMask (eth_requestAccounts)
5. User confirms in MetaMask
6. MetaMask → WalletService (accounts)
7. WalletService → Ethereum (getBalance, getNetwork)
8. WalletService notifies subscribers
9. UI updates with wallet info

**Статус:** ✅ Готово (2025-10-19)

---

#### 2.2 Send Transaction Flow

**Файл:** `sequences/send-transaction-flow.md`
**Инструмент:** Mermaid (sequenceDiagram)
**Участники:**

- User
- SendTransaction Component
- useWallet Hook
- WalletService
- MetaMask
- Ethereum

**Сценарий:**

1. User enters recipient & amount
2. User clicks "Send"
3. Component → useWallet.sendTransaction()
4. useWallet → WalletService.sendTransaction()
5. WalletService validates input
6. WalletService → MetaMask (signer.sendTransaction)
7. User confirms in MetaMask
8. MetaMask → Ethereum (submit transaction)
9. WalletService waits for receipt
10. WalletService updates balance
11. UI shows success

**Статус:** ✅ Готово (2025-10-19)

---

#### 2.3 Account Change Flow (Новая)

**Файл:** `sequences/account-change-flow.md`
**Инструмент:** Mermaid (sequenceDiagram)
**Участники:**

- User
- MetaMask
- WalletService
- useWallet Hook
- UI Components

**Сценарий:**

1. User switches account in MetaMask
2. MetaMask → WalletService (accountsChanged event)
3. WalletService updates state
4. WalletService fetches new balance
5. WalletService notifies subscribers
6. UI updates with new account info

**Статус:** 🔴 Не реализовано
**Приоритет:** Средний (добавить после основных)

---

#### 2.4 Network Change Flow (Новая)

**Файл:** `sequences/network-change-flow.md`
**Инструмент:** Mermaid (sequenceDiagram)
**Участники:**

- User
- MetaMask
- WalletService
- useWallet Hook
- UI Components

**Сценарий:**

1. User switches network in MetaMask
2. MetaMask → WalletService (chainChanged event)
3. WalletService updates chainId
4. WalletService updates balance (for new network)
5. WalletService notifies subscribers
6. UI shows new network info

**Статус:** 🔴 Не реализовано
**Приоритет:** Средний (добавить после основных)

---

### Фаза 3: State Diagrams (Рекомендуемые) 🎯

#### 3.1 Wallet Connection States

**Файл:** `state-machines/wallet-connection-states.md`
**Инструмент:** Mermaid (stateDiagram-v2)
**Состояния:**

```text
[Disconnected]
    ↓ connect()
[Connecting]
    ↓ success
[Connected]
    ↓ disconnect() / error
[Disconnected]
```

**Детальные состояния:**

- `Disconnected` - нет подключения
- `Connecting` - запрос в процессе
- `Connected` - кошелек подключен
- `Error` - ошибка подключения

**Переходы:**

- `connect()` - Disconnected → Connecting
- `success` - Connecting → Connected
- `error` - Connecting → Error
- `disconnect()` - Connected → Disconnected
- `retry` - Error → Connecting

**Статус:** ✅ Готово (2025-10-19)
**Приоритет:** Высокий

---

#### 3.2 Transaction States

**Файл:** `state-machines/transaction-states.md`
**Инструмент:** Mermaid (stateDiagram-v2)
**Состояния:**

```text
[Idle]
    ↓ send()
[Validating]
    ↓ valid
[Signing]
    ↓ signed
[Pending]
    ↓ mined
[Confirmed]
    ↓ new transaction
[Idle]
```

**Детальные состояния:**

- `Idle` - готов к новой транзакции
- `Validating` - проверка входных данных
- `Signing` - ожидание подписи в MetaMask
- `Pending` - транзакция отправлена, ждем включения в блок
- `Confirmed` - транзакция подтверждена
- `Failed` - ошибка на любом этапе

**Переходы:**

- `send()` - Idle → Validating
- `valid` - Validating → Signing
- `invalid` - Validating → Failed
- `signed` - Signing → Pending
- `rejected` - Signing → Failed
- `mined` - Pending → Confirmed
- `reset` - Confirmed/Failed → Idle

**Статус:** ✅ Готово (2025-10-19)
**Приоритет:** Высокий

---

### Фаза 4: ADR (Architecture Decision Records) 📝

#### 4.1 ADR Index

**Файл:** `adr/README.md`
**Содержимое:** Таблица всех архитектурных решений

**Статус:** 🔴 Не реализовано

---

#### 4.2 ADR-0001: ethers.js over web3.js

**Файл:** `adr/0001-ethers-js-over-web3js.md`
**Статус решения:** Принято
**Дата:** 2025-10-14

**Разделы:**

- Контекст
- Рассмотренные варианты
- Решение
- Последствия

**Статус:** ✅ Готово (реализовано как ADR-001, 2025-10-19)

---

#### 4.3 ADR-0002: Service Layer Pattern

**Файл:** `adr/0002-service-layer-pattern.md`
**Статус решения:** Принято
**Дата:** 2025-10-14

**Разделы:**

- Контекст (зачем разделять на Service и Adapter)
- Рассмотренные варианты (monolith hook vs service layer)
- Решение (WalletService + useWallet adapter)
- Последствия

**Статус:** ✅ Готово (реализовано как ADR-002, 2025-10-19)

---

#### 4.4 ADR-0003: Tailwind CSS

**Файл:** `adr/0003-tailwind-css.md`
**Статус решения:** Принято
**Дата:** 2025-10-14

**Статус:** 🔴 Не реализовано (текст есть в C4_DIAGRAMS.md, нужно выделить в отдельный файл)

---

#### 4.5 ADR Template

**Файл:** `adr/template.md`
**Назначение:** Шаблон для новых архитектурных решений

**Содержит:**

- Структуру ADR
- Примеры заполнения
- Best practices

**Статус:** ✅ Готово (2025-10-19)

---

## 🛠 Технические решения

### Выбор инструмента: Mermaid

**Обоснование:**

- ✅ Встроен в GitHub/GitLab - рендерится автоматически
- ✅ Простой текстовый синтаксис
- ✅ Не требует дополнительных инструментов
- ✅ Поддерживает все нужные типы диаграмм:
  - flowchart (для C4 Level 1, 2, 3)
  - classDiagram (для C4 Level 4)
  - sequenceDiagram (для sequence flows)
  - stateDiagram-v2 (для state machines)
- ✅ Легко редактировать и версионировать
- ✅ Можно предпросмотреть в VSCode с расширением

**Альтернативы рассмотрены:**

- PlantUML - требует установки, сложнее синтаксис
- D2 - новый, меньше поддержки инструментов
- Structurizr DSL - специализирован для C4, избыточен для нас

### Структура файлов диаграмм

Каждый файл должен содержать:

```markdown
# Название диаграммы

> Краткое описание (1-2 предложения)

## Диаграмма

```mermaid
[код диаграммы]
```​

## Описание

Текстовое описание элементов и взаимодействий

### Элементы

- **Element 1**: Описание
- **Element 2**: Описание

### Взаимодействия

- Element 1 → Element 2: описание связи

## См. также

- Ссылки на связанные диаграммы
- Ссылки на код

---

**Последнее обновление:** YYYY-MM-DD
```

---

## 📊 Приоритизация

### Must Have (Фаза 1) - Обязательно для MVP

1. ✅ Level 1: System Context
2. ✅ Level 2: Container Diagram
3. ✅ Level 3: Component Diagram
4. ✅ Sequence: Connect Wallet Flow
5. ✅ Sequence: Send Transaction Flow
6. ✅ ADR Index + existing ADRs migration

**Срок:** До начала реализации кода

---

### Should Have (Фаза 2) - Важно, но не блокирующее

1. ⭐ Level 4: Code Diagram (Classes)
2. ⭐ State: Wallet Connection States
3. ⭐ State: Transaction States
4. ⭐ ADR Template

**Срок:** Параллельно с реализацией

---

### Nice to Have (Фаза 3) - Можно добавить позже

1. 💡 Sequence: Account Change Flow
2. 💡 Sequence: Network Change Flow
3. 💡 Deployment Diagram (где разворачивается)
4. 💡 Data Flow Diagram (как течет информация)

**Срок:** После MVP

---

## 🔄 План реализации

### Этап 1: Подготовка (1 день)

- [ ] Создать структуру директорий
- [ ] Создать README.md с навигацией
- [ ] Установить VSCode расширения:
  - Markdown Preview Mermaid Support
  - Mermaid Markdown Syntax Highlighting

### Этап 2: C4 Diagrams (2-3 дня)

- [ ] Level 1: System Context (0.5 дня)
- [ ] Level 2: Container Diagram (0.5 дня)
- [ ] Level 3: Component Diagram (1 день)
- [ ] Level 4: Code Diagram (1 день)

### Этап 3: Sequence Diagrams (1-2 дня)

- [ ] Connect Wallet Flow (0.5 дня)
- [ ] Send Transaction Flow (0.5 дня)
- [ ] Account Change Flow (0.5 дня)
- [ ] Network Change Flow (0.5 дня)

### Этап 4: State Diagrams (1 день)

- [ ] Wallet Connection States (0.5 дня)
- [ ] Transaction States (0.5 дня)

### Этап 5: ADR Migration (0.5 дня)

- [ ] Создать ADR структуру
- [ ] Мигрировать существующие ADR из C4_DIAGRAMS.md
- [ ] Создать ADR Template
- [ ] Создать ADR Index

### Этап 6: Финализация (0.5 дня)

- [ ] Проверить все ссылки
- [ ] Написать README с навигацией
- [ ] Обновить основной docs/README.md
- [ ] Review и согласование

**Общее время:** 5-7 дней

---

## ✅ Критерии завершения

Считаем работу завершенной, когда:

- [ ] Все диаграммы Must Have реализованы
- [ ] Диаграммы корректно рендерятся в GitHub
- [ ] Каждая диаграмма имеет текстовое описание
- [ ] Навигация между диаграммами работает (ссылки)
- [ ] ADR мигрированы из C4_DIAGRAMS.md
- [ ] Есть индексные файлы (README) в каждой директории
- [ ] Нет битых ссылок
- [ ] Проведен review

---

## 🤔 Вопросы на согласование

### 1. Структура директорий

✅ **Согласовано:**

```text
docs/architecture/
├── c4-diagrams/
├── sequences/
├── state-machines/
└── adr/
```

❓ **Альтернативы:**

```text
docs/architecture/
├── diagrams/        # Все диаграммы в одной папке
│   ├── c4/
│   └── sequences/
└── decisions/       # Вместо adr
```

**Ваше мнение:** _________________________________

---

### 2. Формат файлов

✅ **Предложение:** Каждая диаграмма в отдельном .md файле

❓ **Альтернатива:** Все диаграммы одного уровня в одном файле

**Ваше мнение:** _________________________________

---

### 3. Инструмент для диаграмм

✅ **Предложение:** Mermaid (встроен в GitHub)

❓ **Альтернативы:**

- PlantUML (более мощный, но требует установки)
- D2 (современный, но меньше поддержки)
- Mix (Mermaid для sequence, PlantUML для C4)

**Ваше мнение:** _________________________________

---

### 4. Дополнительные диаграммы

✅ **Решение:** Не добавляем сейчас, реализуем после MVP

- [ ] ~~Error Handling Flow~~ - после
- [ ] ~~Initialization Flow~~ - после
- [ ] ~~Reconnection Flow~~ - после

**Статус:** Отложено до Phase 3

---

### 5. Уровень детализации

✅ **Решение:** Средний уровень детализации (СОГЛАСОВАНО)

**Показываем:**

- Основные компоненты и их взаимодействия
- Ключевые методы и свойства (публичный API)
- Архитектурные слои и границы
- Важные потоки данных

**НЕ показываем:**

- Приватные методы (кроме ключевых)
- Детали имплементации
- Все параметры всех методов
- Внутренние хелперы

**Детали:** Ссылаемся на код в GitHub для дополнительной информации

---

## 📝 Следующие шаги

После согласования этого плана:

1. ✅ Утвердить структуру и список диаграмм
2. 🔧 Создать структуру директорий
3. 📊 Начать реализацию с C4 Level 1
4. 🔄 Итеративно добавлять остальные диаграммы
5. 📖 Обновить основную документацию

---

## 🔗 Связанные документы

- [C4_DIAGRAMS.md](./C4_DIAGRAMS_2025-10-14_draft.md) - оригинальный документ с текстовыми диаграммами (архив)
- [PLAN.md](../PLAN.md) - общий план проекта
- [DOCUMENTATION_AS_CODE.md](/Users/dan/workspace/yclients/docs/DOCUMENTATION_AS_CODE.md) - справочник по Docs-as-Code

---

**Версия:** 2.0 (Финальная)

**Статус:** ✅ Выполнено (Фаза 1 + Фаза 2)

**Автор:** Architecture Team

**Дата создания:** 2025-10-14

**Дата завершения:** 2025-10-19

**Последнее обновление:** 2025-10-19
