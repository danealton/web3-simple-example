# Web3 Simple Example - Документация

## 📋 Содержание

1. [Обзор проекта](#-обзор-проекта)
2. [Архитектура](#-архитектура)
3. [Документы](#-документы)
4. [Начало работы](#-начало-работы)

## 🎯 Обзор проекта

Простое, но современное Web3 приложение для демонстрации базового взаимодействия с Ethereum блокчейном.

### Основной функционал

- 🔌 Подключение к MetaMask кошельку
- 💰 Отображение баланса ETH
- 🌐 Отображение текущей сети
- 💸 Отправка ETH транзакций
- ⚠️ Обработка ошибок

### Технологический стек

- **Frontend:** React 18 + TypeScript + Vite
- **Web3:** ethers.js v6
- **Styling:** Tailwind CSS
- **Code Quality:** ESLint + Stylelint + TypeScript strict mode
- **Tools:** PostCSS, EditorConfig

## 🏗 Архитектура

Приложение построено по принципу разделения ответственности:

```text
┌─────────────────────────────────────┐
│     Presentation Layer              │
│     (React Components)              │
├─────────────────────────────────────┤
│     Adapter Layer                   │
│     (React Hooks)                   │
├─────────────────────────────────────┤
│     Business Logic Layer            │
│     (WalletService)                 │
├─────────────────────────────────────┤
│     Data Access Layer               │
│     (ethers.js + MetaMask)          │
└─────────────────────────────────────┘
```

Подробнее см. [Architecture Documentation](./docs/architecture/README.md)

## 📚 Документы

- **[PLAN.md](./docs/PLAN.md)** - Детальный план реализации проекта
  - Требования и цели
  - Технологический стек
  - Структура проекта
  - Компоненты системы
  - Этапы реализации

- **[Architecture Documentation](./docs/architecture/README.md)** - Архитектурная документация
  - [C4 Diagrams](./docs/architecture/c4-diagrams/) - 4 уровня архитектурных диаграмм (Mermaid)
  - [Sequence Diagrams](./docs/architecture/sequences/) - Потоки взаимодействий
  - [State Machines](./docs/architecture/state-machines/) - Диаграммы состояний
  - [ADR](./docs/architecture/adrs/) - Архитектурные решения с обоснованием

## 🚀 Начало работы

### Предварительные требования

- Node.js >= 18
- npm или yarn
- MetaMask расширение в браузере
- (Опционально) Тестовый ETH на Sepolia

### Установка

```bash
# Клонировать репозиторий
cd /Users/dan/workspace/sandbox/web3-simple-example

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать для продакшена
npm run build
```

### Разработка

```bash
# Запустить с hot reload
npm run dev

# Проверить код
npm run lint              # ESLint + Stylelint (всё вместе)
npm run lint:js           # Только ESLint
npm run lint:css          # Только Stylelint
npm run lint:fix          # Автофикс всех проблем

# Собрать проект
npm run build

# Превью продакшен билда
npm run preview
```

### Code Style и форматирование

Проект использует автоматическое форматирование при сохранении файлов:

- **ESLint** - проверка JavaScript/TypeScript кода с type checking
- **Stylelint** - проверка CSS/PostCSS с автосортировкой свойств
- **EditorConfig** - базовые настройки редактора (отступы, конец строки)
- **VSCode settings** - настройки форматирования при сохранении

**Рекомендуемые расширения для VSCode:**

При открытии проекта VSCode автоматически предложит установить необходимые расширения:

- ESLint
- Stylelint
- EditorConfig for VS Code
- Tailwind CSS IntelliSense

Все настройки редактора уже включены в репозиторий (`.vscode/settings.json`)

## 📁 Структура проекта

```text
web3-simple-example/
├── .vscode/                # VS Code настройки
│   ├── settings.json       # Настройки редактора
│   └── extensions.json     # Рекомендуемые расширения
├── docs/                   # 📖 Документация
│   ├── PLAN.md            # План реализации
│   ├── architecture/      # Архитектурная документация
│   └── archive/           # Архивные документы
├── src/
│   ├── components/        # React компоненты
│   ├── core/              # Core логика (framework-agnostic)
│   ├── hooks/             # Custom hooks (React adapters)
│   ├── types/             # TypeScript типы
│   ├── utils/             # Утилиты
│   ├── App.tsx            # Главный компонент
│   ├── main.tsx           # Entry point
│   └── index.css          # Стили
├── public/                # Статические файлы
├── .editorconfig          # EditorConfig настройки
├── .gitignore
├── eslint.config.js       # ESLint конфигурация
├── stylelint.config.js    # Stylelint конфигурация
├── postcss.config.js      # PostCSS конфигурация
├── tailwind.config.js     # Tailwind конфигурация
├── tsconfig.json          # TypeScript конфигурация
├── tsconfig.node.json     # TypeScript для Node.js файлов
├── vite.config.ts         # Vite конфигурация
├── index.html
└── package.json
```

## 🔄 Текущий статус

- [x] Проектирование архитектуры
- [x] Создание C4 диаграмм
- [x] Определение требований
- [ ] Реализация компонентов
- [ ] Тестирование
- [ ] Деплой

## 📝 Следующие шаги

См. [PLAN.md](./docs/PLAN.md) раздел "Этапы реализации"

---

**Статус документации:** ✅ Согласована и готова к реализации
