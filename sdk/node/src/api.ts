import {
  AccountType,
  BalanceType,
  BrokerageType,
  CurrencyType,
  ExchangeRateType,
  UniversalSymbolType,
} from "./general-types";
import { DefaultQueryParams, OrderImpactBodyParams } from "./option-types";
import {
  AccountPositionsResponseType,
  ApiStatusResponseType,
  BrokerageAuthResponseType,
  DeleteUserResponseType,
  OrderImpactResponseType,
  OrderResponseType,
  RedirectURIResponseType,
  RegisterUserResponseType,
  SymbolsQuoteResponseType,
  TransactionHistoryResponseType,
  UserHoldingsResponseType,
} from "./response-types";

const { request } = require("./request.js");

/**
 * @class SnapTradeFetch
 */

class SnapTradeFetch {
  clientId: string;
  consumerKey: string;

  /**
   * Creates an instance of SnapTrade fetch.
   * @param {string} clientId - SnapTrade Client ID (generated and provided to partner by Passiv)
   * @param {string} consumerKey - SnapTrade Consumer Key (generated and provided to partner by Passiv)
   */
  constructor(clientId: string, consumerKey: string) {
    this.clientId = clientId;
    this.consumerKey = consumerKey;
  }

  /**
   * Gets API Status.
   * @returns Promise<ApiStatusResponseType>
   */
  async getAPIStatus(): Promise<ApiStatusResponseType> {
    const response = await request({
      endpoint: "/api/v1/",
      method: "get",
      clientId: this.clientId,
      consumerKey: this.consumerKey,
    });
    return response as Promise<ApiStatusResponseType>;
  }

  /** Authentication **/

  /**
   * Register user with SnapTrade
   * in order to create secure brokerage authorizations.
   * @param {string} userId - SnapTrade User ID
   * @returns Promise<RegisterUserResponseType>
   */
  async registerUser(userId: string): Promise<RegisterUserResponseType> {
    const response = await request({
      endpoint: "/api/v1/snapTrade/registerUser",
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
      data: {
        userId,
      },
    });
    return response as Promise<RegisterUserResponseType>;
  }

