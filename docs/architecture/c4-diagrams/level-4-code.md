# C4 Level 4: Code Diagram

> Показывает структуру классов, интерфейсов и их взаимосвязи

**Уровень:** Code (Level 4)

**Аудитория:** Разработчики

**Назначение:** Понять структуру кода и детали реализации

> **Область диаграммы:** Level 4 детализирует **Core Layer** (WalletService, EthereumUtils) и **Adapter Layer** (useWallet) из [Level 3](./level-3-components.md). Presentation Layer компоненты (App, WalletConnect, WalletInfo, SendTransaction) имеют простую структуру React компонентов и не требуют отдельной диаграммы классов.

---

## Диаграмма

```mermaid
classDiagram
    class WalletService {
        -state: WalletState
        -provider: BrowserProvider | null
        -signer: JsonRpcSigner | null
        -listeners: Set~StateListener~

        +connect() Promise~void~
        +disconnect() void
        +sendTransaction(to, amount) Promise~string~
        +subscribe(listener) UnsubscribeFn
        +getState() WalletState

        -notify() void
        -handleAccountsChanged(accounts) void
        -handleChainChanged(chainId) void
    }

    class WalletState {
        <<interface>>
        +account: string | null
        +balance: string
        +chainId: number | null
        +isConnecting: boolean
        +error: Error | null
    }

    class StateListener {
        <<type>>
        +(state: WalletState) void
    }

    class UnsubscribeFn {
        <<type>>
        +() void
    }

    class EthereumUtils {
        <<module>>
        +formatAddress(address) string
        +formatBalance(wei) string
        +getChainName(chainId) string
        +isValidAddress(address) boolean
    }

    class useWallet {
        <<Hook>>
        +account: string | null
        +balance: string
        +chainId: number | null
        +isConnecting: boolean
        +error: Error | null
        +connectWallet() Promise~void~
        +disconnectWallet() void
        +sendTransaction(to, amount) Promise~string~
    }

    class BrowserProvider {
        <<ethers.js>>
        +getSigner() JsonRpcSigner
        +getBalance(address) Promise~bigint~
        +getNetwork() Promise~Network~
    }

    class JsonRpcSigner {
        <<ethers.js>>
        +sendTransaction(tx) Promise~TransactionResponse~
        +getAddress() Promise~string~
    }

    WalletService --> WalletState : uses
    WalletService --> StateListener : notifies
    WalletService --> BrowserProvider : uses
    WalletService --> JsonRpcSigner : uses
    WalletService --> EthereumUtils : uses

    useWallet --> WalletService : delegates to
    useWallet --> WalletState : returns

    style WalletService fill:#81d4fa,stroke:#01579b,stroke-width:3px,color:#000
    style useWallet fill:#b3e5fc,stroke:#0277bd,stroke-width:2px,color:#000
    style EthereumUtils fill:#81d4fa,stroke:#01579b,stroke-width:2px,color:#000

    style WalletState fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style StateListener fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000
    style UnsubscribeFn fill:#e3f2fd,stroke:#1976d2,stroke-width:2px,color:#000

    style BrowserProvider fill:#eceff1,stroke:#546e7a,stroke-width:2px,color:#000
    style JsonRpcSigner fill:#eceff1,stroke:#546e7a,stroke-width:2px,color:#000
```

---

## Описание классов и интерфейсов

### WalletService

**Тип:** TypeScript Class

**Назначение:** Центральный сервис для работы с Web3 кошельком

#### Приватные свойства

- `state: WalletState` - текущее состояние кошелька
- `provider: BrowserProvider | null` - ethers.js провайдер
- `signer: JsonRpcSigner | null` - подписчик транзакций
- `listeners: Set<StateListener>` - подписчики на изменения

#### Публичные методы

##### connect()

Подключает MetaMask кошелек.

**Возвращает:** Promise

**Действия:**

- Запрашивает доступ к аккаунтам
- Получает баланс и сеть
- Устанавливает event listeners
- Уведомляет подписчиков

##### disconnect()

Отключает кошелек.

**Действия:**

- Очищает состояние
- Удаляет event listeners
- Уведомляет подписчиков

##### sendTransaction()

Отправляет ETH транзакцию.

**Параметры:** `to: string`, `amount: string`

**Возвращает:** Promise с transaction hash

**Действия:**

- Валидирует входные данные
- Создает транзакцию
- Отправляет через signer
- Ждет подтверждения
- Обновляет баланс

##### subscribe()

Регистрирует подписчика на изменения состояния.

**Параметры:** `listener: StateListener`

**Возвращает:** Функция отписки

##### getState()

Возвращает текущее состояние кошелька.

**Возвращает:** WalletState

#### Приватные методы

##### notify()

Уведомляет всех подписчиков об изменении состояния.

##### handleAccountsChanged()

