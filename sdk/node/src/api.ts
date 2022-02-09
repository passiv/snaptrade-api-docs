const { request } = require("./request.js");

/**
 * @class SnapTradeFetch
 * @param {string} clientId
 * @param {string} consumerKey
 */

class SnapTradeFetch {
  clientId: string;
  consumerKey: string;

  constructor(clientId: string, consumerKey: string) {
    this.clientId = clientId;
    this.consumerKey = consumerKey;
  }

  /**
   * Get API Status
   */
  async getAPIStatus() {
    const response = await request({
      endpoint: "/api/v1/",
      method: "get",
      clientId: this.clientId,
      consumerKey: this.consumerKey,
    });
    return response;
  }

  /** Authentication **/

  /**
   * @param userId
   * Register user with SnapTrade
   */
  async registerUser(userId: string) {
    const response = await request({
      endpoint: "/api/v1/snapTrade/registerUser",
      method: "post",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
      data: {
        userId,
      },
    });
    return response;
  }

  /**
   * @param defaultParams
   * Delete user, disabling all brokerage
   * authorizations and permanently deleting all data associated with the user
   */

  async deleteUser(defaultParams: { userId: string; userSecret: string }) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: "/api/v1/snapTrade/deleteUser",
      method: "post",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /**
   * @param defaultParams
   * Generate a redirect URI to securely login a user to the SnapTrade Connection Portal
   */

  async generateRedirectURI(defaultParams: {
    userId: string;
    userSecret: string;
  }) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: "/api/v1/snapTrade/login",
      method: "post",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /** Account Information **/

  /**
   * @param defaultParams
   * List all accounts for the user, plus balances and positions for each account
   */
  async fetchUserHoldings(defaultParams: {
    userId: string;
    userSecret: string;
  }) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: "/api/v1/holdings",
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /**
   * @param defaultParams
   * List all investment accounts for the user
   */
  async fetchUserAccounts(defaultParams: {
    userId: string;
    userSecret: string;
  }) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: "/api/v1/accounts",
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }
  /**
   * @param defaultParams
   * @param accountId
   * Return details of a specific investment account
   */
  async fetchAccount(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    accountId: string
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /**
   * @param defaultParams
   * @param accountId
   * Get all cash balances of an investment account
   */
  async fetchAccountBalances(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    accountId: string
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/balances`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /**
   * @param defaultParams
   * @param accountId
   * Get all positions of an investment account
   */
  async fetchAccountPositions(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    accountId: string
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/positions`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /** Trading **/

  /**
   * @param defaultParams
   * @param accountId
   * @param extraParams
   * Get all history of orders placed in account
   */
  async fetchOrdersHistory(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    accountId: string,
    extraParams: { status: string; days: number }
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/orders`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      extraParams,
    });
    return response;
  }

  /**
   * @param defaultParams
   * @param accountId
   * @param data
   * Cancel open order in account
   */
  async cancelOpenOrder(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    accountId: string,
    data: { brokerage_order_id: string }
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/accounts/${accountId}/orders/cancel`,
      method: "post",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      data,
    });
    return response;
  }

  /**
   * @param defaultParams
   * @param data
   * Check impact of trades on account.
   */
  async orderImpact(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
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
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: "/api/v1/trade/impact",
      method: "post",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
      data,
    });
    return response;
  }

  /**
   * @param defaultParams
   * @param tradeId
   * Place order
   */
  async placeOrder(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    tradeId: string
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/trade/${tradeId}`,
      method: "post",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /** Connections **/

  /**
   * @param defaultParams
   * List all brokerage authorizations for the user
   */
  async fetchBrokerageAuthorizations(defaultParams: {
    userId: string;
    userSecret: string;
  }) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: "/api/v1/authorizations",
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /**
   * @param defaultParams
   * @param authorizationId
   * Get detail of a specific brokerage authorizations for the user
   */
  async fetchAuthorization(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    authorizationId: string
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/authorizations/${authorizationId}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /**
   * @param defaultParams
   * @param authorizationId
   * Get detail of a specific brokerage authorizations for the user
   */
  async deleteAuthorization(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    authorizationId: string
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: `/api/v1/authorizations/${authorizationId}`,
      method: "delete",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
        userSecret,
        userId,
      },
    });
    return response;
  }

  /** Reference Data **/

  /**
   * List of all supported brokerages
   */
  async fetchBrokerages() {
    const response = await request({
      endpoint: "/api/v1/brokerages",
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * List of all supported currencies
   */
  async fetchCurrencies() {
    const response = await request({
      endpoint: "/api/v1/currencies",
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Return the exchange rates of all supported currencies
   */
  async fetchCurrenciesRates() {
    const response = await request({
      endpoint: "/api/v1/currencies/rates",
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Return the exchange rate of a currency pair
   */
  async getCurrencyPair(currencyPair: string) {
    const response = await request({
      endpoint: `/api/v1/currencies/rates/${currencyPair}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Search for symbols
   */
  async searchSymbols(data: { substring: string }) {
    const response = await request({
      endpoint: "/api/v1/symbols",
      method: "post",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
      data,
    });
    return response;
  }

  /**
   * Get details of a symbol
   */
  async getSymbolDetailById(symbolId: string) {
    const response = await request({
      endpoint: `/api/v1/symbols/${symbolId}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /**
   * Get details of a symbol by the ticker
   */
  async getSymbolDetailByTicker(ticker: string) {
    const response = await request({
      endpoint: `/api/v1/symbols/${ticker}`,
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
        clientId: this.clientId,
      },
    });
    return response;
  }

  /** Reporting **/
  /**
   * Get transaction history for a user
   */
  async fetchTransactionHistory(
    defaultParams: {
      userId: string;
      userSecret: string;
    },
    extraParams: { startDate: string; endDate: string }
  ) {
    const { userSecret, userId } = defaultParams;
    const response = await request({
      endpoint: "/api/v1/symbols/activities",
      method: "get",
      consumerKey: this.consumerKey,
      defaultParams: {
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
