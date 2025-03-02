'use client';

import { useState } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MarketPosition, OutcomeType, formatPriceAsPercentage } from '@/lib/sentient/market';

interface MarketPositionsProps {
  positions: MarketPosition[];
  isLoading: boolean;
  onSellShares: (outcome: OutcomeType, shares: string) => Promise<void>;
  isSelling: boolean;
  error?: Error | null;
}

export function MarketPositions({
  positions,
  isLoading,
  onSellShares,
  isSelling,
  error
}: MarketPositionsProps) {
  const [sellAmounts, setSellAmounts] = useState<Record<string, string>>({});

  const handleSellAmountChange = (positionIndex: number, value: string) => {
    setSellAmounts(prev => ({
      ...prev,
      [positionIndex]: value
    }));
  };

  const handleSellShares = async (position: MarketPosition, positionIndex: number) => {
    const amount = sellAmounts[positionIndex] || '';
    if (!amount || parseFloat(amount) <= 0) return;
    
    await onSellShares(position.outcome, amount);
    
    // Clear input after selling
    setSellAmounts(prev => ({
      ...prev,
      [positionIndex]: ''
    }));
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Positions</CardTitle>
          <CardDescription>Your current positions in this market</CardDescription>
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

  if (positions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Positions</CardTitle>
          <CardDescription>You don't have any positions in this market yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            Buy shares to start trading in this market
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Positions</CardTitle>
        <CardDescription>Your current positions in this market</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div key={`${position.marketId}-${position.outcome}-${index}`} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={position.outcome === 'YES' ? "default" : "secondary"}>
                    {position.outcome}
                  </Badge>
                  <span className="font-medium">{position.shares} Shares</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Price: {formatPriceAsPercentage(position.avgPrice)}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Value: </span>
                  <span className="font-medium">{position.value || '0'} {/* Token symbol */}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">P&L: </span>
                  <span className={`font-medium ${
                    parseFloat(position.pnl || '0') > 0 
                      ? 'text-green-600' 
                      : parseFloat(position.pnl || '0') < 0 
                        ? 'text-red-600' 
                        : ''
                  }`}>
                    {parseFloat(position.pnl || '0') > 0 ? '+' : ''}
                    {position.pnl || '0'} {/* Token symbol */}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Amount to sell"
                  value={sellAmounts[index] || ''}
                  onChange={(e) => handleSellAmountChange(index, e.target.value)}
                  min="0"
                  max={position.shares}
                  step="0.01"
                  disabled={isSelling}
                />
                <Button 
                  variant="secondary"
                  onClick={() => handleSellShares(position, index)}
                  disabled={
                    isSelling || 
                    !sellAmounts[index] || 
                    parseFloat(sellAmounts[index]) <= 0 ||
                    parseFloat(sellAmounts[index]) > parseFloat(position.shares)
                  }
                >
                  {isSelling ? 'Selling...' : 'Sell'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 