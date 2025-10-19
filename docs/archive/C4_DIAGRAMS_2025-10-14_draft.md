# C4 Диаграммы - Web3 DApp

> ⚠️ **АРХИВНЫЙ ДОКУМЕНТ (Черновик)**
>
> Этот документ является **первоначальным черновиком** с ASCII-art диаграммами (создан 2025-10-14).
> Все диаграммы были переработаны и реализованы в формате Mermaid с детальной документацией.
>
> **Для актуальной информации см.:**
>
> - 📄 [Architecture Documentation](../architecture/README.md) - главная навигация
> - 📄 [C4 Diagrams](../architecture/c4-diagrams/) - все уровни в формате Mermaid
> - 📄 [Sequence Diagrams](../architecture/sequences/) - детальные потоки взаимодействий
> - 📄 [State Machines](../architecture/state-machines/) - диаграммы состояний

## Методология C4

C4 Model использует 4 уровня абстракции:

1. **Context** - системный контекст (кто использует систему)
2. **Container** - контейнеры/приложения (из чего состоит система)
3. **Component** - компоненты (из чего состоит контейнер)
4. **Code** - код (детали реализации)

---

## Level 1: System Context Diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                    System Context                            │
│                                                              │
│                                                              │
│    ┌──────────┐                                             │
│    │          │         Uses Web3 DApp                      │
│    │   User   │────────────────────────┐                    │
│    │          │                        │                    │
│    └──────────┘                        ▼                    │
│         │                      ┌───────────────┐            │
│         │                      │               │            │
│         │ Manages wallet       │  Web3 DApp    │            │
│         │ via browser          │  Application  │            │
│         │ extension            │               │            │
│         │                      │  [Vite/React] │            │
│         ▼                      └───────┬───────┘            │
│    ┌──────────┐                        │                    │
│    │ MetaMask │                        │                    │
│    │  Wallet  │◄───────────────────────┘                    │
│    │          │    Requests connection,                     │
│    └────┬─────┘    signs transactions                       │
│         │                                                    │
│         │ Sends transactions                                │
│         │ to blockchain                                     │
│         ▼                                                    │
│    ┌──────────────────┐                                     │
│    │                  │                                     │
│    │    Ethereum      │                                     │
│    │    Blockchain    │                                     │
│    │                  │                                     │
│    └──────────────────┘                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Описание элементов

#### User (Пользователь)

- Роль: Владелец Ethereum кошелька
- Действия: Подключает кошелек, просматривает баланс, отправляет транзакции

#### Web3 DApp Application

- Тип: Single Page Application
- Технологии: React, TypeScript, ethers.js
- Функции: UI для взаимодействия с кошельком и блокчейном

#### MetaMask Wallet

- Тип: Browser Extension / External System
- Функции: Управление ключами, подписание транзакций, хранение аккаунтов

#### Ethereum Blockchain

- Тип: External System
- Функции: Децентрализованная сеть для хранения и выполнения транзакций

---

## Level 2: Container Diagram

