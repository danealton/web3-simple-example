# ADR-003: Использование Polygon и поддержка multi-chain архитектуры

**Date:** 2025-10-20

**Status:** Accepted

**Deciders:** Architecture Team

**Tags:** blockchain, производительность, стоимость, архитектура

---

## Context

Для Web3 приложения необходимо выбрать blockchain сеть, в которой будут выполняться транзакции. Основные критерии выбора:

- **Стоимость транзакций (gas fees)** - критично для обучающего приложения
- **Скорость подтверждения** - влияет на UX
- **Совместимость с Ethereum** - чтобы использовать ethers.js без изменений
- **Доступность для пользователей** - легко настроить в MetaMask

**Проблема:** Транзакции в Ethereum Mainnet очень дороги для простого обучающего приложения.

### Анализ стоимости (октябрь 2025)

| Сеть | Простой перевод | Контракт | Скорость |
|------|----------------|----------|----------|
| **Ethereum Mainnet** | $2-15 | $10-50+ | 15 сек |
| **Polygon (PoS)** | $0.001-0.01 | $0.01-0.05 | 2-5 сек |
| **Arbitrum** | $0.1-0.5 | $0.5-2 | 1-2 сек |
| **Optimism** | $0.1-0.5 | $0.5-2 | 1-2 сек |
| **Base** | $0.05-0.3 | $0.3-1 | 2 сек |

**Вывод:** Ethereum Mainnet в **1000+ раз дороже** Layer 2 решений, что неприемлемо для обучающего приложения.

---

## Decision

Использовать **Polygon (PoS)** как основную сеть для production, с поддержкой **multi-chain архитектуры** для гибкости.

### Поддерживаемые сети

**Для разработки и тестирования:**

> **Примечание:** Mumbai Testnet (chainId: 80001) был отключен в апреле 2024 и заменен на Amoy Testnet (chainId: 80002).

```typescript
const TESTNETS = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    currency: 'ETH',
    rpcUrl: 'https://sepolia.infura.io/v3/...',
    blockExplorer: 'https://sepolia.etherscan.io',
    gasPrice: 'FREE (testnet)',
    faucet: 'https://sepoliafaucet.com'
  },
  amoy: {
    chainId: 80002,
    name: 'Amoy Testnet',
    currency: 'MATIC',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com',
    gasPrice: 'FREE (testnet)',
    faucet: 'https://faucet.polygon.technology'
  }
}
```

**Для production:**

```typescript
const MAINNETS = {
  polygon: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    gasPrice: '~$0.001-0.01',
    recommended: true  // Основная сеть
  },
  base: {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    gasPrice: '~$0.05-0.3'
  },
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/...',
    blockExplorer: 'https://etherscan.io',
    gasPrice: '~$5-15',
    warning: 'Высокая стоимость транзакций'
  }
}
```

### Изменения в архитектуре

**1. Network Configuration Manager:**

```typescript
// src/core/NetworkConfig.ts
export class NetworkConfig {
  static getNetwork(chainId: number): NetworkInfo | null {
    return NETWORKS[chainId] || null
  }

  static isSupported(chainId: number): boolean {
    return chainId in NETWORKS
  }

  static getRecommended(): NetworkInfo {
    return NETWORKS[137] // Polygon
  }
}
```

**2. WalletService обновления:**

```typescript
// src/core/WalletService.ts
export class WalletService {
  async connect(): Promise<void> {
    // ... подключение

    // Проверка сети
    const chainId = await this.getChainId()
    if (!NetworkConfig.isSupported(chainId)) {
      // Предложить переключиться на Polygon
      await this.switchNetwork(137)
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    const network = NetworkConfig.getNetwork(chainId)
    if (!network) throw new Error('Unsupported network')

    try {
      // Попытка переключиться на существующую сеть
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })
    } catch (error: any) {
      // Если сеть не добавлена в MetaMask (код ошибки 4902)
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: network.name,
            nativeCurrency: {
              name: network.currency,
              symbol: network.currency,
              decimals: 18
            },
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer]
          }]
        })
      } else {
        throw error
      }
    }
  }
}
```

**3. UI компоненты:**

- Показывать текущую сеть и стоимость gas
- Предупреждать, если пользователь в дорогой сети (Ethereum)
- Кнопка "Switch to Polygon" для переключения
- Информация о стоимости транзакции перед отправкой

---

## Consequences

### Положительные

- ✅ **Экономия:** Транзакции в 1000+ раз дешевле ($0.001 vs $5-15)
- ✅ **Скорость:** Подтверждение за 2-5 сек вместо 15 сек
- ✅ **Лучший UX:** Пользователи не боятся пробовать приложение
- ✅ **Совместимость:** Polygon EVM-compatible, ethers.js работает без изменений
- ✅ **Гибкость:** Multi-chain архитектура позволяет добавлять другие сети
- ✅ **Тестирование:** Amoy testnet бесплатен и быстр
- ✅ **Популярность:** Polygon широко используется, легко найти документацию
- ✅ **MetaMask:** Polygon есть в списке сетей по умолчанию

