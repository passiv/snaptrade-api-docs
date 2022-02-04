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
    const response = await request(
      "/api/v1/",
      "get",
      this.clientId,
      this.consumerKey,
      null,
      null
    );
    return response;
  }

  /**
   * @param userId
   * Register user with SnapTrade
   */
  async registerUser(userId: string) {
    const response = await request(
      "/api/v1/snapTrade/registerUser",
      "post",
      this.clientId,
      this.consumerKey,
      null,
      {
        userId,
      }
    );
    return response;
  }

  /**
   * @param userId
   * @param userSecret
   * Delete user, disabling all brokerage
   * authorizations and permanently deleting all data associated with the user
   */

  async deleteUser(userId: string, userSecret: string) {
    const data = {
      userId,
      userSecret,
    };
    const response = await request(
      "/api/v1/snapTrade/deleteUser",
      "post",
      this.clientId,
      this.consumerKey,
      null,
      data
    );
    return response;
  }

  /**
   * @param userId
   * @param userSecret
   * Generate a redirect URI to securely login a user to the SnapTrade Connection Portal
   */

  async generateRedirectURI(userId: string, userSecret: string) {
    const data = {
      userId,
      userSecret,
    };
    const response = await request(
      "/api/v1/snapTrade/login",
      "post",
      this.clientId,
      this.consumerKey,
      null,
      data
    );
    return response;
  }

  /**
   * @param userId
   * List all accounts for the user, plus balances and positions for each account
   */
  async fetchUserHoldings(userId: string) {
    const response = await request(
      "/api/v1/holdings",
      "get",
      this.clientId,
      this.consumerKey,
      userId,
      null
    );
    return response;
  }

  /**
   * @param userId
   * List all investment accounts for the user
   */
  async fetchUserAccounts(userId: string) {
    const response = await request(
      "/api/v1/accounts",
      "get",
      this.clientId,
      this.consumerKey,
      userId,
      null
    );
    return response;
  }
  /**
   * @param userId
   * @param accountId
   * Return details of a specific investment account
   */
  async fetchAccount(userId: string, accountId: string) {
    const response = await request(
      `/api/v1/accounts/${accountId}`,
      "get",
      this.clientId,
      this.consumerKey,
      userId,
      null
    );
    return response;
  }

  /**
   * @param userId
   * @param accountId
   * Get all cash balances of an investment account
   */
  async fetchAccountBalances(userId: string, accountId: string) {
    const response = await request(
      `/api/v1/accounts/${accountId}/balances`,
      "get",
      this.clientId,
      this.consumerKey,
      userId,
      null
    );
    return response;
  }

  /**
   * @param userId
   * @param accountId
   * Get all positions of an investment account
   */
  async fetchAccountPositions(userId: string, accountId: string) {
    const response = await request(
      `/api/v1/accounts/${accountId}/positions`,
      "get",
      this.clientId,
      this.consumerKey,
      userId,
      null
    );
    return response;
  }
}

module.exports = SnapTradeFetch;
