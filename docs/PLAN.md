# План реализации Web3 DApp

## 1. Цели и требования

### 1.1 Основная цель

Создать простое, но современное Web3 приложение для демонстрации базового взаимодействия с Ethereum и Layer 2 сетями (Polygon, Base).

### 1.2 Функциональные требования

- [ ] Подключение к MetaMask кошельку
- [ ] Отображение адреса подключенного кошелька
- [ ] Отображение баланса (ETH/MATIC в зависимости от сети)
- [ ] Отображение текущей сети (название + chain ID)
- [ ] Переключение между поддерживаемыми сетями
- [ ] Предупреждение о дорогих сетях (Ethereum Mainnet)
- [ ] Отправка транзакций (поддержка нескольких сетей)
- [ ] Отключение кошелька
- [ ] Обработка ошибок

### 1.3 Нефункциональные требования

- Современный и интуитивный UI/UX
- Адаптивный дизайн (responsive)
- Типобезопасность (TypeScript)
- Читаемый и поддерживаемый код
- Быстрая загрузка и работа

## 2. Технологический стек

### 2.1 Frontend Framework

- **Vite** - сборщик (быстрый dev server, HMR)
- **React 18** - UI библиотека
- **TypeScript** - типизация

### 2.2 Web3 библиотеки

- **ethers.js v6** - взаимодействие с Ethereum
  - Альтернатива: web3.js, wagmi, viem
  - Выбор: ethers.js - баланс между простотой и функциональностью

### 2.3 UI/Styling

- **Tailwind CSS** - utility-first CSS framework
- Кастомные компоненты для Web3 функционала

### 2.4 Дополнительно

- **ESLint** - линтинг
- **PostCSS** - обработка CSS

## 3. Архитектура приложения

### 3.1 Структура проекта

