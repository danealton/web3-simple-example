/**
 * @fileoverview TypeScript типы для конфигурации blockchain сетей (multi-chain поддержка)
 */

/**
 * @description Уровень стоимости газа в сети
 */
export type GasCostLevel = 'free' | 'low' | 'medium' | 'high';

/**
 * @description Информация о blockchain сети
 * @example
 * ```typescript
 * const polygonNetwork: NetworkInfo = {
 *   chainId: 137,
 *   name: "Polygon",
 *   currency: "MATIC",
 *   rpcUrl: "https://polygon-rpc.com",
 *   blockExplorer: "https://polygonscan.com",
 *   gasCostLevel: "low",
 *   recommended: true
 * };
 * ```
 */
export interface NetworkInfo {
  /**
   * Уникальный идентификатор сети
   * (например, 137 для Polygon, 1 для Ethereum)
   */
  chainId: number
  /** Название сети (например, "Polygon", "Amoy", "Sepolia") */
  name: string
  /** Символ нативного токена сети (например, "MATIC", "ETH") */
  currency: string
  /** RPC URL для подключения к сети */
  rpcUrl: string
  /**
   * URL обозревателя блоков
   * (например, "https://polygonscan.com")
   */
  blockExplorer: string
  /**
   * Описательная категория стоимости газа в сети
   * @remarks Для получения актуальных цен используйте RPC вызов eth_gasPrice
   */
  gasCostLevel: GasCostLevel
  /** Флаг рекомендуемой сети для использования */
  recommended?: boolean
}

/**
 * @description Конфигурация всех поддерживаемых сетей
 * @remarks Маппинг chainId → NetworkInfo
 */
export type NetworksConfig = Record<number, NetworkInfo>;
