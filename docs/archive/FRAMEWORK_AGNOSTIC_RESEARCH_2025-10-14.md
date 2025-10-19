# Framework-Agnostic Architecture для Web3 приложений

> ⚠️ **АРХИВНЫЙ ДОКУМЕНТ (Исследование)**
>
> Этот документ является **исследованием** (создан 2025-10-14), которое легло в основу архитектурных решений проекта.
> Информация из этого исследования была формализована в виде Architecture Decision Record.
>
> **Для актуальной информации см.:**
>
> - 📄 [ADR-002: Framework-agnostic архитектура](../architecture/adrs/002-framework-agnostic-architecture.md) - принятое решение
> - 📄 [Level 3: Component Diagram](../architecture/c4-diagrams/level-3-components.md) - реализованная архитектура

**Статус:** Исследование (вошло в ADR-002)
**Дата:** 14 октября 2025
**Цель:** Изучить возможность построения архитектуры Web3 приложения, независимой от выбора UI фреймворка (React/Vue/Svelte)

---

## Проблема

Текущая архитектура тесно связана с React (custom hooks, React-специфичные паттерны). При необходимости использовать другой фреймворк (Vue, Svelte) придется переписывать всю логику работы с Web3.

**Вопрос:** Можно ли выстроить архитектуру так, чтобы не зависеть от выбора стека на фронтенде?

## Ответ

Да, это абсолютно возможно. Подход называется **framework-agnostic architecture**.

---

## 1. Layered Architecture с чистым Core

Основная идея: отделить бизнес-логику от UI-фреймворка.

```text
┌─────────────────────────────────────┐
│   UI Layer (React/Vue/Svelte)       │  ← Framework-specific
├─────────────────────────────────────┤
│   Adapter Layer                     │  ← Тонкая прослойка
├─────────────────────────────────────┤
│   Business Logic (Pure TS/JS)       │  ← Framework-agnostic
├─────────────────────────────────────┤
│   Data Layer (Web3/API)             │  ← Framework-agnostic
└─────────────────────────────────────┘
```

### Принцип работы для Web3

**Core Service** - чистый TypeScript, без зависимостей от фреймворков:

```typescript
// core/WalletService.ts - чистый TypeScript
class WalletService {
  private provider: BrowserProvider | null = null;
  private listeners: Set<(state: WalletState) => void> = new Set();

  async connect() { /* ... */ }

  subscribe(callback: (state: WalletState) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(state: WalletState) {
    this.listeners.forEach(cb => cb(state));
  }
}

// Singleton instance
export const walletService = new WalletService();
```

**React Adapter** - тонкая обертка для React:

```typescript
// react/useWallet.ts - React адаптер
export function useWallet() {
  const [state, setState] = useState<WalletState>(walletService.getState());

  useEffect(() => {
    return walletService.subscribe(setState);
  }, []);

  return {
    ...state,
    connect: walletService.connect,
    // ...
  };
}
```

**Vue Adapter** - тонкая обертка для Vue:

```typescript
// vue/useWallet.ts - Vue адаптер
export function useWallet() {
  const state = ref<WalletState>(walletService.getState());

  onMounted(() => {
    const unsubscribe = walletService.subscribe(newState => {
      state.value = newState;
    });

    onUnmounted(unsubscribe);
  });

  return {
    state,
    connect: walletService.connect,
    // ...
  };
}
```

**Вывод:** Одна и та же бизнес-логика (`WalletService`) используется в разных фреймворках через адаптеры.

---

## 2. Современные подходы

### 2.1 Web Components

Полностью framework-agnostic UI компоненты, работают везде:

