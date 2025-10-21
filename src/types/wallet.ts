/**
 * @fileoverview TypeScript типы для управления состоянием кошелька и транзакций
 */

/**
 * @description Состояние подключения кошелька
 * @example
 * ```typescript
 * const walletState: WalletState = {
 *   account: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
 *   balance: "1.234 MATIC",
 *   chainId: 137,
 *   chainName: "Polygon",
 *   isExpensiveNetwork: false,
 *   isConnecting: false,
 *   error: null
 * };
 * ```
 */
export interface WalletState {
  /** Адрес подключенного кошелька (null если не подключен) */
  account: string | null
  /**
   * Баланс в формате с валютой
   * (например, "1.234 ETH" или "0.5 MATIC")
   */
  balance: string
  /** ID текущей blockchain сети */
  chainId: number | null
  /**
   * Название текущей blockchain сети
   * (например, "Polygon", "Ethereum")
   */
  chainName: string | null
  /** Флаг дорогой сети (true для Ethereum Mainnet) */
  isExpensiveNetwork: boolean
  /** Флаг процесса подключения кошелька */
  isConnecting: boolean
  /** Объект ошибки при возникновении проблем */
  error: Error | null
}

/**
 * @description Callback функция для обновлений состояния кошелька
 * @param state - Текущее состояние кошелька
 */
export type StateListener = (state: WalletState) => void;

/**
 * @description Функция для отписки от обновлений состояния кошелька
 */
export type UnsubscribeFn = () => void;

/**
 * @description Данные для отправки транзакции
 */
export interface TransactionData {
  /** Адрес кошелька получателя */
  to: string
  /**
   * Сумма для отправки в читаемом формате
   * (например, "0.1" для 0.1 ETH/MATIC)
   */
  amount: string
}