```text
web3-simple-example/
├── docs/                    # Документация
│   ├── PLAN.md             # Этот файл
│   ├── README.md           # Описание и инструкции
│   ├── architecture/       # Архитектурная документация
│   └── archive/            # Архивные документы
├── public/                  # Статические файлы
├── src/
│   ├── components/         # React компоненты
│   │   ├── WalletConnect.tsx
│   │   ├── WalletInfo.tsx
│   │   └── SendTransaction.tsx
│   ├── core/               # Core бизнес-логика (framework-agnostic)
│   │   ├── WalletService.ts    # Web3 логика, state management
│   │   └── NetworkConfig.ts    # Конфигурация blockchain сетей
│   ├── hooks/              # Custom React hooks (adapters)
│   │   └── useWallet.ts    # React adapter для WalletService
│   ├── types/              # TypeScript типы
│   │   ├── wallet.ts
│   │   └── network.ts      # Типы для multi-chain
│   ├── utils/              # Утилиты
│   │   └── ethereum.ts     # Ethereum хелперы (multi-chain)
│   ├── App.tsx             # Главный компонент
│   ├── main.tsx            # Entry point
│   └── index.css           # Глобальные стили
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 3.2 Слои приложения

1. **Presentation Layer** - React компоненты (UI)
2. **Adapter Layer** - Custom hooks (React адаптеры для core логики)
3. **Business Logic Layer** - Service layer (WalletService, NetworkConfig - framework-agnostic)
4. **Data Access Layer** - Взаимодействие с Web3 Provider (ethers.js)

## 4. Компоненты системы

### 4.1 Core Components

#### WalletService

Ответственность:

- Core бизнес-логика для работы с Web3
- Управление состоянием подключения кошелька
- Взаимодействие с MetaMask через ethers.js
- Обработка событий кошелька (смена аккаунта, сети)
- Реализация паттерна Observer для подписок

State (private):

- `account: string | null` - адрес кошелька
- `balance: string | null` - баланс (ETH/MATIC в зависимости от сети)
- `chainId: number | null` - ID сети
- `chainName: string | null` - название сети (Polygon, Ethereum, etc.)
- `isExpensiveNetwork: boolean` - флаг дорогой сети
- `isConnecting: boolean` - статус подключения
- `error: string | null` - ошибки
- `provider: BrowserProvider | null` - ethers.js провайдер
- `listeners: Set<StateListener>` - подписчики на изменения

Public Methods:

- `connect()` - подключение кошелька
- `disconnect()` - отключение
- `sendTransaction(to, amount)` - отправка транзакции
- `switchNetwork(chainId)` - переключение blockchain сети
- `isNetworkSupported(chainId)` - проверка поддержки сети
- `subscribe(listener)` - подписка на изменения состояния
- `getState()` - получение текущего состояния

#### useWallet Hook

Ответственность:

- React-адаптер для WalletService
- Синхронизация состояния WalletService с React
- Предоставление удобного API для компонентов
- Адаптация методов WalletService под React-friendly имена

Returns:

- `account`, `balance`, `chainId`, `chainName`, `isExpensiveNetwork`, `isConnecting`, `error` - состояние из WalletService
- `recommendedChainId` - рекомендуемая сеть (Polygon = 137)
- `connectWallet()` - вызывает `WalletService.connect()`
- `disconnectWallet()` - вызывает `WalletService.disconnect()`
- `sendTransaction(to, amount)` - вызывает `WalletService.sendTransaction()`
- `switchNetwork(chainId)` - вызывает `WalletService.switchNetwork()`

#### WalletConnect Component

Ответственность:

- UI для подключения кошелька
- Проверка наличия MetaMask
- Отображение статуса подключения

#### WalletInfo Component

Ответственность:

- Отображение информации о кошельке
- Показ адреса (сокращенного)
- Показ баланса с токеном (ETH/MATIC)
- Показ текущей сети (название + chain ID)
- Предупреждение о дорогой сети (если Ethereum)
- Кнопка переключения на Polygon (если не на Polygon)
- Показ примерной стоимости gas
- Кнопка отключения

#### SendTransaction Component

Ответственность:

- Форма для отправки транзакции
- Валидация адреса получателя
- Валидация суммы
- Подтверждение транзакции
- Отображение статуса отправки

### 4.2 Utility Functions

#### Ethereum Utils

- `formatAddress(address)` - сокращение адреса (0x1234...5678)
- `formatBalance(wei, symbol)` - форматирование баланса с токеном (ETH/MATIC)
- `getNetworkName(chainId)` - название сети по ID (Polygon, Ethereum, Base, Amoy, Sepolia)
- `getNetworkCurrency(chainId)` - токен сети (MATIC, ETH)
- `isValidAddress(address)` - валидация Ethereum адреса
- `isExpensiveNetwork(chainId)` - проверка дорогой сети
- `getGasCostEstimate(chainId)` - примерная стоимость gas

#### NetworkConfig

- `getNetwork(chainId)` - получить конфигурацию сети
- `isSupported(chainId)` - проверка поддержки сети
- `getRecommended()` - получить рекомендуемую сеть (Polygon)
- `getAllNetworks()` - список всех поддерживаемых сетей

## 5. Потоки взаимодействия (User Flows)

### 5.1 Подключение кошелька

1. Пользователь открывает приложение
2. Видит кнопку "Connect Wallet"
3. Нажимает кнопку
4. Проверяется наличие MetaMask
5. Запрашивается подключение через MetaMask
6. Пользователь подтверждает в MetaMask
7. Приложение получает адрес и баланс
8. Отображается информация о кошельке

### 5.2 Отправка транзакции

1. Пользователь вводит адрес получателя
2. Вводит сумму в ETH
3. Нажимает "Send"
4. Валидация данных
5. Открывается MetaMask для подтверждения
6. Пользователь подтверждает
7. Транзакция отправляется в сеть
8. Отображается статус (pending → success/error)
9. Обновляется баланс

### 5.3 Обработка ошибок

- MetaMask не установлен → показать сообщение с ссылкой
- Пользователь отклонил запрос → информативное сообщение
- Недостаточно средств → предупреждение
- Неверный адрес → валидация формы
- Ошибка сети → retry механизм

## 6. Безопасность

### 6.1 Меры безопасности

- Валидация всех пользовательских вводов
- Проверка адресов через ethers.js
- Отображение всех деталей транзакции перед отправкой
- Никакого хранения приватных ключей
- Только чтение данных из блокчейна, запись через MetaMask

### 6.2 Лучшие практики

- Не доверять window.ethereum без проверок
- Обрабатывать все возможные ошибки
- Информировать пользователя о всех действиях
- Использовать TypeScript для предотвращения ошибок типов

## 7. Этапы реализации

### Этап 1: Базовая настройка ✓

- [x] Создание проекта (Vite + React + TS)
- [x] Настройка Tailwind CSS
- [x] Базовая структура файлов

### Этап 2: Базовая функциональность

- [ ] Создание типов (types/wallet.ts)
- [ ] Реализация WalletService (core/WalletService.ts)
  - [ ] State management
  - [ ] Connect/disconnect методы
  - [ ] Observer pattern (subscribe/notify)
- [ ] Реализация useWallet hook (React adapter)
- [ ] Компонент WalletConnect
- [ ] Компонент WalletInfo

### Этап 3: Транзакции

- [ ] Компонент SendTransaction
- [ ] Обработка транзакций в WalletService
- [ ] Утилиты для форматирования (utils/ethereum.ts)

### Этап 4: Улучшения UX

- [ ] Обработка смены аккаунта/сети
- [ ] Полировка UI
- [ ] Адаптивный дизайн
- [ ] Анимации и переходы

### Этап 5: Документация и деплой

- [ ] README с инструкциями
- [ ] Комментарии в коде
- [ ] Деплой на Vercel/Netlify (опционально)

## 8. Тестирование

### 8.1 Ручное тестирование

- Подключение/отключение кошелька
- Отправка транзакций в тестовой сети
- Проверка на разных устройствах
- Проверка обработки ошибок

### 8.2 Тестовые сети

- Amoy Testnet (Polygon) - рекомендуется для тестирования low-cost транзакций
- Sepolia Testnet (Ethereum) - для тестирования Ethereum-совместимости
- Mumbai Testnet - DEPRECATED (заменен на Amoy в апреле 2024)

**Faucets:**

- Amoy: <https://faucet.polygon.technology/>
- Sepolia: <https://sepoliafaucet.com>

## 9. Потенциальные улучшения (Future)

### 9.1 UX & Frontend Improvements

- История транзакций (локальное хранилище или The Graph)
- Множественные кошельки (WalletConnect, Coinbase Wallet)
- ENS поддержка (resolve имена вместо адресов)
- Адаптеры для других фреймворков (Vue, Svelte) на базе WalletService
- Темная/светлая тема
- Мультиязычность
- Unit тесты (Vitest) для WalletService и компонентов

### 9.2 Multi-chain Enhancements

- Добавить больше L2 сетей (Arbitrum, Optimism)
- UI для выбора сети из списка (dropdown)
- Автоматическое определение оптимальной сети по gas price
- Cross-chain bridge интеграция (для перевода токенов между сетями)

### 9.3 Smart Contracts Integration (Major Feature)

> **Статус:** Опционально - только если потребуется сложная on-chain логика

#### Когда НЕ нужны смарт-контракты

Текущий функционал покрывается встроенными возможностями блокчейна:

- ✅ Отправка нативных токенов (ETH/MATIC) - встроенно в blockchain
- ✅ Просмотр баланса - встроенно
- ✅ Подключение кошелька - MetaMask API
- ✅ Переключение сетей - MetaMask API

#### Когда НУЖНЫ смарт-контракты

##### 1. Собственные токены (ERC-20)

Если хотите создать свой токен "MyToken":

```solidity
contract MyToken is ERC20 {
  constructor() ERC20("MyToken", "MTK") {
    _mint(msg.sender, 1000000 * 10**18);
  }
}
```

**Потребуется:**

- Hardhat для разработки контракта
- Deployment скрипты
- Обновление WalletService для работы с токенами
- UI для выбора токена (ETH/MATIC/MyToken)

##### 2. NFT коллекции (ERC-721)

Если хотите создать NFT:

```solidity
contract MyNFT is ERC721 {
  function mint(address to, uint256 tokenId) public {
    _safeMint(to, tokenId);
  }
}
```

**Потребуется:**

- Hardhat + OpenZeppelin
- IPFS для хранения metadata
- UI для отображения NFT

##### 3. DeFi функционал

Escrow (депонирование):

```solidity
contract Escrow {
  function deposit() payable { ... }
  function release(address to) { ... }
  function refund() { ... }
}
```

**Примеры использования:**

- P2P сделки с гарантом
- Crowdfunding с условиями
- Временные блокировки средств

**Потребуется:**

- Hardhat для разработки
- Solidity тесты
- Аудит безопасности

##### 4. DAO (голосование)

```solidity
contract Voting {
  function propose(string memory description) { ... }
  function vote(uint proposalId, bool support) { ... }
  function execute(uint proposalId) { ... }
}
```

**Потребуется:**

- Governance токен (ERC-20)
- UI для голосования
- The Graph для индексации голосов

#### Инструменты для работы со смарт-контрактами

##### Development

- **Hardhat** - среда разработки контрактов
  - Локальная blockchain для тестирования
  - Deployment scripts
  - Console.log в Solidity для отладки
  - Плагины для верификации контрактов

##### Indexing

- **The Graph** - индексация событий контрактов
  - GraphQL API вместо прямых RPC calls
  - Быстрые запросы исторических данных
  - Подписка на события контрактов в реальном времени

##### Storage

- **IPFS** - децентрализованное хранилище
  - Для NFT metadata
  - Для хранения больших данных (изображения, JSON)
  - Immutable content addressing

#### Roadmap для контрактов (если потребуется)

##### Фаза 1: Basic ERC-20 Token (1-2 недели)

- [ ] Установить Hardhat
- [ ] Написать простой ERC-20 контракт
- [ ] Написать тесты
- [ ] Deploy на Amoy testnet
- [ ] Обновить WalletService для работы с токенами
- [ ] UI для transfer токенов

##### Фаза 2: The Graph Integration (1 неделя)

- [ ] Создать subgraph для индексации Transfer событий
- [ ] Настроить GraphQL endpoint
- [ ] Обновить фронтенд для запросов через The Graph
- [ ] История транзакций из The Graph

##### Фаза 3: Advanced Features (2-3 недели)

- [ ] Escrow контракт (пример DeFi)
- [ ] NFT minting (пример ERC-721)
- [ ] Governance (пример DAO)

### 9.4 Full Decentralization (Advanced)

> **Статус:** Nice to Have - для "истинно децентрализованного" приложения

#### Текущая архитектура

- ✅ Бизнес-логика: децентрализована (on-chain или в браузере)
- ⚠️ Frontend hosting: централизован (Vercel/Netlify CDN)

#### Полная децентрализация

##### 1. IPFS Hosting

```bash
# Deploy фронтенда на IPFS
ipfs add -r dist/
# Получаем hash: QmXxx...xxx
```

**Доступ:**

- `https://ipfs.io/ipfs/QmXxx...xxx`
- `https://gateway.pinata.cloud/ipfs/QmXxx...xxx`

