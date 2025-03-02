'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Market, OutcomeType, calculateExpectedShares, formatPriceAsPercentage } from '@/lib/sentient/market';

interface MarketTradingProps {
  market: Market;
  onBuyShares: (outcome: OutcomeType, amount: string) => Promise<void>;
  isBuying: boolean;
  error?: Error | null;
  isConnected: boolean;
}

export function MarketTrading({
  market,
  onBuyShares,
  isBuying,
  error,
  isConnected
}: MarketTradingProps) {
  const [activeTab, setActiveTab] = useState<OutcomeType>('YES');
  const [amount, setAmount] = useState<string>('');
  const [expectedShares, setExpectedShares] = useState<string>('0');

  // Calculate expected shares when amount or active tab changes
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setExpectedShares('0');
      return;
    }

    const price = activeTab === 'YES' ? market.yesPrice : market.noPrice;
    const shares = calculateExpectedShares(amount, price);
    setExpectedShares(shares);
  }, [amount, activeTab, market.yesPrice, market.noPrice]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleBuyShares = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    await onBuyShares(activeTab, amount);
    setAmount('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trade</CardTitle>
        <CardDescription>Buy shares in this market</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="YES" onValueChange={(value) => setActiveTab(value as OutcomeType)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="YES">
              <div className="flex items-center gap-2">
                <span>YES</span>
                <Badge variant="outline" className="ml-1">
                  {formatPriceAsPercentage(market.yesPrice)}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="NO">
              <div className="flex items-center gap-2">
                <span>NO</span>
                <Badge variant="outline" className="ml-1">
                  {formatPriceAsPercentage(market.noPrice)}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="YES" className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Amount ({market.collateralToken.symbol})</div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Enter amount in ${market.collateralToken.symbol}`}
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={isBuying || !isConnected}
                />
                <Button 
                  onClick={handleBuyShares}
                  disabled={
                    isBuying || 
                    !amount || 
                    parseFloat(amount) <= 0 ||
                    !isConnected
                  }
                >
                  {isBuying ? 'Buying...' : 'Buy YES'}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Expected shares: {expectedShares}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="NO" className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Amount ({market.collateralToken.symbol})</div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Enter amount in ${market.collateralToken.symbol}`}
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={isBuying || !isConnected}
                />
                <Button 
                  onClick={handleBuyShares}
                  disabled={
                    isBuying || 
                    !amount || 
                    parseFloat(amount) <= 0 ||
                    !isConnected
                  }
                >
                  {isBuying ? 'Buying...' : 'Buy NO'}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Expected shares: {expectedShares}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {!isConnected && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm text-center">
            Connect your wallet to start trading
          </div>
        )}
      </CardContent>
    </Card>
  );
} 