import { parseEther, formatEther } from 'viem';
import { Address } from 'wagmi';

export interface Market {
  id: string;
  address: Address;
  question: string;
  endTime: Date;
  collateralToken: {
    address: Address;
    symbol: string;
    decimals: number;
  };
  virtualLiquidity: string;
  yesPrice: string;
  noPrice: string;
  volume?: string;
  liquidity?: string;
  createdAt?: Date;
  creator?: Address;
  category?: string;
  description?: string;
  resolution?: 'YES' | 'NO' | null;
  resolutionTime?: Date | null;
}

export type OutcomeType = 'YES' | 'NO';

export interface MarketPosition {
  marketId: string;
  outcome: OutcomeType;
  shares: string;
  avgPrice: string;
  pnl?: string;
  value?: string;
}

// Convert amount to wei based on token decimals (default 18)
export function toTokenAmount(amount: string | number, decimals: number = 18): bigint {
  try {
    return parseEther(amount.toString());
  } catch (error) {
    console.error('Error converting to token amount:', error);
    return BigInt(0);
  }
}

// Format wei amount to readable string based on token decimals (default 18)
export function fromTokenAmount(amount: bigint | string, decimals: number = 18): string {
  try {
    return formatEther(typeof amount === 'string' ? BigInt(amount) : amount);
  } catch (error) {
    console.error('Error converting from token amount:', error);
    return '0';
  }
}

// Calculate the expected shares from a given amount and price
export function calculateExpectedShares(
  amountIn: string,
  price: string,
  slippage: number = 0.01 // 1% default slippage
): string {
  try {
    const amount = parseFloat(amountIn);
    const priceValue = parseFloat(price);
    
    if (isNaN(amount) || isNaN(priceValue) || priceValue <= 0) {
      return '0';
    }
    
    // Expected shares = amount / price
    const expectedShares = amount / priceValue;
    
    // Apply slippage tolerance (reduce expected shares by slippage percentage)
    const sharesWithSlippage = expectedShares * (1 - slippage);
    
    return sharesWithSlippage.toFixed(6);
  } catch (error) {
    console.error('Error calculating expected shares:', error);
    return '0';
  }
}

// Calculate the expected cost for a given number of shares at a specific price
export function calculateExpectedCost(
  shares: string,
  price: string,
  slippage: number = 0.01 // 1% default slippage
): string {
  try {
    const sharesValue = parseFloat(shares);
    const priceValue = parseFloat(price);
    
    if (isNaN(sharesValue) || isNaN(priceValue)) {
      return '0';
    }
    
    // Expected cost = shares * price
    const expectedCost = sharesValue * priceValue;
    
    // Apply slippage tolerance (increase expected cost by slippage percentage)
    const costWithSlippage = expectedCost * (1 + slippage);
    
    return costWithSlippage.toFixed(6);
  } catch (error) {
    console.error('Error calculating expected cost:', error);
    return '0';
  }
}

// Format price as percentage
export function formatPriceAsPercentage(price: string | number): string {
  try {
    const priceValue = typeof price === 'string' ? parseFloat(price) : price;
    return `${(priceValue * 100).toFixed(2)}%`;
  } catch (error) {
    console.error('Error formatting price as percentage:', error);
    return '0%';
  }
}

// Get contract ABI for Sentient Market
export const SENTIENT_MARKET_ABI = [
  // Buy YES shares
  {
    name: 'buyYesShares',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'minSharesOut', type: 'uint256' }
    ],
    outputs: [{ name: 'sharesOut', type: 'uint256' }]
  },
  // Buy NO shares
  {
    name: 'buyNoShares',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'minSharesOut', type: 'uint256' }
    ],
    outputs: [{ name: 'sharesOut', type: 'uint256' }]
  },
  // Sell YES shares
  {
    name: 'sellYesShares',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sharesIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' }
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }]
  },
  // Sell NO shares
  {
    name: 'sellNoShares',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sharesIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' }
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }]
  },
  // Get market info
  {
    name: 'getMarketInfo',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'question', type: 'string' },
      { name: 'endTime', type: 'uint256' },
      { name: 'collateralToken', type: 'address' },
      { name: 'virtualLiquidity', type: 'uint256' },
      { name: 'resolution', type: 'uint8' } // 0: Unresolved, 1: YES, 2: NO
    ]
  },
  // Get current prices
  {
    name: 'getCurrentPrices',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'yesPrice', type: 'uint256' },
      { name: 'noPrice', type: 'uint256' }
    ]
  }
];

// Mock function to fetch market data (replace with actual API call)
export async function fetchMarketData(marketId: string): Promise<Market | null> {
  try {
    // In a real implementation, this would call your API or directly interact with the blockchain
    // For now, we'll return mock data
    return {
      id: marketId,
      address: '0x1234567890123456789012345678901234567890' as Address,
      question: 'Will ETH price exceed $5,000 by the end of 2024?',
      endTime: new Date('2024-12-31T23:59:59Z'),
      collateralToken: {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Address, // DAI
        symbol: 'DAI',
        decimals: 18
      },
      virtualLiquidity: '10000',
      yesPrice: '0.65',
      noPrice: '0.35',
      volume: '25000',
      liquidity: '15000',
      createdAt: new Date('2024-01-15T12:00:00Z'),
      creator: '0xabcdef1234567890abcdef1234567890abcdef12' as Address,
      category: 'Crypto',
      description: 'This market resolves to YES if the price of Ethereum (ETH) exceeds $5,000 USD at any point before the end of 2024, according to the Coinbase price feed.',
      resolution: null,
      resolutionTime: null
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
}

// Mock function to fetch user positions (replace with actual API call)
export async function fetchUserPositions(
  marketId: string, 
  userAddress: Address
): Promise<MarketPosition[]> {
  try {
    // In a real implementation, this would call your API or directly interact with the blockchain
    // For now, we'll return mock data
    return [
      {
        marketId,
        outcome: 'YES',
        shares: '10.5',
        avgPrice: '0.62',
        pnl: '0.315', // (current price - avg price) * shares
        value: '6.825' // current price * shares
      }
    ];
  } catch (error) {
    console.error('Error fetching user positions:', error);
    return [];
  }
} 