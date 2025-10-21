/**
 * @fileoverview Конфигурация поддерживаемых blockchain сетей
 */

import type { NetworkInfo, NetworksConfig } from '../types';

/**
 * @description Идентификаторы поддерживаемых blockchain сетей
 * @remarks Используйте эти константы вместо магических чисел
 */
export const ChainId = {
  // Production Networks
  ETHEREUM: 1,
  POLYGON: 137,
  BASE: 8453,
  // Testnet Networks
  AMOY: 80002,
  SEPOLIA: 11155111,
} as const;

/**
 * @description Конфигурация production blockchain сетей
 * @remarks Polygon, Base, Ethereum
 */
const MAINNET_NETWORKS: NetworksConfig = {
  [ChainId.POLYGON]: {
    chainId: ChainId.POLYGON,
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    gasCostLevel: 'low',
    recommended: true,
  },
  [ChainId.BASE]: {
    chainId: ChainId.BASE,
    name: 'Base',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    gasCostLevel: 'low',
    recommended: false,
  },
  [ChainId.ETHEREUM]: {
    chainId: ChainId.ETHEREUM,
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: 'https://cloudflare-eth.com',
    blockExplorer: 'https://etherscan.io',
    gasCostLevel: 'high',
    recommended: false,
  },
};

/**
 * @description Конфигурация testnet blockchain сетей
 * @remarks Amoy, Sepolia
 */
const TESTNET_NETWORKS: NetworksConfig = {
  [ChainId.AMOY]: {
    chainId: ChainId.AMOY,
    name: 'Amoy',
    currency: 'MATIC',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com',
    gasCostLevel: 'free',
    recommended: true,
  },
  [ChainId.SEPOLIA]: {
    chainId: ChainId.SEPOLIA,
    name: 'Sepolia',
    currency: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    gasCostLevel: 'free',
    recommended: false,
  },
};

/**
 * @description Все поддерживаемые blockchain сети
 * @remarks
 * Объединение production и testnet сетей.
 *
 * Поле gasCostLevel содержит описательную оценку стоимости газа.
 * Для получения актуальной цены используйте RPC вызов eth_gasPrice.
 */
const NETWORKS: NetworksConfig = {
  ...MAINNET_NETWORKS,
  ...TESTNET_NETWORKS,
};

/**
 * @description Получить информацию о сети по chain ID
 * @param chainId - Идентификатор сети
 * @returns Информация о сети или null если сеть не поддерживается
 * @example
 * ```typescript
 * const network = NetworkConfig.getNetwork(ChainId.POLYGON);
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
  return NETWORKS[ChainId.POLYGON];
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
  return Object.values(MAINNET_NETWORKS);
}

/**
 * @description Получить список testnet сетей
 * @returns Массив testnet сетей (Amoy, Sepolia)
 */
function getTestnetNetworks(): NetworkInfo[] {
  return Object.values(TESTNET_NETWORKS);
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
