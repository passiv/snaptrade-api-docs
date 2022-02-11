# @snaptrade/js-fetch-api

A Node SDK for SnapTrade API.

Contact us to schedule a demo and get a consumer key: [api@snaptrade.com](mailto:api@snaptrade.com).

## Getting Started

```typescript
const SnapTrade = require("@snaptrade/js-fetch-api");

const const snapTrade = new SnapTrade(
  "DEMO",
  "CONSUMER_KEY"
);


// Gets API Status
const apiStatus = async () => {
  const status = await snapTrade.getAPIStatus();
  return status;
};

// Register a new user
const registerUser = async () => {
  const registeredUser = await snapTrade.registerUser(
    "USER_ID"
  );
  return registeredUser;
};
```

---

## Authentication

### _login user_

Generate a redirect URI to securely login a user to the SnapTrade Connection Portal.

##### Signature:

```typescript
generateRedirectURI({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<RedirectURIResponseType>
```

##### Example:

```typescript
const redirectURI = async () => {
  const uri = await snapTrade.generateRedirectURI({
    userId: "USER_ID",
    userSecret: "USER_SECRET",
  });
  return uri;
};
```

### _delete user_

Delete user from SnapTrade, disabling all brokerage authorizations and permanently deleting all data associated with the user.

##### Signature:

```typescript
deleteUser({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<DeleteUserResponseType>
```

##### Example:

```typescript
const deleteUser = async () => {
  const deletedUser = await snapTrade.deleteUser({
    userId: "USER_ID",
    userSecret: "USER_SECRET",
  });
  return deletedUser;
};
```

---

## Account Information

### _user holdings_

List all accounts for the user, plus balances and positions for each account.

##### Signature:

```typescript
fetchUserHoldings({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<UserHoldingsResponseType>

```

##### Example:

```typescript
const userHoldings = async () => {
  const holdings = await snapTrade.fetchUserAccounts({
    userId: "USER_ID",
    userSecret: "USER_SECRET",
  });
  return holdings;
};
```

### _user accounts_

List all investment accounts for the user.

##### Signature:

```typescript
fetchUserAccounts({
    userId,
    userSecret,
  }: DefaultQueryParams): Promise<AccountType[]>
```

##### Example:

```typescript
const userAccounts = async () => {
  const accounts = await snapTrade.fetchUserAccounts({
    userId: "USER_ID",
    userSecret: "USER_SECRET",
  });
  return accounts;
};
```

### _user account_

Return details of a specific investment account.

##### Signature:

```typescript
fetchAccount(
    { userId, userSecret }: DefaultQueryParams,
    accountId: string
  ): Promise<AccountType>
```

##### Example:

```typescript
const userAccount = async () => {
  const account = await snapTrade.fetchAccount(
    {
      userId: "USER_ID",
      userSecret: "USER_SECRET",
    },
    accountId
  );
  return account;
};
```