```typescript
class WalletConnect extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button>Connect Wallet</button>`;
    this.querySelector('button')?.addEventListener('click',
      () => walletService.connect()
    );
  }
}
customElements.define('wallet-connect', WalletConnect);
```

Использование в любом фреймворке:

```html
<!-- React/Vue/Svelte -->
<wallet-connect></wallet-connect>
```

**Плюсы:** Нативная браузерная технология, работает везде
**Минусы:** Менее удобный DX, чем специализированные фреймворки

### 2.2 State Management как Bridge

Использование универсальной библиотеки стейт-менеджмента (Zustand, Valtio):

```typescript
// Zustand (работает везде)
import { create } from 'zustand';

export const useWalletStore = create<WalletState>((set) => ({
  account: null,
  balance: null,

  connect: async () => {
    const account = await walletService.connect();
    set({ account });
  }
}));
```

**Плюсы:** Простая интеграция, работает в React, Vue, Svelte
**Минусы:** Дополнительная зависимость

### 2.3 MobX / RxJS для реактивности

Реактивное состояние, независимое от фреймворка:

```typescript
import { makeAutoObservable } from 'mobx';

class WalletStore {
  account: string | null = null;
  balance: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async connect() {
    this.account = await walletService.connect();
  }
}

export const walletStore = new WalletStore();

// React
import { observer } from 'mobx-react-lite';
const Component = observer(() => <div>{walletStore.account}</div>);

// Vue
import { Observer } from 'mobx-vue-lite';
// ...
```

**Плюсы:** Мощная реактивность, зрелая экосистема
**Минусы:** Более сложная кривая обучения

---

## 3. Предлагаемая архитектура

Структура проекта для framework-agnostic подхода:

```text
web3-simple-example/
├── packages/
│   ├── core/                      # Framework-agnostic
│   │   ├── services/
│   │   │   ├── WalletService.ts   # Вся Web3 логика
│   │   │   └── TransactionService.ts
│   │   ├── models/
│   │   │   └── WalletState.ts
│   │   └── utils/
│   │       └── ethereum.ts
│   │
│   ├── react-adapter/             # React специфичное
│   │   ├── hooks/
│   │   │   └── useWallet.ts
│   │   └── components/
│   │
│   ├── vue-adapter/               # Vue специфичное
│   │   ├── composables/
│   │   │   └── useWallet.ts
│   │   └── components/
│   │
│   └── web-components/            # Universal
│       └── wallet-connect.ts
```

### Разделение ответственности

- **`core/`** - вся бизнес-логика, чистый TypeScript, 0 зависимостей от UI
- **`*-adapter/`** - тонкие обертки для конкретных фреймворков
- **`web-components/`** - универсальные компоненты (опционально)

---

## 4. Существующие решения

### Готовые framework-agnostic Web3 библиотеки

#### wagmi

- Имеет vanilla JS core + React/Vue адаптеры
- Популярная библиотека для Web3

```typescript
// Core (vanilla)
import { createConfig } from '@wagmi/core';

const config = createConfig({ /* ... */ });

// React
import { WagmiConfig } from 'wagmi';

// Vue
import { createApp } from 'vue';
import { WagmiPlugin } from '@wagmi/vue';
```

#### web3-onboard

- Полностью framework-agnostic
- Поддержка множества кошельков
- Работает с любым фреймворком из коробки

#### WalletConnect

- Protocol level решение
- Framework agnostic по дизайну
- Стандарт индустрии

---

## 5. Анализ: Плюсы и минусы

### ✅ Преимущества framework-agnostic подхода

1. **Переиспользование бизнес-логики**
   - Пишем Web3 логику один раз
   - Используем в React, Vue, Svelte, vanilla JS

2. **Легче тестировать**
   - Core логика без UI зависимостей
   - Можно тестировать в Node.js без браузера

3. **Гибкость выбора фреймворка**
   - Можно менять фреймворк без переписывания core
   - Поддержка нескольких фреймворков одновременно

4. **Одна кодовая база для логики**
   - Меньше дублирования
   - Проще поддерживать и обновлять

### ⚠️ Недостатки

1. **Дополнительная сложность**
   - Больше абстракций
   - Сложнее для начинающих

2. **Более тщательная архитектура**
   - Нужно продумывать границы слоев
   - Больше времени на проектирование

3. **Больше boilerplate кода**
   - Нужны адаптеры для каждого фреймворка
   - Больше файлов и структуры

4. **Может быть overkill**
   - Для маленьких проектов избыточно
   - Если точно известен фреймворк - проще без абстракций

---

## 6. Рекомендации

### Для простого примера (текущий проект)

**Рекомендация:** ✅ Текущий подход с React hook

**Обоснование:**

- Проект учебный, небольшой
- Цель - показать основы Web3, а не архитектуру
- React hook достаточно для демонстрации
- Меньше complexity

### Для production / библиотеки

**Рекомендация:** ✅ Framework-agnostic Core + Адаптеры

**Подход:**

```typescript
// 1. Core Service (чистый TS)
// src/core/WalletManager.ts
export class WalletManager {
  private state: WalletState = { /* ... */ };
  private emitter = new EventEmitter();

