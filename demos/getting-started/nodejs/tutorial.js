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

// signing the request
const signRequest = (req, endpoint) => {
  const consumerKey = encodeURI(CONSUMER_KEY);

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

// creating a request
const createRequest = (endpoint, data = null, userId = null) => {
  let params = { clientId: CLIENT_ID, timestamp: +new Date() };
  if (userId) {
    params = { ...params, userId };
  }

  const request = axios.create({
    baseURL: baseAPI,
    timeout: 30000,
    params: params,
    data: data,
  });

  return signRequest(request, endpoint);
};

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", (data) => {
      const byteArray = [...data];
      if (byteArray.length > 0 && byteArray[0] === 3) {
        console.log("^C");
        process.exit(1);
      }
      if (byteArray.length > 0 && byteArray[0] === 13) {
        process.stdin.setRawMode(false);
      }
      resolve();
    })
  );
};

const registerUserRequest = createRequest("/api/v1/snapTrade/registerUser", {
  userId: USER_ID,
});

registerUserRequest
  .post("/api/v1/snapTrade/registerUser", {
    userId: USER_ID,
  })
  .then((res) => {
    console.log("--------------------------");
    console.log("User created successfully ✅");
    console.log("--------------------------");
    const userSecret = res.data.userSecret;

    console.log("Now generating a Connection Portal link 🔗");
    console.log("--------------------------");

    // generate a redirect URI
    const loginUserRequest = createRequest("/api/v1/snapTrade/login", {
      userId: USER_ID,
      userSecret,
    });

    loginUserRequest
      .post("/api/v1/snapTrade/login", {
        userId: USER_ID,
        userSecret,
      })
      .then((res) => {
        const redirectURI = res.data.redirectURI;
        console.log("Open this link in a browser:");
        console.log(redirectURI);
        console.log("--------------------------");
        console.log(
          "NOTE: Only continue when you have finished connecting your account."
        );
        console.log("Press [ENTER] to continue");
        keypress().then(() => {
          const holdingsRequest = createRequest(
            "/api/v1/snapTrade/holdings",
            null,
            USER_ID
          );
          holdingsRequest("/api/v1/snapTrade/holdings")
            .then((res) => {
              console.log("--------------------------");
              console.log(JSON.stringify(res.data));
            })
            .catch((err) => {
              console.log("Error fetching holdings", err.response.data.detail);
            });
        });
      })
      .catch((err) => {
        console.log(
          "Error generating a redirect link:",
          err.response.data.detail
        );
      });
  })
  .catch((err) => {
    console.log("Error registering the user:", err.response.data.detail);
  });