```text
┌────────────────────────────────────────────────────────────────────┐
│                        Web3 DApp Application                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────┐          │
│  │           Browser (User's Device)                    │          │
│  │                                                      │          │
│  │  ┌────────────────────────────────────────────┐    │          │
│  │  │                                             │    │          │
│  │  │        React SPA                            │    │          │
│  │  │        [TypeScript, React 18]               │    │          │
│  │  │                                             │    │          │
│  │  │  • Presentation Components                  │    │          │
│  │  │  • State Management                         │    │          │
│  │  │  • User Interface                           │    │          │
│  │  │                                             │    │          │
│  │  └──────────────┬──────────────────────────────┘    │          │
│  │                 │                                    │          │
│  │                 │ Uses                               │          │
│  │                 ▼                                    │          │
│  │  ┌────────────────────────────────────────────┐    │          │
│  │  │                                             │    │          │
│  │  │        Web3 Integration Layer               │    │          │
│  │  │        [ethers.js v6]                       │    │          │
│  │  │                                             │    │          │
│  │  │  • Provider Management                      │    │          │
│  │  │  • Wallet Connection Logic                  │    │          │
│  │  │  • Transaction Handling                     │    │          │
│  │  │  • Event Listeners                          │    │          │
│  │  │                                             │    │          │
│  │  └──────────┬────────────────────┬─────────────┘    │          │
│  │             │                    │                   │          │
│  └─────────────┼────────────────────┼───────────────────┘          │
│                │                    │                               │
│                │ JSON-RPC           │ Web3 API                      │
│                ▼                    ▼                               │
│  ┌──────────────────────┐  ┌────────────────────┐                  │
│  │                      │  │                    │                  │
│  │  MetaMask Provider   │  │  Ethereum Node     │                  │
│  │  [Browser Extension] │  │  [JSON-RPC API]    │                  │
│  │                      │  │                    │                  │
│  └──────────────────────┘  └────────────────────┘                  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Описание контейнеров

#### React SPA (Single Page Application)

- Технология: React 18, TypeScript, Tailwind CSS
- Отвечает за: Отображение UI, управление локальным состоянием
- Собирается: Vite

#### Web3 Integration Layer

- Технология: ethers.js v6
- Отвечает за: Всю логику взаимодействия с Web3
- Изолирует: React компоненты от деталей блокчейна

#### MetaMask Provider

- Тип: External - Browser Extension
- Предоставляет: window.ethereum API
- Функции: Подпись транзакций, управление аккаунтами

#### Ethereum Node

- Тип: External - Blockchain Node
- Доступ: Через MetaMask или прямой RPC
- Предоставляет: Данные блокчейна, отправка транзакций

---

## Level 3: Component Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          React SPA Components                            │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       App Component                              │   │
│  │                                                                  │   │
│  │  • Main application container                                   │   │
│  │  • Route management                                             │   │
│  │  • Global state coordination                                    │   │
│  └────────┬─────────────────────────────────────┬──────────────────┘   │
│           │                                      │                      │
│           ▼                                      ▼                      │
│  ┌──────────────────────┐              ┌────────────────────────┐      │
│  │                      │              │                        │      │
│  │  WalletConnect       │              │   WalletInfo           │      │
│  │  Component           │              │   Component            │      │
│  │                      │              │                        │      │
│  │  • Connect button    │              │  • Address display     │      │
│  │  • MetaMask check    │              │  • Balance display     │      │
│  │  • Loading state     │              │  • Network info        │      │
│  │                      │              │  • Disconnect button   │      │
│  └──────────┬───────────┘              └───────────┬────────────┘      │
│             │                                       │                   │
│             │                                       │                   │
│             └───────────────┬───────────────────────┘                   │
│                             │                                           │
│                             │ Uses                                      │
│                             ▼                                           │
│                    ┌─────────────────────┐                              │
│                    │                     │                              │
│                    │   useWallet Hook    │                              │
│                    │   [React Adapter]   │                              │
│                    │                     │                              │
│                    │  Exposes:           │                              │
│                    │   • account         │                              │
│                    │   • balance         │                              │
│                    │   • chainId         │                              │
│                    │   • isConnecting    │                              │
│                    │   • error           │                              │
│                    │   • connectWallet   │                              │
│                    │   • disconnectWallet│                              │
│                    │   • sendTransaction │                              │
│                    └──────────┬──────────┘                              │
│                               │                                         │
│                               │ Delegates to                            │
│                               ▼                                         │
│                    ┌─────────────────────┐                              │
│                    │                     │                              │
│                    │  WalletService      │                              │
│                    │  [Core Logic]       │                              │
│                    │                     │                              │
│                    │  • State management │                              │
│                    │  • Web3 operations  │                              │
│                    │  • Event handling   │                              │
│                    │  • Subscriptions    │                              │
│                    └──────────┬──────────┘                              │
│                               │                                         │
│                               │ Uses                                    │
│                               ▼                                         │
│                    ┌─────────────────────┐                              │
│                    │                     │                              │
│                    │  Ethereum Utils     │                              │
│                    │                     │                              │
│                    │  • formatAddress    │                              │
│                    │  • formatBalance    │                              │
│                    │  • getChainName     │                              │
│                    │  • validateAddress  │                              │
│                    └──────────┬──────────┘                              │
│                               │                                         │
│             ┌─────────────────┴─────────────────┐                       │
│             │                                   │                       │
│             ▼                                   ▼                       │
│  ┌────────────────────┐              ┌──────────────────────┐          │
│  │                    │              │                      │          │
│  │  SendTransaction   │              │   Types/Interfaces   │          │
│  │  Component         │              │                      │          │
│  │                    │              │  • WalletState       │          │
│  │  • Recipient input │              │  • TransactionData   │          │
│  │  • Amount input    │              │  • ChainInfo         │          │
│  │  • Validation      │              │  • WalletError       │          │
│  │  • Send button     │              │                      │          │
│  │  • Status display  │              │                      │          │
│  └────────────────────┘              └──────────────────────┘          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Описание компонентов

#### App Component

- Responsibility: Главный контейнер приложения
- Dependencies: WalletConnect, WalletInfo, SendTransaction, useWallet

#### WalletConnect Component

- Responsibility: UI для подключения кошелька
- Props: `onConnect: () => void`, `isConnecting: boolean`
- State: Local UI state

#### WalletInfo Component

- Responsibility: Отображение информации о подключенном кошельке
- Props: `account`, `balance`, `chainId`, `onDisconnect`

#### SendTransaction Component

- Responsibility: Форма отправки транзакций
- Props: `account`, `onSend: (to, amount) => Promise<void>`
- State: Form data, validation errors, tx status

#### useWallet Hook

- Responsibility: React-адаптер для WalletService
- Pattern: Adapter pattern
- Returns: State + Methods от WalletService
- Side Effects: Подписка на изменения состояния

#### WalletService

- Responsibility: Core бизнес-логика Web3
- Pattern: Service layer, Observer pattern
- Implements: State management, Web3 operations, Event subscriptions
- Framework-agnostic: Чистый TypeScript, независим от React

#### Ethereum Utils

- Responsibility: Утилиты для работы с Ethereum данными
- Functions: `formatAddress`, `formatBalance`, `getChainName`, `isValidAddress`
- Pure functions, no side effects

#### Types/Interfaces

- Responsibility: TypeScript типы для всего приложения

---

## Level 4: Code Diagram

### WalletService (Core Logic)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                      WalletService                               │
│                      [Pure TypeScript]                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    State                                │    │
│  │                                                         │    │
│  │  private state: WalletState = {                        │    │
│  │    account: null,                                       │    │
│  │    balance: null,                                       │    │
│  │    chainId: null,                                       │    │
│  │    isConnecting: false,                                 │    │
│  │    error: null                                          │    │
│  │  }                                                      │    │
│  │                                                         │    │
│  │  private provider: BrowserProvider | null = null        │    │
│  │  private listeners: Set<StateListener> = new Set()      │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Public Methods                             │    │
│  │                                                         │    │
│  │  async connect():                                       │    │
│  │    ├─ Check MetaMask existence                          │    │
│  │    ├─ Request accounts (eth_requestAccounts)           │    │
│  │    ├─ Get balance (getBalance)                         │    │
│  │    ├─ Get network (getNetwork)                         │    │
│  │    ├─ Setup event listeners                            │    │
│  │    └─ Notify subscribers                               │    │
│  │                                                         │    │
│  │  async disconnect():                                    │    │
│  │    ├─ Clear state                                       │    │
│  │    ├─ Remove event listeners                           │    │
│  │    └─ Notify subscribers                               │    │
│  │                                                         │    │
│  │  async sendTransaction(to: string, amount: string):     │    │
│  │    ├─ Validate inputs                                   │    │
│  │    ├─ Create transaction object                        │    │
│  │    ├─ Request signature (signer.sendTransaction)       │    │
│  │    ├─ Wait for confirmation                            │    │
│  │    ├─ Update balance                                   │    │
│  │    └─ Notify subscribers                               │    │
│  │                                                         │    │
│  │  subscribe(listener: StateListener): UnsubscribeFn      │    │
│  │  getState(): WalletState                                │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            Private Methods                              │    │
│  │                                                         │    │
│  │  private notify():                                      │    │
│  │    └─ Call all registered listeners with new state     │    │
│  │                                                         │    │
│  │  private handleAccountsChanged(accounts):               │    │
│  │    └─ Update account state or disconnect               │    │
│  │                                                         │    │
│  │  private handleChainChanged(chainId):                   │    │
│  │    └─ Update chain state and notify                    │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### useWallet Hook (React Adapter)

```typescript
┌─────────────────────────────────────────────────────────────────┐
│                      useWallet Hook                              │
│                      [React Adapter]                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Service Instance                           │    │
│  │                                                         │    │
│  │  const service = useMemo(() => new WalletService(), []) │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              State Sync                                 │    │
│  │                                                         │    │
│  │  const [state, setState] = useState(service.getState()) │    │
│  │                                                         │    │
│  │  useEffect(() => {                                      │    │
│  │    return service.subscribe(setState)                   │    │
│  │  }, [service])                                          │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Return Value                               │    │
│  │                                                         │    │
│  │  return {                                               │    │
│  │    ...state,                                            │    │
│  │    connectWallet: service.connect,                      │    │
│  │    disconnectWallet: service.disconnect,                │    │
│  │    sendTransaction: service.sendTransaction             │    │
│  │  }                                                      │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Dependencies:
  ↓
