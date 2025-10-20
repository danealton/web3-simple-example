# Architecture Documentation

> Архитектурная документация Web3 Simple Example

**Статус:** ✅ Готово (Фаза 1 + Фаза 2)
**Последнее обновление:** 2025-10-19

---

## 📋 Содержание

1. [Обзор](#обзор)
2. [C4 Model Диаграммы](#c4-model-диаграммы)
3. [Sequence Diagrams](#sequence-diagrams)
4. [State Diagrams](#state-diagrams)
5. [Architecture Decision Records](#architecture-decision-records)
6. [Статус реализации](#статус-реализации)

---

## Обзор

Эта директория содержит всю архитектурную документацию проекта, включая:

- **C4 Model диаграммы** - 4 уровня архитектурных диаграмм
- **Sequence диаграммы** - потоки взаимодействий
- **State диаграммы** - диаграммы состояний
- **ADR** - архитектурные решения

Все диаграммы реализованы в формате **Diagrams-as-Code** с использованием **Mermaid**.

---

## C4 Model Диаграммы

C4 Model использует 4 уровня абстракции для описания архитектуры системы:

### Level 1: System Context

📄 [level-1-system-context.md](./c4-diagrams/level-1-system-context.md)

Показывает систему в контексте пользователей и внешних систем:

- User (Пользователь)
- Web3 DApp Application
- MetaMask Wallet
- Ethereum Blockchain

**Статус:** ✅ Готово

---

### Level 2: Container Diagram

📄 [level-2-containers.md](./c4-diagrams/level-2-containers.md)

Показывает основные технологические контейнеры:

- React SPA [TypeScript, React 18]
- Web3 Integration Layer [ethers.js v6]
- MetaMask Provider [Browser Extension]
- Ethereum Node [JSON-RPC API]

**Статус:** ✅ Готово

---

### Level 3: Component Diagram

📄 [level-3-components.md](./c4-diagrams/level-3-components.md)

Показывает компоненты внутри React SPA:

- App Component
- WalletConnect Component
- WalletInfo Component
- SendTransaction Component
- useWallet Hook (Adapter)
- WalletService (Core Logic)
- EthereumUtils

**Статус:** ✅ Готово

---

### Level 4: Code Diagram

📄 [level-4-code.md](./c4-diagrams/level-4-code.md)

Показывает структуру классов и интерфейсов:

- WalletService (класс)
- useWallet Hook (структура)
- TypeScript interfaces
- Dependencies (ethers.js)

**Статус:** ✅ Готово

---

## Sequence Diagrams

Диаграммы последовательности взаимодействий:

### 1. Connect Wallet Flow

📄 [connect-wallet-flow.md](./sequences/connect-wallet-flow.md)

Показывает процесс подключения кошелька:

1. User clicks "Connect"
2. Request to MetaMask
3. User confirms
4. Fetch balance and network
5. Update UI

**Статус:** ✅ Готово

---

### 2. Send Transaction Flow

📄 [send-transaction-flow.md](./sequences/send-transaction-flow.md)

Показывает процесс отправки транзакции:

1. User enters recipient & amount
2. Validation
3. Request signature
4. Submit to blockchain
5. Wait for confirmation
6. Update balance

**Статус:** ⏸️ Отложено (Фаза 3)

---

### 3. Account Change Flow

> **Статус:** Отложено до Фазы 3

Будет показывать обработку смены аккаунта в MetaMask:

1. User switches account
2. accountsChanged event
3. Update state
4. Fetch new balance
5. Update UI

**Статус:** ⏸️ Отложено (Фаза 3)

---

### 4. Network Change Flow

> **Статус:** Отложено до Фазы 3

Будет показывать обработку смены сети в MetaMask:

1. User switches network
2. chainChanged event
3. Update chainId
4. Fetch balance for new network
5. Update UI

**Статус:** ⏸️ Отложено (Фаза 3)

---

## State Diagrams

Диаграммы состояний компонентов:

### 1. Wallet Connection States

📄 [wallet-connection-states.md](./state-machines/wallet-connection-states.md)

Состояния подключения кошелька:

- Disconnected
- Connecting
- Connected
- Error

**Статус:** ✅ Готово

---

### 2. Transaction States

📄 [transaction-states.md](./state-machines/transaction-states.md)

Состояния транзакции:

- Idle
- Validating
- Signing
- Pending
- Confirmed
- Failed

**Статус:** ✅ Готово

---

## Architecture Decision Records

Архитектурные решения с обоснованием:

📄 [ADR Index](./adrs/README.md) - Список всех архитектурных решений

### Принятые решения

1. **[ADR-001](./adrs/001-use-ethers-js-v6.md)**: Использование ethers.js v6
   - **Статус:** ✅ Принято
   - **Дата:** 2025-10-14

2. **[ADR-002](./adrs/002-framework-agnostic-architecture.md)**: Framework-agnostic архитектура
   - **Статус:** ✅ Принято
   - **Дата:** 2025-10-14

📄 [ADR Template](./adrs/template.md) - Шаблон для новых архитектурных решений

---

## Статус реализации

| Категория | Всего | Реализовано | Прогресс |
|-----------|-------|-------------|----------|
| C4 Diagrams | 4 | 4 | ██████████ 100% |
| Sequence Diagrams | 2 | 2 | ██████████ 100% |
| State Diagrams | 2 | 2 | ██████████ 100% |
| ADR | 4 | 4 | ██████████ 100% |
| **Итого** | **12** | **12** | **██████████ 100%** |

**История:**

📄 [Архив: DIAGRAMS_PLAN.md](../archive/DIAGRAMS_PLAN_2025-10-14_completed.md) - Первоначальный план (выполнен 2025-10-19)

---

## 🛠 Инструменты

### Mermaid

Все диаграммы реализованы с использованием Mermaid - текстового языка для создания диаграмм.

**Преимущества:**

- ✅ Встроен в GitHub/GitLab
- ✅ Простой синтаксис
- ✅ Версионируется вместе с кодом
- ✅ Не требует дополнительных инструментов

**Полезные ссылки:**

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/)
- [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)

### Просмотр диаграмм

#### В GitHub

Диаграммы автоматически рендерятся при просмотре .md файлов

#### В VSCode

Установите расширение: **Markdown Preview Mermaid Support**

```bash
code --install-extension bierner.markdown-mermaid
```

#### В браузере

Используйте [Mermaid Live Editor](https://mermaid.live/) для редактирования и предпросмотра

---

## 📚 Связанные документы

### В этом проекте

- [PLAN.md](../PLAN.md) - Общий план проекта
- [Архив документов](../archive/README.md) - Архивные и исторические документы

### Внешние ресурсы

- [C4 Model Documentation](https://c4model.com/)
- [The C4 model for visualising software architecture](https://c4model.com/)

---

## 🎯 Roadmap

### Фаза 1: Must Have ✅ Завершена

- ✅ C4 Level 1-3
- ✅ Connect Wallet & Send Transaction flows
- ✅ ADR migration

### Фаза 2: Should Have ✅ Завершена

- ✅ C4 Level 4
- ✅ State diagrams (Wallet Connection, Transaction)

### Фаза 3: Nice to Have ⏸️ Отложено

- ⏸️ Account/Network change flows
- ⏸️ Deployment diagram
- ⏸️ Error handling flows

---

## 🤝 Contribution

При добавлении новых диаграмм:

1. Следуйте структуре существующих файлов
2. Используйте Mermaid синтаксис
3. Добавляйте текстовое описание
4. Обновляйте этот README
5. Проверяйте рендеринг в GitHub

При добавлении ADR:

1. Используйте [template.md](./adrs/template.md)
2. Следуйте нумерации (001, 002, ...)
3. Обновляйте [ADR Index](./adrs/README.md)
4. Добавляйте дату и статус

---

**Версия:** 2.0

**Поддержка:** Architecture Team

**Последнее обновление:** 2025-10-19
