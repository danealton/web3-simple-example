/**
 * @fileoverview TypeScript типы для конфигурации blockchain сетей
 * (multi-chain поддержка)
 */

/**
 * @description Информация о blockchain сети
 * @interface NetworkInfo
 * @since 1.0.0
 * @example
 * ```typescript
 * const polygonNetwork: NetworkInfo = {
 *   chainId: 137,
 *   name: "Polygon",
 *   currency: "MATIC",
 *   rpcUrl: "https://polygon-rpc.com",
 *   blockExplorer: "https://polygonscan.com",
 *   gasPrice: "~$0.001-0.01",
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
  /** Название сети (например, "Polygon", "Ethereum") */
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
  /** Примерная стоимость газа (например, "~$0.001-0.01") */
  gasPrice: string
  /** Флаг рекомендуемой сети для использования */
  recommended?: boolean
}

/**
 * @description Конфигурация всех поддерживаемых сетей
 * (маппинг chainId → NetworkInfo)
 * @type NetworksConfig
 * @since 1.0.0
 * @example
 * ```typescript
 * const networks: NetworksConfig = {
 *   137: polygonNetwork,
 *   1: ethereumNetwork,
 *   8453: baseNetwork
 * };
 * ```
 */
export type NetworksConfig = Record<number, NetworkInfo>;
