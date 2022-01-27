const axios = require("axios");
const crypto = require("crypto");

var CLIENT_ID = process.env.CLIENT_ID;
if (CLIENT_ID === undefined) {
  CLIENT_ID = "[ENTER-YOUR-CLIENT-ID-HERE-IF-YOU-DONT-LIKE-ENVVARS]";
}

var CONSUMER_KEY = process.env.CONSUMER_KEY;
if (CONSUMER_KEY === undefined) {
  CONSUMER_KEY = "[ENTER-YOUR-KEY-HERE-IF-YOU-DONT-LIKE-ENVVARS]";
}

var USER_ID = process.env.USER_ID;
if (USER_ID === undefined) {
  USER_ID = "[ENTER-YOUR-USER-ID-HERE-IF-YOU-DONT-LIKE-ENVVARS]";
}

const baseAPI = "https://api.passiv.com";

// create an instance of axios
const SnapTradeClient = axios.create({
  baseURL: baseAPI,
  timeout: 30000,
  params: { clientId: CLIENT_ID, timestamp: +new Date() },
});

// sign the request
const signRequest = (
  path,
  data = null,
  query = `clientId=${CLIENT_ID}&timestamp=${+new Date()}`
) => {
  const consumerKey = encodeURI(CONSUMER_KEY);

  const requestData = data;
  const requestPath = path;
  const requestQuery = query;

  const sigObject = {
    content: requestData,
    path: requestPath,
    query: requestQuery,
  };

  const sigContent = JSON.stringify(sigObject);
  const hmac = crypto.createHmac("sha256", consumerKey);

  const signature = hmac.update(sigContent).digest("base64");
  return signature;
};

// const getReq = (endpoint) => {
//   const signature = signRequest(endpoint, data);
//   SnapTradeClient.defaults.headers.Signature = signature;
//   SnapTradeClient.get(endpoint)
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// post request function
const postReq = async (endpoint, data) => {
  const signature = signRequest(endpoint, data);
  SnapTradeClient.defaults.headers.Signature = signature;

  return new Promise((resolve, reject) => {
    SnapTradeClient.post(endpoint, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response.data.detail);
      });
  });
};

// start

console.log(`Attempting to create user ${USER_ID} ...`);

// creating a user
postReq("/api/v1/snapTrade/registerUser", {
  userId: USER_ID,
})
  .then((res) => {
    console.log("User created successfully!");
    const userSecret = res.userSecret;

    console.log("Now generating a Connection Portal link...");

    // generate a redirect URI
    postReq("/api/v1/snapTrade/login", {
      userId: USER_ID,
      userSecret,
    })
      .then((res) => {
        const redirectURI = res.redirectURI;
        console.log("Open this link in a browser:", redirectURI);
      })
      .catch((err) => {
        console.error("ERROR generating a redirect URI!", `"${err}"`);
      });
  })
  .catch((err) => {
    console.error("ERROR creating a user!", `"${err}"`);
  });
