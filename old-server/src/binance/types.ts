export interface BinanceFuturePrice {
  e: string;
  E: number;
  s: string;
  p: string;
  i: string;
  P: string;
  r: string;
  T: number;
}

export type BinanceFeatureType = 'FUTURE' | 'SPOT';
export enum BinanceFeatureEnum {
  FUTURE = 'FUTURE',
  SPOT = 'SPOT',
}

// "e": "markPriceUpdate",     // Event type
// "E": 1562305380000,         // Event time
// "s": "BTCUSDT",             // Symbol
// "p": "11185.87786614",      // Mark price
// "i": "11784.62659091"       // Index price
// "P": "11784.25641265",      // Estimated Settle Price, only useful in the last hour before the settlement starts
// "r": "0.00030000",          // Funding rate
// "T": 1562306400000          // Next funding time