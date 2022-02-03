"use strict";
const { request } = require("./request.js");
/**
 * @class SnapTradeFetch
 * @param {string} clientId
 * @param {string} consumerKey
 */
class SnapTradeFetch {
    constructor(clientId, consumerKey) {
        this.clientId = clientId;
        this.consumerKey = consumerKey;
    }
    /**
     * @param userId
     * Register user
     */
    async registerUser(userId) {
        const response = await request("/api/v1/snapTrade/registerUser", "post", this.clientId, this.consumerKey, null, {
            userId,
        });
        return response;
    }
    /**
     * @param userId
     * @param userSecret
     * Generate a redirect URI for user to login
     */
    async generateRedirectURI(userId, userSecret) {
        const data = {
            userId,
            userSecret,
        };
        const response = await request("/api/v1/snapTrade/login", "post", this.clientId, this.consumerKey, null, data);
        return response;
    }
    /**
     * @param userId
     * @param userSecret
     * Delete user, disabling all brokerage
     * authorizations and permanently deleting all data associated with the user
     */
    async deleteUser(userId, userSecret) {
        const data = {
            userId,
            userSecret,
        };
        const response = await request("/api/v1/snapTrade/deleteUser", "post", this.clientId, this.consumerKey, null, data);
        return response;
    }
    /**
     * @param userId
     * Fetch user holdings
     */
    async fetchUserHoldings(userId) {
        const response = await request("/api/v1/snapTrade/holdings", "get", this.clientId, this.consumerKey, userId, null);
        return response;
    }
}
module.exports = SnapTradeFetch;
