'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Market, formatPriceAsPercentage } from '@/lib/sentient/market';

interface Position {
  id: string;
  outcome: 'YES' | 'NO';
  shares: string;
  avgPrice: string;
  currentValue: string;
  profit: string;
  profitPercentage: string;
}

interface MarketPositionsProps {
  positions: Position[];
  isLoading: boolean;
  onSellShares: (positionId: string, amount: string) => Promise<void>;
  isSelling: boolean;
  error: Error | null;
}

export function MarketPositions({ 
  positions, 
  isLoading, 
  onSellShares,
  isSelling,
  error
}: MarketPositionsProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }
  
  if (positions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">You don't have any positions in this market yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleSell = async (position: Position) => {
    await onSellShares(position.id, position.shares);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => (
            <div key={position.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-medium">{position.outcome}</div>
                  <div className="text-sm text-muted-foreground">
                    {position.shares} shares @ {formatPriceAsPercentage(position.avgPrice)}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleSell(position)}
                  disabled={isSelling}
                >
                  {isSelling ? 'Processing...' : 'Sell'}
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Current Value</div>
                  <div>{position.currentValue}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Profit/Loss</div>
                  <div className={parseFloat(position.profit) >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {parseFloat(position.profit) >= 0 ? '+' : ''}{position.profit}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Change</div>
                  <div className={parseFloat(position.profitPercentage) >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {parseFloat(position.profitPercentage) >= 0 ? '+' : ''}{position.profitPercentage}%
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 text-sm text-red-500">
                  {error.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 