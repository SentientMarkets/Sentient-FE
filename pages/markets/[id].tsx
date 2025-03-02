"use client"

import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { MarketInfo } from '@/components/market/MarketInfo';
import { MarketTrading } from '@/components/market/MarketTrading';
import { MarketPositions } from '@/components/market/MarketPositions';
import { useMarket } from '@/lib/sentient/useMarket';
import ClientWrapper from '@/components/wrapper/client-wrapper';

export default function MarketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isConnected } = useAccount();
  
  const {
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
  } = useMarket({
    marketId: id as string
  });

  // Create a loading skeleton for the market detail page
  const loadingSkeleton = (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
            <div className="h-24 bg-muted rounded mb-4"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
          <div className="bg-card rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ClientWrapper fallback={loadingSkeleton}>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Information */}
          <div className="lg:col-span-2">
            <MarketInfo market={market} isLoading={isLoading} />
          </div>

          {/* Trading Interface */}
          <div className="lg:col-span-1 space-y-8">
            {market && (
              <MarketTrading
                market={market}
                onBuyShares={buyShares}
                isBuying={isBuying}
                error={txError}
                isConnected={isConnected}
              />
            )}

            <MarketPositions
              positions={userPositions || []}
              isLoading={isLoadingPositions}
              onSellShares={sellShares}
              isSelling={isSelling}
              error={txError}
            />
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}