### Отрицательные

- ❌ **Меньше ликвидности:** Polygon имеет меньше MATIC, чем Ethereum ETH
- ❌ **Дополнительная сложность:** Нужно управлять несколькими сетями
- ❌ **Bridge необходим:** Для перевода ETH → MATIC нужен bridge
- ❌ **Новый токен:** Пользователям нужно получить MATIC, а не только ETH

### Нейтральные

- Нужно обновить документацию с информацией о Polygon
- Необходимо добавить ссылки на Polygon faucet для тестирования
- UI должен четко показывать текущую сеть
- Нужно тестировать на нескольких сетях

---

## Alternatives

### Alternative 1: Только Ethereum Mainnet

**Описание:** Использовать только Ethereum Mainnet для максимальной безопасности и ликвидности

**Pros:**

- Самая безопасная и децентрализованная сеть
- Максимальная ликвидность
- Не нужно объяснять пользователям про Layer 2

**Cons:**

- **$5-15 за транзакцию** - неприемлемо дорого для обучения
- Пользователь может потратить больше на gas, чем сумма перевода
- Медленные транзакции (15 сек)
- Плохой UX для демонстрации

**Почему отклонено:** Стоимость транзакций делает приложение непрактичным для обучения и демонстрации. Пользователи не будут пробовать приложение, если каждая транзакция стоит $10+.

### Alternative 2: Только тестовые сети

**Описание:** Использовать только Sepolia/Amoy testnet, без поддержки mainnet

**Pros:**

- Бесплатные транзакции
- Идеально для обучения
- Не нужно беспокоиться о реальных деньгах

**Cons:**

- Нельзя показать реальное использование
- Тестовые токены не имеют ценности
- Меньше мотивации изучать безопасность
- Faucet могут быть недоступны

**Почему отклонено:** Хотим дать возможность пользователям работать с реальными (но дешевыми) транзакциями. Multi-chain подход позволяет поддерживать и тестовые, и production сети.

### Alternative 3: Arbitrum или Optimism

**Описание:** Использовать другие Layer 2 решения вместо Polygon

**Arbitrum:**

- Gas: $0.1-0.5 (дороже Polygon в 10-50 раз)
- Более новая технология (Optimistic Rollup)
- Меньше пользователей

**Optimism:**

- Gas: $0.1-0.5 (дороже Polygon в 10-50 раз)
- Optimistic Rollup
- Хорошая документация

**Base:**

- Gas: $0.05-0.3 (дороже Polygon в 5-30 раз)
- От Coinbase, растущая популярность
- Хорошая интеграция с CEX

**Почему отклонено:** Polygon имеет **самые низкие gas fees** ($0.001-0.01) и самое большое сообщество среди Layer 2. Для обучающего приложения критична минимальная стоимость. Однако, благодаря multi-chain архитектуре, можем добавить эти сети позже.

### Alternative 4: Только Layer 2, без Ethereum

**Описание:** Поддерживать только Polygon и другие L2, исключить Ethereum Mainnet

**Pros:**

- Проще объяснить пользователям
- Меньше рисков (пользователь не отправит дорогую транзакцию по ошибке)
- Меньше кода (не нужны предупреждения)

**Cons:**

- Ограничивает выбор пользователя
- Некоторые пользователи могут хотеть использовать Ethereum

**Почему отклонено:** Multi-chain архитектура дает гибкость. Можем поддерживать Ethereum Mainnet с предупреждением о высокой стоимости, но не заставлять всех использовать его.

---

## Links

**Related ADRs:**

- [ADR-001: Использование ethers.js v6](./001-use-ethers-js-v6.md) - ethers.js поддерживает все EVM-совместимые сети
- [ADR-002: Framework-agnostic архитектура](./002-framework-agnostic-architecture.md) - NetworkConfig будет частью Core Layer

**References:**

- [Polygon Documentation](https://docs.polygon.technology/)
- [Polygon Gas Tracker](https://polygonscan.com/gastracker)
- [L2 Fees Comparison](https://l2fees.info/)
- [Ethereum Gas Tracker](https://etherscan.io/gastracker)
- [MetaMask: Add Polygon Network](https://docs.polygon.technology/tools/wallets/metamask/)
- [Polygon Bridge](https://wallet.polygon.technology/polygon/bridge)
- [Polygon Faucet (Amoy)](https://faucet.polygon.technology/)
- [Polygon Amoy Testnet Documentation](https://docs.polygon.technology/tools/faucets/)

---

**Last updated:** 2025-10-20

**Author:** Architecture Team