  async connect() { /* ... */ }

  on(event: string, callback: Function) {
    this.emitter.on(event, callback);
  }
}

// 2. Framework адаптеры как thin wrappers
// src/adapters/react.ts
export function useWallet() {
  const manager = useMemo(() => new WalletManager(), []);
  const [state, setState] = useState(manager.getState());

  useEffect(() => {
    manager.on('change', setState);
    return () => manager.off('change', setState);
  }, []);

  return { ...state, connect: manager.connect };
}
```

**Когда использовать:**

- Разрабатываете библиотеку для публикации
- Большой проект с неопределенным фреймворком
- Команда использует разные фреймворки
- Планируется долгая поддержка

---

## 7. Решение для текущего проекта

### Вариант A: Простой (рекомендуется сейчас)

Оставить React-специфичную архитектуру с `useWallet` hook:

**Плюсы:**

- Быстрая разработка
- Меньше кода
- Проще для понимания

**Минусы:**

- Привязка к React

### Вариант B: Hybrid (компромисс)

Выделить core логику в отдельный сервис, но использовать только в React:

```text
src/
  core/
    WalletService.ts     # Pure TS
  hooks/
    useWallet.ts         # React wrapper
  components/            # React components
```

**Плюсы:**

- Легче тестировать core
- Можно добавить Vue адаптер позже
- Не сильно усложняет

**Минусы:**

- Чуть больше кода

### Вариант C: Полный framework-agnostic (для будущего)

Реализовать monorepo с core + адаптерами (см. раздел 3)

**Плюсы:**

- Полная гибкость
- Профессиональный подход

**Минусы:**

- Много времени на настройку
- Избыточно для примера

---

## 8. Выводы

1. **Framework-agnostic архитектура возможна и имеет смысл** для Web3 приложений
2. **Ключевая идея:** отделить бизнес-логику (Web3) от UI-фреймворка
3. **Существующие библиотеки** (wagmi, web3-onboard) уже используют этот подход
4. **Для учебного проекта** - текущий React подход достаточен
5. **Для production** - стоит рассмотреть Core + Adapters паттерн

---

## 9. Следующие шаги

### Если решим применить в текущем проекте

1. Создать `src/core/WalletService.ts` с чистой Web3 логикой
2. Рефакторить `useWallet` hook как адаптер
3. (Опционально) Добавить пример Vue адаптера в отдельной директории

### Если оставим как есть

1. Зафиксировать это решение как ADR
2. Добавить в раздел "Будущие улучшения" в PLAN.md
3. Продолжить с React-специфичной реализацией

---

## Ссылки и материалы

- [Wagmi - Framework-agnostic Web3](https://wagmi.sh/)
- [Web3-Onboard](https://onboard.blocknative.com/)
- [WalletConnect](https://walletconnect.com/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Zustand - Framework-agnostic state](https://github.com/pmndrs/zustand)
