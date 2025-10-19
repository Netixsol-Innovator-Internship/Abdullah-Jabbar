export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
}

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  formattedBalance: string;
}

export interface TokenState {
  tokens: Record<string, TokenInfo>;
  balances: Record<string, TokenBalance>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface PoolReserve {
  tokenA: string;
  tokenB: string;
  reserveA: string;
  reserveB: string;
  price: string;
}

export interface DexState {
  reserves: Record<string, PoolReserve>;
  loading: boolean;
  error: string | null;
}
