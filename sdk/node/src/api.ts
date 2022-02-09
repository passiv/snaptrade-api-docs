import { DefaultQueryParams } from "./option-types";
import {
  ApiStatusResponseType,
  DeleteUserResponseType,
  RegisterUserResponseType,
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
   * @returns {Promise<ApiStatusResponseType>}
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
   * @returns {Promise<RegisterUserResponseType>}
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
   * @returns {Promise<DeleteUserResponseType>}
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
   */

  async generateRedirectURI({ userId, userSecret }: DefaultQueryParams) {
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
    return response;
  }

  /** Account Information **/

  /**
   * List all accounts for the user, plus balances and positions for each account.
   * @param {DefaultQueryParams} defaultQueryParams
   */
  async fetchUserHoldings({ userId, userSecret }: DefaultQueryParams) {
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
    return response;
  }

  /**
   * List all investment accounts for the user.
   * @param {DefaultQueryParams} defaultQueryParams
   */
  async fetchUserAccounts({ userId, userSecret }: DefaultQueryParams) {
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
    return response;
  }
  /**
   * Return details of a specific investment account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   */
  async fetchAccount(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string
  ) {
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
    return response;
  }

  /**
   * Get all cash balances of an investment account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   */
  async fetchAccountBalances(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string
  ) {
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
    return response;
  }

  /**
   * Get all positions of an investment account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   */
  async fetchAccountPositions(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string
  ) {
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
    return response;
  }

  /** Trading **/

  /**
   * Get all history of orders placed in account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @param extraParams
   */
  async fetchOrdersHistory(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string,
    extraParams: { status: string; days: number }
  ) {
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
    return response;
  }

  /**
   * Cancel open order in account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} accountId
   * @param data
   */
  async cancelOpenOrder(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string,
    data: { brokerage_order_id: string }
  ) {
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
    return response;
  }

  /**
   * Check impact of trades on account.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param data
   */
  async orderImpact(
    { userId, userSecret }: DefaultQueryParams,
    data: {
      account_id: string;
      action: "BUY" | "SELL";
      order_type: "Limit" | "Market";
      price: number;
      time_in_force: "Day";
      units: number;
      universal_symbol_id: string;
    }
  ) {
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
    return response;
  }

  /**
   * Place order.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} tradeId
   */
  async placeOrder(
    { userId, userSecret }: DefaultQueryParams,
    tradeId: string
  ) {
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
    return response;
  }

  /** Connections **/

  /**
   * List all brokerage authorizations for the user.
   * @param {DefaultQueryParams} defaultQueryParams
   */
  async fetchBrokerageAuthorizations({
    userId,
    userSecret,
  }: DefaultQueryParams) {
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
    return response;
  }

  /**
   * Get detail of a specific brokerage authorizations for the user.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} authorizationId
   */
  async fetchAuthorization(
    { userId, userSecret }: DefaultQueryParams,
    authorizationId: string
  ) {
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
    return response;
  }

  /**
   * Get detail of a specific brokerage authorizations for the user.
   * @param {DefaultQueryParams} defaultQueryParams
   * @param {string} authorizationId
   */
  async deleteAuthorization(
    { userId, userSecret }: DefaultQueryParams,
    authorizationId: string
  ) {
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
    return response;
  }

  /** Reference Data **/

  /**
   * List of all supported brokerages,
   */
  async fetchBrokerages() {
    const response = await request({
      endpoint: "/api/v1/brokerages",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * List of all supported currencies.
   */
  async fetchCurrencies() {
    const response = await request({
      endpoint: "/api/v1/currencies",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Return the exchange rates of all supported currencies.
   */
  async fetchCurrenciesRates() {
    const response = await request({
      endpoint: "/api/v1/currencies/rates",
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Return the exchange rate of a currency pair.
   * @param {string} currencyPair
   */
  async getCurrencyPair(currencyPair: string) {
    const response = await request({
      endpoint: `/api/v1/currencies/rates/${currencyPair}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Search for symbols.
   * @param data
   */
  async searchSymbols(data: { substring: string }) {
    const response = await request({
      endpoint: "/api/v1/symbols",
      method: "post",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
      data,
    });
    return response;
  }

  /**
   * Get details of a symbol.
   * @param {string} symbolId
   */
  async getSymbolDetailById(symbolId: string) {
    const response = await request({
      endpoint: `/api/v1/symbols/${symbolId}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Get details of a symbol by the ticker.
   * @param {string} ticker
   */
  async getSymbolDetailByTicker(ticker: string) {
    const response = await request({
      endpoint: `/api/v1/symbols/${ticker}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultQueryParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /** Reporting **/

  /**
   * Get transaction history for a user
   * @param {DefaultQueryParams} defaultQueryParams
   * @param extraParams
   */
  async fetchTransactionHistory(
    { userId, userSecret }: DefaultQueryParams,
    extraParams: { startDate: string; endDate: string }
  ) {
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
    return response;
  }
}

module.exports = SnapTradeFetch;
