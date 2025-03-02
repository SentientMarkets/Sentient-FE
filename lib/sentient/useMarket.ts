import { useState, useEffect } from 'react';
import { Market } from './market';
import { useAccount } from 'wagmi';

interface Position {
  id: string;
  outcome: 'YES' | 'NO';
  shares: string;
  avgPrice: string;
  currentValue: string;
  profit: string;
  profitPercentage: string;
}

interface UseMarketProps {
  marketId: string | undefined;
}

export function useMarket({ marketId }: UseMarketProps) {
  const [market, setMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [userPositions, setUserPositions] = useState<Position[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState<boolean>(true);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [isSelling, setIsSelling] = useState<boolean>(false);
  const [txError, setTxError] = useState<Error | null>(null);
  
  const { isConnected, address } = useAccount();

  // Fetch market data
  useEffect(() => {
    if (!marketId) {
      setIsLoading(false);
      return;
    }

    const fetchMarket = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would call your API or contract
        // For now, we'll simulate loading and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock market data
        const mockMarket: Market = {
          id: marketId,
          address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
          question: 'Will ETH price exceed $5,000 by the end of 2024?',
          endTime: new Date('2024-12-31T23:59:59Z'),
          collateralToken: {
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
            symbol: 'DAI',
            decimals: 18
          },
          virtualLiquidity: '10000',
          yesPrice: '0.65',
          noPrice: '0.35',
          volume: '25000',
          liquidity: '15000',
          createdAt: new Date('2024-01-15T12:00:00Z'),
          creator: '0xabcdef1234567890abcdef1234567890abcdef12' as `0x${string}`,
          category: 'Crypto',
          description: 'This market resolves to YES if the price of Ethereum (ETH) exceeds $5,000 USD at any point before the end of 2024, according to the Coinbase price feed.',
          resolution: null,
          resolutionTime: null
        };
        
        setMarket(mockMarket);
      } catch (err) {
        console.error('Error fetching market:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarket();
  }, [marketId]);

  // Fetch user positions
  useEffect(() => {
    if (!marketId || !isConnected || !address || !market) {
      setIsLoadingPositions(false);
      return;
    }

    const fetchPositions = async () => {
      try {
        setIsLoadingPositions(true);
        
        // In a real implementation, this would call your API or contract
        // For now, we'll simulate loading and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock positions data
        const mockPositions: Position[] = [
          {
            id: '1',
            outcome: 'YES',
            shares: '100',
            avgPrice: '0.60',
            currentValue: (100 * parseFloat(market.yesPrice)).toFixed(2),
            profit: ((100 * parseFloat(market.yesPrice)) - (100 * 0.6)).toFixed(2),
            profitPercentage: (((parseFloat(market.yesPrice) / 0.6) - 1) * 100).toFixed(1)
          }
        ];
        
        setUserPositions(mockPositions);
      } catch (err) {
        console.error('Error fetching positions:', err);
      } finally {
        setIsLoadingPositions(false);
      }
    };
    
    fetchPositions();
  }, [marketId, isConnected, address, market]);

  // Buy shares function
  const buyShares = async (outcome: 'YES' | 'NO', amount: string) => {
    if (!market || !isConnected) return;
    
    try {
      setIsBuying(true);
      setTxError(null);
      
      // In a real implementation, this would call your contract
      console.log(`Buying ${outcome} shares with ${amount} ${market.collateralToken.symbol}`);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh positions after buying
      // This would be handled by listening to events in a real implementation
    } catch (err) {
      console.error('Error buying shares:', err);
      setTxError(err instanceof Error ? err : new Error('Failed to buy shares'));
    } finally {
      setIsBuying(false);
    }
  };

  // Sell shares function
  const sellShares = async (positionId: string, amount: string) => {
    if (!market || !isConnected) return;
    
    try {
      setIsSelling(true);
      setTxError(null);
      
      // In a real implementation, this would call your contract
      console.log(`Selling position ${positionId}, amount: ${amount}`);
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh positions after selling
      // This would be handled by listening to events in a real implementation
    } catch (err) {
      console.error('Error selling shares:', err);
      setTxError(err instanceof Error ? err : new Error('Failed to sell shares'));
    } finally {
      setIsSelling(false);
    }
  };

  return { 
    market, 
    isLoading, 
    error,
    userPositions,
    isLoadingPositions,
    buyShares,
    sellShares,
    isBuying,
    isSelling,
    txError
  };
} 