┌─────────────────┐
│   ethers.js     │
│                 │
│ • BrowserProvider│
│ • formatEther   │
│ • parseEther    │
│ • isAddress     │
└─────────────────┘
```

---

## Последовательность взаимодействий (Sequence Diagrams)

### 1. Connect Wallet Flow

```text
User     WalletConnect   useWallet   WalletService   MetaMask   Ethereum
  │            │            │             │             │          │
  │─click──────>│            │             │             │          │
  │            │─connect()──>│             │             │          │
  │            │            │─connect()───>│             │          │
  │            │            │             │             │          │
  │            │            │             │─Check window.ethereum  │
  │            │            │             │             │          │
  │            │            │             │─eth_requestAccounts()─>│
  │            │            │             │             │          │
  │            │            │             │             │◄─confirm─│
  │            │            │             │             │          │
  │            │            │             │◄─accounts───│          │
  │            │            │             │             │          │
  │            │            │             │─getBalance()─────────────>│
  │            │            │             │◄─balance─────────────────│
  │            │            │             │             │          │
  │            │            │             │─getNetwork()─────────────>│
  │            │            │             │◄─chainId─────────────────│
  │            │            │             │             │          │
  │            │            │             │─notify()    │          │
  │            │            │◄─state──────│             │          │
  │            │◄─updated───│             │             │          │
  │            │            │             │             │          │
  │◄─show WalletInfo────────│             │             │          │
  │            │            │             │             │          │
