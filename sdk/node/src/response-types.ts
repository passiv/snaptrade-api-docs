import {
  AccountType,
  BalanceType,
  BrokerageType,
  CurrencyType,
  ManualTradeSymbolType,
  PositionType,
  SymbolType,
  TradeType,
  UniversalSymbolType,
} from "./general-types";

export interface ResponseType {
  meta: { status: number; statusText: string };
}

export interface ApiStatusResponseType extends ResponseType {
  data: {
    version: number;
    timestamp: string;
    online: boolean;
  };
}

export interface RegisterUserResponseType extends ResponseType {
  data: {
    userId: string;
    userSecret: string;
  };
}

export interface DeleteUserResponseType extends ResponseType {
  data: {
    status: string;
    userId: string;
  };
}

export interface RedirectURIResponseType extends ResponseType {
  data: {
    redirectURI: string;
  };
}

export interface UserHoldingsResponseType extends ResponseType {
  data: {
    account: AccountType;
    balances: BalanceType[];
    positions: PositionType[];
    units: number;
    price: number;
  }[];
}

export interface AccountPositionsResponseType extends ResponseType {
  data: {
    symbol: SymbolType;
    units: number;
    price: number;
  }[];
}

export interface OrderResponseType extends ResponseType {
  data: {
    brokerage_order_id: string;
    status: string;
    symbol: string;
    universal_symbol: UniversalSymbolType;
    action: string;
    total_quantity: number;
    open_quantity: number;
    canceled_quantity: number;
    filled_quantity: number;
    execution_price: number;
    limit_price: number;
    stop_price: number;
    order_type: string;
    time_in_force: "FOK" | "Day";
    time_placed: string;
    time_updated: string;
    expiry_date: string;
  };
}

export interface OrderImpactResponseType extends ResponseType {
  trade: TradeType;
  trade_impacts: {
    id: string;
    account: AccountType;
    order_type: string;
    time_in_force: "FOK" | "Day";
    symbol: ManualTradeSymbolType;
    action: string;
    units: number;
    price: number;
  };
  combined_remaining_balance: {
    account: AccountType;
    currency: CurrencyType;
    cash: number;
  };
}

export interface BrokerageAuthResponseType extends ResponseType {
  id: string;
  created: number;
  brokerage: BrokerageType;
  type: string;
}

export interface TransactionHistoryResponseType extends ResponseType {
  account: AccountType;
  amount: number;
  currency: CurrencyType;
  description: string;
  fee: number;
  institution: string;
  price: number;
  settlement_date: string;
  symbol: SymbolType;
  trade_date: string;
  type: string;
  units: number;
}

export interface SymbolsQuoteResponseType extends ResponseType {
  symbol: UniversalSymbolType;
  bid_price: number;
  ask_price: number;
  last_trade_price: number;
  bid_size: number;
  ask_size: number;
}