Обработчик события смены аккаунта от MetaMask.

**Действия:**

- Обновляет account или отключает кошелек
- Уведомляет подписчиков

##### handleChainChanged()

Обработчик события смены сети от MetaMask.

**Действия:**

- Обновляет chainId в состоянии
- Перезагружает баланс для новой сети
- Уведомляет подписчиков

---

### WalletState

**Тип:** TypeScript Interface

**Назначение:** Описывает состояние кошелька

#### Свойства

- `account: string | null` - адрес подключенного кошелька (null если не подключен)
- `balance: string` - баланс в ETH (строка для точности)
- `chainId: number | null` - ID сети (1 = Mainnet, 11155111 = Sepolia)
- `isConnecting: boolean` - флаг процесса подключения
- `error: Error | null` - ошибка (если есть)

**Используется:**

- В WalletService (internal state)
- В useWallet (React state)
- В UI Components (props/destructuring)

---

### StateListener

**Тип:** TypeScript Type Alias

**Определение:**

```typescript
type StateListener = (state: WalletState) => void
```

**Назначение:** Функция обратного вызова для получения обновлений состояния

**Используется:**

- В WalletService.subscribe()
- В useWallet для setState

---

### UnsubscribeFn

**Тип:** TypeScript Type Alias

**Определение:**

```typescript
type UnsubscribeFn = () => void
```

**Назначение:** Функция для отписки от обновлений

**Используется:**

- Возвращается из WalletService.subscribe()
- Вызывается в useEffect cleanup

---

### TransactionData

**Тип:** TypeScript Interface

**Назначение:** Локальный тип для данных формы отправки транзакции

#### Поля

- `to: string` - адрес получателя
- `amount: string` - сумма в ETH

**Используется:**

- В SendTransaction компоненте (form state) - UI Layer

> **Примечание:** Не показан в диаграмме классов, так как используется только в Presentation Layer. WalletService.sendTransaction() принимает эти данные как два отдельных параметра, а не как объект TransactionData.

---

### EthereumUtils

**Тип:** Utility Module

**Назначение:** Утилиты для работы с Ethereum данными

#### Функции

##### formatAddress()

Сокращает адрес для отображения в UI.

**Параметры:** `address: string`

**Возвращает:** string

**Пример:** `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` → `0x742d...bEb`

##### formatBalance()

Конвертирует Wei в ETH с форматированием.

**Параметры:** `wei: bigint`

**Возвращает:** string

**Пример:** `1234567890123456789n` → `1.234 ETH`

##### getChainName()

Возвращает название сети по ID.

**Параметры:** `chainId: number`

**Возвращает:** string

**Примеры:** `1` → `Ethereum Mainnet`, `11155111` → `Sepolia Testnet`

##### isValidAddress()

Проверяет валидность Ethereum адреса.

**Параметры:** `address: string`

**Возвращает:** boolean

**Реализация:** Использует ethers.js `isAddress()`

**Особенности:**

- Pure functions (без side effects)
- Stateless
- Не зависят от WalletService

---

### useWallet Hook

**Тип:** React Custom Hook

**Назначение:** React адаптер для WalletService

#### Возвращаемые значения

**State (из WalletService):**

- `account: string | null`
- `balance: string`
- `chainId: number | null`
- `isConnecting: boolean`
- `error: Error | null`

**Methods (делегируют в WalletService):**

- `connectWallet(): Promise<void>`
- `disconnectWallet(): void`
- `sendTransaction(to: string, amount: string): Promise<string>`

#### Реализация

**Инициализация:**

```typescript
const service = useMemo(() => walletServiceInstance, [])
const [state, setState] = useState(service.getState())
```

**Подписка:**

```typescript
useEffect(() => {
  const unsubscribe = service.subscribe(setState)
  return unsubscribe
}, [service])
```

**Методы:**

```typescript
const connectWallet = useCallback(
  () => service.connect(),
  [service]
)
```

---

### BrowserProvider (ethers.js)

**Тип:** External Class (из библиотеки ethers.js)

**Назначение:** Провайдер для взаимодействия с MetaMask

**Ключевые методы:**

- `getSigner()` - получить подписчика транзакций
- `getBalance(address)` - получить баланс адреса
- `getNetwork()` - получить информацию о сети

---

### JsonRpcSigner (ethers.js)

**Тип:** External Class (из библиотеки ethers.js)

**Назначение:** Подписание и отправка транзакций

**Ключевые методы:**

- `sendTransaction(tx)` - отправить транзакцию
- `getAddress()` - получить адрес подписчика

---

## Взаимосвязи

### WalletService → WalletState

**Использование:** WalletService хранит WalletState как приватное свойство

**Тип связи:** Composition (сильная связь)

---

### WalletService → StateListener

**Использование:** WalletService вызывает всех listeners при изменении состояния

**Тип связи:** Dependency (для уведомлений)

