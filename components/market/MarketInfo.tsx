'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Market, formatPriceAsPercentage } from '@/lib/sentient/market';
import ClientWrapper from '../wrapper/client-wrapper';

interface MarketInfoProps {
  market: Market | null;
  isLoading: boolean;
}

export function MarketInfo({ market, isLoading }: MarketInfoProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!market) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Market Not Found</CardTitle>
          <CardDescription>The requested market could not be found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            Please check the market ID and try again
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ClientWrapper>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-2">{market.question}</CardTitle>
              <CardDescription>
                {market.category && (
                  <Badge variant="outline" className="mr-2">
                    {market.category}
                  </Badge>
                )}
                <span className="text-sm">
                  Ends: {new Date(market.endTime).toLocaleString()} ({getTimeRemaining(market.endTime)})
                </span>
              </CardDescription>
            </div>
            {market.resolution && (
              <Badge variant={market.resolution === 'YES' ? 'default' : 'secondary'} className="ml-2">
                Resolved: {market.resolution}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Market description */}
            {market.description && (
              <div className="text-sm">
                <h3 className="font-medium mb-1">Description</h3>
                <p className="text-muted-foreground">{market.description}</p>
              </div>
            )}
            
            {/* Market stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">YES Price</div>
                <div className="font-medium">{formatPriceAsPercentage(market.yesPrice)}</div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">NO Price</div>
                <div className="font-medium">{formatPriceAsPercentage(market.noPrice)}</div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Liquidity</div>
                <div className="font-medium">{market.liquidity || '0'} {market.collateralToken.symbol}</div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="text-xs text-muted-foreground mb-1">Volume</div>
                <div className="font-medium">{market.volume || '0'} {market.collateralToken.symbol}</div>
              </div>
            </div>
            
            {/* Market creator */}
            {market.creator && (
              <div className="text-sm">
                <span className="text-muted-foreground">Created by: </span>
                <span className="font-mono">{`${market.creator.substring(0, 6)}...${market.creator.substring(market.creator.length - 4)}`}</span>
                {market.createdAt && (
                  <span className="text-muted-foreground ml-2">
                    on {new Date(market.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ClientWrapper>
  );
}

// Calculate time remaining
function getTimeRemaining(endTime: Date) {
  const now = new Date();
  const timeRemaining = endTime.getTime() - now.getTime();
  
  if (timeRemaining <= 0) {
    return 'Ended';
  }
  
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
}