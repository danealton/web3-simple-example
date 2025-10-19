# План реализации Web3 DApp

## 1. Цели и требования

### 1.1 Основная цель

Создать простое, но современное Web3 приложение для демонстрации базового взаимодействия с Ethereum блокчейном.

### 1.2 Функциональные требования

- [ ] Подключение к MetaMask кошельку
- [ ] Отображение адреса подключенного кошелька
- [ ] Отображение баланса ETH
- [ ] Отображение текущей сети (chain ID)
- [ ] Отправка ETH транзакций
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
│   │   └── WalletService.ts    # Web3 логика, state management
│   ├── hooks/              # Custom React hooks (adapters)
│   │   └── useWallet.ts    # React adapter для WalletService
│   ├── types/              # TypeScript типы
│   │   └── wallet.ts
│   ├── utils/              # Утилиты
│   │   └── ethereum.ts     # Ethereum хелперы
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
3. **Business Logic Layer** - Service layer (WalletService - framework-agnostic)
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
- `balance: string | null` - баланс в ETH
- `chainId: number | null` - ID сети
- `isConnecting: boolean` - статус подключения
- `error: string | null` - ошибки
- `provider: BrowserProvider | null` - ethers.js провайдер
- `listeners: Set<StateListener>` - подписчики на изменения

Public Methods:

- `connect()` - подключение кошелька
- `disconnect()` - отключение
- `sendTransaction(to, amount)` - отправка транзакции
- `subscribe(listener)` - подписка на изменения состояния
- `getState()` - получение текущего состояния

#### useWallet Hook

Ответственность:

- React-адаптер для WalletService
- Синхронизация состояния WalletService с React
- Предоставление удобного API для компонентов
- Адаптация методов WalletService под React-friendly имена

Returns:

- `account`, `balance`, `chainId`, `isConnecting`, `error` - состояние из WalletService
- `connectWallet()` - вызывает `WalletService.connect()`
- `disconnectWallet()` - вызывает `WalletService.disconnect()`
- `sendTransaction(to, amount)` - вызывает `WalletService.sendTransaction()`

#### WalletConnect Component

Ответственность:

- UI для подключения кошелька
- Проверка наличия MetaMask
- Отображение статуса подключения

#### WalletInfo Component

Ответственность:

- Отображение информации о кошельке
- Показ адреса (сокращенного)
- Показ баланса
- Показ сети
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
- `formatBalance(balance)` - форматирование баланса
- `getChainName(chainId)` - название сети по ID
- `isValidAddress(address)` - валидация Ethereum адреса

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

- Sepolia Testnet (рекомендуется)
- Goerli Testnet
- Local Hardhat/Ganache

## 9. Потенциальные улучшения (Future)

- Поддержка ERC-20 токенов
- История транзакций
- Множественные кошельки (WalletConnect, Coinbase Wallet)
- ENS поддержка
- Адаптеры для других фреймворков (Vue, Svelte) на базе WalletService
- Темная/светлая тема
- Мультиязычность
- Unit тесты (Vitest) для WalletService и компонентов

## 10. Вопросы для согласования

1. **Scope функционала**: Достаточно ли базового функционала (подключение + отправка ETH)?
2. **Design**: Нужны ли макеты или достаточно современного Tailwind дизайна?
3. **Тестовая сеть**: Какую тестовую сеть использовать для демонстрации?
4. **Дополнительный функционал**: Нужна ли поддержка токенов ERC-20?
5. **Деплой**: Нужно ли деплоить приложение или только локальный dev?
