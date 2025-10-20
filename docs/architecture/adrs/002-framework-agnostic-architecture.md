# ADR-002: Framework-agnostic архитектура для Web3 логики

**Date:** 2025-10-14

**Status:** Accepted

**Deciders:** Architecture Team

**Tags:** архитектура, паттерн, framework-agnostic

---

## Context

Web3 логика (подключение к кошельку, отправка транзакций, работа с ethers.js) должна быть реализована в проекте. Возникает вопрос: как организовать эту логику относительно UI фреймворка (React)?

**Возможные подходы:**

1. Встроить Web3 логику прямо в React компоненты
2. Вынести Web3 логику в отдельный слой, независимый от React

**Проблема:** Как организовать архитектуру, чтобы код был тестируемым, переиспользуемым и не зависел от фреймворка?

---

## Decision

Использовать **framework-agnostic архитектуру** с разделением на слои:

**Core Layer (Framework-agnostic):**

- `WalletService.ts` - TypeScript class для всей Web3 логики
- Не зависит от React
- Реализует Observer pattern для уведомлений
- Полностью тестируем без React Testing Library

**Adapter Layer (React-specific):**

- `useWallet` hook - адаптер между WalletService и React
- Подписывается на изменения через Observer
- Преобразует события в React state updates

**Presentation Layer (React):**

- UI компоненты используют `useWallet` hook
- Не имеют прямого доступа к WalletService
- Только отображают данные и вызывают методы

```text
┌─────────────────────────────┐
│   React Components          │  Presentation Layer
│   (WalletConnect, etc.)     │
└──────────────┬──────────────┘
               │ uses
               ▼
┌─────────────────────────────┐
│    useWallet Hook           │  Adapter Layer
│    (React-specific)         │
└──────────────┬──────────────┘
               │ delegates to
               ▼
┌─────────────────────────────┐
│    WalletService            │  Core Layer
│    (Framework-agnostic)     │  (Pure TypeScript)
└─────────────────────────────┘
```

---

## Consequences

### Положительные

- ✅ **Testability:** Core логика тестируется без React
- ✅ **Reusability:** WalletService можно использовать в Vue, Angular, Svelte
- ✅ **Separation of Concerns:** UI отделен от бизнес-логики
- ✅ **Type Safety:** TypeScript строгие типы по всей цепочке
- ✅ **Легко мокировать:** В тестах можно мокировать WalletService целиком
- ✅ **Единственный источник истины:** Состояние хранится в одном месте
- ✅ **Миграция на другой фреймворк:** Нужно переписать только Adapter Layer

### Отрицательные

- ❌ **Больше кода:** Нужен дополнительный слой (useWallet hook)
- ❌ **Сложность для новичков:** Нужно понимать Observer pattern
- ❌ **Не стандартный подход:** Для простых проектов может быть оверинжиниринг

### Нейтральные

- Требуется дисциплина в команде (не вызывать WalletService напрямую из компонентов)
- Нужно поддерживать соответствие между типами в Core и Adapter слоях

---

## Alternatives

### Alternative 1: Context + Hooks (React-specific)

**Описание:** Использовать React Context для хранения Web3 состояния и React hooks для логики

```typescript
// WalletContext.tsx
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')

  const connect = async () => {
    // Web3 логика прямо здесь
  }

  return (
    <WalletContext.Provider value={{ account, balance, connect }}>
      {children}
    </WalletContext.Provider>
  )
}
```

**Pros:**

- Стандартный React подход
- Меньше кода
- Проще для React разработчиков

**Cons:**

- Невозможно переиспользовать в других фреймворках
- Сложнее тестировать (нужен React Testing Library)
- Web3 логика смешана с React lifecycle
- Нельзя использовать WalletService напрямую (всегда нужен Provider)

**Почему отклонено:** Слишком сильная связанность с React. Тестирование требует полного React окружения.

### Alternative 2: Redux / Zustand (State Management)

**Описание:** Использовать глобальный state manager для Web3 состояния

**Pros:**

- Centralized state
- DevTools для debugging
- Хорошо подходит для больших приложений

**Cons:**

- Дополнительная зависимость
- Boilerplate (actions, reducers)
- Все еще нужен слой для ethers.js вызовов
- Избыточно для простого проекта

**Почему отклонено:** Оверинжиниринг для проекта такого размера. Redux/Zustand лучше подходят для сложных состояний с множеством действий.

### Alternative 3: Прямое использование в компонентах

**Описание:** Вызывать ethers.js напрямую из React компонентов

```typescript
const WalletConnect = () => {
  const [account, setAccount] = useState(null)

  const connect = async () => {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    setAccount(address)
  }

  return <button onClick={connect}>Connect</button>
}
```

**Pros:**

- Максимально простой подход
- Минимум кода
- Нет дополнительных слоев

**Cons:**

- Дублирование логики между компонентами
- Невозможно переиспользовать
- Сложно тестировать
- Состояние не синхронизировано между компонентами
- Нарушает Single Responsibility Principle

**Почему отклонено:** Не масштабируется. Подходит только для prototype/proof-of-concept.

---

## Links

**Related ADRs:**

- [ADR-001: Использование ethers.js v6](./001-use-ethers-js-v6.md)

**References:**

- [Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Last updated:** 2025-10-14

**Author:** Architecture Team
