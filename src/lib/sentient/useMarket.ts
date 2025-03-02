import { useState, useEffect, useCallback } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { Address } from 'wagmi';
import { parseEther } from 'viem';
import { 
  Market, 
  MarketPosition, 
  OutcomeType,
  SENTIENT_MARKET_ABI,
  fetchMarketData,
  fetchUserPositions,
  toTokenAmount,
  calculateExpectedShares
} from './market';

interface UseMarketProps {
  marketId: string;
  marketAddress?: Address;
}

interface UseMarketReturn {
  market: Market | null;
  isLoading: boolean;
  error: Error | null;
  userPositions: MarketPosition[];
  isLoadingPositions: boolean;
  buyShares: (outcome: OutcomeType, amount: string, slippage?: number) => Promise<void>;
  sellShares: (outcome: OutcomeType, shares: string, slippage?: number) => Promise<void>;
  isBuying: boolean;
  isSelling: boolean;
  txHash: `0x${string}` | null;
  txError: Error | null;
}

export function useMarket({ marketId, marketAddress }: UseMarketProps): UseMarketReturn {
  const { address: userAddress, isConnected } = useAccount();
  const [market, setMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [userPositions, setUserPositions] = useState<MarketPosition[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  // Load market data
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMarketData(marketId);
        setMarket(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load market data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketData();
  }, [marketId]);

  // Load user positions when connected and market data is available
  useEffect(() => {
    const loadUserPositions = async () => {
      if (!isConnected || !userAddress || !market) return;
      
      try {
        setIsLoadingPositions(true);
        const positions = await fetchUserPositions(marketId, userAddress);
        setUserPositions(positions);
      } catch (err) {
        console.error('Error loading user positions:', err);
      } finally {
        setIsLoadingPositions(false);
      }
    };

    loadUserPositions();
  }, [marketId, userAddress, isConnected, market]);

  // Contract write for buying YES shares
  const { 
    writeAsync: writeBuyYes,
    isPending: isBuyingYes,
    error: buyYesError,
    data: buyYesTxData
  } = useContractWrite({
    address: market?.address,
    abi: SENTIENT_MARKET_ABI,
    functionName: 'buyYesShares',
    enabled: !!market?.address
  });

  // Contract write for buying NO shares
  const { 
    writeAsync: writeBuyNo,
    isPending: isBuyingNo,
    error: buyNoError,
    data: buyNoTxData
  } = useContractWrite({
    address: market?.address,
    abi: SENTIENT_MARKET_ABI,
    functionName: 'buyNoShares',
    enabled: !!market?.address
  });

  // Contract write for selling YES shares
  const { 
    writeAsync: writeSellYes,
    isPending: isSellingYes,
    error: sellYesError,
    data: sellYesTxData
  } = useContractWrite({
    address: market?.address,
    abi: SENTIENT_MARKET_ABI,
    functionName: 'sellYesShares',
    enabled: !!market?.address
  });

  // Contract write for selling NO shares
  const { 
    writeAsync: writeSellNo,
    isPending: isSellingNo,
    error: sellNoError,
    data: sellNoTxData
  } = useContractWrite({
    address: market?.address,
    abi: SENTIENT_MARKET_ABI,
    functionName: 'sellNoShares',
    enabled: !!market?.address
  });

  // Wait for transaction
  const { isLoading: isWaitingForTx } = useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      // Refresh user positions after successful transaction
      if (isConnected && userAddress && market) {
        fetchUserPositions(marketId, userAddress)
          .then(positions => setUserPositions(positions))
          .catch(err => console.error('Error refreshing positions:', err));
      }
    }
  });

  // Set transaction hash when available
  useEffect(() => {
    const newTxHash = buyYesTxData?.hash || buyNoTxData?.hash || sellYesTxData?.hash || sellNoTxData?.hash;
    if (newTxHash) {
      setTxHash(newTxHash);
    }
  }, [buyYesTxData, buyNoTxData, sellYesTxData, sellNoTxData]);

  // Buy shares function
  const buyShares = useCallback(async (
    outcome: OutcomeType, 
    amount: string, 
    slippage: number = 0.01
  ) => {
    if (!market || !amount) return;
    
    try {
      const amountInWei = toTokenAmount(amount);
      const price = outcome === 'YES' ? market.yesPrice : market.noPrice;
      const expectedShares = calculateExpectedShares(amount, price, slippage);
      const minSharesOut = toTokenAmount(expectedShares);
      
      if (outcome === 'YES') {
        const tx = await writeBuyYes({
          args: [amountInWei, minSharesOut]
        });
        setTxHash(tx.hash);
      } else {
        const tx = await writeBuyNo({
          args: [amountInWei, minSharesOut]
        });
        setTxHash(tx.hash);
      }
    } catch (err) {
      console.error('Error buying shares:', err);
    }
  }, [market, writeBuyYes, writeBuyNo]);

  // Sell shares function
  const sellShares = useCallback(async (
    outcome: OutcomeType, 
    shares: string, 
    slippage: number = 0.01
  ) => {
    if (!market || !shares) return;
    
    try {
      const sharesInWei = toTokenAmount(shares);
      const price = outcome === 'YES' ? market.yesPrice : market.noPrice;
      const expectedAmount = parseFloat(shares) * parseFloat(price) * (1 - slippage);
      const minAmountOut = toTokenAmount(expectedAmount.toString());
      
      if (outcome === 'YES') {
        const tx = await writeSellYes({
          args: [sharesInWei, minAmountOut]
        });
        setTxHash(tx.hash);
      } else {
        const tx = await writeSellNo({
          args: [sharesInWei, minAmountOut]
        });
        setTxHash(tx.hash);
      }
    } catch (err) {
      console.error('Error selling shares:', err);
    }
  }, [market, writeSellYes, writeSellNo]);

  return {
    market,
    isLoading,
    error,
    userPositions,
    isLoadingPositions,
    buyShares,
    sellShares,
    isBuying: isBuyingYes || isBuyingNo || isWaitingForTx,
    isSelling: isSellingYes || isSellingNo,
    txHash,
    txError: buyYesError || buyNoError || sellYesError || sellNoError || null
  };
} 