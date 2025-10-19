# ADR-001: Использование ethers.js v6 для Web3 интеграции

**Date:** 2025-10-14

**Status:** Accepted

**Deciders:** Architecture Team

**Tags:** библиотека, web3, blockchain

---

## Context

Для взаимодействия с Ethereum блокчейном через браузер необходима JavaScript библиотека, которая:

- Поддерживает работу с MetaMask (EIP-1193 провайдер)
- Имеет удобное API для чтения данных и отправки транзакций
- Поддерживается и регулярно обновляется
- Имеет хорошую документацию и сообщество
- Совместима с TypeScript

**Проблема:** Выбрать Web3 библиотеку для проекта.

---

## Decision

Использовать **ethers.js v6** как основную библиотеку для Web3 интеграции.

**Основные возможности:**

```typescript
import { BrowserProvider } from 'ethers'

// Создание провайдера из MetaMask
const provider = new BrowserProvider(window.ethereum)

// Получение signer для транзакций
const signer = await provider.getSigner()

// Чтение данных
const balance = await provider.getBalance(address)

// Отправка транзакции
const tx = await signer.sendTransaction({
  to: recipientAddress,
  value: parseEther('1.0')
})
```

---

## Consequences

### Положительные

- ✅ **Современное API:** v6 использует ES6+ синтаксис и TypeScript
- ✅ **TypeScript first:** Полная поддержка типов из коробки
- ✅ **Tree-shakable:** Vite может исключить неиспользуемый код
- ✅ **Активная разработка:** Регулярные обновления и багфиксы
- ✅ **Отличная документация:** <https://docs.ethers.org/v6/>
- ✅ **Большое сообщество:** Много примеров и решений проблем
- ✅ **Меньший размер:** ~100KB (gzipped) vs web3.js ~200KB
- ✅ **Удобное API:** Интуитивно понятные названия и структура

### Отрицательные

- ❌ **Breaking changes от v5:** Требуется изучить миграцию если есть опыт с v5
- ❌ **Новая версия:** v6 вышла относительно недавно (2023), могут быть edge cases
- ❌ **Меньше готовых примеров:** По сравнению с v5

### Нейтральные

- Нужно импортировать конкретные модули (tree-shaking требует явных импортов)
- Асинхронное API (все операции возвращают Promises)

---

## Alternatives

### Alternative 1: web3.js

**Описание:** Оригинальная Web3 библиотека от Ethereum Foundation

**Pros:**

- Больше истории и примеров
- Официальная библиотека
- Поддержка старых браузеров

**Cons:**

- Больший размер бандла
- Менее удобное API
- Хуже поддержка TypeScript
- Медленнее развивается

**Почему отклонено:** ethers.js имеет лучшее API, меньший размер и лучше поддержку TypeScript.

### Alternative 2: viem

**Описание:** Новая современная библиотека с акцентом на производительность

**Pros:**

- Очень маленький размер
- Модульная архитектура
- Отличный TypeScript

**Cons:**

- Очень новая (2023), маленькое сообщество
- Меньше документации и примеров
- Нестабильное API (частые breaking changes)

**Почему отклонено:** Слишком новая для production проекта. Возможно, рассмотрим в будущем, когда экосистема станет более зрелой.

### Alternative 3: Прямое использование window.ethereum

**Описание:** Использовать только EIP-1193 провайдер без библиотек

**Pros:**

- Нулевой размер зависимостей
- Максимальный контроль

**Cons:**

- Нужно самостоятельно реализовывать все утилиты
- Работа с Wei, hex форматами вручную
- Нет TypeScript типов
- Много boilerplate кода

**Почему отклонено:** Не имеет смысла переизобретать велосипед. ethers.js предоставляет все необходимое.

---

## Links

**Related ADRs:**

- [ADR-002: Framework-agnostic архитектура](./002-framework-agnostic-architecture.md)

**References:**

- [ethers.js v6 Documentation](https://docs.ethers.org/v6/)
- [Migration Guide: v5 → v6](https://docs.ethers.org/v6/migrating/)
- [EIP-1193: Ethereum Provider JavaScript API](https://eips.ethereum.org/EIPS/eip-1193)
- [Bundle size comparison](https://bundlephobia.com/package/ethers@6.13.0)

---

**Last updated:** 2025-10-14

**Author:** Architecture Team
