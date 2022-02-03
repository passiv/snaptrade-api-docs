const SnapTrade = require("@snaptrade/js-fetch-api");

const snapTrade = new SnapTrade("PASSIVDEMOV1");

const registerUser = async () => {
  const registeredUser = await snapTrade.registerUser(
    "shayan.abedi@passiv.com"
  );
  return registeredUser.data;
};

const login = async () => {
  const registeredUserData = await registerUser();
  const userSecret = registeredUserData.userSecret;
  // const redirectURI = await snapTrade.generateRedirectURI(
  //   "shayan.abedi@passiv.com",
  //   userSecret
  // );
  // const userHoldings = await snapTrade.fetchUserHoldings(
  //   "shayan.abedi@passiv.com"
  // );
  // console.log(JSON.stringify(userHoldings));
  const deleteUser = await snapTrade.deleteUser(
    "shayan.abedi@passiv.com",
    userSecret
  );
  console.log(deleteUser);
};

login();
