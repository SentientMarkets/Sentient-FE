import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';

// This would be replaced with actual contract addresses
const MARKET_FACTORY_ADDRESS = '0xA78D58bC587f7d61755142817461FCdAa208E774' as `0x${string}`;
const MODE_TOKEN_ADDRESS = '0xf8865d1d66451518fb9117cb1d0e4b0811a42823' as `0x${string}`;

// Simplified ABI for the Market Factory
const FACTORY_ABI = [
  {
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'endTime', type: 'uint256' },
      { name: 'collateralToken', type: 'address' },
      { name: 'initialLiquidity', type: 'uint256' },
      { name: 'protocolFee', type: 'uint256' },
      { name: 'outcomeDescriptions', type: 'string[]' }
    ],
    name: 'createMarket',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getMarkets',
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// Simplified ABI for the Market contract
const MARKET_ABI = [
  {
    inputs: [],
    name: 'getMarketInfo',
    outputs: [
      { name: 'question', type: 'string' },
      { name: 'endTime', type: 'uint256' },
      { name: 'collateralToken', type: 'address' },
      { name: 'outcome', type: 'uint8' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'outcomeId', type: 'uint256' }],
    name: 'getPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'isYes', type: 'bool' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'buyPosition',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// ERC20 ABI for approvals
const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

export interface Market {
  id: string;
  address: `0x${string}`;
  question: string;
  endTime: bigint;
  collateralToken: `0x${string}`;
  virtualLiquidity: bigint;
  yesPrice?: bigint;
  noPrice?: bigint;
}

export function useSentientMarkets() {
  const { address, isConnected } = useAccount();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { writeContract } = useWriteContract();

  // Fetch all markets
  const fetchMarkets = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual contract calls
      // For now, we'll use mock data
      const mockMarkets: Market[] = [
        { 
          id: "0x2fd57cf9be6a2f570794344dabcf3b894d1379e2b4fbaa218bb95708b0a9579f", 
          address: "0x1234567890123456789012345678901234567890",
          question: "Will ETH reach $3000 by end of Q1 2024?",
          endTime: BigInt(1711929599), // March 31, 2024
          collateralToken: "0xf8865d1d66451518fb9117cb1d0e4b0811a42823",
          virtualLiquidity: BigInt(10000000000000000000), // 10 ETH
          yesPrice: BigInt(500000000000000000), // 0.5 ETH
          noPrice: BigInt(500000000000000000), // 0.5 ETH
        },
        { 
          id: "0x3fd57cf9be6a2f570794344dabcf3b894d1379e2b4fbaa218bb95708b0a9579g", 
          address: "0x2345678901234567890123456789012345678901",
          question: "Will Bitcoin surpass $100,000 by the end of 2024?",
          endTime: BigInt(1735689599), // December 31, 2024
          collateralToken: "0xf8865d1d66451518fb9117cb1d0e4b0811a42823",
          virtualLiquidity: BigInt(20000000000000000000), // 20 ETH
          yesPrice: BigInt(700000000000000000), // 0.7 ETH
          noPrice: BigInt(300000000000000000), // 0.3 ETH
        },
        { 
          id: "0x4fd57cf9be6a2f570794344dabcf3b894d1379e2b4fbaa218bb95708b0a9579h", 
          address: "0x3456789012345678901234567890123456789012",
          question: "Will the US Federal Reserve cut interest rates in Q2 2024?",
          endTime: BigInt(1719791999), // June 30, 2024
          collateralToken: "0xf8865d1d66451518fb9117cb1d0e4b0811a42823",
          virtualLiquidity: BigInt(15000000000000000000), // 15 ETH
          yesPrice: BigInt(400000000000000000), // 0.4 ETH
          noPrice: BigInt(600000000000000000), // 0.6 ETH
        },
      ];
      
      setMarkets(mockMarkets);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast.error('Failed to fetch markets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new market
  const createMarket = useCallback(async (
    question: string,
    endDate: string,
    initialLiquidity: string,
    protocolFee: string,
    description: string = ''
  ) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return null;
    }
    
    try {
      // Convert endDate to timestamp
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
      
      // Convert initialLiquidity to wei
      const liquidityWei = parseUnits(initialLiquidity, 18);
      
      // Convert protocolFee to basis points
      const feeValue = BigInt(Math.floor(parseFloat(protocolFee) * 100));
      
      // First approve MODE tokens for the factory
      await writeContract({
        address: MODE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [MARKET_FACTORY_ADDRESS, liquidityWei]
      });
      
      toast.success('Token approval successful');
      
      // Create the market
      const hash = await writeContract({
        address: MARKET_FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'createMarket',
        args: [
          question,
          BigInt(endTimestamp),
          MODE_TOKEN_ADDRESS,
          liquidityWei,
          feeValue,
          ['Yes', 'No']
        ]
      });
      
      toast.success('Market creation transaction submitted');
      return hash;
    } catch (error) {
      console.error('Error creating market:', error);
      toast.error('Failed to create market');
      return null;
    }
  }, [isConnected, writeContract]);

  // Buy a position in a market
  const buyPosition = useCallback(async (
    marketAddress: `0x${string}`,
    isYes: boolean,
    amount: string
  ) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return null;
    }
    
    try {
      // Convert amount to wei
      const amountWei = parseUnits(amount, 18);
      
      // First approve MODE tokens for the market
      await writeContract({
        address: MODE_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [marketAddress, amountWei]
      });
      
      toast.success('Token approval successful');
      
      // Buy the position
      const hash = await writeContract({
        address: marketAddress,
        abi: MARKET_ABI,
        functionName: 'buyPosition',
        args: [isYes, amountWei]
      });
      
      toast.success('Position purchase transaction submitted');
      return hash;
    } catch (error) {
      console.error('Error buying position:', error);
      toast.error('Failed to buy position');
      return null;
    }
  }, [isConnected, writeContract]);

  // Get a specific market by ID
  const getMarket = useCallback(async (marketId: string): Promise<Market | null> => {
    try {
      // This would be replaced with actual contract calls
      // For now, we'll use mock data
      const market = markets.find(m => m.id === marketId);
      
      if (!market) {
        return null;
      }
      
      return market;
    } catch (error) {
      console.error('Error fetching market:', error);
      return null;
    }
  }, [markets]);

  // Load markets on component mount
  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  return {
    markets,
    isLoading,
    createMarket,
    buyPosition,
    getMarket,
    fetchMarkets
  };
} 