```

### 2. Send Transaction Flow

```text
User   SendTransaction  useWallet  WalletService  MetaMask  Ethereum
  │           │            │            │            │         │
  │─enter─────>│           │            │            │         │
  │           │            │            │            │         │
  │─send──────>│           │            │            │         │
  │           │─sendTransaction()──>│   │            │         │
  │           │            │─sendTransaction()──>│   │         │
  │           │            │            │            │         │
  │           │            │            │─validate   │         │
  │           │            │            │            │         │
  │           │            │            │─signer.sendTransaction()─>│
  │           │            │            │            │         │
  │           │            │            │            │◄─confirm│
  │           │            │            │            │         │
  │           │            │            │◄─tx hash───│         │
  │           │            │            │            │         │
  │           │            │            │─submit tx──────────────>│
  │           │            │            │            │         │
  │           │            │            │─wait for receipt        │
  │           │            │            │◄─receipt────────────────│
  │           │            │            │            │         │
  │           │            │            │─update balance          │
  │           │            │            │─notify()   │         │
  │           │            │◄─updated───│            │         │
  │           │◄─success───│            │            │         │
  │           │            │            │            │         │
  │◄─show─────│            │            │            │         │
  │           │            │            │            │         │
```

---

## Принятые архитектурные решения (ADR)

### ADR-001: Выбор ethers.js вместо web3.js

- **Статус:** Принято
- **Контекст:** Нужна библиотека для взаимодействия с Ethereum
- **Решение:** Использовать ethers.js v6

**Обоснование:**

- Меньший размер бандла
- Современный API с TypeScript поддержкой из коробки
- Активная поддержка и документация
- Лучше подходит для современных React приложений

**Последствия:**

- (+) Типобезопасность
- (+) Меньший размер приложения
- (-) Команде нужно изучить API (если привыкли к web3.js)

### ADR-002: Разделение на Service Layer и Adapter

- **Статус:** Принято
- **Контекст:** Нужно организовать логику взаимодействия с Web3
- **Решение:** Выделить бизнес-логику в `WalletService` (pure TypeScript), использовать `useWallet` как React-адаптер

**Обоснование:**

- Разделение ответственности (Service layer pattern)
- Core логика независима от фреймворка
- Легче тестировать (можно тестировать WalletService без React)
- Возможность переиспользования в других фреймворках
- React best practices (custom hooks как адаптеры)

**Последствия:**

- (+) Чистая, тестируемая бизнес-логика
- (+) Framework-agnostic core
- (+) Легче поддерживать и масштабировать
- (-) Дополнительный уровень абстракции
- (-) Чуть больше кода

### ADR-003: Tailwind CSS для стилизации

- **Статус:** Принято
- **Контекст:** Нужно выбрать подход к стилизации
- **Решение:** Использовать Tailwind CSS

**Обоснование:**

- Быстрая разработка
- Utility-first подход
- Отличная типизация в IDE
- Минимальный CSS в продакшене

**Последствия:**

- (+) Быстрая разработка UI
- (+) Консистентный дизайн
- (+) Малый размер CSS
- (-) Многословный JSX

---

## Вопросы для обсуждения

1. ✅ Согласны ли вы с общей архитектурой?
2. ✅ Устраивает ли разбиение на компоненты?
3. ✅ Нужны ли дополнительные диаграммы или уточнения?
4. ✅ Какие изменения хотите внести в план?
5. ✅ Готовы ли мы переходить к реализации?
