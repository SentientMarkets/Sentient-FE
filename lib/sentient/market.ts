export interface CollateralToken {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
}

export interface Market {
  id: string;
  address: `0x${string}`;
  question: string;
  endTime: Date;
  collateralToken: CollateralToken;
  virtualLiquidity: string;
  yesPrice: string;
  noPrice: string;
  volume: string;
  liquidity: string;
  createdAt: Date;
  creator: `0x${string}`;
  category: string;
  description: string;
  resolution: boolean | null;
  resolutionTime: Date | null;
}

/**
 * Formats a price value (0-1) as a percentage
 */
export function formatPriceAsPercentage(price: string): string {
  const priceNumber = parseFloat(price);
  return `${(priceNumber * 100).toFixed(1)}%`;
} 