  /**
   * Delete user, disabling all brokerage
   * authorizations and permanently deleting all data associated with the user.
   * @param {DefaultQueryParams} defaultQueryParams
   * @returns Promise<DeleteUserResponseType>
   */
  async deleteUser({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<DeleteUserResponseType> {
    const response = await request({
      endpoint: "/api/v1/snapTrade/deleteUser",
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<DeleteUserResponseType>;
  }

  /**
   * Generate a redirect URI to securely login a user to the SnapTrade Connection Portal.
   * @param {DefaultQueryParams} defaultQueryParams
   * @returns Promise<RedirectURIResponseType>
   */

  async generateRedirectURI({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<RedirectURIResponseType> {
    const response = await request({
      endpoint: "/api/v1/snapTrade/login",
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<RedirectURIResponseType>;
  }

  /** Account Information **/

  /**
   * List all accounts for the user, plus balances and positions for each account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @returns Promise<UserHoldingsResponseType>
   */
  async fetchUserHoldings({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<UserHoldingsResponseType> {
    const response = await request({
      endpoint: "/api/v1/holdings",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<UserHoldingsResponseType>;
  }

  /**
   * List all investment accounts for the user.
   * @param {DefaultQueryParams} defaultQueryParams
   * @returns Promise<AccountType[]>
   */
  async fetchUserAccounts({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<AccountType[]> {
    const response = await request({
      endpoint: "/api/v1/accounts",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<AccountType[]>;
  }

  /**
   * Return details of a specific investment account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @returns Promise<AccountType>
   */
  async fetchAccount(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string
  ): Promise<AccountType> {
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<AccountType>;
  }

  /**
   * Get all cash balances of an investment account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @returns Promise<BalanceType[]>
  
   */
  async fetchAccountBalances(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string
  ): Promise<BalanceType[]> {
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/balances`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<BalanceType[]>;
  }

  /**
   * Get all positions of an investment account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @returns Promise<AccountPositionsResponseType>
   */
  async fetchAccountPositions(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string
  ): Promise<AccountPositionsResponseType> {
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/positions`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<AccountPositionsResponseType>;
  }

  /** Trading **/

  /**
   * Get all history of orders placed in account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @param { status: string; days: number } extraParams
   * @returns Promise<OrdersResponseType[]>
   */
  async fetchOrdersHistory(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string,
    extraParams: { status: string; days: number }
  ): Promise<OrderResponseType[]> {
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/orders`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      extraParams,
    });
    return response as Promise<OrderResponseType[]>;
  }

  /**
   * Cancel open order in account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @param {brokerage_order_id: string} data
   * @returns Promise<OrderResponseType>
   */
  async cancelOpenOrder(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string,
    data: { brokerage_order_id: string }
  ): Promise<OrderResponseType> {
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/orders/cancel`,
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      data,
    });
    return response as Promise<OrderResponseType>;
  }

  /**
   * Get symbols quote.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @returns Promise<SymbolsQuoteResponseType>
   */
  async fetchSymbolsQuote(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string,
    extraParams: { symbolIds: string; use_ticker: boolean }
  ): Promise<SymbolsQuoteResponseType> {
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/quotes`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      extraParams,
    });
    return response as Promise<SymbolsQuoteResponseType>;
  }

  /**
   * Check impact of trades on account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {OrderImpactBodyParams} data
   * @returns Promise<OrderImpactResponseType>
   */
  async orderImpact(
    { userId, userSecret }: DefaultQueryParams,
    data: OrderImpactBodyParams
  ): Promise<OrderImpactResponseType> {
    const response = await request({
      endpoint: "/api/v1/trade/impact",
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      data,
    });
    return response as Promise<OrderImpactResponseType>;
  }

  /**
   * Place order.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} tradeId
   * @returns Promise<OrderResponseType>
   */
  async placeOrder(
    { userId, userSecret }: DefaultQueryParams,
    tradeId: string
  ): Promise<OrderResponseType> {
    const response = await request({
      endpoint: `/api/v1/trade/${tradeId}`,
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<OrderResponseType>;
  }

  /** Connections **/

  /**
   * List all brokerage authorizations for the user.
   * @param {DefaultQueryParams} defaultQueryParams
   * @returns Promise<BrokerageAuthResponseType[]>
   */
  async fetchBrokerageAuthorizations({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<BrokerageAuthResponseType[]> {
    const response = await request({
      endpoint: "/api/v1/authorizations",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<BrokerageAuthResponseType[]>;
  }

  /**
   * Get detail of a specific brokerage authorizations for the user.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} authorizationId
   * @returns Promise<BrokerageAuthResponseType>
   */
  async fetchAuthorization(
    { userId, userSecret }: DefaultQueryParams,
    authorizationId: string
  ): Promise<BrokerageAuthResponseType> {
    const response = await request({
      endpoint: `/api/v1/authorizations/${authorizationId}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<BrokerageAuthResponseType>;
  }

  /**
   * Remove a brokerage authorization.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} authorizationId
   * @returns Promise<BrokerageAuthResponseType>
   */
  async deleteAuthorization(
    { userId, userSecret }: DefaultQueryParams,
    authorizationId: string
  ): Promise<BrokerageAuthResponseType> {
    const response = await request({
      endpoint: `/api/v1/authorizations/${authorizationId}`,
      method: "delete",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response as Promise<BrokerageAuthResponseType>;
  }

  /** Reference Data **/

  /**
   * List of all supported brokerages.
   * @returns Promise<BrokerageType[]>
   */
  async fetchBrokerages(): Promise<BrokerageType[]> {
    const response = await request({
      endpoint: "/api/v1/brokerages",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response as Promise<BrokerageType[]>;
  }

  /**
   * List of all supported currencies.
   * @returns Promise<CurrencyType[]>
   */
  async fetchCurrencies(): Promise<CurrencyType[]> {
    const response = await request({
      endpoint: "/api/v1/currencies",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response as Promise<CurrencyType[]>;
  }

  /**
   * Return the exchange rates of all supported currencies.
   * @returns Promise<ExchangeRateType[]>
   */
  async fetchExchangeCurrencies(): Promise<ExchangeRateType[]> {
    const response = await request({
      endpoint: "/api/v1/currencies/rates",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response as Promise<ExchangeRateType[]>;
  }

  /**
   * Return the exchange rate of a currency pair.
   * @param {string} currencyPair
   * @returns Promise<ExchangeRateType>
   */
  async getCurrencyPair(currencyPair: string): Promise<ExchangeRateType> {
    const response = await request({
      endpoint: `/api/v1/currencies/rates/${currencyPair}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response as Promise<ExchangeRateType>;
  }

  /**
   * Search for symbols.
   * @param {substring: string} data
   * @returns Promise<UniversalSymbolType[]>
   */
  async searchSymbols(data: {
    substring: string;
  }): Promise<UniversalSymbolType[]> {
    const response = await request({
      endpoint: "/api/v1/symbols",
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
      data,
    });
    return response as Promise<UniversalSymbolType[]>;
  }

  /**
   * Get details of a symbol.
   * @param {string} symbolId
   * @returns Promise<UniversalSymbolType>
   */
  async getSymbolDetailById(symbolId: string): Promise<UniversalSymbolType> {
    const response = await request({
      endpoint: `/api/v1/symbols/${symbolId}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response as Promise<UniversalSymbolType>;
  }

  /**
   * Get details of a symbol by the ticker.
   * @param {string} ticker
   * @returns Promise<UniversalSymbolType>
   */
  async getSymbolDetailByTicker(ticker: string): Promise<UniversalSymbolType> {
    const response = await request({
      endpoint: `/api/v1/symbols/${ticker}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response as Promise<UniversalSymbolType>;
  }

  /** Reporting **/

  /**
   * Get transaction history for a user
   * @param {DefaultQueryParams} defaultQueryParams
   * @param { startDate: string; endDate: string } extraParams
   * @returns Promise<TransactionHistoryResponseType[]>
   */
  async fetchTransactionHistory(
    { userId, userSecret }: DefaultQueryParams,
    extraParams: { startDate: string; endDate: string }
  ): Promise<TransactionHistoryResponseType[]> {
    const response = await request({
      endpoint: "/api/v1/symbols/activities",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      extraParams,
    });
    return response as Promise<TransactionHistoryResponseType[]>;
  }
}

module.exports = SnapTradeFetch;
