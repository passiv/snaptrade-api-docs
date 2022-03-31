export interface DefaultQueryParams {
  userId: string;
  userSecret: string;
}

export interface OrderImpactBodyParams {
  account_id: string;
  action: "BUY" | "SELL";
  order_type: "Limit" | "Market";
  price: number;
  time_in_force: "Day";
  units: number;
  universal_symbol_id: string;
}
