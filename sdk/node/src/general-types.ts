export interface CurrencyType {
  id: string;
  code: string;
  name: string;
}
export interface AccountType {
  id: string;
  brokerage: string;
  number: string;
  name: string;
}

export interface BalanceType {
  currency: CurrencyType;
  cash: number;
}

export interface SymbolType {
  symbol: string;
  name: string;
  currency: CurrencyType;
  exchange: {
    code: string;
    name: string;
  };
}

export interface PositionType {
  symbol: SymbolType;
}

export interface UniversalSymbolType {
  id: string;
  symbol: string;
  description: string;
  currency: CurrencyType;
}

export interface ManualTradeSymbolType {
  brokerage_symbol_id: string;
  universal_symbol_id: string;
  currency: CurrencyType;
  local_id: string;
  description: string;
  symbol: string;
}

export interface TradeType {
  id: string;
  account: AccountType;
  order_type: string;
  time_in_force: "FOK" | "Day";
  symbol: ManualTradeSymbolType;
  action: string;
  units: number;
  price: number;
}

export interface BrokerageType {
  id: string;
  name: string;
  url: string;
  authorized_types: {
    type: string;
  }[];
}

export interface ExchangeRateType {
  src: CurrencyType;
  dst: CurrencyType;
  exchange_rate: number;
}