##### 2. ENS Domain

```text
mydapp.eth → IPFS hash
```

**Преимущества:**

- ✅ Нет централизованного сервера
- ✅ Censorship resistant
- ✅ Immutable deployments (каждая версия = новый hash)

**Недостатки:**

- ❌ Медленнее CDN
- ❌ Сложнее обновлять (нужно обновлять ENS)
- ❌ Требует IPFS gateway (или свой node)

**Инструменты:**

- **Fleek** - автоматический deploy на IPFS (альтернатива Vercel)
- **Pinata** - IPFS pinning service
- **ENS** - Ethereum Name Service для доменов

#### Roadmap для полной децентрализации (если потребуется)

##### Фаза 1: IPFS Deployment (2-3 дня)

- [ ] Настроить build для IPFS (static HTML)
- [ ] Зарегистрироваться на Pinata/Fleek
- [ ] Автоматический deploy на IPFS через CI/CD
- [ ] Проверить работу через IPFS gateway

##### Фаза 2: ENS Domain (1 день)

- [ ] Купить ENS domain (mydapp.eth)
- [ ] Настроить content hash на IPFS
- [ ] Протестировать доступ через ENS

##### Фаза 3: Full Decentralization (1 неделя)

- [ ] IPFS для frontend
- [ ] Smart contracts для логики
- [ ] The Graph для данных
- [ ] ENS для DNS

