/**
 * @fileoverview Конфигурация поддерживаемых blockchain сетей
 */

import type { NetworkInfo, NetworksConfig } from '../types';

/**
 * @description Конфигурация всех поддерживаемых blockchain сетей
 * @remarks
 * Production сети: Polygon, Base, Ethereum
 * Testnet сети: Amoy, Sepolia
 *
 * Поле gasPrice содержит описательную оценку стоимости газа.
 * Для получения актуальной цены используйте RPC вызов eth_gasPrice.
 */
const NETWORKS: NetworksConfig = {
  // Production Networks
  137: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    gasPrice: 'low',
    recommended: true,
  },
  8453: {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    gasPrice: 'low',
    recommended: false,
  },
  1: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://cloudflare-eth.com',
    blockExplorer: 'https://etherscan.io',
    gasPrice: 'high',
    recommended: false,
  },
  // Testnet Networks
  80002: {
    chainId: 80002,
    name: 'Amoy',
    currency: 'MATIC',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com',
    gasPrice: 'free',
    recommended: true,
  },
  11155111: {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    gasPrice: 'free',
    recommended: false,
  },
};

/**
 * @description Получить информацию о сети по chain ID
 * @param chainId - Идентификатор сети
 * @returns Информация о сети или null если сеть не поддерживается
 * @example
 * ```typescript
 * const network = NetworkConfig.getNetwork(137);
 * console.log(network?.name); // "Polygon"
 * ```
 */
function getNetwork(chainId: number): NetworkInfo | null {
  return NETWORKS[chainId] ?? null;
}

/**
 * @description Проверить поддерживается ли сеть приложением
 * @param chainId - Идентификатор сети
 * @returns true если сеть поддерживается
 */
function isSupported(chainId: number): boolean {
  return chainId in NETWORKS;
}

/**
 * @description Получить рекомендуемую сеть для использования
 * @returns Информация о рекомендуемой сети (Polygon для production)
 */
function getRecommended(): NetworkInfo {
  // Возвращаем Polygon как рекомендуемую сеть (chainId: 137)
  return NETWORKS[137];
}

/**
 * @description Получить список всех поддерживаемых сетей
 * @returns Массив всех поддерживаемых сетей
 */
function getAllNetworks(): NetworkInfo[] {
  return Object.values(NETWORKS);
}

/**
 * @description Получить список production сетей
 * @returns Массив production сетей (Polygon, Base, Ethereum)
 */
function getProductionNetworks(): NetworkInfo[] {
  return [NETWORKS[137], NETWORKS[8453], NETWORKS[1]];
}

/**
 * @description Получить список testnet сетей
 * @returns Массив testnet сетей (Amoy, Sepolia)
 */
function getTestnetNetworks(): NetworkInfo[] {
  return [NETWORKS[80002], NETWORKS[11155111]];
}

/**
 * @description NetworkConfig - утилита для управления конфигурацией blockchain сетей
 * @remarks Предоставляет методы для работы с поддерживаемыми сетями
 */
export const NetworkConfig = {
  getNetwork,
  isSupported,
  getRecommended,
  getAllNetworks,
  getProductionNetworks,
  getTestnetNetworks,
} as const;