---

### WalletService → BrowserProvider / JsonRpcSigner

**Использование:** WalletService использует ethers.js для работы с MetaMask

**Тип связи:** Dependency (библиотечная зависимость)

**Инициализация:**

```typescript
this.provider = new BrowserProvider(window.ethereum)
this.signer = await this.provider.getSigner()
```

---

### WalletService → EthereumUtils

**Использование:** WalletService вызывает utils для форматирования данных

**Тип связи:** Dependency (утилиты)

---

### useWallet → WalletService

**Использование:** useWallet делегирует все операции в WalletService

**Тип связи:** Delegation (паттерн Adapter)

**Характер:**

- useWallet НЕ владеет WalletService
- useWallet использует общий экземпляр (модуль-синглтон)

---

### useWallet → WalletState

**Использование:** useWallet возвращает WalletState как часть своего API

**Тип связи:** Return type

---

## Детали реализации

### WalletService State Machine

**Состояния подключения:**

```text
Disconnected → Connecting → Connected
                    ↓
                  Error
```

> **Детали:** См. [Wallet Connection States](../state-machines/wallet-connection-states.md)

---

### Event Listeners

**MetaMask события:**

```typescript
window.ethereum.on('accountsChanged',
  (accounts) => this.handleAccountsChanged(accounts)
)

window.ethereum.on('chainChanged',
  (chainId) => this.handleChainChanged(chainId)
)
```

**Очистка:**

```typescript
window.ethereum.removeListener('accountsChanged', handler)
window.ethereum.removeListener('chainChanged', handler)
```

---

### Transaction Flow

**Последовательность:**

1. Валидация входных данных
2. Создание transaction object
3. Оценка gas (опционально)
4. Отправка через signer
5. Ожидание подтверждения (waitForTransaction)
6. Обновление баланса
7. Уведомление подписчиков

> **Детали:** См. [Send Transaction Flow](../sequences/send-transaction-flow.md)

---

## Типизация

### TypeScript строгая типизация

Все компоненты используют **TypeScript strict mode**:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Преимущества:**

- Compile-time проверка типов
- Автодополнение в IDE
- Refactoring безопасность
- Документация через типы

---

### Null Safety

Все nullable поля явно типизированы:

```typescript
account: string | null  // не string | undefined
error: Error | null
provider: BrowserProvider | null
```

**Правило:** Используем `null` для "отсутствия значения", а не `undefined`

---

## Error Handling

### Типы ошибок

**MetaMaskNotInstalledError:**

- Когда `window.ethereum` отсутствует

**UserRejectedError:**

- Когда пользователь отклонил запрос (code: 4001)

**TransactionError:**

- Ошибки при отправке транзакции

**NetworkError:**

- Проблемы с сетью или RPC

### Обработка в WalletService

```typescript
try {
  await this.provider.send('eth_requestAccounts', [])
} catch (error) {
  if (error.code === 4001) {
    throw new UserRejectedError()
  }
  throw error
}
```

**State при ошибке:**

```typescript
this.state = {
  ...this.state,
  error: error,
  isConnecting: false
}
this.notify()
```

---

## Тестирование

### Unit тесты

**WalletService:**

```typescript
describe('WalletService', () => {
  it('должен подключаться к кошельку', async () => {
    const service = new WalletService()
    await service.connect()
    expect(service.getState().account).toBeTruthy()
  })
})
```

**EthereumUtils:**

```typescript
describe('formatAddress', () => {
  it('должен сокращать адрес', () => {
    const result = formatAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')
    expect(result).toBe('0x742d...bEb')
  })
})
```

### Integration тесты

**useWallet Hook:**

```typescript
import { renderHook } from '@testing-library/react'

test('useWallet должен подписываться на WalletService', () => {
  const { result } = renderHook(() => useWallet())
  expect(result.current.account).toBe(null)
})
```

---

## Связанные диаграммы

**Вверх (меньше деталей):**

- 📄 [Level 3: Component Diagram](./level-3-components.md) - Компоненты и архитектурные слои
- 📄 [Level 2: Container Diagram](./level-2-containers.md) - Технологические контейнеры
- 📄 [Level 1: System Context](./level-1-system-context.md) - Общий контекст

**Последовательности:**

- 📄 [Connect Wallet Flow](../sequences/connect-wallet-flow.md) - Детальный поток подключения
- 📄 [Send Transaction Flow](../sequences/send-transaction-flow.md) - Детальный поток транзакции

**State Machines:**

- 📄 [Wallet Connection States](../state-machines/wallet-connection-states.md)
- 📄 [Transaction States](../state-machines/transaction-states.md)

**Назад:**

- 📄 [Architecture README](../README.md)

---

**Последнее обновление:** 2025-10-19

**Автор:** Architecture Team

**Статус:** ✅ Актуально