**Результат:** Полностью децентрализованное приложение, которое невозможно отключить

## 10. Архитектурные решения (ADR)

Все ключевые архитектурные решения задокументированы в ADR:

- **[ADR-001](./architecture/adrs/001-use-ethers-js-v6.md)**: Использование ethers.js v6
- **[ADR-002](./architecture/adrs/002-framework-agnostic-architecture.md)**: Framework-agnostic архитектура
- **[ADR-003](./architecture/adrs/003-polygon-and-multichain-support.md)**: Polygon и multi-chain поддержка

См. [ADR Index](./architecture/adrs/README.md) для полного списка.

---

## 11. Вопросы для согласования

1. ✅ **Scope функционала**: Базовый функционал (подключение + отправка) + multi-chain - СОГЛАСОВАНО
2. **Design**: Нужны ли макеты или достаточно современного Tailwind дизайна?
3. ✅ **Blockchain сети**: Polygon как основная, Amoy для тестирования - СОГЛАСОВАНО (ADR-003)
4. **Смарт-контракты**: Оставить для будущих версий или добавить простой Escrow в MVP?
5. **Деплой**: Нужно ли деплоить приложение или только локальный dev?
6. **Полная децентрализация**: IPFS + ENS или традиционный CDN?

---

## 12. Ссылки и ресурсы

**Документация проекта:**

- [Architecture Documentation](./architecture/README.md) - Полная архитектурная документация
- [C4 Diagrams](./architecture/c4-diagrams/) - Визуальная архитектура (4 уровня)
- [ADR](./architecture/adrs/) - Архитектурные решения

**Внешние ресурсы:**

- [Polygon Documentation](https://docs.polygon.technology/)
- [ethers.js v6 Docs](https://docs.ethers.org/v6/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Hardhat Documentation](https://hardhat.org/docs) - для будущих контрактов
- [The Graph Documentation](https://thegraph.com/docs/) - для будущей индексации
- [IPFS Documentation](https://docs.ipfs.tech/) - для полной децентрализации
- [Habr: Архитектура Web 3.0](https://habr.com/ru/articles/689046/) - обзорная статья
