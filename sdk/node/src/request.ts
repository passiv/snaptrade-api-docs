const axios = require("axios");
const crypto = require("crypto");

const baseAPI = "https://api.passiv.com";

const signRequest = (req: any, endpoint: string, consumerK: string) => {
  const consumerKey = encodeURI(consumerK);

  const requestData = req.defaults.data;
  const requestPath = endpoint;
  const requestQuery = new URLSearchParams(req.defaults.params).toString();

  const sigObject = {
    content: requestData,
    path: requestPath,
    query: requestQuery,
  };

  const sigContent = JSON.stringify(sigObject);
  const hmac = crypto.createHmac("sha256", consumerKey);

  const signature = hmac.update(sigContent).digest("base64");

  req.defaults.headers.Signature = signature;
  return req;
};

/**
 * @param {string} endpoint
 * @param {string} method
 * @param {string} clientId
 * @param {string} consumerKey
 * @param {string | null} userId
 * @param {{} | null} data
 * @returns {Promise<any>}
 */

export const request = async (
  endpoint: string,
  method: string,
  clientId: string,
  consumerKey: string,
  userId: string | null = null,
  data: {} | null = null
) => {
  let params: any = { timestamp: +new Date(), clientId: clientId };
  if (userId) {
    params = { ...params, userId };
  }

  const axiosInstance = axios.create({
    baseURL: baseAPI,
    timeout: 30000,
    params: params,
    data: data,
  });

  const req = signRequest(axiosInstance, endpoint, consumerKey);

  let response;
  try {
    switch (method) {
      case "post":
        const postReq = await req.post(endpoint, data);
        response = {
          data: postReq.data,
          meta: {
            status: postReq.status,
            statusText: postReq.statusText,
          },
        };
        break;
      case "get":
        const getReq = await req(endpoint);
        response = {
          data: getReq.data,
          meta: {
            status: getReq.status,
            statusText: getReq.statusText,
          },
        };
        break;
      default:
        break;
    }
  } catch (err: any) {
    response = err.response.data;
  }

  return response;
};
